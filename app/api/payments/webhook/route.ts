import { NextResponse } from "next/server";
import { z } from "zod";

import { processPaymentWebhook } from "@/lib/server/services";

const schema = z.object({
  provider: z.string(),
  eventId: z.string(),
  eventType: z.string(),
  payload: z.record(z.string(), z.unknown())
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  return NextResponse.json(processPaymentWebhook(payload));
}
