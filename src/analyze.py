"""Step 6: one Pegasus call per clip -> description, relevance, timestamped findings."""
import json
import re
import sys

from twelvelabs.types import AnalyzePromptV2, SyncResponseFormat, VideoContext_AssetId

from tl_client import PEGASUS_MODEL, SCHEMA_PATH, client, load_ids, load_policy

PROMPT_VERSION = "v1"


def build_prompt(policy):
    cats = "\n".join(f"- {k}: {v['definition'].strip()}" for k, v in policy["categories"].items())
    return f"""You are an ads compliance analyst reviewing a creator video submitted as a paid ad.
Campaign brief: {policy['campaign']['brief'].strip()}

Return:
1. description: 2-5 sentences describing what happens in the video.
2. relevance: a 0-100 score for how well the video matches the campaign brief, the number of
   seconds the campaign product is on screen, and a one-line rationale.
3. findings: every policy violation. Check visuals, speech AND on-screen text. Categories:
{cats}
For each finding give start_sec and end_sec, modality, evidence (quote speech or on-screen text
verbatim; describe visuals precisely), severity (low, medium or high) and confidence (0-1).
Only report what actually occurs in the video. If nothing violates policy, return an empty findings list."""


def sentence_count(text):
    return len([s for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s])


def analyze(asset_id, policy=None, max_tokens=4096, _retried=False):
    policy = policy or load_policy()
    schema = json.loads(SCHEMA_PATH.read_text())
    res = client.analyze(
        model_name=PEGASUS_MODEL,
        video=VideoContext_AssetId(asset_id=asset_id),
        prompt_v_2=AnalyzePromptV2(input_text=build_prompt(policy)),
        response_format=SyncResponseFormat(type="json_schema", json_schema=schema),
        temperature=0,
        max_tokens=max_tokens,
    )
    if res.finish_reason == "length" and not _retried:
        return analyze(asset_id, policy, max_tokens * 2, _retried=True)
    out = json.loads(res.data)
    n = sentence_count(out.get("description", ""))
    out["_prompt_version"] = PROMPT_VERSION
    out["_checks"] = {"description_sentences": n, "description_ok": 2 <= n <= 5,
                      "finish_reason": res.finish_reason}
    return out


if __name__ == "__main__":
    # Quick test: python src/analyze.py 08_medical_claim.mp4
    name = sys.argv[1]
    print(json.dumps(analyze(load_ids()[name]["asset_id"]), indent=2))
