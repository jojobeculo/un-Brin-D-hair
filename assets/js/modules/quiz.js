// Questionnaire « Quelle coupe pour moi ? » : une question à la fois, puis 3 coupes illustrées
// avec score de compatibilité, prix et durée au salon, et deux produits pour l’entretien.
import { readSalonData } from '../lib/data.js';
import { activeQuestions, recommend, estimate, suggestProducts } from '../lib/quiz-logic.js';
import { haircutSvg } from '../lib/haircut-art.js';
import { bottleSvg } from '../lib/bottle.js';

const STYLING = { 1: '2 min le matin', 2: '10 min le matin', 3: '20 min ou plus le matin' };
const escapeHtml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const euros = (value) => `${value.toFixed(2).replace('.', ',')}\u00a0€`;

export function initQuiz() {
  const root = document.querySelector('[data-quiz]');
  const stage = root.querySelector('[data-quiz-stage]');
  const live = root.querySelector('[data-quiz-live]');
  const { quiz } = readSalonData();
  const services = new Map(quiz.services.map((service) => [service.id, service]));
  const products = new Map(quiz.products.map((product) => [product.id, product]));
  let answers = {};
  let index = 0;

  const swap = (markup, focusSelector) => {
    stage.classList.remove('is-entering');
    stage.innerHTML = markup;
    // Relance l’animation d’entrée à chaque écran.
    requestAnimationFrame(() => stage.classList.add('is-entering'));
    stage.querySelector(focusSelector)?.focus({ preventScroll: true });
  };

  function renderQuestion() {
    const list = activeQuestions(answers);
    const question = list[index];
    const options = question.options(answers);
    const progress = Math.round((index / list.length) * 100);
    live.textContent = `Question ${index + 1} sur ${list.length}`;
    swap(`
      <div class="quiz__top">
        <button class="quiz__back" type="button" data-back ${index ? '' : 'hidden'}>← Retour</button>
        <p class="quiz__count">Question ${index + 1} <span>/ ${list.length}</span></p>
      </div>
      <div class="quiz__bar" aria-hidden="true"><span style="width:${progress}%"></span></div>
      <h3 class="quiz__question" tabindex="-1">${escapeHtml(question.title)}</h3>
      ${question.hint ? `<p class="quiz__hint">${escapeHtml(question.hint)}</p>` : ''}
      <ul class="quiz__options${options.length > 4 ? ' quiz__options--many' : ''}">
        ${options.map(([value, label, hint], i) => `<li style="--i:${i}"><button type="button" class="quiz__option${answers[question.id] === value ? ' is-chosen' : ''}" data-value="${escapeHtml(value)}" data-cursor="Choisir">
          <span class="quiz__label">${escapeHtml(label)}</span>${hint ? `<span class="quiz__sub">${escapeHtml(hint)}</span>` : ''}
        </button></li>`).join('')}
      </ul>`, '.quiz__question');

    stage.querySelector('[data-back]')?.addEventListener('click', () => {
      index -= 1;
      renderQuestion();
    });
    stage.querySelectorAll('[data-value]').forEach((button) => button.addEventListener('click', () => {
      answers[question.id] = button.dataset.value;
      // Une réponse peut retirer des questions (ex. coupe enfant) : on oublie leurs réponses.
      const active = new Set(activeQuestions(answers).map((item) => item.id));
      answers = Object.fromEntries(Object.entries(answers).filter(([id]) => active.has(id)));
      button.classList.add('is-chosen');
      setTimeout(() => {
        index += 1;
        if (index >= activeQuestions(answers).length) renderResults();
        else renderQuestion();
      }, 260);
    }));
  }

  function productCard(product) {
    return `<li class="quiz__product">
      ${bottleSvg(product, product.tint)}
      <span><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.size)} · ${euros(product.price)}</span></span>
      <button class="btn btn--sm" type="button" data-add-to-cart="${product.id}" data-name="${escapeHtml(product.name)}">Ajouter</button>
    </li>`;
  }

  function renderResults() {
    const picks = recommend(answers, quiz.haircuts);
    const price = estimate(answers, services, quiz.couleurs);
    const highlight = answers.couleur === 'lumieres' || answers.couleur === 'intense';
    const suggested = picks.length ? suggestProducts(answers, picks[0].cut).map((id) => products.get(id)).filter(Boolean) : [];
    live.textContent = 'Vos résultats sont prêts.';
    const cards = picks.map(({ cut, score, reasons }, i) => {
      const circumference = 2 * Math.PI * 26;
      return `<li class="result" data-tilt style="--i:${i}">
        <div class="result__art">${haircutSvg(cut.art, { highlight, id: `result-${i}`, title: `Illustration : ${cut.name}` })}</div>
        <div class="result__score" role="img" aria-label="Compatibilité : ${score} %">
          <svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26"/><circle class="result__gauge" cx="30" cy="30" r="26" style="--dash:${(circumference * score / 100).toFixed(1)};--full:${circumference.toFixed(1)}"/></svg>
          <span><strong>${score}</strong>%</span>
        </div>
        <p class="result__rank">${i === 0 ? 'Notre meilleure piste' : `Piste ${i + 1}`}</p>
        <h3 class="result__name">${escapeHtml(cut.name)}</h3>
        <p class="result__text">${escapeHtml(cut.text)}</p>
        ${reasons.length ? `<ul class="result__reasons">${reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('')}</ul>` : ''}
        <dl class="result__facts">
          <div><dt>Au salon</dt><dd>${price.duration} · ${price.price}</dd></div>
          <div><dt>Coiffage</dt><dd>${STYLING[cut.styling]}</dd></div>
          <div><dt>Entretien</dt><dd>${escapeHtml(cut.upkeep)}</dd></div>
        </dl>
      </li>`;
    }).join('');

    swap(`
      <div class="quiz__top">
        <button class="quiz__back" type="button" data-restart>↺ Refaire le test</button>
        <p class="quiz__count">Résultats</p>
      </div>
      <div class="quiz__bar" aria-hidden="true"><span style="width:100%"></span></div>
      <h3 class="quiz__question" tabindex="-1">Vos <em>trois coupes</em></h3>
      <p class="quiz__hint">Prestation conseillée : ${escapeHtml(price.serviceName)}${price.items.length > 1 ? ', avec l’option cheveux épais' : ''}.${price.color ? ` ${escapeHtml(price.color.text)}` : ''}</p>
      ${picks.length ? `<ol class="results">${cards}</ol>` : '<p class="lead">Aucune coupe ne correspond à toutes vos réponses : Sandy vous conseille directement au salon.</p>'}
      <div class="quiz__book">
        <a class="btn btn--primary" href="${quiz.planity}" target="_blank" rel="noopener" data-track="planity" data-cursor="Réserver">${price.diagnostic ? 'Je réserve mon diagnostic' : 'Je réserve sur Planity'} ↗</a>
        <p>${price.diagnostic ? 'Un balayage commence toujours par un diagnostic de 15 minutes, un autre jour. ' : ''}Montrez ce résultat à Sandy : elle validera la coupe avec vous, selon vos cheveux.</p>
      </div>
      ${suggested.length ? `<div class="quiz__products"><p class="quiz__count">Pour l’entretien à la maison, en click and collect</p><ul>${suggested.map(productCard).join('')}</ul></div>` : ''}`, '.quiz__question');

    stage.querySelector('[data-restart]').addEventListener('click', () => {
      answers = {};
      index = 0;
      renderQuestion();
    });
    // Jauge et chiffres animés à l’arrivée des résultats.
    requestAnimationFrame(() => stage.classList.add('has-results'));
  }

  renderQuestion();
}
