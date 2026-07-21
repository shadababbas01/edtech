import { NextResponse } from "next/server";
import { z } from "zod";

import { updateChecklist } from "@/lib/server/services";

const schema = z.object({
  area: z.string(),
  status: z.enum(["Not started", "In progress", "Ready"])
});

export async function PATCH(request: Request) {
  const payload = schema.parse(await request.json());
  updateChecklist(payload.area, payload.status);
  return NextResponse.json({ ok: true });
}
