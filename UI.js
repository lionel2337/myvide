/**
 * ui.js — MyVibe (Amélioré)
 * Lead UI/UX : serenahougang
 * Rôle : Rendu des composants visuels
 */

const UI = (() => {

  /* =============================================
     LOADER
  ============================================= */
  function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
  }

  function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }

  /* =============================================
     RÉSULTATS
  ============================================= */
  function showResults() {
    const section = document.getElementById('resultsSection');
    if (section) {
      section.style.display = 'block';
      section.style.animation = 'fadeInUp 0.5s ease';
    }
  }

  function hideResults() {
    const section = document.getElementById('resultsSection');
    if (section) section.style.display = 'none';
  }

  /* =============================================
     CARDS : Rendu des cartes de recommandation
  ============================================= */
  function renderCards(results) {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    results.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${index * 0.1}s`;
      card.style.animation = 'fadeInUp 0.5s ease both';

      card.innerHTML = `
        <div class="card-emoji">${item.emoji || '🎵'}</div>
        <div class="card-type">${getTypeLabel(item.type)}</div>
        <h3 class="card-title">${item.titre}</h3>
        <p class="card-author">${item.auteur || item.artiste || ''}</p>
        <p class="card-description">${item.description}</p>
        <div class="card-tags">
          ${(item.tags || []).slice(0, 3).map(tag =>
            `<span class="tag">${tag}</span>`
          ).join('')}
        </div>
      `;

      card.addEventListener('click', () => openModal(item));
      grid.appendChild(card);
    });

    // Injection animation CSS
    injectAnimation();
  }

  /* =============================================
     TYPE LABEL
  ============================================= */
  function getTypeLabel(type) {
    const labels = {
      'book':  '📚 Livre',
      'music': '🎵 Musique',
      'movie': '🎬 Film',
      'place': '📍 Lieu',
      'sport': '⚽ Sport'
    };
    return `<span class="type-badge">${labels[type] || type}</span>`;
  }

  /* =============================================
     MODAL : Ouverture
  ============================================= */
  function openModal(item) {
    const overlay = document.getElementById('modalOverlay');
    const title   = document.getElementById('modalTitle');
    const body    = document.getElementById('modalBody');

    if (!overlay || !title || !body) return;

    title.textContent = `${item.emoji || ''} ${item.titre}`;
    body.innerHTML = `
      <p class="modal-author">${item.auteur || item.artiste || ''}</p>
      <p class="modal-description">${item.detail || item.description}</p>
      <div class="modal-tags">
        ${(item.tags || []).map(tag =>
          `<span class="tag">${tag}</span>`
        ).join('')}
      </div>
    `;

    overlay.style.display = 'flex';
    overlay.style.animation = 'fadeIn 0.3s ease';
  }

  /* =============================================
     MODAL : Fermeture
  ============================================= */
  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.style.display = 'none';
  }

  /* =============================================
     TAGS DÉTECTÉS
  ============================================= */
  function renderDetectedTags(tags, keywords) {
    const wrapper = document.getElementById('detectedTagsWrapper');
    if (!wrapper) return;

    wrapper.innerHTML = `
      <div class="detected-tags">
        <span style="color:var(--text-secondary); font-size:0.85rem;">Vibes détectés : </span>
        ${(tags || []).map(tag =>
          `<span class="tag">${tag}</span>`
        ).join('')}
      </div>
    `;
  }

  /* =============================================
     SUGGESTIONS DE TAGS
  ============================================= */
  function renderTagSuggestions(value) {
    const container = document.getElementById('tagSuggestions');
    if (!container || !value || value.length < 2) {
      if (container) container.innerHTML = '';
      return;
    }

    const suggestions = getSuggestions(value);
    container.innerHTML = suggestions.map(s =>
      `<span class="tag suggestion" style="cursor:pointer" 
        onclick="document.getElementById('userInput').value='${s}';
        document.getElementById('tagSuggestions').innerHTML='';">
        ${s}
      </span>`
    ).join('');
  }

  function getSuggestions(value) {
    const all = [
      'jazz', 'rap', 'r&b', 'pop', 'afrobeats', 'classique',
      'science-fiction', 'romance', 'thriller', 'aventure',
      'natation', 'football', 'yoga', 'running', 'fitness',
      'cinéma', 'lecture', 'voyage', 'cuisine', 'photographie'
    ];
    return all.filter(s => s.startsWith(value.toLowerCase())).slice(0, 5);
  }

  /* =============================================
     INJECTION ANIMATIONS CSS
  ============================================= */
  function injectAnimation() {
    if (document.getElementById('ui-animations')) return;
    const style = document.createElement('style');
    style.id = 'ui-animations';
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .type-badge {
        font-size: 0.75rem;
        color: var(--neon-blue);
        margin-bottom: 8px;
        display: block;
      }
      .card-tags {
        margin-top: 12px;
      }
      .modal-author {
        color: var(--neon-purple);
        margin-bottom: 12px;
        font-weight: 600;
      }
      .modal-description {
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: 16px;
      }
      .suggestion:hover {
        background: rgba(168,85,247,0.3) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* =============================================
     EXPORT
  ============================================= */
  return {
    showLoader,
    hideLoader,
    showResults,
    hideResults,
    renderCards,
    renderDetectedTags,
    renderTagSuggestions,
    openModal,
    closeModal
  };

})();