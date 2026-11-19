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
  const STORE_TR = "agents-lab:translation";
  const FOCUS_KEYS = ["toggle", "scene", "more", "grantToggle", "grantEdit", "target", "series", "act"];
  const $ = (s) => document.querySelector(s);

  const state = {
    target: "codex", series: "6.2", lang: "Simplified Chinese", customLang: false,
    overrides: { codex: {}, dot: {} },
    grants: [], open: new Set(), form: null, translate: true,
  };

  // ---------- persistence
  try { state.grants = JSON.parse(localStorage.getItem(STORE)) || []; } catch { state.grants = []; }
  try { state.translate = localStorage.getItem(STORE_TR) !== "off"; } catch { /* private mode */ }
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* private mode */ } };
  const saveGrants = () => save(STORE, JSON.stringify(state.grants));

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
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function badge(f) {
    return `<span class="badge ${f.evidence}" title="${esc(catalog.evidence_hint[f.evidence])}">${catalog.evidence[f.evidence]}</span>`;
  }

  function langControl() {
    const options = LANGS.map(([v, l]) => `<option value="${v}"${!state.customLang && v === state.lang ? " selected" : ""}>${l}</option>`).join("");
    return `<select id="lang" aria-label="对话语言">${options}<option value=""${state.customLang ? " selected" : ""}>其他…</option></select>`
      + (state.customLang ? `<input id="lang-custom" aria-label="对话语言的英文名" placeholder="English" value="${esc(state.lang)}">` : "");
  }

  function fragmentRow(f, view, label) {
    const on = view.included.has(f.id);
    const auto = Boolean(f.with);
    const forced = on && !auto && !view.chosen.has(f.id);
    const locked = auto || forced;
    const open = state.open.has(f.id);
    const tag = auto ? '<span class="tag">附带</span>' : forced ? `<span class="tag" title="${esc("「" + view.neededBy[f.id].join("」「") + "」需要它")}">依赖</span>` : "";
    const acts = (f.id === "language" ? langControl() : "") + (f.kind === "grant" ? `<button class="link" data-rewrite="${f.id}">改写</button>` : "");
    return `<div class="row${on ? " on" : ""}${locked ? " locked" : ""}" data-id="${f.id}">
      <label><input type="checkbox" data-toggle="${f.id}"${on ? " checked" : ""}${locked ? " disabled" : ""}><span class="t">${esc(label || f.title)}</span>${tag}</label>
      <span class="acts">${acts}${badge(f)}</span>
      ${f.note ? `<button class="more" data-more="${f.id}" aria-expanded="${open}" aria-label="依据">${CHEVRON}</button>` : "<span></span>"}
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

  // The preview is one <div> per line, so a translation can sit under the line it belongs to.
  function renderPreview(view, flash) {
    const out = $("#out");
    const top = out.scrollTop;
    const byId = new Map(view.result.selected.map((f) => [f.id, f]));
    const present = view.result.selected.map((f) => f.id);
    const langLabel = (LANGS.find(([v]) => v === state.lang) || [0, state.lang])[1];
    const nodes = [];
    for (const b of view.result.blocks) {
      if (b.sep === "\n\n") nodes.push(el("div", "gap", "\n"));
      const block = el("div", b.id ? "blk" : "blk h");
      if (b.id) block.dataset.id = b.id;
      const fragment = b.id && byId.get(b.id);
      let zh = null;
      if (state.translate) zh = b.id ? (fragment.zh ? AC.fill(fragment.zh, langLabel, present).split("\n") : null) : [view.target.headings[b.text]];
      b.text.split("\n").forEach((line, i) => {
        if (!line) return block.append(el("div", "gap", "\n"));
        block.append(el("div", b.id && line.startsWith("#") ? "ln h3" : "ln", line));
        if (zh && zh[i]) {
          const bullet = zh[i].startsWith("- ");
          block.append(el("div", bullet ? "tr bullet" : "tr", zh[i].replace(/^(#+ |- )/, "")));
        }
      });
      nodes.push(block);
    }
    out.replaceChildren(...nodes);
    out.scrollTop = top;

    const bytes = new TextEncoder().encode(view.result.text).length;
    const size = bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} KB`;
    for (const node of document.querySelectorAll("[data-size]")) node.textContent = size;
    for (const node of document.querySelectorAll("[data-act='copy'], [data-act='download']")) node.disabled = !bytes;
    $("[data-act='translate']").setAttribute("aria-pressed", state.translate);

    const target = flash && out.querySelector(`[data-id="${flash}"]`);
    if (target) {
      target.classList.add("flash");
      setTimeout(() => target.classList.remove("flash"), 900);
      const scrollsItself = out.scrollHeight > out.clientHeight + 1;
      const above = target.offsetTop < out.scrollTop;
      const below = target.offsetTop + Math.min(target.offsetHeight, out.clientHeight) > out.scrollTop + out.clientHeight;
      if (scrollsItself && (above || below)) out.scrollTo({ top: Math.max(0, target.offsetTop - 48), behavior: "smooth" });
    }
  }

  function renderControls(view) {
    $("#seg-target").innerHTML = Object.entries(catalog.targets).map(([id, t]) =>
      `<button role="radio" aria-checked="${id === state.target}" data-target="${id}">${esc(t.label)}</button>`).join("");
    $("#seg-series").innerHTML = catalog.series.map((s) =>
      `<button role="radio" aria-checked="${s.id === state.series}" data-series="${s.id}">${esc(s.label)}<small>${esc(s.models)}</small></button>`).join("");
    $("#status").innerHTML = rich(view.target.status[state.series]);
    $("#path").textContent = view.target.install;
  }

  // Re-rendering replaces the element that has focus; find its successor and put focus back.
  function focusSelector(node) {
    if (!node || node === document.body) return null;
    if (node.id) return "#" + node.id;
    for (const key of FOCUS_KEYS) {
      if (key in node.dataset) return `[data-${key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}="${node.dataset[key]}"]`;
    }
    return null;
  }
  function keepingFocus(work) {
    const active = document.activeElement;
    const selector = focusSelector(active);
    const caret = active && active.id === "lang-custom" ? [active.selectionStart, active.selectionEnd] : null;
    work();
    const next = selector && document.querySelector(selector);
    if (!next || next === document.activeElement) return;
    next.focus({ preventScroll: true });
    if (caret) next.setSelectionRange(...caret);
  }

  let last;
  function render(flash) {
    keepingFocus(() => {
      last = compute();
      renderControls(last);
      renderScenes(last);
      renderPreview(last, flash);
      writeHash(last);
    });
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

  function copyText(text, button) {
    const done = () => { const old = button.textContent; button.textContent = "已复制"; setTimeout(() => (button.textContent = old), 1200); };
    const fallback = () => {
      const area = el("textarea", "sr");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      done();
    };
    return navigator.clipboard ? navigator.clipboard.writeText(text).then(done, fallback) : fallback();
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
    if (d.more) {
      // Opening a note changes nothing in the file, so the preview is left alone.
      state.open.has(d.more) ? state.open.delete(d.more) : state.open.add(d.more);
      return keepingFocus(() => renderScenes(last));
    }
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
    if (d.act === "translate") { state.translate = !state.translate; save(STORE_TR, state.translate ? "on" : "off"); return render(); }
    if (d.act === "copy") return copyText(last.result.text, t);
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

  document.addEventListener("change", (e) => {
    if (e.target.id !== "lang") return;
    state.customLang = !e.target.value;
    state.lang = e.target.value || "English";
    render();
    if (state.customLang) { $("#lang-custom").focus(); $("#lang-custom").select(); }
  });
  document.addEventListener("input", (e) => {
    if (state.form && e.target.closest("#grant-form")) state.form.values[e.target.name] = e.target.value;
    if (e.target.id === "lang-custom" && !e.isComposing) { state.lang = e.target.value.trim() || "English"; render(); }
  });

  // hover links a row with its text in the preview, both ways
  const lit = (id, on) => { for (const node of document.querySelectorAll(`[data-id="${id}"]`)) node.classList.toggle("lit", on); };
  for (const type of ["mouseover", "mouseout"]) {
    document.addEventListener(type, (e) => {
      const node = e.target.closest && e.target.closest("[data-id]");
      if (node) lit(node.dataset.id, type === "mouseover");
    });
  }
  $("#out").addEventListener("click", (e) => {
    const block = e.target.closest("[data-id]");
    const row = block && document.querySelector(`.row[data-id="${block.dataset.id}"]`);
    if (row && !String(getSelection())) row.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });

  $("#link-repo").href = REPO;
  $("#link-skill").href = REPO + "/tree/main/skills/agents-composer";
  $("#link-research").href = REPO + "/blob/main/research/gpt-6.2-migration.md";
  addEventListener("hashchange", () => { readHash(); render(); });
  readHash();
  render();
})();
