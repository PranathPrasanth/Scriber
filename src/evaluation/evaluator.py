import json
from pathlib import Path

REPORT_DIR = Path("reports")
REPORT_DIR.mkdir(exist_ok=True)

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

TOTAL_BILLS = len(list(GROUND_TRUTH_DIR.glob("*.json")))


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


def log(message):

    print(message)
    print(message, file=report)


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

    log("")
    log("=" * 60)
    log(model_name)
    log("=" * 60)

    overall_correct = 0

    for field in FIELDS:

        accuracy = (
            totals[field] / total_bills * 100
            if total_bills
            else 0
        )

        overall_correct += totals[field]

        log(f"{field:15s}: {accuracy:.2f}%")

    overall = (
        overall_correct / (len(FIELDS) * total_bills) * 100
        if total_bills
        else 0
    )

    success_rate = (
        total_bills / TOTAL_BILLS * 100
        if TOTAL_BILLS
        else 0
    )

    log("-" * 60)
    log(f"Overall Accuracy : {overall:.2f}%")
    log(f"Bills Evaluated  : {total_bills}/{TOTAL_BILLS}")
    log(f"Success Rate     : {success_rate:.2f}%")


def main():

    global report

    report = open(
        REPORT_DIR / "evaluation.txt",
        "w",
        encoding="utf-8",
    )

    for model, folder in OUTPUTS.items():
        evaluate_model(model, folder)

    report.close()

    print("\nEvaluation report saved to reports/evaluation.txt")


if __name__ == "__main__":
    main()