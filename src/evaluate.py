"""Step 9b: compare results against manifest.csv ground truth -> results/eval.md

Manifest 'violations' format: category:start-end;category:start-end  (seconds)
"""
import csv
import json
from collections import Counter

from tl_client import MANIFEST_PATH, RESULTS_DIR, load_policy

DECISIONS = ["APPROVE", "REVIEW", "BLOCK"]
tol = load_policy()["thresholds"]["corroboration_tolerance_sec"]


def parse_violations(s):
    out = []
    for part in filter(None, (p.strip() for p in (s or "").split(";"))):
        cat, _, rng = part.partition(":")
        try:
            start, end = (float(x) for x in rng.split("-"))
        except ValueError:
            continue  # placeholder like START-END not filled in yet
        out.append((cat.strip(), start, end))
    return out


rows, confusion, misses = [], Counter(), []
planted = caught = 0
ts_errors, rel_correct, rel_total = [], 0, 0

for m in csv.DictReader(MANIFEST_PATH.open()):
    stem = m["file"].rsplit(".", 1)[0]
    path = RESULTS_DIR / f"{stem}.json"
    if not path.exists():
        continue
    r = json.loads(path.read_text())
    exp, got = m["expected_decision"].strip(), r["decision"]
    confusion[(exp, got)] += 1

    if m.get("expected_relevance"):
        rel_total += 1
        rel_correct += m["expected_relevance"].strip() == r["relevance"].get("label")

    found = []
    for cat, s, e in parse_violations(m["violations"]):
        planted += 1
        match = [f for f in r["findings"]
                 if f["category"] == cat and f["start_sec"] - tol <= e and f["end_sec"] + tol >= s]
        if match:
            caught += 1
            ts_errors.append(abs(match[0]["start_sec"] - s))
            found.append(f"{cat} caught")
        else:
            found.append(f"{cat} MISSED")

    ok = exp == got
    rows.append(f"| {m['file']} | {exp} | {got} | {'yes' if ok else '**no**'} | "
                f"{m.get('expected_relevance', '')} / {r['relevance'].get('label')} | {', '.join(found)} |")
    if not ok:
        misses.append(f"- **{m['file']}**: expected {exp}, got {got}. Reasons: " + "; ".join(r["reasons"]))

n = sum(confusion.values())
correct = sum(v for (e, g), v in confusion.items() if e == g)
lines = [
    "# Evaluation",
    "",
    f"Clips evaluated: {n}  ",
    f"Decision accuracy: {correct}/{n}" + (f" ({correct / n:.0%})" if n else ""),
    f"Relevance label accuracy: {rel_correct}/{rel_total}",
    f"Planted violations caught: {caught}/{planted}",
    (f"Mean timestamp error on caught violations: {sum(ts_errors) / len(ts_errors):.1f}s"
     if ts_errors else "Mean timestamp error: n/a"),
    "",
    "## Per clip",
    "",
    "| Clip | Expected | Got | Match | Relevance (exp / got) | Violations |",
    "|---|---|---|---|---|---|",
    *rows,
    "",
    "## Confusion matrix (rows = expected, columns = predicted)",
    "",
    "| | " + " | ".join(DECISIONS) + " |",
    "|---|" + "---|" * len(DECISIONS),
    *[f"| **{e}** | " + " | ".join(str(confusion[(e, g)]) for g in DECISIONS) + " |" for e in DECISIONS],
    "",
    "## Misses to explain",
    "",
    *(misses or ["None."]),
    "",
    "_Small hand-built test set: a smoke test, not a benchmark. A real POC would use "
    "hundreds of customer-labeled videos._",
]
(RESULTS_DIR / "eval.md").write_text("\n".join(lines))
print("\n".join(lines))
