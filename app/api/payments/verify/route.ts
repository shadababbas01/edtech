import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPayment } from "@/lib/server/services";

const schema = z.object({
  orderId: z.string(),
  providerPaymentId: z.string().optional(),
  method: z.string().optional()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  return NextResponse.json(verifyPayment(payload));
}
