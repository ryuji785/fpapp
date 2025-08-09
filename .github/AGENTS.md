
# AGENTS.md

## 📘 Project Name
FPApp (Financial Planning Application)

## 📌 Project Overview
FPApp is a web-based financial planning application designed to help users visualize future cash flow, manage expenses, simulate financial scenarios, and build assets. It is intended for use by two-person households with complex income/expense structures and multiple credit cards.

---
## ✅ Commit Rules
- Commits may only be pushed after both the frontend (`npm run build`) and backend (`./gradlew build`) builds complete successfully with no warnings or errors. Partial builds or builds with warnings/errors must be fixed before committing.

---

## 🖥️ Frontend
- **Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Framework**: [Quasar](https://quasar.dev/)
- **Layout**: Golden Layout (used only in main content area)
- **Routing**: Vue Router
- **State Management**: Pinia

---

## 🧪 Backend
- **Framework**: Spring Boot 3.5.x
- **Language**: Java 17
- **Database**: PostgreSQL 17.4
- **Migration Tool**: Flyway 10.14.0
- **API Style**: RESTful
- **Design**: Domain-Driven Design (DDD)

---

## ✨ Key Features (Planned & Implemented)
- ✅ Household income and expense tracking
- ✅ Categorized spending with fixed cost tagging
- ✅ Multi-card billing & summary support
- ✅ Monthly & yearly cash flow forecasting
- ✅ Future asset simulation with interest projection
- 🛠️ Scenario planning for life events

---

## 🧩 UI Layout Structure

The layout is composed of:

### 📐 Base Structure
- **TopAppBar.vue** (green header)
  - Left: Hamburger icon (toggles drawer)
  - Center: Title "FPApp"
  - Right: User icon
- **SideMenu.vue**
  - Drawer toggled by hamburger
  - Fixed layout (does not shift the header)
  - Responsive: collapses on small screens
- **Main Content Area**
  - Golden Layout-based panel switching depending on menu selection

> 💡 Header must remain fixed during drawer toggle. The hamburger icon should animate to an "X" when the menu is open.

---

## 🧱 UI Component Conventions

| Component Type | Folder | Notes |
|----------------|--------|-------|
| Pages | `src/views` | Must match route path and menu label |
| Reusable UI | `src/components` | Header, drawer, form elements, etc. |

- Each component **must have a default export**:
  ```ts
  export default defineComponent({ ... })
  ```

- Match **menu name** and **component file name**:
  - Menu label: `Dashboard`
  - Component file: `DashboardView.vue`

- Common layout components include:
  - `TopAppBar.vue`
  - `SideMenu.vue`
  - `MainLayout.vue`

---

## 🖼️ Planned Screens and Mocks

| Screen             | File Name             | Description                                 |
|--------------------|------------------------|---------------------------------------------|
| Dashboard          | `DashboardView.vue`    | Overview of income, expenses, cards         |
| Data Entry         | `DataEntryView.vue`    | Form to register income and expense         |
| Cash Flow Table    | `CashFlowView.vue`     | Forecast future balance by month/year       |
| Event Planner      | `EventPlannerView.vue` | Plan life events (wedding, house, etc.)     |
| Asset Simulation   | `AssetView.vue`        | Project future financial assets             |
| Scenario Comparison| `ScenarioView.vue`     | Compare multiple future paths               |
| Settings           | `SettingsView.vue`     | Preferences and environment configuration   |

> All of the above should begin as mock views with hardcoded data.

---

## 📂 Project Structure (Frontend)

```
frontend/
├── src/
│   ├── components/        # Reusable UI components (header, drawer, inputs)
│   ├── views/             # Page components, mapped 1:1 to menu items
│   ├── layouts/           # Golden Layout + Main layout
│   ├── router/            # Route definitions
│   └── stores/            # Pinia stores (TBD)
```

---

## 💻 Development Status

| Area      | Status            |
|-----------|-------------------|
| Backend   | ✅ DB connection, entity scaffolding complete |
| Frontend  | 🚧 Layout under development (Quasar + Golden Layout) |
| Routing   | ✅ Vue Router active with page switching |
| UI        | 🛠️ Mock screens and dynamic layout in progress |

---

## 🤖 Notes for AI Agents (Codex / Copilot)

- Always use **Quasar** components like:
  - `<q-layout>`, `<q-header>`, `<q-drawer>`, `<q-page-container>`
- Use `defineComponent` and `export default` in `.vue` files
- Ensure menu label and component filenames match exactly
- Use dummy data for all screens; no backend needed yet
- When creating new pages:
  - Create `.vue` file in `views/`
  - Add corresponding route in `router/index.ts`
  - Add entry to side menu in `SideMenu.vue`

---

## 🧠 Environment Configuration
- Frontend: `.env` with Vite variables (`VITE_API_BASE_URL`)
- Backend: `application.properties` or `application.yaml` for database/API settings

---

## 📎 Purpose of This File
This `AGENTS.md` exists under `.github/` to guide AI tools like GitHub Copilot and OpenAI Codex in understanding this project's structure, goals, and conventions to generate contextually appropriate code.

---
