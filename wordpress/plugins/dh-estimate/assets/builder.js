/* Estimate builder — edits DH_BUILDER.products (products → pages → questions → options). */
(function () {
  'use strict';
  const B = window.DH_BUILDER;
  const app = document.getElementById('dh-builder');
  if (!B || !app) return;

  let products = JSON.parse(JSON.stringify(B.products));
  let saved = JSON.stringify(products);
  let current = 0; // selected product index
  const open = new Set(); // expanded panels (keys)

  const TYPES = {
    single: 'Pick one',
    multi: 'Pick any (checkboxes)',
    text: 'Short text box',
    textarea: 'Long text box',
    number: 'Number (e.g. how many windows)',
    note: 'Information note (no answer)',
  };
  const LAYOUTS = { list: 'Text choices', cards: 'Photo cards', swatches: 'Small photo or colour tiles' };

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'item';
  const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
  const imgUrl = (p) => (!p ? '' : /^assets\//.test(p) ? B.themeBase + p : p);
  const dirty = () => JSON.stringify(products) !== saved;
  const asList = (c) => (!c ? [] : Array.isArray(c) ? c : [c]);
  const allQuestions = () => products.flatMap((pr) => pr.pages.flatMap((pg) => (pg.questions || []).map((q) => ({ q, product: pr, page: pg }))));
  const choiceQuestions = () => allQuestions().filter(({ q }) => q.type === 'single' || q.type === 'multi');

  function uniqueId(base, taken) {
    let id = slug(base);
    let n = 2;
    while (taken.includes(id)) id = `${slug(base)}-${n++}`;
    return id;
  }

  function move(list, i, d) {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
  }

  function pickImage(done) {
    const frame = window.wp.media({ title: 'Choose a photo', library: { type: 'image' }, multiple: false, button: { text: 'Use this photo' } });
    frame.on('select', () => {
      const a = frame.state().get('selection').first().toJSON();
      done((a.sizes && (a.sizes.medium_large || a.sizes.large || a.sizes.medium) || a).url);
    });
    frame.open();
  }

  /* ---------------- rendering ---------------- */
  function field(label, html, help) {
    return `<label class="dhb-field"><span class="dhb-field__label">${esc(label)}</span>${html}${help ? `<span class="dhb-help">${esc(help)}</span>` : ''}</label>`;
  }
  const input = (path, value, attrs = '') => `<input type="text" class="regular-text" data-path="${path}" value="${esc(value)}" ${attrs}>`;
  const area = (path, value, rows = 2) => `<textarea class="large-text" rows="${rows}" data-path="${path}">${esc(value)}</textarea>`;
  const check = (path, value, label) => `<label class="dhb-check"><input type="checkbox" data-path="${path}" ${value ? 'checked' : ''}> ${esc(label)}</label>`;
  const select = (path, value, opts) => `<select data-path="${path}">${Object.entries(opts).map(([k, v]) => `<option value="${esc(k)}" ${k === value ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>`;
  const tools = (action, path, i, n, removeLabel) => `
    <span class="dhb-tools">
      <button type="button" class="button-link" data-act="${action}-up" data-path="${path}" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
      <button type="button" class="button-link" data-act="${action}-down" data-path="${path}" data-i="${i}" ${i === n - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>
      <button type="button" class="button-link dhb-del" data-act="${action}-del" data-path="${path}" data-i="${i}">${esc(removeLabel)}</button>
    </span>`;

  function conditionEditor(path, cond, label, ownId) {
    const rules = asList(cond);
    const qs = choiceQuestions().filter(({ q }) => q.id !== ownId);
    const rows = rules.map((r, i) => {
      const target = qs.find(({ q }) => q.id === r.q);
      const options = target ? target.q.options || [] : [];
      return `
        <div class="dhb-rule">
          <span>Only when</span>
          <select data-cond="${path}" data-i="${i}" data-part="q">
            <option value="">— choose a question —</option>
            ${qs.map(({ q, product }) => `<option value="${esc(q.id)}" ${q.id === r.q ? 'selected' : ''}>${esc(product.label)}: ${esc((q.review || q.label).slice(0, 70))}</option>`).join('')}
          </select>
          <span>is</span>
          <span class="dhb-rule__values">${options.map((o) => `<label><input type="checkbox" data-cond="${path}" data-i="${i}" data-part="in" value="${esc(o.id)}" ${(r.in || []).includes(o.id) ? 'checked' : ''}> ${esc(o.label)}</label>`).join('') || '<em>pick a question first</em>'}</span>
          <button type="button" class="button-link dhb-del" data-act="rule-del" data-path="${path}" data-i="${i}">Remove rule</button>
        </div>`;
    }).join('');
    return `
      <div class="dhb-cond">
        <div class="dhb-field__label">${esc(label)}</div>
        ${rows || '<p class="dhb-help">Always shown.</p>'}
        <button type="button" class="button" data-act="rule-add" data-path="${path}">+ Add a rule</button>
        ${rules.length > 1 ? '<p class="dhb-help">All rules must match.</p>' : ''}
      </div>`;
  }

  function optionRow(qPath, q, o, i, n) {
    const p = `${qPath}.options.${i}`;
    const visual = q.layout === 'list'
      ? ''
      : `<button type="button" class="dhb-thumb" data-act="opt-img" data-path="${p}" title="Choose photo">${o.image ? `<img src="${esc(imgUrl(o.image))}" alt="">` : o.swatch ? `<span style="background:${esc(o.swatch)}"></span>` : '<em>+ photo</em>'}</button>`;
    return `
      <li class="dhb-opt">
        ${visual}
        <input type="text" data-path="${p}.label" value="${esc(o.label)}" placeholder="Option text">
        ${q.layout !== 'list' && (o.image || o.swatch) ? `<button type="button" class="button-link" data-act="opt-img-clear" data-path="${p}">Remove photo</button>` : ''}
        ${tools('opt', `${qPath}.options`, i, n, 'Delete')}
      </li>`;
  }

  function questionPanel(pPath, q, i, n) {
    const path = `${pPath}.questions.${i}`;
    const key = `q:${q.id}`;
    const isChoice = q.type === 'single' || q.type === 'multi';
    const summary = `${esc(q.label || '(no text yet)')}<small>${esc(TYPES[q.type] || q.type)}${q.required ? ' · required' : ''}${q.showIf ? ' · conditional' : ''}${isChoice ? ` · ${(q.options || []).length} options` : ''}</small>`;
    return `
      <details class="dhb-panel dhb-panel--q" data-key="${esc(key)}" ${open.has(key) ? 'open' : ''}>
        <summary><span class="dhb-sum">${summary}</span>${tools('q', `${pPath}.questions`, i, n, 'Delete question')}</summary>
        <div class="dhb-body">
          ${field(q.type === 'note' ? 'Note text' : 'Question', area(`${path}.label`, q.label, 2))}
          <div class="dhb-row">
            ${field('Type', select(`${path}.type`, q.type, TYPES))}
            ${isChoice ? field('Show options as', select(`${path}.layout`, q.layout || 'list', LAYOUTS)) : ''}
          </div>
          ${q.type === 'note' ? field('Second line (optional)', area(`${path}.more`, q.more || '', 2)) : ''}
          ${q.type === 'number' ? `
            <div class="dhb-row">
              ${field('What is being counted (plural)', input(`${path}.unit`, q.unit || '', 'placeholder="e.g. windows"'))}
              ${field('Quick-pick numbers (comma separated)', input(`${path}.picks`, (q.picks || []).join(', '), 'placeholder="1, 2, 3, 4, 5, 6, 8, 10, 12, 15"'))}
            </div>` : ''}
          ${q.type !== 'note' ? `
            <div class="dhb-row">
              ${field('Small help text under the question (optional)', input(`${path}.hint`, q.hint || ''))}
              ${field('Label in the email and summary', input(`${path}.review`, q.review || '', 'placeholder="Short label, e.g. Tub color"'))}
            </div>
            ${check(`${path}.required`, q.required, 'Customer must answer this')}` : ''}
          ${isChoice && q.layout !== 'list' ? check(`${path}.fit`, q.fit === 'contain', 'Photos are products on white (show the whole photo, not cropped)') : ''}
          ${isChoice ? `
            <div class="dhb-field__label">Options</div>
            <ul class="dhb-opts">${(q.options || []).map((o, j) => optionRow(path, q, o, j, q.options.length)).join('')}</ul>
            <button type="button" class="button" data-act="opt-add" data-path="${path}">+ Add option</button>` : ''}
          ${conditionEditor(`${path}.showIf`, q.showIf, 'Show this question', q.id)}
        </div>
      </details>`;
  }

  function pagePanel(prPath, pg, i, n) {
    const path = `${prPath}.pages.${i}`;
    const key = `p:${pg.id}`;
    const qs = pg.questions || [];
    const intro = pg.intro || null;
    return `
      <details class="dhb-panel dhb-panel--page" data-key="${esc(key)}" ${open.has(key) ? 'open' : ''}>
        <summary><span class="dhb-sum"><b>Page ${i + 1}:</b> ${esc(pg.titleQuestion && qs[0] ? qs[0].label : pg.title || '(untitled page)')}<small>${qs.length} question${qs.length === 1 ? '' : 's'}${pg.photos ? ' · photo upload' : ''}${pg.when ? ' · conditional' : ''}</small></span>${tools('page', `${prPath}.pages`, i, n, 'Delete page')}</summary>
        <div class="dhb-body">
          ${pg.titleQuestion ? '<p class="dhb-help">This page uses its first question as the heading.</p>' : field('Page heading', input(`${path}.title`, pg.title))}
          <div class="dhb-row">
            ${field('Small label above the heading (optional)', input(`${path}.kicker`, pg.kicker || ''))}
            ${field('Section name in the email and summary', input(`${path}.review`, pg.review || '', 'placeholder="Defaults to the heading"'))}
          </div>
          ${field('Text under the heading (optional)', area(`${path}.desc`, pg.desc || '', 2))}
          ${check(`${path}.hasIntro`, !!intro, 'Show a dark intro box at the top')}
          ${intro ? `
            <div class="dhb-row">
              ${field('Intro icon', select(`${path}.intro.icon`, intro.icon || 'sparkle', Object.fromEntries(B.icons.map((x) => [x, x]))))}
              ${field('Intro title', input(`${path}.intro.title`, intro.title || ''))}
            </div>
            ${field('Intro text', area(`${path}.intro.text`, intro.text || '', 2))}` : ''}
          ${check(`${path}.hasPhotos`, !!pg.photos, 'Ask for photos on this page (photo uploader)')}
          ${conditionEditor(`${path}.when`, pg.when, 'Show this page')}
          <div class="dhb-field__label dhb-mt">Questions</div>
          <div class="dhb-list">${qs.map((q, j) => questionPanel(path, q, j, qs.length)).join('')}</div>
          <button type="button" class="button" data-act="q-add" data-path="${path}">+ Add question</button>
        </div>
      </details>`;
  }

  function render() {
    const pr = products[current];
    const prPath = `${current}`;
    app.innerHTML = `
      <div class="dhb-bar">
        <button type="button" class="button button-primary" data-act="save" ${dirty() ? '' : 'disabled'}>${dirty() ? 'Save changes' : 'All changes saved'}</button>
        <button type="button" class="button" data-act="discard" ${dirty() ? '' : 'disabled'}>Discard changes</button>
        <a class="button" href="${esc(B.siteUrl)}" target="_blank" rel="noopener">View the estimate ↗</a>
        <span class="dhb-bar__spacer"></span>
        <button type="button" class="button-link" data-act="export">Export</button>
        <button type="button" class="button-link" data-act="import">Import</button>
        <button type="button" class="button-link dhb-del" data-act="reset">Reset to the original setup</button>
        <span class="dhb-status" role="status" aria-live="polite"></span>
      </div>
      <div class="dhb-cols">
        <nav class="dhb-products" aria-label="Projects">
          <div class="dhb-field__label">Projects customers can choose</div>
          <ol>${products.map((p, i) => `
            <li class="${i === current ? 'is-current' : ''}">
              <button type="button" class="dhb-product" data-act="select" data-i="${i}">${p.card && p.card.image ? `<img src="${esc(imgUrl(p.card.image))}" alt="">` : ''}<span>${esc(p.label || '(unnamed)')}<small>${p.pages.length} pages</small></span></button>
              ${tools('product', 'root', i, products.length, '✕')}
            </li>`).join('')}</ol>
          <button type="button" class="button" data-act="product-add">+ Add project</button>
        </nav>
        <section class="dhb-main">
          ${pr ? `
            <div class="dhb-card">
              <div class="dhb-row">
                ${field('Project name', input(`${prPath}.label`, pr.label))}
                ${field('Card text (under the name)', input(`${prPath}.card.text`, (pr.card && pr.card.text) || ''))}
              </div>
              <div class="dhb-field__label">Card photo</div>
              <button type="button" class="dhb-thumb dhb-thumb--wide" data-act="card-img" data-path="${prPath}">${pr.card && pr.card.image ? `<img src="${esc(imgUrl(pr.card.image))}" alt="">` : '<em>+ photo</em>'}</button>
            </div>
            <div class="dhb-list">${pr.pages.map((pg, i) => pagePanel(prPath, pg, i, pr.pages.length)).join('')}</div>
            <button type="button" class="button" data-act="page-add" data-path="${prPath}">+ Add page</button>` : '<p>Add a project to start.</p>'}
        </section>
      </div>`;
  }

  /* ---------------- state access ---------------- */
  function resolve(path) {
    // "0.pages.2.questions.1.label" -> [parent object, last key]
    const parts = path.split('.');
    let obj = products;
    for (let i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] == null) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    return [obj, parts[parts.length - 1]];
  }
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), products);

  function status(text) {
    const el = app.querySelector('.dhb-status');
    if (el) el.textContent = text;
  }

  function changed({ rerender = false } = {}) {
    if (rerender) {
      render();
      return;
    }
    const save = app.querySelector('[data-act="save"]');
    const discard = app.querySelector('[data-act="discard"]');
    if (save) { save.disabled = !dirty(); save.textContent = dirty() ? 'Save changes' : 'All changes saved'; }
    if (discard) discard.disabled = !dirty();
  }

  /* ---------------- events ---------------- */
  app.addEventListener('toggle', (e) => {
    const d = e.target.closest('details[data-key]');
    if (d) (d.open ? open.add : open.delete).call(open, d.dataset.key);
  }, true);

  app.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.dataset.path || el.type === 'checkbox' || el.tagName === 'SELECT') return;
    const [obj, key] = resolve(el.dataset.path);
    obj[key] = el.value;
    changed();
  });

  app.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.cond) {
      const list = asList(get(el.dataset.cond)).map((r) => ({ q: r.q, in: [...(r.in || [])] }));
      const rule = list[Number(el.dataset.i)];
      if (el.dataset.part === 'q') {
        rule.q = el.value;
        rule.in = [];
      } else {
        rule.in = el.checked ? [...new Set([...rule.in, el.value])] : rule.in.filter((v) => v !== el.value);
      }
      const [obj, key] = resolve(el.dataset.cond);
      obj[key] = list;
      changed({ rerender: el.dataset.part === 'q' });
      return;
    }
    if (!el.dataset.path) return;
    const path = el.dataset.path;
    const [obj, key] = resolve(path);
    if (key === 'hasIntro') {
      if (el.checked) obj.intro = { icon: 'sparkle', title: '', text: '' };
      else delete obj.intro;
      return changed({ rerender: true });
    }
    if (key === 'hasPhotos') {
      if (el.checked) obj.photos = {};
      else delete obj.photos;
      return changed({ rerender: true });
    }
    if (el.type === 'checkbox') {
      if (key === 'fit') {
        if (el.checked) obj.fit = 'contain';
        else delete obj.fit;
      } else if (el.checked) obj[key] = true;
      else delete obj[key];
      return changed();
    }
    if (key === 'picks') {
      const picks = el.value.split(/[\s,]+/).map(Number).filter((n) => Number.isInteger(n) && n > 0 && n < 1000);
      if (picks.length) obj.picks = [...new Set(picks)].slice(0, 12);
      else delete obj.picks;
      return changed();
    }
    obj[key] = el.value;
    if (key === 'type') {
      if ((el.value === 'single' || el.value === 'multi') && !obj.options) { obj.options = []; obj.layout = obj.layout || 'list'; }
      if (el.value !== 'single' && el.value !== 'multi') { delete obj.layout; }
      if (el.value === 'note') delete obj.required;
      if (el.value !== 'number') { delete obj.unit; delete obj.unitOne; delete obj.picks; }
    }
    changed({ rerender: key === 'type' || key === 'layout' });
  });

  app.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    if (btn.closest('summary')) e.preventDefault(); // tool buttons inside a <summary> must not toggle it
    const act = btn.dataset.act;
    const path = btn.dataset.path;
    const i = Number(btn.dataset.i);
    const listAt = (p) => (p === 'root' ? products : get(p));

    if (act === 'select') { current = i; return render(); }
    if (/-(up|down)$/.test(act)) {
      const list = listAt(path);
      move(list, i, act.endsWith('up') ? -1 : 1);
      if (path === 'root' && current === i) current = i + (act.endsWith('up') ? -1 : 1);
      return changed({ rerender: true });
    }
    if (/-del$/.test(act) && act !== 'rule-del') {
      const list = listAt(path);
      const what = { product: 'this project and all its pages', page: 'this page and its questions', q: 'this question', opt: 'this option' }[act.split('-')[0]];
      if (!window.confirm(`Delete ${what}? Customers will no longer see it.`)) return;
      list.splice(i, 1);
      if (path === 'root') current = Math.max(0, Math.min(current, products.length - 1));
      return changed({ rerender: true });
    }
    if (act === 'rule-add') {
      const [obj, key] = resolve(path);
      obj[key] = [...asList(obj[key]), { q: '', in: [] }];
      return changed({ rerender: true });
    }
    if (act === 'rule-del') {
      const [obj, key] = resolve(path);
      const list = asList(obj[key]).filter((_, j) => j !== i);
      if (list.length) obj[key] = list; else delete obj[key];
      return changed({ rerender: true });
    }
    if (act === 'product-add') {
      const label = window.prompt('Name of the new project (for example "Gutters")');
      if (!label) return;
      products.push({ id: uniqueId(label, products.map((p) => p.id)), label, card: { text: '', image: '' }, pages: [] });
      current = products.length - 1;
      return changed({ rerender: true });
    }
    if (act === 'page-add') {
      const pr = get(path);
      const prefix = (pr.id || 'p').slice(0, 2);
      pr.pages.push({ id: uniqueId(`${prefix}-page`, allPageIds()), title: 'New page', questions: [] });
      open.add(`p:${pr.pages[pr.pages.length - 1].id}`);
      return changed({ rerender: true });
    }
    if (act === 'q-add') {
      const pg = get(path);
      const q = { id: uniqueId('q', allQuestions().map((x) => x.q.id)), label: '', type: 'single', layout: 'list', required: true, options: [] };
      pg.questions = pg.questions || [];
      pg.questions.push(q);
      open.add(`q:${q.id}`);
      return changed({ rerender: true });
    }
    if (act === 'opt-add') {
      const q = get(path);
      q.options = q.options || [];
      q.options.push({ id: uniqueId('option', q.options.map((o) => o.id)), label: '' });
      changed({ rerender: true });
      const inputs = app.querySelectorAll(`[data-path^="${path}.options."][data-path$=".label"]`);
      if (inputs.length) inputs[inputs.length - 1].focus();
      return;
    }
    if (act === 'opt-img' || act === 'card-img') {
      pickImage((url) => {
        const obj = get(path);
        if (act === 'card-img') { obj.card = obj.card || {}; obj.card.image = url; } else { obj.image = url; delete obj.swatch; }
        changed({ rerender: true });
      });
      return;
    }
    if (act === 'opt-img-clear') {
      const obj = get(path);
      delete obj.image;
      delete obj.swatch;
      return changed({ rerender: true });
    }
    if (act === 'discard') {
      if (!window.confirm('Discard all unsaved changes?')) return;
      products = JSON.parse(saved);
      current = Math.min(current, products.length - 1);
      return render();
    }
    if (act === 'save') return save();
    if (act === 'reset') {
      if (!window.confirm('Put the whole estimate back to the original setup? Every change made here will be lost.')) return;
      const res = await request('DELETE');
      if (res) { products = res.products; saved = JSON.stringify(products); current = 0; render(); status('Original setup restored.'); }
      return;
    }
    if (act === 'export') {
      const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `estimate-setup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      return;
    }
    if (act === 'import') {
      const file = document.createElement('input');
      file.type = 'file';
      file.accept = 'application/json,.json';
      file.onchange = async () => {
        try {
          const data = JSON.parse(await file.files[0].text());
          if (!Array.isArray(data) || !data.every((p) => p.id && Array.isArray(p.pages))) throw new Error('shape');
          products = data;
          current = 0;
          render();
          status('Imported — review it, then click Save changes.');
        } catch (err) {
          window.alert('That file is not an estimate setup exported from this screen.');
        }
      };
      file.click();
    }
  });

  const allPageIds = () => products.flatMap((p) => p.pages.map((pg) => pg.id));

  async function request(method, body) {
    try {
      const res = await fetch(B.restUrl, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': B.nonce },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data && data.message ? data.message : res.status);
      return data;
    } catch (err) {
      status(`Not saved: ${err.message}. Your changes are still here — try again.`);
      return null;
    }
  }

  async function save() {
    const problems = validate();
    if (problems.length) {
      window.alert(`Please fix these first:\n\n• ${problems.slice(0, 8).join('\n• ')}`);
      return;
    }
    status('Saving…');
    const res = await request('POST', products);
    if (!res) return;
    products = res.products;
    saved = JSON.stringify(products);
    render();
    status('Saved. The estimate is updated.');
  }

  function validate() {
    const out = [];
    products.forEach((pr) => {
      if (!pr.label) out.push('A project has no name.');
      pr.pages.forEach((pg, i) => {
        if (!pg.titleQuestion && !pg.title) out.push(`${pr.label || 'A project'}: page ${i + 1} has no heading.`);
        (pg.questions || []).forEach((q) => {
          if (!q.label) out.push(`${pr.label}: a question on page ${i + 1} has no text.`);
          if ((q.type === 'single' || q.type === 'multi') && !(q.options || []).length) out.push(`${pr.label}: "${(q.label || 'a question').slice(0, 50)}" has no options.`);
          (q.options || []).forEach((o) => { if (!o.label) out.push(`${pr.label}: an option in "${(q.label || '').slice(0, 40)}" has no text.`); });
        });
      });
    });
    return out;
  }

  window.addEventListener('beforeunload', (e) => {
    if (dirty()) { e.preventDefault(); e.returnValue = ''; }
  });

  render();
})();
