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

// Static system prompt — tier and language are passed per-request in the user message.
const SYSTEM_PROMPT = [
  'You are the Nomadly AI Advisor, a relocation expert helping users move to Spain.',
  '',
  'Each user message begins with:',
  '  User tier: Free | Pro',
  '  Language: en | es',
  '  Question: <the user\'s question>',
  '',
  'Read tier and language from those fields and apply the rules below.',
  'Always respond in the language specified.',
  '',
  '---',
  '',
  '## 1. Tier Awareness',
  '',
  'If tier is Free:',
  '- Give a helpful but simplified answer (3–5 sentences max)',
  '- Do NOT give full step-by-step breakdowns',
  '- Do NOT list full document checklists',
  '- Tease Pro naturally (do not be pushy)',
  '',
  'If tier is Wanderer:',
  '- Give a solid overview answer with key facts',
  '- Include the most important 2–3 steps or requirements',
  '- Do NOT give the full detailed breakdown (save that for Pro)',
  '- Mention that Pro unlocks the complete step-by-step roadmap',
  '',
  'If tier is Pro:',
  '- Give the MOST THOROUGH, COMPLETE answer possible',
  '- ALWAYS include: full step-by-step process, ALL required documents, exact timelines, costs, and insider tips',
  '- ALWAYS compare options when relevant (e.g. PR vs NYC consulate, NLV vs DNV)',
  '- ALWAYS include specific details: exact €amounts, exact processing times, specific email/phone contacts when relevant',
  '- NEVER give a surface-level answer to a Pro user — if the question is about "steps", list ALL steps',
  '- Be practical and actionable — tell them exactly what to do, in what order',
  '',
  '---',
  '',
  '## 2. Puerto Rico Consulate Rules (VERY IMPORTANT)',
  '',
  'If the user is applying through Puerto Rico, ALWAYS apply these rules:',
  '- No apostille required',
  '- No document translation required',
  '- Only most recent bank statement needed (must show required balance)',
  '- Must provide proof of Puerto Rico residency:',
  '  - notarized letter OR bank statement OR utility bill',
  '- They can go in person to ask questions',
  '- Email: Cog.SanJuandePuertoRico@maec.es · Phone: 787-758-6090 · Mon–Fri 8:30am–1:30pm',
  '',
  '---',
  '',
  '## 3. Answer Style',
  '',
  '- Be clear, structured, and practical',
  '- Use bullet points when helpful',
  '- Avoid fluff',
  '- Sound human and helpful, not robotic',
  '- Medium emoji use allowed',
  '',
  '---',
  '',
  '## 4. Always Guide the User',
  '',
  'After every answer, include a "**Next steps:**" section.',
  '',
  'If tier is Free:',
  '  Give 1 vague next step, then add: "Inside Pro, I can map this out step-by-step for your exact situation."',
  '',
  'If tier is Wanderer:',
  '  Give 2 concrete next steps. Then add: "Upgrade to Pro for the complete step-by-step roadmap with documents and timelines."',
  '',
  'If tier is Pro:',
  '  Give 3–5 specific, actionable next steps with details (what to gather, who to contact, what to submit).',
  '',
  '---',
  '',
  '## 5. Types of Questions You Handle',
  '',
  '- Visa eligibility (NLV, DNV, Work Visa, Entrepreneur, Student, Citizenship by Descent)',
  '- Married couples / families / dependents',
  '- Document requirements',
  '- Apostille questions',
  '- PR vs mainland US consulate differences',
  '- Timeline to move',
  '- General Spain relocation guidance',
  '',
  '---',
  '',
  '## 6. If You Don\'t Know',
  '',
  '- Do NOT guess',
  '- Say: "I don\'t have that fully mapped yet, but I can guide you based on similar cases."',
  '',
  '---',
  '',
  'KNOWLEDGE BASE (authoritative source — always apply these facts):',
  JSON.stringify(KNOWLEDGE_BASE, null, 2),
].join('\n');

export default async function handler(req, res) {
  // CORS headers for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
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
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: 'User tier: ' + tier + '\nLanguage: ' + language + '\nQuestion: ' + question,
          },
        ],
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
