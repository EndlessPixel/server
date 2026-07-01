import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ code: 0, msg: "success" });
}