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

