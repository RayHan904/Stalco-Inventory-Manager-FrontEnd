import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, LineController } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController
);

interface StackedBarChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    fill?: boolean;
  }[];
}

const defaultStackedBarChart: StackedBarChart = {
  labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
  datasets: [
    {
      label: "# of units (Dataset 1)",
      data: [0, 0, 0, 0],
      borderColor: '#FF6384',
      borderWidth: 1,
      fill: false,
    },
    {
      label: "# of units (Dataset 2)",
      data: [0, 0, 0, 0],
      borderColor: '#36A2EB',
      borderWidth: 1,
      fill: false,
    },
    {
      label: "# of units (Dataset 3)",
      data: [0, 0, 0, 0],
      borderColor: '#FFCE56',
      borderWidth: 1,
      fill: false,
    },
    {
      label: "# of units (Dataset 4)",
      data: [0, 0, 0, 0],
      borderColor: '#4BC0C0',
      borderWidth: 1,
      fill: false,
    }
  ],
};

const LineChartComponent: React.FC<{ lineChart?: Partial<StackedBarChart> }> = ({ lineChart = {} }) => {
  const {
    labels = defaultStackedBarChart.labels,
    datasets = defaultStackedBarChart.datasets,
  } = lineChart;

  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...defaultStackedBarChart.datasets[index],
      ...dataset,
      backgroundColor: undefined, // Remove backgroundColor for line chart
      hoverBackgroundColor: undefined, // Remove hoverBackgroundColor for line chart
      borderColor: dataset.borderColor || defaultStackedBarChart.datasets[index].borderColor, // Use borderColor for line chart
      fill: false,
    })),
  };

  const options = {
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      legend: {
        position: 'top' as const,
      },
    },
    responsive: true,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  return <Line style={{ height: '100%', margin: 'auto' }} data={chartData} options={options} />;
};

export default LineChartComponent;