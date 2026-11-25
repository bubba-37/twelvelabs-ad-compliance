# Step 4 prompt for Claude Code: build the test clips

Paste everything below the line into Claude Code.

---

Build the finished test clips in clips/ from the raw material in clips/raw/ using ffmpeg. clips/raw/ has royalty-free stock footage plus my voiceover recordings (.m4a). Don't modify anything in clips/raw/.

Before building, look at one frame from each raw clip you plan to use and confirm it matches the description below. If something doesn't match, tell me and suggest a substitute from clips/raw/.

Ask me what each voiceover (.m4a) says before you use it, so the transcript and timing go into the manifest correctly.

Technical requirements for every finished clip:
- 1280x720, 25 fps, H.264 video + AAC audio, MP4. Scale down the 4K sources.
- Vertical sources (1080x1920, 720x1280, 2160x4096): fit them inside 1280x720 over a blurred, enlarged copy of the same footage. No stretching, no plain black bars.
- Length 10–60 seconds. Where a scenario needs more length, join 2–3 related raw clips with simple cuts.
- Many raw clips have no audio track. Give every segment an audio track (silent if it has none) before joining or mixing, so each finished clip has one consistent audio stream.
- Voiceovers: mix at a clear speaking level. If the footage has its own audio, lower it underneath the voiceover.
- On-brief clips (01, 02, 03, 04, 07, 08, 09, 10) get a 3-second "Lumière Velvet Matte" text overlay near the start: clean white text with a subtle shadow.

Clip plan:
- 01_clean_tutorial: 1596893-hd_1920_1080_30fps.mp4 + 6868397-hd_1080_1920_25fps.mp4. Expected APPROVE.
- 02_clean_grwm: vo_grwm_velvete_matte.mp4 (already has my Velvet Matte voiceover) + grwm_morning_a.mp4. Expected APPROVE. Ordinary product talk that should not be flagged.
- 03_clean_demo: lipstick_closeup_a.mp4 + lipstick_closeup_b.mp4. Expected APPROVE.
- 04_weak_vlog: mixkit-young-woman-dancing-and-performing-with-hands-49095-hd-ready.mp4 + mixkit-52061-video-52061-hd-ready.mp4, with about 2 seconds of a lipstick shot in the middle. Expected REVIEW (weak relevance).
- 05_offbrief_clickbait: gaming_clip_a.mp4 + gaming_clip_b.mp4. Expected BLOCK (off-brief). No brand overlay.
- 06_offbrief_lipstick_craft: mixkit-girl-puting-lipstick-to-decorate-a-valentine-card-with-a-44847-hd-ready.mp4 + mixkit-top-view-of-a-woman-slicing-vegetables-40524-hd-ready.mp4. Expected BLOCK (off-brief: lipstick appears, but it isn't a makeup ad). No brand overlay. Rename the 06_offbrief_skincare row in manifest.csv to this name.
- 07_mild_profanity: Stinks_profanity.mp4 is my finished edit with Stinks.m4a mixed in; use it, normalized to the specs above. If it isn't, mix Profanity.m4a over a clean lipstick clip instead. Expected APPROVE if there are 2 or fewer mild swears, otherwise REVIEW. Set it from the transcript.
- 08_medical_claim: vo_acne_cancer_claim.mp4 with the CureClaims.m4a voiceover, plus a burned-in caption "Cures acne in 3 days" for 4 seconds partway through. Expected REVIEW (BLOCK if the voiceover's claim is severe, e.g. about cancer; tell me which and I'll decide).
- 09_unsafe_waterline: unsafe_application.mp4 (vertical 4K) shows product applied unsafely near the eye. If it doesn't, use mixkit-woman-applying-makeup-to-her-eyes-27835-hd-ready.mp4. Expected REVIEW.
- 10_drugs_background: LipstickTutorial_Drugs.mp4 is my own edit with a drug moment already in it; use it as is, normalized. If it isn't, splice 2 seconds from Drugs_marijuana_a.mp4 or 7667377-uhd_3840_2160_30fps.mp4 (man preparing cannabis) into the middle of a clean lipstick clip. Expected BLOCK. Don't use smoking.mp4 (tobacco isn't illegal).

When the clips are built:
1. Update manifest.csv: file names, site and URL from clips/raw/sources.txt (some raw files were renamed after sources.txt was written; where you can't match one, put just the site name), the edits made, expected decision and relevance, and the exact start-end seconds of every violation in the violations column (format category:start-end, several separated by ;).
2. Save one frame per finished clip to notes/frames/.
3. Show me a summary table: file, length, has audio, expected decision, violation times.
4. Commit (the video files themselves stay out of git).
