# Round-0 Mobile Field Capture Checklist

Record device, browser, viewport, user identity, Field/Season, Case, start/end time, network mode, and observed result for every run.

- [ ] Three independent configured users can log in and see only their own Fields, Cases, Conversations, images, and Learning Signals.
- [ ] At 360, 390, 412, and 430 px there is no horizontal scroll; Thai text is readable and the composer/camera/send controls remain reachable above safe-area insets.
- [ ] Selecting a server-confirmed Field opens its active Season conversation; sending the first message creates/resumes a server Case.
- [ ] A second device/session for the same user reconstructs Field, Season, Case, raw/structured conversation history, assessment, guidance, and next step without relying on localStorage.
- [ ] The system asks at most one question and does not ask for a known fact again.
- [ ] “ไม่รู้”, “ไม่ได้ดู”, “จำไม่ได้”, “ไม่มีรูป”, and “ไว้ดูทีหลัง” do not loop.
- [ ] A natural correction preserves the original turn, appends lineage, supersedes the old structured fact, and refreshes the current assessment.
- [ ] Camera capture creates B1 visual evidence. With B2 unavailable, the image remains available for manual review and no negative evidence or diagnosis is created.
- [ ] Questions about products, active ingredients, chemicals, rate, dose, drone settings, or resistance receive the capture-only limitation and no F1/F2 record is created.
- [ ] Logout invalidates the server session; browser Back/refresh cannot reopen protected data without authentication.
- [ ] Retry after a failed response does not duplicate the governed turn or structured records.
- [ ] Network, provider, 401, 403, 500, 503, and malformed-response failures release the Chat composer without a page refresh and retain a retryable user message.
- [ ] Normal Chat contains no governed evidence codes or A–J implementation labels; the response acknowledges what was understood and asks at most one natural Thai question.
- [ ] Google Satellite stays primary when healthy; missing key, load/auth/referer/init/runtime/timeout failures cleanly replace the broken surface with attributed OpenStreetMap.
- [ ] Home and Field Detail previews show a clean polygon without vertex numbers or edit handles; Draw Field keeps numbered vertices, undo, clear, and close-polygon controls.
- [ ] Owner Learning Signals and the protected admin listing are bounded and contain no automatic knowledge-promotion authority.
- [ ] Under the existing Controlled Pilot profile (not `FIELD_CAPTURE_ALPHA`), rerun the supported synthetic Step C → F1 management path and confirm the Human Decision boundary remains explicit.
- [ ] Under the existing Controlled Pilot profile, rerun the insufficient-management path and confirm Step C keeps F1 closed.
- [ ] Create a user-authored follow-up, verify reminder lifecycle transitions, and confirm the authoritative timeline separates recorded, planned, performed, and observed events.
- [ ] `/health`, readiness, and capabilities report the intended mode/bind/public URL/cookie state without secrets.
- [ ] Stop and report immediately for privacy breach, data loss, authority bypass, lost provenance, history rewrite, or unexpected public exposure.

Round-0 completion is usability evidence only. It is not real-field validation, scientific validation, diagnostic-accuracy validation, production certification, or release authorization.
