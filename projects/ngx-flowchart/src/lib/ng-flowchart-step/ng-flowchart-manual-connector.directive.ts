import { Directive, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { NgFlowchart } from '../model/flow.model';
import { NgFlowchartStepComponent } from './ng-flowchart-step.component';

type ManualConnectorDirectiveShow = 'ALWAYS' | 'HOVER';

@Directive({
  selector: '[ngFlowchartManualConnector]',
  standalone: true,
})
export class NgFlowchartManualConnectorDirective implements OnInit, OnDestroy {
  private step = inject(NgFlowchartStepComponent, { self: true });

  private positions: NgFlowchart.DropPosition[] = [];
  private mode: ManualConnectorDirectiveShow = 'ALWAYS';

  @Input('ngFlowchartManualConnector')
  set manualConnectorPositions(value: string | string[]) {
    this.positions = this.normalizePositions(value);
  }

  @Input('ngFlowchartManualConnectorShow')
  set manualConnectorShow(value: ManualConnectorDirectiveShow) {
    this.mode = (value || 'ALWAYS').toUpperCase() as ManualConnectorDirectiveShow;
  }

  ngOnInit(): void {
    if (!this.positions.length) {
      this.positions = this.normalizePositions(
        this.step.manualConnectorPositions
      );
    }
    this.step.registerManualConnectorOverride(
      this.positions,
      this.mode as any
    );
  }

  ngOnDestroy(): void {
    if (this.positions.length) {
      this.step.unregisterManualConnectorOverride(this.positions);
    }
  }

  private normalizePositions(
    value: string | string[]
  ): NgFlowchart.DropPosition[] {
    if (!value) {
      return [];
    }

    const tokens = (Array.isArray(value) ? value : [value])
      .join(',')
      .split(/[,\s]+/)
      .map(token => token.trim().toUpperCase())
      .filter(Boolean);

    const valid: NgFlowchart.DropPosition[] = [];
    tokens.forEach(token => {
      if (['ABOVE', 'BELOW', 'LEFT', 'RIGHT'].includes(token)) {
        valid.push(token as NgFlowchart.DropPosition);
      }
    });
    return Array.from(new Set(valid));
  }
}

