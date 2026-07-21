export type LearnerProfile = {
  id: string;
  name: string;
  classLevel: string;
  language: string;
};

export type ProgressMap = Record<string, number>;

export type QuizAttempt = {
  lessonId: string;
  score: number;
  submittedAt: string;
};

export type DoubtThread = {
  id: string;
  lessonId: string;
  title: string;
  message: string;
  status: "Open" | "Answered";
  response?: string;
};

export type Ticket = {
  id: string;
  topic: string;
  detail: string;
  status: "Open" | "In review" | "Resolved";
};

export type Purchase = {
  id: string;
  planId: string;
  createdAt: string;
  learnerIds: string[];
};
