'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TrendingUp, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressTrackerProps {
  completedSessions: number;
  goalSessions?: number;
  loading?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  completedSessions, 
  goalSessions = 10, 
  loading = false 
}) => {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  const progressPercentage = Math.min((completedSessions / goalSessions) * 100, 100);
  const remainingSessions = Math.max(goalSessions - completedSessions, 0);

  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completedSessions, remainingSessions],
        backgroundColor: [
          '#1E3A8A', // Blue-800
          '#F3F4F6', // Gray-100
        ],
        borderColor: [
          '#1E3A8A',
          '#E5E7EB',
        ],
        borderWidth: 2,
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value} sessions`;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-800" />
            Progress Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-800" />
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="relative h-48">
            <Doughnut ref={chartRef} data={data} options={options} />
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold text-blue-800"
                >
                  {completedSessions}
                </motion.div>
                <div className="text-sm text-gray-600">of {goalSessions}</div>
                <div className="text-xs text-gray-500">sessions</div>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-4 bg-blue-50 rounded-lg"
            >
              <Target className="w-8 h-8 text-blue-800 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                {progressPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-4 bg-amber-50 rounded-lg"
            >
              <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-600">
                {remainingSessions}
              </div>
              <div className="text-sm text-gray-600">To Goal</div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress to Goal</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-blue-800 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg"
          >
            {completedSessions >= goalSessions ? (
              <div>
                <div className="text-lg font-semibold text-green-800 mb-1">
                  🎉 Congratulations!
                </div>
                <div className="text-sm text-gray-600">
                  You&apos;ve reached your goal! Keep up the great work.
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg font-semibold text-blue-800 mb-1">
                  Keep Going!
                </div>
                <div className="text-sm text-gray-600">
                  {remainingSessions} more session{remainingSessions !== 1 ? 's' : ''} to reach your goal.
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;