// Supplemental translations and coaching CTA overrides
var translations = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    unlock: 'Unlock Features',
    help: 'Help',
    'coaching-cta-sub': '15 min · Free intro · Talk to someone who did this'
  },
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    settings: 'Configuración',
    unlock: 'Desbloquear características',
    help: 'Ayuda',
    'coaching-cta-sub': '15 min · Intro gratis · Habla con alguien que hizo este proceso'
  }
};

function unlockFeatures() {
  console.log('Features unlocked for testing!');
  return true;
}

// Apply coaching CTA description override once DOM is ready
(function applyCoachingCTAOverride() {
  function apply() {
    var lang = (typeof currentLang !== 'undefined' ? currentLang : null) ||
               document.documentElement.lang || 'en';
    var strings = translations[lang] || translations['en'];
    var subEl = document.getElementById('coaching-cta-sub');
    if (subEl && strings['coaching-cta-sub']) {
      subEl.textContent = strings['coaching-cta-sub'];
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
