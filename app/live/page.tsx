"use client";

import { useAppState } from "@/components/app-state";
import { liveSessions } from "@/lib/data";

export default function LivePage() {
  const { hasEntitlement, liveSessions, joinLiveSession } = useAppState();

  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Live support</span>
        <h1 className="title">Weekly doubt clinics and revision sessions, bundled around the recorded path.</h1>
      </section>

      <section className="grid-2">
        {liveSessions.map((session) => (
          <div key={session.id} className="live-card">
            <span className="status">{session.status}</span>
            <h3>{session.title}</h3>
            <p className="muted">
              {session.date} • {session.mode} • Host: {session.host}
            </p>
            <p className="small">
              {hasEntitlement
                ? "Join flow enabled for entitled learners. In production this would issue a vendor join token."
                : "Unlock a plan to join this session live. Recording availability can still be shown after publication."}
            </p>
            <div className="actions">
              <button
                type="button"
                className="button"
                disabled={!hasEntitlement}
                onClick={async () => {
                  if (!hasEntitlement) {
                    return;
                  }

                  const result = await joinLiveSession(session.id);
                  window.alert(`Join token issued: ${result.token}`);
                }}
              >
                {hasEntitlement ? "Generate join token" : "Entitlement required"}
              </button>
              <span className="small muted">
                Recording: {session.recordingPublished ? "Published" : "Pending after session"}
              </span>
            </div>
            {session.recordingUrl ? <a className="small" href={session.recordingUrl}>Open recording</a> : null}
          </div>
        ))}
      </section>
    </main>
  );
}
