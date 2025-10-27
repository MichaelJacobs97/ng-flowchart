## ADDED Requirements
### Requirement: Orthogonal Connector Routing
The canvas SHALL render connectors using orthogonal (horizontal + vertical) segments with 90° bends while preserving multi-parent DAG support and connector labels.

#### Scenario: Vertical orientation
- **GIVEN** the canvas orientation is `VERTICAL`
- **WHEN** a connector links two steps
- **THEN** the rendered path consists only of vertical and horizontal segments, with right-angle bends near the start/end steps
- **AND** the connector label is positioned on the longest straight segment without overlapping nodes

#### Scenario: Horizontal orientation
- **GIVEN** the canvas orientation is `HORIZONTAL`
- **WHEN** a connector links two steps
- **THEN** the rendered path consists only of horizontal and vertical segments, with right-angle bends near the start/end steps
- **AND** connectors targeting the same step are offset into parallel lanes to avoid overlap

#### Scenario: Manual connector attachment
- **GIVEN** manual connectors are enabled and a user drags from a connector pad to another step
- **WHEN** the connection is finalized
- **THEN** the resulting connector renders orthogonally with bends recalculated using the current step positions
- **AND** serialization (`NgFlowchart.Flow.toJSON`) maintains only step IDs and label data, allowing uploads to recompute the same orthogonal path.

### Requirement: Coordinate System Compatibility
The canvas SHALL handle coordinate transformations correctly to ensure connector arrows reach their target nodes.

#### Scenario: Absolute coordinate usage
- **GIVEN** the canvas renderer calculates connector positions using `findClosestEndEdge`
- **WHEN** these coordinates are passed to the connector component
- **THEN** the coordinates SHALL be treated as absolute canvas coordinates
- **AND** the connector container SHALL be positioned correctly to align with these absolute coordinates
- **AND** the connector arrow SHALL reach the target node without coordinate transformation errors

#### Scenario: Step distance consistency
- **GIVEN** manual connectors are created between steps
- **WHEN** the connector positions are calculated
- **THEN** the positioning SHALL use predefined step distances (stepGap) similar to tree layout
- **AND** connectors SHALL maintain consistent spacing regardless of manual or automatic creation

### Requirement: Left-Side Connector Attachment
The canvas SHALL position connectors to attach to the left side of child steps and approach from the left side.

#### Scenario: Left-side attachment point
- **GIVEN** a connector targets a child step
- **WHEN** the end position is calculated
- **THEN** the connector SHALL attach to the left edge of the target step
- **AND** the arrow head SHALL point to the left side of the step

#### Scenario: Left-side approach
- **GIVEN** a connector approaches a child step from a parent step
- **WHEN** the connector path is calculated
- **THEN** the connector SHALL approach the target step from the left side
- **AND** the final horizontal segment SHALL be parallel to the step's left edge

