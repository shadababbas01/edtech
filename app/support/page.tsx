"use client";

import { RefundRequestForm, SupportForm } from "@/components/forms";
import { useAppState } from "@/components/app-state";

export default function SupportPage() {
  const { tickets, purchases, refunds } = useAppState();

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

      <section className="grid-2">
        <div className="panel">
          <h3>Order lookup and refund requests</h3>
          <div className="card-list">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="lesson-card">
                <div className="inline">
                  <strong>{purchase.id}</strong>
                  <span className="status">{purchase.orderStatus}</span>
                </div>
                <p className="small muted">
                  {purchase.planId} • ₹{purchase.amountInr}
                </p>
                <RefundRequestForm orderId={purchase.id} />
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Refund queue</h3>
          <div className="card-list">
            {refunds.map((refund) => (
              <div key={refund.id} className="lesson-card">
                <div className="inline">
                  <strong>{refund.orderId}</strong>
                  <span className="status">{refund.status}</span>
                </div>
                <p className="small muted">₹{refund.amountInr} • {refund.reason}</p>
              </div>
            ))}
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
              {ticket.orderId ? <p className="small muted">Order lookup: {ticket.orderId}</p> : null}
              {ticket.resolutionNote ? <p className="small muted">Resolution: {ticket.resolutionNote}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
