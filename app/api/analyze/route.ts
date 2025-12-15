import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Strict Key Validation
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("GROQ_API_KEY is missing in environment variables.");
            return NextResponse.json({
                error: "Server Configuration Error: GROQ_API_KEY not found."
            }, { status: 500 });
        }

        const groq = new Groq({ apiKey });
        const { cpu, entropy, processes, attackType, logs } = await req.json();

        // Advanced Graduate-Level Prompt
        const systemPrompt = `
      You are HELIX, a military-grade autonomous cybersecurity agent.
      
      Your task:
      1. Analyze the provided system telemetry (CPU, Entropy, Processes, Logs).
      2. Identify the specific threat signature (e.g., Cryptojacking, Ransomware, DDoS).
      3. Recommend precise, technical countermeasures (e.g., "Kill PID 455", "Flush iptables", "Isolate subnet").
      
      Output strictly JSON:
      {
        "analysis": "Technical diagnosis of the threat vector.",
        "action": "Specific, executable countermeasure.",
        "confidence": 0.0-1.0
      }
    `;

        const userPrompt = `
      TELEMETRY DUMP:
      - CPU Load: ${cpu.toFixed(1)}%
      - File Entropy: ${entropy.toFixed(3)}
      - Top Process: ${processes[0]?.name || "N/A"} (PID: ${processes[0]?.pid})
      - Network Flags: ${attackType || "None detected"}
      - Recent Log: ${logs?.[0]?.message || "N/A"}
      
      Diagnose immediately.
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "mixtral-8x7b-32768", // Switching to Mixtral for high speed/reliability
            max_tokens: 150,
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('HELIX AI Core Error:', error);
        return NextResponse.json({
            error: "Neural Core Malfunction",
            details: error.message || String(error),
            code: error.status || 500
        }, { status: 500 });
    }
}
