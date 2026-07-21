"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { course, initialAdminChecklist, plans } from "@/lib/data";
import { createId } from "@/lib/helpers";
import type { DoubtThread, LearnerProfile, ProgressMap, Purchase, QuizAttempt, Ticket } from "@/lib/types";

type AdminChecklistItem = {
  area: string;
  status: string;
  note: string;
};

type AppStateValue = {
  parentName: string;
  setParentName: (value: string) => void;
  learners: LearnerProfile[];
  addLearner: (payload: Omit<LearnerProfile, "id">) => void;
  purchases: Purchase[];
  buyPlan: (planId: string, learnerIds: string[]) => void;
  hasEntitlement: boolean;
  progress: ProgressMap;
  updateProgress: (lessonId: string, value: number) => void;
  quizAttempts: QuizAttempt[];
  submitQuizAttempt: (attempt: QuizAttempt) => void;
  doubts: DoubtThread[];
  submitDoubt: (payload: { lessonId: string; title: string; message: string }) => void;
  tickets: Ticket[];
  submitTicket: (payload: { topic: string; detail: string }) => void;
  resolveTicket: (ticketId: string) => void;
  adminChecklist: AdminChecklistItem[];
  updateAdminChecklist: (area: string, status: string) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

const storageKey = "project-ganit-demo-state";

type PersistedState = {
  parentName: string;
  learners: LearnerProfile[];
  purchases: Purchase[];
  progress: ProgressMap;
  quizAttempts: QuizAttempt[];
  doubts: DoubtThread[];
  tickets: Ticket[];
  adminChecklist: AdminChecklistItem[];
};

const defaultState: PersistedState = {
  parentName: "",
  learners: [
    {
      id: "learner-seed-1",
      name: "Aarav",
      classLevel: "Class 10",
      language: "Bilingual"
    }
  ],
  purchases: [],
  progress: {
    "l-1": 100,
    "l-2": 35
  },
  quizAttempts: [],
  doubts: [
    {
      id: "doubt-seed-1",
      lessonId: "l-2",
      title: "Why use Euclid here instead of prime factors?",
      message: "I can do factor trees but freeze on bigger numbers.",
      status: "Answered",
      response: "Use Euclid when factorization feels slow. Start with repeated division and stop once remainder becomes zero."
    }
  ],
  tickets: [
    {
      id: "ticket-seed-1",
      topic: "Refund policy question",
      detail: "Please explain when chapter-pass upgrades get credited.",
      status: "In review"
    }
  ],
  adminChecklist: initialAdminChecklist
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as PersistedState;
      setState(parsed);
    } catch {
      setState(defaultState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const value: AppStateValue = {
    parentName: state.parentName,
    setParentName: (value) => {
      setState((current) => ({ ...current, parentName: value }));
    },
    learners: state.learners,
    addLearner: (payload) => {
      setState((current) => ({
        ...current,
        learners: [...current.learners, { ...payload, id: createId("learner") }]
      }));
    },
    purchases: state.purchases,
    buyPlan: (planId, learnerIds) => {
      const chosenPlan = plans.find((plan) => plan.id === planId);
      if (!chosenPlan || learnerIds.length === 0) {
        return;
      }

      setState((current) => ({
        ...current,
        purchases: [
          {
            id: createId("purchase"),
            planId,
            learnerIds,
            createdAt: new Date().toISOString()
          },
          ...current.purchases
        ]
      }));
    },
    hasEntitlement: state.purchases.length > 0,
    progress: state.progress,
    updateProgress: (lessonId, value) => {
      setState((current) => ({
        ...current,
        progress: {
          ...current.progress,
          [lessonId]: Math.min(100, Math.max(current.progress[lessonId] ?? 0, value))
        }
      }));
    },
    quizAttempts: state.quizAttempts,
    submitQuizAttempt: (attempt) => {
      setState((current) => ({
        ...current,
        quizAttempts: [attempt, ...current.quizAttempts]
      }));
    },
    doubts: state.doubts,
    submitDoubt: (payload) => {
      setState((current) => ({
        ...current,
        doubts: [
          {
            id: createId("doubt"),
            lessonId: payload.lessonId,
            title: payload.title,
            message: payload.message,
            status: "Open"
          },
          ...current.doubts
        ]
      }));
    },
    tickets: state.tickets,
    submitTicket: (payload) => {
      setState((current) => ({
        ...current,
        tickets: [
          {
            id: createId("ticket"),
            topic: payload.topic,
            detail: payload.detail,
            status: "Open"
          },
          ...current.tickets
        ]
      }));
    },
    resolveTicket: (ticketId) => {
      setState((current) => ({
        ...current,
        tickets: current.tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: "Resolved" } : ticket
        )
      }));
    },
    adminChecklist: state.adminChecklist,
    updateAdminChecklist: (area, status) => {
      setState((current) => ({
        ...current,
        adminChecklist: current.adminChecklist.map((item) =>
          item.area === area ? { ...item, status } : item
        )
      }));
    }
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}

export const seededCourseTitle = course.title;
