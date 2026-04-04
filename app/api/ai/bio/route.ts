import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = getGeminiModel("gemini-2.5-flash");

    const aiPrompt = `Act as a creative social media bio generator.
User prompt: "${prompt}"

Generate exactly 3 distinct bio suggestions based ONLY on the user's prompt. 
Rules:
1. Each bio must be strictly less than 200 characters long (including spaces).
2. Include emojis ONLY if requested by the user or if it fits the tone perfectly. Do not force emojis in every suggestion.
3. The response must be a valid JSON object with the following structure:
{
  "suggestions": ["bio 1", "bio 2", "bio 3"]
}

Return ONLY the JSON, no markdown, no explanation.`;

    const result = await model.generateContent(aiPrompt);
    const responseText = result.response.text().trim();
    
    let jsonText = responseText;
    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/^```(?:json)?\s*/, "")
        .replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        throw new Error("Invalid AI response format");
      }
      
      // Secondary filter to ensure length constraint
      const finalSuggestions = parsed.suggestions.map((s: string) => 
        s.length > 200 ? s.substring(0, 197) + "..." : s
      );

      return NextResponse.json({ suggestions: finalSuggestions });
    } catch (parseError) {
      console.error("AI Bio JSON Parse Error:", parseError, "Raw:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("AI Bio Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate bios" },
      { status: 500 }
    );
  }
}
