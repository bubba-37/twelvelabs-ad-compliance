"""Step 8: deterministic decision engine. Models supply evidence; this code decides."""


def relevance_label(score, policy):
    r = policy["relevance"]
    if score >= r["on_brief_min"]:
        return "ON_BRIEF"
    if score >= r["weak_min"]:
        return "WEAK"
    return "OFF_BRIEF"


def decide(report, policy):
    t = policy["thresholds"]
    rel = report["relevance"]
    label = relevance_label(rel["score"], policy)
    rel["label"] = label
    findings = report["findings"]

    # 1. High-severity, confident findings block, unless Marengo failed to corroborate a
    #    visual finding (then it falls through to REVIEW below).
    high = [f for f in findings if f["severity"] == "high" and f["confidence"] >= t["block_confidence"]
            and f.get("corroboration") != "unconfirmed"]
    if high:
        return "BLOCK", [f"BLOCK: high-severity {f['category']} at {f['start_sec']:.0f}s "
                         f"(conf {f['confidence']}): {f['evidence']}" for f in high]

    # 2. Off-brief blocks.
    if label == "OFF_BRIEF":
        return "BLOCK", [f"BLOCK: off-brief (relevance {rel['score']}): {rel.get('rationale', '')}"]

    reasons = []

    # 3. Profanity tolerance: a few mild instances are allowed.
    mild = [f for f in findings if f["category"] == "profanity" and f["severity"] == "low"]
    limit = policy["categories"]["profanity"]["tolerance"]["mild_max_count"]
    if len(mild) > limit:
        reasons.append(f"REVIEW: {len(mild)} mild profanity instances exceed tolerance of {limit}")

    # 4. Anything medium, low-confidence or uncorroborated goes to a human.
    for f in findings:
        if f in mild:
            continue
        where = f"{f['category']} at {f['start_sec']:.0f}s"
        if f["severity"] in ("medium", "high") or f["confidence"] < t["block_confidence"]:
            reasons.append(f"REVIEW: {where} ({f['severity']}, conf {f['confidence']}): {f['evidence']}")
        elif f["severity"] == "low" and f["category"] != "profanity":
            reasons.append(f"REVIEW: low-severity {where}: {f['evidence']}")
        if f.get("corroboration") == "unconfirmed":
            reasons.append(f"REVIEW: {where} not corroborated by Marengo search")

    # 5. Weak relevance, or the two models disagree about relevance.
    if label == "WEAK":
        reasons.append(f"REVIEW: weak campaign relevance ({rel['score']})")
    m = report.get("marengo_relevance")
    if m is not None:
        min_secs = policy["relevance"]["marengo_min_product_seconds"]
        if label == "ON_BRIEF" and m["product_seconds"] < min_secs:
            reasons.append(f"REVIEW: Pegasus says on-brief but Marengo found only "
                           f"{m['product_seconds']}s of product footage")

    if reasons:
        return "REVIEW", reasons
    return "APPROVE", ["APPROVE: on-brief, no violations above tolerance"]
