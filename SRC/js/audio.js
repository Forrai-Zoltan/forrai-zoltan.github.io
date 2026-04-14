// --- AudioContext ---
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// --- Shared oscillator factory ---
function makeOsc(ctx, type = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.connect(gain);
  gain.connect(ctx.destination);
  return { osc, gain };
}

// --- Mute toggle ---
const btn = document.getElementById("toggleBtn");
let muted = localStorage.getItem("audioMuted") === "true";
btn.classList.toggle("muted", muted);

function toggleMute() {
  muted = !muted;
  localStorage.setItem("audioMuted", muted);
  btn.classList.toggle("muted", muted);
  playMuteClick(muted);
}

btn.addEventListener("click", toggleMute);
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName;
  const isTyping =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    document.activeElement.isContentEditable;
  if (e.key === "m" && !isTyping) toggleMute();
});

function playMuteClick(muting) {
  const ctx = getCtx();
  const root = 523.25;
  const major = [1, Math.pow(2, 4 / 12), Math.pow(2, 7 / 12)];

  major.forEach((ratio, i) => {
    const freq = root * ratio;
    const delay = i * 0.03;
    const peakGain = muting
      ? (0.1 - i * 0.05) / major.length
      : (0.1 - i * 0.02) / major.length;

    const { osc, gain } = makeOsc(ctx);
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(peakGain, ctx.currentTime + delay + 0.04);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + delay + 0.38
    );
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.42);
  });
}

// --- Reusable pop sound ---
export function playPop(rising = true) {
  if (localStorage.getItem("audioMuted") === "true") return;
  const ctx = getCtx();
  const { osc, gain } = makeOsc(ctx);
  osc.frequency.setValueAtTime(rising ? 600 : 440, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(
    rising ? 880 : 280,
    ctx.currentTime + 0.12
  );
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

// Rising tone on all .pop elements
document.querySelectorAll(".pop").forEach((el) => {
  el.addEventListener("click", () => playPop(true));
});

// All checkboxes get rising/falling tone
document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
  el.addEventListener("click", () => playPop(el.checked));
});

// --- Details shimmer ---
export function playDetails(opening = true) {
  if (localStorage.getItem("audioMuted") === "true") return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  const { osc: osc1, gain: g1 } = makeOsc(ctx);
  osc1.frequency.setValueAtTime(280, t);
  osc1.frequency.linearRampToValueAtTime(
    opening ? 200 : 200.2,
    t + (opening ? 0.2 : -0.2)
  );
  g1.gain.setValueAtTime(0.001, t);
  g1.gain.linearRampToValueAtTime(0.12, t + 0.03);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
  osc1.start(t);
  osc1.stop(t + 0.28);

  const { osc: osc2, gain: g2 } = makeOsc(ctx);
  osc2.frequency.setValueAtTime(340, t);
  osc2.frequency.linearRampToValueAtTime(opening ? 200 : 200.15, t + 0.15);
  g2.gain.setValueAtTime(0.001, t);
  g2.gain.linearRampToValueAtTime(0.05, t + 0.03);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  osc2.start(t);
  osc2.stop(t + 0.2);
}

// All <details> elements get the shimmer on toggle
document.querySelectorAll("details").forEach((el) => {
  el.addEventListener("toggle", () => playDetails(el.open));
});
