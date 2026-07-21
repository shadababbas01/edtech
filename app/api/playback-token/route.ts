import { NextResponse } from "next/server";
import { z } from "zod";

import { issuePlaybackToken } from "@/lib/server/services";

const schema = z.object({
  lessonSlug: z.string(),
  learnerId: z.string().optional()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  return NextResponse.json(issuePlaybackToken(payload.lessonSlug, payload.learnerId));
}
