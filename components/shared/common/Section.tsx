import { ReactNode } from "react";
import { FeedbackItem } from "./FeedbackItem";
import type { ContextualAnalysis } from "@/types/ContextualAnalysis";

interface SectionProps {
  title: string;
  items: Array<{
    label: string;
    value: string;
    feedback: {
      color: string;
      feedback: string;
      recommendations: string | string[];
    };
  }>;
  contextualAnalyses?: ContextualAnalysis[];
  children?: ReactNode;
}

export function Section({ title, items, contextualAnalyses = [], children }: SectionProps) {
  return (
    <section className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        {children}
      </div>

      {items.map((item, index) => (
        <FeedbackItem
          key={index}
          label={item.label}
          value={item.value}
          feedback={item.feedback}
        />
      ))}

      {contextualAnalyses.map((analysis, index) => (
        <div key={index} className="mt-4">
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-lg font-medium mb-2">{analysis.title}</h3>
            <p className="text-gray-300 mb-3">{analysis.feedback}</p>
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, idx) => (
                  <li key={idx} className="text-gray-300 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
