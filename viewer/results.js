const RESULTS = [
  {
    "file": "01_clean_tutorial.mp4",
    "decision": "APPROVE",
    "reasons": [
      "APPROVE: on-brief, no violations above tolerance"
    ],
    "description": "The video begins with a close-up shot of a person applying a glossy red lip product using a wand applicator, with the text 'Lumière Velvet Matte' displayed on screen. The scene then transitions to a woman with long red and purple hair holding the lipstick tube and cap. She proceeds to apply the lipstick directly to her lips while looking at the camera, demonstrating the product's application and finish.",
    "relevance": {
      "score": 100,
      "product_on_screen_seconds": 16.0,
      "rationale": "The video perfectly matches the campaign brief by showing a creator tutorial and product demo of the Lumière Velvet Matte Lipstick being applied and worn.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 32.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 7.960000038146973,
          "rank": 1
        },
        {
          "query": "applying lipstick to lips",
          "start": 7.960000038146973,
          "end": 16.0,
          "rank": 10
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 7.960000038146973,
          "rank": 2
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 7.960000038146973,
          "end": 16.0,
          "rank": 7
        }
      ]
    },
    "findings": [],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d472940759a5eecbd020",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:05.681525+00:00"
    }
  },
  {
    "file": "02_clean_grwm.mp4",
    "decision": "APPROVE",
    "reasons": [
      "APPROVE: on-brief, no violations above tolerance"
    ],
    "description": "A blonde woman with her hair in a ponytail is shown applying lipstick while looking into a vanity mirror. The text 'Lumière Velvet Matte' appears on screen as she applies the product to her lips. She continues to apply the lipstick carefully, ensuring even coverage while speaking about the product's longevity.",
    "relevance": {
      "score": 100,
      "product_on_screen_seconds": 8.5,
      "rationale": "The video perfectly matches the campaign brief by showing a creator tutorial and product demo of the Lumière Velvet Matte Lipstick being applied and worn, with the product name explicitly displayed on screen.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 17.1,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 8.533332824707031,
          "rank": 7
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 8.533332824707031,
          "rank": 13
        }
      ]
    },
    "findings": [],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06e12ece1f5339fb0abd8b",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:06.252419+00:00"
    }
  },
  {
    "file": "03_clean_demo.mp4",
    "decision": "APPROVE",
    "reasons": [
      "APPROVE: on-brief, no violations above tolerance"
    ],
    "description": "The video features a close-up demonstration of lipstick application. In the first segment, a person applies a pink matte lipstick directly from the bullet to their lips, with the text 'Lumière Velvet Matte' displayed on screen. The scene then cuts to a different person with long reddish-brown hair applying a darker, berry-toned liquid lipstick using a wand applicator while looking into a mirror. The video concludes with the second person smiling at the camera.",
    "relevance": {
      "score": 95,
      "product_on_screen_seconds": 15.0,
      "rationale": "The video directly demonstrates the application of lipstick products, matching the campaign brief for tutorials and product demos. The specific product name 'Lumière Velvet Matte' is explicitly shown on screen during the first half of the clip.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 30.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 7.933332920074463,
          "rank": 2
        },
        {
          "query": "applying lipstick to lips",
          "start": 7.933332920074463,
          "end": 15.0,
          "rank": 5
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 7.933332920074463,
          "rank": 1
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 7.933332920074463,
          "end": 15.0,
          "rank": 9
        }
      ]
    },
    "findings": [],
    "checks": {
      "description_sentences": 4,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d4982316e8b3121da3d3",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:06.860848+00:00"
    }
  },
  {
    "file": "04_weak_vlog.mp4",
    "decision": "APPROVE",
    "reasons": [
      "APPROVE: on-brief, no violations above tolerance"
    ],
    "description": "The video opens with a stylized shot of a model posing in a white top with gold hoop earrings, with the text 'Lumière Velvet Matte' displayed on screen. It then cuts to a close-up of a pink lipstick being applied to lips. The final segment shows a makeup artist applying eyeshadow and eyeliner to a model's eye using a brush and pencil.",
    "relevance": {
      "score": 85,
      "product_on_screen_seconds": 3.0,
      "rationale": "The video features the campaign product name on screen and shows a lipstick application, but the majority of the runtime focuses on eye makeup application rather than the lipstick demo.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 24.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 6.933332920074463,
          "rank": 13
        },
        {
          "query": "applying lipstick to lips",
          "start": 6.933332920074463,
          "end": 12.0,
          "rank": 17
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 6.933332920074463,
          "rank": 5
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 6.933332920074463,
          "end": 12.0,
          "rank": 14
        }
      ]
    },
    "findings": [],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d4a9269d9b87d5bcbcef",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:07.532475+00:00"
    }
  },
  {
    "file": "05_offbrief_clickbait.mp4",
    "decision": "BLOCK",
    "reasons": [
      "BLOCK: off-brief (relevance 0): The video content is entirely unrelated to the campaign brief, featuring gaming scenes with no mention, application, or visual presence of Lumière Velvet Matte Lipstick."
    ],
    "description": "The video opens in a dimly lit gaming lounge where several people are seated at computers, wearing headsets and playing video games. The scene then cuts to a living room at night where three men are sitting on a couch, intensely playing a video game on a console while eating snacks and drinking soda. The video focuses entirely on gaming activities and social interaction.",
    "relevance": {
      "score": 0,
      "product_on_screen_seconds": 0.0,
      "rationale": "The video content is entirely unrelated to the campaign brief, featuring gaming scenes with no mention, application, or visual presence of Lumière Velvet Matte Lipstick.",
      "label": "OFF_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 0.0,
      "matches": []
    },
    "findings": [],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d4ba940759a5eecbd048",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:08.165605+00:00"
    }
  },
  {
    "file": "06_offbrief_lipstick_craft.mp4",
    "decision": "REVIEW",
    "reasons": [
      "REVIEW: weak campaign relevance (40)"
    ],
    "description": "The video begins with a close-up of a person holding a smartphone, recording themselves applying a red lipstick while looking into the camera. The scene then transitions to a top-down view of a wooden cutting board where hands are slicing a cucumber next to sliced tomatoes, lettuce, and avocado halves. The video ends with the continued slicing of the cucumber.",
    "relevance": {
      "score": 40,
      "product_on_screen_seconds": 7.0,
      "rationale": "The first half of the video shows a lipstick application demo which aligns with the brief, but the second half abruptly switches to food preparation, making the content only partially relevant to the campaign.",
      "label": "WEAK"
    },
    "marengo_relevance": {
      "product_seconds": 13.9,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 6.933332920074463,
          "rank": 8
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 6.933332920074463,
          "rank": 6
        }
      ]
    },
    "findings": [],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d4d031690ee85f22aaf2",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:08.803025+00:00"
    }
  },
  {
    "file": "07_profanity.mp4",
    "decision": "REVIEW",
    "reasons": [
      "REVIEW: profanity at 11s (medium, conf 0.95): SPEAKER_00: Oh this smells like shit.",
      "REVIEW: profanity at 14s (medium, conf 0.98): SPEAKER_00: This smells fucking awful"
    ],
    "description": "A blonde woman is shown applying lipstick while looking into a handheld mirror, with a large vintage alarm clock visible in the background. The on-screen text identifies the product as 'Lumière Velvet Matte'. As she applies the product, her expression shifts from focused to disgusted, and she verbally complains about the smell before leaning away from the camera.",
    "relevance": {
      "score": 85,
      "product_on_screen_seconds": 17.0,
      "rationale": "The video clearly demonstrates the application of the campaign product, Lumière Velvet Matte Lipstick, with the product name displayed on screen and the lipstick visible throughout the entire clip.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 34.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 8.533332824707031,
          "rank": 15
        },
        {
          "query": "applying lipstick to lips",
          "start": 8.533332824707031,
          "end": 17.0,
          "rank": 18
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 8.533332824707031,
          "rank": 16
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 8.533332824707031,
          "end": 17.0,
          "rank": 19
        }
      ]
    },
    "findings": [
      {
        "category": "profanity",
        "severity": "medium",
        "start_sec": 11.28,
        "end_sec": 12.96,
        "modality": "speech",
        "evidence": "SPEAKER_00: Oh this smells like shit.",
        "confidence": 0.95,
        "corroboration": "n/a (speech/on-screen text: verbatim quote is the evidence)"
      },
      {
        "category": "profanity",
        "severity": "medium",
        "start_sec": 13.92,
        "end_sec": 16.0,
        "modality": "speech",
        "evidence": "SPEAKER_00: This smells fucking awful",
        "confidence": 0.98,
        "corroboration": "n/a (speech/on-screen text: verbatim quote is the evidence)"
      }
    ],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d4e12028fde55c7d6aca",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:09.371832+00:00"
    }
  },
  {
    "file": "08_medical_claim.mp4",
    "decision": "BLOCK",
    "reasons": [
      "BLOCK: high-severity medical_claims at 3s (conf 1.0): On-screen text reads: 'Cures acne in 3 days'",
      "BLOCK: high-severity medical_claims at 1s (conf 1.0): Speaker says: 'This not only cleared my acne in three days, but it cured my cancer as well.'"
    ],
    "description": "A woman with short dark hair is shown in a bathroom mirror applying a matte lipstick to her lips using an applicator wand. On-screen text appears identifying the product as 'Lumière Velvet Matte' and then displays a claim stating 'Cures acne in 3 days'. The speaker simultaneously makes verbal claims about the product clearing acne and curing cancer.",
    "relevance": {
      "score": 60,
      "product_on_screen_seconds": 10.0,
      "rationale": "The video features the correct product being applied as per the brief, but the inclusion of severe medical claims in both text and audio significantly detracts from the intended tutorial/demo purpose.",
      "label": "WEAK"
    },
    "marengo_relevance": {
      "product_seconds": 20.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 10.0,
          "rank": 12
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 10.0,
          "rank": 17
        }
      ]
    },
    "findings": [
      {
        "category": "medical_claims",
        "severity": "high",
        "start_sec": 3.0,
        "end_sec": 7.0,
        "modality": "on_screen_text",
        "evidence": "On-screen text reads: 'Cures acne in 3 days'",
        "confidence": 1.0,
        "corroboration": "n/a (speech/on-screen text: verbatim quote is the evidence)"
      },
      {
        "category": "medical_claims",
        "severity": "high",
        "start_sec": 1.28,
        "end_sec": 5.76,
        "modality": "speech",
        "evidence": "Speaker says: 'This not only cleared my acne in three days, but it cured my cancer as well.'",
        "confidence": 1.0,
        "corroboration": "n/a (speech/on-screen text: verbatim quote is the evidence)"
      }
    ],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06e13f31690ee85f22b357",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:10.018259+00:00"
    }
  },
  {
    "file": "09_unsafe_application.mp4",
    "decision": "REVIEW",
    "reasons": [
      "REVIEW: unsafe_usage at 1s (medium, conf 0.95): SPEAKER_00: 'Here's a little pro tip this works great on your inner water line too.'",
      "REVIEW: unsafe_usage at 6s (medium, conf 0.9): SPEAKER_00: 'No need to even clean it just pass around to your friends and use it wherever.'"
    ],
    "description": "A woman with long dark hair is shown in a dimly lit room with red ambient lighting, applying lipstick while looking into a mirror. The text 'Lumière Velvet Matte' appears on screen as she applies the product to her lips. She continues to apply and blend the lipstick throughout the clip while speaking about its versatility and sharing it with friends.",
    "relevance": {
      "score": 95,
      "product_on_screen_seconds": 12.0,
      "rationale": "The video directly demonstrates the application of the Lumière Velvet Matte Lipstick as specified in the campaign brief, with the product name displayed on screen and the creator actively using the item.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 24.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 12.0,
          "rank": 14
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 12.0,
          "rank": 15
        }
      ]
    },
    "findings": [
      {
        "category": "unsafe_usage",
        "severity": "medium",
        "start_sec": 1.2,
        "end_sec": 4.8,
        "modality": "speech",
        "evidence": "SPEAKER_00: 'Here's a little pro tip this works great on your inner water line too.'",
        "confidence": 0.95,
        "corroboration": "n/a (speech/on-screen text: verbatim quote is the evidence)"
      },
      {
        "category": "unsafe_usage",
        "severity": "medium",
        "start_sec": 5.84,
        "end_sec": 9.76,
        "modality": "speech",
        "evidence": "SPEAKER_00: 'No need to even clean it just pass around to your friends and use it wherever.'",
        "confidence": 0.9,
        "corroboration": "n/a (speech/on-screen text: verbatim quote is the evidence)"
      }
    ],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06ffde31690ee85f22cf4c",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:10.670963+00:00"
    }
  },
  {
    "file": "10_drugs_background.mp4",
    "decision": "BLOCK",
    "reasons": [
      "BLOCK: high-severity drugs_illegal at 11s (conf 0.95): A man is shown heating a spoon over a lighter flame in a dimly lit room. On the table, there are syringes, small bottles, and a bag of powder, clearly depicting the preparation of intravenous drugs."
    ],
    "description": "The video begins with a close-up of a woman applying 'Lumière Velvet Matte' lipstick while looking into a mirror. The scene then abruptly cuts to a dimly lit room where a man is heating a spoon over a lighter flame, surrounded by drug paraphernalia including syringes and small bottles on a table. The video briefly returns to the woman finishing her lipstick application before ending.",
    "relevance": {
      "score": 40,
      "product_on_screen_seconds": 11.0,
      "rationale": "The video features the campaign product being applied in the first segment, but the inclusion of unrelated and policy-violating drug use footage significantly detracts from the campaign brief's focus on tutorials and product demos.",
      "label": "WEAK"
    },
    "marengo_relevance": {
      "product_seconds": 44.1,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 10.666666984558105,
          "rank": 4
        },
        {
          "query": "applying lipstick to lips",
          "start": 10.666666984558105,
          "end": 22.066667556762695,
          "rank": 16
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 10.666666984558105,
          "rank": 4
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 10.666666984558105,
          "end": 22.066667556762695,
          "rank": 11
        }
      ]
    },
    "findings": [
      {
        "category": "drugs_illegal",
        "severity": "high",
        "start_sec": 11.0,
        "end_sec": 20.0,
        "modality": "visual",
        "evidence": "A man is shown heating a spoon over a lighter flame in a dimly lit room. On the table, there are syringes, small bottles, and a bag of powder, clearly depicting the preparation of intravenous drugs.",
        "confidence": 0.95,
        "corroboration": "confirmed by 'person smoking' @ 11-22s"
      }
    ],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d514940759a5eecbd098",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:11.530908+00:00"
    }
  },
  {
    "file": "11_weak_skincare.mp4",
    "decision": "BLOCK",
    "reasons": [
      "BLOCK: off-brief (relevance 0): The video shows a face mask application, not the Lumière Velvet Matte Lipstick as required by the campaign brief."
    ],
    "description": "A woman stands in front of a bathroom mirror applying a white face mask using a brush. She holds a small white bowl in one hand and carefully applies the product to her cheeks and chin while looking into the mirror. The video focuses entirely on the face mask application process.",
    "relevance": {
      "score": 0,
      "product_on_screen_seconds": 0.0,
      "rationale": "The video shows a face mask application, not the Lumière Velvet Matte Lipstick as required by the campaign brief.",
      "label": "OFF_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 11.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 11.0,
          "rank": 21
        }
      ]
    },
    "findings": [],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06d529cfd36fe301e84d21",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:12.171366+00:00"
    }
  },
  {
    "file": "12_messy_but_harmless.mp4",
    "decision": "APPROVE",
    "reasons": [
      "APPROVE: on-brief, no violations above tolerance"
    ],
    "description": "A woman with short brown hair, wearing a white button-down shirt, sits at a desk with a laptop. She is applying a red matte lipstick to her lips using the applicator wand. The on-screen text identifies the product as 'Lumière Velvet Matte'. She applies the product carefully, then smiles at the camera while holding the lipstick tube.",
    "relevance": {
      "score": 100,
      "product_on_screen_seconds": 18.0,
      "rationale": "The video perfectly matches the campaign brief by showing a creator tutorial demonstrating the application of the specific product named in the brief.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 36.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 9.0,
          "rank": 9
        },
        {
          "query": "applying lipstick to lips",
          "start": 9.0,
          "end": 18.0,
          "rank": 11
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 9.0,
          "rank": 10
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 9.0,
          "end": 18.0,
          "rank": 12
        }
      ]
    },
    "findings": [],
    "checks": {
      "description_sentences": 4,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b06ea5fcfd36fe301e85b0e",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:12.745130+00:00"
    }
  },
  {
    "file": "13_hate_harassment.mp4",
    "decision": "BLOCK",
    "reasons": [
      "BLOCK: high-severity hate_harassment at 1s (conf 0.95): SPEAKER_00: 'Before I got my hands on her, she genuinely looked basic. Like she rolled out of a dumpster. Like actually disgusting.'"
    ],
    "description": "A close-up video shows a woman applying Lumière Velvet Matte lipstick to her lips while looking into a mirror. The product name is displayed on screen as she carefully applies the lip color. The audio features a voiceover making derogatory and insulting remarks about someone's appearance, describing them as 'basic,' 'rolled out of a dumpster,' and 'disgusting.'",
    "relevance": {
      "score": 85,
      "product_on_screen_seconds": 11.0,
      "rationale": "The video clearly demonstrates the application of the campaign product (Lumière Velvet Matte Lipstick) with on-screen text identifying the product, aligning well with the tutorial/demo brief.",
      "label": "ON_BRIEF"
    },
    "marengo_relevance": {
      "product_seconds": 26.0,
      "matches": [
        {
          "query": "applying lipstick to lips",
          "start": 0.0,
          "end": 13.0,
          "rank": 3
        },
        {
          "query": "close-up of a lipstick bullet",
          "start": 0.0,
          "end": 13.0,
          "rank": 3
        }
      ]
    },
    "findings": [
      {
        "category": "hate_harassment",
        "severity": "high",
        "start_sec": 1.44,
        "end_sec": 10.32,
        "modality": "speech",
        "evidence": "SPEAKER_00: 'Before I got my hands on her, she genuinely looked basic. Like she rolled out of a dumpster. Like actually disgusting.'",
        "confidence": 0.95,
        "corroboration": "n/a (speech/on-screen text: verbatim quote is the evidence)"
      }
    ],
    "checks": {
      "description_sentences": 3,
      "description_ok": true,
      "finish_reason": "stop"
    },
    "audit": {
      "asset_id": "6b0718c431690ee85f22e8be",
      "analysis_model": "pegasus1.6",
      "index_model": "marengo3.0",
      "prompt_version": "v1",
      "policy_version": 1,
      "policy_sha256": "80559333fb4e",
      "run_at": "2026-11-25T17:21:13.314688+00:00"
    }
  }
];
