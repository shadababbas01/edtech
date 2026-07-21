import { NextResponse } from "next/server";

import { getAppSnapshot } from "@/lib/server/services";

export function GET() {
  return NextResponse.json(getAppSnapshot());
}
