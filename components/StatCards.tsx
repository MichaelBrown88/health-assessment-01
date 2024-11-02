'use client';

import { useState } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MinusIcon, 
  CalendarIcon, 
  BarChart2Icon, 
  ActivityIcon,
  InfoIcon,
  ClockIcon,
  ListChecksIcon
} from 'lucide-react';
import { format, addWeeks } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Assessment {
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | number | Date;
  metrics: {
    overallScore: number;
    [key: string]: number;
  };
  answers: Record<string, string | number | boolean | string[]>;
}

interface StatCardsProps {
  assessments: Assessment[];
}

export const StatCards: React.FC<StatCardsProps> = ({ assessments }) => {
  const [assessmentInterval, setAssessmentInterval] = useState(4); // weeks

  const compareMetrics = (current: Assessment, previous: Assessment) => {
    const changes = {
      improved: 0,
      declined: 0,
      neutral: 0
    };

    Object.keys(current.metrics).forEach(key => {
      if (previous.metrics[key]) {
        const diff = current.metrics[key] - previous.metrics[key];
        if (diff > 0) changes.improved++;
        else if (diff < 0) changes.declined++;
        else changes.neutral++;
      }
    });

    return changes;
  };

  // Helper function to safely convert any timestamp format to Date
  const getTimestampDate = (timestamp: Assessment['timestamp']): Date => {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    // Handle Firestore timestamp
    if (timestamp && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000);
    }
    // Fallback
    return new Date();
  };

  const firstAssessmentDate = assessments.length > 0
    ? format(getTimestampDate(assessments[0].timestamp), 'MMM d, yyyy')
    : 'No assessments yet';

  const latestAssessment = assessments[assessments.length - 1];
  const nextAssessmentDate = assessments.length > 0 
    ? format(
        addWeeks(
          getTimestampDate(latestAssessment.timestamp),
          assessmentInterval
        ),
        'MMM d'
      )
    : 'Take your first assessment';

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* First Assessment */}
        <div className="bg-black/30 p-4 rounded-lg deep-space-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-gray-400">First Assessment</h3>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Date of your first health assessment</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-lg font-semibold mt-2">
            {firstAssessmentDate}
          </p>
        </div>

        {/* Next Assessment */}
        <div className="bg-black/30 p-4 rounded-lg deep-space-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-medium text-gray-400">Next Assessment</h3>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Recommended date for your next assessment</p>
                <p className="text-xs text-gray-400 mt-1">Adjust frequency below</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-lg font-semibold mt-2">
            {nextAssessmentDate}
          </p>
          <select 
            value={assessmentInterval}
            onChange={(e) => setAssessmentInterval(Number(e.target.value))}
            className="mt-2 text-xs bg-black/20 border border-gray-700 rounded px-2 py-1"
          >
            <option value={4}>Every 4 weeks</option>
            <option value={6}>Every 6 weeks</option>
            <option value={8}>Every 8 weeks</option>
            <option value={12}>Every 12 weeks</option>
          </select>
        </div>

        {/* Score Change */}
        <div className="bg-black/30 p-4 rounded-lg deep-space-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2Icon className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-medium text-gray-400">Score Change</h3>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Overall score change since last assessment</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {assessments.length >= 2 && (
            <div className="flex items-center mt-2">
              <span className="text-lg font-semibold">
                {(assessments[assessments.length - 1].metrics.overallScore - 
                  assessments[assessments.length - 2].metrics.overallScore).toFixed(1)}%
              </span>
              {assessments[assessments.length - 1].metrics.overallScore > 
               assessments[assessments.length - 2].metrics.overallScore ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 ml-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 ml-1" />
              )}
            </div>
          )}
        </div>

        {/* Metric Changes */}
        <div className="bg-black/30 p-4 rounded-lg deep-space-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ActivityIcon className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-medium text-gray-400">Metric Changes</h3>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Changes in individual metrics since last assessment</p>
                <div className="text-xs text-gray-400 mt-1">
                  <p>🟢 Improved metrics</p>
                  <p>🟡 Unchanged metrics</p>
                  <p>🔴 Declined metrics</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          {assessments.length >= 2 && (
            <div className="flex gap-4 mt-2">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-lg font-semibold text-green-500">
                      {compareMetrics(
                        assessments[assessments.length - 1],
                        assessments[assessments.length - 2]
                      ).improved}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Metrics that have improved</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <MinusIcon className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-lg font-semibold text-yellow-500">
                      {compareMetrics(
                        assessments[assessments.length - 1],
                        assessments[assessments.length - 2]
                      ).neutral}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Metrics that remained the same</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-lg font-semibold text-red-500">
                      {compareMetrics(
                        assessments[assessments.length - 1],
                        assessments[assessments.length - 2]
                      ).declined}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Metrics that have declined</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Total Assessments */}
        <div className="bg-black/30 p-4 rounded-lg deep-space-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ListChecksIcon className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-medium text-gray-400">Total Assessments</h3>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of assessments completed</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-lg font-semibold mt-2">
            {assessments.length}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {assessments.length === 0 
              ? 'Take your first assessment'
              : 'Assessments completed'}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};
