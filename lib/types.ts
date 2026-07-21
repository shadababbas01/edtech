import type { Course, Plan } from "@/lib/data";

export type LearnerProfile = {
  id: string;
  name: string;
  classLevel: string;
  language: string;
};

export type ProgressMap = Record<string, number>;

export type QuizAttempt = {
  id: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
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
  orderId?: string;
  resolutionNote?: string;
};

export type Purchase = {
  id: string;
  planId: string;
  createdAt: string;
  learnerIds: string[];
  orderStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  amountInr: number;
};

export type RefundRequest = {
  id: string;
  orderId: string;
  amountInr: number;
  reason: string;
  status: "Requested" | "Approved" | "Rejected" | "Processed";
  createdAt: string;
};

export type LiveSessionSummary = {
  id: string;
  title: string;
  date: string;
  mode: string;
  host: string;
  status: "Scheduled" | "Live" | "Completed" | "Canceled";
  recordingPublished: boolean;
  recordingUrl?: string;
};

export type AdminChecklistItem = {
  area: string;
  status: "Not started" | "In progress" | "Ready";
  note: string;
};

export type AdminContentSummary = {
  courses: Course[];
  plans: Plan[];
  liveSessions: LiveSessionSummary[];
};

export type AppSnapshot = {
  parentName: string;
  learners: LearnerProfile[];
  purchases: Purchase[];
  hasEntitlement: boolean;
  progress: ProgressMap;
  quizAttempts: QuizAttempt[];
  doubts: DoubtThread[];
  tickets: Ticket[];
  refunds: RefundRequest[];
  adminChecklist: AdminChecklistItem[];
  liveSessions: LiveSessionSummary[];
  plans: Plan[];
  course: Course;
};
