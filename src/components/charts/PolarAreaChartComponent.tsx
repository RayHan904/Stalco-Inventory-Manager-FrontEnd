import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface PolarAreaChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const defaultPolarAreaChartData: PolarAreaChartData = {
    labels: ['US', 'Canada', 'INTL', 'Internal'],
    datasets: [
      {
        label: 'My dataset',
        data: [101, 60, 7, 3],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56',  '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#36A2EB'],
      },
    ],
  };

const PolarAreaChartComponent: React.FC<{ chartData?: Partial<PolarAreaChartData> }> = ({ chartData = {} }) => {
  const {
    labels = defaultPolarAreaChartData.labels,
    datasets = defaultPolarAreaChartData.datasets,
  } = chartData;

  const data = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...defaultPolarAreaChartData.datasets[index],
      ...dataset,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '0', paddingBottom: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <PolarArea data={data} options={options} />
      </div>
    </div>
  );
};

export default PolarAreaChartComponent;
