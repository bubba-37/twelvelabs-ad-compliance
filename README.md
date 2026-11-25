# Ad Compliance & Brand Safety for Creator Video Ads

A TwelveLabs-based pipeline that screens creator videos before they run as paid ads for a
(fictional) cosmetics campaign, **Lumière Velvet Matte Lipstick**. For each video it returns:

- a decision: **APPROVE**, **REVIEW** or **BLOCK**
- a 2–5 sentence description
- a campaign relevance score and label (ON_BRIEF / WEAK / OFF_BRIEF)
- timestamped evidence across visuals, speech and on-screen text, with the rules that fired

> Status: work in progress. Sections marked TODO are filled in after evaluation.

## Architecture

```
creator video
   │
   ├─► TwelveLabs asset ──► Pegasus (structured JSON): description, relevance, findings[]
   │
   └─► Marengo index ─────► search: product footage seconds + corroboration of visual findings
                                   │
                    policy.yaml ──►  rules.py (deterministic) ──► decision + reasons + evidence
```

1. **Relevance gate**: Pegasus scores fit with the campaign brief; Marengo independently
   measures how much product footage it can find. Disagreement goes to REVIEW.
2. **Compliance analysis**: one Pegasus call with a JSON schema returns findings per policy
   category, each with start/end time, modality, verbatim evidence, severity and confidence.
3. **Corroboration**: visual findings are checked with a Marengo search; an overlapping hit
   marks them confirmed, otherwise they go to REVIEW.
4. **Decision engine**: plain Python reads `policy.yaml`. The model never makes the final call.

## Policy categories

| Category | Default severity |
|---|---|
| Hate / harassment | High → BLOCK |
| Drugs / illegal behavior | High → BLOCK |
| Profanity | Mild allowed up to a limit; strong → REVIEW; explicit → BLOCK |
| Unsafe / misleading product usage | Medium → REVIEW (High → BLOCK) |
| Medical / cosmetic claims | Medium → REVIEW |
| Campaign relevance | OFF_BRIEF → BLOCK, WEAK → REVIEW |

Thresholds live in `policy.yaml` and are starting points to tune with the customer.

## How decisions are made

TODO: walk through one real example's rule trace from `results/`.

## Why the outputs are trustworthy

- Every decision lists the rules that fired and the timestamped evidence behind them.
- Two independent signals (Pegasus findings, Marengo search) must agree; disagreement routes to a human.
- Each result records the model, prompt version and policy hash (audit trail).
- Measured against a hand-labeled test set: see `results/eval.md`. TODO: summarize results and misses.

## How this scales in a real ads system

- Async analysis tasks + webhooks behind a queue; the cheap relevance check runs first.
- Policy-as-config per advertiser and market, versioned.
- Human review queue whose decisions become labeled data for tuning thresholds.
- TODO: cost and latency estimate per video.

## Run it

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add your TWELVELABS_API_KEY
python src/setup_index.py     # paste INDEX_ID into .env
# put clips in clips/ and fill in manifest.csv
python src/ingest.py
python src/analyze.py 01_clean_tutorial.mp4   # optional single-clip test
python src/run_all.py
python src/evaluate.py
```

## Test set

12 short clips built from royalty-free stock footage with violations edited in, so ground truth
(including violation timestamps) is known. See `manifest.csv`. No real creators or brands are used.

## Limitations and next steps

- **Clip 09 (`09_unsafe_application.mp4`) is a known gap, not a solid example.** The advertiser's
  stated concern is unsafe product usage near the eye area. We could not source or build footage
  of the actual lipstick being misapplied that way, so this clip substitutes loose eyeshadow
  pigment with an on-screen "Lumière Velvet Matte" label burned in. Pegasus's `unsafe_usage`
  finding on this clip is really reacting to a mislabeled product, not a lipstick being misused —
  it should be rebuilt with real footage before being cited as evidence the pipeline catches
  unsafe application. Left as-is (rather than further doctored) so the gap stays visible.
- That gap is itself a live instance of the stated challenge that subtle, improper, or unsafe
  product application is hard to catch: it was hard enough that even hand-building a clean example
  for our own test set didn't work out.
- A related finding points at the same challenge from the model's side: clip 12
  (`12_messy_but_harmless.mp4`) shows a creator's lipstick smearing messily across her mouth and
  chin, but Pegasus's description says she "applies the product carefully" and never mentions it.
  The clip still gets the right decision (APPROVE — it's genuinely harmless), but only because the
  model didn't perceive the visual detail, not because it correctly judged a silly presentation as
  safe. Worth watching for in the full eval, not just in this one clip.
- The test set is small (12 hand-built clips) and skewed toward clear-cut cases; `evaluate.py`'s
  own output already says as much. A real POC needs hundreds of customer-labeled videos before
  the accuracy numbers mean anything.
- `corroborate.py` searches the whole index per clip and filters client-side by `indexed_asset_id`
  (see its docstring) — fine at this scale, but should filter server-side or compare embeddings
  directly once the index has more than a handful of videos.
