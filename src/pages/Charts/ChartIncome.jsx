import './charts.scss'
import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function ChartIncome({incomes}){
    useLayoutEffect(() => {
        if (!incomes) return;

        let root = am5.Root.new("chartdiv-income");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
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
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                categoryField: "category"
            })
        );
        xAxis.data.setAll(chartData);

        let series1 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Income",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                categoryXField: "category"
            })
        );
        series1.data.setAll(chartData);

        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        return () => {
            root.dispose();
        };
    }, [incomes]);

    return (
        <div id="chartdiv-income" className="chartdiv-income"></div>
    );
}