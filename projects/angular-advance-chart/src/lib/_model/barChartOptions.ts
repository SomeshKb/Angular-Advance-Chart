import { ChartOption } from "./chartData";

export interface BarChartOption extends ChartOption {
    roundedCorners?: boolean
    isHorizontal?:boolean
}
