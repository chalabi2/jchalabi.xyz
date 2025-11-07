import type { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  let boldFont: ArrayBuffer | undefined;
  let regularFont: ArrayBuffer | undefined;

  try {
    const boldRes = await fetch(
      new URL("/fonts/berkley-mono/BerkleyMonoNF-Bold.ttf", req.url)
    );
    if (boldRes.ok) boldFont = await boldRes.arrayBuffer();
  } catch (e) {
    console.error("Failed to load bold font:", e);
  }

  try {
    const regularRes = await fetch(
      new URL("/fonts/berkley-mono/BerkleyMonoNF-Regular.ttf", req.url)
    );
    if (regularRes.ok) regularFont = await regularRes.arrayBuffer();
  } catch (e) {
    console.error("Failed to load regular font:", e);
  }

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Joseph Chalabi";
  const description = searchParams.get("description") ?? "";

  type OgFont = {
    name: string;
    data: ArrayBuffer;
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style?: "normal" | "italic";
  };

  const fonts: OgFont[] = [];
  if (boldFont)
    fonts.push({
      name: "BerkleyMonoNF",
      data: boldFont,
      weight: 700,
      style: "normal",
    });
  if (regularFont)
    fonts.push({
      name: "BerkleyMonoNF",
      data: regularFont,
      weight: 500,
      style: "normal",
    });
  if (!boldFont && regularFont)
    fonts.push({
      name: "BerkleyMonoNF",
      data: regularFont,
      weight: 700,
      style: "normal",
    });
  if (!regularFont && boldFont)
    fonts.push({
      name: "BerkleyMonoNF",
      data: boldFont,
      weight: 500,
      style: "normal",
    });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: fonts.length > 0 ? "BerkleyMonoNF" : "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "1040px",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 36,
                color: "#a1a1aa",
                lineHeight: 1.4,
                maxWidth: "1040px",
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            fontSize: 28,
            color: "#71717a",
            fontFamily: fonts.length > 0 ? "BerkleyMonoNF" : "monospace",
          }}
        >
          jchalabi.xyz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}
