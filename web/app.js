/* Camden Nights — offline Oriole Park night-game fan desk (EXAMPLE data labeled) */
(function () {
  "use strict";

  const ORANGE = "#DF4601";
  const LS_NOTES = "camden-nights:scorebook";
  const LS_PACK = "camden-nights:pack";

  /* ---- Section map data (EXAMPLE fan tips) ---- */
  const SECTIONS = {
    lp: {
      name: "Lower Bowl · Home Plate",
      tier: "Lower",
      tip: "EXAMPLE: Closest to the dirt — great for pitch framing & catcher chatter. Arrive early; sightlines fill fast on rivalry nights."
    },
    l1b: {
      name: "Lower Bowl · 1B Side",
      tier: "Lower",
      tip: "EXAMPLE: Dugout energy & pickoff peeks. Afternoon shade patterns flip after dusk — bring a light layer."
    },
    l3b: {
      name: "Lower Bowl · 3B Side",
      tier: "Lower",
      tip: "EXAMPLE: Classic Camden angle on lefties. Good for watching the LF wall caroms after night lights kick on."
    },
    lrf: {
      name: "Lower Bowl · Right Field",
      tier: "Lower",
      tip: "EXAMPLE: Warehouse glow after sunset — public landmark beyond RF. Night games light the brick windows."
    },
    llf: {
      name: "Lower Bowl · Left Field",
      tier: "Lower",
      tip: "EXAMPLE: Tall wall drama. Demo tip: track fly-ball spin under the lights for scorebook flair."
    },
    cf: {
      name: "Center Field · Bleacher vibe",
      tier: "Outfield",
      tip: "EXAMPLE: Deep CF perspective. Loud when the Birds go yard — pack voice & a pen for the notepad."
    },
    up: {
      name: "Upper Deck · Behind Home",
      tier: "Upper",
      tip: "EXAMPLE: Full diamond geometry. Great for first-timers learning the park silhouette against the night sky."
    },
    u1b: {
      name: "Upper Deck · 1B",
      tier: "Upper",
      tip: "EXAMPLE: Sweeping RF + warehouse skyline. Demo: best photo frame after the stadium lights settle."
    },
    u3b: {
      name: "Upper Deck · 3B",
      tier: "Upper",
      tip: "EXAMPLE: City glow over LF. Cooler breeze off the harbor — checklist jacket recommended."
    },
    wh: {
      name: "Warehouse View · RF",
      tier: "Landmark",
      tip: "EXAMPLE: Framed by the B&O Warehouse (public fact: visible beyond RF). Night chrome + orange accents look best here."
    },
    "bp-h": {
      name: "Home Bullpen",
      tier: "Bullpen",
      tip: "EXAMPLE: Warmup theater between innings. Not a seating chart — fictional fan-watch tip only."
    },
    "bp-a": {
      name: "Visitor Bullpen",
      tier: "Bullpen",
      tip: "EXAMPLE: Scout the opposing arms. Demo note for the scorebook — not live pitching data."
    }
  };

  /* ---- EXAMPLE Hot Stove ---- */
  const FA = [
    { name: "Alex Rivera", pos: "SP", note: "Fictional mid-rotation arm", prio: "high" },
    { name: "Jordan Blake", pos: "RP", note: "Demo late-inning target", prio: "med" },
    { name: "Sam Okonkwo", pos: "OF", note: "Placeholder platoon bat", prio: "med" },
    { name: "Casey Quinn", pos: "C", note: "EXAMPLE depth catcher", prio: "low" }
  ];
  const ARB = [
    { name: "Player A", pos: "SS", ask: "$4.2M demo", status: "EXAMPLE filed" },
    { name: "Player B", pos: "RP", ask: "$2.1M demo", status: "EXAMPLE talking" },
    { name: "Player C", pos: "1B", ask: "$6.8M demo", status: "EXAMPLE hearing" }
  ];
  const WB = {
    keep: ["Core OF trio (placeholder)", "Young SP depth (demo)", "Clubhouse vets (EXAMPLE)"],
    explore: ["LH bullpen help (fictional)", "Bench speed (demo)", "Backup catcher market (EXAMPLE)"],
    pass: ["Bloated multi-year DH (demo)", "Declining SP on years (EXAMPLE)"]
  };

  /* ---- EXAMPLE Timeline ---- */
  const MILESTONES = [
    { date: "EXAMPLE · Late Mar", title: "Opening Day", body: "Demo curtain-raiser at Camden — not a real schedule date." },
    { date: "EXAMPLE · Apr", title: "First night series", body: "Warehouse lights + orange chrome. Fan packing checklist live." },
    { date: "EXAMPLE · May", title: "Rivalry weekend", body: "Placeholder AL East set — treat as fiction only." },
    { date: "EXAMPLE · Jun", title: "Interleague stretch", body: "Demo road/home mix for timeline scroll practice." },
    { date: "EXAMPLE · Jul", title: "All-Star break", body: "EXAMPLE midsummer pause — no live voting data." },
    { date: "EXAMPLE · Aug", title: "Dog days push", body: "Fictional pennant-race flavor text for the desk." },
    { date: "EXAMPLE · Sep", title: "September baseball", body: "Demo magic-number board — not standings." },
    { date: "EXAMPLE · Oct", title: "October hopes", body: "Placeholder postseason vibe card — EXAMPLE only." }
  ];

  const PACK_DEFAULT = [
    "Tickets / MLB Ballpark app ready",
    "Light jacket for harbor breeze",
    "Scorebook + pen / pencil",
    "Phone battery pack",
    "Earplugs (kids / loud nights)",
    "Small cash for tip jars",
    "Clear bag (policy check — EXAMPLE reminder)",
    "Orioles orange layer for photos"
  ];

  /* ---- Tabs ---- */
  const tabs = document.querySelectorAll(".tab");
  const panels = {
    home: document.getElementById("panel-home"),
    map: document.getElementById("panel-map"),
    stove: document.getElementById("panel-stove"),
    timeline: document.getElementById("panel-timeline"),
    notes: document.getElementById("panel-notes")
  };

  function showTab(id) {
    tabs.forEach(function (t) {
      const on = t.dataset.tab === id;
      t.classList.toggle("on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    Object.keys(panels).forEach(function (k) {
      const p = panels[k];
      if (!p) return;
      const on = k === id;
      p.classList.toggle("on", on);
      if (on) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
    if (location.hash !== "#" + id) {
      try { history.replaceState(null, "", "#" + id); } catch (e) { /* file:// */ }
    }
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () { showTab(t.dataset.tab); });
  });

  function bootHash() {
    const h = (location.hash || "#home").replace("#", "");
    showTab(panels[h] ? h : "home");
  }
  window.addEventListener("hashchange", bootHash);

  /* ---- Starfield / stadium lights canvas ---- */
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let lights = [];
  let raf = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    const n = Math.min(160, Math.floor((canvas.width * canvas.height) / 9000));
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.72,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        s: Math.random() * 0.02 + 0.005
      });
    }
    lights = [];
    for (let i = 0; i < 8; i++) {
      lights.push({
        x: canvas.width * (0.15 + i * 0.1),
        y: canvas.height * 0.78,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawBg(t) {
    const w = canvas.width, h = canvas.height;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0a0e22");
    g.addColorStop(0.45, "#0b1020");
    g.addColorStop(1, "#050508");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.a += s.s;
      const alpha = 0.25 + 0.75 * Math.abs(Math.sin(s.a));
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,245,220," + alpha.toFixed(3) + ")";
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // soft stadium wash
    for (let i = 0; i < lights.length; i++) {
      const L = lights[i];
      const pulse = 0.35 + 0.25 * Math.sin(t * 0.0015 + L.phase);
      const rg = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y - 80, 160);
      rg.addColorStop(0, "rgba(255,220,140," + (pulse * 0.35).toFixed(3) + ")");
      rg.addColorStop(0.5, "rgba(223,70,1," + (pulse * 0.12).toFixed(3) + ")");
      rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg;
      ctx.fillRect(L.x - 180, L.y - 220, 360, 280);
    }

    raf = requestAnimationFrame(drawBg);
  }

  window.addEventListener("resize", resize);
  resize();
  raf = requestAnimationFrame(drawBg);

  /* ---- Dusk → night sky band ---- */
  const skyBand = document.getElementById("skyBand");
  const skyFill = document.getElementById("skyFill");
  const skyLabel = document.getElementById("skyLabel");
  let skyTimer = null;

  function playSkyCycle() {
    if (!skyBand) return;
    skyBand.classList.add("dusk");
    if (skyFill) skyFill.style.width = "15%";
    if (skyLabel) skyLabel.textContent = "Dusk · warehouse windows warming";
    clearTimeout(skyTimer);
    skyTimer = setTimeout(function () {
      if (skyFill) skyFill.style.width = "55%";
      if (skyLabel) skyLabel.textContent = "Twilight · lights blooming";
      skyTimer = setTimeout(function () {
        skyBand.classList.remove("dusk");
        if (skyFill) skyFill.style.width = "100%";
        if (skyLabel) skyLabel.textContent = "Deep night · stadium lights on";
      }, 1400);
    }, 1200);
  }
  const btnCycle = document.getElementById("btnCycleSky");
  if (btnCycle) btnCycle.addEventListener("click", playSkyCycle);
  setTimeout(playSkyCycle, 400);

  /* ---- Park map interactivity ---- */
  const mapTip = document.getElementById("mapTip");
  const mapDetail = document.getElementById("mapDetail");
  const secEls = document.querySelectorAll("#parkMap .sec");

  function renderDetail(id) {
    const d = SECTIONS[id];
    if (!d || !mapDetail) return;
    mapDetail.innerHTML =
      "<h4>" + esc(d.name) + "</h4>" +
      "<p class=\"muted\" style=\"margin-bottom:8px\">" + esc(d.tier) + " · EXAMPLE tip</p>" +
      "<p>" + esc(d.tip) + "</p>" +
      "<p class=\"muted tiny\" style=\"margin-top:10px\">Not an official seating chart or verified policy.</p>";
  }

  secEls.forEach(function (el) {
    const id = el.getAttribute("data-id");
    el.addEventListener("mouseenter", function (ev) {
      const d = SECTIONS[id];
      if (!d || !mapTip) return;
      mapTip.hidden = false;
      mapTip.textContent = d.name + " — EXAMPLE";
      positionTip(ev);
    });
    el.addEventListener("mousemove", positionTip);
    el.addEventListener("mouseleave", function () {
      if (mapTip) mapTip.hidden = true;
    });
    el.addEventListener("click", function () {
      secEls.forEach(function (s) { s.classList.remove("active"); });
      el.classList.add("active");
      renderDetail(id);
    });
  });

  function positionTip(ev) {
    if (!mapTip || mapTip.hidden) return;
    const wrap = document.querySelector(".map-wrap");
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    let x = ev.clientX - r.left + 12;
    let y = ev.clientY - r.top + 12;
    if (x + 200 > r.width) x = r.width - 210;
    if (y + 40 > r.height) y = r.height - 50;
    mapTip.style.left = x + "px";
    mapTip.style.top = y + "px";
  }

  /* ---- Hot Stove fill ---- */
  function fillStove() {
    const fa = document.getElementById("faBody");
    if (fa) {
      fa.innerHTML = FA.map(function (r) {
        return "<tr><td>" + esc(r.name) + "</td><td>" + esc(r.pos) + "</td><td>" + esc(r.note) +
          "</td><td><span class=\"prio " + r.prio + "\">" + r.prio.toUpperCase() + "</span></td></tr>";
      }).join("");
    }
    const arb = document.getElementById("arbBody");
    if (arb) {
      arb.innerHTML = ARB.map(function (r) {
        return "<tr><td>" + esc(r.name) + "</td><td>" + esc(r.pos) + "</td><td>" + esc(r.ask) +
          "</td><td>" + esc(r.status) + "</td></tr>";
      }).join("");
    }
    function fillList(id, arr) {
      const ul = document.getElementById(id);
      if (ul) ul.innerHTML = arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    }
    fillList("wbKeep", WB.keep);
    fillList("wbExplore", WB.explore);
    fillList("wbPass", WB.pass);
  }

  /* ---- Timeline ---- */
  function fillTimeline() {
    const track = document.getElementById("tlTrack");
    if (!track) return;
    track.innerHTML = MILESTONES.map(function (m) {
      return '<div class="tl-item"><div class="tl-dot"></div>' +
        '<div class="tl-date">' + esc(m.date) + '</div>' +
        '<div class="tl-title">' + esc(m.title) + '</div>' +
        '<div class="tl-body">' + esc(m.body) + '</div></div>';
    }).join("");

    const wrap = document.getElementById("tlWrap");
    const left = document.getElementById("tlLeft");
    const right = document.getElementById("tlRight");
    if (left) left.addEventListener("click", function () { wrap.scrollBy({ left: -240, behavior: "smooth" }); });
    if (right) right.addEventListener("click", function () { wrap.scrollBy({ left: 240, behavior: "smooth" }); });

    // drag scroll
    if (wrap) {
      let down = false, startX = 0, scrollL = 0;
      wrap.addEventListener("mousedown", function (e) {
        down = true; wrap.classList.add("dragging");
        startX = e.pageX - wrap.offsetLeft; scrollL = wrap.scrollLeft;
      });
      window.addEventListener("mouseup", function () { down = false; wrap.classList.remove("dragging"); });
      wrap.addEventListener("mouseleave", function () { down = false; wrap.classList.remove("dragging"); });
      wrap.addEventListener("mousemove", function (e) {
        if (!down) return;
        e.preventDefault();
        const x = e.pageX - wrap.offsetLeft;
        wrap.scrollLeft = scrollL - (x - startX);
      });
    }
  }

  /* ---- Fan notes / packing ---- */
  function loadNotes() {
    const ta = document.getElementById("scorebook");
    if (!ta) return;
    try { ta.value = localStorage.getItem(LS_NOTES) || ""; } catch (e) { ta.value = ""; }
  }
  function saveNotes() {
    const ta = document.getElementById("scorebook");
    const st = document.getElementById("notesStatus");
    if (!ta) return;
    try {
      localStorage.setItem(LS_NOTES, ta.value);
      if (st) st.textContent = "Saved " + new Date().toLocaleTimeString();
    } catch (e) {
      if (st) st.textContent = "Save failed (storage blocked)";
    }
  }
  function clearNotes() {
    const ta = document.getElementById("scorebook");
    if (ta) ta.value = "";
    try { localStorage.removeItem(LS_NOTES); } catch (e) { /* ignore */ }
    const st = document.getElementById("notesStatus");
    if (st) st.textContent = "Cleared";
  }

  function loadPack() {
    const ul = document.getElementById("packList");
    if (!ul) return;
    let state = null;
    try { state = JSON.parse(localStorage.getItem(LS_PACK) || "null"); } catch (e) { state = null; }
    if (!Array.isArray(state) || state.length !== PACK_DEFAULT.length) {
      state = PACK_DEFAULT.map(function () { return false; });
    }
    ul.innerHTML = PACK_DEFAULT.map(function (label, i) {
      return '<li class="' + (state[i] ? "done" : "") + '">' +
        '<input type="checkbox" data-i="' + i + '"' + (state[i] ? " checked" : "") + ">" +
        "<span>" + esc(label) + "</span></li>";
    }).join("");
    ul.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("change", function () {
        const idx = +inp.getAttribute("data-i");
        state[idx] = inp.checked;
        inp.closest("li").classList.toggle("done", inp.checked);
        try { localStorage.setItem(LS_PACK, JSON.stringify(state)); } catch (e) { /* ignore */ }
      });
    });
  }

  function resetPack() {
    try { localStorage.removeItem(LS_PACK); } catch (e) { /* ignore */ }
    loadPack();
  }

  const btnSave = document.getElementById("btnSaveNotes");
  const btnClear = document.getElementById("btnClearNotes");
  const btnResetPack = document.getElementById("btnResetPack");
  if (btnSave) btnSave.addEventListener("click", saveNotes);
  if (btnClear) btnClear.addEventListener("click", clearNotes);
  if (btnResetPack) btnResetPack.addEventListener("click", resetPack);

  /* ---- Wall / Help ---- */
  const btnWall = document.getElementById("btnWall");
  const btnHelp = document.getElementById("btnHelp");
  const helpModal = document.getElementById("helpModal");
  if (btnWall) btnWall.addEventListener("click", function () {
    document.body.classList.toggle("wall");
  });
  if (btnHelp && helpModal) btnHelp.addEventListener("click", function () {
    if (typeof helpModal.showModal === "function") helpModal.showModal();
    else helpModal.setAttribute("open", "");
  });

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---- Boot ---- */
  fillStove();
  fillTimeline();
  loadNotes();
  loadPack();
  bootHash();
})();
