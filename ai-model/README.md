# Asshifa AI Model

Continued pretraining + instruction tuning on *Ash-Shifa* by Qadi Iyad (رحمة الله تعالى عليه).

## Overview

Two-phase training pipeline:

1. **Phase 1 — Continued Pretraining**: The base LLM learns the style, terminology, and knowledge of *Ash-Shifa* via next-token prediction on the raw corpus.

2. **Phase 2 — Adab Instruction Tuning**: The model is fine-tuned on scholarly Q&A pairs that teach the etiquette (*adab*) of discussing the Prophet (صلى الله عليه وسلم).

## Files

| File | Purpose |
|---|---|
| `prepare_corpus.py` | Extracts clean text from manuscript markdown files; run first |
| `train.py` | Orchestrates both training phases and exports GGUF |
| `data/corpus.txt` | Extracted training corpus (~71K words) |
| `data/adab-examples.jsonl` | 20+ instruction-response pairs (ShareGPT format) |
| `requirements.txt` | Python dependencies |

## Usage

```bash
# 1. (Optional) Re-extract corpus
python prepare_corpus.py

# 2. Train (default: Qwen-2.5-7B)
python train.py

# Alternative: smaller/faster model
python train.py --model 3b

# Skip full-finetune phase (LoRA only)
python train.py --no-fft

# 3. Use with Ollama
ollama create asshifa -f output/gguf/Modelfile
ollama run asshifa
```

## Requirements

- GPU with ≥12 GB VRAM (for 3B model) or ≥16 GB (for 7B/8B)
- CUDA-capable GPU
- Python 3.10+
- Dependencies installed: `pip install -r requirements.txt`

## Notes

- Arabic honorific tokens (ﷺ, عليه السلام, etc.) are added to the tokenizer so they're treated as single tokens.
- QLoRA (4-bit quantized LoRA) keeps memory usage manageable.
- GGUF export uses q4_k_m quantization for efficient inference.
