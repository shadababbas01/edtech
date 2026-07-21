"use client";

import Link from "next/link";

import { ParentOnboardingForm } from "@/components/forms";
import { PlanPicker } from "@/components/plan-picker";
import { useAppState } from "@/components/app-state";
import { supportPlaybook } from "@/lib/data";

export default function HomePage() {
  const { course, liveSessions } = useAppState();

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
              <Link href={`/learn/${course.chapters[0]?.lessons[0]?.slug ?? "real-numbers-foundations"}`} className="button-secondary">
                Start free sample lesson
              </Link>
            </div>
          </div>
          <div className="panel">
            <h3>Phase 2 status</h3>
            <div className="card-list">
              <span>Server-backed onboarding, orders, payments and entitlements</span>
              <span>Playback token issuance with concurrency handoff</span>
              <span>Persisted doubts, tickets, refunds, live attendance and admin controls</span>
              <span>Embedded migration/seed scripts for local demo operation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-4">
        <div className="metric">
          <h3>Course</h3>
          <p className="metric-value">1</p>
          <p className="muted">Focused launch around {course.title}</p>
        </div>
        <div className="metric">
          <h3>Chapters seeded</h3>
          <p className="metric-value">{course.chapters.length}</p>
          <p className="muted">Curriculum now loads from the server-backed store</p>
        </div>
        <div className="metric">
          <h3>Live sessions</h3>
          <p className="metric-value">{liveSessions.length}</p>
          <p className="muted">Join-token flow and attendance persistence are active</p>
        </div>
        <div className="metric">
          <h3>Parent trust</h3>
          <p className="metric-value">Visible</p>
          <p className="muted">Refund, cancellation and support workflow remain surfaced in-product</p>
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
            <span>Persisted payments, entitlements and issue resolution trails</span>
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
