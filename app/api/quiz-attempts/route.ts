import { NextResponse } from "next/server";
import { z } from "zod";

import { submitQuiz } from "@/lib/server/services";

const schema = z.object({
  lessonId: z.string(),
  answers: z.record(z.string(), z.string())
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  return NextResponse.json(submitQuiz(payload.lessonId, payload.answers));
}
