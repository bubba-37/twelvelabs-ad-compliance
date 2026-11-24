"""Step 3: upload each clip as an asset (for Pegasus) and index it (for Marengo).

Usage: python src/ingest.py
Skips clips already in results/ids.json and clips not yet in clips/.
"""
import csv

from tl_client import CLIPS_DIR, INDEX_ID, MANIFEST_PATH, client, load_ids, save_ids, wait_ready

if not INDEX_ID:
    raise SystemExit("Set INDEX_ID in .env first (run src/setup_index.py).")

ids = load_ids()
for row in csv.DictReader(MANIFEST_PATH.open()):
    name = row["file"]
    path = CLIPS_DIR / name
    if name in ids:
        print(f"skip (already ingested): {name}")
        continue
    if not path.exists():
        print(f"skip (file not found): {path}")
        continue

    print(f"uploading {name}")
    with path.open("rb") as f:
        asset = client.assets.create(method="direct", file=f)
    wait_ready(lambda: client.assets.retrieve(asset.id), f"asset {name}")

    ia = client.indexes.indexed_assets.create(INDEX_ID, asset_id=asset.id)
    wait_ready(lambda: client.indexes.indexed_assets.retrieve(INDEX_ID, ia.id), f"index {name}")

    ids[name] = {"asset_id": asset.id, "indexed_asset_id": ia.id}
    save_ids(ids)  # save after each clip so a crash doesn't lose progress
    print(f"ready: {name}")

print(f"\n{len(ids)} clips ingested -> results/ids.json")
print("Next: run one test search and check whether result.video_id matches the")
print("asset_id or the indexed_asset_id (corroborate.py accepts either).")
