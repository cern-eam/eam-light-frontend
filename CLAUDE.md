# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

EAM Light Frontend is a React 18 + Vite SPA that provides a simplified UI over Infor EAM. All data goes through [eam-light-backend](https://github.com/cern-eam/eam-light-backend), which acts as a facade/proxy to Infor EAM. The README still mentions create-react-app, but the build is now Vite.

## Commands

Uses yarn 1 (`packageManager` in package.json).

- `yarn dev` – Vite dev server (port `VITE_PORT`, default 3000). `/rest`, `/apis` and `/SSO` are proxied to `localhost:${VITE_BACKEND_PORT:-8080}`, so a local backend is expected.
- `yarn build` – production build into `build/` (see `vite.config.js`).
- `yarn lint` – ESLint (flat config in `eslint.config.js`).
- There is no test suite.

## Environment

Configured with `VITE_*` variables (`.env`, `.env.development`): `VITE_BACKEND` (leading slash, no trailing slash), `VITE_PUBLIC_URL` (router basename), `VITE_LOGIN_METHOD` (`STD` / `OPENID` / …, must match the backend's `EAMLIGHT_AUTHENTICATION_MODE`), `VITE_CERN_MODE`, `VITE_MULTI_ORG`, and Keycloak settings. `vite.config.js` also maps some of them onto legacy `process.env.*` names (`PUBLIC_URL`, `REACT_APP_BACKEND`, `REACT_APP_CERN_MODE`). Code reads them through either `import.meta.env.VITE_*` or those legacy names.

## Architecture

**The `eam-components` dependency.** Much of the UI and plumbing comes from the sibling `cern-eam/eam-components` library, pinned by git tag in package.json and imported from `eam-components/dist/...`. That includes inputs (`inputs-ng`), grids, the theme, the `ajax` axios wrapper, and `useFieldsValidator`. `eam-rest-tools` provides `GridRequest` and `transformResponse` for grid/LOV queries. If behaviour lives in one of these packages, change it there and bump the tag. `resolve.preserveSymlinks` is on so a locally linked copy works.

**Bootstrapping.** `src/index.jsx` installs an axios request interceptor on the shared `eam-components` Ajax instance. With `OPENID` login it refreshes the Keycloak token and sends it as a Bearer token. Otherwise it sends `INFOR_USER`, `INFOR_PASSWORD` and related headers from `useInforContext`. `src/Eamlight.jsx` loads user data, application data and screen layouts, then defines the `react-router-dom` v5 routes inside `ApplicationLayout`. `src/bridge/` handles `postMessage` communication for iframe embedding.

**API layer (`src/tools/WS*.js`).** Each file is a singleton class wrapping the backend endpoints for one domain (work orders, equipment, parts, and so on), built on `WS._get/_post/_put/_delete`. Entity CRUD mostly goes through `/proxy/...` endpoints. LOVs and grids are built as `GridRequest`s and go through `WSGrids.getGridData`. Entity identifiers are `code#org` strings encoded with `encodeCodeOrg` from `src/hooks/tools.js`.

**State.** Global state lives in Zustand stores in `src/state/` (user data, application data, screen layouts, snackbar, hidden regions, equipment tree, and so on). There is no Redux.

**Entity screens: the core pattern.** Record views (Workorder, Equipment asset/position/system/location/NCR, Part) are built on `src/hooks/useEntity.js`:
- The page passes WS CRUD functions (`create/read/update/delete/new`), `postActions`, field-change `handlers` (keyed by comma-joined xpaths), `entityProperty`/`screenProperty` (keys into user data and layouts), `entityCodeProperty`/`entityOrgProperty` xpaths, and a `layoutPropertiesMap`.
- `useEntity` owns entity state, loading, readOnly, revision control, custom fields, validation and routing (`entityURL` + `:code`). It returns `register(layoutKey, valueKey?, onChangeCustomHandler?)`, which builds input props from the Infor **screen layout** (`screenLayout.fields[layoutKey]`: xpath, type, attribute, labels). `layoutPropertiesMap` (for example in `WorkorderTools.jsx`) overrides or extends those props per field: `alias`, `extraProps` (an object or a `ctx => ({...})` function), `autocompleteHandlerData`, `link`, `clear`, `noOrgDescProps`.
- Values are converted between EAM and UI formats by `toEAMValue` and `fromEAMValue` in `src/hooks/tools.js`.
- The page lists its regions in `getRegions()` and renders them with `ui/components/entityregions/EntityRegions`. Layout-driven regions use `ui/layout/ScreenBlock` and `ScreenContainers`, which render fields in the order of the Infor layout's blocks and containers. `*_BLOCKS` constants such as `WO_BLOCKS` map a region to its `block_N` and `cont_N` codes. `getScreenBlockRegionFlags` applies the layout attribute to the region: `H` hides it and `C` starts it collapsed.
- `useLayoutStore.applyOverrides` holds screen-specific tweaks to the fetched layouts.

Per-entity helpers sit next to their page (`*Tools.js(x)`). Shared entity helpers are in `src/ui/pages/EntityTools.jsx`. Search screens and grids use `SyncedQueryParamsEAMGridContext` so grid state stays in the URL.

**Imports.** `@` is aliased to `/src`.

## Release

User-facing changes go in `src/CHANGELOG.md`, which is rendered by the in-app release notes page. For Docker deployment, see `Dockerfile` and `docker/default.conf` (nginx, port 8080). The Dockerfile copies from `dist/`, but Vite writes to `build/`, so check that before relying on the image.
