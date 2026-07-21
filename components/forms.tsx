"use client";

import { useState } from "react";

import { useAppState } from "@/components/app-state";

export function ParentOnboardingForm() {
  const { parentName, setParentName, addLearner } = useAppState();
  const [learnerName, setLearnerName] = useState("");
  const [classLevel, setClassLevel] = useState("Class 10");
  const [language, setLanguage] = useState("Bilingual");

  function handleAddLearner() {
    if (!learnerName.trim()) {
      return;
    }

    addLearner({
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

  function handleSubmit() {
    if (!topic || !detail) {
      return;
    }

    submitTicket({ topic, detail });
    setTopic("");
    setDetail("");
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
                  <select value={item.status} onChange={(event) => updateAdminChecklist(item.area, event.target.value)}>
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
