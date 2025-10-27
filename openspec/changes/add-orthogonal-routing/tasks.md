## 1. Discovery & Design
- [x] 1.1 Review current connector rendering helpers and label positioning logic.
- [x] 1.2 Prototype orthogonal routing algorithm for both orientations (vertical/horizontal).

## 2. Implementation
- [x] 2.1 Update `CanvasRendererService` to generate orthogonal connector coordinates with lane offsets.
- [x] 2.2 Adjust `NgFlowchartConnectorComponent` to consume multi-segment paths and keep label placement stable.
- [x] 2.3 Ensure serialization/import pipeline recalculates routes without storing bend data.
- [x] 2.4 Fix coordinate system mismatch: connector component must use absolute canvas coordinates directly.
- [x] 2.5 Update `findClosestEndEdge` to use stepGap-based positioning instead of edge-based calculations.
- [x] 2.6 Position connectors to attach to left side of child steps and approach from left side.

## 3. Validation
- [x] 3.1 Add unit tests covering routing helper edge cases and lane offsets.
- [x] 3.2 Build validation confirms TypeScript compilation succeeds.
- [x] 3.3 Update documentation/changelog with orthogonal routing behavior.

