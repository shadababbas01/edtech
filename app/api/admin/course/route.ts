import { NextResponse } from "next/server";
import { z } from "zod";

import { updateCourseMetadata } from "@/lib/server/services";

const schema = z.object({
  title: z.string(),
  promise: z.string(),
  subtitle: z.string()
});

export async function PATCH(request: Request) {
  const payload = schema.parse(await request.json());
  updateCourseMetadata(payload);
  return NextResponse.json({ ok: true });
}
