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
   └─► Marengo index ─────► search: corroboration of visual findings (+ product-footage check, see Limitations)
                                   │
                    policy.yaml ──►  rules.py (deterministic) ──► decision + reasons + evidence
```

1. **Relevance gate**: Pegasus scores fit with the campaign brief. A Marengo product-footage
   check was meant to cross-check that score (disagreement goes to REVIEW), but on this test set
   it doesn't discriminate — see Limitations.
2. **Compliance analysis**: one Pegasus call with a JSON schema returns findings per policy
   category, each with start/end time, modality, verbatim evidence, severity and confidence.
3. **Corroboration**: visual findings are checked with a Marengo search; an overlapping hit
   marks them confirmed, otherwise they go to REVIEW.
4. **Decision engine**: plain Python reads `policy.yaml`. Pegasus supplies the evidence and rates
   each finding's severity against the category definitions; `rules.py` maps severity, confidence
   and relevance to the decision. The model never makes the final call.

## Policy categories

| Category | Typical severity | Action |
|---|---|---|
| Hate / harassment | High | High → BLOCK |
| Drugs / illegal behavior | High | High → BLOCK |
| Profanity | Tiered | Mild (low) allowed up to 2; strong (medium) → REVIEW; explicit (high) → BLOCK |
| Unsafe / misleading product usage | Medium | Medium → REVIEW, high → BLOCK |
| Medical / cosmetic claims | Medium | Medium → REVIEW, high → BLOCK |
| Campaign relevance | — | OFF_BRIEF → BLOCK, WEAK → REVIEW |

Pegasus rates each finding's severity using the category definitions in `policy.yaml`, and
`rules.py` turns severity + confidence into the action above (high-severity findings need
confidence ≥ 0.7 to block). `default_severity` in `policy.yaml` documents the expected level but
isn't enforced in code: clip 08's medical claims block because Pegasus rated them high (a
claimed cancer cure). Enforcing a per-category severity cap or floor is a next step. Thresholds
are starting points to tune with the customer.

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
     Marengo matched the whole 12s clip (well above the 3s minimum), so no disagreement reason
     is added. (Marengo matches every clip end to end — see Limitations.)
5. **Result**: two REVIEW reasons, no BLOCK or APPROVE condition met → **decision: REVIEW**,
   with both quotes carried through as the explanation.

The same policy.yaml-driven trace runs for every clip; `viewer/index.html` shows it for all 13.

## Why the outputs are trustworthy

- Every decision lists the rules that fired; compliance findings carry timestamped evidence
  (relevance-driven decisions cite the score, product-on-screen seconds and rationale).
- Visual findings must be corroborated by a separate Marengo search before they can
  auto-block; if Marengo can't confirm one, it routes to a human. Speech and on-screen-text
  findings rely on Pegasus's verbatim quote as the evidence — 6 of the 7 planted violations
  are in that group, so for them Pegasus is the only signal today (next step: a separate
  speech-to-text / OCR pass as their second signal).
- Each result records the model, prompt version and policy hash (audit trail).
- Measured against a hand-labeled 13-clip test set (`results/eval.md`): **10/13 decisions
  correct (77%)**, **7/7 planted violations caught**, and no findings at all on the 8 clips with
  no planted violation. The three violation windows I set by hand (07's profanity, 08's
  on-screen caption, 10's drug footage) were found within **0.02s**. The other four (the speech
  claims in 08, 09 and 13) were labeled from Pegasus's own output, so they don't measure
  timestamp accuracy (see Limitations). All 3 misses are relevance calls by Pegasus; the Marengo
  product-footage check couldn't catch them as built (see Limitations):
  - `04_weak_vlog`: expected REVIEW (WEAK), got APPROVE (ON_BRIEF, 85) — a brief but genuine
    product shot plus on-screen branding was enough to clear the 70 threshold despite most of
    the runtime being unrelated dance and eyeliner footage. Pegasus's own `product_on_screen_seconds` was
    3s of 12s; a rule on that field would have routed this to REVIEW. Not added, because it
    would be tuned on this same 13-clip set.
  - `06_offbrief_lipstick_craft`: expected BLOCK (OFF_BRIEF), got REVIEW (WEAK, 40) — the source
    footage is genuinely ambiguous (someone applying lipstick to her own lips to check the
    color before using it as craft paint), landing right on the WEAK/OFF_BRIEF boundary.
  - `11_weak_skincare`: expected REVIEW (WEAK), got BLOCK (OFF_BRIEF, 0) — my label treated a
    same-vertical skincare video as borderline; Pegasus treated anything that isn't the named
    lipstick as off-brief. Which is right is a policy decision for the advertiser.

## How this scales in a real ads system

- Async analysis tasks + webhooks behind a queue (proposed; this project runs synchronously).
  A cheaper relevance-only pass could run first to drop clear off-brief submissions early — not
  built here; today relevance and compliance come from the same Pegasus call.
- Policy-as-config per advertiser and market, versioned.
- Human review queue whose decisions become labeled data for tuning thresholds.

**Cost and latency (clearly labeled: measured vs. estimated)**

| | Measured in this project | Caveat |
|---|---|---|
| Pegasus `analyze` call | **~7s** wall-clock per clip (6.8–7.6s across 3 timed runs, 12–22s source clips) | Timed locally with `time python src/analyze.py <clip>`; a single synchronous call, no retries. Real traffic should parallelize across clips, not run this serially. |
| Asset upload + Marengo indexing | Observed 1–3 poll cycles (~5s each) per stage during `ingest.py`, so roughly **10–40s per clip**, done once at upload time | Not formally benchmarked — read off the `queued`/`pending` polling output, varies with clip length and queue depth. |
| Marengo search (per `marengo_queries` entry) | Not separately timed; folded into `analyze.py`'s wall-clock above when run together | `corroborate.py` searches the whole index per clip (see its own docstring) — this gets slower, not cheaper, as the index grows, until it's filtered server-side. |
| API cost per video | **Not measured.** Indicative only: an older TwelveLabs rate card ([twelvelabs.io/pricing-2](https://www.twelvelabs.io/pricing-2), undated, references Marengo 2.6) lists Marengo indexing at $0.033/min visual + $0.0083/min audio (about **$0.041/min**), and Pegasus indexing at the same rates plus $0.001 / $0.002 per 1k input/output tokens | This pipeline indexes in Marengo only and calls Pegasus `analyze` on an asset, which that page doesn't price. If Pegasus analysis is billed like Pegasus indexing, the total is roughly **$0.08–0.09 per minute of video**. Current plans use workload allowances, so confirm with TwelveLabs before sizing a budget. Search isn't priced on the page. |

Bottom line: latency is dominated by the one synchronous Pegasus call (~7s), which is why the
architecture above puts it behind an async queue rather than in the request path; indexing is a
one-time cost per video, not a per-request one. At the older listed rates that's on the order
of cents per creator video, to be confirmed against current pricing.

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

`results/ids.json` and the cached `results/*.pegasus.json` files in this repo are from my run.
To run against your own account, move them aside first (`ingest.py` skips any clip already in
`ids.json`), then use `python src/run_all.py --fresh` so Pegasus is re-run under the current
prompt and policy. `evaluate.py` and the viewer work from the saved results with no API key.

## Test set

13 short clips built from royalty-free stock footage (Pexels, Mixkit) and my own recordings,
with violations edited in, so ground truth
(including violation timestamps) is known. See `manifest.csv`. No real creators or brands are used.

**The video files themselves aren't in this repo** — `clips/` and `clips/raw/` are gitignored by
design (see `.gitignore`), so there's nothing to download from git history either. Everything
that doesn't require the raw video works standalone: every clip's description, decision, and
timestamped findings are in `results/*.json`, and `notes/frames/` has one representative still
frame per clip. Opening `viewer/index.html` directly in a browser (no server needed) shows all
of that too — but without the video files, each clip's player falls back to its still frame with
a note, since the `<video>` element has nothing to load.

**To see the actual clips play in the viewer**, once you have them (contact
scottkline@icloud.com, or use the link shared with you separately):

1. Download the 13 video files.
2. Save them into `clips/` at the project root, using the **exact filenames** the manifest uses
   — `01_clean_tutorial.mp4`, `02_clean_grwm.mp4`, … `13_hate_harassment.mp4` (see `manifest.csv`
   or the clip list in the viewer's sidebar for the full list). The viewer matches by filename.
3. Reopen or refresh `viewer/index.html` — no regeneration needed. `viewer/results.js` already
   has every clip's data; it's only the video playback that was missing.

## How this was built

I used AI coding assistants (Claude Code) to write and iterate on the code, test clips and
docs; the commit history shows it. The design decisions, the test-set construction and the
checks behind every number here are mine, including the self-review below.

## Limitations and next steps

Found in a self-review after submission (Nov 25, 2026). Code fixes are applied; the stored
results will reflect them after the next `run_all.py` run:

- **Evaluation matching bug (fixed).** `evaluate.py` paired each planted violation with the
  *first* overlapping finding of its category, so clip 08's speech claim was scored against its
  on-screen caption and 09's second claim against its first. That produced the originally
  reported 0.9s "mean timestamp error". Matching is now one-to-one (closest unused finding).
- **Some timestamp ground truth came from model output.** The speech-violation times for clips
  08, 09 and 13 in `manifest.csv` were copied from Pegasus's own output, so those 4 of the 7
  caught violations score ~0s by construction. Only the 3 hand-set windows (07, 08's caption,
  10) measure accuracy. They should be re-timed by hand against the audio.
- **The brand title card gives away relevance.** Every on-brief or weak clip carries a 3s
  "Lumière Velvet Matte" card and every off-brief clip has none, and most of Pegasus's relevance
  rationales cite the on-screen name. Relevance scores on this set are partly reading the card.
  Clip 01 is lip-gloss footage and still scores 100. A fair test needs branded off-brief clips
  and unbranded on-brief ones.
- **Marengo product-footage check doesn't discriminate.** `marengo_relevance` summed hits
  across both relevance queries without merging overlaps, double-counting (e.g. 36s reported for
  the 18s clip 12). That's fixed in `corroborate.py`, but for every clip Marengo returned the
  whole clip as one segment for both queries, so even merged, "product seconds" equals clip
  length — including `11_weak_skincare`, which has no lipstick at all. The disagreement rule
  therefore never fired, and it only checks one direction. Next step: search filtered to one
  video with a minimum match score.
- **Corroboration is weaker than "independent".** A hit counts if its time window overlaps the
  finding, with no minimum score, and one of the queries is Pegasus's own evidence sentence —
  `10_drugs_background` (heroin prep) was "confirmed" by "person smoking." Next step: a
  score/rank threshold and queries written from the policy, not from the finding.
- **Severity is the model's call.** Pegasus rates severity; `default_severity` isn't enforced.
- **Relevance-driven decisions carry no timestamps.** OFF_BRIEF and WEAK reasons cite the score,
  Pegasus's product-on-screen seconds and its rationale, not a timestamped clip moment.
- **Labels and prompt were adjusted during development, after seeing model output** (e.g. 08's
  expected relevance and 11's expected decision, the profanity severity wording). The 13-clip
  numbers are a smoke test of the pipeline, not an unbiased accuracy estimate. Untested so far:
  the mild-profanity tolerance rule, explicit language, visually unsafe application, and
  violations shorter than a second.
- **Audit trail on the submitted results.** The results were stamped with the hash of an
  earlier `policy.yaml` (only comments changed since), and cached Pegasus output was re-stamped
  with the current prompt version. `run_all.py` now records whether Pegasus output was cached
  and which prompt produced it; `--fresh` regenerates everything consistently.

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
