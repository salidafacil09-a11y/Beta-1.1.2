(function (G) {
  'use strict';

  const DEBUG = location.search.indexOf('debug') !== -1;
  const LOW = G.Input.isTouch;            // móviles: sin antialias de fábrica (lo demás lo decide la calidad)
  const Q = G.Quality;
  const FOG = 0xaeb7b8;

  let renderer, scene, camera, player, sun, hemi;
  let state = 'menu';                     // menu | playing | paused | dead
  let last = 0, fpsAcc = 0, fpsN = 0;
  let target = null;
  let aimed = null;          // zombi resaltado con el contorno amarillo
  let kills = 0, survived = 0, deadT = 0;
  let baseFov = 60, scopedNow = false, scopeHint = false;
  let grabT = null;          // zombi que se puede agarrar por la espalda
  const el = (id) => document.getElementById(id);

  function fatal(msg) {
    el('start-msg').textContent = msg;
    el('btn-start').disabled = true;
  }

  function init() {
    if (typeof THREE === 'undefined') { fatal('No se pudo cargar Three.js. Revisa tu conexión y recarga la página.'); return; }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !LOW, powerPreference: 'high-performance' });
    } catch (e) { fatal('Tu navegador no admite WebGL, necesario para jugar.'); return; }
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = LOW ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    el('game').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(FOG).convertSRGBToLinear();
    scene.fog = new THREE.Fog(scene.background.getHex(), 16, 58);

    hemi = new THREE.HemisphereLight(0xd6e0e4, 0x4f4a3c, 0.62);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(0xfff1dc, 1.25);
    sun.castShadow = true;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.035;
    scene.add(sun);
    scene.add(sun.target);

    camera = new THREE.PerspectiveCamera(62, 1, 0.05, 95);
    G.Camera.init(camera);

    G.Input.init(renderer.domElement);
    G.World.init(scene, newSeed());
    G.World.reset(currentSeed);
    G.Population.init(scene);
    player = new G.Player(scene);
    refreshWorld(true, 0);

    G.Guns.init(scene);
    G.Guns.onMessage = toast;
    G.Loot.onMessage = (m) => toast(m, 'good');
    G.Combat.onMessage = toast;
    G.Guns.onHit = (res, crit) => G.Combat.onHit(res, crit);
    G.Combat.onHit = (res, crit) => {
      if (res === 'kill') kills++;
      const h = el('hitmark');
      h.className = 'on' + (crit ? ' crit' : '');
      clearTimeout(h._t);
      h._t = setTimeout(() => { h.className = ''; }, 140);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    applyQuality();
    Q.onChange((msg) => { applyQuality(); if (msg && state === 'playing') toast(msg); });
    setupQualityMenu();

    el('btn-start').addEventListener('click', start);
    el('btn-retry').addEventListener('click', retry);
    el('btn-resume').addEventListener('click', resume);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' && !(G.HudEdit && G.HudEdit.editing)) {
        if (state === 'menu') start();
        else if (state === 'dead') retry();
        else if (state === 'paused') resume();
      }
    });
    document.addEventListener('pointerlockchange', () => {
      // abrir un mueble suelta el ratón para poder tocar el menú: eso no pausa
      if (!G.Input.isTouch && state === 'playing' && !G.Input.pointerLocked && !G.Loot.isOpen) pause();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') pause(); });

    setupWeaponSlots();
    if (G.HudEdit) G.HudEdit.init();
    el('controls-pc').classList.toggle('hidden', G.Input.isTouch);
    el('controls-touch').classList.toggle('hidden', !G.Input.isTouch);
    if (DEBUG) el('debug').classList.remove('hidden');
    requestAnimationFrame(loop);
  }

  let currentSeed = 0;
  function newSeed() {
    const m = /[?&]seed=(-?\d+)/.exec(location.search);
    currentSeed = m ? parseInt(m[1], 10) : Math.floor(Math.random() * 1000000);
    return currentSeed;
  }

  function refreshWorld(immediate, dt) {
    G.World.update(player.pos.x, player.pos.z, immediate, dt);
    G.Population.update(player.pos.x, player.pos.z, dt);
  }

  // ---------- Calidad gráfica ----------
  function applyQuality() {
    const q = Q.cur;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pr));
    sun.castShadow = q.shadows;
    const S = q.shadowSize;
    const cam = sun.shadow.camera;
    if (cam.right !== S || sun.shadow.mapSize.x !== q.shadowMap) {
      cam.left = -S; cam.right = S; cam.top = S; cam.bottom = -S;
      cam.updateProjectionMatrix();
      sun.shadow.mapSize.set(q.shadowMap, q.shadowMap);
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    }
    scene.fog.near = q.fog[0]; scene.fog.far = q.fog[1];
    camera.far = q.far;
    resize();
    refreshQualityMenu();
  }

  function setupQualityMenu() {
    document.querySelectorAll('.qrow').forEach((row) => {
      row.querySelectorAll('button[data-level]').forEach((b) => {
        b.addEventListener('click', (e) => { e.preventDefault(); Q.set(b.dataset.level); });
      });
      const cb = row.querySelector('input[data-fps30]');
      if (cb) cb.addEventListener('change', () => Q.setFps30(cb.checked));
    });
    refreshQualityMenu();
  }
  function refreshQualityMenu() {
    document.querySelectorAll('.qrow').forEach((row) => {
      row.querySelectorAll('button[data-level]').forEach((b) => b.classList.toggle('on', b.dataset.level === Q.level));
      const cb = row.querySelector('input[data-fps30]');
      if (cb) cb.checked = Q.fps30;
      const now = row.querySelector('.qnow');
      if (now) now.textContent = Q.level === 'auto' ? '(ahora ' + Q.cur.name + ')' : '';
    });
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    baseFov = w < h ? 74 : 60;
    camera.fov = baseFov;
    camera.updateProjectionMatrix();
  }

  function tryFullscreen() {
    if (!G.Input.isTouch) return;
    const d = document.documentElement;
    const req = d.requestFullscreen || d.webkitRequestFullscreen;
    try {
      if (req) { const p = req.call(d); if (p && p.catch) p.catch(() => {}); }
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
    } catch (e) { /* no pasa nada */ }
  }

  function start() {
    if (state !== 'menu') return;
    tryFullscreen();
    el('start').classList.add('hidden');
    G.Input.enabled = true;
    G.Input.requestLock();
    state = 'playing';
    toast(G.Input.isTouch ? 'Busca un arma: registra los muebles (toca Registrar).' : 'Busca un arma: registra los muebles con E.');
  }

  function pause() {
    G.Loot.close(false);
    state = 'paused';
    G.Input.enabled = false;
    el('paused').classList.remove('hidden');
  }

  function resume() {
    if (state !== 'paused') return;
    el('paused').classList.add('hidden');
    G.Input.enabled = true;
    G.Input.clear();
    G.Input.requestLock();
    state = 'playing';
  }

  function retry() {
    aimed = null;
    G.Loot.close(false);
    G.Population.reset();
    G.World.reset(newSeed());
    player.reset();
    G.Combat.dragT = 0;
    G.Guns.reset();
    kills = 0; survived = 0; deadT = 0;
    G.Camera.yaw = Math.PI; G.Camera.pitch = 0.14;
    refreshWorld(true, 0);
    el('dead').classList.add('hidden');
    G.Input.enabled = true;
    G.Input.clear();
    G.Input.requestLock();
    state = 'playing';
  }

  // ---------- HUD ----------
  // Recuadros de armas: tocar = usar esa arma (o guardarla), tocar la munición = accesorio
  // (silenciador o mira), mantener pulsado = soltarla
  function setupWeaponSlots() {
    const bind = (id, n) => {
      const box = el(id);
      let timer = null, long = false;
      box.addEventListener('pointerdown', (e) => {
        if (state !== 'playing') return;
        e.preventDefault(); e.stopPropagation();
        long = false;
        if (e.target.classList.contains('wgrip')) {
          const longs = player.longIndices();
          const i = n === 3 ? player.cur : longs[n - 1];
          if (i != null && i === player.cur) G.Input.queue('grip');
          else G.Input.queue('slot' + n);
          return;
        }
        timer = setTimeout(() => {
          long = true;
          const longs = player.longIndices(), shorts = player.shortIndices();
          const i = n === 3 ? (shorts.indexOf(player.cur) >= 0 ? player.cur : null) : longs[n - 1];
          if (i != null && i === player.cur) G.Input.queue('drop');
        }, 600);
      });
      const up = (e) => {
        if (timer) { clearTimeout(timer); timer = null; if (!long && !e.target.classList.contains('wgrip')) G.Input.queue('slot' + n); }
      };
      box.addEventListener('pointerup', up);
      box.addEventListener('pointercancel', () => { if (timer) clearTimeout(timer); timer = null; });
    };
    bind('slot-a', 1); bind('slot-b', 2); bind('slot-c', 3);
  }

  const NOISE_TEXT = ['Sigilo', 'Caminando', 'Corriendo: te oyen', 'Agachado', 'Pecho a tierra', 'Oculto en la hierba'];
  let toastN = 0;
  function toast(text, kind) {
    const box = el('toasts');
    const d = document.createElement('div');
    d.className = 'toast ' + (kind || '');
    d.textContent = text;
    box.appendChild(d);
    toastN++;
    setTimeout(() => { d.classList.add('out'); }, 2600);
    setTimeout(() => { d.remove(); }, 3100);
    while (box.children.length > 3) box.firstChild.remove();
  }

  function updateHud() {
    el('hp-fill').style.width = Math.max(0, player.health) + '%';
    el('hp-fill').classList.toggle('low', player.health < 35);
    el('st-fill').style.width = Math.round(player.stamina * 100) + '%';
    el('st-fill').classList.toggle('low', player.stamina < 0.25);
    const n = el('noise');
    n.textContent = NOISE_TEXT[player.noiseLevel];
    n.className = 'n' + player.noiseLevel;
    const st = [];
    if (player.bleed > 0) st.push('Sangrando');
    if (player.sick) st.push('Fiebre');
    if (player.stamina < 0.25) st.push('Agotado');
    el('status').textContent = st.join(' · ');
    el('damage').style.opacity = Math.min(1, player.hurt * 2.2);

    // recuadros de armas: 1 y 2 = armas largas, el pequeño = cortas en los bolsillos
    const longs = player.longIndices(), shorts = player.shortIndices();
    ['slot-a', 'slot-b'].forEach((id, k) => {
      const box = el(id), i = longs[k];
      const s = i != null ? player.weapons[i] : null;
      const wd = s ? G.Weapons.get(s.id) : null;
      const gun = wd && G.Weapons.isGun(wd);
      const key = s ? s.id + '|' + s.two + '|' + (i === player.cur) + '|' + Math.round(s.cond * 20) + (gun ? '|' + s.mag + '|' + player.ammo[wd.ammo] : '') : 'vacío';
      if (box._key === key) return;
      box._key = key;
      box.classList.toggle('empty', !s);
      box.classList.toggle('on', !!s && i === player.cur);
      box.querySelector('.wname').textContent = s ? wd.name : 'Vacío';
      // armas de fuego: balas cargadas / de reserva en lugar del agarre
      const wg = box.querySelector('.wgrip');
      wg.textContent = s ? (gun ? s.mag + ' | ' + player.ammo[wd.ammo] : '') : '—';
      wg.classList.toggle('hidden', !!s && !gun);
      box.querySelector('.wcond i').style.width = s ? Math.round((gun ? s.mag / wd.mag : s.cond) * 100) + '%' : '0%';
    });
    const sm = el('slot-c');
    sm.classList.toggle('on', shorts.indexOf(player.cur) >= 0);
    sm.querySelector('.wcount').textContent = shorts.length;
    sm.title = player.cur >= 0 && shorts.indexOf(player.cur) >= 0 ? player.weapon.name : 'Armas cortas';

    const p = el('prompt');
    const use = el('btn-use');
    if (grabT && !target && state === 'playing') {
      p.innerHTML = '<b>Clic</b>Agarrar por la espalda';
      p.classList.remove('hidden');
      use.classList.add('hidden');
    } else if (target && state === 'playing') {
      p.innerHTML = '<b>E</b>' + target.label + (target.climbable && target.kind === 'window' ? ' &nbsp; <b>X</b>Saltar' : '');
      p.classList.remove('hidden');
      use.classList.remove('hidden');
      const lbl = use.querySelector('.lbl');
      if (lbl.textContent !== target.label) lbl.textContent = target.label;
    } else { p.classList.add('hidden'); use.classList.add('hidden'); }
    // munición y retícula de las armas de fuego
    const w = player.weapon, sl = player.slot, isGun = G.Weapons.isGun(w) && !!sl;
    const am = el('ammo');
    am.classList.toggle('hidden', !isGun);
    if (isGun) {
      const key = sl.mag + '|' + player.ammo[w.ammo] + '|' + w.id + '|' + (sl.sil || 0);
      if (am._key !== key) {
        am._key = key;
        el('ammo-mag').textContent = sl.mag;
        el('ammo-res').textContent = '/ ' + player.ammo[w.ammo];
        el('ammo-name').textContent = G.Weapons.AMMO[w.ammo].name + (sl.sil ? ' · silenciador ' + sl.sil : '');
        am.classList.toggle('empty', sl.mag === 0);
      }
    }
    const ch = el('crosshair');
    const gunAim = isGun && player.aiming;
    ch.classList.toggle('aim', player.aiming && !isGun);
    ch.classList.toggle('gun', gunAim);
    ch.classList.toggle('target', gunAim && !!aimed);
    if (gunAim) {
      const sp = G.Guns.spreadNow(player);
      const px = Math.round(Math.min(160, Math.tan(sp) / Math.tan(camera.fov * Math.PI / 360) * window.innerHeight / 2) * 2 + 8);
      if (ch._px !== px) { ch._px = px; ch.style.width = ch.style.height = px + 'px'; ch.style.margin = (-px / 2) + 'px 0 0 ' + (-px / 2) + 'px'; }
    } else if (ch._px) { ch._px = 0; ch.style.width = ch.style.height = ch.style.margin = ''; }
    el('btn-reload').classList.toggle('hidden', !(isGun && w.gun !== 'bow'));
    // atacar se convierte en agarrar si tienes a un zombi desprevenido de espaldas
    const ab = el('btn-attack');
    const grabbing = !!grabT && state === 'playing' && !player.aiming;
    if (ab._g !== grabbing) { ab._g = grabbing; ab.classList.toggle('grab', grabbing); ab.querySelector('.lbl').textContent = grabbing ? 'Agarrar' : ''; }
    el('cine').classList.toggle('on', !!(player.action && player.action.kind === 'finisher'));

    let chasing = 0;
    for (const z of G.Population.list) if (z.alive && (z.state === 'chase' || z.state === 'attack' || z.state === 'bang')) chasing++;
    el('chasers').textContent = chasing ? (chasing === 1 ? 'Te persigue 1 zombi' : 'Te persiguen ' + chasing + ' zombis') : '';
  }

  // ---------- Bucle ----------
  const prof = { logic: 0, zombies: 0, world: 0, render: 0, n: 0 };
  function loop(ts) {
    requestAnimationFrame(loop);
    // límite opcional de 30 fps (gasta menos batería y calienta menos)
    if (Q.fps30 && ts - last < 1000 / 30 - 3) return;
    const dt = Math.min(0.05, (ts - last) / 1000 || 0);
    last = ts;
    let tA = DEBUG ? performance.now() : 0, tB = tA;

    if (state === 'playing') {
      survived += dt;
      G.Input.update(dt);
      if (G.Input.pause) { pause(); }
      const zombies = G.Population.list;
      const camYaw = Math.atan2(G.Camera.forward().x, G.Camera.forward().z);
      if (!player.dead) {
        G.Combat.handleInput(player, G.Input, zombies, camYaw);
        // con el rifle apuntando, la rueda (o el 2.º toque de Apuntar) pone o quita la mira
        const scopeOk = !!player.weapon.scope && player.aiming;
        if (G.Input.cycle) {
          if (scopeOk && !G.Input.isTouch) player.scope = !player.scope;
          else { const m = player.cycleWeapon(); if (m) toast(m); }
        }
        if (G.Input.scope && scopeOk) player.scope = true;
        for (const n of [1, 2, 3]) if (G.Input['slot' + n]) { const m = player.selectSlot(n); if (m) toast(m); }
        if (G.Input.grip) { const m = player.toggleGrip(); if (m) toast(m); }
        if (G.Input.drop) {
          const s = player.dropCurrent();
          if (s) { G.World.dropLoot(player.pos.x + Math.sin(player.facing) * 0.5, player.pos.z + Math.cos(player.facing) * 0.5, s.id, s.cond, player.lv); toast('Soltaste: ' + G.Weapons.get(s.id).name); }
        }
        // con el menú de botín abierto, Usar (E) lo cierra
        if (G.Loot.isOpen) { target = null; if (G.Input.use) G.Loot.close(true); }
        else target = G.Interact.find(player, G.Camera.forward());
        if (G.Input.use && target) { const m = G.Interact.use(target, player); if (m) toast(m); target = null; }
        // Saltar: trepa si tienes delante una valla o una ventana abierta; si no, un saltito
        if (G.Input.jump) {
          if (target && target.climbable) { const m = G.Interact.climb(target, player); if (m) toast(m); target = null; }
          else player.jump();
        }
      } else target = null;
      // parón de impacto: unos instantes a cámara muy lenta al acertar un golpe
      const hs = G.Combat.hitStop > 0;
      if (hs) G.Combat.hitStop = Math.max(0, G.Combat.hitStop - dt);
      const gdt = hs ? dt * 0.12 : dt;
      player.update(gdt, G.Input, G.Camera);
      // contorno amarillo: al apuntar (en móvil, cuando hay un zombi a tu alcance delante)
      let tgt = null;
      const gun = G.Weapons.isGun(player.weapon);
      if (!player.dead && gun) {
        if (player.aiming) tgt = G.Guns.rayTarget(player, zombies);
      } else if (!player.dead && (player.aiming || G.Input.isTouch)) {
        tgt = G.Combat.pickTarget(player, zombies, camYaw, player.aiming ? 1.2 : 0.4);
      }
      grabT = player.dead ? null : G.Combat.grabTarget(player, zombies);
      if (grabT && !tgt) tgt = grabT;
      if (tgt !== aimed) {
        if (aimed) G.Models.setOutline(aimed.model, false);
        if (tgt) G.Models.setOutline(tgt.model, true);
        aimed = tgt;
      }
      G.Combat.update(gdt, player, zombies);
      G.Loot.update();
      G.Guns.update(gdt, player, zombies);
      if (DEBUG) { tB = performance.now(); prof.logic += tB - tA; tA = tB; }
      for (let i = 0; i < zombies.length; i++) zombies[i].update(gdt, player, zombies, G.Combat);
      if (DEBUG) { tB = performance.now(); prof.zombies += tB - tA; tA = tB; }
      refreshWorld(false, dt);
      if (DEBUG) { tB = performance.now(); prof.world += tB - tA; tA = tB; }
      Q.sample(dt);
      if (player.dead) {
        deadT += dt;
        if (deadT > 2.2) die();
      }
    } else if (state === 'menu' || state === 'dead' || state === 'paused') {
      if (G.Input.padConfirm() && !(G.HudEdit && G.HudEdit.editing)) { if (state === 'menu') start(); else if (state === 'dead') retry(); else resume(); }
      if (state === 'menu') {
        // la cámara gira lentamente alrededor de la casa en el menú
        G.Camera.yaw += dt * 0.08;
      }
    }

    player.apply(state === 'playing' && G.Combat.hitStop > 0 ? dt * 0.12 : dt);
    // zoom al apuntar con armas de fuego; con el rifle, mira telescópica
    const wpn = player.weapon;
    // la mira telescópica solo aparece si la pides (2.º toque de Apuntar, V, rueda o LB)
    const scoped = state === 'playing' && wpn.scope && player.aiming && player.scope && player.gun.aim > 0.85 && !player.dead;
    G.Input.scopeable = !!wpn.scope && player.aiming;
    G.Input.scoped = !!player.scope;
    if (G.Input.scopeable && !scopeHint && state === 'playing') {
      scopeHint = true;
      toast(G.Input.isTouch ? 'Toca otra vez Apuntar para mirar por la mira' : 'Rueda o V: mirar por la mira telescópica');
    }
    el('btn-aim').classList.toggle('scope', !!scoped);
    const fovT = baseFov * (scoped ? 0.36 : (G.Weapons.isGun(wpn) ? 1 - 0.12 * player.gun.aim : 1));
    if (Math.abs(camera.fov - fovT) > 0.05) {
      camera.fov += (fovT - camera.fov) * Math.min(1, dt * (scoped ? 14 : 9));
      camera.updateProjectionMatrix();
    }
    el('scope').classList.toggle('hidden', !scoped);
    scopedNow = scoped;
    G.Camera.update(dt, player, state === 'playing' ? G.Input : { look: { x: 0, y: 0 } });
    player.model.root.visible = (!G.Camera.near && !scopedNow) || player.dead;

    // el sol sigue al jugador (en pasos para que la sombra no tiemble)
    const sx = Math.round(player.pos.x), sz = Math.round(player.pos.z);
    sun.position.set(sx - 16, 32, sz + 11);
    sun.target.position.set(sx, 0, sz);

    updateHud();
    if (DEBUG) tA = performance.now();
    renderer.render(scene, camera);
    if (DEBUG) { prof.render += performance.now() - tA; prof.n++; }

    if (DEBUG && dt > 0) {
      fpsAcc += dt; fpsN++;
      if (fpsAcc > 0.5) {
        const st = G.World.stats();
        const n = Math.max(1, prof.n), f = (v) => (v / n).toFixed(1);
        el('debug').textContent = Math.round(fpsN / fpsAcc) + ' fps · ' + renderer.info.render.calls + ' draws · ' +
          Math.round(renderer.info.render.triangles / 1000) + 'k tris · ' + st.built + '/' + st.generated + ' chunks · ' +
          G.Population.alive() + ' zombis\nms/fotograma: lógica ' + f(prof.logic) + ' · zombis ' + f(prof.zombies) + ' · mundo ' + f(prof.world) +
          ' · dibujo ' + f(prof.render) + ' · calidad ' + Q.cur.name + (Q.level === 'auto' ? ' (auto)' : '') + (Q.fps30 ? ' · 30 fps' : '') + ' · semilla ' + st.seed;
        fpsAcc = 0; fpsN = 0;
        prof.logic = prof.zombies = prof.world = prof.render = 0; prof.n = 0;
      }
    }
  }

  function die() {
    state = 'dead';
    G.Input.enabled = false;
    if (document.exitPointerLock) document.exitPointerLock();
    const m = Math.floor(survived / 60), s = Math.floor(survived % 60);
    el('dead-cause').textContent = player.deathCause;
    el('dead-stats').textContent = 'Sobreviviste ' + m + ' min ' + s + ' s · Zombis eliminados: ' + kills;
    el('dead').classList.remove('hidden');
  }

  // Para pruebas automáticas
  G.debug = {
    get player() { return player; }, get camera() { return camera; }, get renderer() { return renderer; },
    get scene() { return scene; }, get state() { return state; },
    start, retry, toast, refresh: () => refreshWorld(true, 0),
    // congela al jugador en un momento de una animación (para revisar poses)
    // congela el juego tal cual (para capturas)
    hold() { state = 'frozen'; },
    freeze(kind, t, weapon) {
      if (weapon) { player.weapons = []; player.pickUp(weapon, 1); }
      player.action = kind ? { kind, t, dur: 1, done: true, weapon: player.weapon } : null;
      state = 'frozen';
    },
    tp(x, z, yaw, pitch, lv) {
      player.pos.x = x; player.pos.z = z; player.lv = lv || 0; player.y = G.World.groundY(x, z, player.lv);
      if (yaw != null) G.Camera.yaw = yaw;
      if (pitch != null) G.Camera.pitch = pitch;
      G.Camera.dist = 0.1;
      refreshWorld(true, 0);
    }
  };

  window.addEventListener('DOMContentLoaded', init);
})(window.Game = window.Game || {});
