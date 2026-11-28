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
    let at = 0, squish = 0;
    const mark = (k) => { if (k !== at) { at = k; dock.classList.add("sliding"); clearTimeout(squish); squish = setTimeout(() => dock.classList.remove("sliding"), 230); } dock.style.setProperty("--k", k); dockLinks.forEach((a, j) => { a.classList.toggle("on", j === k); j === k ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current"); }); };
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
    if (typeof liquidGlass === "function") { liquidGlass($(".m-bar"), "lg-mbar"); liquidGlass(dock, "lg-mdock", { blur: 3, bend: -110 }); }

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
       ID LANYARD: the 3D scene and its physics live in lanyard.js,
       the pictures on both sides of the card in card-art.js.
       They are only downloaded on phones.
       ===================================================================== */
    function lanyard() {
      const st = $("#m-stage"), born = performance.now();
      const add = (src) => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.append(s); });
      add("card-art.js")
        .then(() => add("lanyard.js"))
        .then(() => window.Lanyard.mount(st, { art: window.ID_ART, reducedMotion: rm, buzz, delay: Math.max(0, 1350 - (performance.now() - born)) }))
        .then((api) => (window.idCard = api))
        .catch((err) => { // no 3D on this phone: show the card as a picture
          console.warn("3D ID card unavailable:", err);
          st.querySelector("canvas")?.remove();
          if (!window.ID_ART) return;
          const img = new Image(); img.className = "id-still"; img.alt = ""; img.src = window.ID_ART.front;
          st.style.height = ""; st.append(img);
        });
    }
  }
})();
