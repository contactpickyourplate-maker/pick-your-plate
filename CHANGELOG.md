# PYP Prototype Changelog

All changes to `/Users/jessereiner/Desktop/PYP/prototype.html` and associated assets.

---

## Session 1

### Child App — iPad

- **Drag prompt copy** — Removed `!` from "Drag food to start!", capitalised "Drag"
- **Food images** — Replaced all CSS shape placeholders with photorealistic PNGs (28 individual food images cropped from sprite sheet via Python/Pillow)
- **Plate item size** — Increased dropped food items on the plate by 20% (size 124 → 149)
- **Plate item jiggle + remove** — Long-press any item on the plate triggers staggered jiggle animation; tap while jiggling to remove
- **Drag ghost fix** — Fixed native browser drag stealing pointer events, causing items to disappear on reposition (`draggable={false}`, `pointerEvents: none` on `<img>`)
- **Item position jump fix** — Restored `transform: translate(-50%, -50%)` to item inline style after jiggle animation was added (keyframe `fill-mode` revert was stripping it)
- **Platey welcome wave** — Platey image waves on load of the default iPad screen (`ppWelcomeWave` keyframe, 2.4s)
- **Platey blink** — Platey blinks periodically on the default iPad screen (`ppBlink` keyframe, every 5s)
- **Done button colour** — Kitchen window Done button updated to match the dark sage green used elsewhere in the app

### Child App — Confirmation Screen

- **Platey sprite** — Added rotating platey sprite (from `platey-sprites.png`, 25 characters) to the confirmation overlay; advances to next sprite on each submission
- **Platey alignment** — Fixed platey being off-centre; pulled out of text wrapper div so it becomes a proper flex item
- **Plate size** — Reduced confirmation plate from 504px to 430px so the full stack fits the screen comfortably
- **Food item size on confirmation** — Added `itemSize` prop to `Plate` component; confirmation screen uses 119px (20% smaller than interactive 149px)
- **"Done" button** — Replaced unlabelled green checkbox with a labelled pill button reading "Done"; sized down 20% from original
- **Button spacing** — Added `marginTop: 16` to "Done" button to prevent crowding against the plate
- **Gap tightening** — Reduced confirmation overlay `gap` from 24px to 16px

### Caretaker App — iPhone

- **Red dot logic** — Activity tab red dot now only appears after a plate has been successfully submitted; fixed regression where switching tabs re-triggered it. Uses derived state (`pickedPlate !== lastSeenPlate`) — no `useEffect`
- **Swipe-to-dismiss** — Notification banner on Activity screen is swipeable left/right to dismiss
- **Interpretation layer** — Activity screen now shows computed insight copy based on comparison between current plate and `SAVED_MENUS_DATA` history:
  - First plate ever → "Mira built her first plate."
  - Mix of new + familiar foods → "X familiar, Y new."
  - All new foods → "One new food today."
  - Repeated sessions → "Mira's Nth plate this week."
  - All familiar → "Mira chose familiar foods today."
  - `insightTag` chip (sage green) renders when non-null
  - Both notification banner and main heading use computed `headline` / `subline`

### Animations Added

| Name | Trigger | Description |
|------|---------|-------------|
| `ppPlacedIn` | Food dropped on plate | Spring pop-in |
| `ppJiggle` | Long-press on plate | Staggered alternating tilt |
| `ppTap` | Food tile tapped | Quick scale pulse |
| `ppWelcomeWave` | iPad load | Platey rocks side to side |
| `ppBlink` | iPad idle (every 5s) | Platey briefly squints |
| `ppPlateyBounce` | Confirmation shown | Platey bounces in |
| `ppButtonBounce` | Menu saved | Save button elastic bounce |
| `dotPulse` | Unseen activity | Red dot pulses on Activity tab |
| `ppFall` | Confirmation overlay | Confetti pieces fall |
| `ppConfetti` | Confirmation overlay | Confetti bursts from centre |
| `ppFadeSlideUp` | Pantry item selected | "Add to Kitchen" slides up |

### Assets Added

| File | Description |
|------|-------------|
| `platey-sprites.png` | 5×5 sprite sheet of 25 platey characters (background flood-fill removed via Python/Pillow) |
| `platey-welcome.png` | Waving platey for iPad welcome state |
| `apple.png` … `yogurt.png` | 28 individual food PNGs (256×256, cropped from source sprite sheet) |

---

## Session 2

### Child App — iPad

- **Drag ghost** — Fixed blank white circle appearing when dragging food to the plate. Now uses the already-rendered food image element from the tray as the drag ghost (`e.currentTarget.querySelector('img')?.parentElement`)

### Caretaker App — Pantry Screen

- **"Food Catalog" header removed** — Removed from both the default view and the search results view
- **Sticky "Add to Kitchen" button** — On first item selection, an "Add to Kitchen" button slides up (`ppFadeSlideUp`) in the sticky bottom bar and remains visible while scrolling; replaces the in-scroll button that was buried at the bottom of the list
- **Bottom bar cutoff fix** — Increased bottom padding from 24px to 88px to clear the tab bar
- **"Done" removed** — Removed the secondary "Done" text button from the bottom of the pantry screen

### Caretaker App — Welcome / Onboarding Screen

- **New screen added** — `CareWelcome` component added as the initial screen for the caretaker iPhone app (`screen === 'welcome'`); tab bar hidden on this screen
- **"Let's Get Started" CTA** — Navigates to the Menus screen
- **Assets integrated** from `pyp_onboarding_asset_package.zip`:

| File copied to `/PYP/` | Used for |
|------------------------|----------|
| `pyp_logo_header.png` | PYP logo + "Pick Your Plate" wordmark |
| `onboarding_platey.png` | Waving platey in hero section |
| `step1_scene.png` | Step 1 illustration (platey with food) |
| `step2_scene.png` | Step 2 illustration (platey with phone) |
| `step3_scene.png` | Step 3 illustration (platey with tablet) |
| `step4_scene.png` | Step 4 illustration (platey with cutlery) |
| `phone_menu.png` | Phone mockup — step 1 |
| `phone_send_menu.png` | Phone mockup — step 2 |
| `phone_child_select.png` | Phone mockup — step 3 |
| `meal_plate.png` | Meal illustration — step 4 |

- **Design tokens applied** — Colors from `design_tokens.json`: navy `#19324A`, coral `#F5654D`, teal `#38B9C7`, green `#77BE55`, background `#FFF9F1`
- **Copy** — All text from `copy.json`
- **Step cards** — Each card: light-blue left panel with scene image + coloured number badge, bold navy text, phone/meal image right-aligned
- **Speech bubble** — CSS-built white card with triangle tail anchored bottom-left toward platey
- **Font** — Added Nunito 800/900 weights to Google Fonts import for logo and step card headings

---

*This file lives at `/Users/jessereiner/Desktop/PYP/CHANGELOG.md` and will be updated as the prototype evolves.*
