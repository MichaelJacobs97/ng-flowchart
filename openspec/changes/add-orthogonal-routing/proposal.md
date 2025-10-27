## Why
User flows became harder to read once connectors shifted to direct diagonal paths during DAG support work. Teams expect right-angled flowchart connectors for clarity; diagonal lines overlap steps, obscure labels, and make multi-parent relationships confusing.

## What Changes
- Restore orthogonal (horizontal/vertical) routing for all connectors while keeping DAG + labels.
- Generate orthogonal paths dynamically in the renderer with lane offsets for multi-parent cases.
- Fix coordinate system mismatch: ensure connector component uses absolute canvas coordinates directly without incorrect container-relative transformations.
- Use predefined step distances (stepGap) for consistent connector spacing similar to tree layout instead of edge-based positioning.
- Position connectors to attach to the left side of child steps and approach from the left side for consistent visual alignment.
- Keep labels aligned with the dominant orthogonal segment and maintain padding logic.
- Update specs/tests to cover orthogonal routing in both `VERTICAL` and `HORIZONTAL` orientations.

## Impact
- Affected specs: `canvas-connectors`
- Affected code: `CanvasRendererService`, `NgFlowchartConnectorComponent`, connector serialization helpers, demo showcases/tests.

