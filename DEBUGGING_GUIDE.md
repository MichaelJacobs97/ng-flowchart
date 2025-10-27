# Debugging Guide for Lane-Based Layout

## Issue Fixed
1. ✅ **Source files are now included in the build** - TypeScript source files are available in `dist/ngx-flowchart/src/lib/` so you can debug using source maps
2. ✅ **Console logging added** - Comprehensive logging added to track the rendering flow

## Where to Put Breakpoints

### 1. Connector Creation Flow
**File:** `ng-flowchart-canvas.service.ts`

**Line 566** - `linkConnector()` - Entry point when user creates a connector
- **Breakpoint here** to see when connector linking starts
- Check: `startStepId`, `endStepId`

**Line 580** - `attachStepToFlow()` call
- **Breakpoint here** to see if step gets adopted into flow
- Check: return value `adopted` (should be `true` for new connections)

**Line 598** - First render call after connector creation
- **Breakpoint here** to verify render is called
- This calls `renderer.render(this.flow)` WITHOUT prettyRender

**Line 608** - Second render call if step was adopted
- **Breakpoint here** to verify prettyRender is called
- This calls `renderer.render(this.flow, true)` WITH prettyRender

### 2. Step Attachment Flow
**File:** `ng-flowchart-canvas.service.ts`

**Line 514** - `attachStepToFlow()` - Checks if relationship is valid
- **Breakpoint here** to debug why a step might not be attached
- Check: Return value (should be `true` for valid connections)

**Line 528** - Parent added to child
- **Breakpoint here** to verify parent-child relationship is created
- Check: `childStep.parents.length` after this line

**Line 539** - Render called from attachStepToFlow
- **Breakpoint here** to verify render is triggered when step is adopted
- This calls `renderer.render(this.flow, true)` WITH prettyRender

### 3. Rendering Flow
**File:** `canvas-renderer.service.ts`

**Line 244** - `render()` - Main render method
- **Breakpoint here** to see render parameters
- Check: `pretty` parameter (should be `true` when positioning should happen)
- Check: `flow.hasRoot()` (should be `true`)

**Line 270** - Before rendering child tree
- **Breakpoint here** to see how many children root has
- Check: `flow.rootStep.children.length`

**Line 279** - Before calling renderHorizontalChildTree
- **Breakpoint here** for HORIZONTAL orientation
- Check: `this.options.options.orientation` should be `'HORIZONTAL'`

### 4. Lane-Based Positioning Logic
**File:** `canvas-renderer.service.ts`

**Line 169** - Start of `renderHorizontalChildTree()`
- **Breakpoint here** to verify rendering starts
- Check: `rootNode.children.length`

**Line 179** - Root Y center calculated
- **Breakpoint here** to see parent's Y position
- Check: `rootYCenter` value

**Line 212** - First child positioning
- **Breakpoint here** to debug first child positioning
- Check: `childTop` value (should align with parent's Y)
- Check: `topYTree` value (should be same as `rootYCenter`)

**Line 214** - topYTree incremented after first child
- **Breakpoint here** to see position for subsequent children
- Check: `topYTree` value after increment

**Line 218** - Subsequent children positioning
- **Breakpoint here** to debug second, third, etc. children
- Check: `childTop` value (should be below previous child)
- Check: `topYTree` value (should be incremented from first child)

**Line 220** - Position set via `zsetPosition()`
- **Breakpoint here** to verify actual position is applied
- Check: `[childXLeft, childTop]` coordinates

## Console Log Messages

When you connect steps, you should see these logs in order:

```
[NgFlowchart] linkConnector called { startStepId: "...", endStepId: "..." }
[NgFlowchart] Step adopted into flow { adopted: true }
[NgFlowchart] attachStepToFlow called { parentId: "...", childId: "..." }
[NgFlowchart] Parent added, child now has 1 parents
[NgFlowchart] Calling render from attachStepToFlow
[CanvasRenderer] render called { pretty: true, ... }
[CanvasRenderer] Pretty render enabled - repositioning root
[CanvasRenderer] Rendering child tree, root has X children
[CanvasRenderer] renderHorizontalChildTree - rendering X children
[CanvasRenderer] Root Y center: XXX
[CanvasRenderer] First child position: { childTop: XXX, topYTree: XXX, childHeight: XXX }
[NgFlowchart] Creating new connector
[NgFlowchart] Calling render (no pretty)
[CanvasRenderer] render called { pretty: false, ... }
[NgFlowchart] Calling render with prettyRender=true
[CanvasRenderer] render called { pretty: true, ... }
```

## Common Issues to Debug

### Issue 1: Steps not repositioning
**Check:**
- Is `adopted` true in line 581?
- Is prettyRender being called (line 608)?
- Are children being rendered in `renderHorizontalChildTree`?

### Issue 2: First child not aligning with parent
**Check:**
- Line 212: Is `topYTree` equal to `rootYCenter`?
- Line 212: Is `childTop` calculated correctly?
- Line 220: Are the coordinates being set?

### Issue 3: Subsequent children not in new lanes
**Check:**
- Line 214: Is `topYTree` being incremented?
- Line 218: Is `childTop` being calculated using updated `topYTree`?
- Line 237: Is `topYTree` being incremented again after positioning?

### Issue 4: Multiple renders causing issues
**Check:**
- Line 539: First render from `attachStepToFlow`
- Line 598: Second render after connector creation
- Line 608: Third render if `adopted` is true

## Testing Steps

1. Open browser DevTools Console
2. Connect two steps using manual connectors
3. Watch the console logs to see the flow
4. Add breakpoints at key locations
5. Step through to verify positioning logic

## Next Steps

Once you've identified the issue from the logs:
1. Share the console output
2. Share which breakpoint shows unexpected behavior
3. We can then fix the specific issue

