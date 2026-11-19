// Mirror of skills/agents-composer/scripts/compose.py. `python tools/build.py --check` compares the two.
(function (root) {
  const WHEN = /\{\{when ([\w:.-]+)\|([^|}]*)(?:\|([^|}]*))?\}\}/g;
  const GRANT_ORDER = 360;
  const GRANT_FIELDS = [["scope", "Scope"], ["granted", "Granted"], ["why", "Why"], ["still_ask", "Still ask"], ["never", "Never"]];

  const isChinese = (language) => /chinese|中文|汉语|漢語/i.test(language);

  function available(target, series, language) {
    const zh = isChinese(language);
    return target.fragments.filter((f) => f.series.includes(series) && (f.locale !== "zh" || zh));
  }

  function defaults(fragments, series) {
    return new Set(fragments.filter((f) => f.default.includes(series) && !f.with).map((f) => f.id));
  }

  function grantFragment(grant, index, template) {
    const lines = GRANT_FIELDS.filter(([key]) => (grant[key] || "").trim()).map(([key, label]) => `- ${label}: ${grant[key].trim()}`);
    return {
      id: `grant-custom-${index + 1}`, order: GRANT_ORDER + index, kind: "grant",
      group: template.group, section: template.section,
      body: `### ${grant.name.trim()}\n\n` + lines.join("\n"),
    };
  }

  function resolve(fragments, chosen, grants = []) {
    const intro = fragments.find((f) => f.id === "grants-intro");
    const extra = intro ? grants.map((g, i) => grantFragment(g, i, intro)) : [];
    const pool = fragments.concat(extra);
    const byId = new Map(pool.map((f) => [f.id, f]));
    let picked = new Set([...chosen].filter((i) => byId.has(i) && !byId.get(i).with).concat(extra.map((f) => f.id)));
    for (;;) {
      const grown = new Set(picked);
      for (const i of picked) for (const r of byId.get(i).requires || []) if (byId.has(r)) grown.add(r);
      const hasGrant = [...grown].some((i) => byId.get(i).kind === "grant");
      for (const f of pool) {
        if ((f.with || []).some((w) => grown.has(w) || (w === "kind:grant" && hasGrant))) grown.add(f.id);
      }
      if (grown.size === picked.size) break;
      picked = grown;
    }
    return pool.filter((f) => picked.has(f.id)).sort((a, b) => a.order - b.order);
  }

  function fill(body, language, present) {
    const flags = new Set(present);
    if (isChinese(language)) flags.add("zh");
    const out = [];
    for (const line of body.split("\n")) {
      const filled = line.replace(WHEN, (_, key, then, otherwise) => (flags.has(key) ? then : otherwise || ""));
      if (filled || filled === line) out.push(filled.split("{{language}}").join(language));
    }
    return out.join("\n");
  }

  // [{ id: fragment id or null for a heading, sep: separator before the block, text }]
  function blocks(selected, language) {
    const present = selected.map((f) => f.id);
    const out = [];
    let group = null, section = null, prev = null;
    for (const f of selected) {
      const g = f.group || null, s = f.section || null;
      const heads = [];
      if (g && g !== group) heads.push(g);
      if (s && (g !== group || s !== section)) heads.push(s);
      if (g !== group || s !== section) prev = null;
      group = g; section = s;
      for (const h of heads) out.push({ id: null, sep: out.length ? "\n\n" : "", text: h });
      const body = fill(f.body, language, present);
      const tight = prev !== null && prev.split("\n").pop().startsWith("- ") && body.startsWith("- ");
      out.push({ id: f.id, sep: !out.length ? "" : tight ? "\n" : "\n\n", text: body });
      prev = body;
    }
    return out;
  }

  function compose(target, series, language, chosen, grants = []) {
    const fragments = available(target, series, language);
    const selected = resolve(fragments, chosen || defaults(fragments, series), grants);
    const parts = blocks(selected, language);
    const text = parts.map((b) => b.sep + b.text).join("");
    return { text: text ? text + "\n" : "", selected, blocks: parts };
  }

  root.AgentsCompose = { available, defaults, resolve, blocks, compose, fill, isChinese };
})(globalThis);
