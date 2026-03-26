// Translations dictionary for English and Spanish
const translations = {
  en: {
    'sb-relocations': 'My Relocations',
    'sb-spain': 'Spain — Madrid',
    'sb-tools': 'Tools',
    'coaching-cta-title': 'Book a Coaching Session',
    'coaching-cta-sub': '15 min · $15 · Talk to someone who did this',
    'dash-greeting': 'Good morning ✦',
    'dash-days-label': 'days to go',
    'notif-title': 'Notifications',
    'free-badge': 'Free Plan',
    'upgrade-btn': 'Upgrade →',
  },
  es: {
    'sb-relocations': 'Mis Mudanzas',
    'sb-spain': 'España — Madrid',
    'sb-tools': 'Herramientas',
    'coaching-cta-title': 'Reserva una Sesión de Coaching',
    'coaching-cta-sub': '15 min · $15 · Habla con alguien que lo hizo',
    'dash-greeting': 'Buenos días ✦',
    'dash-days-label': 'días restantes',
    'notif-title': 'Notificaciones',
    'free-badge': 'Plan Gratuito',
    'upgrade-btn': 'Mejorar →',
  }
};

let currentLang = localStorage.getItem('nomadly-lang') || 'en';

function setLang(lang, element) {
  currentLang = lang;
  localStorage.setItem('nomadly-lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');
  applyTranslations();
}

function applyTranslations() {
  const langData = translations[currentLang];
  for (const [key, value] of Object.entries(langData)) {
    const el = document.getElementById(key);
    if (el) el.textContent = value;
  }
}

document.addEventListener('DOMContentLoaded', applyTranslations);
