import { NextResponse } from "next/server";
import { z } from "zod";

import { reviewRefund } from "@/lib/server/services";

const schema = z.object({
  action: z.enum(["approve", "reject", "process"])
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const payload = schema.parse(await request.json());
  reviewRefund(params.id, payload.action);
  return NextResponse.json({ ok: true });
}
