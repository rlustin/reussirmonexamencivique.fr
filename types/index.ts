export type Category =
  | "principes-valeurs"
  | "systeme-institutionnel"
  | "droits-devoirs"
  | "histoire-geographie-culture"
  | "vivre-societe";

export interface Question {
  id: string;
  category: Category;
  categoryLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  isSituational: boolean;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  startTime: number;
  isFinished: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  timeSpent: number;
  categoryScores: Record<Category, { correct: number; total: number }>;
  answers: {
    question: Question;
    userAnswer: number | null;
    isCorrect: boolean;
  }[];
}

export interface UserProgress {
  quizzesTaken: number;
  bestScore: number;
  lastQuizDate: string;
  categoryStats: Record<Category, { attempts: number; correct: number }>;
}
