# Restrict Flow Step Dragging

## Why
Currently, users can drag any step on the canvas, which automatically detaches flow-connected steps from their parent-child relationships. This creates an unintended and potentially destructive UX where users accidentally break their carefully constructed flow structures while trying to explore or visually inspect the canvas. Floating steps (not part of the main flow) should be freely draggable, but flow-connected steps need protection to prevent unintentional structural changes.

## What Changes
- **BREAKING**: Steps that are part of the flow (have parent or child relationships) become non-draggable—the `dragstart` event is prevented and the cursor indicates the step cannot be moved
- Root steps (the primary flow entry point) also become locked and cannot be repositioned through drag operations
- Add public API method `NgFlowchartStepComponent.detachFromFlow(recursive: boolean = false)` to programmatically detach a step from its parent-child relationships
- Add public API method `NgFlowchartCanvasService.detachStep(step: NgFlowchartStepComponent, recursive: boolean = false)` for centralized detachment control
- After detachment via API, steps remain at their current position and become floating (freely draggable)
- When `recursive = true`, detach the step and all its descendants as a subtree, keeping their internal parent-child relationships intact but making the entire subtree floating
- When `recursive = false`, detach only the specified step, leaving children in place (they become orphaned floating steps)

## Impact
- **Affected specs**: New capability `canvas-step-drag` (step drag behavior), may affect `canvas-connectors` indirectly via relationship management
- **Affected code**: 
  - `projects/ngx-flowchart/src/lib/ng-flowchart-step/ng-flowchart-step.component.ts` - Add drag prevention logic and `detachFromFlow()` method
  - `projects/ngx-flowchart/src/lib/ng-flowchart-canvas.service.ts` - Add public `detachStep()` method, keep existing private `detachFromParent()` for internal use
  - `projects/ngx-flowchart/src/lib/model/flow.model.ts` - Potentially export new callback types for detachment events
- **Migration**: Existing flows will function correctly, but users relying on drag-to-detach behavior must migrate to explicit API calls

