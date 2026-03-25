# Blueprint3D Modern

A modern, open-source 3D floor planner built with **Three.js** and **TypeScript**. Blueprint3D Modern is a complete rewrite of the classic blueprint3d library as a clean ES module, paired with a production-ready **Next.js 15** demo application featuring local IndexedDB storage — no backend required.

**[Live Demo →](https://blueprint3d-modern.vercel.app/)**

## Screenshots

![3D Floor Planner](./docs/screenshot-1.png)

*3D view with real-time context menu for item dimensions*

![Item Catalog](./docs/screenshot-2.png)

*Furniture catalog with categorized browsing*

---

## Features

- **2D/3D View Toggle** — Switch between a top-down floorplan editor and an interactive 3D perspective
- **Wall Drawing** — Draw, move, and delete walls with snapping and measurement overlays
- **Furniture Placement** — Drag-and-drop items from a categorized catalog (beds, sofas, tables, chairs, wardrobes, lights, storage, doors, windows, bathroom fixtures, and more)
- **Item Controls** — Resize, rotate, and lock items in place; real-time dimension display in any unit
- **Texture Customization** — Apply floor and wall textures per room surface
- **Room Templates** — Start from a blank canvas or pre-built room layouts
- **Save & Load** — Persist floor plans to browser **IndexedDB** — no account, no server
- **My Floor Plans** — Browse, load, and delete saved designs with thumbnail previews
- **Multi-language** — Built-in i18n support: English, 简体中文, 繁體中文
- **Unit System** — Inches/feet, meters, centimeters, or millimeters
- **Responsive** — Works on desktop and touch devices

---

## Repository Structure

```
blueprint3d-modern/
├── src/                        # Core library (TypeScript + Three.js)
│   ├── blueprint3d.ts          # Main Blueprint3d class
│   ├── constants.ts
│   ├── core/                   # Utils, configuration, dimensioning, events
│   ├── model/                  # Floorplan, Corner, Wall, Room, Scene
│   ├── items/                  # Item types (floor, wall, in-wall, etc.)
│   ├── three/                  # Three.js renderer, controller, HUD, lights
│   ├── floorplanner/           # 2D canvas floorplan editor
│   ├── loaders/                # OBJ/MTL model loader
│   ├── indexdb/                # Template persistence via IndexedDB
│   ├── types/                  # Shared TypeScript types
│   └── templates/              # Built-in JSON room templates
│
├── app/                        # Next.js 15 demo application
│   ├── app/[locale]/           # Locale-aware routing (en / zh / tw)
│   ├── components/
│   │   ├── blueprint3d/        # All UI components (20+)
│   │   └── ui/                 # shadcn/ui base components
│   ├── services/
│   │   └── storage.ts          # IndexedDB CRUD (replaces any backend API)
│   ├── messages/               # i18n JSON files (en, zh, tw)
│   ├── i18n/                   # next-intl routing & request config
│   ├── hooks/                  # use-window-size, use-media-query
│   ├── stores/                 # Zustand stores
│   ├── lib/                    # utils, constants, blueprint-templates config
│   └── types/                  # Blueprint type definitions
│
└── docs/                       # Screenshots and assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) 8+

### Installation

```bash
git clone https://github.com/charmlinn/blueprint3d-modern.git
cd blueprint3d-modern

# Install root dependencies (core library)
pnpm install

# Install app dependencies
cd app && pnpm install
```

### Development

```bash
# From repo root
pnpm dev

# Or directly in app/
cd app && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
cd app && pnpm build
```

---

## Core Library (`src/`)

The `src/` directory is a standalone TypeScript library that can be used independently of the Next.js app.

### Quick Start

```typescript
import { Blueprint3d } from './src/blueprint3d'

const blueprint = new Blueprint3d({
  floorplanContainer: 'floorplan',   // 2D canvas container id
  threeContainer: 'three',           // 3D canvas container id
  textureDir: '/textures/'
})

// Load a saved floor plan
blueprint.model.loadSerialized(jsonString)

// Save the current state
const json = blueprint.model.exportSerialized()
```

### Key Classes

| Class | Description |
|-------|-------------|
| `Blueprint3d` | Root class — wires together the model, 2D floorplanner, and 3D renderer |
| `Model` | Owns the `Floorplan` and `Scene`; handles serialize/deserialize |
| `Floorplan` | Wall and corner graph; emits geometry change events |
| `Floorplanner` | 2D canvas controller (draw / move / delete modes) |
| `ThreeMain` | Three.js scene setup, camera, raycasting, item interaction |
| `Item` / subtypes | Furniture items: `FloorItem`, `WallItem`, `InWallItem`, etc. |
| `Factory` | Loads OBJ+MTL models from URL and instantiates the right `Item` subtype |

---

## Demo App Components (`app/components/blueprint3d/`)

| Component | Description |
|-----------|-------------|
| `Blueprint3DApp` | Top-level client component, dynamic-imported to avoid SSR issues |
| `Blueprint3DAppBase` | Core logic: state management, save/load, thumbnail generation |
| `TopNavBar` | Mode tabs (Edit / Add Items / My Floor Plans / Settings) |
| `FloorplannerControls` | 2D mode toolbar (Draw Walls / Move Walls / Delete / Done) |
| `CameraControls` | 3D camera reset and orbit help button |
| `ViewToggle` | 2D ↔ 3D toggle switch |
| `ItemsDrawer` | Slide-out panel with `ItemsList` |
| `ItemsList` | Categorized furniture grid with search |
| `ContextMenu` | Per-item popup: resize (W/D/H), lock in place |
| `TextureSelector` | Floor and wall texture picker |
| `MyFloorplans` | Saved designs grid/list with load and delete |
| `SaveFloorplanDialog` | Modal to name and save a floor plan |
| `NewFloorplanDialog` | Modal to start a new floor plan (clears current) |
| `SettingsDialog` / `Settings` | Unit system and language preferences |
| `TemplateSelector` | Room-type tabs with pre-built templates |
| `BedSizeInput` | In-context bed dimension editor |

---

## Storage (`app/services/storage.ts`)

Floor plans are persisted entirely in the browser using **IndexedDB** — no server or account needed.

```typescript
import { blueprintStorage } from '@/services/storage'

// List all saved floor plans
const plans = await blueprintStorage.list()

// Save a new floor plan
const plan = await blueprintStorage.create({
  name: 'My Bedroom',
  roomType: 'bedroom',
  layoutData: blueprint.model.exportSerialized(),
  thumbnailBase64: canvas.toDataURL()
})

// Load a floor plan
const plan = await blueprintStorage.get(id)

// Delete a floor plan
await blueprintStorage.delete(id)
```

**Database:** `blueprint3d_floorplans` · **Store:** `floorplans`

---

## Internationalization

The app uses [next-intl](https://next-intl-docs.vercel.app/) with three built-in locales:

| Code | Language |
|------|----------|
| `en` | English |
| `zh` | 简体中文 |
| `tw` | 繁體中文 |

Translation files live in `app/messages/{locale}.json`. To add a new language, add the locale to `app/i18n/routing.ts` and create the corresponding `messages/{locale}.json`.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| 3D Renderer | [Three.js](https://threejs.org/) | 0.181.2 |
| Animation | [anime.js](https://animejs.com/) | 4.3.6 |
| Framework | [Next.js](https://nextjs.org/) | 15.5.14 |
| UI Runtime | [React](https://react.dev/) | 19.2.4 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | 4.2.2 |
| Components | [Radix UI](https://www.radix-ui.com/) primitives | — |
| State | [Zustand](https://zustand-demo.pmnd.rs/) | 5.0.12 |
| Animations | [Framer Motion](https://www.framer.com/motion/) | 11.18.2 |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) | 3.26.5 |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) | 1.7.4 |
| Storage | IndexedDB (browser-native) | — |
| Language | TypeScript | 5.x |

> **Note on Three.js r0.181:** This release uses the new `WebGPURenderer` path for optional GPU acceleration. Blueprint3D Modern still uses the stable `WebGLRenderer` — the `three/examples/jsm` ESM imports are resolved via webpack alias to ensure the app's local `node_modules` copy is always used, avoiding version mismatches when `src/` sits outside the Next.js app directory.

---

## Roadmap

Items marked ✅ are shipped. Everything else is planned or open for contribution.

### Core Library

- [x] ES module rewrite (no more globals / jQuery)
- [x] TypeScript strict types throughout
- [x] Three.js r0.170+ compatibility (BufferGeometry, `WebGLRenderer`)
- [x] anime.js v4 camera animation
- [x] IndexedDB template store
- [ ] Vite build output — publish `src/` as a proper npm package (`blueprint3d-modern`)
- [ ] Unit tests for model layer (Floorplan, Corner, Wall graph)
- [ ] GLB/GLTF model support alongside OBJ/MTL
- [ ] Undo / Redo history stack
- [ ] Wall thickness configuration per wall
- [ ] Multi-room / multi-floor support

### Demo App

- [x] Next.js 15 App Router with `[locale]` routing
- [x] IndexedDB storage (save / load / delete — zero backend)
- [x] Thumbnail generation on save
- [x] Dark mode (CSS variables)
- [x] 3 locales: en / zh / tw
- [ ] Export floor plan as PNG / SVG / PDF
- [ ] Import floor plan from JSON file
- [ ] Drag-to-reorder saved floor plans
- [ ] Duplicate an existing floor plan
- [ ] Share floor plan via URL (base64-encoded state or short link)
- [ ] More room templates (kitchen, bathroom, office, studio)
- [ ] More furniture items and texture packs
- [ ] Mobile touch gesture improvements (pinch-zoom, two-finger pan)
- [ ] Keyboard shortcuts cheat sheet

### Infrastructure

- [ ] Publish core library to npm
- [ ] Add Storybook for UI component catalog
- [ ] GitHub Actions CI (type-check + build on every PR)
- [ ] Vercel / Netlify one-click deploy button

---

## Contributing

Contributions are welcome! Please open an issue or pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes
4. Push and open a Pull Request

---

## License

MIT © [charmlinn](https://github.com/charmlinn)

See [LICENSE](./LICENSE) for full text.
