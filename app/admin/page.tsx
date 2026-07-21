"use client";

import { useAppState } from "@/components/app-state";
import { AdminChecklistEditor } from "@/components/forms";
import { course } from "@/lib/data";

export default function AdminPage() {
  const { doubts, tickets, resolveTicket } = useAppState();

  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Admin CMS and launch room</span>
        <h1 className="title">Operate content, learner issues and go-live readiness from one place.</h1>
      </section>

      <section className="grid-2">
        <div className="panel">
          <h3>Seeded content inventory</h3>
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

      <AdminChecklistEditor />

      <section className="panel">
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
                  <button type="button" className="button-ghost" onClick={() => resolveTicket(ticket.id)}>
                    Mark resolved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
