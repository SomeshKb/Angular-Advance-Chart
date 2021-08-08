import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ChartData, ChartOption } from '../../_model/chartData';
import { DonutChartView } from '../../_model/donutChartOptions';


@Component({
  selector: 'ngx-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

  @Input() chartData: ChartData[];
  @Output() selectedItem = new EventEmitter<any>();
  @ViewChildren('el') span: QueryList<ElementRef>;
  @Input() chartOptions: ChartOption = {
    showLegend: true,
    legendTitle: 'Total',
  }
  @Input() view: DonutChartView = {
    height: 200,
    width: 200,
    radius: 80,
    donutSize: 20
  }
  totalSum = 0;
  processedData = [];
  legendData = [];
  chartView = [];
  constructor() { }

  ngOnInit(): void {
    if (this.chartData) {
      this.view['donutSize'] = this.view['donutSize'] ? this.view['donutSize'] : 20;
      this.chartView.push(this.view.height + 'px')
      this.chartView.push(this.view.width + 'px')

      // Get total number of records
      this.totalSum = this.chartData.reduce(function (a, b) {
        return a + b.value;
      }, 0);

      //generate Data for list
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


  getPercentage(partialValue, totalValue): number {
    return (100 * partialValue) / totalValue;
  }

  ngAfterViewInit(): void {

    //create svg
    if (this.processedData.length > 0) {
      this.span.map((item: ElementRef, index) => {
        item.nativeElement.setAttribute('d', this.describeArc(this.view.height / 2, this.view.width / 2, this.view.radius, this.processedData[index].a1, this.processedData[index].a2 == 360 ? 359.99 : this.processedData[index].a2));
        item.nativeElement.setAttribute('stroke', this.processedData[index].color);
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
    let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    let d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
  }

  getItemClicked(item) {
    let selected = {
      name: item.name,
      value: item.value
    }
    this.selectedItem.emit(selected);
  }

  show(status) {
  }
}
