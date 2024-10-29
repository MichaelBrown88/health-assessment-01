import type { AssessmentResult } from '@/types';

// Keep the interfaces but mark them as exported if we need them elsewhere
export interface ExerciseFactors {
  frequency: number;
  duration: number;
  intensity: string;
  recoveryDays: number;
}

export interface SleepFactors {
  duration: number;
  quality: string;
  bedTime: string;
  wakeTime: string;
}

export interface MentalFactors {
  stressLevel: number;
  anxiety: string;
  mood: number;
  socialActivity: string;
}

export function calculateMetricDeviation(assessment: AssessmentResult): Record<string, number> {
  const { answers, metrics } = assessment;
  
  return {
    bodyComposition: calculateBodyCompositionDeviation(
      typeof metrics.bmi === 'number' ? metrics.bmi : null,
      metrics.bodyFat ?? null,
      answers.gender as string
    ),
    exerciseHabits: calculateExerciseScore({
      frequency: answers.exerciseFrequency as number,
      duration: answers.exerciseDuration as number,
      intensity: answers.exerciseIntensity as string,
      recoveryDays: answers.recoveryDays as number
    }),
    sleepHealth: calculateSleepScore({
      duration: answers.sleepDuration as number,
      quality: answers.sleepQuality as string,
      bedTime: answers.bedTime as string,
      wakeTime: answers.wakeTime as string
    }),
    mentalWellbeing: calculateMentalScore({
      stressLevel: answers.stressLevel as number,
      anxiety: answers.anxiety as string,
      mood: answers.mood as number,
      socialActivity: answers.socialActivity as string
    })
  };
}

export function calculateBodyCompositionDeviation(
  bmi: number | null,
  bodyFat: number | null,
  gender: string
): number {
  if (!bmi) return 0;
  
  const idealBMI = 22;
  const bmiDeviation = Math.abs(bmi - idealBMI) / idealBMI;
  
  if (!bodyFat) return Math.max(0, 100 - (bmiDeviation * 100));
  
  // Adjust ideal body fat based on gender
  const idealBodyFat = gender === 'male' ? 15 : 25;
  const bodyFatDeviation = Math.abs(bodyFat - idealBodyFat) / idealBodyFat;
  
  return Math.max(0, 100 - ((bmiDeviation + bodyFatDeviation) * 50));
}

export function calculateExerciseScore(factors: ExerciseFactors): number {
  // Convert the numeric values to score ranges
  const frequencyScore = Math.min(100, factors.frequency * 20);
  const durationScore = Math.min(100, factors.duration * 10);
  const intensityScore = {
    light: 40,
    moderate: 70,
    vigorous: 90,
    'very-intense': 100
  }[factors.intensity] || 50;
  
  return Math.round((frequencyScore + durationScore + intensityScore) / 3);
}

export function calculateSleepScore(factors: SleepFactors): number {
  const durationScore = Math.min(100, (factors.duration / 8) * 100);
  const qualityScore = {
    poor: 25,
    fair: 50,
    good: 75,
    excellent: 100
  }[factors.quality] || 50;
  
  return Math.round((durationScore + qualityScore) / 2);
}

export function calculateMentalScore(factors: MentalFactors): number {
  const stressScore = Math.max(0, 100 - (factors.stressLevel * 20));
  const anxietyScore = {
    low: 100,
    moderate: 60,
    high: 30
  }[factors.anxiety] || 50;
  const moodScore = Math.min(100, factors.mood * 20);
  const socialScore = {
    rarely: 25,
    occasionally: 50,
    regularly: 75,
    frequently: 100
  }[factors.socialActivity] || 50;
  
  return Math.round((stressScore + anxietyScore + moodScore + socialScore) / 4);
}
