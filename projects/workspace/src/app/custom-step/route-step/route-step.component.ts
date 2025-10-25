import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent, NgFlowchart } from 'ngx-flowchart';

@Component({
  selector: 'app-route-step',
  templateUrl: './route-step.component.html',
  styleUrls: ['./route-step.component.scss'],
})
export class RouteStepComponent
  extends NgFlowchartStepComponent
  implements OnInit
{
  ngOnInit(): void {}

  getDropPositionsForStep(step: NgFlowchart.Step): NgFlowchart.DropPosition[] {
    if (step.type !== 'route-step') {
      return ['BELOW'];
    } else {
      return ['LEFT', 'RIGHT'];
    }
  }

  isValidConnectorDropTarget() {
    return true;
  }
}
