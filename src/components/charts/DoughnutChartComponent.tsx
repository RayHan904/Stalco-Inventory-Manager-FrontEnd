import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ArcElement, ChartDataLabels);

interface PieChartData {
  labels: string[];
  label: string;
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
  borderWidth: number;
}

const defaultPieChartData: PieChartData = {
  labels: ['Standard Inv.', 'White Label'],
  label: "# of orders",
  data: [0, 0],
  backgroundColor: ['#00C49F', '#9966FF'],
  hoverBackgroundColor: ['#039f81', '#7d5fcc'],
  borderWidth: 1,
};

const DoughnutChartComponent: React.FC<{ doughnutChartData?: Partial<PieChartData> }> = ({ doughnutChartData = {} }) => {
  const {
    labels = defaultPieChartData.labels,
    label = defaultPieChartData.label,
    data = defaultPieChartData.data,
    backgroundColor = defaultPieChartData.backgroundColor,
    hoverBackgroundColor = defaultPieChartData.hoverBackgroundColor,
    borderWidth = defaultPieChartData.borderWidth,
  } = doughnutChartData;

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor,
        hoverBackgroundColor,
        borderWidth,
      },
    ],
  };

  const options = {
    cutout: '70%', // This makes the chart a donut
    plugins: {
      datalabels: {
        display: true,
        color: 'white',
        formatter: (value: number) => value.toLocaleString(), // Display the value with localeString formatting
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += context.raw.toLocaleString();
            }
            return label;
          }
        }
      }
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChartComponent;
