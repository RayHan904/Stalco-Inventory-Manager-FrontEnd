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
  )

interface BarChartData {
  labels: string[];
  label: string;
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
  borderWidth: number;
}

const defaultBarChartData: BarChartData = {
  labels: ['Clayson', 'WHL'],
  label: "# of units",
  data: [0, 0],
  backgroundColor: ['#FF6384', '#36A2EB'],
  hoverBackgroundColor: ['#d35671', '#2d8ccd'],
  borderWidth: 1,
};

const BarChartComponent: React.FC<{ barChartData?: Partial<BarChartData> }> = ({ barChartData = {} }) => {
  const {
    labels = defaultBarChartData.labels,
    label = defaultBarChartData.label,
    data = defaultBarChartData.data,
    backgroundColor = defaultBarChartData.backgroundColor,
    hoverBackgroundColor = defaultBarChartData.hoverBackgroundColor,
    borderWidth = defaultBarChartData.borderWidth,
  } = barChartData;

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

  return <Bar  style={{  margin:'0 auto'}} data={chartData} />;
};

export default BarChartComponent;
