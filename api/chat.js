import fetch from "node-fetch";

const SYSTEM_PROMPT = `
You are the Nomadly AI Advisor, an expert guiding users through relocating to Spain. Follow these rules strictly:

1. Users are either "Free" or "Pro".
   - Free: simplified answers, tease Pro naturally
   - Pro: full step-by-step guidance, documents, timelines, actionable next steps

2. Puerto Rico rules (apply if relevant):
   - No apostille needed
   - No translation needed
   - Only most recent bank statement required (must show balance)
   - Must prove PR residency (notarized letter, bank statement, utility bill)
   - Email/phone contact available for questions

3. Answer style:
   - Clear, structured, practical
   - Use bullet points when helpful
   - Medium emoji use allowed
   - Avoid repetition

4. Next Steps:
   - Always provide 1-3 actionable next steps
   - Free users: include soft Pro suggestion
   - Pro users: give detailed steps referencing resources

5. Spanish/English toggle:
   - Answer in the language specified by the "language" variable ("en" or "es")

6. If unknown: respond with "I don’t have that fully mapped yet, but I can guide you based on similar cases."
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, tier = "Free", language = "en" } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }

  const userPrompt = `
User question: ${question}
User tier: ${tier}
Language: ${language}

Please answer following the Nomadly AI Advisor rules:
- If Free: give simplified guidance, tease Pro naturally
- If Pro: give full, detailed, actionable guidance with documents, steps, timelines
- Apply Puerto Rico rules if relevant
- Provide 1-3 actionable Next Steps
- Answer clearly and in the requested language
`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY
      },
      body: JSON.stringify({
        model: "claude-3",
        max_tokens: 1000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await response.json();
    // Claude responses may be in `completion` or `content` depending on version
    const answer = data?.completion || data?.content || "Sorry, no answer returned.";

    res.status(200).json({ answer });
  } catch (err) {
    console.error("Claude API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
