# Project Guidelines

## Build and Test

- Install dependencies with `npm install`.
- Use `npm start` for local development. Vite is configured to open the browser and run on port 3000.
- On Windows, prefer `npm run buildWindows`. `npm run build` uses `cp` and then copies `build/index.html` to `build/404.html`, so it is better suited to Unix-like shells.
- Use `npm run preview` to inspect the production build.
- `npm run lint` exists, but the repo's ESLint migration is still parked in `eslint.config.mjs.notCompatYet`; do not assume lint will catch all style issues.
- `npm test` is a stale CRA-era command and the repo currently has only placeholder coverage. Do not claim test coverage unless you verified the command and the specific test.

## Architecture

- `src/App.tsx` is the app root. It wires `QueryClientProvider`, `DataContextProvider`, and `NotificationsProvider`, then renders the fixed header and `Router`.
- `src/Router.tsx` owns route definitions and route-level behavior. Preserve the existing Wouter routing pattern when adding pages or navigation.
- Keep route-level screens in `src/pages`, reusable UI and hooks in `src/common`, API and GraphQL access in `src/dao`, and shared types in `src/models`.
- `src/DataContext.tsx` is the main shared state and derived-data layer for players, seasons, franchises, and extended stats. Put new cross-page derived state there only when it is truly global.
- DAO files generally expose React Query hooks and talk directly to GraphQL or REST without a higher-level client such as Apollo. Follow existing query key and hook naming patterns when extending data fetching.

## Conventions

- Match the existing React and TypeScript style: tabs, semicolons, double quotes, and a 120 character width from `prettier.config.mjs`.
- This repo mixes Tailwind and styled-components. Follow the styling approach already used in the file or feature you are changing instead of converting it wholesale.
- Keep data-fetching logic in DAO modules and avoid moving API calls into page components unless the surrounding code already does so.
- Treat `window.debug` and `window.beta` as intentional feature or debugging toggles, not dead code.
- Avoid broad cleanup-only refactors in older files unless they are required for the task; prioritize targeted changes that preserve current behavior.

## References

- See `README.md` for local setup and the main library list.
- Use `src/App.tsx`, `src/Router.tsx`, `src/DataContext.tsx`, and `src/dao/cscStatsGraphQLDao.ts` as primary examples of app composition, routing, shared state, and data access patterns.