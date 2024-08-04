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

interface DoubleBarChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[] | string;
    borderColor?: string[] | string;
    hoverBackgroundColor: string[] | string;
    borderWidth: number;
  }[];
}

const defaultDoubleBarChart: DoubleBarChart = {
  labels: ['Clayson', 'WHL'],
  datasets: [
    {
      label: "# of units (Dataset 1)",
      data: [0, 0],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#d35671', '#2d8ccd'],
      borderWidth: 1,
    },
    {
      label: "# of units (Dataset 2)",
      data: [0, 0],
      backgroundColor: ['#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#e6b453', '#3ba3a3'],
      borderWidth: 1,
    }
  ],
};

const DoubleBarChartComponent: React.FC<{ doubleBarChart?: Partial<DoubleBarChart>, minWidth? : string, minHeight?: string  }> = ({ doubleBarChart = {}, minHeight='400px', minWidth='800px' }) => {
  const {
    labels = defaultDoubleBarChart.labels,
    datasets = defaultDoubleBarChart.datasets,
  } = doubleBarChart;

  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...defaultDoubleBarChart.datasets[index],
      ...dataset
    })),
  };

  const options = {
    plugins: {
      datalabels: {
        color: 'black',
        formatter: (value: number) => new Intl.NumberFormat().format(value),
        font: {
          size:innerWidth < 500 ? 8:  10 // Set the font size of data labels
        },
      },


    },
    responsive: true,

  };

  return (
    <div style={{ overflowX: 'auto' }}>
    <div style={{ width: '100% ', minWidth: minWidth, minHeight: minHeight }}> {/* Adjust width as needed */}
    <Bar  data={chartData} options={options} />
    </div>
  </div> 
  )
  

};

export default DoubleBarChartComponent;
