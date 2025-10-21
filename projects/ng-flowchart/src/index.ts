/*
 * Public API Surface of ng-flowchart
 */

export * from './lib/model/flow.model';
export * from './lib/ng-flowchart-canvas.directive';
export * from './lib/ng-flowchart-step-registry.service';
export * from './lib/services/options.service';
export * from './lib/ng-flowchart-step.directive';
export * from './lib/ng-flowchart-step/ng-flowchart-step.component';
export * from './lib/ng-flowchart-arrow/ng-flowchart-arrow.component';
// In your fork's index.ts (main export file):
export { NgFlowchartStepComponent } from './lib/ng-flowchart-step/ng-flowchart-step.component';
export { NgFlowchartStepRegistry } from './lib/ng-flowchart-step-registry.service';
export { NgFlowchartCanvasDirective } from './lib/ng-flowchart-canvas.directive';
export * from './lib/model/flow.model'; // Includes NgFlowchart namespace
export * from './lib/services/options.service';
export * from './lib/services/dropdata.service';
