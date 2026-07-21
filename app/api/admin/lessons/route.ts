import { NextResponse } from "next/server";
import { z } from "zod";

import { createLesson } from "@/lib/server/services";

const schema = z.object({
  chapterId: z.string(),
  title: z.string(),
  summary: z.string(),
  topic: z.string(),
  duration: z.string(),
  isFree: z.boolean()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  createLesson(payload);
  return NextResponse.json({ ok: true });
}
