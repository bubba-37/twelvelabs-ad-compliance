"""Step 9a: full pipeline for every ingested clip -> results/<clip>.json

Usage:
  python src/run_all.py            # reuse cached Pegasus output if present
  python src/run_all.py --fresh    # re-run Pegasus for every clip
  python src/run_all.py 08_medical_claim.mp4   # one clip
"""
import hashlib
import json
import sys
from datetime import datetime, timezone

from analyze import PROMPT_VERSION, analyze
from corroborate import corroborate, marengo_relevance
from rules import decide
from tl_client import (
    INDEX_MODEL,
    PEGASUS_MODEL,
    POLICY_PATH,
    RESULTS_DIR,
    VIEWER_DIR,
    load_ids,
    load_policy,
)

args = [a for a in sys.argv[1:] if not a.startswith("--")]
fresh = "--fresh" in sys.argv

policy = load_policy()
policy_hash = hashlib.sha256(POLICY_PATH.read_bytes()).hexdigest()[:12]
ids = load_ids()
clips = args or sorted(ids)

for name in clips:
    entry = ids[name]
    stem = name.rsplit(".", 1)[0]
    raw_path = RESULTS_DIR / f"{stem}.pegasus.json"
    out_path = RESULTS_DIR / f"{stem}.json"
    print(f"\n== {name}")

    if raw_path.exists() and not fresh:
        report = json.loads(raw_path.read_text())
        print("  pegasus: cached")
    else:
        report = analyze(entry["asset_id"], policy)
        raw_path.write_text(json.dumps(report, indent=2))
        print("  pegasus: done")

    report["marengo_relevance"] = marengo_relevance(entry, policy)
    report["findings"] = [corroborate(f, entry, policy) for f in report["findings"]]
    decision, reasons = decide(report, policy)

    result = {
        "file": name,
        "decision": decision,
        "reasons": reasons,
        "description": report["description"],
        "relevance": report["relevance"],
        "marengo_relevance": report["marengo_relevance"],
        "findings": report["findings"],
        "checks": report.get("_checks", {}),
        "audit": {
            "asset_id": entry["asset_id"],
            "analysis_model": PEGASUS_MODEL,
            "index_model": INDEX_MODEL,
            "prompt_version": PROMPT_VERSION,
            "policy_version": policy.get("version"),
            "policy_sha256": policy_hash,
            "run_at": datetime.now(timezone.utc).isoformat(),
        },
    }
    out_path.write_text(json.dumps(result, indent=2, ensure_ascii=False))
    print(f"  {decision}: " + " | ".join(reasons))

# Browsers block loading local JSON from a file:// page, so hand the viewer its data
# as a plain JS file instead. Rebuilt from every result on disk (not just the clips
# processed this run), so re-running one clip still leaves the viewer showing all of them.
all_results = []
for name in sorted(ids):
    stem = name.rsplit(".", 1)[0]
    result_path = RESULTS_DIR / f"{stem}.json"
    if result_path.exists():
        all_results.append(json.loads(result_path.read_text()))

VIEWER_DIR.mkdir(exist_ok=True)
(VIEWER_DIR / "results.js").write_text(
    "const RESULTS = " + json.dumps(all_results, indent=2, ensure_ascii=False) + ";\n"
)
print(f"\nwrote viewer/results.js ({len(all_results)} clips)")
