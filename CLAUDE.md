# Ad Compliance & Brand Safety — take-home exercise (TwelveLabs Solutions Engineer interview)

## Scenario
A social platform screens creator videos before they run as paid ads for a fictional
cosmetics campaign (Lumière Velvet Matte Lipstick). For each video the pipeline returns
APPROVE / REVIEW / BLOCK, a 2–5 sentence description, a campaign relevance score, and
timestamped evidence. Read `README.md`, `policy.yaml`, and everything in `src/` before
making changes — they're the source of truth for the design, not this file.

## Design
- **Pegasus** (`src/analyze.py`, one structured-JSON `client.analyze` call per clip) produces
  the description, relevance score, and findings.
- **Marengo** search on an index (`src/corroborate.py`) gives an independent relevance signal
  (product-footage seconds) and corroborates Pegasus's visual findings.
- **`src/rules.py`** makes the APPROVE/REVIEW/BLOCK decision deterministically from
  `policy.yaml` — the model never makes the final call, it only supplies evidence.

## Status / known risk
The code was written against the TwelveLabs docs and has since been run end-to-end against
the real API (twelvelabs 1.3.8) for all 13 clips. If an SDK upgrade breaks something, expect
parameter/attribute mismatches (method names, kwarg names, response fields).

When something fails:
1. Don't guess a fix from the docs or from memory of other TwelveLabs SDK versions.
2. Check the **installed** `twelvelabs` package's real signatures first, e.g.:
   ```python
   import inspect
   from twelvelabs import TwelveLabs
   c = TwelveLabs(api_key="dummy")   # instantiating (even with a fake key) is enough —
   hasattr(c, "assets")              # attributes like .assets/.indexes are set in __init__,
                                      # so inspecting the class with dir() instead of an
                                      # instance gives a false negative
   inspect.signature(type(c.search).query)
   ```
   or `python -c "import twelvelabs, os; print(os.path.dirname(twelvelabs.__file__))"` and
   read the source directly.
3. Only then change the calling code to match reality.

As of the last check (twelvelabs **1.3.8**, which was also the latest on PyPI), the SDK calls
in `src/` (`client.assets.create/retrieve`, `client.indexes.create`,
`client.indexes.indexed_assets.create/retrieve`, `client.analyze` with `AnalyzePromptV2` /
`SyncResponseFormat` / `VideoContext_AssetId`, `client.search.query`) all matched the installed
package's real signatures. Re-verify against the installed package if the `twelvelabs` version
changes.

`src/ingest.py` has now been run end-to-end against the real API for all clips in
`clips/` with no SDK mismatches — asset upload, indexing, and `wait_ready` polling all worked
as written. One open question from the code's own comments is now settled: in
`client.search.query` results, `SearchItem.video_id` always equals the clip's
**`indexed_asset_id`**, never its `asset_id` (confirmed against the real index with 17 search
hits, 0 matching `asset_id`). `src/corroborate.py`'s `_clip_ids()` already checks a set
containing both, so no code change was needed there — but if that filtering logic is ever
simplified, don't drop the `indexed_asset_id` side.

## Secrets
The TwelveLabs API key lives in `.env` (`TWELVELABS_API_KEY`). **Never print it, echo it, or
paste it into any output** (chat, files, logs, commit messages, etc.).
