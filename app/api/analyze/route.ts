import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'dummy_key', // Fallback to avoid crash on init, checks later
});

export async function POST(req: Request) {
    try {
        const { cpu, entropy, processes, attackType } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({
                analysis: "MOCK ANALYSIS: AI Neural Core offline (Missing API Key). System logic suggests high probability of " + (attackType || "anomaly") + ".",
                action: "Recommended: Manual intervention or automated countermeasure.",
                confidence: 0.85
            });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are CORTEX, an advanced cybersecurity AI. Analyze the system metrics provided. Be concise, technical, and authoritative. Output JSON with 'analysis', 'action', and 'confidence'."
                },
                {
                    role: "user",
                    content: `System Status:
          - CPU Load: ${cpu.toFixed(1)}%
          - Entropy: ${entropy.toFixed(3)}
          - Active Attack Signature: ${attackType || "None"}
          - Top Process: ${processes[0]?.name || "Unknown"}
          
          Analyze threat level and recommend countermeasures.`
                }
            ],
            model: "llama3-70b-8192",
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return NextResponse.json(result);

    } catch (error) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({
            error: "AI Analysis Failed",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
