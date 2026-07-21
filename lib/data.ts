export type Lesson = {
  id: string;
  slug: string;
  title: string;
  duration: string;
  summary: string;
  isFree: boolean;
  topic: string;
  chapterId: string;
  videoPrompt: string;
  notes: string[];
  quiz: {
    id: string;
    question: string;
    type: "mcq" | "numeric";
    options?: string[];
    answer: string;
    explanation: string;
  }[];
};

export type Chapter = {
  id: string;
  title: string;
  summary: string;
  target: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  teacher: string;
  promise: string;
  chapters: Chapter[];
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  highlight: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "chapter-pass",
    name: "Chapter Pass",
    price: "₹199",
    cadence: "60 days",
    highlight: "Fast exam-time unlock",
    features: ["All lessons in one chapter", "Notes and chapter quiz", "Upgrade credit within 14 days"]
  },
  {
    id: "quarterly-core",
    name: "Quarterly Core",
    price: "₹999",
    cadence: "90 days",
    highlight: "Recommended launch plan",
    features: ["Full course access", "Progress tracking", "Two group doubt sessions per month"]
  },
  {
    id: "annual-core",
    name: "Annual Core",
    price: "₹2,999",
    cadence: "12 months",
    highlight: "Best value for parents",
    features: ["Complete class course", "Mock tests and revision plan", "Weekly parent progress summary"]
  }
];

export const liveSessions = [
  {
    id: "live-1",
    title: "Weekly Doubt Clinic: Real Numbers",
    date: "2026-07-25 18:00 IST",
    mode: "Group live doubt session",
    host: "Shadab Sir",
    status: "Scheduled",
    recordingPublished: false
  },
  {
    id: "live-2",
    title: "Pre-board Strategy Sprint",
    date: "2026-07-28 19:00 IST",
    mode: "Live revision class",
    host: "Shadab Sir",
    status: "Scheduled",
    recordingPublished: true
  }
];

export const supportPlaybook = [
  "Payment/access issues acknowledged within 1 hour for paid learners.",
  "Refund policy and cancellation path remain visible before checkout and inside account settings.",
  "Every support correction produces an audit note in the admin view."
];

export const course: Course = {
  slug: "class-10-ncert-maths",
  title: "Class 10 NCERT Mathematics",
  subtitle: "Hindi + English mobile-first mastery path",
  teacher: "Shadab Sir",
  promise: "One trusted teacher, one complete sequence, every chapter mapped and tracked.",
  chapters: [
    {
      id: "ch-1",
      title: "Real Numbers",
      summary: "Master Euclid, HCF-LCM logic and irrational-number proof patterns.",
      target: "Finish this chapter before your first diagnostic retest.",
      lessons: [
        {
          id: "l-1",
          slug: "real-numbers-foundations",
          title: "Euclid Division Lemma Foundations",
          duration: "12 min",
          summary: "Understand the theorem, notation and the most common board-style twist.",
          isFree: true,
          topic: "Euclid Division Lemma",
          chapterId: "ch-1",
          videoPrompt: "Teacher-led walkthrough with worked examples and Hindi-English explanation.",
          notes: [
            "State the lemma clearly before applying it.",
            "Translate word problems into divisor, dividend, quotient and remainder.",
            "Check that remainder is smaller than divisor."
          ],
          quiz: [
            {
              id: "q-1",
              question: "In Euclid's division lemma, which condition is always true for remainder r?",
              type: "mcq",
              options: ["r > b", "0 ≤ r < b", "r = b", "r < 0"],
              answer: "0 ≤ r < b",
              explanation: "The remainder must be non-negative and strictly less than the divisor."
            }
          ]
        },
        {
          id: "l-2",
          slug: "hcf-lcm-rapid-methods",
          title: "HCF and LCM Rapid Methods",
          duration: "16 min",
          summary: "Learn prime-factor and Euclid-based methods for common exam questions.",
          isFree: false,
          topic: "HCF and LCM",
          chapterId: "ch-1",
          videoPrompt: "Side-by-side comparison of methods with quick-check pauses.",
          notes: [
            "Use prime factorization when the numbers are factor-friendly.",
            "Use Euclid when values are large or awkward.",
            "Write the final statement in context if the question is word-based."
          ],
          quiz: [
            {
              id: "q-2",
              question: "Find the HCF of 135 and 225.",
              type: "numeric",
              answer: "45",
              explanation: "Using Euclid or prime factorization gives HCF = 45."
            }
          ]
        }
      ]
    },
    {
      id: "ch-2",
      title: "Polynomials",
      summary: "Zeroes, relationships of coefficients and graph intuition in one clean path.",
      target: "Aim for full accuracy in MCQ and case-based prompts.",
      lessons: [
        {
          id: "l-3",
          slug: "zeroes-of-polynomials",
          title: "Zeroes of Polynomials",
          duration: "14 min",
          summary: "Read polynomial behavior quickly and connect algebra to graph crossings.",
          isFree: true,
          topic: "Zeroes",
          chapterId: "ch-2",
          videoPrompt: "Graph-first explanation before symbolic derivation.",
          notes: [
            "A zero is the x-value where the polynomial becomes zero.",
            "Graph crossings help build intuition for factor forms.",
            "Always verify candidate zeroes by substitution."
          ],
          quiz: [
            {
              id: "q-3",
              question: "If x = 2 is a zero of p(x), what is p(2)?",
              type: "numeric",
              answer: "0",
              explanation: "By definition, a zero makes the polynomial equal to zero."
            }
          ]
        },
        {
          id: "l-4",
          slug: "quadratic-relationships",
          title: "Relationship Between Zeroes and Coefficients",
          duration: "18 min",
          summary: "Move from formula memory to reliable use in proof and solve questions.",
          isFree: false,
          topic: "Relationships",
          chapterId: "ch-2",
          videoPrompt: "Exam-pattern walkthrough with checkpoints.",
          notes: [
            "For ax² + bx + c, sum of zeroes = -b/a.",
            "Product of zeroes = c/a.",
            "Use substitution to verify answers when time allows."
          ],
          quiz: [
            {
              id: "q-4",
              question: "For x² - 5x + 6, what is the sum of zeroes?",
              type: "numeric",
              answer: "5",
              explanation: "The sum of zeroes for ax² + bx + c is -b/a, so -(-5)/1 = 5."
            }
          ]
        }
      ]
    }
  ]
};

export const allLessons: Lesson[] = course.chapters.flatMap((chapter) => chapter.lessons);

export const initialAdminChecklist = [
  { area: "Content", status: "In progress", note: "Two sample chapters seeded for beta." },
  { area: "Payments", status: "In progress", note: "Mock checkout implemented; live gateway pending." },
  { area: "Video", status: "In progress", note: "Tokenized demo playback UX and watermark present." },
  { area: "Privacy", status: "In progress", note: "Parent-led onboarding and deletion notice added." },
  { area: "Analytics", status: "Ready", note: "Core funnel and learning metrics visualized in-app." }
];
