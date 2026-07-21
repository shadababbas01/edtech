import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupportTicket } from "@/lib/server/services";

const schema = z.object({
  topic: z.string().min(1),
  detail: z.string().min(1),
  orderId: z.string().optional()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  createSupportTicket(payload.topic, payload.detail, payload.orderId);
  return NextResponse.json({ ok: true });
}
