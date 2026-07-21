import Link from "next/link";

import { ParentOnboardingForm } from "@/components/forms";
import { PlanPicker } from "@/components/plan-picker";
import { course, liveSessions, supportPlaybook } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="shell stack">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Class 10 launch wedge • Hindi + English • Web/PWA first</span>
            <h1 className="title">One trusted maths path, from YouTube discovery to paid mastery.</h1>
            <p className="lede">
              Project Ganit is a creator-led NCERT Mathematics MVP for India. The free layer earns trust; the paid
              layer adds sequence, practice, doubts, live help and parent visibility.
            </p>
            <div className="actions">
              <Link href="/catalog" className="button">
                Explore course map
              </Link>
              <Link href="/learn/real-numbers-foundations" className="button-secondary">
                Start free sample lesson
              </Link>
            </div>
          </div>
          <div className="panel">
            <h3>Phase 1 scope</h3>
            <div className="card-list">
              <span>Responsive learner web app and PWA shell</span>
              <span>Parent-owned account with learner profiles</span>
              <span>Recorded lessons, quizzes, doubts and live session access</span>
              <span>Quarterly and annual subscriptions as the core commercial model</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-4">
        <div className="metric">
          <h3>Course</h3>
          <p className="metric-value">1</p>
          <p className="muted">Focused launch around Class 10 NCERT Mathematics</p>
        </div>
        <div className="metric">
          <h3>Chapters seeded</h3>
          <p className="metric-value">{course.chapters.length}</p>
          <p className="muted">Seeded curriculum with free and premium lessons</p>
        </div>
        <div className="metric">
          <h3>Live sessions</h3>
          <p className="metric-value">{liveSessions.length}</p>
          <p className="muted">Doubt and revision events ready for learner join flow</p>
        </div>
        <div className="metric">
          <h3>Parent trust</h3>
          <p className="metric-value">Visible</p>
          <p className="muted">Refund, cancellation and safety communication surfaced in-product</p>
        </div>
      </section>

      <section className="grid-2">
        <ParentOnboardingForm />
        <div className="panel">
          <h3>What the paid platform adds</h3>
          <div className="card-list">
            <span>Chapter sequencing instead of random topic hopping</span>
            <span>Progress evidence for learners and parents</span>
            <span>Practice, doubt resolution and live support around each lesson</span>
            <span>Clear plan pricing, cancellation path and support response framing</span>
          </div>
        </div>
      </section>

      <section className="stack">
        <div>
          <span className="eyebrow">Plans</span>
          <h2>Commercial ladder built around continuity, not one-off video sales.</h2>
        </div>
        <PlanPicker />
      </section>

      <section className="grid-2">
        <div className="panel">
          <h3>Operations promises</h3>
          <div className="card-list">
            {supportPlaybook.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>Public funnel rules</h3>
          <div className="card-list">
            <span>One video, one next step, one matched landing page.</span>
            <span>Sample lessons solve a real problem fully before asking for payment.</span>
            <span>Paid conversion happens around structure, not artificial scarcity.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
