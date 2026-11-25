# Ad Compliance & Brand Safety for Creator Video Ads

A TwelveLabs-based pipeline that screens creator videos before they run as paid ads for a
(fictional) cosmetics campaign, **Lumière Velvet Matte Lipstick**. For each video it returns:

- a decision: **APPROVE**, **REVIEW** or **BLOCK**
- a 2–5 sentence description
- a campaign relevance score and label (ON_BRIEF / WEAK / OFF_BRIEF)
- timestamped evidence across visuals, speech and on-screen text, with the rules that fired

> Status: evaluated against a 13-clip hand-built test set (`results/eval.md`); see Limitations
> below for what that does and doesn't prove.

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

Walking through a real run, `results/09_unsafe_application.json` (clip shows a normal,
clean lipstick application — the violation is entirely in the voiceover):

1. **Pegasus call** returns `relevance.score: 95` ("the creator actively using the item,
   product name displayed on screen") and two `unsafe_usage` findings, both `severity: medium`,
   `modality: speech`:
   - `1.2–4.8s`, conf `0.95`: *"this works great on your inner water line too"*
   - `5.84–9.76s`, conf `0.9`: *"no need to even clean it just pass around to your friends"*
2. **Relevance gate**: 95 ≥ `on_brief_min` (70) → label `ON_BRIEF`. No relevance-driven reason
   fires.
3. **Marengo corroboration**: both findings are `speech`, not `visual`, so `corroborate.py`
   marks them `"n/a (speech/on-screen text: verbatim quote is the evidence)"` and skips the
   search step entirely — the verbatim quote *is* the evidence, there's nothing to re-confirm
   visually.
4. **Rule engine** (`rules.py`, in order):
   - Rule 1 (high severity + confident + corroborated → BLOCK): neither finding is `high`
     severity, so this doesn't fire.
   - Rule 2 (OFF_BRIEF → BLOCK): label is `ON_BRIEF`, doesn't fire.
   - Rule 3 (profanity tolerance): no profanity findings, skipped.
   - Rule 4 (everything else → REVIEW): both `medium`-severity findings each add a reason.
   - Rule 5 (WEAK relevance / Pegasus-Marengo disagreement): relevance is `ON_BRIEF` and
     Marengo independently found 24s of product footage (well above the 3s minimum), so no
     disagreement reason is added.
5. **Result**: two REVIEW reasons, no BLOCK or APPROVE condition met → **decision: REVIEW**,
   with both quotes carried through as the explanation.

The same policy.yaml-driven trace runs for every clip; `viewer/index.html` shows it for all 13.

## Why the outputs are trustworthy

- Every decision lists the rules that fired and the timestamped evidence behind them.
- Two independent signals (Pegasus findings, Marengo search) must agree; disagreement routes to a human.
- Each result records the model, prompt version and policy hash (audit trail).
- Measured against a hand-labeled 13-clip test set (`results/eval.md`): **10/13 decisions
  correct (77%)**, **7/7 planted violations caught** with **0.9s** mean timestamp error. All 3
  misses are relevance-scoring judgment calls by Pegasus, not pipeline bugs:
  - `04_weak_vlog`: expected REVIEW (WEAK), got APPROVE (ON_BRIEF, 85) — a brief but genuine
    product shot plus on-screen branding was enough to clear the 70 threshold despite most of
    the runtime being unrelated eyeliner footage.
  - `06_offbrief_lipstick_craft`: expected BLOCK (OFF_BRIEF), got REVIEW (WEAK, 40) — the source
    footage is genuinely ambiguous (someone applying lipstick to her own lips to check the
    color before using it as craft paint), landing right on the WEAK/OFF_BRIEF boundary.
  - `11_weak_skincare`: expected REVIEW (WEAK), got BLOCK (OFF_BRIEF, 0) — arguably Pegasus is
    *more* correct here than the test's own expectation: a face-mask video has zero connection
    to the named lipstick, so a flat miss is defensible.

## How this scales in a real ads system

- Async analysis tasks + webhooks behind a queue; the cheap relevance check runs first.
- Policy-as-config per advertiser and market, versioned.
- Human review queue whose decisions become labeled data for tuning thresholds.

**Cost and latency (clearly labeled: measured vs. estimated)**

| | Measured in this project | Caveat |
|---|---|---|
| Pegasus `analyze` call | **~7s** wall-clock per clip (6.8–7.6s across 3 timed runs, 12–22s source clips) | Timed locally with `time python src/analyze.py <clip>`; a single synchronous call, no retries. Real traffic should parallelize across clips, not run this serially. |
| Asset upload + Marengo indexing | Observed 1–3 poll cycles (~5s each) per stage during `ingest.py`, so roughly **10–40s per clip**, done once at upload time | Not formally benchmarked — read off the `queued`/`pending` polling output, varies with clip length and queue depth. |
| Marengo search (per `marengo_queries` entry) | Not separately timed; folded into `analyze.py`'s wall-clock above when run together | `corroborate.py` searches the whole index per clip (see its own docstring) — this gets slower, not cheaper, as the index grows, until it's filtered server-side. |
| API cost per video | **Not available** — TwelveLabs' public pricing page doesn't list per-minute/per-call rates (checked as of writing; it points to a sales-facing pricing calculator) | Any dollar figure here would be invented, not sourced. Get a current quote before building a real cost model. The input it needs: minutes of video indexed once (Marengo) + one Pegasus analyze call per video + per-category Marengo searches at corroboration time. |

Bottom line: latency is dominated by the one synchronous Pegasus call (~7s), which is why the
architecture above puts it behind an async queue rather than in the request path; indexing is a
one-time cost per video, not a per-request one. Cost cannot be estimated responsibly without a
current rate from TwelveLabs — don't let the absence of a number here read as "free."

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

13 short clips built from royalty-free stock footage with violations edited in, so ground truth
(including violation timestamps) is known. See `manifest.csv`. No real creators or brands are used.

**The video files themselves aren't in this repo** — `clips/` and `clips/raw/` are gitignored by
design (see `.gitignore`), so there's nothing to download from git history either. To review the
actual footage: every clip's description, decision, and timestamped findings are already in
`results/*.json` and the static viewer (`viewer/index.html`, open directly in a browser — no
server needed), and `notes/frames/` has one representative still frame per clip. For the raw
video files themselves, contact scottkline@icloud.com and I'll share them directly.

## Limitations and next steps

- Clip 09 (`09_unsafe_application.mp4`) went through two iterations before landing on a real
  example: an early version substituted loose eyeshadow pigment with an on-screen "Lumière Velvet
  Matte" label burned in, so its `unsafe_usage` finding was really reacting to a mislabeled
  product, not a lipstick being misused. It's now built from a voiceover that recommends the
  lipstick for the inner waterline and sharing the applicator unwashed — both of `policy.yaml`'s
  own named examples — over footage that looks completely normal. Pegasus catches both claims as
  separate findings purely from speech. That swap is itself a good illustration of the stated
  challenge that subtle, improper, or unsafe product application is hard to catch: the first
  attempt at this clip didn't actually demonstrate the problem it was meant to test, and the real
  violation turned out to live entirely in eight seconds of audio with nothing visually wrong.
- A related finding points at the same challenge from the model's side: clip 12
  (`12_messy_but_harmless.mp4`) shows a creator's lipstick smearing messily across her mouth and
  chin, but Pegasus's description says she "applies the product carefully" and never mentions it.
  The clip still gets the right decision (APPROVE — it's genuinely harmless), but only because the
  model didn't perceive the visual detail, not because it correctly judged a silly presentation as
  safe. Worth watching for in the full eval, not just in this one clip.
- The test set is small (13 hand-built clips) and skewed toward clear-cut cases; `evaluate.py`'s
  own output already says as much. A real POC needs hundreds of customer-labeled videos before
  the accuracy numbers mean anything.
- `corroborate.py` searches the whole index per clip and filters client-side by `indexed_asset_id`
  (see its docstring) — fine at this scale, but should filter server-side or compare embeddings
  directly once the index has more than a handful of videos.
