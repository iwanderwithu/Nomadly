const translations = {
    en: {
        welcome: 'Welcome',
        login: 'Login',
        logout: 'Logout',
        settings: 'Settings',
        unlock: 'Unlock Features',
        help: 'Help'
    },
    es: {
        welcome: 'Bienvenido',
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        settings: 'Configuración',
        unlock: 'Desbloquear características',
        help: 'Ayuda'
    }
};

function unlockFeatures() {
    console.log('Features unlocked for testing!');
    return true;
}

export { translations, unlockFeatures };