type EntitlementInput = {
  orderId: string;
  learnerId: string;
  productCode: string;
  existing: { orderId: string; learnerId: string; productCode: string }[];
};

export function shouldGrantEntitlement(input: EntitlementInput) {
  return !input.existing.some(
    (item) =>
      item.orderId === input.orderId && item.learnerId === input.learnerId && item.productCode === input.productCode
  );
}

export function isWebhookEventNew(existingEventIds: string[], eventId: string) {
  return !existingEventIds.includes(eventId);
}

export function canIssuePlayback({
  isFree,
  entitled,
  hasActiveOtherSession
}: {
  isFree: boolean;
  entitled: boolean;
  hasActiveOtherSession: boolean;
}) {
  if (!isFree && !entitled) {
    return { allowed: false, revokePrevious: false };
  }

  return { allowed: true, revokePrevious: hasActiveOtherSession };
}

export function nextRefundState(current: "REQUESTED" | "APPROVED" | "REJECTED" | "PROCESSED", action: "approve" | "reject" | "process") {
  if (action === "approve" && current === "REQUESTED") {
    return "APPROVED" as const;
  }

  if (action === "reject" && current === "REQUESTED") {
    return "REJECTED" as const;
  }

  if (action === "process" && current === "APPROVED") {
    return "PROCESSED" as const;
  }

  throw new Error("Invalid refund transition");
}
