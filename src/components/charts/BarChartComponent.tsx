import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarController, BarElement, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

interface BarChartData {
  labels: string[];
  label: string;
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
  borderWidth: number;
  indexAxis: string;
  height: string;
  minHeight: string;
}

const defaultBarChartData: BarChartData = {
  labels: ['Clayson', 'WHL'],
  label: "# of units",
  data: [0, 0],
  backgroundColor: ['#FF6384', '#36A2EB'],
  hoverBackgroundColor: ['#d35671', '#2d8ccd'],
  borderWidth: 1,
  indexAxis: 'x',
  height: '100%',
  minHeight: '0'
};



const BarChartComponent: React.FC<{ barChartData?: Partial<BarChartData>, dataLabel?: boolean, isArranged?: boolean, minHeight?: string }> = ({ barChartData = {}, dataLabel = false, isArranged = false,  }) => {
  const {
    labels = defaultBarChartData.labels,
    label = defaultBarChartData.label,
    data = defaultBarChartData.data,
    backgroundColor = defaultBarChartData.backgroundColor,
    hoverBackgroundColor = defaultBarChartData.hoverBackgroundColor,
    borderWidth = defaultBarChartData.borderWidth,
    indexAxis = defaultBarChartData.indexAxis,
    height = defaultBarChartData.height,
    minHeight = defaultBarChartData.minHeight,
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

  if (isArranged) {
    // Combine labels and data for sorting
    const combined = labels.map((label, index) => ({ label, data: data[index] }));
    // Sort by data in ascending order
    combined.sort((a, b) => b.data - a.data);
    // Separate labels and data after sorting
    chartData.labels = combined.map(item => item.label);
    chartData.datasets[0].data = combined.map(item => item.data);
  }

  const options: ChartOptions<'bar'> = {
    responsive:true,
    indexAxis: indexAxis === 'y' ? 'y' : 'x', // This option makes the bar chart horizontal
    maintainAspectRatio: false,
    plugins: dataLabel ? {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
        font: {
          weight: 'bold',
          size: 10 // Set the font size of data labels
        }
      }
    } : {}
  };

  return (
    <div style={{ height: height, minHeight: minHeight }}>
      <Bar data={chartData} options={options} plugins={dataLabel ? [ChartDataLabels] : []} />
    </div>
  );
};

export default BarChartComponent;
