import { NextResponse } from "next/server";
import { z } from "zod";

import { submitDoubt } from "@/lib/server/services";

const schema = z.object({
  lessonId: z.string(),
  title: z.string().min(1),
  message: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  submitDoubt(payload.lessonId, payload.title, payload.message);
  return NextResponse.json({ ok: true });
}
