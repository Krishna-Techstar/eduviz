import { NextResponse } from "next/server";

const DEFAULT_ORIGIN = "http://127.0.0.1:4000";

export async function POST(req: Request) {
  const body = await req.json();
  const base =
    process.env.EDUVIZ_API_URL?.replace(/\/$/, "") ?? DEFAULT_ORIGIN;

  try {
    const res = await fetch(`${base}/api/analyze-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to reach EduViz backend";
    return NextResponse.json(
      {
        error: `${message}. Is the API running? Set EDUVIZ_API_URL or start the backend on port 4000.`,
      },
      { status: 502 },
    );
  }
}
