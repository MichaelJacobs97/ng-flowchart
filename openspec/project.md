# Project Context

## Purpose
Build and maintain `@michikowski/ngx-flowchart`, an Angular library for authoring flowchart-style process builders. The package targets product teams that need drag-and-drop canvases, free-floating steps, manual connector pads, and DAG (multi-parent) relationships while staying framework-native for Angular applications.

## Tech Stack
- Angular 20 (standalone components/directives, Angular CLI, ng-packagr)
- TypeScript (strict typing, partial compilation mode)
- SCSS for component-level styling
- Jasmine + Karma test harness (Angular CLI defaults)
- npm for distribution (`beta` dist-tag during active development)

## Project Conventions

### Code Style
- Follow Angular style guide (standalone APIs, explicit imports, constructor DI via `inject()`)
- TypeScript strictness: prefer explicit types, avoid `any`
- Component SCSS kept co-located; use BEM-style modifiers for state classes
- Preserve ASCII-only files unless existing content uses Unicode
- Avoid duplicating exports in `public-api.ts`; public surface mirrors real entry points only

### Architecture Patterns
- Canvas rendering handled via services (`CanvasRendererService`, `NgFlowchartCanvasService`) coordinating DOM updates and data model
- Steps implemented as standalone components with shared directive (`NgFlowchartStepDirective`) and registry service
- Flow data modeled as DAG via `NgFlowchart.Step`/`Connector` classes; serialization via `NgFlowchart.Flow.toObject()/toJSON()`
- Manual connectors rendered as Angular components layered over the canvas, supporting multi-parent relationships and labeled connectors
- Assets (TS/HTML/SCSS) exported through ng-packagr `assets` config to keep source available to consumers

### Testing Strategy
- Component/unit tests live beside sources (`*.component.spec.ts`) and execute through Angular CLI (Jasmine/Karma)
- Prioritize regression tests for canvas interactions, connector logic, and serialization when behaviors change
- Manual smoke testing via demo application (`ng serve` on sample app paths such as `/action-plans/create`) before publishing

### Git Workflow
- Increment semantic versions in `projects/ngx-flowchart/package.json`; beta iterations use `1.x.x-beta`
- Publish workflow: `npm run build` → `cd dist/ngx-flowchart` → `npm publish --tag beta`
- Keep commits focused per feature/fix; generated commit messages accepted via tooling when available
- Avoid reverting user changes; respect dirty working tree per contributor instructions

## Domain Context
- Targets low-code/automation builders needing visual flow authoring, including action plan editors
- Must support free-floating nodes, manual connector pads, and DAG relationships (steps can have multiple parents)
- Prioritize smooth drag-drop UX, connector re-rendering, and immediate structural updates when linking steps

## Important Constraints
- Library consumers expect Angular DI compatibility; directives/components must be standalone-ready
- Connector interactions must remain accessible (pointer events, keyboard focus) and visually clear (labels should not overlap paths)
- Source files ship in npm package, so changes should maintain consumer readability and avoid leaking internal experimental APIs

## External Dependencies
- Angular packages (`@angular/core`, `@angular/common`) as peer dependencies
- `tslib` runtime helper dependency
- Tooling: Angular CLI, ng-packagr, Node.js/npm registry
