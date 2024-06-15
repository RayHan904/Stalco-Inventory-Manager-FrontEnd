import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

interface PieChartData {
  labels: string[];
  label: string;
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
  borderWidth: number;
}

const defaultPieChartData: PieChartData = {
  labels: ['Clayson', 'WHL'],
  label: "# of units",
  data: [0, 0],
  backgroundColor: ['#00C49F', '#FFBB28'],
  hoverBackgroundColor: ['#039f81', '#dea425'],
  borderWidth: 1,
};

const PieChartComponent: React.FC<{ pieChartData?: Partial<PieChartData> }> = ({ pieChartData = {} }) => {
  const {
    labels = defaultPieChartData.labels,
    label = defaultPieChartData.label,
    data = defaultPieChartData.data,
    backgroundColor = defaultPieChartData.backgroundColor,
    hoverBackgroundColor = defaultPieChartData.hoverBackgroundColor,
    borderWidth = defaultPieChartData.borderWidth,
  } = pieChartData;

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

  return <Pie style={{height: '30rem'}} data={chartData} />;
};

export default PieChartComponent;
