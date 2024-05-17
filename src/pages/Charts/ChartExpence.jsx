import './charts.scss';
import { useLayoutEffect } from 'react';
import {Root, percent, Label, color} from "@amcharts/amcharts5";
import {PieChart, PieSeries} from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function ChartExpense({expenses}) {
    useLayoutEffect(() => {
        if (!expenses) return;

        let root = Root.new("chartdiv-expense");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            PieChart.new(root, {
                radius: percent(70),
                innerRadius: percent(60)
            })
        );


        let series1 = chart.series.push(
            PieSeries.new(root, {
                name: "Expense",
                valueField: "amount",
                categoryField: "categoryName",
                alignLabels: false
            })
        );
        series1.data.setAll(expenses);

        series1.children.push(Label.new(root, {
            text: expenses.reduce((partialSum, a) => partialSum + a.amount, 0).toFixed(2),
            fontSize: 30,
            centerX: percent(50),
            centerY: percent(50)
        }));

        series1.labels.template.setAll({
            fontSize: 14,
            text: "{categoryName}",
            textType: "circular",
            inside: false,
            radius: 10,
            fill: color('#000')
        });

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div id="chartdiv-expense" className="chartdiv-expense"></div>
    );
}
