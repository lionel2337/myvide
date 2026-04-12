/**
 * app.js — MyVibe
 * Membre 2 : Front-End (Interactivité) + Membre 5 : QA & DevOps
 * Rôle : Orchestrateur principal. Connecte l'UI, le moteur et la DB.
 */

document.addEventListener('DOMContentLoaded', () => {

  const inputEl     = document.getElementById('userInput');
  const discoverBtn = document.getElementById('discoverBtn');
  const resetBtn    = document.getElementById('resetBtn');
  const modalClose  = document.getElementById('modalClose');
  const modalOverlay= document.getElementById('modalOverlay');

  /* =============================================
     GÉOLOCALISATION : Détection automatique ville
  ============================================= */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(res => res.json())
        .then(data => {
          const ville = data.address.city || data.address.town || data.address.village || '';
          if (ville) {
            inputEl.placeholder = `Tu es à ${ville} — que veux-tu découvrir ?`;
          }
        })
        .catch(() => {
          console.log('[MyVibe] Géolocalisation non disponible');
        });
    });
  }

  /* =============================================
     INPUT : Suggestions live
  ============================================= */
  let debounceTimer;
  inputEl.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      UI.renderTagSuggestions(inputEl.value);
    }, 300);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleDiscover();
  });

  /* =============================================
     DISCOVER : Lancement de la recommandation
  ============================================= */
  discoverBtn.addEventListener('click', handleDiscover);

  async function handleDiscover() {
    const userInput = inputEl.value.trim();

    if (!userInput || userInput.length < 3) {
      shakeInput();
      showInputHint('Dis-moi un peu ce que tu aimes 😊');
      return;
    }

    clearInputHint();
    UI.hideResults();
    UI.showLoader();

    await simulateNetworkDelay(900 + Math.random() * 600);

    try {
      const data = RecommendationEngine.recommend(userInput);
      UI.hideLoader();

      if (!data.results || data.results.length === 0) {
        showNoResults();
        return;
      }

      UI.renderDetectedTags(data.tags, data.keywords);
      UI.renderCards(data.results);
      UI.showResults();

    } catch (err) {
      console.error('[MyVibe] Erreur de recommandation :', err);
      UI.hideLoader();
      showErrorMessage();
    }
  }

  /* =============================================
     RESET : Recommencer
  ============================================= */
  resetBtn.addEventListener('click', () => {
    UI.hideResults();
    inputEl.value = '';
    inputEl.focus();
    document.getElementById('tagSuggestions').innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =============================================
     MODAL : Fermeture
  ============================================= */
  modalClose.addEventListener('click', UI.closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) UI.closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') UI.closeModal();
  });

  /* =============================================
     UTILITAIRES
  ============================================= */
  function simulateNetworkDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function shakeInput() {
    const wrapper = document.querySelector('.input-wrapper');
    wrapper.style.borderColor = '#ff4fca';
    wrapper.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      wrapper.style.animation = '';
      wrapper.style.borderColor = '';
    }, 500);
  }

  function showInputHint(msg) {
    let hint = document.getElementById('inputHint');
    if (!hint) {
      hint = document.createElement('p');
      hint.id = 'inputHint';
      hint.style.cssText = `
        color: var(--neon-pink);
        font-size: 0.82rem;
        margin-top: 10px;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      document.querySelector('.input-zone').appendChild(hint);
    }
    hint.textContent = msg;
    requestAnimationFrame(() => hint.style.opacity = '1');
  }

  function clearInputHint() {
    const hint = document.getElementById('inputHint');
    if (hint) hint.style.opacity = '0';
  }

  function showNoResults() {
    const section = document.getElementById('resultsSection');
    document.getElementById('cardsGrid').innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 48px 0; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom:16px;">🤔</div>
        <h3 style="font-family: var(--font-display); margin-bottom: 8px;">Hmm, vibe inconnu !</h3>
        <p>Essaie des mots comme : <em>science-fiction, R&B, natation, jazz, romance…</em></p>
      </div>
    `;
    document.getElementById('detectedTagsWrapper').innerHTML = '';
    document.getElementById('resultsMood').textContent = '';
    section.style.display = 'block';
  }

  function showErrorMessage() {
    document.getElementById('cardsGrid').innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 48px 0; color: var(--neon-pink);">
        <div style="font-size: 3rem; margin-bottom:16px;">⚠️</div>
        <h3>Une erreur est survenue</h3>
        <p style="color:var(--text-secondary)">Rafraîchis la page et réessaie.</p>
      </div>
    `;
  }

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(styleSheet);

  inputEl.focus();
});