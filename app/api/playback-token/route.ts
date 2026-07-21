import { NextResponse } from "next/server";

import { allLessons } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json()) as { lessonSlug?: string; entitled?: boolean };
  const lesson = allLessons.find((item) => item.slug === body.lessonSlug);

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  if (!lesson.isFree && !body.entitled) {
    return NextResponse.json({ error: "Entitlement required." }, { status: 403 });
  }

  return NextResponse.json({
    token: `demo-token-${lesson.slug}`,
    expiresInSeconds: 300,
    watermark: "Project Ganit demo"
  });
}
