import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
console.log("bu body",body);

    const googleScriptUrl =
      "https://script.google.com/macros/s/AKfycbw1mInaSBrvAagyo5bkpbIj_ibN3pRS96-g365kTiY9dj1Z8f0HJZot7tSvV3Zq2DdF/exec";

    const response = await axios.post(googleScriptUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (error: unknown) {
  let errorMessage = "Server error";

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return NextResponse.json(
    { success: false, message: errorMessage },
    { status: 500 }
  );
}
}
