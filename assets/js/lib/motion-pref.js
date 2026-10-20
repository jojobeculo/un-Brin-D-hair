// Niveau d’animation choisi pour la page (attribut posé dans <head> par le gabarit) :
// 'full' (complet) ou 'calm' (doux : sans déplacements, quand le système demande moins d’animations).
export const calm = () => document.documentElement.dataset.motion === 'calm';
