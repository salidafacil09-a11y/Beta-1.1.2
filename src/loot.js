(function (G) {
  'use strict';

  // Menú de botín: lo que hay dentro de un mueble, un vehículo o un montón del suelo.
  // Tarjetas en dos columnas (icono, nombre y cantidad); tocar una la coge.
  // Las armas cuerpo a cuerpo, las cortas y la munición no tienen modelo en el suelo:
  // se ven aquí, con un icono sacado de su modelo 3D.

  const W = () => G.World, WP = () => G.Weapons;
  const CLOSE_DIST = 2.0;      // si te alejas más de esto, se cierra
  let src = null;              // { f } mueble · { c, it } montón
  let player = null;
  let at = null;               // dónde estabas al abrirlo
  let box = null, grid = null, title = null, onTake = null;
  let dirty = true;

  // ---------- Iconos (render del modelo a una imagen, una vez por objeto) ----------
  const icons = {};
  let ir = null, iscene = null, icam = null, imat = null;
  const IW = 132, IH = 92;
  function icon(id) {
    if (icons[id] !== undefined) return icons[id];
    let url = null;
    try {
      if (!ir) {
        const cv = document.createElement('canvas');
        cv.width = IW; cv.height = IH;
        ir = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, preserveDrawingBuffer: true });
        ir.setPixelRatio(1);
        ir.setSize(IW, IH, false);
        ir.outputEncoding = THREE.sRGBEncoding;
        ir.setClearColor(0x000000, 0);
        iscene = new THREE.Scene();
        iscene.add(new THREE.HemisphereLight(0xffffff, 0x5a5650, 0.95));
        const d = new THREE.DirectionalLight(0xffffff, 0.75);
        d.position.set(-1, 2, 3);
        iscene.add(d);
        icam = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
        imat = new THREE.MeshLambertMaterial({ vertexColors: true });
      }
      const geo = G.Models.weaponGeometry(id);
      const mesh = new THREE.Mesh(geo, imat);
      const w = WP().get(id), gun = WP().isGun(w), item = WP().isItem(id);
      // a lo largo (+Y del modelo) hacia la derecha y la parte de arriba (-Z) hacia arriba
      const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0));
      const q = new THREE.Quaternion().setFromRotationMatrix(m);
      // las cuerpo a cuerpo en diagonal, con algo de volumen
      const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.45, item ? 0.5 : 0.25, gun || item ? 0.06 : 0.62));
      mesh.quaternion.copy(tilt.multiply(q));
      mesh.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(mesh);
      const c = bb.getCenter(new THREE.Vector3()), s = bb.getSize(new THREE.Vector3());
      mesh.position.sub(c);
      const asp = IW / IH, pad = 1.18;
      const hh = Math.max(s.y, s.x / asp) * pad / 2;
      icam.left = -hh * asp; icam.right = hh * asp; icam.top = hh; icam.bottom = -hh;
      icam.updateProjectionMatrix();
      iscene.add(mesh);
      ir.render(iscene, icam);
      iscene.remove(mesh);
      url = ir.domElement.toDataURL('image/png');
    } catch (e) { url = null; }
    icons[id] = url;
    return url;
  }

  // ---------- Datos ----------
  // Los muebles guardan ids al generarse; al abrirlos por primera vez se decide el estado de cada cosa
  function normalize(list) {
    for (let i = 0; i < list.length; i++) {
      if (typeof list[i] === 'string') list[i] = { id: list[i], cond: W().itemCond(list[i], Math.random) };
    }
    return list;
  }
  function listOf(s) { return s.f ? s.f.cont.items : s.it.pile; }
  function nameOf(s) { return s.f ? s.f.cont.name : 'Montón'; }

  // ---------- Interfaz ----------
  function ensureDom() {
    if (box) return;
    box = document.getElementById('loot');
    if (!box) return;     // sin interfaz (pruebas)
    grid = box.querySelector('.loot-grid');
    title = box.querySelector('.loot-title');
    box.querySelector('.loot-x').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); close(true); });
    box.querySelector('.loot-all').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); takeAll(); });
    // 'click' y no 'pointerdown': así se puede desplazar la lista sin coger nada sin querer
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.loot-card');
      if (!card) return;
      e.preventDefault(); e.stopPropagation();
      take(+card.dataset.i);
    });
    // que tocar el menú no mueva la cámara ni dispare
    box.addEventListener('pointerdown', (e) => e.stopPropagation());
    window.addEventListener('keydown', (e) => {
      if (!src) return;
      if (e.code === 'Escape') { close(true); e.preventDefault(); }
    });
    document.addEventListener('pointerlockchange', () => {
      // al volver a capturar el ratón (clic en el juego) se cierra
      if (src && G.Input.pointerLocked) close(false);
    });
  }

  function sub(e) {
    const w = WP().get(e.id);
    if (WP().isItem(e.id)) return { txt: 'x' + e.cond, bar: null };
    if (WP().isGun(w)) return { txt: w.gun === 'bow' ? (e.cond ? 'con flecha' : '') : e.cond + '/' + w.mag, bar: null };
    return { txt: '', bar: Math.max(0, Math.min(1, e.cond)) };
  }

  function render() {
    dirty = false;
    if (!grid) return;
    const list = listOf(src);
    title.textContent = nameOf(src);
    box.querySelector('.loot-n').textContent = list.length ? list.length + (list.length === 1 ? ' objeto' : ' objetos') : 'Vacío';
    let html = '';
    list.forEach((e, i) => {
      const u = icon(e.id), s = sub(e);
      html += '<button type="button" class="loot-card" data-i="' + i + '">' +
        '<span class="loot-ic">' + (u ? '<img alt="" src="' + u + '">' : '<b>' + WP().nameOf(e.id).charAt(0) + '</b>') + '</span>' +
        '<span class="loot-tx"><span class="loot-nm">' + WP().nameOf(e.id) + '</span>' +
        (s.bar != null ? '<span class="loot-bar"><i style="width:' + Math.round(s.bar * 100) + '%"></i></span>' : '') +
        '</span>' + (s.txt ? '<span class="loot-ct">' + s.txt + '</span>' : '') + '</button>';
    });
    if (!list.length) html = '<div class="loot-empty">No queda nada</div>';
    grid.innerHTML = html;
    box.querySelector('.loot-all').classList.toggle('hidden', list.length < 2);
  }

  function open(s, pl) {
    ensureDom();
    if (s.f) normalize(s.f.cont.items);
    src = s; player = pl;
    at = { x: pl.pos.x, z: pl.pos.z, lv: pl.lv };
    if (box) box.classList.remove('hidden');
    render();
    // en PC se suelta el ratón para poder tocar las tarjetas (sin pausar el juego)
    if (!G.Input.isTouch && G.Input.pointerLocked && document.exitPointerLock) document.exitPointerLock();
  }

  function close(relock) {
    if (!src) return;
    src = null;
    if (box) box.classList.add('hidden');
    if (relock && !G.Input.isTouch && G.Input.enabled && G.Input.requestLock) G.Input.requestLock();
  }

  function afterChange() {
    const list = listOf(src);
    // un montón vacío desaparece
    if (src.it && !list.length) { W().removeItem(src.c, src.it); close(true); return; }
    render();
  }

  // Coger una cosa. Devuelve el mensaje
  function takeOne(i, noSwap) {
    const list = listOf(src), e = list[i];
    if (!e) return null;
    if (WP().isItem(e.id)) {
      list.splice(i, 1);
      return player.takeItem(e.id, e.cond);
    }
    const w = WP().get(e.id);
    if (noSwap && WP().isLong(w) && player.longCount() >= 2) return null;
    list.splice(i, 1);
    const r = player.pickUp(e.id, e.cond);
    let msg = 'Cogiste: ' + w.name;
    if (WP().isGun(w) && w.gun !== 'bow' && e.cond > 0) msg += ' (' + e.cond + ' en el cargador)';
    if (r.dropped) {
      // lo que no te cabe se queda en su lugar (dentro del mueble o en el montón)
      const d = r.dropped;
      if (src.it && WP().hasModel(d.id)) W().dropItem(player.pos.x, player.pos.z, d.id, d.cond, player.lv);
      else list.push({ id: d.id, cond: d.cond });
      msg += ' · dejaste ' + WP().get(d.id).name;
    }
    return msg;
  }

  function take(i) {
    if (!src) return;
    const m = takeOne(i, false);
    if (m && onTake) onTake(m);
    afterChange();
  }

  // Coge todo lo que quepa (sin cambiar armas largas si ya llevas dos)
  function takeAll() {
    if (!src) return;
    const list = listOf(src);
    let n = 0, skipped = 0;
    for (let i = 0; i < list.length;) {
      const before = list.length;
      const m = takeOne(i, true);
      if (m) n++;
      if (list.length === before) { i++; skipped++; }
    }
    if (onTake) onTake(n ? 'Cogiste ' + n + (n === 1 ? ' cosa' : ' cosas') + (skipped ? ' · no te caben más armas largas' : '') : 'No te caben más armas largas');
    afterChange();
  }

  // Cada fotograma: se cierra si te alejas, cambias de planta o mueres
  function update() {
    if (!src) return;
    if (!player || player.dead || player.lv !== at.lv || Math.hypot(player.pos.x - at.x, player.pos.z - at.z) > CLOSE_DIST) { close(false); return; }
    if (src.f && !src.f.cont) { close(false); return; }
    if (dirty) render();
  }

  G.Loot = {
    open, close, update, normalize, icon,
    get isOpen() { return !!src; },
    set onMessage(fn) { onTake = fn; },
    // para pruebas
    take, takeAll, get list() { return src ? listOf(src) : null; }
  };
})(window.Game = window.Game || {});
