import { NextResponse } from "next/server";

import { resolveSupportTicket } from "@/lib/server/services";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  resolveSupportTicket(params.id);
  return NextResponse.json({ ok: true });
}
