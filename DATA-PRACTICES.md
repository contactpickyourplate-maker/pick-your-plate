# Pick Your Plate — Data Practices

**Audience:** Internal reference for App Store Kids Category submission, COPPA counsel review, and privacy policy drafting.  
**Last updated:** 2026-05-23

---

## What we collect, where it lives, and why

### Device-only (localStorage — never leaves the device)

| Key | Contents | Retention | Purpose |
|-----|----------|-----------|---------|
| `pyp_childName` | First name or nickname entered by parent | Until parent resets or uninstalls | Personalizes the child-facing screen |
| `pyp_family_code` | 6-char random pairing code | Until parent resets or uninstalls | Links caregiver phone to child tablet |
| `pyp_kitchenIds` | List of food item IDs in the kitchen | Until parent resets or uninstalls | Persists caregiver's kitchen configuration |
| `pyp_savedMenus` | Array of named menus: `{ name, meal, ids[], childIds[], timestamp }` | Until parent resets or uninstalls | Shows meal history; drives texture insight panel |
| `pyp_lastMenu` | Most recently sent menu + sent-at timestamp | Cleared when child submits or after 2h | Allows menu re-send if tablet reconnects mid-session |
| `pyp_child_first_tries` | `[{ foodId, timestamp }]` — first time the child selected each food | Until parent resets or uninstalls | Powers the "First tries" counter on the activity screen |

**No food item IDs map to any personal identifier.** The catalog is a fixed shared list (~110 items). Preferences are stored as selections against catalog IDs, not against the child's name or any unique identifier.

**No account is created.** There is no email address, password, or user ID anywhere in the system.

---

### Firestore (server-side, Firebase project `pick-your-plate-ba3b7`)

| Document | Contents | Retention |
|----------|----------|-----------|
| `sessions/{familyCode}` | `{ status, menu, childName, selection, sentAt, submittedAt, deleteAt }` | Auto-deleted 24h after last write via Firestore TTL on `deleteAt` field. Explicitly deleted when parent taps "New menu." |

**What "menu" and "selection" contain:** arrays of food catalog IDs (e.g. `['apple', 'chicken', 'broccoli']`). No names, no photos, no free-text input from the child.

**What "childName" contains:** the first name or nickname the parent typed during setup. This is the only PII-adjacent field in Firestore and it exists solely to display on the caregiver screen. It is never used as a key, never indexed, and is deleted with the session document.

**The family code is not tied to any account.** It is a random 6-character string generated server-side with `crypto.randomBytes`. If a family loses their code, they generate a new one. No recovery mechanism exists, by design.

---

## What we do not collect

- No precise or approximate location
- No device identifiers (IDFA, IDFV, Android Ad ID)
- No IP address logging (beyond what Firebase/Vercel retain at infrastructure level — see their privacy policies)
- No photos, audio, or video
- No behavioral advertising data
- No third-party analytics SDK
- No crash reporting SDK (as of prototype stage)
- No age or date of birth (the app does not ask)
- No health or medical information

---

## Third-party data processors

| Processor | What they receive | Link |
|-----------|-------------------|------|
| Google Firebase / Firestore | Session documents as described above | [firebase.google.com/support/privacy](https://firebase.google.com/support/privacy) |
| Vercel | HTTP requests to `/api/create-session`; standard server logs | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy) |

No other third-party processors. Pusher was removed from the stack on 2026-05-23.

---

## COPPA posture

PYP is operated by a parent or legal guardian on behalf of a child. The app is designed so that **the caregiver is the account holder and the only party who provides personal information** (the child's nickname). The child interacts with the tablet UI but does not enter any data — they tap food images.

Key design decisions that support COPPA compliance:

1. **No child account.** The child has no login, no profile, no identifier. The caregiver's device holds the session.
2. **No persistent child identifier on the server.** The `familyCode` identifies a session, not a child. It rotates whenever the parent resets.
3. **Nickname only, not full name.** The setup screen labels the field "What should we call them?" — not "Child's full name."
4. **No behavioral advertising.** No ad network, no targeting, no profiling.
5. **Server-side data auto-expires.** The TTL on session documents means Firestore holds no data for more than 24 hours without an active session. All persistent food preference data lives on the caregiver's device, under the parent's control.
6. **No data sharing with third parties** beyond the infrastructure processors listed above, neither of whom receive the child's name or any identifying information in a form they can act on.

**Open item before launch:** COPPA requires verifiable parental consent before collecting personal information from children under 13. Because the account holder is the parent and the only PII collected (the child's nickname) is entered by the parent about their own child, counsel should confirm whether the standard "parent is the user" exemption applies, or whether a consent flow is required at account creation.

---

## Apple Kids Category checklist

Apple's Kids Category rules that apply to PYP:

| Rule | Status |
|------|--------|
| No behavioral advertising | ✓ No ad network present |
| No third-party analytics that track users | ✓ No analytics SDK |
| No in-app purchases without parental gate | N/A — no IAP in prototype |
| No links out of the app without parental gate | Confirm before submission — check all external links in UI |
| No social networking features | ✓ None |
| Privacy policy required | **Pending** — must be hosted at a public URL before submission |
| Data collection disclosed in App Store Connect privacy nutrition label | **Pending** — complete nutrition label using this document |

### App Store Connect nutrition label entries

Based on current data practices:

**Data Not Linked to You:**
- Name (child's nickname — entered by parent, used only for display, deleted with session)

**Data Not Collected** (confirm each before submission):
- Contact info, Health & fitness, Financial info, Location, Sensitive info, Contacts, User content, Browsing history, Search history, Identifiers, Diagnostics, Other data

---

## Retention summary

| Data | Location | Deleted when |
|------|----------|-------------|
| Session document | Firestore | 24h TTL, or parent taps "New menu," whichever is first |
| Child's nickname (in session) | Firestore | With the session document |
| Food preferences, saved menus, first-try log | Device localStorage | Parent taps "Reset child setup" or uninstalls app |
| Family code | Device localStorage | Parent taps "Reset child setup" or uninstalls app |

---

## Enabling the Firestore TTL policy

The `deleteAt` timestamp field is written to every session document. To activate automatic deletion, enable the TTL policy once in the Firebase console:

1. Firebase Console → Firestore → **Indexes** tab → **TTL policies**
2. Click **Add TTL policy**
3. Collection group: `sessions`
4. Timestamp field: `deleteAt`
5. Save

Firestore processes TTL deletions within 72 hours of the `deleteAt` timestamp (not exactly at the timestamp). This is acceptable for a 24h session; in practice documents are deleted within 1–3 days. If exact deletion timing is required, switch to a scheduled Cloud Function.
