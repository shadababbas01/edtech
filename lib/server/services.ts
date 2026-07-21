import { randomUUID } from "node:crypto";

import type { AppSnapshot } from "@/lib/types";
import {
  canIssuePlayback,
  isWebhookEventNew,
  nextRefundState,
  shouldGrantEntitlement
} from "@/lib/server/domain";
import {
  createId,
  createOrderRecord,
  createSubscriptionAndEntitlements,
  loadDb,
  mapPlanRecordsToUi,
  mutateDb,
  resetDb
} from "@/lib/server/database";

const DEMO_ACCOUNT_ID = "account-parent";
const ADMIN_ACCOUNT_ID = "account-admin";
const SUPPORT_ACCOUNT_ID = "account-support";

function findLesson(course: AppSnapshot["course"], lessonSlug: string) {
  return course.chapters.flatMap((chapter) => chapter.lessons).find((lesson) => lesson.slug === lessonSlug);
}

export function ensureDemoData() {
  loadDb();
}

export function getAppSnapshot(): AppSnapshot {
  const db = loadDb();
  const account = db.accounts.find((item) => item.id === DEMO_ACCOUNT_ID);
  const learners = db.learners
    .filter((item) => item.accountId === DEMO_ACCOUNT_ID)
    .map((learner) => ({
      id: learner.id,
      name: learner.nickname,
      classLevel: learner.classLevel,
      language: learner.language
    }));

  const progress = Object.fromEntries(
    db.progress.filter((item) => learners.some((learner) => learner.id === item.learnerId)).map((item) => [item.lessonId, item.percent])
  );

  return {
    parentName: account?.name ?? "",
    learners,
    purchases: db.orders
      .filter((item) => item.accountId === DEMO_ACCOUNT_ID)
      .map((order) => ({
        id: order.id,
        planId: order.planId,
        createdAt: order.createdAt,
        learnerIds: order.learnerIds,
        orderStatus:
          order.status === "PENDING"
            ? ("Pending" as const)
            : order.status === "PAID"
              ? ("Paid" as const)
              : order.status === "FAILED"
                ? ("Failed" as const)
                : ("Refunded" as const),
        amountInr: order.amountInr
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    hasEntitlement: db.entitlements.some((item) => item.accountId === DEMO_ACCOUNT_ID && item.status === "ACTIVE"),
    progress,
    quizAttempts: db.quizAttempts
      .filter((item) => learners.some((learner) => learner.id === item.learnerId))
      .map((attempt) => ({
        id: attempt.id,
        lessonId: attempt.lessonId,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        submittedAt: attempt.submittedAt
      })),
    doubts: db.doubts
      .filter((item) => item.accountId === DEMO_ACCOUNT_ID)
      .map((doubt) => ({
        id: doubt.id,
        lessonId: doubt.lessonId,
        title: doubt.title,
        message: doubt.messages[0]?.body ?? "",
        status: doubt.status === "ANSWERED" ? "Answered" : "Open",
        response: doubt.messages.find((message) => message.senderRole === "INSTRUCTOR")?.body
      })),
    tickets: db.tickets
      .filter((item) => item.requesterAccountId === DEMO_ACCOUNT_ID)
      .map((ticket) => ({
        id: ticket.id,
        topic: ticket.topic,
        detail: ticket.detail,
        status: ticket.status === "IN_REVIEW" ? "In review" : ticket.status === "RESOLVED" ? "Resolved" : "Open",
        orderId: ticket.orderId,
        resolutionNote: ticket.resolutionNote
      })),
    refunds: db.refunds
      .filter((item) => item.requesterAccountId === DEMO_ACCOUNT_ID)
      .map((refund) => ({
        id: refund.id,
        orderId: refund.orderId,
        amountInr: refund.amountInr,
        reason: refund.reason,
        status:
          refund.status === "REQUESTED"
            ? "Requested"
            : refund.status === "APPROVED"
              ? "Approved"
              : refund.status === "REJECTED"
                ? "Rejected"
                : "Processed",
        createdAt: refund.createdAt
      })),
    adminChecklist: db.checklist,
    liveSessions: db.liveSessions.map((session) => ({
      id: session.id,
      title: session.title,
      date: new Date(session.startsAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
      }),
      mode: session.mode,
      host: session.hostName,
      status: session.status === "SCHEDULED" ? "Scheduled" : session.status === "LIVE" ? "Live" : session.status === "COMPLETED" ? "Completed" : "Canceled",
      recordingPublished: session.recordingPublished,
      recordingUrl: session.recordingUrl
    })),
    plans: mapPlanRecordsToUi(db.plans),
    course: db.course
  };
}

export function resetDemoData() {
  resetDb();
}

export function updateParentAndAddLearner(input: {
  parentName?: string;
  learnerName?: string;
  classLevel?: string;
  language?: string;
}) {
  mutateDb((db) => {
    const account = db.accounts.find((item) => item.id === DEMO_ACCOUNT_ID);
    if (account && input.parentName?.trim()) {
      account.name = input.parentName.trim();
    }

    if (input.learnerName?.trim() && input.classLevel && input.language) {
      db.learners.push({
        id: createId("learner"),
        accountId: DEMO_ACCOUNT_ID,
        nickname: input.learnerName.trim(),
        classLevel: input.classLevel,
        language: input.language
      });
      db.auditLogs.push({
        id: createId("audit"),
        actorRole: "PARENT",
        action: "learner.created",
        entityType: "learner",
        entityId: db.learners[db.learners.length - 1]!.id,
        detail: { classLevel: input.classLevel, language: input.language },
        createdAt: new Date().toISOString()
      });
    }
  });
}

export function createCheckout(planId: string, learnerIds: string[]) {
  return mutateDb((db) => {
    const order = createOrderRecord(planId, learnerIds, DEMO_ACCOUNT_ID);
    db.orders.unshift(order);
    db.auditLogs.push({
      id: createId("audit"),
      actorRole: "PARENT",
      action: "order.created",
      entityType: "order",
      entityId: order.id,
      detail: { planId, learnerIds },
      createdAt: new Date().toISOString()
    });

    return {
      orderId: order.id,
      providerOrderId: order.providerOrderId,
      amountInr: order.amountInr,
      status: order.status
    };
  });
}

export function verifyPayment(input: { orderId: string; providerPaymentId?: string; method?: string }) {
  return mutateDb((db) => {
    const order = db.orders.find((item) => item.id === input.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === "PAID") {
      return { orderId: order.id, status: "PAID" };
    }

    const paymentId = input.providerPaymentId ?? `mock-pay-${randomUUID()}`;
    db.payments.push({
      id: createId("payment"),
      orderId: order.id,
      providerPaymentId: paymentId,
      amountInr: order.amountInr,
      status: "CAPTURED",
      method: input.method ?? "mock-upi",
      capturedAt: new Date().toISOString()
    });

    order.status = "PAID";

    const plan = db.plans.find((item) => item.code === order.planId);
    const existing = db.entitlements.map((item) => ({
      orderId: item.orderId,
      learnerId: item.learnerId,
      productCode: item.productCode
    }));

    for (const learnerId of order.learnerIds) {
      if (
        plan &&
        shouldGrantEntitlement({
          orderId: order.id,
          learnerId,
          productCode: plan.productCode,
          existing
        })
      ) {
        createSubscriptionAndEntitlements(db, order);
        break;
      }
    }

    db.auditLogs.push({
      id: createId("audit"),
      actorRole: "PAYMENT_PROVIDER",
      action: "payment.captured",
      entityType: "order",
      entityId: order.id,
      detail: { providerPaymentId: paymentId },
      createdAt: new Date().toISOString()
    });

    return { orderId: order.id, status: order.status };
  });
}

export function processPaymentWebhook(input: {
  provider: string;
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
}) {
  return mutateDb((db) => {
    if (!isWebhookEventNew(db.vendorEvents.map((event) => event.eventId), input.eventId)) {
      return { processed: false, reason: "duplicate" };
    }

    db.vendorEvents.push({
      id: createId("vendor"),
      provider: input.provider,
      eventId: input.eventId,
      eventType: input.eventType,
      payload: input.payload,
      processedAt: new Date().toISOString()
    });

    if (input.eventType === "payment.captured") {
      const orderId = String(input.payload.orderId ?? "");
      if (orderId) {
        verifyPayment({ orderId, providerPaymentId: String(input.payload.paymentId ?? randomUUID()), method: "webhook" });
      }
    }

    return { processed: true };
  });
}

export function issuePlaybackToken(lessonSlug: string, learnerId?: string) {
  return mutateDb((db) => {
    const snapshot = getAppSnapshot();
    const lesson = findLesson(snapshot.course, lessonSlug);
    const activeLearnerId = learnerId ?? db.learners.find((item) => item.accountId === DEMO_ACCOUNT_ID)?.id;

    if (!lesson || !activeLearnerId) {
      throw new Error("Lesson or learner not found");
    }

    const entitled = lesson.isFree
      ? true
      : db.entitlements.some((item) => item.learnerId === activeLearnerId && item.status === "ACTIVE");

    const activeOtherSession = db.playbackSessions.some(
      (item) =>
        item.learnerId === activeLearnerId &&
        item.lessonId !== lesson.id &&
        !item.revokedAt &&
        new Date(item.expiresAt).getTime() > Date.now()
    );

    const verdict = canIssuePlayback({
      isFree: lesson.isFree,
      entitled,
      hasActiveOtherSession: activeOtherSession
    });

    if (!verdict.allowed) {
      throw new Error("Entitlement required");
    }

    if (verdict.revokePrevious) {
      for (const session of db.playbackSessions) {
        if (session.learnerId === activeLearnerId && !session.revokedAt) {
          session.revokedAt = new Date().toISOString();
        }
      }
    }

    const token = `playback-${randomUUID()}`;
    db.playbackSessions.push({
      id: createId("playback"),
      accountId: DEMO_ACCOUNT_ID,
      learnerId: activeLearnerId,
      lessonId: lesson.id,
      token,
      watermark: `Neha Sharma • ${lesson.title} • ${new Date().toLocaleDateString("en-IN")}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });

    return {
      token,
      expiresInSeconds: 300,
      watermark: db.playbackSessions[db.playbackSessions.length - 1]!.watermark
    };
  });
}

export function saveProgress(lessonId: string, percent: number) {
  mutateDb((db) => {
    const learner = db.learners.find((item) => item.accountId === DEMO_ACCOUNT_ID);
    if (!learner) {
      throw new Error("Learner not found");
    }

    const existing = db.progress.find((item) => item.learnerId === learner.id && item.lessonId === lessonId);
    if (existing) {
      existing.percent = Math.max(existing.percent, Math.min(percent, 100));
      existing.completedAt = existing.percent >= 100 ? new Date().toISOString() : existing.completedAt;
      return;
    }

    db.progress.push({
      learnerId: learner.id,
      lessonId,
      percent: Math.min(percent, 100),
      resumeSecond: 0,
      completedAt: percent >= 100 ? new Date().toISOString() : undefined
    });
  });
}

export function submitQuiz(lessonId: string, answers: Record<string, string>) {
  return mutateDb((db) => {
    const learner = db.learners.find((item) => item.accountId === DEMO_ACCOUNT_ID);
    const lesson = db.course.chapters.flatMap((chapter) => chapter.lessons).find((item) => item.id === lessonId);
    if (!learner || !lesson) {
      throw new Error("Learner or lesson not found");
    }

    const score = lesson.quiz.reduce((sum, question) => {
      const submitted = (answers[question.id] ?? "").trim().toLowerCase();
      return submitted === question.answer.trim().toLowerCase() ? sum + 1 : sum;
    }, 0);

    db.quizAttempts.unshift({
      id: createId("attempt"),
      learnerId: learner.id,
      lessonId,
      score,
      totalQuestions: lesson.quiz.length,
      answers,
      submittedAt: new Date().toISOString()
    });

    saveProgress(lessonId, 100);
    return { score, totalQuestions: lesson.quiz.length };
  });
}

export function submitDoubt(lessonId: string, title: string, message: string) {
  mutateDb((db) => {
    const learner = db.learners.find((item) => item.accountId === DEMO_ACCOUNT_ID);
    if (!learner) {
      throw new Error("Learner not found");
    }

    db.doubts.unshift({
      id: createId("doubt"),
      accountId: DEMO_ACCOUNT_ID,
      learnerId: learner.id,
      lessonId,
      title,
      status: "OPEN",
      messages: [
        {
          senderRole: "LEARNER",
          body: message,
          createdAt: new Date().toISOString()
        }
      ]
    });
  });
}

export function joinLiveSession(liveSessionId: string) {
  return mutateDb((db) => {
    const learner = db.learners.find((item) => item.accountId === DEMO_ACCOUNT_ID);
    const entitled = db.entitlements.some((item) => item.accountId === DEMO_ACCOUNT_ID && item.status === "ACTIVE");
    if (!learner || !entitled) {
      throw new Error("Entitlement required");
    }

    const existing = db.attendances.find(
      (item) => item.liveSessionId === liveSessionId && item.accountId === DEMO_ACCOUNT_ID && item.learnerId === learner.id
    );

    const token = `join-${randomUUID()}`;
    if (existing) {
      existing.status = "JOINED";
      existing.joinToken = token;
      existing.joinedAt = new Date().toISOString();
      return { token };
    }

    db.attendances.push({
      id: createId("attendance"),
      liveSessionId,
      accountId: DEMO_ACCOUNT_ID,
      learnerId: learner.id,
      status: "JOINED",
      joinToken: token,
      joinedAt: new Date().toISOString()
    });

    return { token };
  });
}

export function createSupportTicket(topic: string, detail: string, orderId?: string) {
  mutateDb((db) => {
    db.tickets.unshift({
      id: createId("ticket"),
      requesterAccountId: DEMO_ACCOUNT_ID,
      assignedToId: SUPPORT_ACCOUNT_ID,
      topic,
      detail,
      orderId,
      status: "OPEN",
      createdAt: new Date().toISOString()
    });
  });
}

export function resolveSupportTicket(ticketId: string, resolutionNote = "Resolved by support") {
  mutateDb((db) => {
    const ticket = db.tickets.find((item) => item.id === ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.status = "RESOLVED";
    ticket.resolutionNote = resolutionNote;
    db.auditLogs.push({
      id: createId("audit"),
      actorRole: "SUPPORT",
      action: "ticket.resolved",
      entityType: "ticket",
      entityId: ticketId,
      detail: { resolutionNote },
      createdAt: new Date().toISOString()
    });
  });
}

export function requestRefund(orderId: string, reason: string) {
  mutateDb((db) => {
    const order = db.orders.find((item) => item.id === orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    db.refunds.unshift({
      id: createId("refund"),
      orderId,
      requesterAccountId: DEMO_ACCOUNT_ID,
      amountInr: order.amountInr,
      reason,
      status: "REQUESTED",
      createdAt: new Date().toISOString()
    });
  });
}

export function reviewRefund(refundId: string, action: "approve" | "reject" | "process") {
  mutateDb((db) => {
    const refund = db.refunds.find((item) => item.id === refundId);
    if (!refund) {
      throw new Error("Refund not found");
    }

    refund.status = nextRefundState(refund.status, action);
    refund.reviewerAccountId = ADMIN_ACCOUNT_ID;
    if (refund.status === "PROCESSED") {
      refund.processedAt = new Date().toISOString();
      const order = db.orders.find((item) => item.id === refund.orderId);
      if (order) {
        order.status = "REFUNDED";
      }
    }
  });
}

export function correctEntitlement(orderId: string, learnerId: string, active: boolean) {
  mutateDb((db) => {
    const entitlement = db.entitlements.find((item) => item.orderId === orderId && item.learnerId === learnerId);
    if (!entitlement) {
      throw new Error("Entitlement not found");
    }

    entitlement.status = active ? "ACTIVE" : "REVOKED";
    db.auditLogs.push({
      id: createId("audit"),
      actorRole: "SUPPORT",
      action: "entitlement.corrected",
      entityType: "entitlement",
      entityId: entitlement.id,
      detail: { active },
      createdAt: new Date().toISOString()
    });
  });
}

export function updateChecklist(area: string, status: "Not started" | "In progress" | "Ready") {
  mutateDb((db) => {
    const item = db.checklist.find((entry) => entry.area === area);
    if (item) {
      item.status = status;
    }
  });
}

export function updateCourseMetadata(input: { title: string; promise: string; subtitle: string }) {
  mutateDb((db) => {
    db.course.title = input.title;
    db.course.promise = input.promise;
    db.course.subtitle = input.subtitle;
  });
}

export function createChapter(input: { title: string; summary: string; target: string }) {
  mutateDb((db) => {
    db.course.chapters.push({
      id: createId("ch"),
      title: input.title,
      summary: input.summary,
      target: input.target,
      lessons: []
    });
  });
}

export function createLesson(input: {
  chapterId: string;
  title: string;
  summary: string;
  topic: string;
  duration: string;
  isFree: boolean;
}) {
  mutateDb((db) => {
    const chapter = db.course.chapters.find((item) => item.id === input.chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    chapter.lessons.push({
      id: createId("lesson"),
      slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: input.title,
      duration: input.duration,
      summary: input.summary,
      isFree: input.isFree,
      topic: input.topic,
      chapterId: chapter.id,
      videoPrompt: "Admin-created lesson pending enriched video prompt.",
      notes: ["Admin-created lesson note placeholder."],
      quiz: []
    });
  });
}

export function createPlan(input: { name: string; priceInr: number; durationDays: number; highlight: string; productCode: string }) {
  mutateDb((db) => {
    db.plans.push({
      id: createId("plan"),
      code: `custom-${randomUUID().slice(0, 8)}`,
      name: input.name,
      priceInr: input.priceInr,
      durationDays: input.durationDays,
      highlight: input.highlight,
      features: ["Custom admin-created plan"],
      productCode: input.productCode,
      scope: "COURSE"
    });
  });
}

export function createLiveSession(input: {
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  mode: string;
  hostName: string;
}) {
  mutateDb((db) => {
    db.liveSessions.push({
      id: createId("live"),
      title: input.title,
      description: input.description,
      startsAt: input.startsAt,
      durationMinutes: input.durationMinutes,
      mode: input.mode,
      hostName: input.hostName,
      status: "SCHEDULED",
      joinProvider: "mock-100ms",
      recordingPublished: false
    });
  });
}
