import { describe, expect, it } from "vitest";

import {
  canIssuePlayback,
  isWebhookEventNew,
  nextRefundState,
  shouldGrantEntitlement
} from "../lib/server/domain";

describe("entitlement idempotency", () => {
  it("grants only when the order-learner-product tuple is new", () => {
    expect(
      shouldGrantEntitlement({
        orderId: "order-1",
        learnerId: "learner-1",
        productCode: "course-class-10-maths",
        existing: []
      })
    ).toBe(true);

    expect(
      shouldGrantEntitlement({
        orderId: "order-1",
        learnerId: "learner-1",
        productCode: "course-class-10-maths",
        existing: [{ orderId: "order-1", learnerId: "learner-1", productCode: "course-class-10-maths" }]
      })
    ).toBe(false);
  });
});

describe("payment webhook idempotency", () => {
  it("rejects duplicate vendor events", () => {
    expect(isWebhookEventNew(["evt-1", "evt-2"], "evt-3")).toBe(true);
    expect(isWebhookEventNew(["evt-1", "evt-2"], "evt-2")).toBe(false);
  });
});

describe("playback authorization", () => {
  it("blocks premium playback without entitlement", () => {
    expect(canIssuePlayback({ isFree: false, entitled: false, hasActiveOtherSession: false })).toEqual({
      allowed: false,
      revokePrevious: false
    });
  });

  it("allows entitled playback and revokes the previous session handoff", () => {
    expect(canIssuePlayback({ isFree: false, entitled: true, hasActiveOtherSession: true })).toEqual({
      allowed: true,
      revokePrevious: true
    });
  });
});

describe("refund transitions", () => {
  it("supports request -> approve -> process", () => {
    expect(nextRefundState("REQUESTED", "approve")).toBe("APPROVED");
    expect(nextRefundState("APPROVED", "process")).toBe("PROCESSED");
  });

  it("rejects invalid transitions", () => {
    expect(() => nextRefundState("PROCESSED", "approve")).toThrowError("Invalid refund transition");
  });
});
