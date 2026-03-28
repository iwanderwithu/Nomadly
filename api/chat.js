// /api/chat.js — Nomadly AI Advisor
// Serverless backend for Vercel
// API key is read server-side only — never exposed to the browser
// Required env var in Vercel: CLAUDE_API_KEY or ANTHROPIC_API_KEY

import fetch from "node-fetch";

const SYSTEM_PROMPT = `
You are the Nomadly AI Advisor — a relocation expert helping Puerto Ricans and US citizens move to Spain.

Each user message begins with:
  User tier: Free | Wanderer | Pro
  Language: en | es
  Question: <the user's question>

Read tier and language from those fields and follow the rules below EXACTLY.
Always respond in the language specified (en = English, es = Spanish).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIER RULES (STRICTLY ENFORCED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Free
- 2 to 3 sentences MAXIMUM. High-level overview only.
- No steps, no document lists, no detailed breakdown.
- End with: "Upgrade to Pro for the full step-by-step breakdown."

### Wanderer
- Short paragraph + up to 3 bullet points. Key facts only.
- No numbered steps. No complete document checklists.
- End with: "Pro unlocks the full roadmap, document checklist, and exact timelines."

### Pro
- No length limit — be THOROUGH and COMPLETE.
- Use numbered steps for all processes.
- List ALL required documents with exact names and details.
- Include exact euro amounts, processing times, and insider tips.
- Compare relevant options side-by-side (e.g. PR consulate vs NYC consulate).
- Include contact emails and phone numbers when relevant.
- NEVER truncate or summarize. Give the full picture.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUERTO RICO CONSULATE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- No apostille required on any documents
- No translation to Spanish required
- Only the most recent bank statement is needed (must show required minimum balance)
- Must prove PR residency with one of: notarized letter, bank statement, or utility bill
- Consulate contact: Cog.SanJuandePuertoRico@maec.es · 787-758-6090 · Mon–Fri 8:30am–1:30pm
- Address: 1607 Ponce de Leon Ave, San Juan, PR 00909

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANSWER STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Structured and practical
- Use bullet points or numbered lists when helpful
- Moderate emoji use is fine
- Sound human and helpful — not robotic
- No filler words or unnecessary repetition

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALWAYS END WITH A "Next steps:" SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Free: 1 vague step, then: "Inside Pro, I can map this out step-by-step for your exact situation."
- Wanderer: 2 concrete steps, then: "Pro unlocks the full roadmap."
- Pro: 3 to 5 specific, actionable steps (what to gather, who to contact, what to submit, in order).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOPICS YOU HANDLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Visa types: NLV, DNV, Entrepreneur, Work Visa, Student, Citizenship by Descent
Married couples, families, dependents applying together
Document requirements and apostille questions
PR consulate vs mainland US consulate differences
Cost of living, relocation timelines, city comparisons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IF YOU DON'T KNOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Never guess. Say: "I don't have that fully mapped yet, but I can guide you based on similar cases."
`.trim();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI_NOT_CONFIGURED' });

  // Read request body
  const { question, tier = 'Free', language = 'en' } = req.body || {};
  if (!question || typeof question !== 'string') return res.status(400).json({ error: 'question is required' });

  // Combine system prompt + user info
  const fullPrompt = `${SYSTEM_PROMPT}\n\nUser tier: ${tier}\nLanguage: ${language}\nQuestion: ${question}`;

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-v1',
        prompt: fullPrompt,
        max_tokens_to_sample: 2000
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('Claude API error:', apiRes.status, errText);
      return res.status(502).json({ error: 'upstream_error', status: apiRes.status });
    }

    const data = await apiRes.json();
    const answer = data.completion || 'No answer available.';
    
    // Optional: truncate Free tier answers
    let finalAnswer = answer;
    if (tier === 'Free' && answer.length > 300) {
      finalAnswer = answer.slice(0, 300) + '... Upgrade to Pro for full guidance.';
    }

    return res.status(200).json({ answer: finalAnswer });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
