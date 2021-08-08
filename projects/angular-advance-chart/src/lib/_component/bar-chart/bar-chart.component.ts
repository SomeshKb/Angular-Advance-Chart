import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,
} from '@angular/core';
import { BarChartOption } from '../../_model/barChartOptions';
import { ChartData, ChartView } from '../../_model/chartData';


@Component({
  selector: 'ngx-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewInit {
  @Output() selectedItem = new EventEmitter<string>();
  @Input() chartData: ChartData[] = [];
  @Input() chartOptions: BarChartOption = {
    roundedCorners: false,
    isHorizontal: false,
    showLegend: true,
    legendTitle: 'Total',
  };
  @Input() view: ChartView = {
    height: 200,
    width: 200
  };
  lines = [];
  totalSum = 0;
  isHorizontal = true;
  barLineType = 'round'
  chartView = [];
  scale = 100;
  constructor() { }

  ngOnInit(): void {

    this.chartView.push(this.view.height + 'px')
    this.chartView.push(this.view.width + 'px')

    this.barLineType = this.chartOptions['roundedCorners'] ? 'round' : 'butt'
    this.isHorizontal = this.chartOptions['isHorizontal'] ? true : false;
    this.scale = this.isHorizontal ? this.view.width : this.view.height;

    

    this.getTotalSum(this.chartData);
    let value = Math.max.apply(
      Math,
      this.chartData.map(function (o) {
        return o.value;
      })
    );
    if (value > this.scale) {
      let normalizedValue = value / this.scale;
      this.chartData.map((y, index) => {
        this.chartData[index]['normalized'] = Number(y.value) / normalizedValue;
      });
    } else {
      let normalizedValue = this.scale / value;
      this.chartData.map((y, index) => {
        this.chartData[index]['normalized'] = Number(y.value) * normalizedValue;
      });
    }

    this.lines = this.isHorizontal ? this.calculateHorizontalBarLines(this.chartData) : this.calculateVerticalBarLines(this.chartData);
  }

  ngAfterViewInit(): void { }

  getItemClicked(line) {
    let selectedbar = {
      name: line.name,
      value: line.value
    }
    this.selectedItem.emit(JSON.stringify(selectedbar));
  }

  calculateHorizontalBarLines(graphData) {
    let barLines = [];
    graphData.map((x, index) => {
      let background = {
        x1: 10,
        y1: index * 20 + 20,
        y2: index * 20 + 20,
        x2: this.view.width,
        color: '#EBEBEB',
        name: x.name,
        value: x.value
      };
      barLines.push(background)

      if (x.value > 0) {
        let line = {
          x1: 10,
          y1: index * 20 + 20,
          y2: index * 20 + 20,
          x2: x.normalized < 10 ? this.barLineType == 'butt' ? 11 : 10 : x.normalized,
          color: x.color,
          name: x.name,
          value: x.value
        };
        barLines.push(line);
      }

    });
    return barLines;
  }


  calculateVerticalBarLines(graphData) {
    let barLines = [];

    graphData.map((x, index) => {
      let background = {
        x1: index * 20 + 20,
        y1: 10,
        x2: index * 20 + 20,
        y2: this.scale,
        color: '#EBEBEB',
        name: x.name,
        value: x.value
      };
      barLines.push(background)

      if (x.value > 0) {
        let line = {
          x1: index * 20 + 20,
          y1: (this.scale+10) - x.normalized > this.scale ? this.barLineType == 'butt' ? (this.scale-1) : this.scale : (this.scale+10) - x.normalized,
          x2: index * 20 + 20,
          y2: this.scale,
          color: x.color,
          name: x.name,
          value: x.value
        };
        barLines.push(line);

      }

    });
    console.log(barLines)
    return barLines;
  }



  getTotalSum(chartData) {
    // Get total number of records
    this.totalSum = chartData.reduce(function (a, b) {
      return a + parseInt(b.value);
    }, 0);
  }
}