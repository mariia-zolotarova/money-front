import './charts.scss';
import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function ChartExpense({expenses}) {
    useLayoutEffect(() => {
        if (!expenses) return;

        let root = am5.Root.new("chartdiv-expense");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                radius: am5.percent(70),
                innerRadius: am5.percent(60)
            })
        );


        let series1 = chart.series.push(
            am5percent.PieSeries.new(root, {
                name: "Expense",
                valueField: "amount",
                categoryField: "categoryName",
                alignLabels: false
            })
        );
        series1.data.setAll(expenses);

        let label = series1.children.push(am5.Label.new(root, {
            text: expenses.reduce((partialSum, a) => partialSum + a.amount, 0).toFixed(2),
            fontSize: 30,
            centerX: am5.percent(50),
            centerY: am5.percent(50)
        }));

        series1.labels.template.setAll({
            fontSize: 14,
            text: "{categoryName}",
            textType: "circular",
            inside: false,
            radius: 10,
            fill: am5.color('#000')
        });

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div id="chartdiv-expense" className="chartdiv-expense"></div>
    );
}
