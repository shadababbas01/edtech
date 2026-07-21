import { NextResponse } from "next/server";
import { z } from "zod";

import { saveProgress } from "@/lib/server/services";

const schema = z.object({
  lessonId: z.string(),
  percent: z.number()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  saveProgress(payload.lessonId, payload.percent);
  return NextResponse.json({ ok: true });
}
