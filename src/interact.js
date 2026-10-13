(function (G) {
  'use strict';

  // Busca con qué puede interactuar el jugador (puertas, ventanas, vallas, muebles,
  // montones y armas en el suelo) y ejecuta la acción.

  const U = G.Util;
  const REACH = 1.45;

  function label(t) {
    return t ? t.label : '';
  }

  function find(player, camF) {
    const W = G.World, E = W.E;
    if (player.dead || player.busy()) return null;
    const px = player.pos.x, pz = player.pos.z, lv = player.lv || 0;
    const look = Math.atan2(camF.x, camF.z);
    let best = null, bestScore = Infinity;
    const consider = (x, z, data, maxD) => {
      const d = Math.hypot(x - px, z - pz);
      if (d > (maxD || REACH)) return;
      const a = Math.abs(U.angleDiff(Math.atan2(x - px, z - pz), look));
      if (a > 1.25 && d > 0.75) return;
      const score = d + a * 0.7;
      if (score < bestScore) { bestScore = score; best = data; best.x = x; best.z = z; }
    };

    // Aristas cercanas
    const tx0 = Math.floor(px) - 2, tz0 = Math.floor(pz) - 2;
    for (let tz = tz0; tz <= tz0 + 4; tz++) {
      for (let tx = tx0; tx <= tx0 + 4; tx++) {
        for (const o of ['N', 'W']) {
          const e = o === 'N' ? W.eN(tx, tz, lv) : W.eW(tx, tz, lv);
          if (!e) continue;
          const ref = { o, x: tx, z: tz, lv };
          const mx = o === 'N' ? tx + 0.5 : tx, mz = o === 'N' ? tz : tz + 0.5;
          let lab = null, kind = null;
          if (e === E.DOOR) { lab = 'Abrir puerta'; kind = 'door'; }
          else if (e === E.DOOR_OPEN) { lab = 'Cerrar puerta'; kind = 'door'; }
          else if (e === E.WIN) { lab = 'Abrir ventana'; kind = 'window'; }
          else if (e === E.WIN_OPEN) { lab = 'Cerrar ventana'; kind = 'window'; }
          else if (e === E.WIN_BROKEN) { if (lv) continue; lab = 'Saltar por la ventana rota'; kind = 'climb'; }
          else if (e === E.FENCE) { lab = 'Saltar la valla'; kind = 'fence'; }
          if (!lab) continue;
          // climbable: se puede saltar con el botón Saltar (X en el teclado)
          // arriba no se salta por las ventanas
          consider(mx, mz, { kind, label: lab, ref, e, climbable: !lv && (e === E.WIN_OPEN || e === E.WIN_BROKEN || e === E.FENCE) }, kind === 'door' ? REACH + 0.1 : REACH);
        }
      }
    }

    // Muebles y vehículos: la primera vez se registran; después se abren al momento mientras quede algo
    for (const { f } of W.furnNear(px, pz, 1.5, lv)) {
      if (!f.cont || (f.cont.searched && !f.cont.items.length)) continue;
      const fp = G.Furniture.frontPoint(f);
      if (Math.hypot(fp.x - px, fp.z - pz) > 1.7) continue;
      if (!W.hasLOS(px, pz, fp.x, fp.z, lv)) continue;
      const qx = U.clamp(px, f.x0, f.x1), qz = U.clamp(pz, f.z0, f.z1);
      const nm = f.cont.name.charAt(0).toLowerCase() + f.cont.name.slice(1);
      if (!f.cont.searched) consider(qx, qz, { kind: 'search', label: 'Registrar ' + nm, f }, 1.5);
      else consider(qx, qz, { kind: 'open', label: 'Abrir ' + nm + ' (' + f.cont.items.length + ')', f }, 1.5);
    }

    // Cosas en el suelo: armas de fuego largas, flechas disparadas y montones
    for (const { c, it } of W.itemsNear(px, pz, 1.3, lv)) {
      if (!W.hasLOS(px, pz, it.x, it.z, lv)) continue;
      if (it.pile) { consider(it.x, it.z, { kind: 'pile', label: 'Revisar montón (' + it.pile.length + ')', c, it }, 1.3); continue; }
      const nm = G.Weapons.nameOf(it.id) + (G.Weapons.ammoOfItem(it.id) ? ' (' + it.cond + ')' : '');
      consider(it.x, it.z, { kind: 'item', label: 'Coger ' + nm, c, it }, 1.3);
    }
    return best;
  }

  // Devuelve un mensaje para mostrar (o null)
  function use(t, player) {
    const W = G.World, E = W.E;
    if (!t) return null;
    if (t.kind === 'door') {
      const e = W.edgeGet(t.ref);
      W.setEdge(t.ref, e === E.DOOR ? E.DOOR_OPEN : E.DOOR);
      W.emit(t.x, t.z, 3 * player.noiseMul, player.lv);
      return null;
    }
    if (t.kind === 'window') {
      W.setEdge(t.ref, W.edgeGet(t.ref) === E.WIN ? E.WIN_OPEN : E.WIN);
      W.emit(t.x, t.z, 2 * player.noiseMul, player.lv);
      return null;
    }
    if (t.kind === 'climb' || t.kind === 'fence') {
      if (!player.startClimb(t.ref, t.kind === 'fence' ? 'fence' : 'window')) return 'No hay sitio al otro lado';
      W.emit(t.x, t.z, 2.5 * player.noiseMul);
      return null;
    }
    if (t.kind === 'search') {
      player.startSearch(t.f);
      return null;
    }
    if (t.kind === 'open') { G.Loot.open({ f: t.f }, player); return null; }
    if (t.kind === 'pile') { G.Loot.open({ c: t.c, it: t.it }, player); return null; }
    if (t.kind === 'item' && G.Weapons.isItem(t.it.id)) {
      // munición y accesorios: a la mochila
      W.removeItem(t.c, t.it);
      return player.takeItem(t.it.id, t.it.cond);
    }
    if (t.kind === 'item') {
      W.removeItem(t.c, t.it);
      const r = player.pickUp(t.it.id, t.it.cond);
      if (r.dropped) W.dropLoot(player.pos.x, player.pos.z, r.dropped.id, r.dropped.cond, player.lv);
      const w = G.Weapons.get(t.it.id);
      let msg = 'Cogiste: ' + w.name;
      if (G.Weapons.isGun(w) && t.it.cond > 0) msg += w.gun === 'bow' ? ' (con una flecha puesta)' : ' (' + t.it.cond + ' en el cargador)';
      if (r.dropped) msg += ' (soltaste ' + G.Weapons.get(r.dropped.id).name + ')';
      return msg;
    }
    return null;
  }

  // Saltar por una ventana abierta o rota, o una valla
  function climb(t, player) {
    if (!t || !t.climbable) return null;
    if (!player.startClimb(t.ref, t.e === G.World.E.FENCE ? 'fence' : 'window')) return 'No hay sitio al otro lado';
    G.World.emit(t.x, t.z, 2.5 * player.noiseMul);
    return null;
  }

  // Termina de registrar un mueble: se abre el menú con lo que hay dentro
  function finishSearch(player, f) {
    if (!f || !f.cont) return null;
    f.cont.searched = true;
    G.Loot.normalize(f.cont.items);
    if (!f.cont.items.length) return 'No hay nada útil';
    G.Loot.open({ f }, player);
    return null;
  }

  G.Interact = { find, use, label, climb, finishSearch };
})(window.Game = window.Game || {});
