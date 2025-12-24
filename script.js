// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => e.isIntersecting && e.target.classList.add("show"));
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Neon Reaction Game
const startBtn = document.getElementById("startBtn");
const box = document.getElementById("box");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");

let timerId = null;
let startTime = null;
let waiting = false;
let ready = false;

const bestKey = "neon_best_ms";
const bestSaved = Number(localStorage.getItem(bestKey));
bestEl.textContent = bestSaved ? `${bestSaved} ms` : "—";

function resetBox(text = "WAIT…") {
  box.classList.remove("ready");
  box.textContent = text;
  startTime = null;
  waiting = false;
  ready = false;
  if (timerId) clearTimeout(timerId);
  timerId = null;
}

startBtn.addEventListener("click", () => {
  resetBox("WAIT…");
  statusEl.textContent = "Waiting…";
  waiting = true;

  const delay = Math.floor(900 + Math.random() * 2200); // 0.9s - 3.1s
  timerId = setTimeout(() => {
    ready = true;
    waiting = false;
    startTime = performance.now();
    box.classList.add("ready");
    box.textContent = "CLICK!";
    statusEl.textContent = "GO!";
  }, delay);
});

box.addEventListener("click", () => {
  // false start
  if (waiting) {
    statusEl.textContent = "False start (-300ms)";
    timeEl.textContent = "—";
    resetBox("TOO SOON");
    return;
  }

  if (!ready) return;

  const ms = Math.max(0, Math.round(performance.now() - startTime));
  timeEl.textContent = `${ms} ms`;
  statusEl.textContent = "Nice.";

  const best = Number(localStorage.getItem(bestKey));
  if (!best || ms < best) {
    localStorage.setItem(bestKey, String(ms));
    bestEl.textContent = `${ms} ms`;
    statusEl.textContent = "NEW BEST 🔥";
  }

  ready = false;
  box.classList.remove("ready");
  box.textContent = "DONE";
});
