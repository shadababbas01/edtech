"use client";

import { useAppState } from "@/components/app-state";
import { getDashboardMetrics } from "@/lib/helpers";

export default function ParentDashboardPage() {
  const { learners, parentName, purchases, progress, doubts } = useAppState();
  const metrics = getDashboardMetrics(progress);

  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Parent dashboard</span>
        <h1 className="title">{parentName ? `${parentName}'s overview` : "Parent progress and billing overview"}</h1>
        <p className="lede">This view prioritizes plan status, learner momentum, open doubts and support visibility.</p>
      </section>

      <section className="grid-4">
        <div className="metric">
          <h3>Learners linked</h3>
          <p className="metric-value">{learners.length}</p>
        </div>
        <div className="metric">
          <h3>Plans purchased</h3>
          <p className="metric-value">{purchases.length}</p>
        </div>
        <div className="metric">
          <h3>Lessons completed</h3>
          <p className="metric-value">{metrics.completed}</p>
        </div>
        <div className="metric">
          <h3>Open doubts</h3>
          <p className="metric-value">{doubts.filter((item) => item.status === "Open").length}</p>
        </div>
      </section>

      <section className="grid-2">
        <div className="panel">
          <h3>Weekly summary</h3>
          <div className="card-list">
            <span>Total course completion: {Math.round(metrics.totalProgress)}%</span>
            <span>Completed lessons: {metrics.completed} of {metrics.total}</span>
            <span>Suggested next action: finish the first premium chapter and attend the next doubt clinic.</span>
          </div>
        </div>
        <div className="panel">
          <h3>Trust and policy view</h3>
          <div className="card-list">
            <span>Cancellation is self-serve and remains visible inside account settings in the production target.</span>
            <span>Refund handling for duplicate payments and technical non-delivery is prioritized.</span>
            <span>Child profiles are intentionally minimal and parent-controlled.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
