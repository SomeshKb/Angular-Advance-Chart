import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ChartData, ChartOption } from '../../_model/chartData';
import { PieChartView } from '../../_model/pieChartOptions';


@Component({
  selector: 'ngx-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() chartData: ChartData[];
  @ViewChildren('el') span: QueryList<ElementRef>;
  @Output() selectedItem = new EventEmitter<any>();
  @Input() chartOptions: ChartOption = {
    showLegend : true,
    legendTitle: 'Total',
  }
  @Input() view: PieChartView = {
    height: 200,
    width: 200,
    radius : 80
  }
  chartView = [];
  totalSum = 0;
  processedData = []
  legendData = []

  constructor() { }

  ngOnInit(): void {

    this.chartView.push(this.view.height+'px')
    this.chartView.push(this.view.width+'px')

    if (this.chartData) {
      // Get total number of records
      this.totalSum = this.chartData.reduce(function (a, b) {
        return a + b.value;
      }, 0);



      //generate Data for piechart
      let prevAngle = 0
      this.chartData.map((x, index) => {

        let legend = {
          name: x.name,
          value: x.value,
          color: x.color
        }

        this.legendData.push(legend)

        let percentage = this.getPercentage(x.value, this.totalSum);
        if (percentage > 0) {
          let circlePercentage = percentage / 10 * 36;
          let pieData = {
            color: x.color,
            a1: prevAngle,
            a2: prevAngle + circlePercentage,
            name: x.name
          }
          prevAngle = prevAngle + circlePercentage
          this.processedData.push(pieData);
        }
      });
    }

  }


  ngAfterViewInit(): void {
    // create svg 
    if (this.processedData.length > 0) {
      this.span.map((item: ElementRef, index) => {
        this.processedData[index].a2 = this.processedData[index].a2 >= 360 ? 359.9 : this.processedData[index].a2;
        item.nativeElement.setAttribute('d', this.describeArc(this.view.height/2, this.view.height/2, this.view.radius, this.processedData[index].a1, this.processedData[index].a2));
        item.nativeElement.setAttribute('fill', this.processedData[index].color);
      });
    }

  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    let start = this.polarToCartesian(x, y, radius, endAngle);
    let end = this.polarToCartesian(x, y, radius, startAngle);

    let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    let d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
      "L", x, y,
      "L", start.x, start.y
    ].join(" ");
    return d;
  }

  getPercentage(partialValue, totalValue): number {
    return (100 * partialValue) / totalValue;
  }
  getItemClicked(item) {
    let selected = {
      name:item.name,
      value:item.value
    }
    this.selectedItem.emit(selected);  }

}