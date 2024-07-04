import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarController, BarElement, ChartOptions } from 'chart.js';
import { Top10BarChartData } from '../orders/OrdersDashboardComponent';

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
  title: string;
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
  borderWidth: number;
  indexAxis: string;
  height: string;
  minHeight?: string;
}

const defaultBarChartData: BarChartData = {
  labels: ['Clayson', 'WHL'],
  title: "# of units",
  data: [0, 0],
  backgroundColor: ['#FF6384', '#36A2EB'],
  hoverBackgroundColor: ['#d35671', '#2d8ccd'],
  borderWidth: 1,
  indexAxis: 'x',
  height: '100%',
  minHeight: '0'
};

const BarChartComponent: React.FC<{ barChartData?: Partial<BarChartData | Top10BarChartData>, dataLabel?: boolean, isArranged?: boolean, minHeight?: string }> = ({ barChartData = {}, dataLabel = false, isArranged = false, minHeight }) => {
  // Ensure barChartData is never null or undefined
  const safeBarChartData = barChartData ?? {};

  const {
    labels = defaultBarChartData.labels,
    title = defaultBarChartData.title,
    data = defaultBarChartData.data,
    backgroundColor = defaultBarChartData.backgroundColor,
    hoverBackgroundColor = defaultBarChartData.hoverBackgroundColor,
    borderWidth = defaultBarChartData.borderWidth,
    indexAxis = defaultBarChartData.indexAxis,
    height = defaultBarChartData.height,
    minHeight: chartMinHeight = defaultBarChartData.minHeight,
  } = safeBarChartData;

  // Truncate labels if they are too long
  const truncatedLabels = labels.map(label => label.length > 8 ? `${label.slice(0, 5)}...` : label);

  const chartData = {
    labels: truncatedLabels,
    datasets: [
      {
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
    chartData.labels = combined.map(item => item.label.length > 8 ? `${item.label.slice(0, 5)}...` : item.label);
    chartData.datasets[0].data = combined.map(item => item.data);
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: indexAxis === 'y' ? 'y' : 'x', // This option makes the bar chart horizontal
    maintainAspectRatio: false,
    scales: {
      [indexAxis === 'y' ? 'x' : 'y']: {
        afterDataLimits: (scale) => {
          scale.max += (scale.max - scale.min) * 0.1; // Add 10% to the maximum value
        },
      },
    },
    plugins: {
      datalabels: {
        anchor: dataLabel ? 'end' : undefined,
        align: dataLabel ? 'end' : undefined,
        color: 'black',
        font: {
          weight: 'bold',
          size: dataLabel ? 10 : undefined,
        },
        formatter: (value) => value.toLocaleString(),
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null ) {
              label += context.raw && context.raw.toLocaleString();
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 12,
          style: 'italic'
        }
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: height, minHeight: minHeight ?? chartMinHeight }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartComponent;
