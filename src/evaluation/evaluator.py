import json
from pathlib import Path

GROUND_TRUTH_DIR = Path("ground_truth")

OUTPUTS = {
    "Gemini": Path("outputs/gemini"),
    "Gemma": Path("outputs/gemma"),
    "Nemotron": Path("outputs/nemotron"),
}

FIELDS = [
    "vendor",
    "bill_number",
    "date",
    "amount",
    "currency",
    "gst",
]


def normalize(value):

    if value is None:
        return None

    if isinstance(value, float):
        return round(value, 2)

    return str(value).strip().lower()


def compare(gt, pred):

    scores = {}

    for field in FIELDS:

        gt_val = normalize(gt.get(field))
        pred_val = normalize(pred.get(field))

        scores[field] = int(gt_val == pred_val)

    return scores


def evaluate_model(model_name, output_dir):

    totals = {field: 0 for field in FIELDS}

    total_bills = 0

    for gt_file in sorted(GROUND_TRUTH_DIR.glob("*.json")):

        pred_file = output_dir / gt_file.name

        if not pred_file.exists():
            continue

        with open(gt_file, encoding="utf-8") as f:
            gt = json.load(f)

        with open(pred_file, encoding="utf-8") as f:
            pred = json.load(f)

        result = compare(gt, pred)

        for field in FIELDS:
            totals[field] += result[field]

        total_bills += 1

    print("\n" + "=" * 60)
    print(model_name)
    print("=" * 60)

    overall_correct = 0

    for field in FIELDS:

        accuracy = totals[field] / total_bills * 100

        overall_correct += totals[field]

        print(f"{field:15s}: {accuracy:.2f}%")

    overall = overall_correct / (len(FIELDS) * total_bills) * 100

    print("-" * 60)
    print(f"Overall Accuracy : {overall:.2f}%")
    print(f"Bills Evaluated  : {total_bills}")


def main():

    for model, folder in OUTPUTS.items():
        evaluate_model(model, folder)


if __name__ == "__main__":
    main()