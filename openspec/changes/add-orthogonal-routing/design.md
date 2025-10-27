## Context
The renderer currently draws connectors as single-line diagonals derived from start/end coordinates. Restoring orthogonal routing requires reintroducing bend calculation without re-breaking DAG features (multi-parent, free-floating steps, labels).

## Goals / Non-Goals
- Goals:
  - Produce 90° connectors dynamically at render time.
  - Keep serialization simple (no stored bend points).
  - Maintain label clarity and manual connector UX.
- Non-Goals:
  - New toggleable styles (orthogonal will be the only mode).
  - Step layout changes or auto-spacing adjustments.

## Decisions
- Recompute bend points on each render to avoid stale paths after layout shifts.
- Derive lane offsets from connector order per target to reduce overlap.
- Keep labels anchored to the longest straight segment using existing padding logic.

## Risks / Trade-offs
- Lane offsets may still overlap in extreme densities; future enhancements might require smarter routing.
- Orthogonal routing may lengthen some paths, potentially intersecting other nodes—requires tuning.

## Migration Plan
1. Add pure helper functions for orthogonal path calculation with unit tests.
2. Integrate helpers into `CanvasRendererService` routing.
3. Validate with demo flows and adjust lane offset constants as needed.

## Open Questions
- Exact lane offset spacing; start with 12px and adjust after visual validation.
- Need for optional hook to customize routing strategy later?

