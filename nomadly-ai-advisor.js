// nomadly-ai-advisor.js
// Real Claude API integration for Nomadly AI chat.
// Overrides the local sendChat() with an API-first approach.
// Falls back to local getAIResponse() keyword matching if /api/chat is unavailable.
//
// SETUP:
//   1. Deploy to Vercel (the api/chat.js serverless function handles API key securely)
//   2. Add ANTHROPIC_API_KEY to Vercel → Settings → Environment Variables
//   3. This file is loaded last in index.html — it safely overrides sendChat()

// ── KNOWLEDGE BASE ─────────────────────────────────────────────────────────────
// Mirrors the server-side knowledge base. Used for client-side resource/roadmap
// matching without an extra round-trip.

const NOMADLY_DATA = {
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
          "Health insurance (NLV-compliant, €30,000+ coverage)",
          "Proof of PR residence (notarized letter, utility bill, or bank statement)"
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
          "married couple",
          "cónyuge",
          "dependiente",
          "pareja visa"
        ],
        resources: ["marriage_certificate_pr", "nlv_pr_checklist", "pr_appointment_info"]
      }
    ],
    documents: [
      {
        id: "marriage_certificate_pr",
        title: {
          en: "Marriage Certificate Guide — PR Consulate",
          es: "Guía de Certificado de Matrimonio — Consulado PR"
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
        title: { en: "NLV Roadmap — PR Consulate", es: "Hoja de Ruta NLV — Consulado PR" },
        tier: "Pro",
        steps: [
          { step: 1, en: "Collect required documents", es: "Reunir documentos requeridos" },
          { step: 2, en: "Verify PR exemptions — no apostille, no translation needed", es: "Verificar exenciones de PR — no se requiere apostilla ni traducción" },
          { step: 3, en: "Show most recent bank statement (balance) + proof of PR residence", es: "Mostrar el estado de cuenta más reciente (saldo) + prueba de residencia en PR" },
          { step: 4, en: "Schedule consulate appointment (in-person or via email/phone)", es: "Agendar cita en el consulado (presencial o por correo electrónico/teléfono)" },
          { step: 5, en: "Submit visa application and plan your arrival", es: "Enviar solicitud de visa y planificar tu llegada" }
        ]
      }
    ]
  }
};

// ── MATCHING HELPERS ────────────────────────────────────────────────────────────

function getResourcesForQuestion(question) {
  const matched = [];
  NOMADLY_DATA.modules.visa.forEach(visa => {
    visa.questions_patterns.forEach(pattern => {
      if (new RegExp(pattern, 'i').test(question)) {
        visa.resources.forEach(resId => {
          const doc = NOMADLY_DATA.modules.documents.find(d => d.id === resId);
          if (doc && !matched.includes(doc)) matched.push(doc);
        });
      }
    });
  });
  return matched;
}

function getRoadmapForQuestion(question) {
  const steps = [];
  NOMADLY_DATA.modules.roadmap.forEach(rm => {
    let matched = question.toLowerCase().includes(rm.id.toLowerCase());
    if (!matched) {
      NOMADLY_DATA.modules.visa.forEach(visa => {
        visa.questions_patterns.forEach(pattern => {
          if (
            new RegExp(pattern, 'i').test(question) &&
            rm.id.toLowerCase().includes(visa.visa_type.toLowerCase().replace(/\s+/g, '_'))
          ) matched = true;
        });
      });
    }
    if (matched) rm.steps.forEach(s => steps.push(s));
  });
  return steps;
}

// ── RENDER EXTRAS (resources + roadmap appended to chat bubble) ─────────────────

function renderAnswerExtras(resources, roadmap, lang, tier) {
  let html = '';
  if (!resources.length && !roadmap.length) return html;

  if (resources.length) {
    html += `<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(13,13,13,0.1)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#7a7060;margin-bottom:6px">
        ${lang === 'es' ? 'Recursos' : 'Resources'}
      </div>`;
    resources.forEach(res => {
      const title = res.title[lang] || res.title.en;
      const isPro = res.tier === 'Pro';
      const userHasAccess = tier === 'Pro' || !isPro;
      if (userHasAccess) {
        html += `<div style="font-size:12px;margin-bottom:4px">
          📎 <a href="${res.link}" style="color:#3b6fa0;text-decoration:none">${title} →</a>
        </div>`;
      } else {
        html += `<div style="font-size:12px;color:#7a7060;margin-bottom:4px">
          🔒 ${title} <span style="color:#c4622d;font-size:11px">(Pro)</span>
        </div>`;
      }
    });
    html += '</div>';
  }

  if (roadmap.length && tier === 'Pro') {
    html += `<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(13,13,13,0.1)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#7a7060;margin-bottom:6px">
        ${lang === 'es' ? 'Hoja de Ruta' : 'Roadmap'}
      </div>
      <ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.9;color:#0d0d0d">`;
    roadmap.forEach(step => { html += `<li>${step[lang] || step.en}</li>`; });
    html += '</ol></div>';
  }

  return html;
}

// ── API CALL ────────────────────────────────────────────────────────────────────

async function callClaudeAPI(question, tier, lang) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, tier, language: lang }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (body.error === 'AI_NOT_CONFIGURED') throw new Error('NOT_CONFIGURED');
    const detail = body.detail ? ': ' + body.detail : '';
    throw new Error('API_ERROR_' + res.status + detail);
  }

  const data = await res.json();
  return data.answer;
}

// ── OVERRIDE sendChat() ─────────────────────────────────────────────────────────
// Replaces the local-only version in index.html.
// Tries /api/chat first; falls back to local getAIResponse() on any failure.

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input?.value?.trim();
  if (!msg) return;

  input.value = '';
  const sendBtn = document.getElementById('chat-send');
  if (sendBtn) { sendBtn.style.opacity = '0.5'; sendBtn.style.pointerEvents = 'none'; }

  const msgs = document.getElementById('chat-messages');
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // User bubble
  msgs.innerHTML += `<div class="chat-msg user">
    <div class="chat-avatar user-avatar">👤</div>
    <div><div class="chat-bubble">${msg}</div><div class="chat-time">${now}</div></div>
  </div>`;

  // Typing indicator
  const tid = 't' + Date.now();
  msgs.innerHTML += `<div class="chat-msg ai" id="${tid}">
    <div class="chat-avatar ai-avatar">🌍</div>
    <div class="chat-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>
  </div>`;
  msgs.scrollTop = msgs.scrollHeight;

  const lang  = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  const tier  = (typeof currentPlan !== 'undefined')
    ? (currentPlan === 'pro' ? 'Pro' : currentPlan === 'wanderer' ? 'Wanderer' : 'Free')
    : 'Free';

  let answerHtml;
  try {
    const answerText = await callClaudeAPI(msg, tier, lang);
    const resources  = getResourcesForQuestion(msg);
    const roadmap    = getRoadmapForQuestion(msg);
    const extras     = renderAnswerExtras(resources, roadmap, lang, tier);
    // Convert plain newlines to <br> for display
    answerHtml = answerText.replace(/\n/g, '<br>') + extras;
  } catch (err) {
    console.warn('[Nomadly AI] API error:', err.message);
    // Show the exact error so it's obvious when Claude is not connected
    const isNotConfigured = err.message === 'NOT_CONFIGURED';
    const localResponse = (typeof getAIResponse === 'function') ? getAIResponse(msg) : '';
    answerHtml = (isNotConfigured
      ? '<div style="font-size:11px;color:#c4622d;background:#fff3ee;border-radius:6px;padding:5px 9px;margin-bottom:8px;display:inline-block">⚠️ Claude API not configured — showing offline response</div><br>'
      : '<div style="font-size:11px;color:#c4622d;background:#fff3ee;border-radius:6px;padding:5px 9px;margin-bottom:8px;display:inline-block">⚠️ Claude API error (' + err.message + ') — showing offline response</div><br>'
    ) + localResponse;
  }

  document.getElementById(tid)?.remove();
  msgs.innerHTML += `<div class="chat-msg ai">
    <div class="chat-avatar ai-avatar">🌍</div>
    <div><div class="chat-bubble">${answerHtml}</div><div class="chat-time">${now}</div></div>
  </div>`;
  msgs.scrollTop = msgs.scrollHeight;

  if (sendBtn) { sendBtn.style.opacity = '1'; sendBtn.style.pointerEvents = 'auto'; }
  if (typeof logActivity === 'function') {
    const preview = msg.slice(0, 40) + (msg.length > 40 ? '...' : '');
    logActivity('🤖', 'sky',
      `AI answered: <strong>${preview}</strong>`,
      `IA respondió: <strong>${preview}</strong>`
    );
  }
}
