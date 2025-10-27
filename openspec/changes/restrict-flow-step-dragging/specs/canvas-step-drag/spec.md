## ADDED Requirements

### Requirement: Flow-Connected Step Drag Prevention
The system SHALL prevent drag operations on steps that are part of the flow (have parent-child relationships or are the root step) to protect flow structure integrity.

#### Scenario: Flow-connected step drag prevented
- **GIVEN** a step has a parent in the flow
- **WHEN** a user attempts to drag the step
- **THEN** the `dragstart` event SHALL be prevented
- **AND** the cursor SHALL indicate the step is not draggable (e.g., `not-allowed`)
- **AND** the step SHALL remain at its current position

#### Scenario: Root step drag prevented
- **GIVEN** a step is the root step of the flow
- **WHEN** a user attempts to drag the root step
- **THEN** the `dragstart` event SHALL be prevented
- **AND** the cursor SHALL indicate the step is not draggable
- **AND** the flow structure SHALL remain unchanged

#### Scenario: Floating step remains draggable
- **GIVEN** a step has no parent and is not the root step
- **WHEN** a user drags the floating step
- **THEN** the drag operation SHALL proceed normally
- **AND** the step SHALL move to the new position
- **AND** the step SHALL remain floating (not attached to flow)

### Requirement: Programmatic Step Detachment API
The system SHALL provide explicit API methods to detach steps from their parent-child relationships, supporting both individual and recursive (subtree) detachment.

#### Scenario: Non-recursive step detachment via component
- **GIVEN** a step is part of the flow with parent and children
- **WHEN** `step.detachFromFlow(false)` is called
- **THEN** the step SHALL be removed from all parent-child relationships
- **AND** the step SHALL have no parents
- **AND** the step's children SHALL become orphaned floating steps
- **AND** connectors to/from the step SHALL be destroyed
- **AND** the step SHALL remain at its current position
- **AND** the step SHALL become draggable

#### Scenario: Recursive step detachment preserves subtree
- **GIVEN** a step has children forming a subtree
- **WHEN** `step.detachFromFlow(true)` is called
- **THEN** the step and all descendants SHALL be detached from the main flow
- **AND** parent-child relationships within the subtree SHALL remain intact
- **AND** the entire subtree SHALL become floating
- **AND** all steps in the subtree SHALL remain at their relative positions
- **AND** the subtree root SHALL become draggable

#### Scenario: Canvas service detachment
- **GIVEN** a canvas has a step that is part of the flow
- **WHEN** `canvasService.detachStep(step, recursive)` is called
- **THEN** the step SHALL be detached using the same logic as `step.detachFromFlow(recursive)`
- **AND** the canvas SHALL re-render to reflect the updated structure
- **AND** if the step is the root step, the `flow.rootStep` reference SHALL be cleared

#### Scenario: Post-detachment step is draggable
- **GIVEN** a step has been detached via `detachFromFlow()` or `detachStep()`
- **WHEN** a user attempts to drag the now-floating step
- **THEN** the drag operation SHALL proceed normally
- **AND** the step SHALL be freely movable on the canvas

### Requirement: Root Step Detachment Handling
The system SHALL properly handle detachment of the root step, clearing the root reference and allowing a new root to be established.

#### Scenario: Root step detached becomes floating
- **GIVEN** a step is the root step of the flow
- **WHEN** `detachStep(rootStep, false)` is called
- **THEN** the root step SHALL be detached from all children
- **AND** the `flow.rootStep` reference SHALL be set to null
- **AND** the former root step SHALL become a floating step
- **AND** the former root step SHALL become draggable
- **AND** children SHALL become orphaned floating steps

#### Scenario: Root step detached recursively with flow
- **GIVEN** a complete flow with root step and descendants
- **WHEN** `detachStep(rootStep, true)` is called
- **THEN** the entire flow SHALL become a floating subtree
- **AND** the `flow.rootStep` reference SHALL be set to null
- **AND** parent-child relationships within the flow SHALL be preserved
- **AND** the entire subtree SHALL be draggable as floating steps

