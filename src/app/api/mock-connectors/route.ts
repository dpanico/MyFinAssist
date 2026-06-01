import { NextResponse } from "next/server";
import { getMockConnectorReport } from "@/features/connector-lab/mock-provider";

export function GET() {
  return NextResponse.json(getMockConnectorReport());
}
