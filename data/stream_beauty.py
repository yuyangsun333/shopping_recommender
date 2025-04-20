# stream_beauty.py
import json
import os
from datasets import load_dataset

TARGET_ROWS = 100_000

# Output file
os.makedirs("data", exist_ok=True)
out_path = "cleaned_beauty.json"

# Load from Huggingface (only stream - not full download)
dataset = load_dataset(
    "McAuley-Lab/Amazon-Reviews-2023",
    "raw_review_All_Beauty",
    split="full",
    streaming=True,
    trust_remote_code=True
)

# Stream and save
count = 0
with open(out_path, "w") as f:
    for example in dataset:
        if example["user_id"] and example["parent_asin"] and example["rating"]:
            entry = {
                "user_id": example["user_id"],
                "product_id": example["parent_asin"],
                "rating": float(example["rating"])
            }
            f.write(json.dumps(entry) + "\n")
            count += 1
            if count >= TARGET_ROWS:
                break

print(f"Saved {count:,} entries to {out_path}")
