"use client";

import { useAppState } from "@/components/app-state";
import { AdminChecklistEditor, AdminContentForms } from "@/components/forms";

export default function AdminPage() {
  const { course, doubts, tickets, refunds, purchases, learners, reviewRefund, resolveTicket, refresh } = useAppState();

  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Admin CMS and launch room</span>
        <h1 className="title">Operate content, learner issues, refunds and readiness from one persisted workspace.</h1>
      </section>

      <section className="grid-2">
        <div className="panel">
          <h3>Content inventory</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Chapter</th>
                <th>Lessons</th>
                <th>Access split</th>
              </tr>
            </thead>
            <tbody>
              {course.chapters.map((chapter) => (
                <tr key={chapter.id}>
                  <td>{chapter.title}</td>
                  <td>{chapter.lessons.length}</td>
                  <td>
                    {chapter.lessons.filter((lesson) => lesson.isFree).length} free /{" "}
                    {chapter.lessons.filter((lesson) => !lesson.isFree).length} paid
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Doubts needing action</h3>
          <div className="card-list">
            {doubts.map((doubt) => (
              <div key={doubt.id} className="lesson-card">
                <strong>{doubt.title}</strong>
                <p className="small muted">{doubt.message}</p>
                <span className={doubt.status === "Answered" ? "status" : "status locked"}>{doubt.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdminContentForms />
      <AdminChecklistEditor />

      <section className="grid-2">
        <div className="panel">
          <h3>Support queue</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.topic}</td>
                  <td>{ticket.status}</td>
                  <td>
                    <button type="button" className="button-ghost" onClick={() => void resolveTicket(ticket.id)}>
                      Mark resolved
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Refund approvals</h3>
          <div className="card-list">
            {refunds.map((refund) => (
              <div key={refund.id} className="lesson-card">
                <strong>{refund.orderId}</strong>
                <p className="small muted">
                  ₹{refund.amountInr} • {refund.reason}
                </p>
                <span className="status">{refund.status}</span>
                <div className="actions">
                  <button type="button" className="button-ghost" onClick={() => void reviewRefund(refund.id, "approve")}>
                    Approve
                  </button>
                  <button type="button" className="button-ghost" onClick={() => void reviewRefund(refund.id, "process")}>
                    Process
                  </button>
                  <button type="button" className="button-ghost" onClick={() => void reviewRefund(refund.id, "reject")}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Payment lookup and entitlement correction</h3>
        <div className="card-list">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="lesson-card">
              <strong>{purchase.id}</strong>
              <p className="small muted">
                {purchase.planId} • ₹{purchase.amountInr} • {purchase.orderStatus}
              </p>
              <div className="actions">
                {learners
                  .filter((learner) => purchase.learnerIds.includes(learner.id))
                  .map((learner) => (
                    <button
                      key={learner.id}
                      type="button"
                      className="button-ghost"
                      onClick={async () => {
                        await fetch("/api/admin/entitlements", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orderId: purchase.id, learnerId: learner.id, active: true })
                        });
                        await refresh();
                      }}
                    >
                      Restore {learner.name} entitlement
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
