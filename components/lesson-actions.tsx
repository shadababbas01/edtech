"use client";

import { useMemo, useState } from "react";

import { useAppState } from "@/components/app-state";
import type { Lesson } from "@/lib/data";

export function LessonActions({ lesson }: { lesson: Lesson }) {
  const { hasEntitlement, progress, updateProgress, submitQuiz, submitDoubt, issuePlaybackToken, learners } =
    useAppState();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [doubtTitle, setDoubtTitle] = useState("");
  const [doubtMessage, setDoubtMessage] = useState("");
  const [playbackToken, setPlaybackToken] = useState<string | null>(null);
  const [watermark, setWatermark] = useState<string | null>(null);

  const unlocked = lesson.isFree || hasEntitlement;
  const lessonProgress = progress[lesson.id] ?? 0;

  const quizState = useMemo(() => {
    if (score === null) {
      return null;
    }

    return `${score}/${lesson.quiz.length} correct`;
  }, [lesson.quiz.length, score]);

  async function handleSubmitQuiz() {
    const result = await submitQuiz(lesson.id, selectedAnswers);
    setScore(result.score);
  }

  function handleDoubtSubmit() {
    if (!doubtTitle || !doubtMessage) {
      return;
    }

    void submitDoubt({
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
          <button type="button" className="button" onClick={() => void updateProgress(lesson.id, lessonProgress + 25)}>
            Save progress heartbeat
          </button>
          <button type="button" className="button-ghost" onClick={() => void updateProgress(lesson.id, 100)}>
            Mark complete
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={async () => {
              const result = await issuePlaybackToken(lesson.slug, learners[0]?.id);
              setPlaybackToken(result.token);
              setWatermark(result.watermark);
            }}
          >
            Issue playback token
          </button>
          <span className="status">{lessonProgress}% saved</span>
        </div>
        {playbackToken ? <p className="small muted">Token: {playbackToken} • Watermark: {watermark}</p> : null}
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
