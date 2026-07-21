import { NextResponse } from "next/server";

import { joinLiveSession } from "@/lib/server/services";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(joinLiveSession(params.id));
}
