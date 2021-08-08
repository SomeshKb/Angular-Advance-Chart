import { ChartView } from "./chartData";

export interface DonutChartView extends ChartView {
    radius: number,
    donutSize?: number
}