import { Component, Input, Output } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent {

  @Input() title = 'Sin Titulo';

  @Input('labels')
  public doughnutChartLabels: Label[] = ['Label1', 'Label2', 'Label3'];

  @Input('data')
  public doughnutChartData: MultiDataSet = [
    [250, 450, 100],
  ];

  public colors: Color[] = [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059'] }
  ]

}
