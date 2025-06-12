'use client';

import { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  month: string;
  sessions: number;
  credits: number;
}

interface AnalyticsChartProps {
  data: AnalyticsData[];
  title?: string;
  loading?: boolean;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  title = "Session Usage Analytics",
  loading = false 
}) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Sessions Completed',
        data: data.map(item => item.sessions),
        backgroundColor: 'rgba(30, 58, 138, 0.8)', // Blue-800 with opacity
        borderColor: '#1E3A8A',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Credits Used',
        data: data.map(item => item.credits),
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // Amber-500 with opacity
        borderColor: '#F59E0B',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: TooltipItem<'bar'>[]) {
            return `${context[0].label} 2024`;
          },
          label: function(context: TooltipItem<'bar'>) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          stepSize: 1,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            weight: 500,
          },
        },
        border: {
          display: false,
        },
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-800" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-800" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Data Available
              </h3>
              <p className="text-gray-600">
                Analytics will appear here once you have session data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-800" />
            {title}
          </div>
          <div className="text-sm text-gray-600">
            Last 6 months
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar ref={chartRef} data={chartData} options={options} />
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800">
              {data.reduce((sum, item) => sum + item.sessions, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {data.reduce((sum, item) => sum + item.credits, 0)}
            </div>
            <div className="text-sm text-gray-600">Credits Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(data.reduce((sum, item) => sum + item.sessions, 0) / data.length)}
            </div>
            <div className="text-sm text-gray-600">Avg/Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.length > 1 ? 
                Math.round(((data[data.length - 1].sessions - data[0].sessions) / data[0].sessions) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Growth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;