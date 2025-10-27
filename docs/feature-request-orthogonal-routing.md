# Feature Request: Restore Orthogonal Connector Routing

## Overview
- **Author:** AI assistant (on behalf of project maintainer)
- **Status:** Completed ✅
- **Release:** v1.3.1
- **Tracking ID:** FR-orthogonal-routing

## Background & Motivation
The current `@michikowski/ngx-flowchart` package supports free-floating steps, manual connector pads, multi-parent DAG structures, and connector labels. During DAG support work the connector renderer was simplified to draw direct diagonal paths between start and end steps. Diagonals make dense diagrams harder to interpret, especially when multiple parents connect to the same child. Historically the library rendered orthogonal connectors (horizontal/vertical segments with 90° bends); this feature request aims to restore that clarity while preserving the newer capabilities.

## Problem Statement
- Diagonal connectors overlap steps and each other, decreasing legibility in complex DAG flows.
- Labels on diagonals can appear skewed or clip against other elements despite padding.
- Consumers expect right-angled connectors aligned with typical flowchart conventions.

## Goals
- Render all connectors using orthogonal segments (horizontal + vertical) with right-angle bends.
- Keep multi-parent / multi-child DAG support fully intact.
- Maintain connector labels with adequate padding and intuitive positioning.
- Adjust routing dynamically whenever the canvas re-renders (drag, resize, pretty layout) without persisting stale bend points.
- Provide deterministic offset “lanes” when multiple parents target the same step to minimize overlap.

## Non-Goals
- Introducing alternative routing styles (e.g., diagonal or bezier toggles).
- Changing step layout algorithms beyond what is necessary for connector routing.
- Persisting user-defined bend points or interactive routing editors.

## Proposed Solution
1. **Dynamic Orthogonal Routing**
   - Update `CanvasRendererService.drawConnectors` (and supporting helpers) to generate orthogonal paths at render time.
   - Compute bend points based on start/end positions and canvas orientation (`VERTICAL` vs `HORIZONTAL`).
   - Avoid storing bend metadata in the serialized model; rely on deterministic calculations each render.

2. **Lane Offsets for Multi-Parent Links**
   - For connectors sharing the same target, stagger their orthogonal paths by fixed offsets to minimize overlap.
   - Derive offsets from connector index per target to keep routing stable across rerenders.

3. **Label Placement**
   - Place labels on the longest straight segment of the orthogonal path (or midpoint of the combined segments).
   - Retain existing padding logic so text sits cleanly within the connector’s bounding box.

4. **Compatibility & Serialization**
   - Serialization retains only `startStepId`, `endStepId`, `label`, and `labelData`; bend points are recomputed on import.
   - Ensure uploads/restores regenerate identical orthogonal paths given the same step positions.

## Acceptance Criteria
1. **Orthogonal Rendering**
   - SVG paths for connectors consist solely of horizontal/vertical segments (no diagonals).
   - Connectors auto-adjust when steps move, preserving right angles.

2. **Connector Labels**
   - Labels remain legible, centered on the dominant straight segment, with no overlap on the path or steps.

3. **Multi-Parent Support**
   - Multiple connectors into a single target render with slight parallel offsets, avoiding complete overlap.

4. **Manual Connector UX**
   - Manual dragging/attachment still works; preview lines follow orthogonal routing before the connection is finalized.
   - Deleting connectors re-renders remaining paths orthogonally.

5. **Persistence**
   - Exported JSON (via `NgFlowchart.Flow.toJSON`) continues to load correctly, recomputing orthogonal routes on upload.

6. **Validation**
   - Demo scenarios (e.g., `/action-plans/create`) show dense DAGs with right-angle connectors and readable labels.
   - Automated tests cover routing helper logic with both vertical and horizontal orientations.

## Open Questions
- Preferred lane offset magnitude for overlapping connectors (e.g., 12px vs 16px) and whether it should be configurable later.
- Need for future feature flag to toggle routing style if diagonals are ever reintroduced.

## Implementation Summary

✅ **Completed in v1.3.1:**

1. **Dynamic Orthogonal Routing**: Updated `CanvasRendererService.drawConnectors()` to generate orthogonal paths at render time with deterministic bend point calculations.

2. **Lane Offsets for Multi-Parent Links**: Implemented connector grouping by target step with 15px lane spacing offsets to minimize overlap while maintaining stable routing.

3. **Label Placement**: Enhanced label positioning to place labels on the longest straight segment of orthogonal paths for optimal readability.

4. **Compatibility & Serialization**: Maintained backward compatibility with existing serialization format - only stores essential data (step IDs, labels) while recomputing orthogonal routes on import.

5. **Comprehensive Testing**: Added unit tests covering routing helper logic for both vertical and horizontal orientations with edge cases and lane offset scenarios.

## Benefits Delivered
- **Improved Readability**: Right-angled connectors follow flowchart conventions and reduce visual clutter in dense diagrams.
- **Multi-Parent Clarity**: Lane offsets prevent connector overlap when multiple parents target the same step.
- **Label Optimization**: Smart label positioning ensures maximum legibility without clipping or overlap.
- **Zero Breaking Changes**: Fully backward compatible with existing flows and serialization formats.

## Next Steps
- Monitor usage and gather feedback on lane spacing and routing behavior.
- Consider future enhancements like configurable routing styles or interactive bend point editing if user demand emerges.


