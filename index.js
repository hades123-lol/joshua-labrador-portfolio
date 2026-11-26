const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mouse = matchMedia("(hover: hover)").matches;
const isM = matchMedia("(max-width:760px)").matches; // mobile uses mobile.js; skip heavy desktop effects

/* ---------- Liquid glass: bends whatever is behind the edges of a pill (Chrome / Edge / Android).
   Other browsers keep the frosted blur from the CSS. Used by the desktop header and by mobile.js. ---------- */
function liquidGlass(el, id, blur = 0.6) {
  if (!el || !/Chrome\/\d/.test(navigator.userAgent)) return;
  const NS = "http://www.w3.org/2000/svg", host = document.createElementNS(NS, "svg");
  host.setAttribute("width", "0"); host.setAttribute("height", "0"); host.setAttribute("aria-hidden", "true"); host.style.position = "absolute";
  document.body.append(host);
  const only = (row) => [0, 1, 2].map((i) => (i === row ? [0, 1, 2, 3, 4].map((j) => (j === i ? 1 : 0)).join(" ") : "0 0 0 0 0")).join(" ") + " 0 0 0 1 0";
  const build = () => {
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    if (!w || !h) return;
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"), img = g.createImageData(w, h), r = h / 2, band = h * 0.46;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = x + 0.5 - w / 2, dy = y + 0.5 - h / 2, qx = Math.abs(dx) - (w / 2 - r), qy = Math.abs(dy) - (h / 2 - r);
      const depth = -(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r);
      const m = Math.pow(Math.max(0, Math.min(1, 1 - depth / band)), 2);
      let nx = 0, ny = 0;
      if (qx > 0) { const l = Math.hypot(qx, Math.max(qy, 0) || dy) || 1; nx = (Math.sign(dx) * qx) / l; ny = dy / l; } else ny = Math.sign(dy);
      const i = (y * w + x) * 4;
      img.data[i] = 128 - nx * m * 127; img.data[i + 1] = 128 - ny * m * 127; img.data[i + 2] = 128; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const bend = (n, scale) => `<feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="d${n}"/><feColorMatrix in="d${n}" type="matrix" values="${only(n)}" result="c${n}"/>`;
    host.innerHTML = `<filter id="${id}" x="0" y="0" width="${w}" height="${h}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feImage href="${c.toDataURL()}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>${bend(0, 48)}${bend(1, 44)}${bend(2, 40)}<feBlend in="c0" in2="c1" mode="screen" result="rg"/><feBlend in="rg" in2="c2" mode="screen"/></filter>`;
    el.style.backdropFilter = `url(#${id}) blur(${blur}px) saturate(1.5)`;
    el.classList.add("is-liquid");
  };
  new ResizeObserver(build).observe(el);
  build();
}

/* ---------- Intro: boot log, code rain + embers, fire-filled name, shutters split open ---------- */
(() => {
  const el = $("#intro");
  if (!el) return;
  if (!root.classList.contains("intro-on")) return el.remove();
  const cvs = $("#rain"), g = cvs.getContext("2d"), nameEl = $("#intro-name"), pct = $("#intro-pct"), bar = $(".intro-bar i"), log = $("#it-log"), shade = $(".it-shade");
  const TXT = "HADES", POOL = "ABDEFHKLNPRSTXZ0123456789#$", GL = "01{}<>/=+*;:#$%&[]()", FS = 18, DUR = 3000;
  const LOG = [[0, "> boot hades.sys"], [0.18, "> mount html css js ... ok"], [0.38, "> import react ... ok"], [0.56, "> load python, java ... ok"], [0.76, "> compile portfolio ... ok"], [0.97, "> access granted"]];
  nameEl.innerHTML = [...TXT].map((c) => `<span class="ch" data-ch="${c}">${c}</span>`).join("");
  const letters = $$(".ch", nameEl);
  let W, H, drops, embers, t0 = performance.now(), done = false, raf, line = 0, ring = 0, tick = 0;
  const ember = (anywhere) => ({ x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, v: 0.6 + Math.random() * 2.4, r: 0.6 + Math.random() * 1.6, s: Math.random() * 7 });
  function fit() {
    const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cvs.width = W * d; cvs.height = H * d; g.setTransform(d, 0, 0, d, 0, 0);
    g.font = `${FS - 4}px 'Geist Mono', monospace`; g.textAlign = "center";
    drops = Array.from({ length: Math.ceil(W / FS) }, () => -Math.random() * 30);
    embers = Array.from({ length: Math.min(110, Math.ceil(W / 11)) }, () => ember(true));
  }
  fit(); addEventListener("resize", fit);
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const finish = () => {
    el.classList.add("out"); root.classList.remove("intro");
    setTimeout(() => { cancelAnimationFrame(raf); removeEventListener("resize", fit); el.remove(); root.classList.remove("intro-on"); }, 1450);
  };
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const e = ease(Math.min((now - t0) / DUR, 1));
    // fade old trails without painting a solid background, so the shutters can open behind
    g.globalCompositeOperation = "destination-out"; g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "source-over"; g.fillStyle = `rgba(255,${110 + Math.round(e * 40)},70,.8)`;
    for (let i = 0; i < drops.length; i++) {
      const y = drops[i] * FS;
      g.fillText(GL[(Math.random() * GL.length) | 0], i * FS + FS / 2, y);
      drops[i] += 0.3 + (i % 4) * 0.12 + e * 0.7;
      if (y > H && Math.random() > 0.975) drops[i] = 0;
    }
    for (let i = 0; i < embers.length; i++) {
      const p = embers[i]; p.y -= p.v * (0.7 + e * 2); p.x += Math.sin(now / 400 + p.s) * 0.6;
      if (p.y < -10) embers[i] = ember(false);
      g.fillStyle = `rgba(255,${(60 + p.r * 35) | 0},35,${Math.max(0, p.y / H).toFixed(2)})`;
      g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill();
    }
    if (ring) { // shockwave when the name is complete
      const a = (now - ring) / 700;
      if (a < 1) { g.strokeStyle = `rgba(255,130,70,${1 - a})`; g.lineWidth = 2 + 14 * (1 - a); g.beginPath(); g.arc(W / 2, H / 2, a * Math.max(W, H) * 0.75, 0, 7); g.stroke(); }
    }
    // letters scramble, then slam in one after another
    const swap = ++tick % 4 === 0;
    letters.forEach((s, i) => {
      if (s.classList.contains("lock")) return;
      if (e >= 0.16 + i * 0.17) { s.textContent = s.dataset.ch = TXT[i]; s.classList.add("lock"); }
      else if (swap) s.textContent = s.dataset.ch = POOL[(Math.random() * POOL.length) | 0];
    });
    while (line < LOG.length && e >= LOG[line][0]) log.textContent += LOG[line++][1] + "\n";
    pct.textContent = Math.round(e * 100) + "%";
    for (const t of [bar, shade, ...letters]) t.style.setProperty("--p", e.toFixed(3));
    if (e >= 1 && !done) {
      done = true; ring = now; nameEl.classList.add("boom"); $("#it-state").textContent = "ready";
      setTimeout(finish, 800);
    }
  }
  raf = requestAnimationFrame(frame);
  const skip = () => { t0 -= DUR; };
  addEventListener("pointerdown", skip, { once: true }); addEventListener("keydown", skip, { once: true });
})();

$("#year").textContent = new Date().getFullYear();

// Tech strip: duplicate items so the loop has no gap
$$(".strip-track").forEach((t) => (t.innerHTML += t.innerHTML));

/* ---------- Letter-matrix background: base layer + brighter cursor glow layer ---------- */
const cv = $("#matrix"), cx = cv.getContext("2d"), gv = $("#glow"), gx = gv.getContext("2d");
const S = 26, R = 210, CH = "01{}<>/=+*;:#$%&[]()".split("");
let cols, rows, chars, base, flash, ink = [28, 30, 34], hot = [40, 70, 255], bg = "#ececee", dpr = 1, last = 0, halo = 0.2;
let mx = -999, my = -999, sx = -999, sy = -999, power = 0, inside = false;
const ripples = [], rc = () => CH[(Math.random() * CH.length) | 0], rgbOf = (s) => s.split(",").map(Number);
function matrixColor() {
  const cs = getComputedStyle(root);
  ink = rgbOf(cs.getPropertyValue("--matrix")); hot = rgbOf(cs.getPropertyValue("--hot")); bg = cs.getPropertyValue("--bg").trim() || bg; halo = parseFloat(cs.getPropertyValue("--halo")) || 0.2;
  if (chars) draw();
}
function size() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  for (const c of [cv, gv]) { c.width = innerWidth * dpr; c.height = innerHeight * dpr; }
  gx.textAlign = "center"; gx.textBaseline = "middle";
  cols = Math.ceil(innerWidth / S); rows = Math.ceil(innerHeight / S);
  const n = cols * rows;
  chars = Array.from({ length: n }, rc);
  base = Float32Array.from({ length: n }, () => 0.06 + Math.random() * 0.16);
  flash = new Float32Array(n);
  draw();
}
function draw() {
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cx.clearRect(0, 0, innerWidth, innerHeight);
  cx.font = "12px 'Geist Mono', monospace"; cx.textAlign = "center"; cx.textBaseline = "middle";
  for (let i = 0; i < chars.length; i++) {
    cx.fillStyle = `rgba(${ink},${Math.min(base[i] + flash[i] * 0.55, 0.9).toFixed(3)})`;
    cx.fillText(chars[i], (i % cols) * S + S / 2, Math.floor(i / cols) * S + S / 2);
  }
}
// the glow layer hides the dim base letter of a cell, then redraws it bigger, bolder and tinted
const cover = (c, r) => { gx.fillStyle = bg; gx.fillRect(c * S - 1, r * S - 1, S + 2, S + 2); };
function glyph(c, r, k) {
  const i = r * cols + c, m = Math.min(1, k * 1.5), col = ink.map((v, j) => Math.round(v + (hot[j] - v) * m));
  gx.font = `${k > 0.5 ? 600 : 400} ${(12 + k * 12).toFixed(1)}px 'Geist Mono', monospace`;
  gx.fillStyle = `rgba(${col},${Math.min(base[i] + flash[i] * 0.55 + k * 0.95, 1).toFixed(3)})`;
  if (k > 0.45) { gx.shadowColor = `rgba(${hot},.85)`; gx.shadowBlur = 16 * k; }
  gx.fillText(chars[i], c * S + S / 2, r * S + S / 2); gx.shadowBlur = 0;
}
function fx(now) {
  gx.setTransform(dpr, 0, 0, dpr, 0, 0); gx.clearRect(0, 0, innerWidth, innerHeight);
  for (let n = ripples.length - 1; n >= 0; n--) { // click ripple: a ring of lit letters
    const p = ripples[n], age = now - p.t, life = 1300;
    if (age > life) { ripples.splice(n, 1); continue; }
    const rad = age * 0.5, w = 90, f = 1 - age / life, rr = rad + w;
    for (let r = Math.max(0, Math.floor((p.y - rr) / S)); r <= Math.min(rows - 1, Math.floor((p.y + rr) / S)); r++)
      for (let c = Math.max(0, Math.floor((p.x - rr) / S)); c <= Math.min(cols - 1, Math.floor((p.x + rr) / S)); c++) {
        const d = Math.abs(Math.hypot(c * S + S / 2 - p.x, r * S + S / 2 - p.y) - rad);
        if (d < w) { cover(c, r); glyph(c, r, (1 - d / w) ** 2 * f * 0.9); }
      }
  }
  if (power < 0.01) return;
  const cells = [];
  for (let r = Math.max(0, Math.floor((sy - R) / S)); r <= Math.min(rows - 1, Math.floor((sy + R) / S)); r++)
    for (let c = Math.max(0, Math.floor((sx - R) / S)); c <= Math.min(cols - 1, Math.floor((sx + R) / S)); c++) {
      const t = 1 - Math.hypot(c * S + S / 2 - sx, r * S + S / 2 - sy) / R;
      if (t > 0) cells.push(c, r, power * t * t * (3 - 2 * t));
    }
  for (let j = 0; j < cells.length; j += 3) cover(cells[j], cells[j + 1]);
  const g = gx.createRadialGradient(sx, sy, 0, sx, sy, R * 1.3);
  g.addColorStop(0, `rgba(${hot},${(halo * power).toFixed(3)})`); g.addColorStop(1, `rgba(${hot},0)`);
  gx.fillStyle = g; gx.fillRect(sx - R * 1.3, sy - R * 1.3, R * 2.6, R * 2.6);
  for (let j = 0; j < cells.length; j += 3) glyph(cells[j], cells[j + 1], cells[j + 2]);
}
function frame(t) {
  requestAnimationFrame(frame);
  sx += (mx - sx) * 0.28; sy += (my - sy) * 0.28; power += ((inside ? 1 : 0) - power) * 0.12;
  if (t - last >= 70) {
    last = t;
    for (let k = 0; k < chars.length * 0.01; k++) { const i = (Math.random() * chars.length) | 0; chars[i] = rc(); flash[i] = 1; }
    if (power > 0.05) {
      const c0 = Math.floor(sx / S), r0 = Math.floor(sy / S);
      for (let k = 0; k < 14; k++) {
        const c = c0 + ((Math.random() * 15) | 0) - 7, r = r0 + ((Math.random() * 15) | 0) - 7;
        if (c >= 0 && c < cols && r >= 0 && r < rows) { chars[r * cols + c] = rc(); flash[r * cols + c] = 1; }
      }
    }
    for (let i = 0; i < flash.length; i++) flash[i] *= 0.8;
    draw();
  }
  fx(t);
}
size();
let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 150); });
if (!reduce && !isM) {
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; if (!inside) { sx = mx; sy = my; inside = mouse; } }, { passive: true });
  root.addEventListener("pointerleave", () => { inside = false; });
  addEventListener("pointerdown", (e) => ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() }));
  requestAnimationFrame(frame);
}

/* ---------- Theme switch (circle wipe where you click) ---------- */
const tbtn = $("#theme"), tlabel = $("#theme-label");
function applyTheme(t) {
  root.dataset.theme = t;
  tlabel.textContent = t === "dark" ? "Light" : "Dark";
  tbtn.setAttribute("aria-label", `Switch to ${t === "dark" ? "light" : "dark"} theme`);
  try { localStorage.setItem("theme2", t); } catch {}
  matrixColor();
}
applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
tbtn.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  if (!document.startViewTransition || reduce) return applyTheme(next);
  const b = tbtn.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(() => applyTheme(next)).ready.then(() =>
    root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" }));
});

/* ---------- Nav: sliding indicator, active section, mobile menu ---------- */
const navLinks = $("#nav-links"), links = $$("a", navLinks);
const ind = document.createElement("span"); ind.className = "nav-ind"; navLinks.prepend(ind);
let current = links[0];
function moveInd(a) {
  if (!a || !ind.offsetParent && getComputedStyle(navLinks).display === "none") return;
  ind.style.width = a.offsetWidth + "px"; ind.style.transform = `translateX(${a.offsetLeft}px)`; ind.style.opacity = 1;
}
const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    current = links.find((l) => l.getAttribute("href") === `#${en.target.id}`);
    links.forEach((l) => { l.classList.toggle("is-active", l === current); l.toggleAttribute("aria-current", l === current); if (l === current) l.setAttribute("aria-current", "location"); });
    moveInd(current);
  });
}, { rootMargin: "-40% 0px -55% 0px" });
links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) sectionIO.observe(s); });
addEventListener("resize", () => moveInd(current));
document.fonts?.ready.then(() => moveInd(current));

const menu = $("#menu");
const closeMenu = () => { menu.setAttribute("aria-expanded", "false"); navLinks.classList.remove("open"); };
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open)); navLinks.classList.toggle("open", !open);
});
links.forEach((l) => l.addEventListener("click", closeMenu));
addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

/* ---------- Headings rise out of a mask when you reach them ---------- */
$$("[data-reveal]").forEach((h) => { h.innerHTML = `<span class="line"><span>${h.innerHTML}</span></span>`; });
const revealIO = new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } }), { threshold: 0.3 });
$$("[data-reveal], .deck, .code, .promises").forEach((el) => revealIO.observe(el));

/* ---------- Scroll progress ---------- */
const bar = $(".progress"); let ticking = false;
function progress() { const m = root.scrollHeight - innerHeight; bar.style.setProperty("--p", m > 0 ? Math.min(scrollY / m, 1).toFixed(4) : 0); ticking = false; }
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
progress();

/* ---------- Cursor spotlight on cards, tilt + B&W wipe on the portrait ---------- */
if (mouse) {
  $$(".spot").forEach((el) => el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px"); el.style.setProperty("--my", e.clientY - r.top + "px");
  }));
  const pc = $("#pcard");
  pc.addEventListener("pointermove", (e) => {
    const r = pc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    pc.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg"); pc.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
  });
  pc.addEventListener("pointerleave", () => { pc.style.setProperty("--rx", "0deg"); pc.style.setProperty("--ry", "0deg"); });
}

/* ---------- Hades mode: hover = heavy lens, click / tap / H = full portrait, Esc = exit ---------- */
(() => {
  const box = $("#pimg"), alt = $(".alt", box), lens = $(".lens", box), cvs = $("#alt-fx"), g = cvs.getContext("2d"), hint = $("#p-hint");
  const buf = document.createElement("canvas"), b = buf.getContext("2d"); // glyph layer, redrawn slowly
  const GL = "01{}<>/=+*;:#$%&[]()", C = 18, IDLE = mouse ? "hover me" : "tap me";
  const tgt = { x: 0, y: 0 }, pos = { x: 0, y: 0 };
  let w = 0, h = 0, raf = 0, lastGrid = 0, prev = 0, embers = [], sparks = [], custom = false;
  const full = () => box.classList.contains("full");

  // Optional: put your own picture named profile-hero.png beside index.html and the lens will show it
  const own = new Image();
  own.onload = () => { $("#alt-img").src = own.src; alt.classList.add("custom"); custom = true; };
  own.src = "profile-hero.png";

  const say = () => { hint.textContent = full() ? "hades mode on" : box.classList.contains("on") ? "click to go full" : IDLE; };
  const place = () => { for (const t of [alt, lens]) { t.style.setProperty("--mx", pos.x.toFixed(1) + "px"); t.style.setProperty("--my", pos.y.toFixed(1) + "px"); } };
  function move(e, snap) {
    const r = box.getBoundingClientRect(); tgt.x = e.clientX - r.left; tgt.y = e.clientY - r.top;
    if (snap || reduce) { pos.x = tgt.x; pos.y = tgt.y; place(); }
  }
  const spark = (x, y, vx, vy, life) => { if (sparks.length < 110) sparks.push({ x, y, vx, vy, life, max: life }); };

  // glyph grid: the lens lights up the characters near it, full mode sends a scan band down the portrait
  function grid(now) {
    b.clearRect(0, 0, w, h);
    const f = full(), dim = custom ? 0.45 : 1, scan = ((now / 9) % (h + 160)) - 80;
    b.font = "500 13px 'Geist Mono', monospace"; b.textAlign = "center";
    for (let cy = C / 2; cy < h; cy += C) for (let cx = C / 2; cx < w; cx += C) {
      const lit = f ? Math.max(0, 1 - Math.abs(cy - scan) / 70) : Math.max(0, 1 - Math.hypot(cx - pos.x, cy - pos.y) / 110);
      if (Math.random() > 0.2 + lit * 0.55) continue;
      b.fillStyle = `rgba(255,${(120 + lit * 110) | 0},70,${((0.12 + Math.random() * 0.25 + lit * 0.45) * dim).toFixed(2)})`;
      b.fillText(GL[(Math.random() * GL.length) | 0], cx, cy + 4);
    }
  }
  function paint(now) {
    raf = box.matches(".on, .full") && !reduce ? requestAnimationFrame(paint) : 0;
    const dt = Math.min((now - prev) / 1000, 0.05); prev = now;
    const px = pos.x, py = pos.y, ease = Math.min(1, dt * 12);
    pos.x += (tgt.x - pos.x) * ease; pos.y += (tgt.y - pos.y) * ease; place();
    // moving the lens throws sparks
    if (!full() && Math.hypot(pos.x - px, pos.y - py) > 1.5) for (let i = 0; i < 2; i++)
      spark(pos.x + (Math.random() - 0.5) * 36, pos.y + (Math.random() - 0.5) * 36, (Math.random() - 0.5) * 30, -30 - Math.random() * 50, 0.6 + Math.random() * 0.5);
    if (now - lastGrid > 90) { lastGrid = now; grid(now); }
    g.clearRect(0, 0, w, h); g.drawImage(buf, 0, 0, w, h);
    const dim = custom ? 0.45 : 1;
    for (const p of embers) {
      p.y -= p.v * 22 * dt; p.x += Math.sin(now / 300 + p.v * 9) * 16 * dt;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
      g.fillStyle = `rgba(255,${(150 + p.r * 30) | 0},60,${(0.9 * dim).toFixed(2)})`; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill();
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.life -= dt;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy *= 0.985;
      const a = s.life / s.max;
      g.fillStyle = `rgba(255,120,40,${(a * 0.25 * dim).toFixed(2)})`; g.beginPath(); g.arc(s.x, s.y, 3.2 * a + 1, 0, 7); g.fill();
      g.fillStyle = `rgba(255,214,140,${(a * dim).toFixed(2)})`; g.beginPath(); g.arc(s.x, s.y, 1.3 * a + 0.4, 0, 7); g.fill();
    }
  }
  function wake() {
    if (!w || w !== box.clientWidth) {
      w = box.clientWidth; h = box.clientHeight; const d = Math.min(devicePixelRatio || 1, 2);
      for (const c of [cvs, buf]) { c.width = w * d; c.height = h * d; }
      g.setTransform(d, 0, 0, d, 0, 0); b.setTransform(d, 0, 0, d, 0, 0);
      embers = Array.from({ length: 34 }, () => ({ x: Math.random() * w, y: Math.random() * h, v: 1 + Math.random() * 3, r: 0.7 + Math.random() * 1.8 }));
      lastGrid = 0;
    }
    if (!raf) { prev = performance.now(); raf = requestAnimationFrame(paint); }
  }
  function ignite() { // one-shot glitch + ember burst when full mode turns on
    box.classList.add("ignite"); setTimeout(() => box.classList.remove("ignite"), 650);
    if (!reduce) for (let i = 0; i < 46; i++) spark(Math.random() * w, h * (0.55 + Math.random() * 0.45), (Math.random() - 0.5) * 50, -60 - Math.random() * 140, 0.8 + Math.random() * 0.9);
  }
  function setFull(v) {
    if (v === full()) return;
    box.classList.toggle("full", v); box.setAttribute("aria-pressed", String(v));
    if (v) { wake(); ignite(); }
    say();
  }

  say();
  box.addEventListener("pointerenter", (e) => { if (e.pointerType !== "mouse") return; move(e, true); box.classList.add("on"); say(); wake(); });
  box.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const first = !box.classList.contains("on"); move(e, first);
    if (first) { box.classList.add("on"); say(); }
    wake();
  });
  // leaving only closes the lens; full mode stays on until you click again, press H, or press Esc
  box.addEventListener("pointerleave", (e) => { if (e.pointerType !== "mouse") return; box.classList.remove("on"); say(); });
  box.addEventListener("click", (e) => { if (e.detail) move(e, true); setFull(!full()); });
  box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFull(!full()); } });
  addEventListener("keydown", (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || $("dialog[open]") || root.classList.contains("intro-on")) return;
    if (e.target.closest && e.target.closest("input,textarea,select,[contenteditable]")) return;
    if (e.key === "Escape") setFull(false);
    else if (e.key.toLowerCase() === "h") {
      const r = box.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) box.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      setFull(!full());
    }
  });
})();

/* ---------- Rotating role with a scramble effect ---------- */
const roleEl = $("#role"), roles = ["Front-end Builder", "Beginner Web Dev", "Python & Java Learner", "Small-project Helper"];
function scramble(text) {
  const pool = "abcdefghijklmnopqrstuvwxyz0123456789<>/{}"; let f = 0; const total = 20;
  const id = setInterval(() => {
    roleEl.textContent = [...text].map((c, i) => (c === " " || i < (f / total) * text.length ? c : pool[(Math.random() * pool.length) | 0])).join("");
    if (++f > total) { clearInterval(id); roleEl.textContent = text; }
  }, 32);
}
if (!reduce) { let k = 0; setInterval(() => scramble(roles[(k = (k + 1) % roles.length)]), 3200); }

/* ---------- Skill cards: reveal one by one + 3D tilt ---------- */
const skillIO = new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } }), { threshold: 0.2 });
$$(".skill").forEach((s) => {
  skillIO.observe(s);
  s.addEventListener("animationend", (e) => { if (e.target === s) s.classList.remove("enter"); });
  if (!mouse || reduce) return;
  s.addEventListener("pointermove", (e) => {
    const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    s.style.setProperty("--ry", ((x - 0.5) * 7).toFixed(2) + "deg"); s.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg");
  });
  s.addEventListener("pointerleave", () => { s.style.setProperty("--rx", "0deg"); s.style.setProperty("--ry", "0deg"); });
});

/* ---------- Skill filters + typing terminal ---------- */
const skCmd = $("#sk-cmd"), skCount = $("#sk-count"), FLAGS = { all: "--all", front: "--front-end", back: "--back-end", lang: "--languages", tool: "--tools" };
let typer;
function typeCmd(text, count) {
  clearInterval(typer); skCount.textContent = count;
  if (reduce) return (skCmd.textContent = text);
  let n = 0;
  typer = setInterval(() => { skCmd.textContent = text.slice(0, ++n); if (n >= text.length) clearInterval(typer); }, 28);
}
const chips = $$(".chip"), skills = $$(".skill");
chips.forEach((c) => c.addEventListener("click", () => {
  chips.forEach((x) => { x.classList.toggle("on", x === c); x.setAttribute("aria-pressed", String(x === c)); });
  let n = 0;
  skills.forEach((s) => {
    const show = c.dataset.f === "all" || s.dataset.cat === c.dataset.f;
    s.hidden = !show;
    if (!show) return;
    const order = n++;
    if (!reduce) { s.classList.remove("enter"); void s.offsetWidth; s.style.setProperty("--d", order * 70); s.classList.add("in", "enter"); }
  });
  typeCmd(`ls ./skills ${FLAGS[c.dataset.f]}`, `${n} files`);
}));

/* ---------- Services accordion + hover marquee ---------- */
function setRow(li, open) {
  li.classList.toggle("open", open);
  $(".row-btn", li).setAttribute("aria-expanded", String(open));
  $(".row-body", li).inert = !open;
}
$$(".row").forEach((li) => {
  const btn = $(".row-btn", li), t = $(".row-title", btn).textContent.trim();
  const m = document.createElement("span"); m.className = "row-marq"; m.setAttribute("aria-hidden", "true");
  m.innerHTML = `<span>${(t + " • ").repeat(12)}</span>`; btn.append(m);
  setRow(li, false);
  btn.addEventListener("click", () => {
    const willOpen = !li.classList.contains("open");
    $$(".row.open").forEach((o) => setRow(o, false)); setRow(li, willOpen);
  });
});
setRow($(".row"), true);

/* ---------- Copy email ---------- */
const copyBtn = $("#copy"), mail = $("#mail"), note = $("#copy-status");
copyBtn.addEventListener("click", async () => {
  const email = mail.getAttribute("href").replace("mailto:", "").split("?")[0];
  try { await navigator.clipboard.writeText(email); note.textContent = "Email copied."; }
  catch { note.textContent = "Couldn't copy. Please copy it from the button."; }
  setTimeout(() => (note.textContent = ""), 2500);
});

/* ---------- Glass header: light follows the cursor, stronger blur after scrolling ---------- */
const navEl = $(".nav"), navWrap = $(".nav-wrap");
if (!isM) liquidGlass(navEl, "lg-nav", 5);
navEl.addEventListener("pointermove", (e) => { const r = navEl.getBoundingClientRect(); navEl.style.setProperty("--nx", e.clientX - r.left + "px"); navEl.style.setProperty("--ny", e.clientY - r.top + "px"); });
addEventListener("scroll", () => navWrap.classList.toggle("scrolled", scrollY > 30), { passive: true });

/* ---------- Inquiry dialog (Gmail / mail app / copy) ---------- */
const dlg = $("#inquiry"), MAIL = "joshualabrador768@gmail.com", TEMPLATE = "What I need:\n\nWhen I need it:\n\nBudget:\n";
function openInquiry(subject) {
  const su = encodeURIComponent(subject), bd = encodeURIComponent(TEMPLATE);
  $("#d-gmail").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${MAIL}&su=${su}&body=${bd}`;
  $("#d-mail").href = `mailto:${MAIL}?subject=${su}&body=${bd}`;
  $("#dlg-sub").textContent = `Subject: ${subject}`; $("#d-note").textContent = "";
  dlg.showModal();
}
document.addEventListener("click", (e) => { const t = e.target.closest("[data-inquiry]"); if (t) { e.preventDefault(); openInquiry(t.dataset.inquiry); } });
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
$("#d-copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(MAIL); $("#d-note").textContent = "Email copied."; }
  catch { $("#d-note").textContent = `Copy it here: ${MAIL}`; }
});

/* ---------- Work: tap the card tray on touch screens ---------- */
/* ---------- Projects: edit this list. Click a card to view it. ----------
   Para magdagdag ng totoong project: palitan ang title, status ("Live"), desc, tags,
   at lagyan ng live / source links at image (hal. "images/one.png"). */
const PROJECTS = [
  { title: "Project One", status: "Coming soon", desc: "A front-end project built with HTML and CSS. The preview, description, and links will be added here.", tags: ["html", "css"], live: "", source: "", image: "" },
  { title: "Project Two", status: "Coming soon", desc: "A project built with React and JavaScript. The preview, description, and links will be added here.", tags: ["react", "js"], live: "", source: "", image: "" },
  { title: "Project Three", status: "Coming soon", desc: "A Python project. The preview, description, and links will be added here.", tags: ["python"], live: "", source: "", image: "" },
];
const logos = (tags) => tags.map((k) => `<svg class="lg" role="img" aria-label="${k}"><use href="#i-${k}"/></svg>`).join("");
$$(".dcard").forEach((c, i) => {
  const p = PROJECTS[i]; if (!p) return;
  const s = $$(".dc-top span", c); s[0].textContent = p.title; s[1].textContent = p.status;
  $(".dc-tags", c).innerHTML = logos(p.tags);
  if (p.image) $(".dc-vis", c).innerHTML = `<img src="${p.image}" alt="" />`;
});
if (PROJECTS.some((p) => p.live || p.source)) {
  $(".empty-big").innerHTML = "Pick a <em>project.</em>"; $(".work-empty .lead").textContent = "Open a card to see what I made and where to find it.";
  $(".tray span:last-child").lastChild.textContent = "Open a card";
}
const viewer = $("#viewer"); let cur = 0;
function showProject(i) {
  cur = (i + PROJECTS.length) % PROJECTS.length; const p = PROJECTS[cur];
  $("#v-count").textContent = `Project ${String(cur + 1).padStart(2, "0")} / ${String(PROJECTS.length).padStart(2, "0")}`;
  $("#v-status").textContent = p.status; $("#v-title").textContent = p.title; $("#v-desc").textContent = p.desc;
  $("#v-vis").innerHTML = p.image ? `<img src="${p.image}" alt="${p.title} preview">` : "<span></span>";
  $("#v-tags").innerHTML = logos(p.tags);
  $("#v-links").innerHTML = (p.live ? `<a class="pill pill-solid" href="${p.live}" target="_blank" rel="noopener noreferrer">Live site ↗</a>` : "")
    + (p.source ? `<a class="pill" href="${p.source}" target="_blank" rel="noopener noreferrer">Source code ↗</a>` : "")
    + (p.live || p.source ? "" : `<span class="v-none">Not published yet. Links will show up here.</span>`);
}
function openProject(i) { showProject(i); if (!viewer.open) viewer.showModal(); }
$("#v-prev").addEventListener("click", () => showProject(cur - 1));
$("#v-next").addEventListener("click", () => showProject(cur + 1));
viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
const deck = $(".deck");
deck.addEventListener("click", (e) => {
  const c = e.target.closest(".dcard");
  if (c && (mouse || deck.classList.contains("pulled"))) openProject(+c.dataset.p);
  else if (!mouse) deck.classList.toggle("pulled");
});
deck.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches(".dcard")) { e.preventDefault(); openProject(+e.target.dataset.p); }
});

/* ---------- Certificates & awards: edit this list ----------
   Ilagay ang picture sa images/ folder (hal. "images/cert1.jpg"). type: "Certificate" o "Award".
   Pwede kang magdagdag o magbawas ng items, kusang aayos ang pagka-fan ng cards. */
const CERTS = [
  { title: "Certificate Title One", type: "Certificate", issuer: "Issuer name", date: "2026", desc: "What this certificate is for. Add a short description here.", image: "", link: "" },
  { title: "Award Title", type: "Award", issuer: "Issuer name", date: "2026", desc: "What this award was given for. Add a short description here.", image: "", link: "" },
  { title: "Certificate Title Two", type: "Certificate", issuer: "Issuer name", date: "2025", desc: "What this certificate is for. Add a short description here.", image: "", link: "" },
];
(() => {
  const dk = $("#cdeck"), n = CERTS.length, spread = n > 3 ? 56 : 78;
  const medal = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="m9 13-1.5 8 4.5-2 4.5 2L15 13"/></svg>';
  $("#c-total").textContent = `${n} ${n === 1 ? "item" : "items"} / click a card to open it`;
  dk.innerHTML = CERTS.map((c, i) => {
    const t = i - (n - 1) / 2, a = Math.abs(t);
    return `<div class="dcard ccard" role="button" tabindex="0" data-c="${i}" aria-label="View ${c.title}" style="--d:${i};--z:${Math.max(1, 9 - Math.round(a * 2))};--x:${t * 32}px;--y:${-30 + a * 14}px;--rot:${t * 5}deg;--hx:${t * spread}px;--hy:${-80 + a * 24}px;--hr:${t * 11}deg"><span class="cbadge mono"><b>{</b>${c.type}<b>}</b></span><div class="c-img">${c.image ? `<img src="${c.image}" alt="">` : medal}</div><h3>${c.title}</h3><p>${c.issuer} · ${c.date}</p></div>`;
  }).join("") + '<div class="tray"><span class="mono">Certificates &amp; awards</span><span class="mono"><i class="dot"></i>' + n + ' items</span></div>';
  const io = new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } }), { threshold: 0.3 });
  io.observe(dk); io.observe($("#term"));
  const cv = $("#cert-viewer"); let k = 0;
  function show(i) {
    k = (i + n) % n; const c = CERTS[k];
    $("#c-count").textContent = `${String(k + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
    $("#c-type").textContent = c.type; $("#c-title").textContent = c.title; $("#c-desc").textContent = `${c.issuer} · ${c.date}. ${c.desc}`;
    $("#c-vis").innerHTML = c.image ? `<img src="${c.image}" alt="${c.title}">` : medal;
    $("#c-links").innerHTML = c.link ? `<a class="pill pill-solid" href="${c.link}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : "";
  }
  const open = (i) => { show(i); if (!cv.open) cv.showModal(); };
  $("#c-prev").addEventListener("click", () => show(k - 1)); $("#c-next").addEventListener("click", () => show(k + 1));
  cv.addEventListener("click", (e) => { if (e.target === cv) cv.close(); });
  dk.addEventListener("click", (e) => {
    const c = e.target.closest(".dcard");
    if (c && (mouse || dk.classList.contains("pulled"))) open(+c.dataset.c); else if (!mouse) dk.classList.toggle("pulled");
  });
  dk.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.matches(".dcard")) { e.preventDefault(); open(+e.target.dataset.c); } });
})();

/* ---------- Short entrance animation when you scroll into a new section ---------- */
(() => {
  const secs = $$(".about, .skills, .services, .work, .certs, .contact");
  if (reduce) return;
  const io = new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("sec-in"); o.unobserve(e.target); } }), { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
  secs.forEach((s) => { s.classList.add("sec"); io.observe(s); });
})();

/* ---------- Section warp: code streaks fall (or rise) when you move to another section ---------- */
(() => {
  if (reduce || isM) return;
  const wrap = document.createElement("div"); wrap.id = "warp"; wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = '<div id="warp-veil"></div><canvas></canvas><span id="warp-tag" class="mono"></span>';
  document.body.append(wrap);
  const cvs = $("canvas", wrap), g = cvs.getContext("2d"), tag = $("#warp-tag"), GL = "01{}<>/=+*;:#$%&[]()";
  const DUR = 950; let W, H, streaks = [], raf = 0, t0 = 0, prev = 0, off;
  const fit = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cvs.width = W * d; cvs.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); };
  fit(); addEventListener("resize", fit);
  function tick(now) {
    const age = now - t0, dt = Math.min((now - prev) / 1000, 0.05); prev = now;
    if (age > DUR) { raf = 0; wrap.classList.remove("on"); g.clearRect(0, 0, W, H); return; }
    raf = requestAnimationFrame(tick);
    const p = age / DUR, fade = Math.min(1, age / 120) * (1 - p * p);
    g.clearRect(0, 0, W, H); g.font = "13px 'Geist Mono', monospace"; g.textAlign = "center";
    for (const s of streaks) {
      s.y += s.v * dt;
      const tail = s.y - Math.sign(s.v) * s.len, gr = g.createLinearGradient(0, tail, 0, s.y);
      gr.addColorStop(0, `rgba(${hot},0)`); gr.addColorStop(1, `rgba(${hot},${(0.85 * fade * s.a).toFixed(2)})`);
      g.strokeStyle = gr; g.lineWidth = s.w; g.beginPath(); g.moveTo(s.x, tail); g.lineTo(s.x, s.y); g.stroke();
      if (s.ch) { g.fillStyle = `rgba(${hot},${(fade * s.a).toFixed(2)})`; g.fillText(GL[(Math.random() * GL.length) | 0], s.x, s.y + Math.sign(s.v) * 12); }
    }
  }
  function burst(dir, name) {
    const now = performance.now(), n = Math.min(110, Math.ceil(W / 14));
    streaks = Array.from({ length: n }, () => ({ x: Math.random() * W, y: dir > 0 ? -Math.random() * H * 0.5 : H + Math.random() * H * 0.5, v: (800 + Math.random() * 1500) * dir, len: 60 + Math.random() * 240, w: Math.random() < 0.2 ? 2 : 1, a: 0.4 + Math.random() * 0.6, ch: Math.random() < 0.35 }));
    tag.textContent = `> ${name}`;
    wrap.classList.remove("on"); void wrap.offsetWidth; wrap.classList.add("on");
    t0 = now; prev = now; if (!raf) raf = requestAnimationFrame(tick);
  }
  const secs = $$("main > section[id]"), cur = { i: -1 };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = secs.indexOf(e.target);
    if (cur.i === -1) { cur.i = i; return; }
    if (i === cur.i) return;
    const dir = i > cur.i ? 1 : -1; cur.i = i;
    if (!root.classList.contains("intro-on")) burst(dir, e.target.id);
  }), { rootMargin: "-50% 0px -50% 0px" });
  secs.forEach((s) => io.observe(s));
})();

/* ---------- Stagger children inside each section ---------- */
$$(".sec").forEach((s) => $$(".kicker, .lead, .sk-tools, .skill-grid, .about-grid > *, .svc > *, .work-grid > *, .cert-grid > *, .contact-panel > .contact-main, .contact-panel > .contact-side", s).forEach((el, i) => { el.classList.add("stg"); el.style.setProperty("--s", i); }));
