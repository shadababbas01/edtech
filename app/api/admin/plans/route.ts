import { NextResponse } from "next/server";
import { z } from "zod";

import { createPlan } from "@/lib/server/services";

const schema = z.object({
  name: z.string(),
  priceInr: z.number(),
  durationDays: z.number(),
  highlight: z.string(),
  productCode: z.string()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  createPlan(payload);
  return NextResponse.json({ ok: true });
}
