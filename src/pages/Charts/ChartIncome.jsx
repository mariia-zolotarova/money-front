import './charts.scss'
import { useLayoutEffect } from 'react';

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {Root} from "@amcharts/amcharts5"
import {
    XYChart,
    ValueAxis,
    AxisRendererY,
    CategoryAxis,
    AxisRendererX,
    ColumnSeries,
    XYCursor
} from "@amcharts/amcharts5/xy"

export default function ChartIncome({incomes}){
    useLayoutEffect(() => {
        if (!incomes) return;

        let root = Root.new("chartdiv-income");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout
            })
        );

        let chartData = incomes.map(income => ({
            key: income.id,
            category: income.attributes.publishedAt.replace(/T.*/, ''),
            value: income.attributes.balance
        }));

        let yAxis = chart.yAxes.push(
            ValueAxis.new(root, {
                renderer: AxisRendererY.new(root, {})
            })
        );

        let xAxis = chart.xAxes.push(
            CategoryAxis.new(root, {
                renderer: AxisRendererX.new(root, {}),
                categoryField: "category"
            })
        );
        xAxis.data.setAll(chartData);

        let series1 = chart.series.push(
            ColumnSeries.new(root, {
                name: "Income",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                categoryXField: "category"
            })
        );
        series1.data.setAll(chartData);

        chart.set("cursor", XYCursor.new(root, {}));

        return () => {
            root.dispose();
        };
    }, [incomes]);

    return (
        <div id="chartdiv-income" className="chartdiv-income"></div>
    );
}