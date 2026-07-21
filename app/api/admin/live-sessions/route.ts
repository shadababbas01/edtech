import { NextResponse } from "next/server";
import { z } from "zod";

import { createLiveSession } from "@/lib/server/services";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  startsAt: z.string(),
  durationMinutes: z.number(),
  mode: z.string(),
  hostName: z.string()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  createLiveSession(payload);
  return NextResponse.json({ ok: true });
}
