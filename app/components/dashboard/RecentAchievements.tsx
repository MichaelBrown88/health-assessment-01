'use client'

import { Card } from "@/components/ui/card"
import { Trophy, Star, Medal, Target } from "lucide-react"
import type { Assessment } from "@/types/assessment"

const getTimestampNumber = (timestamp: number | Date | { seconds: number; nanoseconds: number }): number => {
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  return timestamp.seconds * 1000;
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'medal' | 'target';
  date: Date;
}

interface RecentAchievementsProps {
  assessments: Assessment[];
}

const calculateAchievements = (assessments: Assessment[]): Achievement[] => {
  const achievements: Achievement[] = [];
  
  if (assessments.length >= 1) {
    // First Assessment Achievement
    achievements.push({
      id: 'first-assessment',
      title: 'Health Pioneer',
      description: 'Completed your first health assessment',
      icon: 'trophy',
      date: new Date(getTimestampNumber(assessments[0].timestamp))
    });
  }

  if (assessments.length >= 3) {
    // Consistency Achievement
    achievements.push({
      id: 'consistency',
      title: 'Consistency Champion',
      description: 'Completed 3 health assessments',
      icon: 'medal',
      date: new Date()
    });
  }

  // Score Improvement Achievement
  if (assessments.length >= 2) {
    const latestScore = assessments[assessments.length - 1].metrics.overallScore;
    const previousScore = assessments[assessments.length - 2].metrics.overallScore;
    
    if (latestScore > previousScore) {
      achievements.push({
        id: 'improvement',
        title: 'Health Improver',
        description: 'Improved your overall health score',
        icon: 'star',
        date: new Date(getTimestampNumber(assessments[assessments.length - 1].timestamp))
      });
    }
  }

  return achievements.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const IconComponent = ({ icon }: { icon: Achievement['icon'] }) => {
  switch (icon) {
    case 'trophy':
      return <Trophy className="h-6 w-6 text-yellow-400" />;
    case 'star':
      return <Star className="h-6 w-6 text-blue-400" />;
    case 'medal':
      return <Medal className="h-6 w-6 text-purple-400" />;
    case 'target':
      return <Target className="h-6 w-6 text-green-400" />;
  }
};

export function RecentAchievements({ assessments }: RecentAchievementsProps) {
  const achievements = calculateAchievements(assessments);
  
  if (achievements.length === 0) {
    return null;
  }
  
  return (
    <Card className="p-6 bg-black/30 backdrop-blur-sm border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Recent Achievements</h3>
        <Trophy className="h-5 w-5 text-yellow-400" />
      </div>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className="flex items-center space-x-4 p-3 bg-black/20 rounded-lg"
          >
            <div className="flex-shrink-0">
              <IconComponent icon={achievement.icon} />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-semibold text-white">{achievement.title}</h4>
              <p className="text-xs text-gray-400">{achievement.description}</p>
            </div>
            <div className="text-xs text-gray-500">
              {achievement.date.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
