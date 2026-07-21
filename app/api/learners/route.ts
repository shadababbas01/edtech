import { NextResponse } from "next/server";
import { z } from "zod";

import { updateParentAndAddLearner } from "@/lib/server/services";

const schema = z.object({
  parentName: z.string().optional(),
  learnerName: z.string().optional(),
  classLevel: z.string().optional(),
  language: z.string().optional()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  updateParentAndAddLearner({
    parentName: payload.parentName,
    learnerName: payload.learnerName,
    classLevel: payload.classLevel,
    language: payload.language
  });
  return NextResponse.json({ ok: true });
}
