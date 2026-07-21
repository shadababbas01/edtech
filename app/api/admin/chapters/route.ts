import { NextResponse } from "next/server";
import { z } from "zod";

import { createChapter } from "@/lib/server/services";

const schema = z.object({
  title: z.string(),
  summary: z.string(),
  target: z.string()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  createChapter(payload);
  return NextResponse.json({ ok: true });
}
