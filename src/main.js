// Spatial Audio Volume — frontend.
// pos ∈ [-1, +1]: -1 = listener leans toward LEFT slot, +1 = toward RIGHT slot.
// State holds two slot-PIDs + the full session list polled from Rust.
// Click an app bubble to "arm" its slot, then click any stack chip to swap.

const W = 420;
const cx = W / 2;
const trackY = 150;
const HEAD_TRAVEL = 87;       // pos=±1 puts head edge against app's near edge
const STEP = 0.04;
const DRAG_PIXELS_PER_UNIT = 87;
const POLL_MS = 2000;

const APP1_X = cx - 120;
const APP2_X = cx + 120;
const APP_R = 22;

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const svg = $('field');
const statusEl = $('status');
const stackEl = $('stack');
const stackHint = $('stack-hint');
const head = $('head');
const headEllipse = $('head-ellipse');
const headLabel = $('head-label');

// Mini-mode elements (may stay hidden but always present in the DOM).
const miniBar = $('mini-bar');
const miniSvg = $('mini-field');
const miniHead = $('mini-head');
const miniHeadEllipse = $('mini-head-ellipse');
const miniEnterBtn = $('mini-enter-btn');
const miniExitBtn = $('mini-exit-btn');

const MINI_KEY = 'sav:mini';

// ── application state ────────────────────────────────────────────────
const state = {
  sessions: [],           // [{ pid, process_name, volume, muted }]
  leftPid: null,
  rightPid: null,
  armed: null,            // 'left' | 'right' | null
  pos: 0,
};

// Force next push regardless of dedupe (slot changes need to re-apply).
let lastSent = { leftPid: null, leftVol: -1, rightPid: null, rightVol: -1 };

// ── decoration: grid dots, generated once ────────────────────────────
(function buildGridDots() {
  const g = $('grid-dots');
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 14; i++) {
    for (let j = 0; j < 10; j++) {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', 20 + i * 30);
      c.setAttribute('cy', 16 + j * 30);
      c.setAttribute('r', 1);
      c.setAttribute('fill', '#e8e6e0');
      g.appendChild(c);
    }
  }
})();

// ── helpers ──────────────────────────────────────────────────────────
const findSession = (pid) => state.sessions.find(s => s.pid === pid) || null;

function displayName(processName) {
  if (!processName) return '?';
  let n = processName.replace(/\.exe$/i, '');
  // Trim parens like "(system sounds)"
  n = n.replace(/^\(/, '').replace(/\)$/, '');
  if (n.length > 10) n = n.slice(0, 9) + '…';
  return n;
}

const invoke = () => window.__TAURI__?.core?.invoke;

// ── volume push ──────────────────────────────────────────────────────
async function pushVolumes(v1, v2) {
  const inv = invoke();
  if (!inv) return;

  // Push left slot
  if (state.leftPid !== null &&
      (state.leftPid !== lastSent.leftPid || v1 !== lastSent.leftVol)) {
    try { await inv('set_volume_for_pid', { pid: state.leftPid, volume: v1 / 100 }); }
    catch (e) { console.warn(`set_volume_for_pid(${state.leftPid}) failed:`, e); }
    lastSent.leftPid = state.leftPid;
    lastSent.leftVol = v1;
  }

  // Push right slot
  if (state.rightPid !== null &&
      (state.rightPid !== lastSent.rightPid || v2 !== lastSent.rightVol)) {
    try { await inv('set_volume_for_pid', { pid: state.rightPid, volume: v2 / 100 }); }
    catch (e) { console.warn(`set_volume_for_pid(${state.rightPid}) failed:`, e); }
    lastSent.rightPid = state.rightPid;
    lastSent.rightVol = v2;
  }
}

// ── render: field (head + bubbles + numbers) ─────────────────────────
function renderField() {
  const headX = cx + state.pos * HEAD_TRAVEL;

  // pos=-1 → left 100%, right 0%; pos=+1 → swap.
  const vol1 = Math.round(50 - state.pos * 50);
  const vol2 = Math.round(50 + state.pos * 50);

  headEllipse.setAttribute('cx', headX);
  headLabel.setAttribute('x', headX);
  head.setAttribute('aria-valuenow', Math.round(state.pos * 100));

  $('vol-1').textContent = `${vol1}%`;
  $('vol-2').textContent = `${vol2}%`;

  const left = findSession(state.leftPid);
  const right = findSession(state.rightPid);
  $('label-1').textContent = left ? displayName(left.process_name) : '—';
  $('label-2').textContent = right ? displayName(right.process_name) : '—';
  $('app-1').setAttribute('aria-label', left ? `${left.process_name}, ${vol1}%` : 'left slot, empty');
  $('app-2').setAttribute('aria-label', right ? `${right.process_name}, ${vol2}%` : 'right slot, empty');

  // Empty slots get muted styling: grey stroke, no badge text.
  $('bubble-1').setAttribute('stroke', left ? '#c0392b' : '#c8c5bd');
  $('label-1').setAttribute('fill', left ? '#c0392b' : '#bbb');
  $('badge-1').setAttribute('opacity', left ? 0.9 : 0.25);
  $('bubble-2').setAttribute('stroke', right ? '#27ae60' : '#c8c5bd');
  $('label-2').setAttribute('fill', right ? '#27ae60' : '#bbb');
  $('badge-2').setAttribute('opacity', right ? 0.9 : 0.25);

  // Distance lines between head edge and each app's near edge
  $('dist-line-1').setAttribute('x1', APP1_X + APP_R);
  $('dist-line-1').setAttribute('y1', trackY);
  $('dist-line-1').setAttribute('x2', headX - 12);
  $('dist-line-1').setAttribute('y2', trackY);
  $('dist-line-2').setAttribute('x1', headX + 12);
  $('dist-line-2').setAttribute('y1', trackY);
  $('dist-line-2').setAttribute('x2', APP2_X - APP_R);
  $('dist-line-2').setAttribute('y2', trackY);

  // Mirror to the mini bar (always update; CSS hides it when off).
  // Mini SVG viewBox is 240×40, track runs x=20..220, midpoint at 120, travel=100.
  const miniHeadX = 120 + state.pos * 100;
  miniHeadEllipse.setAttribute('cx', miniHeadX);
  miniHead.setAttribute('aria-valuenow', Math.round(state.pos * 100));
  $('mini-dist-1').setAttribute('x2', miniHeadX - 8);
  $('mini-dist-2').setAttribute('x1', miniHeadX + 8);
  $('mini-vol-1').textContent = `${vol1}%`;
  $('mini-vol-2').textContent = `${vol2}%`;
  $('mini-label-1').textContent = left ? displayName(left.process_name) : '—';
  $('mini-label-2').textContent = right ? displayName(right.process_name) : '—';

  // armed visual
  $('app-1').classList.toggle('armed', state.armed === 'left');
  $('app-2').classList.toggle('armed', state.armed === 'right');

  // status text
  if (!left && !right) statusEl.textContent = 'no apps assigned';
  else if (state.pos === 0) statusEl.textContent = `${left ? displayName(left.process_name) : '—'} 50% · ${right ? displayName(right.process_name) : '—'} 50%`;
  else statusEl.textContent = `${left ? displayName(left.process_name) : '—'} ${vol1}% · ${right ? displayName(right.process_name) : '—'} ${vol2}%`;

  pushVolumes(vol1, vol2);
}

// ── render: stack ────────────────────────────────────────────────────
function renderStack() {
  stackEl.innerHTML = '';
  const inUse = new Set([state.leftPid, state.rightPid].filter(Boolean));
  const others = state.sessions.filter(s => !inUse.has(s.pid));

  if (state.armed) {
    stackHint.textContent = `replace ${state.armed === 'left' ? 'left' : 'right'} slot — pick one ↓`;
  } else {
    stackHint.textContent = 'click a bubble, then click here to swap';
  }

  if (others.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'stack-empty';
    empty.textContent = state.sessions.length === 0
      ? '(no audio sessions detected — start playing audio in an app)'
      : '(no other audio sources)';
    stackEl.appendChild(empty);
    return;
  }

  for (const s of others) {
    const btn = document.createElement('button');
    btn.className = 'stack-item' + (state.armed ? ' target' : '');
    btn.dataset.pid = s.pid;
    btn.title = `${s.process_name} · pid ${s.pid} · vol ${(s.volume * 100).toFixed(0)}%`;
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = colorFor(s.pid);
    btn.appendChild(dot);
    const txt = document.createElement('span');
    txt.textContent = displayName(s.process_name);
    btn.appendChild(txt);
    btn.addEventListener('click', () => onStackClick(s.pid));
    stackEl.appendChild(btn);
  }
}

// stable color from a pid for the stack dot
function colorFor(pid) {
  const palette = ['#2471a3', '#8e44ad', '#d35400', '#16a085', '#7f8c8d', '#c0392b', '#27ae60'];
  return palette[pid % palette.length];
}

// ── slot reconciliation ──────────────────────────────────────────────
function reconcileSlots() {
  // drop slots whose session is gone
  if (state.leftPid !== null && !findSession(state.leftPid)) state.leftPid = null;
  if (state.rightPid !== null && !findSession(state.rightPid)) state.rightPid = null;
  // auto-fill empties with available sessions
  const taken = () => new Set([state.leftPid, state.rightPid].filter(Boolean));
  const free = () => state.sessions.filter(s => !taken().has(s.pid));
  if (state.leftPid === null && free().length) state.leftPid = free()[0].pid;
  if (state.rightPid === null && free().length) state.rightPid = free()[0].pid;
}

// ── polling ──────────────────────────────────────────────────────────
async function refreshSessions() {
  const inv = invoke();
  if (!inv) return;
  try {
    const sessions = await inv('list_audio_sessions');
    // hide system-sounds (pid=0) — not user-controllable here
    state.sessions = sessions.filter(s => s.pid !== 0);
    reconcileSlots();
    renderField();
    renderStack();
  } catch (e) {
    console.warn('list_audio_sessions failed:', e);
  }
}

// ── interaction: arm + swap ──────────────────────────────────────────
function onAppClick(slot) {
  // Toggle: clicking armed slot disarms it.
  state.armed = state.armed === slot ? null : slot;
  renderField();
  renderStack();
}

function onStackClick(pid) {
  // If no slot armed, default to left (most-natural single-action: pick into "first" slot).
  const target = state.armed ?? 'left';
  // If the picked pid is already in the OTHER slot, swap them instead of stealing.
  if (target === 'left' && pid === state.rightPid) {
    state.rightPid = state.leftPid;
  } else if (target === 'right' && pid === state.leftPid) {
    state.leftPid = state.rightPid;
  }
  if (target === 'left') state.leftPid = pid;
  else state.rightPid = pid;
  state.armed = null;
  renderField();
  renderStack();
}

$('app-1').addEventListener('click', (e) => {
  // Don't arm via the click that ended a head drag — guarded by checking dragging
  if (justFinishedDrag) return;
  e.stopPropagation();
  onAppClick('left');
});
$('app-2').addEventListener('click', (e) => {
  if (justFinishedDrag) return;
  e.stopPropagation();
  onAppClick('right');
});

// click on empty space disarms
svg.addEventListener('click', (e) => {
  if (e.target.closest('#app-1') || e.target.closest('#app-2')) return;
  if (state.armed !== null) {
    state.armed = null;
    renderField();
    renderStack();
  }
});

// ── pos control ──────────────────────────────────────────────────────
function setPos(next) {
  state.pos = Math.max(-1, Math.min(1, next));
  renderField();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  { setPos(state.pos - STEP); e.preventDefault(); }
  if (e.key === 'ArrowRight') { setPos(state.pos + STEP); e.preventDefault(); }
  if (e.key === 'Home' || e.key === '0') { setPos(0); e.preventDefault(); }
  if (e.key === 'Escape' && state.armed !== null) {
    state.armed = null;
    renderField();
    renderStack();
  }
});

// ── drag (mouse + touch) on the head ─────────────────────────────────
let dragging = null;
let justFinishedDrag = false;
const clientX = (e) => e.clientX ?? e.touches?.[0]?.clientX ?? 0;

head.addEventListener('mousedown', (e) => startDrag(e, head, svg, DRAG_PIXELS_PER_UNIT));
head.addEventListener('touchstart', (e) => startDrag(e, head, svg, DRAG_PIXELS_PER_UNIT), { passive: false });

// Mini head shares state.pos with the main head. Mini SVG viewBox is 240
// wide with usable travel = 100 (track 20→220, head clamped to ±100 from
// center). Pixels-per-unit at viewBox resolution is therefore 100 — once
// scaled by svgW/240 in onPointerMove this becomes the on-screen pixel rate.
const MINI_DRAG_PIXELS_PER_UNIT = 100;
const MINI_VBW = 240;
miniHead.addEventListener('mousedown', (e) => startDrag(e, miniHead, miniSvg, MINI_DRAG_PIXELS_PER_UNIT, MINI_VBW));
miniHead.addEventListener('touchstart', (e) => startDrag(e, miniHead, miniSvg, MINI_DRAG_PIXELS_PER_UNIT, MINI_VBW), { passive: false });

function startDrag(e, headEl, svgEl, pxPerUnit, vbWidth) {
  e.preventDefault();
  e.stopPropagation();
  dragging = {
    startClientX: clientX(e),
    startPos: state.pos,
    moved: false,
    headEl,
    svgEl,
    pxPerUnit,
    vbWidth: vbWidth ?? W,
  };
  headEl.classList.add('dragging');
}

function onPointerMove(e) {
  if (!dragging) return;
  const dx = clientX(e) - dragging.startClientX;
  if (Math.abs(dx) > 2) dragging.moved = true;
  const svgW = dragging.svgEl.getBoundingClientRect().width || dragging.vbWidth;
  const scale = dragging.vbWidth / svgW;
  setPos(dragging.startPos + (dx * scale) / dragging.pxPerUnit);
}

function onPointerUp() {
  if (!dragging) return;
  dragging.headEl.classList.remove('dragging');
  if (dragging.moved) {
    justFinishedDrag = true;
    setTimeout(() => { justFinishedDrag = false; }, 50);
  }
  dragging = null;
}

window.addEventListener('mousemove', onPointerMove);
window.addEventListener('touchmove', onPointerMove, { passive: false });
window.addEventListener('mouseup', onPointerUp);
window.addEventListener('mouseleave', onPointerUp);
window.addEventListener('touchend', onPointerUp);

svg.addEventListener('dblclick', () => setPos(0));
miniSvg.addEventListener('dblclick', (e) => {
  // Avoid the exit button area accidentally
  if (e.target.closest('#mini-exit-btn')) return;
  setPos(0);
});

// ── Modo Mini ────────────────────────────────────────────────────────
async function setMini(enabled) {
  const inv = invoke();
  if (inv) {
    try {
      await inv('set_mini_mode', { enabled });
    } catch (e) {
      console.warn('set_mini_mode failed:', e);
      return;
    }
  }
  document.body.classList.toggle('mini-on', enabled);
  localStorage.setItem(MINI_KEY, enabled ? '1' : '0');
  renderField();
}

miniEnterBtn.addEventListener('click', () => setMini(true));

// Hold-to-confirm exit (3s). Pointer events handle both mouse and touch.
let holdTimer = null;
let holdSuppressClickUntil = 0;

function cancelHold() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  miniExitBtn.classList.remove('holding');
}

miniExitBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  cancelHold();
  miniExitBtn.classList.add('holding');
  holdTimer = setTimeout(() => {
    holdTimer = null;
    miniExitBtn.classList.remove('holding');
    // Suppress the trailing click that would otherwise fire after pointerup,
    // so the re-shown #mini-enter-btn underneath doesn't get a phantom click.
    holdSuppressClickUntil = Date.now() + 400;
    setMini(false);
  }, 3000);
});
miniExitBtn.addEventListener('pointerup', cancelHold);
miniExitBtn.addEventListener('pointerleave', cancelHold);
miniExitBtn.addEventListener('pointercancel', cancelHold);
// Swallow the trailing click after a successful hold (ghost-click guard).
miniExitBtn.addEventListener('click', (e) => {
  if (Date.now() < holdSuppressClickUntil) {
    e.preventDefault();
    e.stopPropagation();
  }
});

// ── boot ─────────────────────────────────────────────────────────────
stage.focus();
renderField();
renderStack();
refreshSessions();
setInterval(refreshSessions, POLL_MS);

// Restore Mini state if persisted. Defer one tick so the initial render
// settles before we resize the window.
if (localStorage.getItem(MINI_KEY) === '1') {
  setTimeout(() => setMini(true), 0);
}
