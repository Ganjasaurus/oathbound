# Oathbound — The Living Duel

A playable browser prototype of a medieval fantasy auto-fighter. Build a fighter's equipment and instincts, then watch the tactical AI choreograph a continuous 3D duel.

## Run

Requires Node.js 22.12 or newer.

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:5173. You can also double-click **PLAY.bat**. The current workspace already has its dependencies installed.

`npm run build` creates `dist/`. `npm run preview` serves that production build. `npm test` runs combat and controller tests.

## Playing

- **Versus AI:** customize your fighter and enter the arena against an Initiate, Seasoned, or Master opponent.
- **Local duel:** player one builds first, then player two. Choose **Pass & play** for one shared controller or **Two controllers** for separate pads.
- **Single duel / best of three:** in a series, choose **Adapt loadouts** between rounds to revise instincts and equipment for both players.
- Four disciplines: Vanguard, Duelist, Reaver, Spellblade.
- Four weapons: sword and shield, greatsword, twin blades, runic glaive.
- Three close-range spells: Ember Strike, Winter Sigil, Aegis Pulse.
- Ten relics: equip up to three within eight marks. Instinct relics change reading, feinting, countering, combinations, or recovery; attribute relics change power, health, speed, guard, or magic.
- Set pressure, discipline, magic affinity, fighter name, and heraldry.
- Builds and rounds won are saved in this browser.

### Xbox controller

Connect a standard Xbox-compatible pad and press a button after the page is focused. Browsers expose controllers only after interaction.

| Action | Xbox | Keyboard |
| --- | --- | --- |
| Navigate | D-pad / left stick | Arrows / Tab |
| Select | A | Enter |
| Lock in build | Menu / Start | Select the main button |
| Back / pause menu | B / Menu | Escape |
| Forge category | LB / RB | Q / E |
| Random build in forge | X | Select shuffle |
| Pause fight | A | Space |
| Cycle speed | X | F |
| Cycle camera | Y | C |
| Replay choreography | Replay button | R |
| Sound | Sound button | M |

D-pad left/right adjusts a focused slider or selector. In two-controller mode, the first detected pad belongs to P1 and the second to P2. A keyboard and mouse remain usable. Vibration depends on the browser and controller.

## Combat

The tactical planner resolves a complete seeded fight before playback. Decisions consider range, fatigue, attack history, style, weapon, priorities, and relic effects. It creates opening probes, guard pressure, feints, parries and ripostes, evasions, high and low attacks, guard breaks, launchers, combo follow-ups, recovery, and limited-mana magic.

Health changes at animation contact. Every move has preparation, action, and recovery poses. Articulated armor and limbs interpolate with quaternion blending, while root motion, cloth, weapon trails, sparks, and camera direction make the exchanges continuous. The AI lens explains resolved decisions without revealing the next outcome.

Replay reuses the exact plan and seed. Playback offers pause, 0.5× / 1× / 1.5× / 2× speed, a fixed side camera, and replay scrubbing. A decision at the bell uses remaining health percentage. AI levels use the same stats and gear budget; Master favors tactical relics.

## Prototype scope

The models and animations are procedural, with no downloaded character assets. This is a tactical simulation with handcrafted motion, rather than an LLM or physics-driven combat engine. There is no manual attack input during the fight; controller play centers on building and directing the viewing experience. No online multiplayer or ranged weapons.

Use Chrome or Edge with hardware acceleration for best results. Graphics settings include a lower-cost mode. The interface adapts to smaller screens. Fonts fall back to local serif and sans-serif fonts when offline.

## Source

- `src/combat.js`: seeded planner, move catalog, stats, item behavior.
- `src/arena.js`: Three.js arena, procedural fighters, pose blending, effects, cameras.
- `src/main.js`: forge, player handoff, match and replay flow, persistence.
- `src/input.js`: standard controller input and procedural audio.
- `src/style.css`: interface and responsive layouts.
- `tests/combat.test.js`: deterministic replay, timeline/resource invariants, relic behavior, and Xbox mappings.

## Verification

Six automated checks pass: deterministic choreography, every discipline/weapon pairing, health/stamina/mana bounds, damage at contact, statistically measurable instinct-relic effects, valid opponent budgets, and Xbox action mapping/repeat behavior.

Browser checks covered an AI duel, a full local best-of-three match, shared-controller handoff, separate player builds, equipment limits, adaptation between rounds, pause/resume, replay scrubbing, and replay scoring without duplicate wins. The portrait layout was checked at 390 × 844.

A physical Xbox controller was not connected during development. Standard input mapping is implemented and tested in code; physical controller detection, two-pad routing, and vibration still need a hardware check.
