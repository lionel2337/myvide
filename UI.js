/**
 * ui.js — MyVibe
 * Membre 2 : Développeur Front-End (Interactivité)
 * Gère : rendu des cartes, animations, modal, tags détectés.
 * Utilise AJAX-style avec fetch simulé (PHP ready).
 */

const UI = (() => {

  /* =============================================
     CONFIGURATION VISUELLE PAR TYPE
  ============================================= */
  const TYPE_CONFIG = {
    book:  { label: '📚 Livre',     cssClass: 'type-book',  emoji: '📚' },
    music: { label: '🎵 Musique',   cssClass: 'type-music', emoji: '🎵' },
    film:  { label: '🎬 Film',      cssClass: 'type-film',  emoji: '🎬' },
    place: { label: '📍 Lieu',      cssClass: 'type-place', emoji: '📍' },
  };

  const CAT_CLASS = {
    book:  'cat-book',
    music: 'cat-music',
    film:  'cat-film',
    place: 'cat-place',
  };

  /* =============================================
     RENDER : Cartes de recommandation
  ============================================= */
  function renderCards(results) {
    const grid = document.getElementById('cardsGrid');
    grid.innerHTML = '';

    results.forEach((item, index) => {
      const cfg = TYPE_CONFIG[item.displayType] || TYPE_CONFIG.book;
      const score = item.score || 0;
      const scoreWidth = Math.max(score, 12); // min barre visible

      const card = document.createElement('div');
      card.className = `rec-card glass-card ${cfg.cssClass}`;
      card.style.animationDelay = `${index * 0.1}s`;

      const descText = item.description || item.desc || '';
      const subText  = item.sub || item.auteur || item.categorie || '';
      const tagsArr  = item.tags || [];

      card.innerHTML = `
        <div class="card-header">
          <div class="card-icon-wrap">${cfg.emoji}</div>
          <div class="card-meta">
            <div class="card-category">${cfg.label}</div>
            <div class="card-title">${escapeHTML(item.name || item.titre || item.nom)}</div>
            ${subText ? `<div class="card-author">${escapeHTML(subText)}</div>` : ''}
          </div>
        </div>

        <p class="card-desc">${escapeHTML(descText)}</p>

        <div class="card-score">
          <div class="score-bar-bg">
            <div class="score-bar-fill" style="width: 0%" data-target="${scoreWidth}%"></div>
          </div>
          <span class="score-label">Match ${score}%</span>
        </div>

        <div class="card-tags">
          ${tagsArr.slice(0,4).map(t => `<span class="card-tag">${escapeHTML(t)}</span>`).join('')}
        </div>

        <button class="btn-voir-plus" data-id="${item.id}" data-type="${item.displayType}">
          Voir plus →
        </button>
      `;

      grid.appendChild(card);

      // Animation de la barre de score (GSAP-like en vanilla JS)
      requestAnimationFrame(() => {
        const fill = card.querySelector('.score-bar-fill');
        setTimeout(() => {
          fill.style.width = fill.dataset.target;
        }, 200 + index * 100);
      });

      // Event : Voir plus
      card.querySelector('.btn-voir-plus').addEventListener('click', () => {
        openModal(item);
      });
    });
  }

  /* =============================================
     RENDER : Tags détectés
  ============================================= */
  function renderDetectedTags(tags, keywords) {
    const wrapper = document.getElementById('detectedTagsWrapper');
    wrapper.innerHTML = '';

    // Afficher les mots-clés de l'utilisateur en priorité
    const displayed = keywords.length > 0 ? keywords : tags.slice(0, 8);

    displayed.slice(0, 10).forEach((tag, i) => {
      const span = document.createElement('span');
      const catClass = guessCatClass(tag);
      span.className = `detected-tag ${catClass}`;
      span.style.animationDelay = `${i * 0.06}s`;
      span.innerHTML = `<span>${tagEmoji(tag)}</span> ${escapeHTML(tag)}`;
      wrapper.appendChild(span);
    });

    // Mood phrase
    const mood = document.getElementById('resultsMood');
    mood.textContent = buildMoodPhrase(keywords, tags);
  }

  /* =============================================
     RENDER : Suggestions de tags (pré-requête)
  ============================================= */
  function renderTagSuggestions(query) {
    const container = document.getElementById('tagSuggestions');
    if (!query || query.length < 2) {
      container.innerHTML = '';
      return;
    }

    const suggestions = [
      'science-fiction', 'R&B', 'natation', 'jazz', 'afrobeats',
      'lecture', 'cinéma', 'running', 'romance', 'yoga', 'hip-hop',
      'aventure', 'technologie', 'culture', 'philosophie'
    ].filter(s => !query.toLowerCase().includes(s.toLowerCase())).slice(0, 6);

    container.innerHTML = suggestions.map(s =>
      `<span class="tag-chip" data-value="${s}">${s}</span>`
    ).join('');

    container.querySelectorAll('.tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('userInput');
        input.value = input.value
          ? input.value.trim() + ', ' + chip.dataset.value
          : chip.dataset.value;
        input.focus();
        renderTagSuggestions('');
      });
    });
  }

  /* =============================================
     MODAL : Ouvrir le détail d'un item
  ============================================= */
  function openModal(item) {
    const overlay = document.getElementById('modalOverlay');
    const body = document.getElementById('modalBody');
    const cfg = TYPE_CONFIG[item.displayType] || TYPE_CONFIG.book;

    const detailText = item.detail || item.description || '';
    const isPlace = item.displayType === 'place';

    body.innerHTML = `
      <div class="card-category" style="margin-bottom:10px;">${cfg.label}</div>
      <h2 class="modal-title">${escapeHTML(item.name || item.titre || item.nom)}</h2>
      ${item.sub ? `<p style="color:var(--text-secondary); margin-bottom:16px;">${escapeHTML(item.sub)}</p>` : ''}
      <p class="modal-detail">${escapeHTML(detailText)}</p>
      ${isPlace && item.adresse ? `
        <div class="modal-location">
          📍 <strong>${escapeHTML(item.adresse)}</strong>
        </div>
      ` : ''}
      <div style="margin-top:20px; display:flex; flex-wrap:wrap; gap:8px;">
        ${(item.tags||[]).map(t => `<span class="card-tag">${escapeHTML(t)}</span>`).join('')}
      </div>
    `;

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.body.style.overflow = '';
  }

  /* =============================================
     UTILITAIRES
  ============================================= */
  function escapeHTML(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function guessCatClass(tag) {
    const t = tag.toLowerCase();
    if (['science-fiction','livre','lecture','philosophie','psychologie'].some(k => t.includes(k))) return 'cat-book';
    if (['r&b','musique','jazz','rap','afrobeats','pop','classique','soul'].some(k => t.includes(k))) return 'cat-music';
    if (['film','cinéma','thriller','animation','horreur'].some(k => t.includes(k))) return 'cat-film';
    if (['natation','sport','fitness','running','yoga','lieu','nature'].some(k => t.includes(k))) return 'cat-place';
    return 'cat-other';
  }

  function tagEmoji(tag) {
    const t = tag.toLowerCase();
    if (t.includes('musique') || t.includes('r&b') || t.includes('jazz')) return '🎵';
    if (t.includes('sport') || t.includes('fitness') || t.includes('running')) return '🏃';
    if (t.includes('natation') || t.includes('piscine')) return '🏊';
    if (t.includes('film') || t.includes('cinéma')) return '🎬';
    if (t.includes('livre') || t.includes('lecture')) return '📚';
    if (t.includes('science') || t.includes('futur')) return '🚀';
    if (t.includes('afrique') || t.includes('cameroun')) return '🌍';
    if (t.includes('amour') || t.includes('romance')) return '💜';
    if (t.includes('nature') || t.includes('plein')) return '🌿';
    return '✦';
  }

  function buildMoodPhrase(keywords, tags) {
    if (!keywords.length && !tags.length) return '';
    const kws = keywords.slice(0, 3);
    if (!kws.length) return `Basé sur ${tags.length} intérêts détectés`;
    return `Basé sur ton intérêt pour : ${kws.join(', ')}`;
  }

  /* =============================================
     SHOW / HIDE SECTIONS
  ============================================= */
  function showLoader() {
    document.getElementById('loader').style.display = 'flex';
  }

  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }

  function showResults() {
    const section = document.getElementById('resultsSection');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('cardsGrid').innerHTML = '';
    document.getElementById('detectedTagsWrapper').innerHTML = '';
  }

  // API publique
  return {
    renderCards,
    renderDetectedTags,
    renderTagSuggestions,
    openModal,
    closeModal,
    showLoader,
    hideLoader,
    showResults,
    hideResults
  };

})();
