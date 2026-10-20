"""Dessine le plan du quartier du salon à partir des données OpenStreetMap.

Usage : python3 tools/plan.py [fichier.osm]
Sans fichier, les données sont téléchargées depuis api.openstreetmap.org.
Résultats :
- assets/img/plan-quartier.svg : fond de plan (bâtiments, espaces verts, rues) ;
- src/data/plan.json : couche animée (grandes rues, noms de rues, repères), dessinée par le site.
Données © les contributeurs d'OpenStreetMap, licence ODbL.
"""
import json
import math
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SALON = (45.751798, 3.109391)
WIDTH, HEIGHT = 800, 560          # en mètres : 1 unité = 1 m
BBOX = '3.1022,45.7475,3.1166,45.7561'
METERS_LAT = 111320
METERS_LON = 111320 * math.cos(math.radians(SALON[0]))

COLORS = {
    'ground': '#EDE4D8',
    'green': '#E2D7C5',
    'water': '#CDB89E',
    'building': '#E4D8C8',
    'casing': '#D5C4AE',
    'road': '#FBF8F4',
    'path': '#BFA78B',
}
ROADS = {  # largeur en mètres
    'primary': 14, 'secondary': 13, 'tertiary': 11,
    'residential': 8, 'living_street': 7, 'unclassified': 8, 'pedestrian': 6, 'service': 4,
}
MAIN = {'primary', 'secondary', 'tertiary'}
LABELS = ['Rue Champvoisin', 'Avenue Jean Noëllet', 'Avenue du Mont-Mouchet', 'Rue de Romagnat', 'Rue Pasteur', 'Rue de la République']


def project(lat, lon):
    x = (lon - SALON[1]) * METERS_LON + WIDTH / 2
    y = (SALON[0] - lat) * METERS_LAT + HEIGHT / 2
    return round(x), round(y)


def inside(points, margin=60):
    return any(-margin <= x <= WIDTH + margin and -margin <= y <= HEIGHT + margin for x, y in points)


def path(points, closed=False):
    d = 'M' + ' L'.join(f'{x:g} {y:g}' for x, y in points)
    return d + ('Z' if closed else '')


def main(source=None):
    if source:
        data = Path(source).read_bytes()
    else:
        url = f'https://api.openstreetmap.org/api/0.6/map?bbox={BBOX}'
        data = urllib.request.urlopen(url, timeout=120).read()
    root = ET.fromstring(data)
    nodes = {n.get('id'): project(float(n.get('lat')), float(n.get('lon'))) for n in root.iter('node')}
    tags = lambda e: {t.get('k'): t.get('v') for t in e.findall('tag')}

    layers = {'green': [], 'water': [], 'stream': [], 'building': [], 'casing': [], 'road': [], 'path': []}
    main_roads, named, pois = [], {}, []
    for way in root.iter('way'):
        t = tags(way)
        points = [nodes[r.get('ref')] for r in way.findall('nd') if r.get('ref') in nodes]
        if len(points) < 2 or not inside(points):
            continue
        closed = points[0] == points[-1]
        if t.get('building') and closed:
            if inside(points, margin=8):
                layers['building'].append(path(points, True))
        elif closed and (t.get('leisure') in ('park', 'garden', 'playground', 'pitch') or t.get('landuse') in ('grass', 'meadow', 'recreation_ground', 'cemetery', 'allotments', 'orchard', 'vineyard')):
            layers['green'].append(path(points, True))
        elif closed and t.get('natural') == 'water':
            layers['water'].append(path(points, True))
        elif t.get('waterway') in ('stream', 'river', 'canal'):
            layers['stream'].append(path(points))
        elif t.get('highway') in ROADS:
            width = ROADS[t['highway']]
            d = path(points)
            layers['casing'].append((d, width + 2))
            layers['road'].append((d, width))
            if t['highway'] in MAIN:
                main_roads.append(d)
            if t.get('name') in LABELS:
                named.setdefault(t['name'], []).append(points)
        elif t.get('highway') in ('footway', 'path', 'cycleway', 'steps'):
            layers['path'].append(path(points))
        if t.get('amenity') == 'parking' and t.get('parking') == 'street_side':
            cx = sum(p[0] for p in points) / len(points)
            cy = sum(p[1] for p in points) / len(points)
            pois.append({'kind': 'parking', 'x': round(cx), 'y': round(cy)})

    for node in root.iter('node'):
        t = tags(node)
        x, y = nodes[node.get('id')]
        if not (0 <= x <= WIDTH and 0 <= y <= HEIGHT):
            continue
        if t.get('highway') == 'bus_stop' and t.get('name') == 'Champvoisin':
            pois.append({'kind': 'bus', 'x': round(x), 'y': round(y), 'name': 'Arrêt Champvoisin'})
        elif t.get('amenity') == 'bicycle_parking' and math.dist((x, y), (WIDTH / 2, HEIGHT / 2)) < 160:
            pois.append({'kind': 'velo', 'x': round(x), 'y': round(y)})

    # Un seul repère par type, le plus proche du salon.
    nearest = {}
    for poi in pois:
        d = math.dist((poi['x'], poi['y']), (WIDTH / 2, HEIGHT / 2))
        if poi['kind'] not in nearest or d < nearest[poi['kind']][0]:
            nearest[poi['kind']] = (d, poi)
    pois = [dict(poi, distance=round(d)) for d, poi in nearest.values()]

    # Noms de rues : le plus long tronçon visible, écrit de gauche à droite.
    labels = []
    for name, ways in named.items():
        best = max(ways, key=lambda pts: sum(math.dist(a, b) for a, b in zip(pts, pts[1:]) if 30 < a[0] < WIDTH - 30 and 30 < a[1] < HEIGHT - 30))
        if best[0][0] > best[-1][0]:
            best = best[::-1]
        length = sum(math.dist(a, b) for a, b in zip(best, best[1:]))
        if length > 80:
            labels.append({'name': name, 'd': path(best), 'length': round(length)})

    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" preserveAspectRatio="xMidYMid slice">',
           f'<rect width="{WIDTH}" height="{HEIGHT}" fill="{COLORS["ground"]}"/>',
           f'<path fill="{COLORS["green"]}" d="{" ".join(layers["green"])}"/>',
           f'<path fill="{COLORS["water"]}" d="{" ".join(layers["water"])}"/>',
           f'<path fill="none" stroke="{COLORS["water"]}" stroke-width="4" stroke-linecap="round" d="{" ".join(layers["stream"])}"/>',
           f'<path fill="{COLORS["building"]}" d="{" ".join(layers["building"])}"/>',
           f'<path fill="none" stroke="{COLORS["path"]}" stroke-width="1.2" stroke-dasharray="3 3" d="{" ".join(layers["path"])}"/>']
    for key in ('casing', 'road'):
        by_width = {}
        for d, w in layers[key]:
            by_width.setdefault(w, []).append(d)
        for w, ds in sorted(by_width.items(), reverse=key == 'casing'):
            svg.append(f'<path fill="none" stroke="{COLORS[key]}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" d="{" ".join(ds)}"/>')
    svg.append('</svg>')
    (ROOT / 'assets' / 'img' / 'plan-quartier.svg').write_text('\n'.join(svg))

    overlay = {'width': WIDTH, 'height': HEIGHT, 'main': main_roads, 'labels': labels, 'pois': pois}
    (ROOT / 'src' / 'data' / 'plan.json').write_text(json.dumps(overlay, ensure_ascii=False))
    print(f'{len(layers["building"])} bâtiments, {len(layers["road"])} rues, {len(labels)} noms, repères : {[p["kind"] for p in pois]}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else None)
