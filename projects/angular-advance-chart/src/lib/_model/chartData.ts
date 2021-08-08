export interface ChartData {
    name : string,
    value: number,
    color: string
}

export interface ChartOption{
    showLegend : boolean,
    legendTitle: string,
}

export interface ChartView {
    height : number,
    width : number
}