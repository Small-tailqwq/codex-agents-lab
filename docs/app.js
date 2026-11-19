(() => {
  const catalog = globalThis.AGENTS_CATALOG;
  const AC = globalThis.AgentsCompose;
  const REPO = document.documentElement.dataset.repo;
  const LANGS = [["Simplified Chinese", "简体中文"], ["Traditional Chinese", "繁體中文"], ["English", "English"], ["Japanese", "日本語"]];
  const GRANT_FIELDS = [
    ["name", "Name", "场景名"],
    ["scope", "Scope", "在哪生效：哪个账号、游戏、仓库、网站"],
    ["granted", "Granted", "可以不问就做的事；范围内不可撤销的动作要点名"],
    ["why", "Why", "东西归谁，最坏结果是什么，能接受多大损失"],
    ["still_ask", "Still ask", "范围内仍然每次要问的事（可空）"],
    ["never", "Never", "即使中途被要求也不做的事（可空）"],
  ];
  const STORE = "agents-lab:grants";
  const $ = (s) => document.querySelector(s);

  const state = {
    target: "codex", series: "6.2", lang: "Simplified Chinese", customLang: false,
    overrides: { codex: {}, dot: {} },
    grants: [], open: new Set(), form: null,
  };

  // ---------- persistence
  try { state.grants = JSON.parse(localStorage.getItem(STORE)) || []; } catch { state.grants = []; }
  const saveGrants = () => { try { localStorage.setItem(STORE, JSON.stringify(state.grants)); } catch { /* private mode */ } };

  function readHash() {
    const q = new URLSearchParams(location.hash.slice(1));
    if (catalog.targets[q.get("t")]) state.target = q.get("t");
    if (catalog.series.some((s) => s.id === q.get("s"))) state.series = q.get("s");
    if (q.get("l")) { state.lang = q.get("l"); state.customLang = !LANGS.some(([v]) => v === state.lang); }
    const o = (state.overrides[state.target] = {});
    for (const id of (q.get("on") || "").split(",").filter(Boolean)) o[id] = true;
    for (const id of (q.get("off") || "").split(",").filter(Boolean)) o[id] = false;
  }
  function writeHash(view) {
    const q = new URLSearchParams({ t: state.target, s: state.series });
    if (state.lang !== "Simplified Chinese") q.set("l", state.lang);
    const on = [], off = [];
    for (const f of view.pickable) {
      const isDefault = f.default.includes(state.series);
      if (view.chosen.has(f.id) && !isDefault) on.push(f.id);
      if (!view.chosen.has(f.id) && isDefault) off.push(f.id);
    }
    if (on.length) q.set("on", on.join(","));
    if (off.length) q.set("off", off.join(","));
    history.replaceState(null, "", "#" + q.toString().replace(/%2C/g, ","));
  }

  // ---------- derived view
  function compute() {
    const target = catalog.targets[state.target];
    const fragments = AC.available(target, state.series, state.lang);
    const pickable = fragments.filter((f) => !f.with);
    const o = state.overrides[state.target];
    const chosen = new Set(pickable.filter((f) => (f.id in o ? o[f.id] : f.default.includes(state.series))).map((f) => f.id));
    const grants = state.target === "dot" ? state.grants.filter((g) => !g.off) : [];
    const result = AC.compose(target, state.series, state.lang, chosen, grants);
    const included = new Set(result.selected.map((f) => f.id));
    const neededBy = {};
    for (const f of result.selected) for (const r of f.requires || []) (neededBy[r] ||= []).push(f.title);
    return { target, fragments, pickable, chosen, included, neededBy, result };
  }

  // ---------- small DOM helpers
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rich = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  const CHEVRON = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function badge(f) {
    return `<span class="badge ${f.evidence}" title="${esc(catalog.evidence_hint[f.evidence])}">${catalog.evidence[f.evidence]}</span>`;
  }

  function fragmentRow(f, view, label) {
    const on = view.included.has(f.id);
    const auto = Boolean(f.with);
    const forced = on && !auto && !view.chosen.has(f.id);
    const locked = auto || forced;
    const open = state.open.has(f.id);
    const tag = auto ? '<span class="tag">附带</span>' : forced ? `<span class="tag" title="${esc("「" + view.neededBy[f.id].join("」「") + "」需要它")}">依赖</span>` : "";
    const acts = f.kind === "grant" ? `<button class="link" data-rewrite="${f.id}">改写</button>` : "";
    return `<div class="row${on ? " on" : ""}${locked ? " locked" : ""}" data-id="${f.id}">
      <label><input type="checkbox" data-toggle="${f.id}"${on ? " checked" : ""}${locked ? " disabled" : ""}><span class="t">${esc(label || f.title)}</span>${tag}</label>
      <span class="acts">${acts}${badge(f)}</span>
      <button class="more" data-more="${f.id}" aria-expanded="${open}" aria-label="依据" ${f.note ? "" : "hidden"}>${CHEVRON}</button>
      ${open && f.note ? `<div class="note">${label ? `<b>${esc(f.title)}</b>　` : ""}${rich(f.note)}</div>` : ""}
    </div>`;
  }

  function grantForm() {
    const v = state.form.values;
    return `<form class="grant" id="grant-form">
      ${GRANT_FIELDS.map(([key, label, hint]) => `<label>${label}${key === "name"
        ? `<input name="${key}" value="${esc(v[key] || "")}" placeholder="${hint}" required>`
        : `<textarea name="${key}" rows="2" placeholder="${hint}"${["scope", "granted", "why"].includes(key) ? " required" : ""}>${esc(v[key] || "")}</textarea>`}</label>`).join("")}
      <div class="btns"><button type="button" class="btn" data-form-cancel>取消</button><button class="btn primary">${state.form.index === null ? "添加" : "保存"}</button></div>
    </form>`;
  }

  function renderScenes(view) {
    const html = [];
    for (const scene of view.target.scenes) {
      const members = view.fragments.filter((f) => f.scene === scene.id && (!f.with || view.included.has(f.id)));
      const pick = members.filter((f) => !f.with);
      const isAuth = state.target === "dot" && scene.id === "auth";
      if (!members.length) continue;
      if (members.length === 1 && !isAuth) {
        html.push(`<div class="scene">${fragmentRow(members[0], view, scene.label).replace('class="row', 'class="row head')}</div>`);
        continue;
      }
      const count = pick.filter((f) => view.included.has(f.id)).length + (isAuth ? state.grants.filter((g) => !g.off).length : 0);
      const total = pick.length + (isAuth ? state.grants.length : 0);
      const rows = members.map((f) => fragmentRow(f, view));
      if (isAuth) {
        let active = 0;
        state.grants.forEach((g, i) => rows.push(`<div class="row${g.off ? "" : " on"}"${g.off ? "" : ` data-id="grant-custom-${++active}"`}>
          <label><input type="checkbox"${g.off ? "" : " checked"} data-grant-toggle="${i}"><span class="t">${esc(g.name)}</span></label>
          <span class="acts"><button class="link" data-grant-edit="${i}">编辑</button><button class="link" data-grant-delete="${i}">删除</button></span><span></span></div>`));
        rows.push(state.form ? grantForm() : '<button class="add" data-grant-new>＋ 授权场景</button>');
      }
      html.push(`<div class="scene">
        <div class="row head${count ? " on" : ""}"><label><input type="checkbox" data-scene="${scene.id}"${count ? " checked" : ""} data-mixed="${count > 0 && count < total}"><span class="t">${esc(scene.label)}</span></label><span></span><span></span></div>
        ${rows.join("")}</div>`);
    }
    $("#scenes").innerHTML = html.join("");
    for (const box of document.querySelectorAll("[data-mixed='true']")) box.indeterminate = true;
  }

  function renderPreview(view, flash) {
    const out = $("#out");
    out.textContent = "";
    for (const b of view.result.blocks) {
      if (b.sep) out.append(b.sep);
      const span = document.createElement("span");
      span.className = "blk";
      if (b.id) span.dataset.id = b.id; else span.classList.add("h");
      b.text.split("\n").forEach((line, i) => {
        if (i) span.append("\n");
        if (b.id && line.startsWith("#")) {
          const strong = document.createElement("span");
          strong.className = "h3"; strong.textContent = line; span.append(strong);
        } else span.append(line);
      });
      out.append(span);
    }
    const bytes = new TextEncoder().encode(view.result.text).length;
    const size = bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} KB`;
    for (const el of document.querySelectorAll("[data-size]")) el.textContent = size;
    for (const el of document.querySelectorAll("[data-act='copy'], [data-act='download']")) el.disabled = !bytes;
    if (flash) {
      const el = out.querySelector(`[data-id="${flash}"]`);
      if (el) {
        el.classList.add("flash");
        setTimeout(() => el.classList.remove("flash"), 900);
        if (getComputedStyle($(".doc")).position === "sticky") {
          out.scrollTo({ top: el.offsetTop - out.offsetTop - 60, behavior: "smooth" });
        }
      }
    }
  }

  function renderControls(view) {
    $("#seg-target").innerHTML = Object.entries(catalog.targets).map(([id, t]) =>
      `<button role="radio" aria-checked="${id === state.target}" data-target="${id}">${esc(t.label)}</button>`).join("");
    $("#seg-series").innerHTML = catalog.series.map((s) =>
      `<button role="radio" aria-checked="${s.id === state.series}" data-series="${s.id}">${esc(s.label)}<small>${esc(s.models)}</small></button>`).join("");
    $("#lang").innerHTML = LANGS.map(([v, l]) => `<option value="${v}">${l}</option>`).join("") + '<option value="">其他…</option>';
    $("#lang").value = state.customLang ? "" : state.lang;
    $("#lang-custom").hidden = !state.customLang;
    if (state.customLang && document.activeElement !== $("#lang-custom")) $("#lang-custom").value = state.lang;
    $("#status").innerHTML = rich(view.target.status[state.series]);
    $("#path").textContent = view.target.install;
  }

  let last;
  function render(flash) {
    last = compute();
    renderControls(last);
    renderScenes(last);
    renderPreview(last, flash);
    writeHash(last);
  }

  // ---------- events
  function parseGrant(f) {
    const v = { name: f.body.split("\n")[0].replace(/^#+\s*/, "") };
    for (const [key, label] of GRANT_FIELDS.slice(1)) {
      const line = f.body.split("\n").find((l) => l.startsWith(`- ${label}: `));
      if (line) v[key] = line.slice(label.length + 4);
    }
    return v;
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, [data-toggle], [data-scene], [data-grant-toggle]");
    if (!t) return;
    const d = t.dataset;
    const o = state.overrides[state.target];
    if (d.target) { state.target = d.target; state.form = null; return render(); }
    if (d.series) { state.series = d.series; return render(); }
    if (d.toggle) { o[d.toggle] = t.checked; return render(t.checked ? d.toggle : null); }
    if (d.scene) {
      const pick = last.pickable.filter((f) => f.scene === d.scene);
      const mine = d.scene === "auth" && state.target === "dot" ? state.grants : [];
      const anyOn = pick.some((f) => last.chosen.has(f.id)) || mine.some((g) => !g.off);
      const preferred = pick.filter((f) => f.default.includes(state.series));
      const turnOn = anyOn ? [] : (preferred.length ? preferred : pick.filter((f) => f.kind !== "grant"));
      for (const f of pick) o[f.id] = turnOn.includes(f);
      for (const g of mine) g.off = anyOn;
      saveGrants();
      return render(turnOn[0] && turnOn[0].id);
    }
    if (d.more) { state.open.has(d.more) ? state.open.delete(d.more) : state.open.add(d.more); return render(); }
    if (d.rewrite) {
      const f = last.fragments.find((x) => x.id === d.rewrite);
      state.form = { index: null, values: parseGrant(f), from: f.id };
      return render();
    }
    if ("grantNew" in d) { state.form = { index: null, values: {} }; render(); return $("#grant-form input").focus(); }
    if (d.grantEdit) { state.form = { index: +d.grantEdit, values: { ...state.grants[+d.grantEdit] } }; return render(); }
    if (d.grantToggle) { state.grants[+d.grantToggle].off = !t.checked; saveGrants(); return render(); }
    if (d.grantDelete) { state.grants.splice(+d.grantDelete, 1); state.form = null; saveGrants(); return render(); }
    if ("formCancel" in d) { state.form = null; return render(); }
    if (d.act === "reset") { state.overrides[state.target] = {}; return render(); }
    if (d.act === "copy") {
      const done = () => { const old = t.textContent; t.textContent = "已复制"; setTimeout(() => (t.textContent = old), 1200); };
      const fallback = () => {
        const range = document.createRange(); range.selectNodeContents($("#out"));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        document.execCommand("copy"); sel.removeAllRanges(); done();
      };
      return navigator.clipboard ? navigator.clipboard.writeText(last.result.text).then(done, fallback) : fallback();
    }
    if (d.act === "download") {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([last.result.text], { type: "text/markdown" }));
      a.download = "AGENTS.md"; a.click(); URL.revokeObjectURL(a.href);
    }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.id !== "grant-form") return;
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    const index = state.form.index === null ? state.grants.push(values) - 1 : state.form.index;
    state.grants[index] = values;
    if (state.form.from) state.overrides.dot[state.form.from] = false;
    state.form = null; saveGrants();
    render(`grant-custom-${state.grants.slice(0, index + 1).filter((g) => !g.off).length}`);
  });
  document.addEventListener("input", (e) => {
    if (state.form && e.target.closest("#grant-form")) state.form.values[e.target.name] = e.target.value;
  });

  $("#lang").addEventListener("change", (e) => {
    state.customLang = !e.target.value;
    state.lang = e.target.value || $("#lang-custom").value.trim() || "English";
    render();
    if (state.customLang) $("#lang-custom").focus();
  });
  $("#lang-custom").addEventListener("input", (e) => { state.lang = e.target.value.trim() || "English"; render(); });

  // hover links a row with its text in the preview, both ways
  const lit = (id, on) => { for (const el of document.querySelectorAll(`[data-id="${id}"]`)) el.classList.toggle("lit", on); };
  for (const type of ["mouseover", "mouseout"]) {
    document.addEventListener(type, (e) => {
      const el = e.target.closest && e.target.closest("[data-id]");
      if (el) lit(el.dataset.id, type === "mouseover");
    });
  }
  $("#out").addEventListener("click", (e) => {
    const el = e.target.closest("[data-id]");
    const row = el && document.querySelector(`.row[data-id="${el.dataset.id}"]`);
    if (row && !String(getSelection())) row.scrollIntoView({ block: "center", behavior: "smooth" });
  });

  $("#link-repo").href = REPO;
  $("#link-skill").href = REPO + "/tree/main/skills/agents-composer";
  $("#link-research").href = REPO + "/blob/main/research/gpt-6.2-migration.md";
  addEventListener("hashchange", () => { readHash(); render(); });
  readHash();
  render();
})();
