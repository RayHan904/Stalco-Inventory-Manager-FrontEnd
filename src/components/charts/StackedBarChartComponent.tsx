      // @ts-nocheck

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarController, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartTypeRegistry, Point, BubbleDataPoint } from 'chart.js';

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
  ArcElement,
  ChartDataLabels
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
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += context.raw.toLocaleString();
            }
            return label;
          }
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          generateLabels: (chart: ChartJS<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint )[]>) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labelsOriginal = original.call(ChartJS.defaults.plugins.legend.labels, chart);
            labelsOriginal.forEach((label) => {
              const datasetMeta = chart.getDatasetMeta(label?.datasetIndex ?? 0);
              label.hidden = !chart.isDatasetVisible(label.datasetIndex ?? 0);
              // @ts-ignore
              label.datasetMeta = datasetMeta;
            });
            return labelsOriginal;
          }
        },
        onClick: (_e: any, legendItem: { datasetIndex: any; }, legend: { chart: any; }) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          ci.getDatasetMeta(index).hidden = ci.isDatasetVisible(index);
          ci.update();
        }
      },
      datalabels: {
        display: (context: any) => {
          const chart = context.chart;
          const datasetIndex = context.datasetIndex;
          const dataIndex = context.dataIndex;
          const meta = chart.getDatasetMeta(datasetIndex);
          const visibleDatasetMetas = chart.getSortedVisibleDatasetMetas();
          if (meta.index === visibleDatasetMetas[visibleDatasetMetas.length - 1].index) {
            return true;
          }
          return false;
        },
        anchor: 'end' as const,
        align: 'end' as const,
        color: 'black',
        font: {
          weight: 'bold' as const,
          size:innerWidth < 500 ? 8:  10 // Set the font size of data labels
        },
        formatter: (_value: any, context: any) => {
          const chart = context.chart;
          const dataIndex = context.dataIndex;
          const total = chartData.datasets.reduce((sum, dataset, datasetIndex) => {
            if (chart.isDatasetVisible(datasetIndex)) {
              return sum + dataset.data[dataIndex];
            }
            return sum;
          }, 0);
          return total.toLocaleString();
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        afterDataLimits: (scale: { max: number; min: number; }) => {
          scale.max += (scale.max - scale.min) * 0.1; // Add 10% to the maximum value
        },
      },
    },
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ width: '100% ', minWidth:'800px', minHeight: '400px' }}> 
      
       <Bar style={{ width: '100%', margin: 'auto' }} data={chartData} options={options} plugins={[ChartDataLabels]} />

      </div>
    </div>
  );
};

export default StackedBarChartComponent;
