import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

import { course, type Course, type Plan } from "@/lib/data";
import { seededChecklist, seededLiveSessions, seededPlans } from "@/lib/seed-data";

type DbAccount = {
  id: string;
  email: string;
  name: string;
  role: "PARENT" | "ADMIN" | "SUPPORT" | "INSTRUCTOR";
  parentConsentAt?: string;
};

type DbLearner = {
  id: string;
  accountId: string;
  nickname: string;
  classLevel: string;
  language: string;
};

type DbCourse = Course;

type DbOrder = {
  id: string;
  accountId: string;
  planId: string;
  learnerIds: string[];
  amountInr: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  providerOrderId: string;
  createdAt: string;
};

type DbPayment = {
  id: string;
  orderId: string;
  providerPaymentId: string;
  providerEventId?: string;
  amountInr: number;
  status: "CREATED" | "CAPTURED" | "FAILED" | "REFUNDED";
  method: string;
  capturedAt?: string;
};

type DbSubscription = {
  id: string;
  accountId: string;
  learnerId: string;
  planId: string;
  orderId: string;
  status: "ACTIVE" | "CANCELED" | "EXPIRED";
  startsAt: string;
  endsAt: string;
};

type DbEntitlement = {
  id: string;
  accountId: string;
  learnerId: string;
  productCode: string;
  orderId: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  startsAt: string;
  endsAt: string;
};

type DbProgress = {
  learnerId: string;
  lessonId: string;
  percent: number;
  resumeSecond: number;
  completedAt?: string;
};

type DbQuizAttempt = {
  id: string;
  learnerId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  submittedAt: string;
};

type DbDoubt = {
  id: string;
  accountId: string;
  learnerId: string;
  lessonId: string;
  title: string;
  status: "OPEN" | "ANSWERED";
  messages: { senderRole: "LEARNER" | "INSTRUCTOR"; body: string; createdAt: string }[];
};

type DbLiveSession = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  mode: string;
  hostName: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELED";
  joinProvider: string;
  recordingPublished: boolean;
  recordingUrl?: string;
};

type DbAttendance = {
  id: string;
  liveSessionId: string;
  accountId: string;
  learnerId: string;
  status: "REGISTERED" | "JOINED" | "ABSENT";
  joinToken?: string;
  joinedAt?: string;
};

type DbTicket = {
  id: string;
  requesterAccountId: string;
  assignedToId?: string;
  topic: string;
  detail: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED";
  orderId?: string;
  resolutionNote?: string;
  createdAt: string;
};

type DbRefund = {
  id: string;
  orderId: string;
  requesterAccountId: string;
  reviewerAccountId?: string;
  amountInr: number;
  reason: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "PROCESSED";
  createdAt: string;
  processedAt?: string;
};

type DbVendorEvent = {
  id: string;
  provider: string;
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  processedAt?: string;
};

type DbPlaybackSession = {
  id: string;
  accountId: string;
  learnerId: string;
  lessonId: string;
  token: string;
  watermark: string;
  expiresAt: string;
  revokedAt?: string;
};

type DbChecklistItem = {
  area: string;
  status: "Not started" | "In progress" | "Ready";
  note: string;
};

type DbAuditLog = {
  id: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: Record<string, unknown>;
  createdAt: string;
};

type DbPlanRecord = {
  id: string;
  code: string;
  name: string;
  priceInr: number;
  durationDays: number;
  highlight: string;
  features: string[];
  productCode: string;
  scope: "COURSE" | "CHAPTER";
};

export type AppDatabase = {
  version: number;
  accounts: DbAccount[];
  learners: DbLearner[];
  course: DbCourse;
  plans: DbPlanRecord[];
  orders: DbOrder[];
  payments: DbPayment[];
  subscriptions: DbSubscription[];
  entitlements: DbEntitlement[];
  progress: DbProgress[];
  quizAttempts: DbQuizAttempt[];
  doubts: DbDoubt[];
  liveSessions: DbLiveSession[];
  attendances: DbAttendance[];
  tickets: DbTicket[];
  refunds: DbRefund[];
  vendorEvents: DbVendorEvent[];
  playbackSessions: DbPlaybackSession[];
  checklist: DbChecklistItem[];
  auditLogs: DbAuditLog[];
};

const DB_VERSION = 1;
const DB_PATH = join(process.cwd(), "data", "app-db.json");

function nowIso() {
  return new Date().toISOString();
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function getSeedPlans(): DbPlanRecord[] {
  return seededPlans.map((plan) => ({
    id: `plan-${plan.code}`,
    code: plan.code,
    name: plan.name,
    priceInr: plan.priceInr,
    durationDays: plan.durationDays,
    highlight: plan.highlight,
    features: [...plan.features],
    productCode: plan.productCode,
    scope: plan.scope
  }));
}

function getInitialDb(): AppDatabase {
  const parentId = "account-parent";
  const supportId = "account-support";
  const lessonTwo = course.chapters[0]?.lessons[1];

  return {
    version: DB_VERSION,
    accounts: [
      {
        id: parentId,
        email: "parent@projectganit.local",
        name: "Neha Sharma",
        role: "PARENT",
        parentConsentAt: "2026-07-21T09:00:00.000Z"
      },
      {
        id: "account-admin",
        email: "admin@projectganit.local",
        name: "Ganit Admin",
        role: "ADMIN"
      },
      {
        id: supportId,
        email: "support@projectganit.local",
        name: "Support Agent",
        role: "SUPPORT"
      }
    ],
    learners: [
      {
        id: "learner-seed-1",
        accountId: parentId,
        nickname: "Aarav",
        classLevel: "Class 10",
        language: "Bilingual"
      }
    ],
    course,
    plans: getSeedPlans(),
    orders: [],
    payments: [],
    subscriptions: [],
    entitlements: [],
    progress: [
      {
        learnerId: "learner-seed-1",
        lessonId: "l-1",
        percent: 100,
        resumeSecond: 720,
        completedAt: "2026-07-20T12:00:00.000Z"
      },
      {
        learnerId: "learner-seed-1",
        lessonId: "l-2",
        percent: 35,
        resumeSecond: 210
      }
    ],
    quizAttempts: [],
    doubts: lessonTwo
      ? [
          {
            id: "doubt-seed-1",
            accountId: parentId,
            learnerId: "learner-seed-1",
            lessonId: lessonTwo.id,
            title: "Why use Euclid here instead of prime factors?",
            status: "ANSWERED",
            messages: [
              {
                senderRole: "LEARNER",
                body: "I can do factor trees but freeze on bigger numbers.",
                createdAt: "2026-07-21T10:00:00.000Z"
              },
              {
                senderRole: "INSTRUCTOR",
                body: "Use Euclid when factorization feels slow. Start with repeated division and stop once remainder becomes zero.",
                createdAt: "2026-07-21T10:30:00.000Z"
              }
            ]
          }
        ]
      : [],
    liveSessions: seededLiveSessions.map((session) => ({
      id: `live-${session.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: session.title,
      description: session.description,
      startsAt: session.startsAt,
      durationMinutes: session.durationMinutes,
      mode: session.mode,
      hostName: session.hostName,
      status: session.status,
      joinProvider: session.joinProvider,
      recordingPublished: session.recordingPublished,
      recordingUrl: "recordingUrl" in session ? session.recordingUrl : undefined
    })),
    attendances: [],
    tickets: [
      {
        id: "ticket-seed-1",
        requesterAccountId: parentId,
        assignedToId: supportId,
        topic: "Refund policy question",
        detail: "Please explain when chapter-pass upgrades get credited.",
        status: "IN_REVIEW",
        createdAt: "2026-07-21T11:00:00.000Z"
      }
    ],
    refunds: [],
    vendorEvents: [],
    playbackSessions: [],
    checklist: seededChecklist.map((item) => ({ ...item })),
    auditLogs: [
      {
        id: randomUUID(),
        actorRole: "ADMIN",
        action: "seed.completed",
        entityType: "system",
        entityId: "project-ganit",
        detail: { version: DB_VERSION },
        createdAt: "2026-07-21T09:00:00.000Z"
      }
    ]
  };
}

function ensureDbFile() {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  try {
    readFileSync(DB_PATH, "utf8");
  } catch {
    writeFileSync(DB_PATH, JSON.stringify(getInitialDb(), null, 2));
  }
}

export function loadDb(): AppDatabase {
  ensureDbFile();
  const parsed = JSON.parse(readFileSync(DB_PATH, "utf8")) as AppDatabase;
  if (!parsed.version || parsed.version < DB_VERSION) {
    const migrated = migrateDb(parsed);
    saveDb(migrated);
    return migrated;
  }

  return parsed;
}

export function saveDb(db: AppDatabase) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function resetDb() {
  saveDb(getInitialDb());
}

function migrateDb(db: Partial<AppDatabase>): AppDatabase {
  return {
    ...getInitialDb(),
    ...db,
    version: DB_VERSION
  };
}

export function mutateDb<T>(mutator: (db: AppDatabase) => T): T {
  const db = loadDb();
  const result = mutator(db);
  saveDb(db);
  return result;
}

export function createId(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

export function createOrderRecord(planCode: string, learnerIds: string[], accountId: string): DbOrder {
  const db = loadDb();
  const plan = db.plans.find((item) => item.code === planCode);
  if (!plan) {
    throw new Error("Unknown plan code");
  }

  return {
    id: createId("order"),
    accountId,
    planId: plan.code,
    learnerIds,
    amountInr: plan.priceInr,
    status: "PENDING",
    providerOrderId: `mock-order-${randomUUID()}`,
    createdAt: nowIso()
  };
}

export function createSubscriptionAndEntitlements(db: AppDatabase, order: DbOrder) {
  const plan = db.plans.find((item) => item.code === order.planId);
  if (!plan) {
    throw new Error("Plan not found");
  }

  for (const learnerId of order.learnerIds) {
    const existing = db.entitlements.find(
      (item) => item.orderId === order.id && item.learnerId === learnerId && item.productCode === plan.productCode
    );

    if (existing) {
      continue;
    }

    const subscriptionId = createId("sub");
    db.subscriptions.push({
      id: subscriptionId,
      accountId: order.accountId,
      learnerId,
      planId: plan.code,
      orderId: order.id,
      status: "ACTIVE",
      startsAt: nowIso(),
      endsAt: addDays(plan.durationDays)
    });

    db.entitlements.push({
      id: createId("ent"),
      accountId: order.accountId,
      learnerId,
      productCode: plan.productCode,
      orderId: order.id,
      status: "ACTIVE",
      startsAt: nowIso(),
      endsAt: addDays(plan.durationDays)
    });
  }
}

export function mapPlanRecordsToUi(dbPlans: DbPlanRecord[]): Plan[] {
  return dbPlans.map((plan) => ({
    id: plan.code,
    name: plan.name,
    price: `₹${plan.priceInr.toLocaleString("en-IN")}`,
    cadence: `${plan.durationDays} days`,
    highlight: plan.highlight,
    features: plan.features
  }));
}
