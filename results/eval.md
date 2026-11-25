# Evaluation

Clips evaluated: 12  
Decision accuracy: 9/12 (75%)
Relevance label accuracy: 8/12
Planted violations caught: 6/6
Mean timestamp error on caught violations: 1.1s

## Per clip

| Clip | Expected | Got | Match | Relevance (exp / got) | Violations |
|---|---|---|---|---|---|
| 01_clean_tutorial.mp4 | APPROVE | APPROVE | yes | ON_BRIEF / ON_BRIEF |  |
| 02_clean_grwm.mp4 | APPROVE | APPROVE | yes | ON_BRIEF / ON_BRIEF |  |
| 03_clean_demo.mp4 | APPROVE | APPROVE | yes | ON_BRIEF / ON_BRIEF |  |
| 04_weak_vlog.mp4 | REVIEW | APPROVE | **no** | WEAK / ON_BRIEF |  |
| 05_offbrief_clickbait.mp4 | BLOCK | BLOCK | yes | OFF_BRIEF / OFF_BRIEF |  |
| 06_offbrief_lipstick_craft.mp4 | BLOCK | REVIEW | **no** | OFF_BRIEF / WEAK |  |
| 07_profanity.mp4 | REVIEW | REVIEW | yes | ON_BRIEF / ON_BRIEF | profanity caught |
| 08_medical_claim.mp4 | BLOCK | BLOCK | yes | WEAK / WEAK | medical_claims caught, medical_claims caught |
| 09_unsafe_application.mp4 | REVIEW | REVIEW | yes | ON_BRIEF / ON_BRIEF | unsafe_usage caught, unsafe_usage caught |
| 10_drugs_background.mp4 | BLOCK | BLOCK | yes | ON_BRIEF / WEAK | drugs_illegal caught |
| 11_weak_skincare.mp4 | REVIEW | BLOCK | **no** | WEAK / OFF_BRIEF |  |
| 12_messy_but_harmless.mp4 | APPROVE | APPROVE | yes | ON_BRIEF / ON_BRIEF |  |

## Confusion matrix (rows = expected, columns = predicted)

| | APPROVE | REVIEW | BLOCK |
|---|---|---|---|
| **APPROVE** | 4 | 0 | 0 |
| **REVIEW** | 1 | 2 | 1 |
| **BLOCK** | 0 | 1 | 3 |

## Misses to explain

- **04_weak_vlog.mp4**: expected REVIEW, got APPROVE. Reasons: APPROVE: on-brief, no violations above tolerance
- **06_offbrief_lipstick_craft.mp4**: expected BLOCK, got REVIEW. Reasons: REVIEW: weak campaign relevance (40)
- **11_weak_skincare.mp4**: expected REVIEW, got BLOCK. Reasons: BLOCK: off-brief (relevance 0): The video shows a face mask application, not the Lumière Velvet Matte Lipstick as required by the campaign brief.

_Small hand-built test set: a smoke test, not a benchmark. A real POC would use hundreds of customer-labeled videos._