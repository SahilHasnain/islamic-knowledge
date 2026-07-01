#!/usr/bin/env python3
"""
Phase 1: Continued pretraining on Shifa Shareef English text
Phase 2: Instruction tuning with scholarly adab

Usage:
  python train.py                          # default: 7B model
  python train.py --model 3b              # 3B model (faster/less RAM)
  python train.py --model 8b              # 8B model
  python train.py --no-fft                # LoRA only (no full-finetune stage)
"""

import argparse
import json
import math
import os
import sys
from pathlib import Path

import torch
from datasets import Dataset
from transformers import TrainingArguments
from unsloth import (
    FastLanguageModel,
    is_bfloat16_supported,
)
from unsloth.chat_templates import get_chat_template, train_on_responses_only
from trl import SFTTrainer

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent
CORPUS_PATH = ROOT / "data" / "corpus.txt"
ADAB_PATH = ROOT / "data" / "adab-examples.jsonl"
OUTPUT_DIR = ROOT / "output"

# ---------------------------------------------------------------------------
# Model configs
# ---------------------------------------------------------------------------
MODELS = {
    "3b": {
        "name": "unsloth/Llama-3.2-3B-Instruct-bnb-4bit",
        "max_seq": 8192,
    },
    "7b": {
        "name": "unsloth/Qwen2.5-7B-Instruct-bnb-4bit",
        "max_seq": 8192,
    },
    "8b": {
        "name": "unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit",
        "max_seq": 8192,
    },
}

# ---------------------------------------------------------------------------
# Arg parsing
# ---------------------------------------------------------------------------
parser = argparse.ArgumentParser()
parser.add_argument("--model", choices=list(MODELS), default="7b")
parser.add_argument("--no-fft", action="store_true", help="Skip full-finetune stage")
parser.add_argument("--corpus-epochs", type=float, default=3.0)
parser.add_argument("--adab-epochs", type=float, default=2.0)
parser.add_argument("--lr", type=float, default=2e-4)
parser.add_argument("--batch-size", type=int, default=2)
parser.add_argument("--grad-accum", type=int, default=4)
parser.add_argument("--output", type=str, default=str(OUTPUT_DIR))
args = parser.parse_args()

model_cfg = MODELS[args.model]

# ---------------------------------------------------------------------------
# Step 0: Load base model
# ---------------------------------------------------------------------------
print(f"Loading {model_cfg['name']} ...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=model_cfg["name"],
    max_seq_length=model_cfg["max_seq"],
    dtype=None,  # auto-detect
    load_in_4bit=True,
)
tokenizer = get_chat_template(tokenizer, chat_template="qwen-2.5" if "Qwen" in model_cfg["name"] else "llama-3")

# Add Arabic honorific tokens to vocabulary so they're not split weirdly
arabic_tokens = ["ﷺ", "عليه السلام", "عز وجل", "صلى الله عليه وسلم",
                 "رضي الله عنه", "رضي الله عنها", "رحمة الله تعالى عليه",
                 "سبحانه وتعالى"]
added = 0
for t in arabic_tokens:
    if t not in tokenizer.get_vocab():
        tokenizer.add_tokens([t])
        added += 1
if added:
    model.resize_token_embeddings(len(tokenizer))
    print(f"Added {added} Arabic honorific tokens to vocabulary")

# Enable LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj",
    ],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=42,
    use_rslora=False,
    loftq_config=None,
)

# ---------------------------------------------------------------------------
# Step 1: Continued pretraining on Shifa Shareef
# ---------------------------------------------------------------------------
print("=" * 60)
print("Phase 1: Continued pretraining on Shifa Shareef corpus")
print("=" * 60)

with open(CORPUS_PATH, "r", encoding="utf-8") as f:
    raw_text = f.read()

# Split corpus into chunks that fit within max_seq_length
# Approximate: 1 token ≈ 4 chars for English
chunk_size = model_cfg["max_seq"] * 3  # char estimate
paragraphs = raw_text.split("\n\n")
chunks = []
current = []
current_len = 0
for para in paragraphs:
    para = para.strip()
    if not para:
        continue
    if current_len + len(para) > chunk_size and current:
        chunks.append("\n\n".join(current))
        current = []
        current_len = 0
    current.append(para)
    current_len += len(para)
if current:
    chunks.append("\n\n".join(current))

corpus_dataset = Dataset.from_list([{"text": c} for c in chunks])
print(f"Corpus: {len(chunks)} chunks, {len(raw_text):,} chars total")

corpus_args = TrainingArguments(
    output_dir=str(OUTPUT_DIR / "phase1"),
    per_device_train_batch_size=args.batch_size,
    gradient_accumulation_steps=args.grad_accum,
    warmup_steps=20,
    num_train_epochs=args.corpus_epochs,
    learning_rate=args.lr,
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
    packing=True,  # pack multiple chunks into one sequence for efficiency
)

# Ensure we train on ALL tokens, not just responses
trainer_pt.train_on_responses_only = False

trainer_pt.train()

# ---------------------------------------------------------------------------
# Step 2: Instruction tuning with adab
# ---------------------------------------------------------------------------
print("=" * 60)
print("Phase 2: Instruction tuning with adab")
print("=" * 60)

if ADAB_PATH.exists():
    with open(ADAB_PATH, "r") as f:
        adab_data = [json.loads(line) for line in f if line.strip()]
    print(f"Loaded {len(adab_data)} adab examples")

    # Convert to ShareGPT format expected by Unsloth
    def format_adab(example):
        return {
            "conversations": [
                {"from": "human", "value": example["instruction"]},
                {"from": "gpt", "value": example["response"]},
            ]
        }

    adab_dataset = Dataset.from_list([format_adab(d) for d in adab_data])
    adab_dataset = adab_dataset.map(lambda x: tokenizer.apply_chat_template(x["conversations"], tokenize=False))

    adab_args = TrainingArguments(
        output_dir=str(OUTPUT_DIR / "phase2"),
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        warmup_steps=5,
        num_train_epochs=args.adab_epochs,
        learning_rate=args.lr / 2,
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
        dataset_text_field="conversations",
        max_seq_length=model_cfg["max_seq"],
        dataset_num_proc=2,
        packing=False,
    )

    # Only train on assistant responses (preserve system prompt capability)
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
else:
    print(f"WARNING: {ADAB_PATH} not found, skipping phase 2", file=sys.stderr)

# ---------------------------------------------------------------------------
# Step 3: Save final model
# ---------------------------------------------------------------------------
print("=" * 60)
print("Saving model")
print("=" * 60)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Save LoRA adapter
model.save_pretrained(str(OUTPUT_DIR / "lora"))
tokenizer.save_pretrained(str(OUTPUT_DIR / "lora"))
print(f"LoRA adapter saved to {OUTPUT_DIR / 'lora'}")

# Save merged 16-bit model (can be converted to GGUF later)
model.save_pretrained_merged(str(OUTPUT_DIR / "merged"), tokenizer, save_method="merged_16bit")
print(f"Merged model saved to {OUTPUT_DIR / 'merged'}")

# Export to GGUF for Ollama
print("Exporting to GGUF (this may take a while)...")
model.save_pretrained_gguf(
    str(OUTPUT_DIR / "gguf"),
    tokenizer,
    quantization_method="q4_k_m",
)
print(f"GGUF model saved to {OUTPUT_DIR / 'gguf'}")
print()
print("To use with Ollama:")
print(f"  ollama create asshifa -f {OUTPUT_DIR / 'gguf' / 'Modelfile'}")
print("  ollama run asshifa")
