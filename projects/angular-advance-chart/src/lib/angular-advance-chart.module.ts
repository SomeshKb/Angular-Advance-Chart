import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BarChartComponent } from './_component/bar-chart/bar-chart.component';
import { DonutChartComponent } from './_component/donut-chart/donut-chart.component';
import { PieChartComponent } from './_component/pie-chart/pie-chart.component';
import { TooltipDirective } from './_directive/tooltip.directive';

@NgModule({
  declarations: [PieChartComponent, BarChartComponent, DonutChartComponent, TooltipDirective],
  imports: [
    CommonModule
  ],
  exports: [PieChartComponent, BarChartComponent, DonutChartComponent]
})
export class AngularAdvanceChartModule { }
