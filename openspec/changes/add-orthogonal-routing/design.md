## Context
The renderer currently draws connectors as single-line diagonals derived from start/end coordinates. Restoring orthogonal routing requires reintroducing bend calculation without re-breaking DAG features (multi-parent, free-floating steps, labels).

**Critical Issues Identified:**
- Connector arrows do not reach target nodes due to coordinate system mismatch between absolute canvas coordinates and relative container coordinates
- Manual connectors should use predefined step distances (stepGap) similar to tree layout instead of edge-based positioning

## Goals / Non-Goals
- Goals:
  - Produce 90° connectors dynamically at render time using absolute canvas coordinates.
  - Ensure connector arrows reach target nodes by fixing coordinate system transformations.
  - Use predefined step distances (stepGap) for consistent spacing similar to tree layout.
  - Keep serialization simple (no stored bend points).
  - Maintain label clarity and manual connector UX.
- Non-Goals:
  - New toggleable styles (orthogonal will be the only mode).
  - Step layout changes or auto-spacing adjustments.

## Decisions
- Recompute bend points on each render to avoid stale paths after layout shifts.
- Use absolute canvas coordinates directly in connector component without container-relative transformation.
- Fix coordinate system mismatch: `findClosestEndEdge` returns absolute canvas coordinates that should be used directly.
- Use predefined step distances (stepGap) for connector positioning similar to tree layout instead of edge-based calculations.
- Derive lane offsets from connector order per target to reduce overlap.
- Keep labels anchored to the longest straight segment using existing padding logic.

## Risks / Trade-offs
- Lane offsets may still overlap in extreme densities; future enhancements might require smarter routing.
- Orthogonal routing may lengthen some paths, potentially intersecting other nodes—requires tuning.

## Migration Plan
1. Fix coordinate system transformation in `NgFlowchartConnectorComponent` to use absolute canvas coordinates directly.
2. Update `findClosestEndEdge` method to use stepGap-based positioning instead of edge-based calculations.
3. Add pure helper functions for orthogonal path calculation with unit tests.
4. Integrate helpers into `CanvasRendererService` routing.
5. Validate with demo flows and adjust lane offset constants as needed.

## Open Questions
- Exact lane offset spacing; start with 12px and adjust after visual validation.
- Need for optional hook to customize routing strategy later?

