import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarController, BarElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, 
  BarController,
  BarElement,
  ArcElement
);

interface StackedBarChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    hoverBackgroundColor: string;
    borderWidth: number;
  }[];
}

const defaultStackedBarChart: StackedBarChart = {
  labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
  datasets: [
    {
      label: "# of units (Dataset 1)",
      data: [0, 0, 0, 0],
      backgroundColor: '#FF6384',
      hoverBackgroundColor: '#d35671',
      borderWidth: 1,
    },
    {
      label: "# of units (Dataset 2)",
      data: [0, 0, 0, 0],
      backgroundColor: '#36A2EB',
      hoverBackgroundColor: '#2d8ccd',
      borderWidth: 1,
    },
    {
      label: "# of units (Dataset 3)",
      data: [0, 0, 0, 0],
      backgroundColor: '#FFCE56',
      hoverBackgroundColor: '#e6b453',
      borderWidth: 1,
    },
    {
      label: "# of units (Dataset 4)",
      data: [0, 0, 0, 0],
      backgroundColor: '#4BC0C0',
      hoverBackgroundColor: '#3ba3a3',
      borderWidth: 1,
    }
  ],
};

const StackedBarChartComponent: React.FC<{ stackedBarChart?: Partial<StackedBarChart> }> = ({ stackedBarChart = {} }) => {
  const {
    labels = defaultStackedBarChart.labels,
    datasets = defaultStackedBarChart.datasets,
  } = stackedBarChart;

  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...defaultStackedBarChart.datasets[index],
      ...dataset
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
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar style={{ height: '100%', margin: 'auto' }} data={chartData} options={options} />;
};

export default StackedBarChartComponent;
