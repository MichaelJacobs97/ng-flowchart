# @michikowski/ngx-flowchart

Angular flowchart builder for drag-and-drop authoring experiences. This library provides:

- A canvas directive (`ngFlowchartCanvas`) with zooming, panning, and drop targets.
- Palette/step integration via `ngFlowchartStep` directive.
- Rendering primitives (arrows, connector pads) and services to manage layout and options.
- Manual connectors and free-floating step drops (new in 1.8.x beta).

## Installation

```bash
npm install @michikowski/ngx-flowchart
# or for the latest beta
npm install @michikowski/ngx-flowchart@beta
```

## Quick Start

```html
<div
  ngFlowchartCanvas
  [ngFlowchartOptions]="flowOptions"
  [ngFlowchartCallbacks]="flowCallbacks">
</div>

<div
  ngFlowchartStep
  [ngFlowchartStep]="paletteStep">
  Drag me onto the canvas
</div>
```

```ts
import { NgFlowchart } from '@michikowski/ngx-flowchart';

flowOptions: NgFlowchart.Options = {
  isSequential: false,
  manualConnectors: true,
};

flowCallbacks: NgFlowchart.Callbacks = {
  onDropStep: ({ step, parent, isMove }) => {
    console.log('Dropped', step, parent, isMove);
  },
};

paletteStep: NgFlowchart.PendingStep = {
  type: 'basic',
  template: MyStepComponent,
  data: { label: 'New Step' },
};
```

## Features

- **Free-floating drops**: palette steps can be placed anywhere and later attached.
- **Manual connectors**: link any two steps with interactive connector pads.
- **Source shipping**: TypeScript/HTML files are included in the npm package.
- **Upload/download API**: serialize flows via `NgFlowchart.Flow` helpers.
- **Standalone-friendly**: directives/services ready for Angular standalone usage.

## Building & Publishing (maintainers)

```bash
npm run build
cd dist/ngx-flowchart
npm publish --tag beta
```

## License

MIT © Michael Michikowski
