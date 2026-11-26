"""Shared client, config and helpers. Run all scripts from the repo root."""
import json
import os
import time
from pathlib import Path

import yaml
from dotenv import load_dotenv
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")



class _LazyClient:
    """Create the TwelveLabs client on first use, so scripts that only read saved results
    (e.g. evaluate.py) run without the SDK installed or an API key set."""
    _client = None

    def __getattr__(self, name):
        if _LazyClient._client is None:
            from twelvelabs import TwelveLabs
            _LazyClient._client = TwelveLabs(api_key=os.environ["TWELVELABS_API_KEY"])
        return getattr(_LazyClient._client, name)


client = _LazyClient()
INDEX_ID = os.environ.get("INDEX_ID") or None
PEGASUS_MODEL = os.environ.get("PEGASUS_MODEL", "pegasus1.6")
INDEX_MODEL = "marengo3.0"

POLICY_PATH = ROOT / "policy.yaml"
SCHEMA_PATH = ROOT / "schemas" / "compliance.json"
MANIFEST_PATH = ROOT / "manifest.csv"
CLIPS_DIR = ROOT / "clips"
RESULTS_DIR = ROOT / "results"
VIEWER_DIR = ROOT / "viewer"
IDS_PATH = RESULTS_DIR / "ids.json"


def load_policy():
    return yaml.safe_load(POLICY_PATH.read_text())


def load_ids():
    return json.loads(IDS_PATH.read_text()) if IDS_PATH.exists() else {}


def save_ids(ids):
    RESULTS_DIR.mkdir(exist_ok=True)
    IDS_PATH.write_text(json.dumps(ids, indent=2))


def wait_ready(get, label, every=5, timeout=1800):
    """Poll get() until .status is 'ready'. Raises on 'failed' or timeout."""
    start = time.time()
    while True:
        obj = get()
        status = getattr(obj, "status", None)
        if status == "ready":
            return obj
        if status == "failed":
            raise RuntimeError(f"{label}: processing failed")
        if time.time() - start > timeout:
            raise TimeoutError(f"{label}: still '{status}' after {timeout}s")
        print(f"  {label}: {status}...")
        time.sleep(every)
