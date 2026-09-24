'use strict';
const $ = selector => document.querySelector(selector);
const model = globalThis.AulaAzar;
const names = { ruby: 'Rubí', emerald: 'Esmeralda', orb: 'Esfera', star: 'Estrella', mask: 'Máscara' };
// Dibujos SVG originales, generados localmente. Ningún recurso del juego de referencia.
function symbol(kind) {
  const shapes = {
    ruby: '<path d="M12 27 27 13H73L88 27 50 88Z" fill="#f6268b" stroke="#ffbddb" stroke-width="3"/><path d="M12 27H88L50 39Z" fill="#ff8dbc"/><path d="M27 13 37 27 50 13 63 27 73 13" fill="#ffdbeb"/><path d="m37 27 13 61 13-61" fill="#b50e68"/><path d="M13 28 37 27 50 88" fill="#f8449e"/><path d="M27 17 20 25H34" fill="white"/>',
    emerald: '<path d="m29 12 40 0 20 23-9 40-30 16-30-16-9-40Z" fill="#17dabe" stroke="#a9fff2" stroke-width="3"/><path d="m29 12 7 20 30 0 3-20M11 35l25-3-16 43M89 35 66 32l14 43M50 91 36 67l30 0Z" fill="#069c99"/><path d="M36 32h30l8 21-8 14H36L26 53Z" fill="#68ffe0"/><path d="m29 16-11 19 18-3" fill="white"/>',
    orb: '<circle cx="50" cy="50" r="37" fill="#206aee" stroke="#9eeaff" stroke-width="3"/><path d="M21 52C20 20 55 10 73 28 44 18 31 43 37 67Z" fill="#6ed7ff"/><path d="M23 69C39 89 74 81 83 49 83 84 44 101 23 69" fill="#133991"/><ellipse cx="35" cy="29" rx="12" ry="6" transform="rotate(-35 35 29)" fill="#d9ffff"/><path d="m69 51 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#b5edff"/>',
    star: '<path d="m50 9 13 27 30 4-22 21 5 30-26-14-26 14 5-30L7 40l30-4Z" fill="#ffcb32" stroke="#fff1a6" stroke-width="3"/><path d="M50 9v44L7 40l30-4ZM50 53 76 91 71 61 93 40ZM50 53 24 91l26-14" fill="#e89417"/><path d="m37 37 9-18-1 21-22 2Z" fill="#fffbd3"/>',
    mask: '<path d="M14 30 29 9 46 30 64 8 84 29 91 52H9Z" fill="#c52fdf" stroke="#fac5ff" stroke-width="2"/><path d="M15 31 29 9l3 28M46 30 64 8l-2 29" fill="#ffd550"/><path d="M22 39q28-15 56 0v22L50 91 22 61Z" fill="#f9e8dd" stroke="#f4c850" stroke-width="2"/><path d="m26 47 18 4-10 10Zm48 0-18 4 10 10Z" fill="#54206b"/><path d="m50 51-5 17h10Z" fill="#d59aaa"/><path d="M36 72q14 6 28 0-14 19-28 0" fill="#bd245e"/><circle cx="29" cy="9" r="5" fill="#ffe17b"/><circle cx="64" cy="8" r="5" fill="#ffe17b"/>'
  };
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${names[kind]}">${shapes[kind]}</svg>`;
}
const fmt = n => n.toLocaleString('es-AR');
let balance = 2000, rounds = [], running = false, sequence = 0;
const maxRounds = 10;
const reels = $('#reels');
for (let c = 0; c < 5; c++) {
  const reel = document.createElement('div'); reel.className = 'reel';
  for (let r = 0; r < 3; r++) { const cell = document.createElement('div'); cell.className = 'cell'; cell.innerHTML = symbol(model.SYMBOLS[(c + r) % 5]); reel.append(cell); }
  reels.append(reel);
}
$('#paySymbols').innerHTML = model.SYMBOLS.map(symbol).join('');
// Melodía original de feria sintetizada con Web Audio. Solo comienza con un clic.
let audioContext, musicTimer, master, muted = true, beat = 0;
const melody = [72, 76, 79, 76, 74, 77, 81, 77, 71, 74, 79, 74, 72, 76, 79, 67, 69, 72, 76, 72, 67, 71, 74, 71];
function tone(midi, duration = .18, volume = .05, wave = 'triangle', offset = 0) {
  if (muted || !audioContext || audioContext.state !== 'running') return;
  const start = audioContext.currentTime + offset;
  const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
  oscillator.type = wave; oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
  gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(volume, start + .015); gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain); gain.connect(master); oscillator.start(start); oscillator.stop(start + duration + .02);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
function startMusic() {
  clearInterval(musicTimer);
  musicTimer = setInterval(() => {
    if (document.hidden || muted) return;
    tone(melody[beat % melody.length], .21, .035);
    if (beat % 3 === 0) tone([48, 53, 55, 48][Math.floor(beat / 6) % 4], .35, .025, 'sine');
    beat++;
  }, 250);
}
$('#sound').addEventListener('click', async () => {
  try {
    if (!audioContext) { audioContext = new (window.AudioContext || window.webkitAudioContext)(); master = audioContext.createGain(); master.gain.value = .65; master.connect(audioContext.destination); }
    muted = !muted;
    if (!muted) { await audioContext.resume(); startMusic(); } else { clearInterval(musicTimer); await audioContext.suspend(); }
    $('#sound').setAttribute('aria-pressed', String(!muted)); $('#sound').setAttribute('aria-label', muted ? 'Activar música y sonidos' : 'Silenciar música y sonidos');
    $('#sound span').textContent = muted ? 'Sonido apagado' : 'Sonido activado';
  } catch { muted = true; $('#status').textContent = 'Este navegador no pudo iniciar el audio. La demo funciona sin sonido.'; }
});
document.addEventListener('visibilitychange', () => { if (!audioContext) return; if (document.hidden) audioContext.suspend(); else if (!muted) audioContext.resume().catch(() => {}); });
function controls() {
  const ended = rounds.length >= maxRounds;
  $('#balance').textContent = fmt(balance); $('#counter').textContent = `${rounds.length} / ${maxRounds}`;
  $('#spin').disabled = running || ended || balance < Number($('#stake').value);
  $('#stake').disabled = $('#minus').disabled = $('#plus').disabled = running || ended;
  $('#restart').disabled = running;
}
function renderHistory() {
  $('#history').replaceChildren();
  if (!rounds.length) { $('#history').innerHTML = '<tr><td colspan="4">Todavía no hay rondas.</td></tr>'; return; }
  rounds.forEach((round, i) => {
    const row = document.createElement('tr');
    [i + 1, round.stake, round.payout, round.payout - round.stake].forEach((value, j) => { const cell = document.createElement('td'); cell.textContent = (j === 3 && value > 0 ? '+' : '') + fmt(value); if (j === 3) cell.className = value < 0 ? 'negative' : 'positive'; row.append(cell); });
    $('#history').prepend(row);
  });
}
function summary() {
  const used = rounds.reduce((sum, r) => sum + r.stake, 0), returned = rounds.reduce((sum, r) => sum + r.payout, 0);
  $('#summary').textContent = `En esta demostración: ${rounds.length} rondas, ${fmt(used)} fichas usadas, ${fmt(returned)} recibidas. Resultado neto: ${returned - used > 0 ? '+' : ''}${fmt(returned - used)}. Esta sesión corta no representa el promedio a largo plazo.`;
}
function showLesson() { summary(); $('#lesson').hidden = false; $('#lesson').focus({ preventScroll: true }); $('#lesson').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
$('#explain').addEventListener('click', () => { if ($('#lesson').hidden) showLesson(); else $('#lesson').hidden = true; });
$('#minus').addEventListener('click', () => { $('#stake').selectedIndex = Math.max(0, $('#stake').selectedIndex - 1); controls(); });
$('#plus').addEventListener('click', () => { $('#stake').selectedIndex = Math.min(2, $('#stake').selectedIndex + 1); controls(); });
$('#stake').addEventListener('change', controls);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
$('#spin').addEventListener('click', async () => {
  if (running || rounds.length >= maxRounds) return;
  const stake = Number($('#stake').value);
  if (balance < stake) { $('#status').textContent = 'La demostración no tiene suficientes fichas.'; controls(); return; }
  const result = model.round(balance, stake); // Calcular una sola vez; la animación no cambia el resultado.
  running = true; const run = ++sequence; controls(); $('#status').textContent = 'Una ronda independiente. La animación no cambia las probabilidades.';
  $('#balance').textContent = fmt(balance - stake); tone(48, .2, .06, 'sine');
  const columns = [...reels.children];
  columns.forEach(column => { column.classList.add('spinning'); [...column.children].forEach(cell => cell.classList.remove('winner')); });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  await wait(reduce ? 100 : 650);
  for (let c = 0; c < 5; c++) {
    if (run !== sequence) return;
    [...columns[c].children].forEach((cell, r) => cell.innerHTML = symbol(result.grid[c][r])); columns[c].classList.remove('spinning'); tone(60 + c * 2, .09, .035, 'sine'); await wait(reduce ? 0 : 110);
  }
  balance = result.balance; rounds.push({ stake, payout: result.payout });
  if (result.payout) { for (let c = 0; c < result.count; c++) columns[c].children[1].classList.add('winner'); [72, 76, 79].forEach((note, i) => tone(note, .23, .04, 'triangle', i * .12)); }
  const net = result.payout - stake;
  $('#status').textContent = `Recibidas: ${fmt(result.payout)} · Usadas: ${fmt(stake)} · Neto: ${net > 0 ? '+' : ''}${fmt(net)} fichas.`;
  running = false; renderHistory(); controls(); summary();
  if (rounds.length >= maxRounds) { $('#status').textContent += ' Fin de las 10 rondas: momento de analizar.'; showLesson(); }
});
$('#restart').addEventListener('click', () => {
  if (running) return;
  sequence++; balance = 2000; rounds = []; $('#lesson').hidden = true;
  reels.querySelectorAll('.winner').forEach(cell => cell.classList.remove('winner'));
  $('#status').textContent = 'Demostración reiniciada. Cada ronda sigue siendo independiente.'; renderHistory(); controls();
});
controls();
