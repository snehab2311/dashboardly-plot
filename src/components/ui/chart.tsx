import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController
);

interface ChartProps {
  data: ChartData<any, any, any>;
  options?: ChartOptions<any>;
  className?: string;
}

const defaultOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
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

export const BarChart: React.FC<ChartProps> = ({ data, options = {}, className }) => (
  <div className={className}>
    <Bar data={data} options={{ ...defaultOptions, ...options }} />
  </div>
);

export const LineChart: React.FC<ChartProps> = ({ data, options = {}, className }) => (
  <div className={className}>
    <Line data={data} options={{ ...defaultOptions, ...options }} />
  </div>
);

export const PieChart: React.FC<ChartProps> = ({ data, options = {}, className }) => (
  <div className={className}>
    <Pie data={data} options={{ ...defaultOptions, ...options }} />
  </div>
);

export const DoughnutChart: React.FC<ChartProps> = ({ data, options = {}, className }) => (
  <div className={className}>
    <Doughnut data={data} options={{ ...defaultOptions, ...options }} />
  </div>
);
