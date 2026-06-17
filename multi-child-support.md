# Multi-Child Support — Spec

**Status:** Deferred / informs current data model decisions
**Last updated:** May 15, 2026
**Owner:** Jesse

---

## Purpose

This document captures the design and implementation plan for supporting multiple children per caregiver account in Pick Your Plate. Multi-child is **not** in the initial launch scope, but the data model and several UX surfaces should be designed *now* to accommodate it. Retrofitting a single-child schema later is the expensive path.

The intent is that anyone (human or Claude Code) working on PYP today can use this doc to make schema and architecture decisions that won't need to be undone.

---

## Why this matters

Selective eating frequently runs in families. Parents with one selective eater often have a second child whose eating profile they also want to track, compare cautiously, or manage separately. Sibling food dynamics are a meaningful pain point that competitors (Goally included) address through profile systems.

Building this in later means:
- Migrating production user data (every child profile retroactively created from the parent record)
- Touching nearly every screen that displays child-specific state
- Re-doing COPPA consent flows for existing users

Building the data model right the first time means we can ship single-child UX and turn on multi-child UI later as a feature, not a refactor.

---

## Core data model decision

**Every piece of child-specific state must be keyed to a `child_id`, not a `user_id` (parent account).**

This applies to:
- Food preferences and acceptance history (tried / liked / neutral / declined states)
- Exposure counts per food item
- Meal session logs
- Streaks, achievements, badges
- Any adaptive recommendation state or personalization model
- Any per-child settings (dietary notes, sensory sensitivities, age, allergens)

### Suggested entities

```
ParentAccount
  - id
  - email
  - subscription_tier
  - coppa_consent_log[]    // see COPPA section below

ChildProfile
  - id
  - parent_account_id      // FK to ParentAccount
  - display_name
  - avatar_id
  - birth_month            // age band, not exact DOB — minimize PII
  - dietary_notes          // freeform, parent-entered
  - sensory_flags[]        // e.g. texture aversions, structured tags
  - created_at
  - is_active              // soft delete / archive

FoodPreference
  - id
  - child_id               // FK to ChildProfile — NOT parent_account_id
  - food_item_id
  - state                  // tried / liked / neutral / declined / never_offered
  - exposure_count
  - last_offered_at
  - updated_at

MealSession
  - id
  - child_id               // FK to ChildProfile
  - started_at
  - foods_offered[]
  - foods_selected[]
  - notes

Achievement / Streak entities: all keyed to child_id
```

### What stays shared

- The food library itself (the ~110-item catalog) is a single shared resource. Children have *preferences against* food items, not their own copies of them.
- Parent-level settings (notification preferences, subscription, account email).
- Any clinical/educational content (Division of Responsibility guidance, parent-facing articles).

### Single-child launch behavior

At launch, every `ParentAccount` has exactly one `ChildProfile` created during onboarding. The UI hides the existence of profile-switching entirely. Internally, every query already filters by `child_id`. Turning on multi-child becomes a UI feature flag, not a data migration.

---

## UX surfaces affected

### Onboarding
Today's flow (assumed): create account → set up your kid → done.

Future flow: create account → add your first child → optionally add another → done.

For launch: same as today, but the "set up your kid" step internally creates a `ChildProfile` row rather than writing preferences against the parent.

### Adding/managing children (post-launch)
Lives in the caregiver settings area. Adding a child triggers a new COPPA consent event (see below). Removing a child should soft-delete (archive) rather than hard-delete, to preserve history if the parent re-adds them.

### Child switcher
**Recommendation:** Netflix-style profile picker at app launch.

Rationale: Big tappable avatars are the most legible affordance for the 3–8 age range. Kids can self-select their profile in many households. The friction cost is acceptable because it's once-per-session.

**Alternatives considered:**
- *Switcher only in parent area, kids locked to one profile per session.* Cleaner data, but breaks down when one parent runs the app for two kids at the same meal.
- *Quick-swap inside the meal flow.* Risks mis-attribution of food choices to the wrong child. Reject.

**Sibling co-eating edge case:** When two kids eat together and the parent is logging for both, the recommended pattern is to run two separate meal sessions in parallel rather than logging once and tagging both. This keeps the data clean for personalization. Worth user-testing.

### Caregiver dashboard / insights
Per-child views only. No side-by-side sibling comparison.

This is a deliberate clinical decision. The Division of Responsibility framework actively discourages comparing siblings' eating, because comparison undermines child agency and can entrench identity around being "the picky one." The dashboard should make it *easy* to see one child at a time and *not provide* a comparative view, even if parents ask for it. This is part of our clinical credibility moat.

If parents want to see aggregate household data (e.g., "what foods does the whole family like?"), that's a different question we can answer without ranking kids against each other.

### Meal flow
Once a child profile is active, the meal flow itself doesn't change much. The food library is filtered by that child's preferences and exposure history. Achievements and streaks update against that child.

---

## Pricing / business model implications

Multi-child is a natural paid-tier feature. Common patterns in family apps:

- **Free:** 1 child profile. **Paid:** unlimited.
- **Free:** 1 child profile. **Paid:** up to 4.
- All tiers include unlimited children; paid tiers unlock other features.

Goally and similar apps generally gate additional profiles. This intersects with the broader monetization decision still to be resolved before launch — flagging it here so the decision happens once, not twice.

**Recommendation:** Don't lock in pricing tiers now, but build the entitlement check (`can_add_child(parent_account)`) as a function that currently always returns true. Easy to gate later.

---

## COPPA compliance

Each child profile represents a separate child whose data is collected under parental consent. This means:

- Consent is captured **per child profile creation event**, not once at account signup.
- The COPPA consent log on the `ParentAccount` should record an entry every time a child is added: `{child_id, consent_method, timestamp, ip_or_attestation_method}`.
- Removing a child should preserve the consent log entry but archive the profile.
- The consent UI when adding a second/third child can be lighter-touch than the first (parent has already been through verification), but the consent *event* still needs to be recorded.

Confirm specifics with COPPA counsel before launch. The data model above gives us the flexibility to implement whatever consent process counsel recommends.

---

## Implementation phases

### Phase 0 — Now (single-child launch)
- Build schema with `child_id` foreign keys everywhere child-specific.
- Onboarding creates one `ChildProfile` per `ParentAccount`.
- All queries already filter by `child_id`.
- No profile switcher UI; the active child is implicit.
- COPPA consent captured against the first (and only) child profile.

**Effort:** Marginal cost over a single-child schema. Mostly a naming discipline — call the foreign key `child_id` from day one.

### Phase 1 — Post-launch, feature-flagged
- Add "add another child" entry point in caregiver settings.
- Build the profile picker / switcher UI.
- Wire up per-child COPPA consent events.
- Add entitlement check for paid-tier gating (currently no-op).

**Effort estimate:** ~1–2 weeks design, ~2–3 weeks iOS engineering, assuming the Phase 0 schema discipline held.

### Phase 2 — Paid tier integration
- Connect entitlement check to subscription state.
- Marketing surface: communicate multi-child as a paid feature.

**Effort:** ~1 week, mostly product/marketing rather than engineering.

---

## Open questions

1. **Avatar system.** Do kids pick from a curated set, or can parents upload photos? Photos add PII / COPPA complexity. Recommendation: curated set only.
2. **Age handling when a child ages up.** A child added at age 4 will eventually be 8. Does anything in the experience change at age boundaries? Currently the food library skews toward kid-accepted foods regardless of age — confirm whether age-band tuning is needed.
3. **Account-to-account child transfer.** Divorced or co-parenting households may want a child profile to exist across two parent accounts. Likely deferred to Phase 3+; flagging it as a thing that will eventually be asked for.
4. **Sibling co-eating session UX.** Recommended pattern is parallel sessions, but worth user-testing with families that have multiple kids — they're the ones who'll feel the friction.
5. **Subscription tier shape.** What's free vs. paid? Decide alongside the broader monetization model.

---

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-15 | Build schema with `child_id` FKs at launch even though UI is single-child | Avoid expensive migration later |
| 2026-05-15 | No sibling comparison views in caregiver dashboard | Division of Responsibility framework; clinical credibility moat |
| 2026-05-15 | Profile picker pattern: Netflix-style at app launch | Best legibility for 3–8 age range |

Add new decisions here as they're made.
