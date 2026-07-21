export const seededPlans = [
  {
    code: "chapter-pass-real-numbers",
    name: "Chapter Pass",
    priceInr: 199,
    durationDays: 60,
    highlight: "Fast exam-time unlock",
    features: ["All videos in Real Numbers", "Notes and chapter quiz", "Upgrade credit within 14 days"],
    productCode: "chapter-real-numbers",
    productName: "Real Numbers Chapter Access",
    productDescription: "Single chapter access for late-season exam prep.",
    scope: "CHAPTER"
  },
  {
    code: "quarterly-core",
    name: "Quarterly Core",
    priceInr: 999,
    durationDays: 90,
    highlight: "Recommended launch plan",
    features: ["Full course access", "Progress tracking", "Two group doubt sessions per month"],
    productCode: "course-class-10-maths",
    productName: "Class 10 NCERT Mathematics",
    productDescription: "Complete course access for one academic quarter.",
    scope: "COURSE"
  },
  {
    code: "annual-core",
    name: "Annual Core",
    priceInr: 2999,
    durationDays: 365,
    highlight: "Best value for parents",
    features: ["Complete class course", "Mock tests and revision plan", "Weekly parent progress summary"],
    productCode: "course-class-10-maths",
    productName: "Class 10 NCERT Mathematics",
    productDescription: "Full-year access with parent reporting.",
    scope: "COURSE"
  }
] as const;

export const seededLiveSessions = [
  {
    title: "Weekly Doubt Clinic: Real Numbers",
    description: "Solve current chapter doubts and practice fast-solving patterns.",
    startsAt: "2026-07-25T12:30:00.000Z",
    durationMinutes: 60,
    mode: "Group live doubt session",
    hostName: "Shadab Sir",
    joinProvider: "mock-100ms",
    status: "SCHEDULED",
    recordingPublished: false
  },
  {
    title: "Pre-board Strategy Sprint",
    description: "Revision strategy and high-yield board preparation.",
    startsAt: "2026-07-28T13:30:00.000Z",
    durationMinutes: 75,
    mode: "Live revision class",
    hostName: "Shadab Sir",
    joinProvider: "mock-100ms",
    status: "SCHEDULED",
    recordingPublished: true,
    recordingUrl: "https://example.com/mock-recording/pre-board-strategy"
  }
] as const;

export const seededChecklist = [
  { area: "Content", status: "In progress", note: "Two sample chapters seeded for beta." },
  { area: "Payments", status: "In progress", note: "Webhook-safe mock payment flow implemented; live gateway pending." },
  { area: "Video", status: "In progress", note: "Playback authorization and concurrency enforcement implemented in mock mode." },
  { area: "Privacy", status: "In progress", note: "Parent-led onboarding and minimal learner identity model in place." },
  { area: "Analytics", status: "Ready", note: "Core operational metrics are derivable from persisted events and progress." }
] as const;
