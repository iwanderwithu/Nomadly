// api/chat.js — Vercel Serverless Function
// Secure proxy to Anthropic Claude API.
// Set ANTHROPIC_API_KEY in Vercel environment variables.
// Configure in Vercel dashboard: Settings → Environment Variables

const KNOWLEDGE_BASE = {
  modules: {
    visa: [
      {
        visa_type: "Non-Lucrative",
        eligibility: [
          "Non-EU citizens",
          "Proof of €27,000+ income/year (or PR bank statement showing balance)"
        ],
        spouse_requirement: "Only primary applicant needs visa; spouse applies as dependent",
        required_documents: [
          "Passport",
          "Bank statements (most recent)",
          "Health insurance (NLV-compliant, €30,000+ coverage, no copays)",
          "Proof of residence in Puerto Rico (notarized letter, utility bill, or bank statement)"
        ],
        processing_time: "2–3 months (may vary at PR consulate)",
        questions_patterns: [
          "do both spouses need a dnv",
          "visa for married couple",
          "dependent visa",
          "PR consulate requirements",
          "Puerto Rico appointment",
          "spouse",
          "dependent",
          "married couple"
        ],
        resources: ["marriage_certificate_pr", "nlv_pr_checklist", "pr_appointment_info"]
      }
    ],
    documents: [
      {
        id: "marriage_certificate_pr",
        title: {
          en: "Marriage Certificate Guide for PR Consulate",
          es: "Guía de Certificado de Matrimonio para Consulado PR"
        },
        type: "guide",
        link: "#resources",
        tier: "Free"
      },
      {
        id: "nlv_pr_checklist",
        title: {
          en: "NLV Checklist — PR Consulate",
          es: "Lista de Verificación NLV — Consulado PR"
        },
        type: "checklist",
        link: "#resources",
        tier: "Pro"
      },
      {
        id: "pr_appointment_info",
        title: {
          en: "PR Consulate Appointment Info",
          es: "Información de Citas — Consulado PR"
        },
        type: "guide",
        link: "mailto:Cog.SanJuandePuertoRico@maec.es",
        tier: "Pro"
      }
    ],
    roadmap: [
      {
        id: "nlv_pr_roadmap",
        title: {
          en: "NLV Roadmap — PR Consulate",
          es: "Hoja de Ruta NLV — Consulado PR"
        },
        tier: "Pro",
        steps: [
          { step: 1, en: "Collect required documents", es: "Reunir documentos requeridos" },
          { step: 2, en: "Verify PR exemptions — no apostille, no translation needed", es: "Verificar exenciones de PR — no se requiere apostilla ni traducción" },
          { step: 3, en: "Show most recent bank statement (balance) + proof of PR residence", es: "Mostrar el estado de cuenta bancario más reciente (saldo) + prueba de residencia en PR" },
          { step: 4, en: "Schedule consulate appointment (in-person or via email/phone)", es: "Agendar cita en el consulado (presencial o por correo electrónico/teléfono)" },
          { step: 5, en: "Submit visa application and plan your arrival", es: "Enviar solicitud de visa y planificar tu llegada" }
        ]
      }
    ]
  }
};

function buildSystemPrompt(tier, language) {
  const isES = language === 'es';
  const isPro = tier === 'Pro';

  return `You are Nomadly AI Advisor — a bilingual relocation specialist helping Puerto Ricans move to Spain.

USER CONTEXT:
- Tier: ${tier}${isPro ? ' (full access — give complete, detailed answers with all resources and roadmap steps)' : ' (limited — give a helpful simplified answer, then mention upgrading to Pro for the full guide)'}
- Language: ${isES ? 'Spanish — respond entirely in Spanish, no English' : 'English — respond in English'}

BEHAVIOR RULES:
1. Tier distinction: Free/Wanderer users get a useful but concise answer + one mention of Pro for the full version. Pro users get the full detail, step-by-step roadmaps, and all resources.
2. PR consulate specifics (San Juan) — apply when relevant:
   • No apostilles required on US documents
   • No document translation required
   • Only the most recent bank statement needed (to show balance)
   • Proof of PR residence = notarized letter, bank statement, or utility bill
   • Contact: Cog.SanJuandePuertoRico@maec.es · 787-758-6090 · Mon–Fri 8:30am–1:30pm
3. Resources: always cite relevant resources. Mark Pro-only resources as "(Pro)" for non-Pro users.
4. Roadmap: for Pro users, include step-by-step roadmap when the question involves a process or application.
5. Emoji: use medium — informative not decorative. One or two per section header is fine.
6. Format: use bullet points and bold headers for readability. Keep under 300 words unless complexity demands more.
7. Ambiguity: if the question is vague, ask one clarifying question before diving into detail.
8. Scope: if genuinely outside your knowledge, say "I don't have that detail yet" — never fabricate facts.
9. This app is focused on Spain relocation for Puerto Ricans. You may also address Colombia, Costa Rica, and Portugal briefly.

KNOWLEDGE BASE (authoritative source):
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}`;
}

export default async function handler(req, res) {
  // CORS headers for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // No API key configured — tell client to use local fallback
    return res.status(503).json({ error: 'AI_NOT_CONFIGURED' });
  }

  const { question, tier = 'Free', language = 'en' } = req.body || {};
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'question is required' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: buildSystemPrompt(tier, language),
        messages: [{ role: 'user', content: question }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic API error:', anthropicRes.status, errText);
      return res.status(502).json({ error: 'upstream_error', status: anthropicRes.status });
    }

    const data = await anthropicRes.json();
    const answer = data.content?.[0]?.text ?? '';
    return res.status(200).json({ answer });

  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
