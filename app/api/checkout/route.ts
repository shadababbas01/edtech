import { NextResponse } from "next/server";

import { plans } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    planId?: string;
    learnerIds?: string[];
  };

  const plan = plans.find((item) => item.id === body.planId);

  if (!plan || !body.learnerIds || body.learnerIds.length === 0) {
    return NextResponse.json({ error: "Invalid mock checkout payload." }, { status: 400 });
  }

  return NextResponse.json({
    mode: "mock",
    orderId: `demo-order-${Date.now()}`,
    entitlementState: "granted-locally",
    plan: plan.name,
    learnerCount: body.learnerIds.length
  });
}
