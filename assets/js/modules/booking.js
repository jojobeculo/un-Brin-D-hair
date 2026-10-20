import { readHours, nextOpenDays, slotsFor, salonNow, formatTime } from '../lib/hours.js';
import { readSalonData } from '../lib/data.js';
import { formatDuration, formatPrice } from '../lib/format.js';
import { sendRequest, copyText } from '../lib/channel.js';
import { validateForm, resetErrors } from '../lib/forms.js';
import { toast } from '../lib/toast.js';

const DAYS_SHOWN = 14;

// `diagnostic` : la prestation « Diagnostic capillaire » de la carte (durée et prix affichés).
const GATES = {
  diagnostic: {
    question: 'Avez-vous déjà fait votre diagnostic au salon ?',
    text: () => 'Avant un balayage, une consultation préalable est obligatoire. Elle se fait sur un autre jour que la prestation.',
    blocking: true,
  },
  eclaircissement: {
    question: 'Votre projet couleur demande un éclaircissement ?',
    text: (diagnostic) => `Dans ce cas, un diagnostic préalable est obligatoire (${formatDuration(diagnostic.duration)} · ${formatPrice(diagnostic.price)}, déduits ensuite), sur un autre jour que la couleur.`,
    blocking: false,
  },
};

const DONE_MESSAGES = {
  endpoint: 'Votre demande est bien partie. Sandy vous recontacte pour confirmer le créneau.',
  sms: 'Votre application SMS s’est ouverte avec la demande pré-remplie : il ne reste qu’à l’envoyer.',
  email: 'Votre messagerie s’est ouverte avec la demande pré-remplie : il ne reste qu’à l’envoyer.',
  instagram: 'Votre demande est copiée : collez-la dans la conversation Instagram qui vient de s’ouvrir, puis envoyez-la.',
};

const longDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const shortWeekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' });
const shortMonth = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: 'UTC' });

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Carte des prestations de src/data/services.mjs.
function readCatalog() {
  const services = new Map();
  const categories = (readSalonData().categories || []).map((data) => {
    const category = { ...data, gate: GATES[data.gate] || null, services: [] };
    data.services.forEach((item) => {
      const service = { ...item, category };
      services.set(service.id, service);
      category.services.push(service);
    });
    return category;
  });
  return { categories: categories.filter((category) => category.bookable), services };
}

export function initBooking() {
  const dialog = document.getElementById('booking');
  if (!dialog) return;

  const hours = readHours();
  const { categories, services } = readCatalog();
  const find = (selector) => dialog.querySelector(selector);
  const ui = {
    inner: find('.booking__inner'),
    steps: dialog.querySelectorAll('[data-step]'),
    progress: dialog.querySelectorAll('[data-progress]'),
    back: find('[data-booking-back]'),
    live: find('[data-booking-live]'),
    tabs: find('[data-tabs]'),
    choices: find('[data-choices]'),
    gate: find('[data-gate]'),
    options: find('[data-options]'),
    optionsList: find('[data-options-list]'),
    next: find('[data-next]'),
    days: find('[data-days]'),
    slots: find('[data-slots]'),
    recap: find('[data-recap]'),
    planity: find('[data-planity]'),
    form: find('[data-request-form]'),
    doneMessage: find('[data-done-message]'),
    summary: find('[data-summary]'),
    summaryWhat: find('[data-summary-what]'),
    summaryTotal: find('[data-summary-total]'),
  };

  let state;
  const reset = () => {
    state = { step: '1', history: [], tab: null, service: null, options: new Set(), gateAnswer: null, day: null, time: null };
  };

  const selectedOptions = () => [...state.options].map((id) => services.get(id));
  const totalDuration = () => selectedOptions().reduce((sum, option) => sum + option.duration, state.service.duration);
  const totalPrice = () => selectedOptions().reduce((sum, option) => sum + option.price, state.service.price);
  const priceLabel = () => formatPrice(totalPrice(), state.service.from);
  const slotLabel = () => {
    const date = longDate.format(state.day.date);
    const day = date.charAt(0).toUpperCase() + date.slice(1);
    return state.time === null ? `${day}, heure libre` : `${day} à ${formatTime(state.time)}`;
  };
  const optionsLabel = () => selectedOptions().map((option) => option.name).join(', ') || 'Aucune';
  const needsStep2 = (service) => Boolean(service.category.gate || service.category.options.length);
  const announce = (message) => {
    ui.live.textContent = message;
  };

  // ---------- Navigation ----------

  const render = {
    1: renderServices,
    2: renderOptions,
    3: renderDays,
    4: renderRecap,
  };

  function go(step, { remember = true } = {}) {
    if (remember && state.step !== step) state.history.push(state.step);
    state.step = step;
    ui.steps.forEach((section) => {
      section.hidden = section.dataset.step !== step;
    });
    const position = step === 'done' ? 4 : Number(step);
    ui.progress.forEach((item) => {
      const index = Number(item.dataset.progress);
      item.classList.toggle('is-current', index === position);
      item.classList.toggle('is-done', index < position);
    });
    ui.back.classList.toggle('is-hidden', !state.history.length || step === 'done');
    render[step]?.();
    updateSummary();
    ui.inner.scrollTop = 0;
    dialog.querySelector(`[data-step="${step}"] .step__title`)?.focus({ preventScroll: true });
  }

  function back() {
    let previous = state.history.pop();
    // Après un changement de prestation, l’étape 2 peut ne plus servir.
    if (previous === '2' && !needsStep2(state.service)) previous = state.history.pop();
    if (previous) go(previous, { remember: false });
  }

  function updateSummary() {
    const visible = Boolean(state.service) && state.step !== 'done';
    ui.summary.hidden = !visible;
    if (!visible) return;
    ui.summaryWhat.textContent = [state.service.name, ...selectedOptions().map((option) => option.name)].join(' + ');
    ui.summaryTotal.textContent = `${formatDuration(totalDuration())} · ${priceLabel()}`;
  }

  // ---------- Étape 1 : prestation ----------

  const tabButtons = categories.map((category) => {
    const button = el('button', 'tab', category.label);
    button.type = 'button';
    button.addEventListener('click', () => {
      state.tab = category.id;
      renderServices();
    });
    return button;
  });
  ui.tabs.replaceChildren(...tabButtons);

  function renderServices() {
    state.tab ||= state.service?.category.id || (categories.find((category) => category.featured) || categories[0]).id;
    const category = categories.find((item) => item.id === state.tab);
    tabButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(categories[index] === category)));

    ui.choices.replaceChildren(...category.services.map((service, index) => {
      const button = el('button', 'choice');
      button.type = 'button';
      button.style.setProperty('--n', index);
      button.setAttribute('aria-pressed', String(state.service === service));
      const price = el('span', 'choice__price');
      if (service.from) price.append(el('small', '', 'dès'));
      price.append(`${service.price}\u00a0€`);
      button.append(el('span', 'choice__name', service.name), el('span', 'choice__meta', formatDuration(service.duration)), price);
      button.addEventListener('click', () => choose(service));
      return button;
    }));
  }

  function choose(service) {
    if (state.service !== service) {
      state.options.clear();
      state.gateAnswer = null;
      state.day = null;
      state.time = null;
    }
    state.service = service;
    state.tab = service.category.id;
    announce(`${service.name} : sélectionné.`);
    go(needsStep2(service) ? '2' : '3');
  }

  // ---------- Étape 2 : options et diagnostic ----------

  function renderGate() {
    const { gate } = state.service.category;
    ui.gate.hidden = !gate;
    if (!gate) return;
    const diagnostic = services.get('diagnostic');

    const question = el('p', 'gate__question');
    question.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-warning"/></svg>';
    question.append(gate.question);
    const parts = [question, el('p', '', gate.text(diagnostic))];

    if (gate.blocking) {
      const answers = el('div', 'gate__answers');
      [['done', 'Oui, c’est fait'], ['todo', 'Pas encore']].forEach(([value, label]) => {
        const button = el('button', 'btn', label);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(state.gateAnswer === value));
        button.addEventListener('click', () => {
          state.gateAnswer = value;
          renderOptions();
          ui.gate.querySelector('[aria-pressed="true"]')?.focus();
        });
        answers.append(button);
      });
      parts.push(answers);
    }

    if (!gate.blocking || state.gateAnswer === 'todo') {
      const advice = el('div', 'gate__advice');
      if (gate.blocking) {
        advice.append(el('p', '', `Commençons par là : ${formatDuration(diagnostic.duration)} pour analyser votre chevelure et construire votre projet. Les ${formatPrice(diagnostic.price)} sont déduits de votre balayage.`));
      }
      const book = el('button', 'btn btn--ink', 'Réserver mon diagnostic d’abord');
      book.type = 'button';
      book.addEventListener('click', () => choose(diagnostic));
      advice.append(book);
      parts.push(advice);
    }
    ui.gate.replaceChildren(...parts);
  }

  function renderOptions() {
    renderGate();
    const options = state.service.category.options.map((id) => services.get(id)).filter(Boolean);
    ui.options.hidden = !options.length;
    ui.optionsList.replaceChildren(...options.map((option, index) => {
      const label = el('label', 'option');
      label.style.setProperty('--n', index);
      const input = el('input');
      input.type = 'checkbox';
      input.checked = state.options.has(option.id);
      input.addEventListener('change', () => {
        if (input.checked) state.options.add(option.id);
        else state.options.delete(option.id);
        updateSummary();
      });
      const text = el('span', '');
      text.append(el('span', 'option__name', option.name), el('span', 'option__hint', option.hint));
      const price = el('span', 'option__price', `+${option.price}\u00a0€`);
      price.append(el('small', '', `+${formatDuration(option.duration)}`));
      label.append(input, text, price);
      return label;
    }));
    const { gate } = state.service.category;
    ui.next.disabled = Boolean(gate?.blocking && state.gateAnswer !== 'done');
  }

  // ---------- Étape 3 : créneau ----------

  function renderDays() {
    const now = salonNow();
    const duration = totalDuration();
    const days = nextOpenDays(hours, DAYS_SHOWN, now);
    const sameDay = (a, b) => a && b && a.date.getTime() === b.date.getTime();
    if (!days.some((day) => sameDay(day, state.day))) {
      state.day = days.find((day) => slotsFor(day, hours, duration, now).length) || days[0];
    }

    const buttons = days.map((day, index) => {
      const button = el('button', 'day');
      button.type = 'button';
      button.style.setProperty('--n', index);
      button.append(
        el('span', 'day__dow', day.isToday ? 'Auj.' : shortWeekday.format(day.date)),
        ' ',
        el('span', 'day__num', String(day.date.getUTCDate())),
        ' ',
        el('span', 'day__month', shortMonth.format(day.date)),
      );
      button.addEventListener('click', () => {
        state.day = day;
        state.time = null;
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        renderSlots();
      });
      button.setAttribute('aria-pressed', String(sameDay(day, state.day)));
      return button;
    });
    ui.days.replaceChildren(...buttons);
    buttons.find((button) => button.getAttribute('aria-pressed') === 'true')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    renderSlots();
  }

  function renderSlots() {
    const slots = slotsFor(state.day, hours, totalDuration(), salonNow());
    if (!slots.length) {
      ui.slots.replaceChildren(el('p', 'slots__empty', 'Plus de créneau ce jour-là pour cette durée : choisissez un autre jour.'));
      return;
    }
    const pick = (time) => {
      state.time = time;
      go('4');
    };
    const buttons = slots.map((time, index) => {
      const button = el('button', 'slot', formatTime(time));
      button.type = 'button';
      button.style.setProperty('--n', index);
      button.setAttribute('aria-pressed', String(state.time === time));
      button.addEventListener('click', () => pick(time));
      return button;
    });
    const anyTime = el('button', 'slot slot--any', 'Peu importe l’heure, je suis flexible');
    anyTime.type = 'button';
    anyTime.addEventListener('click', () => pick(null));
    ui.slots.replaceChildren(...buttons, anyTime);
  }

  // ---------- Étape 4 : validation ----------

  function recapLines() {
    return [
      ['Prestation', state.service.name],
      ['Options', optionsLabel()],
      ['Créneau souhaité', slotLabel()],
      ['Durée estimée', formatDuration(totalDuration())],
      ['Tarif estimé', priceLabel()],
    ];
  }

  function renderRecap() {
    const lines = recapLines();
    ui.recap.replaceChildren(...lines.map(([term, value], index) => {
      const row = el('div', index === lines.length - 1 ? 'recap__total' : '');
      row.append(el('dt', '', term), el('dd', '', value));
      return row;
    }));
  }

  function requestText(contact) {
    const lines = ['Demande de rendez-vous — Un Brun d’Hair', ...recapLines().map(([term, value]) => `${term} : ${value}`)];
    if (contact) {
      lines.push(`Prénom : ${contact.prenom}`, `Téléphone : ${contact.telephone}`);
      if (contact.message) lines.push(`Message : ${contact.message}`);
    }
    return lines.join('\n');
  }

  ui.planity.addEventListener('click', () => {
    copyText(requestText());
    toast(`Récapitulatif copié. Sur Planity, choisissez « ${state.service.name} ».`);
  });

  ui.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(ui.form)) return;
    const contact = Object.fromEntries(new FormData(ui.form));
    const submit = ui.form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const channel = await sendRequest({
        subject: `Demande de rendez-vous — ${state.service.name}`,
        text: requestText(contact),
        data: {
          type: 'demande-rendez-vous',
          prestation: state.service.name,
          options: optionsLabel(),
          creneau: slotLabel(),
          duree: formatDuration(totalDuration()),
          tarif: priceLabel(),
          ...contact,
        },
      });
      ui.doneMessage.textContent = DONE_MESSAGES[channel];
      go('done');
    } catch {
      toast(`L’envoi n’a pas abouti. Appelez le salon au ${readSalonData().settings.phone}.`);
    } finally {
      submit.disabled = false;
    }
  });

  // ---------- Ouverture et fermeture ----------

  // `target` : identifiant d’une prestation (étape 2 ou 3) ou d’une catégorie (étape 1, onglet ouvert).
  function open(target) {
    reset();
    ui.form.reset();
    resetErrors(ui.form);
    dialog.showModal();
    const service = services.get(target);
    if (service?.category.bookable) {
      choose(service);
    } else {
      if (categories.some((category) => category.id === target)) state.tab = target;
      go('1', { remember: false });
    }
    // Le bouton « retour » du téléphone ferme le tunnel au lieu de quitter le site.
    // Dans une iframe isolée (origine opaque), pushState échoue : le tunnel fonctionne alors sans.
    try {
      history.pushState({ booking: true }, '');
    } catch {
      // La croix et la touche Échap ferment toujours le tunnel.
    }
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-book]');
    if (!trigger || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open(trigger.dataset.book);
  });

  ui.back.addEventListener('click', back);
  ui.next.addEventListener('click', () => go('3'));
  dialog.querySelectorAll('[data-booking-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => {
    if (history.state?.booking) history.back();
  });
  window.addEventListener('popstate', () => {
    if (dialog.open) dialog.close();
  });
}
