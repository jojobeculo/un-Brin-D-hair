import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeQuestions, recommend, estimate, suggestProducts, compatibility } from '../assets/js/lib/quiz-logic.js';
import { haircuts, couleurs } from '../src/data/haircuts.mjs';
import { allServices } from '../src/data/services.mjs';
import { product } from '../src/data/products.mjs';

const services = new Map(allServices.map((service) => [service.id, service]));
const LENGTH = { femme: ['courts', 'milongs', 'longs'], enfant: ['courts', 'milongs', 'longs'], homme: ['tres-courts', 'courts', 'milongs'] };

test('entre 5 et 10 questions selon le profil', () => {
  assert.equal(activeQuestions({ pour: 'femme' }).length, 9);
  assert.equal(activeQuestions({ pour: 'homme' }).length, 9);
  assert.equal(activeQuestions({ pour: 'enfant' }).length, 6);
});

test('le catalogue est large', () => {
  assert.ok(haircuts.femme.length >= 25);
  assert.ok(haircuts.homme.length >= 15);
  assert.ok(haircuts.enfant.length >= 10);
});

// Toutes les combinaisons de réponses femme : 3 coupes de familles différentes, jamais plus longues que les cheveux.
test('femme : 3 coupes cohérentes pour toutes les combinaisons', () => {
  let cases = 0;
  for (const longueur of LENGTH.femme) for (const nature of ['raides', 'ondules', 'boucles', 'frises']) for (const epaisseur of ['fins', 'moyens', 'epais'])
    for (const visage of ['ovale', 'rond', 'carre', 'long', 'coeur', 'inconnu']) for (const entretien of ['1', '2', '3']) for (const envie of ['garder', 'visible', 'radical'])
      for (const frange of ['oui', 'peut-etre', 'non']) {
        const answers = { pour: 'femme', longueur, nature, epaisseur, visage, entretien, envie, frange, couleur: 'naturelle' };
        const picks = recommend(answers, haircuts);
        assert.equal(picks.length, 3, JSON.stringify(answers));
        assert.equal(new Set(picks.map((pick) => pick.cut.family)).size, 3);
        picks.forEach((pick) => {
          assert.ok(LENGTH.femme.indexOf(pick.cut.length) <= LENGTH.femme.indexOf(longueur));
          assert.ok(pick.score >= 35 && pick.score <= 98);
        });
        assert.ok(picks[0].score >= picks[2].score);
        cases += 1;
      }
  assert.equal(cases, 5832);
});

test('cheveux bouclés : les coupes proposées respectent la boucle', () => {
  const picks = recommend({ pour: 'femme', longueur: 'longs', nature: 'boucles', epaisseur: 'epais', visage: 'ovale', entretien: '1', envie: 'garder', frange: 'non', couleur: 'naturelle' }, haircuts);
  picks.forEach((pick) => assert.ok(pick.cut.texture.boucles >= 0.6, pick.cut.name));
});

test('homme dégarni : les coupes proposées sont flatteuses', () => {
  const picks = recommend({ pour: 'homme', longueur: 'courts', nature: 'raides', epaisseur: 'fins', visage: 'rond', entretien: '1', envie: 'visible', style: 'classique', golfes: 'oui' }, haircuts);
  assert.equal(picks.length, 3);
  assert.ok(picks[0].cut.golfes >= 0.7);
});

test('enfant : coupe du bon genre', () => {
  const picks = recommend({ pour: 'enfant', kid: 'fille', longueur: 'longs', nature: 'raides', entretien: '1', envie: 'garder' }, haircuts);
  assert.ok(picks.length >= 2);
  picks.forEach((pick) => assert.equal(pick.cut.kid, 'fille'));
});

test('prix et durée viennent de la carte du salon', () => {
  const femme = estimate({ pour: 'femme', longueur: 'longs', epaisseur: 'epais', couleur: 'lumieres' }, services, couleurs);
  assert.equal(femme.items.map((item) => item.id).join(), 'balayage-lumieres-longs,opt-epais');
  assert.equal(femme.price, 'dès\u00a0160\u00a0€');
  assert.equal(femme.duration, '5\u00a0h');
  assert.equal(femme.diagnostic, true);
  const homme = estimate({ pour: 'homme' }, services, couleurs);
  assert.equal(homme.price, '25\u00a0€');
  assert.equal(estimate({ pour: 'enfant', kid: 'garcon' }, services, couleurs).price, '15\u00a0€');
});

test('produits conseillés : existants et adaptés', () => {
  const cut = haircuts.femme[0];
  const ids = suggestProducts({ pour: 'femme', nature: 'boucles', couleur: 'lumieres' }, cut);
  assert.deepEqual(ids, ['heart-of-glass-shampoo', 'love-curl-shampoo']);
  ids.forEach((id) => assert.ok(product(id)));
  assert.equal(compatibility(1.2), 98);
  assert.equal(compatibility(0.1), 35);
});
