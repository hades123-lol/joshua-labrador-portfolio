/* MOBILE ONLY (<=760px). The desktop site lives in index.js.
   Projects and certificates: edit the PROJECTS / CERTS lists in index.js (both versions use them). */
(() => {
  const mq = matchMedia("(max-width:760px)");
  let ready = false;
  mq.matches ? init() : mq.addEventListener("change", (e) => e.matches && init());

  function init() {
    if (ready) return; ready = true;
    const M = document.getElementById("m"), $ = (s, r = M) => r.querySelector(s), $$ = (s, r = M) => [...r.querySelectorAll(s)];
    const R = document.documentElement, rm = matchMedia("(prefers-reduced-motion:reduce)").matches, buzz = (n) => navigator.vibrate && navigator.vibrate(n);
    const MAIL = "joshualabrador768@gmail.com";
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const logo = (k) => `<svg class="lg" aria-hidden="true"><use href="#i-${k}"/></svg>`;
    const toast = (t) => { const e = $("#m-toast"); e.textContent = t; e.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("on"), 1800); };
    const copy = async () => { try { await navigator.clipboard.writeText(MAIL); toast("Email copied ✔"); } catch { toast(MAIL); } buzz(12); };

    /* ---------- edit these ---------- */
    // [name, colour, icon id, message shown when tapped]
    const STACK = [
      ["HTML", "#E44D26", "html", "rendered: Hello, world"],
      ["CSS", "#1572B6", "css", "layout: responsive ✔"],
      ["JavaScript", "#F7DF1E", "js", "theme saved ✔"],
      ["React", "#61DAFB", "react", "<Card /> mounted"],
      ["Next.js", "#8b8f98", "next", "route / ready"],
      ["Node.js", "#5FA04E", "node", "listening on :3000"],
      ["MySQL", "#00A1C9", "mysql", "query OK ✔"],
      ["Python", "#3776AB", "python", "Hi Hades"],
      ["Java", "#E76F00", "java", 'greet("Hades") → Hi Hades'],
      ["Git", "#F34F29", "git", "changes saved ✔"],
      ["GitHub", "#8b949e", "github", "@hades123-lol"],
      ["VS Code", "#2F9BE0", "vscode", "workspace ready"],
      ["NetBeans", "#95d921", "netbeans", "BUILD SUCCESSFUL"],
    ];
    const SERV = [
      ["Landing pages", "Events, products, small businesses", "01", "One-page sites for an event, a product, or a small business. Clean, fast, and good on phones."],
      ["Personal sites", "Portfolios and personal pages", "02", "A portfolio or personal page that shows who you are and what you’ve done."],
      ["Fixes & tweaks", "Layout bugs, mobile issues, small changes", "03", "Layout bugs, mobile problems, or small changes to a site you already have."],
      ["Design to code", "From mockup or sketch to a working page", "04", "You have a mockup or a sketch. I’ll build it as a working page."],
    ];
    const projects = typeof PROJECTS !== "undefined" ? PROJECTS : [];
    const certs = typeof CERTS !== "undefined" ? CERTS : [];

    /* ---------- boot ---------- */
    const boot = $("#m-boot"); setTimeout(() => boot.remove(), 1900); boot.onclick = () => (boot.style.animation = "m-out .3s forwards");
    $("#m-year").textContent = new Date().getFullYear();

    /* ---------- socials, marquee, hero letters, stats, touch spotlight ---------- */
    const SOC = [
      ["GitHub", '<use href="#i-github"/>', "https://github.com/hades123-lol", "#8b949e"],
      ["LinkedIn", '<use href="#i-linkedin"/>', "https://www.linkedin.com/in/joshua-labrador-64097543b/", "#0A66C2"],
      ["Facebook", '<use href="#i-facebook"/>', "https://www.facebook.com/share/1A2Desopjm/", "#1877F2"],
      ["Instagram", '<use href="#i-instagram"/>', "https://www.instagram.com/wtdhkt?dmpr=OGRraW1rNzl6bDl2", "#E4405F"],
      ["Gmail", '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" d="M3 6h18v12H3zM3 7l9 7 9-7"/>', "mailto:" + MAIL, "#EA4335"],
    ];
    const soc = SOC.map((x, i) => `<a class="sk rim" style="--c:${x[3]};--i:${i}" href="${x[2]}" ${x[2][0] == "m" ? "" : 'target="_blank" rel="noopener noreferrer"'} aria-label="${x[0]}"><svg viewBox="0 0 24 24" aria-hidden="true">${x[1]}</svg><small>${x[0]}</small></a>`).join("");
    $("#m-soc").innerHTML = soc; $("#m-soc2").innerHTML = soc;
    {
      const row = (a, rev) => `<div class="mq${rev ? " rev" : ""}"><div>${[...a, ...a].map((x) => `<span>${logo(x[2])}${x[0]}</span>`).join("")}</div></div>`;
      $("#m-mq").innerHTML = row(STACK.slice(0, 7)) + row(STACK.slice(7), true);
    }
    $$("h1 span").forEach((s) => (s.innerHTML = [...s.textContent].map((c, i) => `<i style="--i:${i}">${c}</i>`).join("")));
    $("#m-count").dataset.n = STACK.length;
    {
      const so = new IntersectionObserver((es, o) => es.forEach((e) => {
        if (!e.isIntersecting) return; o.unobserve(e.target);
        const b = $("b", e.target), n = +b.dataset.n; let t0;
        const f = (t) => { t0 ??= t; const k = Math.min(1, (t - t0) / 1000); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); k < 1 && requestAnimationFrame(f); };
        requestAnimationFrame(f);
      }), { threshold: 0.6 });
      $$(".stats>div").forEach((d) => so.observe(d));
    }
    const spot = (e) => { const t = e.target.closest(".item,.tile,.prom li,.stats>div"); if (!t) return; const r = t.getBoundingClientRect(); t.style.setProperty("--mx", e.clientX - r.left + "px"); t.style.setProperty("--my", e.clientY - r.top + "px"); };
    M.addEventListener("pointerdown", spot); M.addEventListener("pointermove", spot);

    /* ---------- theme ---------- */
    const tb = $("#m-theme"), setTheme = (t) => { R.dataset.theme = t; try { localStorage.setItem("theme2", t); } catch {} };
    const flipTheme = () => {
      const n = R.dataset.theme === "dark" ? "light" : "dark"; buzz(8);
      if (!document.startViewTransition || rm) return setTheme(n);
      const b = tb.getBoundingClientRect(), x = b.x + b.width / 2, y = b.y + b.height / 2, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(() => setTheme(n)).ready.then(() => R.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 600, easing: "ease-in", pseudoElement: "::view-transition-new(root)" }));
    };
    tb.onclick = flipTheme;
    const hades = () => { const on = R.toggleAttribute("data-mh"); toast(on ? "🔥 hades mode on" : "hades mode off"); buzz([20, 30, 20]); return on; };

    /* ---------- navigation ----------
       We scroll with our own animation and re-measure the target on every frame,
       so the page always stops on the section that was tapped. */
    const ids = ["m-home", "m-about", "m-stuff", "m-contact"], dock = $("#m-dock"), dockLinks = $$("a", dock);
    let moving = 0;
    const mark = (k) => { dock.style.setProperty("--k", k); dockLinks.forEach((a, j) => { a.classList.toggle("on", j === k); j === k ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current"); }); };
    const topOf = (el) => clamp(el.id === "m-home" ? 0 : el.getBoundingClientRect().top + scrollY, 0, R.scrollHeight - innerHeight);
    const jump = (y) => scrollTo({ top: y, behavior: "instant" });
    const stop = () => { cancelAnimationFrame(moving); moving = 0; };
    function goTo(id) {
      const el = document.getElementById(id); if (!el) return;
      stop(); const k = ids.indexOf(id); if (k > -1) mark(k);
      if (rm) return jump(topOf(el));
      const from = scrollY, dur = clamp(Math.abs(topOf(el) - from) * 0.35, 380, 800); let t0;
      const f = (t) => {
        t0 ??= t; const p = Math.min(1, (t - t0) / dur), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        jump(from + (topOf(el) - from) * e);
        moving = p < 1 ? requestAnimationFrame(f) : 0;
      };
      moving = requestAnimationFrame(f);
    }
    M.addEventListener("click", (e) => { const a = e.target.closest('a[href^="#m-"]'); if (!a) return; e.preventDefault(); buzz(8); goTo(a.getAttribute("href").slice(1)); });
    ["touchstart", "wheel"].forEach((n) => addEventListener(n, (e) => { if (!e.target.closest || !e.target.closest('a[href^="#m-"]')) stop(); }, { passive: true }));
    const bar = $(".bar");
    const onScroll = () => {
      bar.style.setProperty("--p", (scrollY / (R.scrollHeight - innerHeight || 1)).toFixed(3));
      M.style.setProperty("--sy", scrollY);
      if (moving) return;
      let k = 0; ids.forEach((id, j) => { if (document.getElementById(id).getBoundingClientRect().top <= innerHeight * 0.45) k = j; });
      if (scrollY >= R.scrollHeight - innerHeight - 4) k = ids.length - 1;
      mark(k);
    };
    addEventListener("scroll", onScroll, { passive: true }); mark(0);

    const rio = new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } }), { threshold: 0.08 });
    $$(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 70 + "ms"; rio.observe(el); });

    /* ---------- liquid glass on the header and the dock (liquidGlass is in index.js) ---------- */
    if (typeof liquidGlass === "function") { liquidGlass($(".m-bar"), "lg-mbar", 1.8); liquidGlass(dock, "lg-mdock", 7); }

    /* ---------- clock + typed role ---------- */
    const clk = () => ($("#m-clock").textContent = "Antipolo " + new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Manila" }).format(new Date())); clk(); setInterval(clk, 15000);
    {
      const roles = ["front-end builder", "beginner web dev", "python & java learner", "small-project helper"], el = $("#m-typed"); let r = 0, c = 0, d = 0;
      if (rm) el.textContent = roles[0];
      else (function t() { const w = roles[r]; c += d ? -1 : 1; el.textContent = w.slice(0, c); let ms = d ? 22 : 55; if (!d && c === w.length) { d = 1; ms = 1500; } else if (d && !c) { d = 0; r = (r + 1) % roles.length; ms = 250; } setTimeout(t, ms); })();
    }

    lanyard();

    /* ---------- tabs ---------- */
    const tabs = $$(".tab"), panels = $$(".panel"), ind = $("#m-tind"), pw = $("#m-panels"); let ti = -1;
    $("#m-tiles").innerHTML = STACK.map((x, i) => `<button class="tile rim" style="--c:${x[1]};--i:${i}" data-name="${x[0]}" data-o="${esc(x[3])}">${logo(x[2])}<span>${x[0]}</span></button>`).join("");
    panels[1].innerHTML = SERV.map((x, i) => `<div class="item sv rim" style="--i:${i}"><button aria-expanded="false"><span class="ic">${x[2]}</span><span><strong>${x[0]}</strong><small>${x[1]}</small></span><span class="pl"></span></button><div class="bd"><div><p>${x[3]}</p><div class="lgs">${(i == 3 ? ["html", "css", "js", "react"] : ["html", "css", "js"]).map(logo).join("")}</div><a class="btn solid" href="mailto:${MAIL}?subject=${encodeURIComponent(x[0] + " inquiry")}">Ask about this ↗</a></div></div></div>`).join("");
    const preview = (p, aw) => p.image ? `<div class="pv img"><img src="${esc(p.image)}" alt="${esc(p.title)} preview"></div>`
      : `<div class="pv${aw ? " aw" : ""}">${aw ? "<i>★</i><b></b>" : '<span class="dots"><i></i><i></i><i></i></span><b></b><b></b><b></b>'}</div>`;
    const cards = (list, kind) => list.map((p, i) => `<article class="item rim" style="--i:${i}">${preview(p, kind === "cert")}<div class="r2"><span class="mono num">${String(i + 1).padStart(2, "0")}</span><span class="chip2 mono">${esc(p.status || p.type)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.issuer ? `${p.issuer} · ${p.date}` : p.desc)}</p><button class="more" data-kind="${kind}" data-i="${i}">Details →</button></article>`).join("");
    panels[2].innerHTML = cards(projects, "project") + `<a class="btn" href="https://github.com/hades123-lol" target="_blank" rel="noopener noreferrer">Follow my GitHub ↗</a>`;
    panels[3].innerHTML = cards(certs, "cert");
    function go(i, force) {
      i = clamp(i, 0, tabs.length - 1); if (i === ti && !force) return;
      pw.style.setProperty("--dir", i > ti ? 1 : -1); const first = ti < 0, changed = i !== ti; ti = i;
      tabs.forEach((t, j) => t.setAttribute("aria-selected", j === i));
      panels.forEach((p, j) => { p.hidden = j !== i; if (changed) p.classList.remove("in"); if (j === i && changed && !first) { void p.offsetWidth; p.classList.add("in"); } });
      ind.style.width = tabs[i].offsetWidth + "px"; ind.style.transform = `translateX(${tabs[i].offsetLeft}px)`; if (!first && changed) buzz(6);
    }
    tabs.forEach((t, i) => (t.onclick = () => go(i))); go(0);
    const refit = () => go(ti, true); addEventListener("resize", refit); document.fonts && document.fonts.ready.then(refit);
    {
      let x0, y0;
      pw.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      pw.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) go(ti + (dx < 0 ? 1 : -1)); }, { passive: true });
    }
    panels[0].addEventListener("click", (e) => { const t = e.target.closest(".tile"); if (!t) return; $$(".tile").forEach((x) => x.classList.toggle("on", x === t)); $("#m-out").innerHTML = `<b>$</b> run ${esc(t.dataset.name.toLowerCase())}<br><b>›</b> ${esc(t.dataset.o)}`; buzz(10); });
    panels[1].addEventListener("click", (e) => { const b = e.target.closest(".sv>button"); if (!b) return; const it = b.parentNode, o = !it.classList.contains("open"); $$(".sv.open").forEach((x) => { x.classList.remove("open"); x.firstElementChild.setAttribute("aria-expanded", false); }); it.classList.toggle("open", o); b.setAttribute("aria-expanded", o); buzz(8); });

    /* ---------- detail page (the phone's back button also closes it) ---------- */
    {
      const pg = $("#m-page"); let lastFocus;
      const NAMES = { html: "HTML", css: "CSS", js: "JavaScript", react: "React", python: "Python", java: "Java", next: "Next.js", node: "Node.js", mysql: "MySQL", git: "Git", github: "GitHub", vscode: "VS Code", netbeans: "NetBeans" };
      const link = (u, t, solid) => u ? `<a class="btn${solid ? " solid" : ""}" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t} ↗</a>` : "";
      function open(kind, i) {
        const cert = kind === "cert", p = (cert ? certs : projects)[i]; if (!p) return;
        $("#pg-crumb").textContent = `${cert ? "Awards" : "Work"}  ›  ${p.title}`;
        $("#pg-vis").innerHTML = preview(p, cert);
        $("#pg-title").textContent = p.title;
        $("#pg-desc").textContent = cert ? `${p.issuer} · ${p.date}. ${p.desc}` : p.desc;
        $("#pg-tech").hidden = !(p.tags && p.tags.length);
        $("#pg-tags").innerHTML = (p.tags || []).map((k) => `<span class="rim">${logo(k)}${NAMES[k] || esc(k)}</span>`).join("");
        const links = cert ? link(p.link, "Verify", true) : link(p.live, "Live site", true) + link(p.source, "Source code");
        $("#pg-links").innerHTML = (links || `<p class="mini mono"><b>›</b> ${cert ? "No verify link yet." : "Not published yet. Links will show up here."}</p>`)
          + `<a class="btn${links ? "" : " solid"}" href="mailto:${MAIL}?subject=${encodeURIComponent("About " + p.title)}">Ask me about it</a>`;
        lastFocus = document.activeElement; pg.scrollTop = 0; pg.inert = false; pg.classList.add("on"); R.style.overflow = "hidden"; history.pushState({ mpage: 1 }, ""); $("#pg-back").focus({ preventScroll: true }); buzz(10);
      }
      const close = () => { if (!pg.classList.contains("on")) return; pg.classList.remove("on"); pg.inert = true; R.style.overflow = ""; lastFocus && lastFocus.focus({ preventScroll: true }); };
      pg.inert = true;
      $("#pg-back").onclick = () => history.back();
      addEventListener("popstate", close);
      addEventListener("keydown", (e) => { if (e.key === "Escape" && pg.classList.contains("on")) history.back(); });
      [panels[2], panels[3]].forEach((pn) => pn.addEventListener("click", (e) => { const it = e.target.closest(".item"); if (!it || e.target.closest("a")) return; const b = $(".more", it); open(b.dataset.kind, +b.dataset.i); }));
    }

    /* ---------- contact form: opens Gmail or the mail app with the message filled in ---------- */
    {
      const form = $("#m-form");
      form.onsubmit = (e) => {
        e.preventDefault();
        const f = new FormData(form), name = f.get("name").trim(), from = f.get("from").trim(), msg = f.get("message").trim();
        const subject = encodeURIComponent(`Project inquiry from ${name}`), body = encodeURIComponent(`${msg}\n\n— ${name}${from ? `\n${from}` : ""}`);
        if (e.submitter && e.submitter.value === "app") location.href = `mailto:${MAIL}?subject=${subject}&body=${body}`;
        else window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${MAIL}&su=${subject}&body=${body}`, "_blank", "noopener");
        toast("Draft ready. Press send ✔");
      };
    }

    /* ---------- terminal ---------- */
    {
      const log = $("#m-log"), inp = $("#m-in"); let hist = [], hi = 0;
      const say = (h, c = "") => { const p = document.createElement("p"); p.className = c; p.innerHTML = h; log.append(p); log.scrollTop = log.scrollHeight; };
      const C = { help: () => "about · skills · services · work · awards · contact · email · whoami · hades · theme · clear", about: () => "Joshua Labrador. SHS @ ACLC Antipolo. Beginner, not careless: I ask when unsure, finish what I start, and keep you updated.", skills: () => STACK.map((s) => s[0]).join("  "), services: () => SERV.map((s) => s[0]).join(" | "), work: () => (projects.some((p) => p.live || p.source) ? "open the Work tab to see them." : "no published projects yet. first ones coming soon."), awards: () => certs.length + " items listed", contact: () => MAIL, whoami: () => "hades123-lol → front-end builder", email: () => (copy(), "copied " + MAIL), theme: () => (flipTheme(), "theme switched"), hades: () => (hades() ? "🔥 hades mode on" : "hades mode off"), sudo: () => "nice try :)", clear: () => ((log.innerHTML = ""), null) };
      const run = (c) => { c = c.trim().toLowerCase(); if (!c) return; hist.push(c); hi = hist.length; say(`<b>$</b> ${esc(c)}`, "c"); const k = c.split(" ")[0], f = Object.hasOwn(C, k) ? C[k] : null, r = f ? f() : `command not found: ${esc(c)}. try <b>help</b>`; if (r) say(r); buzz(5); };
      $("#m-cmd").onsubmit = (e) => { e.preventDefault(); run(inp.value); inp.value = ""; };
      inp.onkeydown = (e) => { if (e.key === "ArrowUp" && hist.length) inp.value = hist[(hi = Math.max(0, hi - 1))]; if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; } };
      $$(".chips button").forEach((b) => (b.onclick = () => run(b.textContent)));
      say("welcome. tap a command below or type <b>help</b>");
    }

    /* ---------- background: stars + code glyphs that light up under your finger ---------- */
    {
      const cv = $("#m-fx"), x = cv.getContext("2d"), Gs = ["0", "1", "{ }", "</>", "=>", "( )", "[ ]", ";", "#", "$_", "&&", "fn"]; let w, h, px = -999, py = -999, A = "255,85,30", fr = 0;
      const rs = () => { const d = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; cv.width = w * d; cv.height = h * d; x.setTransform(d, 0, 0, d, 0, 0); }; rs(); addEventListener("resize", rs);
      const gl = Array.from({ length: 16 }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, v: 0.12 + Math.random() * 0.3, c: Gs[i % Gs.length], z: 11 + ((Math.random() * 6) | 0) }));
      const stars = Array.from({ length: 55 }, () => ({ x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.2, s: Math.random() * 7 }));
      const mv = (e) => { const t = e.touches ? e.touches[0] : e; px = t.clientX; py = t.clientY; };
      addEventListener("touchstart", mv, { passive: true }); addEventListener("touchmove", mv, { passive: true }); addEventListener("touchend", () => (px = py = -999));
      (function f(now = 0) {
        requestAnimationFrame(f); if (document.hidden || (rm && fr > 0)) return;
        const dark = R.dataset.theme === "dark";
        if (!(fr++ % 20)) A = getComputedStyle(M).getPropertyValue("--a").trim() || A;
        x.clearRect(0, 0, w, h); x.textAlign = "center";
        for (const s of stars) { x.fillStyle = `rgba(${dark ? "220,232,255" : "30,34,60"},${(0.12 + 0.5 * Math.abs(Math.sin(now / 1400 + s.s))).toFixed(2)})`; x.beginPath(); x.arc(s.x * w, (((s.y * h - scrollY * 0.04 * s.r) % h) + h) % h, s.r, 0, 7); x.fill(); }
        for (const o of gl) { o.y -= o.v; if (o.y < -20) { o.y = h + 20; o.x = Math.random() * w; } const p = Math.max(0, 1 - Math.hypot(o.x - px, o.y - py) / 130); x.font = `500 ${o.z + p * 9}px ui-monospace,Menlo,monospace`; x.fillStyle = `rgba(${A},${0.07 + p * 0.85})`; x.fillText(o.c, o.x, o.y); }
      })();
    }

    /* ---------- tap ripple ---------- */
    M.addEventListener("pointerdown", (e) => { if (e.target.closest("input,textarea,.id")) return; const r = document.createElement("i"); r.className = "rp"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; M.append(r); setTimeout(() => r.remove(), 650); });
    $("#m-copy").onclick = copy;

    /* =====================================================================
       ID LANYARD
       The strap is a chain of points; the card is a solid body hanging from it.
       Drag it anywhere, throw it, flick it sideways to spin it, tap to flip.
       ===================================================================== */
    function lanyard() {
      const st = $("#m-stage"), cv = $("#m-cv"), g = cv.getContext("2d"), box = $("#m-id"), card = $("#m-card");
      const front = $(".id-front", card), back = $(".id-back", card), hw = $(".id-hw", box);
      const TEXT = "JOSHUA LABRADOR";            // printed on the strap
      const CW = 236, CH = 348, TOP = 40;        // card size, gap between strap end and card
      const COM = TOP + CH / 2;                  // strap end -> centre of the card
      const LEN = 200, N = 10, REST = 142;       // strap length, links, resting height of the strap end
      const SUB = 12, GRAV = 2600;               // physics steps per frame, gravity
      const WB = 1 / 7, WI = 1 / (7 * (CW * CW + CH * CH) / 12), WP = 1; // inverse mass / inertia

      const A = { x: 195, y: REST - LEN };       // where the strap hangs from (above the screen)
      const B = { x: 0, y: 0, a: 0, px: 0, py: 0, pa: 0 };
      const P = Array.from({ length: N }, () => ({ x: 0, y: 0, px: 0, py: 0 }));
      let s = 1, W = 390, H = 570, lastW = 0, len = LEN, drag = null, running = false, visible = true;
      let yaw = rm ? 0 : -2.6, yawV = 0, face = 0, pitch = 0, vx = 0, vy = 0, tiltX = 0, acc = 0, last = performance.now();

      const rot = (x, y, a) => { const c = Math.cos(a), n = Math.sin(a); return { x: x * c - y * n, y: x * n + y * c }; };
      const end = () => { const r = rot(0, -COM, B.a); return { x: B.x + r.x, y: B.y + r.y, r }; };

      function place(jx, jy, a) {
        const r = rot(0, COM, a);
        B.a = B.pa = a; B.x = B.px = jx + r.x; B.y = B.py = jy + r.y;
        P.forEach((p, i) => { p.x = p.px = A.x + (jx - A.x) * (i / N); p.y = p.py = A.y + (jy - A.y) * (i / N); });
      }
      function size() {
        if (innerWidth === lastW) return; // ignore the resize caused by the browser's address bar
        const first = !lastW; lastW = innerWidth;
        s = clamp(Math.min(innerWidth / 390, innerHeight / 750), 0.74, 1);
        st.style.height = Math.round(572 * s) + "px";
        W = st.clientWidth / s; H = st.clientHeight / s; A.x = W / 2;
        const d = Math.min(devicePixelRatio || 1, 2), ch = st.clientHeight + 260;
        cv.style.height = ch + "px"; cv.width = st.clientWidth * d; cv.height = ch * d; g.setTransform(d * s, 0, 0, d * s, 0, 0);
        if (rm) place(A.x, REST, 0); else if (first) place(A.x + 125, 10, -0.55); else place(A.x, REST, 0);
        render(0);
      }

      /* push a point of the card (offset r from its centre) along n */
      function pushBody(r, nx, ny, amount) {
        const rn = r.x * ny - r.y * nx;
        B.x += WB * amount * nx; B.y += WB * amount * ny; B.a += WI * rn * amount;
      }
      const weight = (r, nx, ny) => { const rn = r.x * ny - r.y * nx; return WB + WI * rn * rn; };

      function step(h) {
        for (let i = 1; i < N; i++) {
          const p = P[i], ux = (p.x - p.px) * 0.996, uy = (p.y - p.py) * 0.996;
          p.px = p.x; p.py = p.y; p.x += ux + tiltX * h * h * 0.5; p.y += uy + GRAV * h * h;
        }
        const ux = clamp((B.x - B.px) * 0.9986, -16, 16), uy = clamp((B.y - B.py) * 0.9986, -16, 16), ua = clamp((B.a - B.pa) * (drag ? 0.99 : 0.9978), -0.09, 0.09);
        B.px = B.x; B.py = B.y; B.pa = B.a;
        B.x += ux + tiltX * h * h; B.y += uy + GRAV * h * h; B.a += ua;

        const seg = len / N; P[0].x = A.x; P[0].y = A.y;
        for (let it = 0; it < 2; it++) {
          for (let i = 0; i < N - 1; i++) { // strap links
            const a = P[i], b = P[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, k = (d - seg) / d * (d > seg ? 1 : 0.25);
            const wa = i ? 0.5 : 0, wb = i ? 0.5 : 1;
            a.x += dx * k * wa; a.y += dy * k * wa; b.x -= dx * k * wb; b.y -= dy * k * wb;
          }
          const q = P[N - 1], j = end(), dx = j.x - q.x, dy = j.y - q.y, d = Math.hypot(dx, dy) || 1; // last link -> card
          if (d > seg) { const nx = dx / d, ny = dy / d, L = -(d - seg) / (weight(j.r, nx, ny) + WP); pushBody(j.r, nx, ny, L); q.x -= WP * L * nx; q.y -= WP * L * ny; }
          const e = end(), ex = e.x - A.x, ey = e.y - A.y, ed = Math.hypot(ex, ey) || 1; // strap cannot stretch
          if (ed > len) {
            const nx = ex / ed, ny = ey / ed, x0 = B.x, y0 = B.y, a0 = B.a;
            pushBody(e.r, nx, ny, -(ed - len) / weight(e.r, nx, ny));
            // after a hard pull the strap returns without launching the card
            if (!drag && len > LEN + 1) { B.px += (B.x - x0) * 0.82; B.py += (B.y - y0) * 0.82; B.pa += (B.a - a0) * 0.82; }
          }
        }
        for (let i = 1; i < N - 1; i++) { const p = P[i]; p.x += ((P[i - 1].x + P[i + 1].x) / 2 - p.x) * 0.02; p.y += ((P[i - 1].y + P[i + 1].y) / 2 - p.y) * 0.02; }
        if (drag) { // the finger wins
          const r = rot(drag.lx, drag.ly, B.a), dx = drag.x - (B.x + r.x), dy = drag.y - (B.y + r.y), d = Math.hypot(dx, dy);
          if (d > 0.01) pushBody(r, dx / d, dy / d, (d * 0.35) / weight(r, dx / d, dy / d));
        }
      }

      function drawStrap() {
        g.clearRect(0, 0, W, H + 400);
        const j = end(), pts = [{ x: A.x, y: A.y - 60 }, ...P, j], line = [];
        for (let i = 1; i < pts.length - 1; i++) { // smooth curve through the points
          const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
          for (let k = 0; k < 6; k++) {
            const t = k / 6, t2 = t * t, t3 = t2 * t;
            const f = (a, b, c, d) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
            line.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
          }
        }
        line.push({ x: j.x, y: j.y });
        let total = 0;
        line.forEach((p, i) => { if (i) total += Math.hypot(p.x - line[i - 1].x, p.y - line[i - 1].y); p.l = total; });
        const flat = Math.max(0.22, Math.abs(Math.cos(yaw)));
        line.forEach((p, i) => { // the strap twists together with the card
          const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)], d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          p.nx = -(b.y - a.y) / d; p.ny = (b.x - a.x) / d;
          const u = total ? p.l / total : 0, k = u > 0.5 ? Math.pow((u - 0.5) / 0.5, 1.6) : 0;
          p.t = Math.sin(Math.PI * Math.min(1, k)) ; p.w = 28 * (1 - (1 - flat) * (0.85 * Math.sin(Math.PI * k * 0.85) + 0.15 * k));
        });
        const side = (m) => line.map((p) => [p.x + p.nx * p.w * m, p.y + p.ny * p.w * m]);
        const trace = (a, move = true) => a.forEach(([x, y], i) => (i || !move ? g.lineTo(x, y) : g.moveTo(x, y)));
        g.beginPath(); trace(side(0.5)); trace(side(-0.5).reverse(), false); g.closePath();
        g.save(); g.shadowColor = "rgba(0,0,0,.45)"; g.shadowBlur = 14; g.shadowOffsetY = 8; g.fillStyle = "#101116"; g.fill(); g.restore();
        const stroke = (m, color, width, dash = []) => { g.beginPath(); trace(side(m)); g.strokeStyle = color; g.lineWidth = width; g.setLineDash(dash); g.stroke(); g.setLineDash([]); };
        stroke(0.5, "rgba(150,160,185,.55)", 1); stroke(-0.5, "rgba(150,160,185,.35)", 1);
        stroke(0.36, "rgba(255,255,255,.16)", 0.8, [3, 2]); stroke(-0.36, "rgba(255,255,255,.16)", 0.8, [3, 2]);
        stroke(0.12, "rgba(255,255,255,.045)", 5);

        g.font = "700 11.5px Geist, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#f4f5f8";
        const widths = [...TEXT].map((c) => g.measureText(c).width + 0.9), tw = widths.reduce((a, b) => a + b, 0);
        for (let from = total - tw - 20; from > -tw; from -= tw + 44) {
          let at = from, i = 0;
          [...TEXT].forEach((c, n) => {
            const m = at + widths[n] / 2; at += widths[n];
            if (m < 0) return;
            while (i < line.length - 2 && line[i + 1].l < m) i++;
            const p = line[i], q = line[i + 1], k = clamp((m - p.l) / (q.l - p.l || 1), 0, 1);
            g.save(); g.translate(p.x + (q.x - p.x) * k, p.y + (q.y - p.y) * k); g.rotate(Math.atan2(q.y - p.y, q.x - p.x)); g.scale(1, p.w / 28); g.fillText(c, 0, 0); g.restore();
          });
        }
      }

      function render() {
        drawStrap();
        const j = end(), c = Math.cos(yaw);
        box.style.transform = `translate3d(${(j.x * s - CW / 2).toFixed(2)}px,${(j.y * s).toFixed(2)}px,0) rotate(${B.a.toFixed(4)}rad) scale(${s})`;
        card.style.transform = `rotateX(${pitch.toFixed(3)}rad) rotateY(${yaw.toFixed(3)}rad)`;
        front.style.visibility = c > 0 ? "visible" : "hidden"; back.style.visibility = c > 0 ? "hidden" : "visible";
        hw.style.transform = `scaleX(${(0.45 + 0.55 * Math.abs(c)).toFixed(3)})`;
        card.style.setProperty("--gl", (50 + Math.sin(yaw) * 90 + B.a * 120).toFixed(1) + "%");
      }

      function frame(now) {
        requestAnimationFrame(frame);
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        if (!running || (!visible && !drag) || document.hidden) return;
        if (rm) return render();
        acc += dt;
        for (let n = 0; acc >= 1 / 60 && n < 4; n++, acc -= 1 / 60) {
          len = drag ? drag.len : len + (LEN - len) * 0.09;
          for (let i = 0; i < SUB; i++) step(1 / 60 / SUB);
        }
        vx += ((B.x - B.px) * SUB * 60 - vx) * 0.2; vy += ((B.y - B.py) * SUB * 60 - vy) * 0.2;
        // 3D spin: a soft spring that brings the chosen side back to the front
        const base = face * Math.PI, rest = base + Math.PI * 2 * Math.round((yaw - base) / (Math.PI * 2));
        const aim = rest + (drag ? clamp(vx * 0.0011, -1.15, 1.15) : Math.sin(now / 1500) * 0.14 + clamp(vx * 0.0006, -0.5, 0.5));
        yawV += ((aim - yaw) * 30 - yawV * 3.1) * dt; yaw += yawV * dt;
        pitch += (clamp(-vy * 0.00022, -0.28, 0.28) - pitch) * 0.12;
        render();
      }

      const point = (e) => { const r = st.getBoundingClientRect(); return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s }; };
      const aimAt = (p) => { // keep the finger target within reach of the strap
        const r = rot(drag.lx, drag.ly, B.a), e = rot(0, -COM, B.a), ex = p.x - r.x + e.x - A.x, ey = p.y - r.y + e.y - A.y, d = Math.hypot(ex, ey) || 1, k = Math.min(1, (LEN * 1.38) / d);
        drag.x = p.x - ex * (1 - k); drag.y = p.y - ey * (1 - k); drag.len = clamp(d, LEN, LEN * 1.38);
      };
      box.addEventListener("pointerdown", (e) => {
        e.preventDefault(); running = true; box.setPointerCapture(e.pointerId);
        const p = point(e), l = rot(p.x - B.x, p.y - B.y, -B.a);
        drag = { lx: l.x, ly: l.y, x: p.x, y: p.y, sx: p.x, sy: p.y, moved: 0, at: performance.now(), len: LEN }; aimAt(p);
      });
      box.addEventListener("pointermove", (e) => { if (!drag) return; const p = point(e); drag.moved = Math.max(drag.moved, Math.hypot(p.x - drag.sx, p.y - drag.sy)); aimAt(p); });
      const flip = (dir) => { face ^= 1; if (rm) yaw = face * Math.PI; else yawV += dir * 5; buzz(12); };
      box.addEventListener("pointerup", () => {
        if (!drag) return; const d = drag; drag = null;
        if (d.moved < 8 && performance.now() - d.at < 400) return flip(d.sx < B.x ? -1 : 1);
        if (Math.abs(vx) > 700) yawV += clamp(vx * 0.009, -16, 16); // flick = spin
        buzz(6);
      });
      box.addEventListener("pointercancel", () => (drag = null));
      box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(1); } });
      // tilting the phone swings the card (where the browser allows it)
      addEventListener("deviceorientation", (e) => { if (e.gamma == null) return; tiltX = Math.abs(e.gamma) < 4 ? 0 : clamp(e.gamma / 45, -1, 1) * GRAV * 0.32; });

      new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "0px 0px 200px 0px" }).observe(st);
      addEventListener("resize", size); size();
      setTimeout(() => { running = true; }, 1350);
      document.fonts && document.fonts.ready.then(() => render());
      requestAnimationFrame(frame);
    }
  }
})();
