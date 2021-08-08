import { Component } from '@angular/core';
import { ChartData, BarChartOption, ChartView, ChartOption, DonutChartView, PieChartView } from 'angular-advance-chart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chartData: ChartData[] = [
    { name: "India", value: 132, color: "#61b15a" },
    { name: "Nepal", value: 772, color: "#adce74" },
    { name: "USA", value: 142, color: "#fff76a" },
    { name: "UK", value: 112, color: "#ffce89" },
    { name: "Brazil", value: 162, color: "#d8f8b7" }
  ];
  barChartOptions: BarChartOption = {
    roundedCorners: false,
    showLegend: true,
    legendTitle: 'Total',
    isHorizontal: false
  }
  barView: ChartView = {
    height: 200,
    width: 200
  }
  donutView: DonutChartView = {
    height: 400,
    width: 400,
    radius: 160,
    donutSize:40
  }
  pieChartOptions: ChartOption = {
    showLegend: true,
    legendTitle: 'Total'
  }

  pieView: PieChartView= {
    height:400,
    width:400,
    radius:160
  }
  
}
