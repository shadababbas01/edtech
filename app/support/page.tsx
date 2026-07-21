"use client";

import { SupportForm } from "@/components/forms";
import { useAppState } from "@/components/app-state";

export default function SupportPage() {
  const { tickets } = useAppState();

  return (
    <main className="shell stack">
      <section className="hero">
        <span className="eyebrow">Support, refunds and cancellation</span>
        <h1 className="title">Payment and access issues are treated like product-critical incidents.</h1>
      </section>

      <section className="grid-2">
        <SupportForm />
        <div className="panel">
          <h3>Policy summary</h3>
          <div className="card-list">
            <span>Duplicate payments and technical non-delivery should be corrected immediately.</span>
            <span>Recent chapter-pass purchases can be credited toward larger plans within the launch policy window.</span>
            <span>Cancellation should be visible and self-serve; access continues until the current term ends unless refunded.</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Open and recent tickets</h3>
        <div className="card-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="lesson-card">
              <div className="inline">
                <strong>{ticket.topic}</strong>
                <span className="status">{ticket.status}</span>
              </div>
              <p className="small muted">{ticket.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
