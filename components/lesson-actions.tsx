"use client";

import { useMemo, useState } from "react";

import { useAppState } from "@/components/app-state";
import type { Lesson } from "@/lib/data";

export function LessonActions({ lesson }: { lesson: Lesson }) {
  const { hasEntitlement, progress, updateProgress, submitQuizAttempt, submitDoubt } = useAppState();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [doubtTitle, setDoubtTitle] = useState("");
  const [doubtMessage, setDoubtMessage] = useState("");

  const unlocked = lesson.isFree || hasEntitlement;
  const lessonProgress = progress[lesson.id] ?? 0;

  const quizState = useMemo(() => {
    if (score === null) {
      return null;
    }

    return `${score}/${lesson.quiz.length} correct`;
  }, [lesson.quiz.length, score]);

  function handleSubmitQuiz() {
    let nextScore = 0;

    lesson.quiz.forEach((item) => {
      if ((selectedAnswers[item.id] ?? "").trim().toLowerCase() === item.answer.trim().toLowerCase()) {
        nextScore += 1;
      }
    });

    setScore(nextScore);
    submitQuizAttempt({
      lessonId: lesson.id,
      score: nextScore,
      submittedAt: new Date().toISOString()
    });
    updateProgress(lesson.id, 100);
  }

  function handleDoubtSubmit() {
    if (!doubtTitle || !doubtMessage) {
      return;
    }

    submitDoubt({
      lessonId: lesson.id,
      title: doubtTitle,
      message: doubtMessage
    });
    setDoubtTitle("");
    setDoubtMessage("");
  }

  if (!unlocked) {
    return (
      <div className="panel">
        <h3>Premium lesson locked</h3>
        <p className="muted">
          This lesson uses entitlement-gated playback. Unlock a plan to access the complete sequence, chapter
          practice and live doubt support.
        </p>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="panel">
        <h3>Learning controls</h3>
        <div className="actions">
          <button type="button" className="button" onClick={() => updateProgress(lesson.id, lessonProgress + 25)}>
            Save progress heartbeat
          </button>
          <button type="button" className="button-ghost" onClick={() => updateProgress(lesson.id, 100)}>
            Mark complete
          </button>
          <span className="status">{lessonProgress}% saved</span>
        </div>
      </div>

      <div className="panel">
        <h3>Quick check</h3>
        <div className="stack">
          {lesson.quiz.map((item) => (
            <div key={item.id} className="lesson-card">
              <p>
                <strong>{item.question}</strong>
              </p>
              {item.type === "mcq" ? (
                <div className="chips">
                  {item.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={selectedAnswers[item.id] === option ? "button-secondary" : "button-ghost"}
                      onClick={() => setSelectedAnswers((current) => ({ ...current, [item.id]: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="field">
                  <input
                    value={selectedAnswers[item.id] ?? ""}
                    onChange={(event) =>
                      setSelectedAnswers((current) => ({ ...current, [item.id]: event.target.value }))
                    }
                    placeholder="Type your numeric answer"
                  />
                </div>
              )}
              {score !== null ? <p className="small muted">{item.explanation}</p> : null}
            </div>
          ))}
          <div className="actions">
            <button type="button" className="button" onClick={handleSubmitQuiz}>
              Submit quiz
            </button>
            {quizState ? <span className="status">{quizState}</span> : null}
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Ask a doubt</h3>
        <div className="form-grid">
          <label className="field">
            <span>Doubt title</span>
            <input value={doubtTitle} onChange={(event) => setDoubtTitle(event.target.value)} />
          </label>
          <label className="field">
            <span>What is confusing right now?</span>
            <textarea value={doubtMessage} onChange={(event) => setDoubtMessage(event.target.value)} />
          </label>
          <div className="actions">
            <button type="button" className="button" onClick={handleDoubtSubmit}>
              Submit doubt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
