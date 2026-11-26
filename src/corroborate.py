"""Step 7: Marengo search as a second, separately computed signal."""
from tl_client import INDEX_ID, client


def _clip_ids(ids_entry):
    return {ids_entry["asset_id"], ids_entry["indexed_asset_id"]}


def hits_for(query, ids_entry, modes=("visual",)):
    """Search the index and keep only hits from this clip. Fine for a ~10 clip test set;
    at scale, filter the search to one video or compare stored embeddings instead."""
    res = client.search.query(index_id=INDEX_ID, query_text=query, search_options=list(modes))
    wanted = _clip_ids(ids_entry)
    return [c for c in res if getattr(c, "video_id", None) in wanted]


def merged_seconds(intervals):
    """Total length of the union of (start, end) intervals, so footage matched by several
    queries is counted once."""
    total, cur = 0.0, None
    for s, e in sorted(intervals):
        if cur and s <= cur[1]:
            cur[1] = max(cur[1], e)
        else:
            if cur:
                total += cur[1] - cur[0]
            cur = [s, e]
    if cur:
        total += cur[1] - cur[0]
    return total


def marengo_relevance(ids_entry, policy):
    """Seconds of footage matching the campaign relevance queries, overlaps merged.

    Known limitation: on this test set Marengo returns the whole clip as one segment for
    every relevance query, so this equals clip length and does not discriminate on-brief
    from off-brief. Needs a per-clip filtered search with a score threshold to be useful."""
    matches = []
    for q in policy["campaign"]["relevance_queries"]:
        for c in hits_for(q, ids_entry):
            matches.append({"query": q, "start": c.start, "end": c.end, "rank": getattr(c, "rank", None)})
    secs = merged_seconds((m["start"], m["end"]) for m in matches)
    return {"product_seconds": round(secs, 1), "matches": matches}


def corroborate(finding, ids_entry, policy):
    """Mark a visual finding confirmed if a Marengo hit overlaps its time range."""
    if finding["modality"] != "visual":
        finding["corroboration"] = "n/a (speech/on-screen text: verbatim quote is the evidence)"
        return finding
    tol = policy["thresholds"]["corroboration_tolerance_sec"]
    cat = policy["categories"].get(finding["category"], {})
    queries = list(cat.get("marengo_queries", [])) + [finding["evidence"]]
    for q in queries:
        for c in hits_for(q, ids_entry):
            if c.start - tol <= finding["end_sec"] and c.end + tol >= finding["start_sec"]:
                finding["corroboration"] = f"confirmed by '{q}' @ {c.start:.0f}-{c.end:.0f}s"
                return finding
    finding["corroboration"] = "unconfirmed"
    return finding
