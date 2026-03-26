// Unlock Pro features for testing — bypasses paywall restrictions
(function () {
  function unlockProFeatures() {
    // Set plan in localStorage before any plan check reads it
    try {
      localStorage.setItem('nomadly3_current_plan', JSON.stringify('pro'));
    } catch (e) {}

    // If setPlan is already available (script runs after main bundle), call it now
    if (typeof setPlan === 'function') {
      setPlan('pro', document.getElementById('ps-pro'));
    } else {
      // Fallback: wait for DOM then apply
      document.addEventListener('DOMContentLoaded', function () {
        if (typeof setPlan === 'function') {
          setPlan('pro', document.getElementById('ps-pro'));
        }
      });
    }
  }

  unlockProFeatures();
})();
