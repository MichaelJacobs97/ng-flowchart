## Requirement: Orthogonal Connector Routing
The canvas SHALL render connectors using orthogonal (horizontal + vertical) segments with 90° bends while preserving multi-parent DAG support and connector labels.

### Requirement: Vertical Orientation Rendering
The canvas SHALL render connectors with orthogonal paths when the orientation is set to VERTICAL.

#### Scenario: Vertical orientation orthogonal path
- **GIVEN** the canvas orientation is `VERTICAL`
- **WHEN** a connector links two steps
- **THEN** the rendered path consists only of vertical and horizontal segments, with right-angle bends near the start/end steps
- **AND** the connector label is positioned on the longest straight segment without overlapping nodes

#### Scenario: Vertical multi-parent lane offsets
- **GIVEN** the canvas orientation is `VERTICAL`
- **AND** multiple connectors target the same step
- **WHEN** the connectors are rendered
- **THEN** connectors are offset into parallel lanes to avoid overlap
- **AND** each lane maintains orthogonal routing

### Requirement: Horizontal Orientation Rendering
The canvas SHALL render connectors with orthogonal paths when the orientation is set to HORIZONTAL.

#### Scenario: Horizontal orientation orthogonal path
- **GIVEN** the canvas orientation is `HORIZONTAL`
- **WHEN** a connector links two steps
- **THEN** the rendered path consists only of horizontal and vertical segments, with right-angle bends near the start/end steps
- **AND** the connector label is positioned on the longest straight segment without overlapping nodes

#### Scenario: Horizontal multi-parent lane offsets
- **GIVEN** the canvas orientation is `HORIZONTAL`
- **AND** multiple connectors target the same step
- **WHEN** the connectors are rendered
- **THEN** connectors are offset into parallel lanes to avoid overlap
- **AND** each lane maintains orthogonal routing

### Requirement: Manual Connector Serialization
The system SHALL support manual connector creation and serialization while maintaining orthogonal routing.

#### Scenario: Manual connector attachment
- **GIVEN** manual connectors are enabled and a user drags from a connector pad to another step
- **WHEN** the connection is finalized
- **THEN** the resulting connector renders orthogonally with bends recalculated using the current step positions
- **AND** serialization (`NgFlowchart.Flow.toJSON`) maintains only step IDs and label data, allowing uploads to recompute the same orthogonal path

#### Scenario: Connector upload recomputation
- **GIVEN** a serialized flow with connectors is uploaded
- **WHEN** the flow is loaded
- **THEN** connector paths are recalculated using current step positions
- **AND** orthogonal routing is applied with lane offsets for multi-parent scenarios
