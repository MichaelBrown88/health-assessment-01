import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { Assessment } from '../types/assessment';

interface TrendData {
  date: string;
  count: number;
}

export function calculateTrends(docs: QueryDocumentSnapshot<DocumentData>[]): TrendData[] {
  const trendMap = new Map<string, number>();

  docs.forEach(doc => {
    const assessment = doc.data() as Assessment;
    const date = new Date(assessment.createdAt.seconds * 1000);
    const dateKey = date.toISOString().split('T')[0];
    trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1);
  });

  return Array.from(trendMap.entries()).map(([date, count]) => ({
    date,
    count
  }));
}
