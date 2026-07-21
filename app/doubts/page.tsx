"use client";

import { useAppState } from "@/components/app-state";

export default function DoubtsPage() {
  const { doubts, course } = useAppState();

  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Doubt inbox</span>
        <h1 className="title">Every learner question stays tied to a lesson and visible until resolved.</h1>
      </section>

      <section className="panel">
        <div className="card-list">
          {doubts.map((doubt) => {
            const lesson = course.chapters.flatMap((chapter) => chapter.lessons).find((item) => item.id === doubt.lessonId);

            return (
              <div key={doubt.id} className="lesson-card">
                <div className="inline">
                  <strong>{doubt.title}</strong>
                  <span className={doubt.status === "Answered" ? "status" : "status locked"}>{doubt.status}</span>
                </div>
                <p className="small muted">{lesson?.title ?? "Unknown lesson"}</p>
                <p>{doubt.message}</p>
                {doubt.response ? <p className="small muted">Teacher response: {doubt.response}</p> : null}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
