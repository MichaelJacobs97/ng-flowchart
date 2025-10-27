# Add Lane-Based Step Layout

## Why
Currently, when steps are added to the flow via manual connectors, children are centered around their parent's position in HORIZONTAL orientation (or stacked below in VERTICAL). This creates visually confusing layouts where the parent-child relationship is unclear, especially when branching. Users expect a lane-based layout where the first child stays in the same lane as the parent, and subsequent children branch into new lanes, creating clearer visual hierarchy and making the flow structure more intuitive to read.

## What Changes
- Modify `renderHorizontalChildTree()` in `CanvasRendererService` to position the first child at the same Y coordinate as the parent (same lane)
- Position the second and subsequent children in new lanes below the first child
- For VERTICAL orientation, apply similar logic but with X coordinates (first child in same column, others in new columns)
- This positioning happens automatically when steps are inserted into the flow via manual connectors
- Keep backwards compatibility: existing `prettyRender` behavior is preserved, only the relative positioning of children is adjusted

## Impact
- **Affected specs**: New capability `step-auto-positioning` (automatic step positioning when inserted into flow)
- **Affected code**: 
  - `projects/ngx-flowchart/src/lib/services/canvas-renderer.service.ts` - Modify `renderHorizontalChildTree()` and `renderVerticalChildTree()` methods
- **Migration**: No breaking changes; existing flows will render with improved lane-based layout automatically

