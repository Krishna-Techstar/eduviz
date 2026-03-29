import type { VisualizeRequestBody, VisualizeResponse } from "./types";

export async function visualizeFromApi(
  body: VisualizeRequestBody,
): Promise<VisualizeResponse> {
  const res = await fetch("/api/visualize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as VisualizeResponse & {
    error?: string;
    details?: unknown;
  };

  if (!res.ok) {
    const msg =
      typeof data === "object" && data && data.error
        ? String(data.error)
        : `Visualize failed (${res.status})`;
    throw new Error(msg);
  }

  return data as VisualizeResponse;
}

export async function analyzeCodeFromApi(code: string, language?: string) {
  const res = await fetch("/api/analyze-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error
        ? String((data as { error: string }).error)
        : `Analyze failed (${res.status})`,
    );
  }
  return data as { algorithm: string; confidence: number };
}
