import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from 'ngx-flowchart';
import { FormsModule } from '@angular/forms';

export type MyForm = {
  input1: string;
};

@Component({
  selector: 'app-form-step',
  templateUrl: './form-step.component.html',
  styleUrls: ['./form-step.component.scss'],
  imports: [FormsModule],
})
export class FormStepComponent
  extends NgFlowchartStepComponent<MyForm>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
  }
}
