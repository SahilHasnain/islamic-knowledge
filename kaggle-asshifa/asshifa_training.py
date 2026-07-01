#!/usr/bin/env python3
"""
Kaggle Kernel: Asshifa AI Model Training
Train on Ash-Shifa by Qadi Iyad (rahimahullah) using Unsloth on a free T4/P100 GPU.
"""
import json, os, sys, subprocess, shutil
from pathlib import Path

# ---------------------------------------------------------------------------
# 0. Setup paths — Kaggle working directory
# ---------------------------------------------------------------------------
WORK = Path("/kaggle/working")
os.chdir(WORK)

# ---------------------------------------------------------------------------
# 1. Install Unsloth (compatible with Kaggle's torch)
# ---------------------------------------------------------------------------
print("=" * 60)
print("Installing Unsloth...")
print("=" * 60)
subprocess.run(
    [sys.executable, "-m", "pip", "install", "--upgrade", "--quiet",
     "unsloth", "transformers", "datasets", "trl", "accelerate", "bitsandbytes"],
    check=True,
)
print("Done.\n")

# ---------------------------------------------------------------------------
# 2. Clone the repo (ai-model branch)
# ---------------------------------------------------------------------------
print("=" * 60)
print("Cloning islamic-knowledge repo...")
print("=" * 60)
REPO = "https://github.com/sahilhasnain/islamic-knowledge"
if not (WORK / "islamic-knowledge").exists():
    subprocess.run(
        ["git", "clone", "--branch", "ai-model", "--depth", "1", REPO,
         str(WORK / "islamic-knowledge")],
        check=True,
    )
os.chdir(WORK / "islamic-knowledge")
print("Done.\n")

# ---------------------------------------------------------------------------
# 3. Prepare corpus
# ---------------------------------------------------------------------------
print("=" * 60)
print("Preparing corpus...")
print("=" * 60)
sys.path.insert(0, str(WORK / "islamic-knowledge"))
spec = __import__("importlib.util").util.spec_from_file_location(
    "prepare_corpus", "ai-model/prepare_corpus.py"
)
mod = __import__("importlib.util").util.module_from_spec(spec)
spec.loader.exec_module(mod)
mod.build_corpus()

# Verify files
CORPUS = Path("ai-model/data/corpus.txt")
ADAB = Path("ai-model/data/adab-examples.jsonl")
print(f"Corpus exists: {CORPUS.exists()} ({CORPUS.stat().st_size:,} bytes)")
print(f"Adab exists: {ADAB.exists()} ({ADAB.stat().st_size:,} bytes)")
print("Done.\n")

# ---------------------------------------------------------------------------
# 4. Constants (inlined to avoid import issues with hyphen in dir name)
# ---------------------------------------------------------------------------
MODELS = {
    "3b": {"name": "unsloth/Llama-3.2-3B-Instruct-bnb-4bit", "max_seq": 8192},
    "7b": {"name": "unsloth/Qwen2.5-7B-Instruct-bnb-4bit",  "max_seq": 8192},
}
MODEL_SIZE = "7b"  # change to "3b" if OOM
model_cfg = MODELS[MODEL_SIZE]

print(f"Model: {model_cfg['name']}")
print(f"Max seq length: {model_cfg['max_seq']}")
print(f"Model size: {MODEL_SIZE}")

# ---------------------------------------------------------------------------
# 5. Load model & tokenizer
# ---------------------------------------------------------------------------
from unsloth import FastLanguageModel, is_bfloat16_supported
from unsloth.chat_templates import get_chat_template, train_on_responses_only
from datasets import Dataset
from transformers import TrainingArguments
from trl import SFTTrainer
import torch

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=model_cfg["name"],
    max_seq_length=model_cfg["max_seq"],
    dtype=None,
    load_in_4bit=True,
)
tokenizer = get_chat_template(
    tokenizer,
    chat_template="qwen-2.5" if "Qwen" in model_cfg["name"] else "llama-3",
)

# Arabic honorific tokens
arabic_tokens = [
    "\ufdfa", "عليه السلام", "عز وجل", "صلى الله عليه وسلم",
    "رضي الله عنه", "رضي الله عنها", "رحمة الله تعالى عليه",
    "سبحانه وتعالى",
]
added = 0
for t in arabic_tokens:
    if t not in tokenizer.get_vocab():
        tokenizer.add_tokens([t])
        added += 1
if added:
    model.resize_token_embeddings(len(tokenizer))
    print(f"Added {added} Arabic honorific tokens")

# LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=42,
)

# ---------------------------------------------------------------------------
# 6. Phase 1: Continued pretraining on Shifa corpus
# ---------------------------------------------------------------------------
print("=" * 60)
print("Phase 1: Continued pretraining on Shifa Shareef corpus")
print("=" * 60)

with open(CORPUS, "r", encoding="utf-8") as f:
    raw_text = f.read()

# Chunk corpus
chunk_size = model_cfg["max_seq"] * 3
paragraphs = raw_text.split("\n\n")
chunks, current, current_len = [], [], 0
for para in paragraphs:
    para = para.strip()
    if not para:
        continue
    if current_len + len(para) > chunk_size and current:
        chunks.append("\n\n".join(current))
        current, current_len = [], 0
    current.append(para)
    current_len += len(para)
if current:
    chunks.append("\n\n".join(current))

corpus_dataset = Dataset.from_list([{"text": c} for c in chunks])
print(f"Corpus: {len(chunks)} chunks, {len(raw_text):,} chars")

corpus_args = TrainingArguments(
    output_dir="/kaggle/working/phase1",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    warmup_steps=20,
    num_train_epochs=3.0,
    learning_rate=2e-4,
    fp16=not is_bfloat16_supported(),
    bf16=is_bfloat16_supported(),
    logging_steps=10,
    save_strategy="epoch",
    report_to="none",
    ddp_find_unused_parameters=False,
    optim="adamw_8bit",
    weight_decay=0.01,
    lr_scheduler_type="cosine",
    seed=42,
)

trainer_pt = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    args=corpus_args,
    train_dataset=corpus_dataset,
    dataset_text_field="text",
    max_seq_length=model_cfg["max_seq"],
    dataset_num_proc=2,
    packing=True,
)
trainer_pt.train()
print("Phase 1 complete.\n")

# ---------------------------------------------------------------------------
# 7. Phase 2: Adab instruction tuning
# ---------------------------------------------------------------------------
print("=" * 60)
print("Phase 2: Adab instruction tuning")
print("=" * 60)

if ADAB.exists():
    with open(ADAB, "r") as f:
        adab_data = [json.loads(line) for line in f if line.strip()]
    print(f"Loaded {len(adab_data)} adab examples")

    def format_adab(example):
        return {"conversations": [
            {"from": "human", "value": example["instruction"]},
            {"from": "gpt", "value": example["response"]},
        ]}

    adab_dataset = Dataset.from_list([format_adab(d) for d in adab_data])
    adab_dataset = adab_dataset.map(
        lambda x: {"text": tokenizer.apply_chat_template(
            x["conversations"], tokenize=False)}
    )

    adab_args = TrainingArguments(
        output_dir="/kaggle/working/phase2",
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        num_train_epochs=2.0,
        learning_rate=1e-4,
        fp16=not is_bfloat16_supported(),
        bf16=is_bfloat16_supported(),
        logging_steps=5,
        save_strategy="epoch",
        report_to="none",
        ddp_find_unused_parameters=False,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="cosine",
        seed=42,
    )

    trainer_sft = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        args=adab_args,
        train_dataset=adab_dataset,
        dataset_text_field="text",
        max_seq_length=model_cfg["max_seq"],
        dataset_num_proc=2,
        packing=False,
    )

    # Mask user prompts
    if "llama-3" in model_cfg["name"]:
        trainer_sft = train_on_responses_only(
            trainer_sft,
            instruction_part="<|start_header_id|>user<|end_header_id|>\n\n",
            response_part="<|start_header_id|>assistant<|end_header_id|>\n\n",
        )
    elif "qwen" in model_cfg["name"]:
        trainer_sft = train_on_responses_only(
            trainer_sft,
            instruction_part="<|im_start|>user\n",
            response_part="<|im_start|>assistant\n",
        )

    trainer_sft.train()
    print("Phase 2 complete.\n")
else:
    print(f"WARNING: {ADAB} not found, skipping phase 2")

# ---------------------------------------------------------------------------
# 8. Save & export GGUF
# ---------------------------------------------------------------------------
print("=" * 60)
print("Saving model and exporting GGUF")
print("=" * 60)

OUTPUT_DIR = Path("/kaggle/working/asshifa-output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Save LoRA adapter
model.save_pretrained(str(OUTPUT_DIR / "lora"))
tokenizer.save_pretrained(str(OUTPUT_DIR / "lora"))
print(f"LoRA saved: {OUTPUT_DIR / 'lora'}")

# Export to GGUF
model.save_pretrained_gguf(
    str(OUTPUT_DIR / "gguf"),
    tokenizer,
    quantization_method="q4_k_m",
)
print(f"GGUF saved: {OUTPUT_DIR / 'gguf'}")

# Package for easy download
shutil.make_archive("/kaggle/working/asshifa-model", "zip", str(OUTPUT_DIR))
print(f"Archive: /kaggle/working/asshifa-model.zip")

# List output
print("\nOutput files:")
for f in Path("/kaggle/working").rglob("*"):
    if f.is_file() and f.stat().st_size > 1000:
        print(f"  {f.relative_to('/kaggle/working')}  ({f.stat().st_size / 1e6:.1f} MB)")

print("\n" + "=" * 60)
print("TRAINING COMPLETE")
print("=" * 60)
print("Download the output from Kaggle:")
print("  kaggle kernels output sahilhasnain/asshifa-training -p ./asshifa-output")
print("Then on your machine:")
print("  unzip asshifa-output/asshifa-model.zip -d asshifa-model")
print("  ollama create asshifa -f asshifa-model/gguf/Modelfile")
print("  ollama run asshifa")
