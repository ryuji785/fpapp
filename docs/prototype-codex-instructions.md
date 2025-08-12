# Fix navigation and continue prototype

1. **Router configuration**: ensure `router/index.ts` defines named child routes matching menu keys (`dashboard`, `data-entry`, etc.).

2. **Navigation handler**: in `src/layouts/MainLayout.vue`, import `useRouter` and implement `openPanel(key)` to call `router.push({ name: key })`.  Remove Golden Layout panel opening from this handler if not needed for static pages.

3. **SideMenu**: either emit `open` events (current design) or wrap each menu item with `<router-link :to="{ name: item.key }">`.

4. **Initialize drawer** closed by default (`ref(false)`) and keep overlay mode so the header never shifts.

5. Proceed with backend tasks: implement MyBatis mappers, MapStruct mappers, services, and REST APIs for incomes, expenses, summaries, and forecasts.  Use Flyway to create tables and seed initial data.

6. Replace mock data in Vue components with Axios calls to the new API, storing results in Pinia stores.

7. Create dashboard charts using real data (bar, pie, line).  Use JPY formatting (Intl.NumberFormat) and Japanese date/time.

8. Implement mock login page (no real security yet).

9. Prepare Docker Compose for Postgres + Spring Boot backend + Quasar front‑end.

10. Write unit tests (Java) and component tests (Vue Test Utils).  Configure CI if necessary.

Follow these instructions step by step; commit changes frequently with clear messages (e.g., `fix(router): enable navigation on menu selection`).
