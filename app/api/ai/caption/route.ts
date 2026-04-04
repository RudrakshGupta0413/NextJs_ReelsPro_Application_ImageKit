import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    console.log("AI Caption: Generating captions for URL:", imageUrl);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
    }
    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/jpeg";

    const prompt = `Analyze this image or video frame and generate exactly 3 different caption suggestions for a social media app.

For each suggestion, provide:
- A short, catchy, engaging caption (no hashtags in the caption text)
- 3 relevant hashtags (without the # symbol, lowercase, no spaces)

You MUST respond ONLY with valid JSON in this exact format, no markdown, no backticks:
{"suggestions":[{"caption":"your caption here","hashtags":["tag1","tag2","tag3"]},{"caption":"second caption","hashtags":["tag1","tag2","tag3"]},{"caption":"third caption","hashtags":["tag1","tag2","tag3"]}]}`;

    try {
      const model = getGeminiModel("gemini-2.5-flash");
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ]);

      const rawText = result.response.text().trim();
      let jsonText = rawText;
      if (jsonText.startsWith("```")) {
        jsonText = jsonText
          .replace(/^```(?:json)?\s*/, "")
          .replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(jsonText);
      if (
        !parsed.suggestions ||
        !Array.isArray(parsed.suggestions) ||
        parsed.suggestions.length === 0
      ) {
        throw new Error("Invalid AI response structure");
      }

      const suggestions = parsed.suggestions
        .slice(0, 3)
        .map((s: any) => ({
          caption: String(s.caption || "").trim(),
          hashtags: (s.hashtags || [])
            .slice(0, 5)
            .map((h: string) =>
              String(h).replace(/^#/, "").toLowerCase().trim()
            )
            .filter(Boolean),
        }));

      console.log("Gemini AI: Successfully generated captions");
      return NextResponse.json({ suggestions });
    } catch (error: any) {
      console.error("Gemini API Error:", error.message);
      
      const status = error?.status || error?.response?.status || error?.code;
      if (status === 429) {
        return NextResponse.json(
          { 
            error: "AI quota exceeded. Please try again later.",
            retryAfter: 60 
          },
          { status: 429 }
        );
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error("AI Caption Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate captions" },
      { status: 500 }
    );
  }
}
