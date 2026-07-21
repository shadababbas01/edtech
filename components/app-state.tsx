"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { AppSnapshot } from "@/lib/types";

type AppStateValue = AppSnapshot & {
  setParentName: (value: string) => void;
  saveParentProfile: () => Promise<void>;
  addLearner: (payload: { name: string; classLevel: string; language: string }) => Promise<void>;
  buyPlan: (planId: string, learnerIds: string[]) => Promise<void>;
  updateProgress: (lessonId: string, value: number) => Promise<void>;
  submitQuiz: (lessonId: string, answers: Record<string, string>) => Promise<{ score: number; totalQuestions: number }>;
  submitDoubt: (payload: { lessonId: string; title: string; message: string }) => Promise<void>;
  submitTicket: (payload: { topic: string; detail: string; orderId?: string }) => Promise<void>;
  resolveTicket: (ticketId: string) => Promise<void>;
  requestRefund: (orderId: string, reason: string) => Promise<void>;
  reviewRefund: (refundId: string, action: "approve" | "reject" | "process") => Promise<void>;
  joinLiveSession: (liveSessionId: string) => Promise<{ token: string }>;
  issuePlaybackToken: (lessonSlug: string, learnerId?: string) => Promise<{ token: string; watermark: string }>;
  updateAdminChecklist: (area: string, status: "Not started" | "In progress" | "Ready") => Promise<void>;
  createPlan: (payload: { name: string; priceInr: number; durationDays: number; highlight: string; productCode: string }) => Promise<void>;
  createLiveSession: (payload: {
    title: string;
    description: string;
    startsAt: string;
    durationMinutes: number;
    mode: string;
    hostName: string;
  }) => Promise<void>;
  updateCourseMetadata: (payload: { title: string; promise: string; subtitle: string }) => Promise<void>;
  createChapter: (payload: { title: string; summary: string; target: string }) => Promise<void>;
  createLesson: (payload: {
    chapterId: string;
    title: string;
    summary: string;
    topic: string;
    duration: string;
    isFree: boolean;
  }) => Promise<void>;
  refresh: () => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | null>(null);

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Request failed");
  }

  return (await response.json()) as T;
}

export function AppStateProvider({
  children,
  initialSnapshot
}: {
  children: ReactNode;
  initialSnapshot: AppSnapshot;
}) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(initialSnapshot);

  const value = useMemo<AppStateValue>(
    () => ({
      ...snapshot,
      setParentName: (value) => {
        setSnapshot((current) => ({ ...current, parentName: value }));
      },
      saveParentProfile: async () => {
        await request("/api/learners", {
          method: "POST",
          body: JSON.stringify({ parentName: snapshot.parentName })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      addLearner: async (payload) => {
        await request("/api/learners", {
          method: "POST",
          body: JSON.stringify({
            parentName: snapshot.parentName,
            learnerName: payload.name,
            classLevel: payload.classLevel,
            language: payload.language
          })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      buyPlan: async (planId, learnerIds) => {
        const checkout = await request<{ orderId: string }>("/api/checkout", {
          method: "POST",
          body: JSON.stringify({ planId, learnerIds })
        });
        await request("/api/payments/verify", {
          method: "POST",
          body: JSON.stringify({ orderId: checkout.orderId, method: "mock-upi" })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      updateProgress: async (lessonId, value) => {
        await request("/api/progress", {
          method: "POST",
          body: JSON.stringify({ lessonId, percent: value })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      submitQuiz: async (lessonId, answers) => {
        const result = await request<{ score: number; totalQuestions: number }>("/api/quiz-attempts", {
          method: "POST",
          body: JSON.stringify({ lessonId, answers })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
        return result;
      },
      submitDoubt: async (payload) => {
        await request("/api/doubts", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      submitTicket: async (payload) => {
        await request("/api/support-tickets", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      resolveTicket: async (ticketId) => {
        await request(`/api/support-tickets/${ticketId}/resolve`, { method: "POST", body: JSON.stringify({}) });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      requestRefund: async (orderId, reason) => {
        await request("/api/refunds", {
          method: "POST",
          body: JSON.stringify({ orderId, reason })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      reviewRefund: async (refundId, action) => {
        await request(`/api/refunds/${refundId}`, {
          method: "POST",
          body: JSON.stringify({ action })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      joinLiveSession: async (liveSessionId) => request(`/api/live/${liveSessionId}/join`, { method: "POST", body: JSON.stringify({}) }),
      issuePlaybackToken: async (lessonSlug, learnerId) =>
        request("/api/playback-token", {
          method: "POST",
          body: JSON.stringify({ lessonSlug, learnerId })
        }),
      updateAdminChecklist: async (area, status) => {
        await request("/api/admin/checklist", {
          method: "PATCH",
          body: JSON.stringify({ area, status })
        });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      createPlan: async (payload) => {
        await request("/api/admin/plans", { method: "POST", body: JSON.stringify(payload) });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      createLiveSession: async (payload) => {
        await request("/api/admin/live-sessions", { method: "POST", body: JSON.stringify(payload) });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      updateCourseMetadata: async (payload) => {
        await request("/api/admin/course", { method: "PATCH", body: JSON.stringify(payload) });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      createChapter: async (payload) => {
        await request("/api/admin/chapters", { method: "POST", body: JSON.stringify(payload) });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      createLesson: async (payload) => {
        await request("/api/admin/lessons", { method: "POST", body: JSON.stringify(payload) });
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      },
      refresh: async () => {
        const next = await request<AppSnapshot>("/api/state");
        setSnapshot(next);
      }
    }),
    [snapshot]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
