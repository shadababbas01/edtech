import { NextResponse } from "next/server";
import { z } from "zod";

import { correctEntitlement } from "@/lib/server/services";

const schema = z.object({
  orderId: z.string(),
  learnerId: z.string(),
  active: z.boolean()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  correctEntitlement(payload.orderId, payload.learnerId, payload.active);
  return NextResponse.json({ ok: true });
}
