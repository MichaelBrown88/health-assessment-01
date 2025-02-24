import { Card } from "@/components/core/card";
import { Trophy, Award, Star } from "lucide-react";

interface AchievementsCardProps {
  streakCount: number;
  totalAssessments: number;
  improvements: number;
}

export function AchievementsCard({ streakCount, totalAssessments, improvements }: AchievementsCardProps) {
  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-white">Achievements</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Trophy className="h-8 w-8 mb-2 mx-auto text-yellow-400" />
          <p className="text-2xl font-bold">{streakCount}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
        </div>
        <div className="text-center">
          <Award className="h-8 w-8 mb-2 mx-auto text-blue-400" />
          <p className="text-2xl font-bold">{totalAssessments}</p>
          <p className="text-sm text-gray-400">Assessments</p>
        </div>
        <div className="text-center">
          <Star className="h-8 w-8 mb-2 mx-auto text-green-400" />
          <p className="text-2xl font-bold">{improvements}</p>
          <p className="text-sm text-gray-400">Improvements</p>
        </div>
      </div>
    </Card>
  );
}
