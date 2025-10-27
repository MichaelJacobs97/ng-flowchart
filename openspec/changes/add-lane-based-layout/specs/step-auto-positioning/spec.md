## ADDED Requirements

### Requirement: Lane-Based Child Positioning
The canvas SHALL automatically position child steps in a lane-based layout when rendering the flow tree.

#### Scenario: Horizontal orientation first child same lane
- **GIVEN** the canvas orientation is `HORIZONTAL`
- **AND** a parent step has at least one child
- **WHEN** the child tree is rendered
- **THEN** the first child SHALL be positioned at the same Y coordinate as the parent
- **AND** the first child SHALL be aligned such that their vertical centers match

#### Scenario: Horizontal orientation subsequent children new lanes
- **GIVEN** the canvas orientation is `HORIZONTAL`
- **AND** a parent step has multiple children
- **WHEN** the child tree is rendered
- **THEN** the second child SHALL be positioned below the first child with `stepGap` spacing
- **AND** the third and subsequent children SHALL be positioned in sequence below previous children

#### Scenario: Vertical orientation first child same column
- **GIVEN** the canvas orientation is `VERTICAL`
- **AND** a parent step has at least one child
- **WHEN** the child tree is rendered
- **THEN** the first child SHALL be positioned at the same X coordinate as the parent
- **AND** the first child SHALL be aligned such that their horizontal centers match

#### Scenario: Vertical orientation subsequent children new columns
- **GIVEN** the canvas orientation is `VERTICAL`
- **AND** a parent step has multiple children
- **WHEN** the child tree is rendered
- **THEN** the second child SHALL be positioned to the right of the first child with `stepGap` spacing
- **AND** the third and subsequent children SHALL be positioned in sequence to the right of previous children

#### Scenario: Lane layout triggers on connector creation
- **GIVEN** manual connectors are enabled
- **AND** a user connects two steps via connector pads
- **WHEN** the connector is created and the child step is inserted into the flow
- **THEN** the lane-based positioning SHALL be applied automatically
- **AND** the positioning SHALL occur during the same render cycle

#### Scenario: Recursive lane positioning
- **GIVEN** a step has children with their own children
- **WHEN** the nested child tree is rendered
- **THEN** each child's subtree SHALL apply lane-based positioning independently
- **AND** the grandchild lane positions SHALL be relative to their immediate parent, not the root ancestor

