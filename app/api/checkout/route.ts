import { NextResponse } from "next/server";
import { z } from "zod";

import { createCheckout } from "@/lib/server/services";

const schema = z.object({
  planId: z.string(),
  learnerIds: z.array(z.string()).min(1)
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  return NextResponse.json(createCheckout(payload.planId, payload.learnerIds));
}
