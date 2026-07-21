"use client";

import { useAppState } from "@/components/app-state";
import { course } from "@/lib/data";
import { formatPercent, getChapterProgress } from "@/lib/helpers";

export default function PracticePage() {
  const { progress, quizAttempts } = useAppState();

  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Practice and mastery</span>
        <h1 className="title">Track chapter completion and quiz performance in one place.</h1>
      </section>

      <section className="grid-2">
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className="panel">
            <h3>{chapter.title}</h3>
            <p className="metric-value">{formatPercent(getChapterProgress(progress, chapter.id))}</p>
            <p className="muted">Average lesson completion across this chapter.</p>
          </div>
        ))}
      </section>

      <section className="panel">
        <h3>Recent quiz attempts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Score</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {quizAttempts.length === 0 ? (
              <tr>
                <td colSpan={3} className="muted">
                  No attempts yet. Complete any lesson quick check to populate this table.
                </td>
              </tr>
            ) : (
              quizAttempts.map((attempt) => (
                <tr key={attempt.submittedAt}>
                  <td>{attempt.lessonId}</td>
                  <td>{attempt.score}</td>
                  <td>{new Date(attempt.submittedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
