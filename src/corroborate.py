"""Step 7: Marengo search as an independent second signal."""
from tl_client import INDEX_ID, client


def _clip_ids(ids_entry):
    return {ids_entry["asset_id"], ids_entry["indexed_asset_id"]}


def hits_for(query, ids_entry, modes=("visual",)):
    """Search the index and keep only hits from this clip. Fine for a ~10 clip test set;
    at scale, filter the search to one video or compare stored embeddings instead."""
    res = client.search.query(index_id=INDEX_ID, query_text=query, search_options=list(modes))
    wanted = _clip_ids(ids_entry)
    return [c for c in res if getattr(c, "video_id", None) in wanted]


def marengo_relevance(ids_entry, policy):
    """Seconds of footage matching the campaign relevance queries (overlaps not merged)."""
    secs, matches = 0.0, []
    for q in policy["campaign"]["relevance_queries"]:
        for c in hits_for(q, ids_entry):
            secs += c.end - c.start
            matches.append({"query": q, "start": c.start, "end": c.end, "rank": getattr(c, "rank", None)})
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
