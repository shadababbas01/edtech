import { NextResponse } from "next/server";
import { z } from "zod";

import { requestRefund } from "@/lib/server/services";

const schema = z.object({
  orderId: z.string(),
  reason: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  requestRefund(payload.orderId, payload.reason);
  return NextResponse.json({ ok: true });
}
