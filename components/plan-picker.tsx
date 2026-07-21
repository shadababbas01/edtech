"use client";

import { useState } from "react";

import { useAppState } from "@/components/app-state";
import { plans } from "@/lib/data";

export function PlanPicker() {
  const { buyPlan, hasEntitlement, learners } = useAppState();
  const [selectedPlan, setSelectedPlan] = useState(plans[1]?.id ?? "");

  function handleBuy() {
    buyPlan(
      selectedPlan,
      learners.map((learner) => learner.id)
    );
  }

  return (
    <div className="stack">
      <div className="grid-3">
        {plans.map((plan) => (
          <button
            type="button"
            key={plan.id}
            className="panel"
            onClick={() => setSelectedPlan(plan.id)}
            style={{
              textAlign: "left",
              borderColor: selectedPlan === plan.id ? "var(--brand)" : "var(--line)"
            }}
          >
            <span className="eyebrow">{plan.highlight}</span>
            <h3>{plan.name}</h3>
            <p className="metric-value">{plan.price}</p>
            <p className="muted">{plan.cadence}</p>
            <div className="card-list">
              {plan.features.map((feature) => (
                <span key={feature} className="small">
                  {feature}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className="actions">
        <button type="button" className="button" onClick={() => void handleBuy()}>
          {hasEntitlement ? "Add another demo purchase" : "Unlock demo entitlement"}
        </button>
        <span className="muted small">
          Checkout now creates a persisted order, verifies a mock payment, and grants deterministic entitlements.
        </span>
      </div>
    </div>
  );
}
