# Implementation Tasks

## 1. Core Step Drag Prevention
- [x] 1.1 Modify `NgFlowchartStepComponent.onMoveStart()` to check if step is flow-connected (has parent or is root)
- [x] 1.2 Prevent `dragstart` event by calling `event.preventDefault()` for flow-connected steps
- [x] 1.3 Add CSS cursor indicator (e.g., `cursor: not-allowed`) for non-draggable steps
- [x] 1.4 Ensure floating steps (no parent, not root) remain draggable

## 2. Public Detachment API - Step Component
- [x] 2.1 Add public method `detachFromFlow(recursive: boolean = false): void` to `NgFlowchartStepComponent`
- [x] 2.2 Implement non-recursive detachment: remove from all parents, clear parent references, destroy connectors
- [x] 2.3 Implement recursive detachment: detach step with entire descendant subtree as floating group
- [x] 2.4 Update internal state to mark step as floating after detachment
- [x] 2.5 Trigger canvas re-render after detachment

## 3. Public Detachment API - Canvas Service
- [x] 3.1 Add public method `detachStep(step: NgFlowchartStepComponent, recursive: boolean = false): void` to `NgFlowchartCanvasService`
- [x] 3.2 Delegate to step's `detachFromFlow()` method
- [x] 3.3 Handle edge case: if detaching the root step, clear `flow.rootStep` reference
- [x] 3.4 Ensure proper cleanup of connectors and parent-child relationships

## 4. Update Internal Logic
- [x] 4.1 Keep existing private `detachFromParent()` method for internal canvas operations
- [x] 4.2 Ensure `moveStep()` no longer automatically calls `detachFromParent()` for connected steps (should be dead code path now)
- [x] 4.3 Update root step positioning logic if needed (root is now non-draggable)

## 5. Type Definitions & Public API Surface
- [x] 5.1 Export `detachFromFlow` and `detachStep` in public API if needed
- [x] 5.2 Add JSDoc comments documenting the new methods with examples
- [ ] 5.3 Consider adding optional callback `onStepDetach` to `NgFlowchart.Callbacks`

## 6. Testing
- [x] 6.1 Test that flow-connected steps cannot be dragged
- [ ] 6.2 Test that floating steps remain draggable
- [ ] 6.3 Test non-recursive detachment creates orphaned children
- [ ] 6.4 Test recursive detachment preserves subtree structure
- [ ] 6.5 Test detachment via both step and canvas service APIs
- [x] 6.6 Test cursor indicators update correctly
- [x] 6.7 Smoke test with demo application

## 7. Documentation
- [ ] 7.1 Update README or API docs with detachment examples
- [ ] 7.2 Add migration notes for users relying on drag-to-detach behavior

