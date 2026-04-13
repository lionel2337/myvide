/**
 * Voice.js — MyVibe
 * Membre 2 : Front-End (Interactivité)
 * Rôle : Module vocal indépendant.
 *        Injecte un bouton micro dans la barre de recherche (.sb)
 *        et remplit l'input #ms via la Web Speech API.
 *
 * Installation (1 ligne à ajouter dans index.html) :
 *   <script src="Voice.js"></script>
 *   → À placer juste avant la balise </body>, après les autres scripts.
 *
 * Compatibilité : Chrome, Edge, Safari 14.1+
 *                 Firefox : non supporté (l'API est masquée derrière un flag)
 */

(function () {
  'use strict';

  /* ── Vérification support navigateur ── */
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('[MyVibe Voice] Web Speech API non supportée sur ce navigateur.');
    return;
  }

  /* ── Styles du bouton micro ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Bouton micro */
    #voiceBtn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
      color: var(--td);
      margin-right: 4px;
      position: relative;
    }

    #voiceBtn:hover {
      background: var(--bch);
      color: var(--tp);
    }

    /* État actif : écoute en cours */
    #voiceBtn.listening {
      color: var(--nk, #ff2d87);
      background: rgba(255, 45, 135, 0.12);
      animation: voicePulse 1.2s ease-in-out infinite;
    }

    /* Animation pulsation pendant l'écoute */
    @keyframes voicePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255, 45, 135, 0.3); }
      50%       { box-shadow: 0 0 0 8px rgba(255, 45, 135, 0); }
    }

    /* Toast vocal */
    #voiceToast {
      position: fixed;
      bottom: 5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      padding: 10px 20px;
      border-radius: 100px;
      background: var(--bg3, #151e32);
      border: 0.5px solid rgba(255, 45, 135, 0.4);
      color: var(--nk, #ff2d87);
      font-size: 0.83rem;
      pointer-events: none;
      display: none;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    #voiceToast.on {
      display: flex;
      animation: vtFadeIn 0.25s ease;
    }

    @keyframes vtFadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(6px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* Indicateur sonore animé */
    .vt-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--nk, #ff2d87);
      animation: vtDot 0.9s ease-in-out infinite;
    }
    .vt-dot:nth-child(2) { animation-delay: 0.15s; }
    .vt-dot:nth-child(3) { animation-delay: 0.30s; }

    @keyframes vtDot {
      0%, 80%, 100% { opacity: 0.2; transform: scaleY(1); }
      40%           { opacity: 1;   transform: scaleY(1.6); }
    }
  `;
  document.head.appendChild(style);

  /* ── Création du toast vocal ── */
  const voiceToast = document.createElement('div');
  voiceToast.id = 'voiceToast';
  voiceToast.innerHTML = `
    <div class="vt-dot"></div>
    <div class="vt-dot"></div>
    <div class="vt-dot"></div>
    <span id="voiceToastTxt">Je vous écoute…</span>
  `;
  document.body.appendChild(voiceToast);

  /* ── Création du bouton micro ── */
  const voiceBtn = document.createElement('button');
  voiceBtn.id = 'voiceBtn';
  voiceBtn.type = 'button';
  voiceBtn.title = 'Parler';
  voiceBtn.setAttribute('aria-label', 'Recherche vocale');
  voiceBtn.textContent = '🎙';

  /* ── Injection dans la barre de recherche (.sb) ── */
  function injectButton() {
    const searchBar = document.querySelector('.sb');
    const discoverBtn = document.querySelector('.dbtn');

    if (!searchBar || !discoverBtn) {
      // Réessayer si le DOM n'est pas encore prêt
      setTimeout(injectButton, 200);
      return;
    }

    // Insérer le bouton micro juste avant le bouton Découvrir
    searchBar.insertBefore(voiceBtn, discoverBtn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }

  /* ── Configuration de la reconnaissance vocale ── */
  const recognition = new SpeechRecognition();
  recognition.continuous = false;       // Une phrase à la fois
  recognition.interimResults = true;    // Affichage en temps réel
  recognition.maxAlternatives = 1;

  let isListening = false;

  /* ── Détection de la langue de l'interface ── */
  function getRecognitionLang() {
    // Lit la langue du State global de MyVibe si disponible
    if (typeof S !== 'undefined' && S.lang) {
      return S.lang === 'en' ? 'en-US' : 'fr-FR';
    }
    // Fallback sur l'attribut lang du document
    const docLang = document.documentElement.lang;
    if (docLang && docLang.startsWith('en')) return 'en-US';
    return 'fr-FR';
  }

  function getInputEl() {
    // Cherche d'abord #ms (index.html actuel), puis #userInput (app.js legacy)
    return document.getElementById('ms') || document.getElementById('userInput');
  }

  /* ── Démarrer / arrêter l'écoute ── */
  function toggleListening() {
    if (isListening) {
      recognition.stop();
      return;
    }

    recognition.lang = getRecognitionLang();

    try {
      recognition.start();
    } catch (e) {
      console.warn('[MyVibe Voice] Impossible de démarrer :', e.message);
    }
  }

  /* ── Événements de reconnaissance ── */
  recognition.onstart = function () {
    isListening = true;
    voiceBtn.classList.add('listening');
    voiceBtn.title = 'Arrêter';

    const lang = recognition.lang;
    const msg = lang.startsWith('fr') ? 'Je vous écoute…' : 'Listening…';
    showVoiceToast(msg);
  };

  recognition.onresult = function (event) {
    const inputEl = getInputEl();
    if (!inputEl) return;

    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    // Affiche le texte en temps réel dans l'input
    inputEl.value = transcript;

    // Met à jour le toast
    const lang = recognition.lang;
    document.getElementById('voiceToastTxt').textContent =
      (lang.startsWith('fr') ? '🎙 ' : '🎙 ') + transcript;
  };

  recognition.onend = function () {
    isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtn.title = 'Parler';
    hideVoiceToast();

    // Lance automatiquement la recherche si du texte a été capturé
    const inputEl = getInputEl();
    if (inputEl && inputEl.value.trim().length >= 2) {
      // Déclenche la recherche de MyVibe (doSearch si disponible, sinon discoverBtn)
      setTimeout(() => {
        if (typeof doSearch === 'function') {
          doSearch();
        } else {
          const btn = document.querySelector('.dbtn') || document.getElementById('discoverBtn');
          if (btn) btn.click();
        }
      }, 350); // léger délai pour que l'utilisateur voie ce qui a été capturé
    }
  };

  recognition.onerror = function (event) {
    isListening = false;
    voiceBtn.classList.remove('listening');
    hideVoiceToast();

    const lang = recognition.lang;
    const msgs = {
      'no-speech':          lang.startsWith('fr') ? 'Aucun son détecté.' : 'No speech detected.',
      'not-allowed':        lang.startsWith('fr') ? 'Microphone refusé. Autorisez l\'accès dans votre navigateur.' : 'Microphone access denied.',
      'audio-capture':      lang.startsWith('fr') ? 'Microphone introuvable.' : 'No microphone found.',
      'network':            lang.startsWith('fr') ? 'Erreur réseau.' : 'Network error.',
    };
    const msg = msgs[event.error] || (lang.startsWith('fr') ? 'Erreur vocale.' : 'Voice error.');
    showVoiceToast(msg, 2500);
  };

  /* ── Clic sur le bouton ── */
  voiceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleListening();
  });

  /* ── Toast helpers ── */
  let toastTimer;
  function showVoiceToast(msg, autohide) {
    document.getElementById('voiceToastTxt').textContent = msg;
    voiceToast.classList.add('on');
    clearTimeout(toastTimer);
    if (autohide) {
      toastTimer = setTimeout(hideVoiceToast, autohide);
    }
  }

  function hideVoiceToast() {
    voiceToast.classList.remove('on');
  }

  /* ── Accessibilité : fermer avec Escape ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isListening) {
      recognition.stop();
    }
  });

  console.log('[MyVibe Voice] Module vocal chargé ✓');
})();