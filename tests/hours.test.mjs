import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHours, openStatus, isOpenWeek, formatTime } from '../assets/js/lib/hours.js';
import { salon } from '../src/data/salon.mjs';

const hours = parseHours(salon.hours);
const DAY = 86_400_000;
// Lundi 19 octobre 2026.
const monday = Date.UTC(2026, 9, 19);
const at = (offset, weekday, hh, mm = 0) => ({ date: monday + offset * DAY, weekday, minutes: hh * 60 + mm });

test('formatTime suit l’usage français', () => {
  assert.equal(formatTime(540), '9\u00a0h');
  assert.equal(formatTime(1110), '18\u00a0h\u00a030');
});

test('ouvert un mardi en journée', () => {
  assert.deepEqual(openStatus(hours, at(1, 2, 10)), { state: 'open', label: 'Ouvert · jusqu’à 19\u00a0h' });
});

test('fermé un mardi soir : ouvre demain', () => {
  assert.equal(openStatus(hours, at(1, 2, 20)).label, 'Fermé · ouvre demain à 9\u00a0h');
});

test('semaine de référence inconnue : le lundi reste incertain', () => {
  assert.equal(openStatus(hours, at(0, 1, 11)).state, 'maybe');
  assert.equal(openStatus(hours, at(-2, 6, 18)).label, 'Fermé · réouverture lundi ou mardi');
});

test('semaine de référence connue : alternance lundi et samedi', () => {
  assert.equal(isOpenWeek(monday, '2026-10-19'), true);
  assert.equal(isOpenWeek(monday + 7 * DAY, '2026-10-19'), false);
  assert.equal(isOpenWeek(monday + 5 * DAY, '2026-10-19'), true);
  assert.equal(openStatus(hours, at(0, 1, 11), '2026-10-19').state, 'open');
  assert.equal(openStatus(hours, at(7, 1, 11), '2026-10-19').label, 'Fermé · ouvre demain à 9\u00a0h');
  assert.equal(openStatus(hours, at(5, 6, 18), '2026-10-19').label, 'Fermé · ouvre mardi à 9\u00a0h');
});
