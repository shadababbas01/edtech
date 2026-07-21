"use client";

import { useState } from "react";

import { useAppState } from "@/components/app-state";

export function ParentOnboardingForm() {
  const { parentName, setParentName, saveParentProfile, addLearner } = useAppState();
  const [learnerName, setLearnerName] = useState("");
  const [classLevel, setClassLevel] = useState("Class 10");
  const [language, setLanguage] = useState("Bilingual");

  function handleAddLearner() {
    if (!learnerName.trim()) {
      return;
    }

    void addLearner({
      name: learnerName,
      classLevel,
      language
    });
    setLearnerName("");
  }

  return (
    <div className="panel">
      <h3>Parent-led onboarding</h3>
      <p className="muted">
        This demo keeps the minor data footprint intentionally small: parent name, learner nickname, class and
        language preference.
      </p>
      <div className="form-grid">
        <label className="field">
          <span>Parent or payer name</span>
          <input value={parentName} onChange={(event) => setParentName(event.target.value)} placeholder="Neha Sharma" />
        </label>
        <label className="field">
          <span>Learner nickname</span>
          <input value={learnerName} onChange={(event) => setLearnerName(event.target.value)} placeholder="Aarav" />
        </label>
        <div className="grid-2">
          <label className="field">
            <span>Class</span>
            <select value={classLevel} onChange={(event) => setClassLevel(event.target.value)}>
              <option>Class 9</option>
              <option>Class 10</option>
            </select>
          </label>
          <label className="field">
            <span>Language mode</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option>Bilingual</option>
              <option>Hindi</option>
              <option>English</option>
            </select>
          </label>
        </div>
        <div className="actions">
          <button type="button" className="button-ghost" onClick={() => void saveParentProfile()}>
            Save parent details
          </button>
          <button type="button" className="button" onClick={handleAddLearner}>
            Add learner profile
          </button>
        </div>
      </div>
    </div>
  );
}

export function SupportForm() {
  const { submitTicket } = useAppState();
  const [topic, setTopic] = useState("");
  const [detail, setDetail] = useState("");
  const [orderId, setOrderId] = useState("");

  function handleSubmit() {
    if (!topic || !detail) {
      return;
    }

    void submitTicket({ topic, detail, orderId: orderId || undefined });
    setTopic("");
    setDetail("");
    setOrderId("");
  }

  return (
    <div className="panel">
      <h3>Support and refund desk</h3>
      <div className="form-grid">
        <label className="field">
          <span>Topic</span>
          <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Payment not reflected" />
        </label>
        <label className="field">
          <span>Detail</span>
          <textarea
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="Describe what happened, what device you used and whether the payment succeeded."
          />
        </label>
        <label className="field">
          <span>Related order ID (optional)</span>
          <input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="order-..." />
        </label>
        <div className="actions">
          <button type="button" className="button" onClick={handleSubmit}>
            Create support ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminChecklistEditor() {
  const { adminChecklist, updateAdminChecklist } = useAppState();

  return (
    <div className="panel">
      <h3>Launch readiness controls</h3>
      <div className="table-wrap" style={{ padding: 0, boxShadow: "none", border: "none", background: "transparent" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {adminChecklist.map((item) => (
              <tr key={item.area}>
                <td>{item.area}</td>
                <td>
                  <select
                    value={item.status}
                    onChange={(event) =>
                      void updateAdminChecklist(
                        item.area,
                        event.target.value as "Not started" | "In progress" | "Ready"
                      )
                    }
                  >
                    <option>Not started</option>
                    <option>In progress</option>
                    <option>Ready</option>
                  </select>
                </td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RefundRequestForm({ orderId }: { orderId: string }) {
  const { requestRefund } = useAppState();
  const [reason, setReason] = useState("");

  return (
    <div className="field">
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Explain duplicate charge, access failure, or technical non-delivery."
      />
      <div className="actions">
        <button
          type="button"
          className="button-ghost"
          onClick={() => {
            if (!reason.trim()) {
              return;
            }

            void requestRefund(orderId, reason);
            setReason("");
          }}
        >
          Request refund review
        </button>
      </div>
    </div>
  );
}

export function AdminContentForms() {
  const { course, createPlan, createLiveSession, updateCourseMetadata, createChapter, createLesson } = useAppState();
  const [courseTitle, setCourseTitle] = useState(course.title);
  const [courseSubtitle, setCourseSubtitle] = useState(course.subtitle);
  const [coursePromise, setCoursePromise] = useState(course.promise);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterSummary, setChapterSummary] = useState("");
  const [chapterTarget, setChapterTarget] = useState("");
  const [lessonChapterId, setLessonChapterId] = useState(course.chapters[0]?.id ?? "");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSummary, setLessonSummary] = useState("");
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonDuration, setLessonDuration] = useState("12 min");
  const [lessonIsFree, setLessonIsFree] = useState(true);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("499");
  const [planDays, setPlanDays] = useState("30");
  const [planHighlight, setPlanHighlight] = useState("");
  const [liveTitle, setLiveTitle] = useState("");
  const [liveDescription, setLiveDescription] = useState("");
  const [liveStartsAt, setLiveStartsAt] = useState("2026-07-30T18:00");
  const [liveDuration, setLiveDuration] = useState("60");
  const [liveMode, setLiveMode] = useState("Weekly doubt session");
  const [liveHost, setLiveHost] = useState("Shadab Sir");

  return (
    <div className="grid-2">
      <div className="panel">
        <h3>Course metadata</h3>
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} />
          </label>
          <label className="field">
            <span>Subtitle</span>
            <input value={courseSubtitle} onChange={(event) => setCourseSubtitle(event.target.value)} />
          </label>
          <label className="field">
            <span>Promise</span>
            <textarea value={coursePromise} onChange={(event) => setCoursePromise(event.target.value)} />
          </label>
          <div className="actions">
            <button
              type="button"
              className="button"
              onClick={() => void updateCourseMetadata({ title: courseTitle, subtitle: courseSubtitle, promise: coursePromise })}
            >
              Save course
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Create chapter</h3>
        <div className="form-grid">
          <label className="field">
            <span>Chapter title</span>
            <input value={chapterTitle} onChange={(event) => setChapterTitle(event.target.value)} />
          </label>
          <label className="field">
            <span>Summary</span>
            <textarea value={chapterSummary} onChange={(event) => setChapterSummary(event.target.value)} />
          </label>
          <label className="field">
            <span>Target</span>
            <input value={chapterTarget} onChange={(event) => setChapterTarget(event.target.value)} />
          </label>
          <div className="actions">
            <button
              type="button"
              className="button"
              onClick={() => {
                if (!chapterTitle || !chapterSummary || !chapterTarget) {
                  return;
                }

                void createChapter({ title: chapterTitle, summary: chapterSummary, target: chapterTarget });
                setChapterTitle("");
                setChapterSummary("");
                setChapterTarget("");
              }}
            >
              Add chapter
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Create lesson</h3>
        <div className="form-grid">
          <label className="field">
            <span>Chapter</span>
            <select value={lessonChapterId} onChange={(event) => setLessonChapterId(event.target.value)}>
              {course.chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Lesson title</span>
            <input value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} />
          </label>
          <label className="field">
            <span>Summary</span>
            <textarea value={lessonSummary} onChange={(event) => setLessonSummary(event.target.value)} />
          </label>
          <label className="field">
            <span>Topic</span>
            <input value={lessonTopic} onChange={(event) => setLessonTopic(event.target.value)} />
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Duration</span>
              <input value={lessonDuration} onChange={(event) => setLessonDuration(event.target.value)} />
            </label>
            <label className="field">
              <span>Access</span>
              <select value={lessonIsFree ? "free" : "paid"} onChange={(event) => setLessonIsFree(event.target.value === "free")}>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </label>
          </div>
          <div className="actions">
            <button
              type="button"
              className="button"
              onClick={() =>
                void createLesson({
                  chapterId: lessonChapterId,
                  title: lessonTitle,
                  summary: lessonSummary,
                  topic: lessonTopic,
                  duration: lessonDuration,
                  isFree: lessonIsFree
                })
              }
            >
              Add lesson
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Create plan</h3>
        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input value={planName} onChange={(event) => setPlanName(event.target.value)} />
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Price INR</span>
              <input value={planPrice} onChange={(event) => setPlanPrice(event.target.value)} />
            </label>
            <label className="field">
              <span>Duration days</span>
              <input value={planDays} onChange={(event) => setPlanDays(event.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Highlight</span>
            <input value={planHighlight} onChange={(event) => setPlanHighlight(event.target.value)} />
          </label>
          <div className="actions">
            <button
              type="button"
              className="button"
              onClick={() =>
                void createPlan({
                  name: planName,
                  priceInr: Number(planPrice),
                  durationDays: Number(planDays),
                  highlight: planHighlight,
                  productCode: "course-class-10-maths"
                })
              }
            >
              Add plan
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Create live session</h3>
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input value={liveTitle} onChange={(event) => setLiveTitle(event.target.value)} />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea value={liveDescription} onChange={(event) => setLiveDescription(event.target.value)} />
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Starts at</span>
              <input type="datetime-local" value={liveStartsAt} onChange={(event) => setLiveStartsAt(event.target.value)} />
            </label>
            <label className="field">
              <span>Duration minutes</span>
              <input value={liveDuration} onChange={(event) => setLiveDuration(event.target.value)} />
            </label>
          </div>
          <div className="grid-2">
            <label className="field">
              <span>Mode</span>
              <input value={liveMode} onChange={(event) => setLiveMode(event.target.value)} />
            </label>
            <label className="field">
              <span>Host</span>
              <input value={liveHost} onChange={(event) => setLiveHost(event.target.value)} />
            </label>
          </div>
          <div className="actions">
            <button
              type="button"
              className="button"
              onClick={() =>
                void createLiveSession({
                  title: liveTitle,
                  description: liveDescription,
                  startsAt: new Date(liveStartsAt).toISOString(),
                  durationMinutes: Number(liveDuration),
                  mode: liveMode,
                  hostName: liveHost
                })
              }
            >
              Add live session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
