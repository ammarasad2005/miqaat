import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    const body = await request.json();
    const { dateStr, contentText } = body;

    if (!dateStr || !contentText) {
      return NextResponse.json({ error: 'dateStr and contentText are required.' }, { status: 400 });
    }

    const prompt = `Write a short (2-4 sentence), warm, non-preachy daily reflection for a Muslim user.
Connect your reflection to the following daily spiritual content:
"""
${contentText}
"""

CRITICAL RULES:
1. You MUST NOT invent, generate, or paraphrase any Quranic verses or Hadiths yourself.
2. You MUST NOT include any citations (e.g., "Quran 2:10", "Bukhari", etc.) in your output.
3. You are merely offering a brief, uplifting personal reflection on the provided text, without issuing religious rulings.
4. Keep it contemplative and rooted in daily life.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API Error:', await response.text());
      return NextResponse.json({ error: 'Failed to generate reflection.' }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json({ error: 'Malformed or empty response from Gemini.' }, { status: 500 });
    }

    const output = text.trim();

    // Validation: Check for hallucinated citations or quotes
    // We reject if it contains forbidden source words to ensure the AI doesn't try to cite anything itself.
    const forbiddenWords = ['surah', 'ayah', 'bukhari', 'muslim', 'tirmidhi', 'narrated', 'prophet said', 'allah says'];
    const lowerOutput = output.toLowerCase();
    
    if (forbiddenWords.some(word => lowerOutput.includes(word))) {
       console.error('Rejected AI response due to forbidden citation-like words:', output);
       return NextResponse.json({ error: 'Response failed safety validation.' }, { status: 500 });
    }
    
    // Reject if it has quotation marks (indicating it's trying to quote scripture)
    if ((output.match(/"/g) || []).length >= 2) {
       console.error('Rejected AI response due to quotation marks:', output);
       return NextResponse.json({ error: 'Response failed safety validation (quotations).' }, { status: 500 });
    }

    return NextResponse.json({ text: output });
  } catch (error) {
    console.error('Reflection API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
