// ============================================================
// researchmap からデータを取得してページを描画するスクリプト。
// 表示内容の変更は data.js 側で行ってください。
// ============================================================

const RM_API = "https://api.researchmap.jp";
const RM_PAGE = `https://researchmap.jp/${SITE_CONFIG.researchmapId}`;

// ---- 小さな道具 ----

// HTMLに埋め込む前に必ずこれを通す(外部データをそのまま埋め込まない)
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// researchmap の多言語フィールド {ja: "...", en: "..."} から日本語優先で取り出す
function ja(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field.ja || field.en || "";
}

// "2015-04" → "2015年4月"、"9999" → "現在"
function fmtYm(s) {
  if (!s) return "";
  if (String(s).startsWith("9999")) return "現在";
  const [y, m] = String(s).split("-");
  return m ? `${y}年${Number(m)}月` : `${y}年`;
}

function dateParts(s) {
  const value = String(s || "");
  if (value.includes("T")) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  }
  const [y, m, d] = value.slice(0, 10).split("-");
  return d ? [Number(y), Number(m), Number(d)] : [];
}

function fmtDate(s) {
  if (!s) return "";
  const [y, m, d] = dateParts(s);
  if (d) return `${y}年${m}月${d}日`;
  return fmtYm(s);
}

function fmtShortDate(s) {
  if (!s) return "";
  const [y, m, d] = dateParts(s);
  return d ? `${y}.${m}.${d}` : fmtYm(s);
}

// ---- researchmap API(キャッシュつき取得)----

async function fetchRm(path) {
  const url = `${RM_API}/${SITE_CONFIG.researchmapId}${path}`;
  const key = `rm-cache:${url}`;
  const ttlMs = (SITE_CONFIG.cacheHours || 6) * 60 * 60 * 1000;

  try {
    const hit = JSON.parse(localStorage.getItem(key));
    if (hit && Date.now() - hit.t < ttlMs) return hit.data;
  } catch (_) { /* キャッシュが読めなくても取得に進む */ }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`researchmap API error: ${res.status}`);
  const data = await res.json();

  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), data }));
  } catch (_) { /* 保存できなくても表示はできる */ }
  return data;
}

function fallbackHtml(label) {
  return `<div class="fallback-card">${esc(label)}を読み込めませんでした。
    <a href="${RM_PAGE}" target="_blank" rel="noopener">researchmap のページ</a>でご覧ください。</div>`;
}

// ---- data.js から描画するセクション(通信不要)----

function renderNews() {
  const list = document.getElementById("news-list");
  const items = SITE_CONFIG.news || [];
  if (items.length === 0) {
    list.innerHTML = `<li><span class="news-date">—</span><span>お知らせはまだありません。</span></li>`;
    return;
  }
  const newsItem = (n) => `<li><span class="news-date">${esc(fmtDate(n.date))}</span><span>${esc(n.text)}</span></li>`;
  list.innerHTML = items.slice(0, 3)
    .map(newsItem)
    .join("");
  const archive = document.getElementById("news-archive");
  archive.hidden = items.length <= 3;
  document.getElementById("news-archive-list").innerHTML = items.slice(3).map(newsItem).join("");
}

const arrowIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const expandIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg>';

function toolPreview(tool, featured = false) {
  if (!tool.screenshot) return '<p class="screen-unavailable">操作画面は準備中です。</p>';
  return `<figure class="tool-screen">
    <button type="button" class="screen-button" data-screen="${esc(tool.repo)}" aria-label="${esc(tool.name)}の画面を拡大">
      <img src="${esc(tool.screenshot)}" alt="${esc(tool.name)}：${esc(tool.screenshotLabel || "操作画面")}" loading="${featured ? "eager" : "lazy"}" ${featured ? 'fetchpriority="high"' : ""} decoding="async" width="1440" height="900" style="object-position:${esc(tool.imagePosition || "center top")}">
      <span class="screen-expand">画面を拡大 ${expandIcon}</span>
    </button>
    <figcaption>${esc(tool.screenshotLabel || "実際の操作画面")}</figcaption>
  </figure>`;
}

function visibleTools() {
  return (SITE_CONFIG.tools || []).filter((t) => t.show && t.repo !== "virtual-ride");
}

function githubReadmeUrl(t) {
  return t.readmeUrl || `https://github.com/${SITE_CONFIG.githubUser}/${encodeURIComponent(t.repo)}#readme`;
}

function toolReleaseInfoValues(version, updatedAt, repo = "") {
  const details = [];
  if (version) details.push(`<span>v${esc(String(version).replace(/^v/i, ""))}</span>`);
  if (updatedAt) details.push(`<span>更新 ${esc(fmtShortDate(updatedAt))}</span>`);
  const syncAttribute = repo ? ` data-release-for="${esc(repo)}"` : "";
  return details.length ? `<span class="tool-release-info"${syncAttribute}>${details.join("<i aria-hidden=\"true\">・</i>")}</span>` : "";
}

function toolReleaseInfo(t) {
  return toolReleaseInfoValues(t.version, t.updatedAt, t.releaseSync ? t.repo : "");
}

function replaceReleaseInfo(target, version, updatedAt) {
  const details = [];
  if (version) {
    const versionElement = document.createElement("span");
    versionElement.textContent = `v${String(version).replace(/^v/i, "")}`;
    details.push(versionElement);
  }
  if (updatedAt) {
    const updatedElement = document.createElement("span");
    updatedElement.textContent = `更新 ${fmtShortDate(updatedAt)}`;
    details.push(updatedElement);
  }
  target.replaceChildren(...details.flatMap((detail, index) => {
    if (index === 0) return [detail];
    const separator = document.createElement("i");
    separator.setAttribute("aria-hidden", "true");
    separator.textContent = "・";
    return [separator, detail];
  }));
}

async function refreshReleaseInfo() {
  const tools = visibleTools().filter((tool) => tool.releaseSync && tool.repo);
  await Promise.all(tools.map(async (tool) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(SITE_CONFIG.githubUser)}/${encodeURIComponent(tool.repo)}/releases/latest`, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store"
      });
      if (!response.ok) return;
      const release = await response.json();
      if (!release.tag_name) return;
      const target = document.querySelector(`[data-release-for="${tool.repo}"]`);
      if (target) replaceReleaseInfo(target, release.tag_name, release.published_at || release.created_at || tool.updatedAt);
    } catch {
      // GitHubへ接続できない場合は、data.js の表示値をそのまま使う。
    }
  }));
}

function toolCard(t) {
  const prototype = t.stage === "prototype";
  return `<article class="tool-card${prototype ? " is-prototype" : ""}" data-tool="${esc(t.repo)}">
    ${toolPreview(t)}
    <div class="tool-card-labels"><p class="tool-platform">${esc(t.platform || t.tags?.[0] || "アプリ")}</p>${prototype ? '<span class="stage-badge">試作中</span>' : ""}</div>
    <h3>${esc(t.name)}</h3>
    <p class="tool-description">${esc(t.summary || t.description)}</p>
    <div class="tool-actions">
      <a class="tool-open app-link" data-tool-id="${esc(t.repo)}" href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.cta || "アプリを開く")} ${arrowIcon}</a>
      <div class="tool-secondary-actions">
        <a class="readme-button" href="${esc(githubReadmeUrl(t))}" target="_blank" rel="noopener" aria-label="${esc(t.name)}のGitHub READMEを見る">README</a>
        <button class="plain-button discussion-jump" data-tool-id="${esc(t.repo)}" type="button">感想・質問</button>
      </div>
    </div>
    <div class="tool-meta">
      <details class="tool-data-note"><summary>できること・データの扱い</summary><p>${esc(t.description)}</p><p>${esc(t.privacyDetail || "詳しくはアプリのREADMEをご確認ください。")}</p>${toolReleaseInfo(t)}</details>
      <span class="tool-count" data-count-for="${esc(t.repo)}">集計準備中</span>
    </div>
  </article>`;
}

let activeToolFilter = "all";

function renderTools() {
  const lead = document.getElementById("tools-lead");
  if (lead) lead.textContent = SITE_CONFIG.text?.toolsLead || "";
  const tools = visibleTools();
  const featured = tools.find((t) => t.repo === SITE_CONFIG.featuredRepo) || tools.find((t) => t.stage !== "prototype");
  const feature = document.getElementById("featured-tool");
  if (feature && featured) {
    feature.innerHTML = `${toolPreview(featured, true)}<div class="featured-copy">
      <h2 id="featured-title">${esc(featured.name)}</h2>
      <p>${esc(featured.featuredCopy || featured.summary || featured.description)}</p>
      <a class="app-link tool-open" data-tool-id="${esc(featured.repo)}" href="${esc(featured.url)}" target="_blank" rel="noopener">${esc(featured.cta || "使ってみる")} ${arrowIcon}</a>
    </div>`;
  }
  const grid = document.getElementById("tool-grid");
  if (!grid) return;
  const ready = tools.filter((t) => t.stage !== "prototype");
  const prototypes = tools.filter((t) => t.stage === "prototype");
  grid.innerHTML = `<div class="tool-grid ready-grid">${ready.map(toolCard).join("")}</div>
    ${prototypes.length ? `<details class="prototype-group" id="prototype-group"><summary><span>公開中の試作アプリも見る <small id="prototype-count">${prototypes.length}件</small></span><span class="prototype-hint">開発中のものは、こちらにまとめています。</span></summary><div class="tool-grid">${prototypes.map(toolCard).join("")}</div></details>` : ""}`;
  filterTools();
}

function filterTools() {
  const query = (document.getElementById("tool-search")?.value || "").normalize("NFKC").toLocaleLowerCase("ja").trim();
  const words = query.split(/\s+/).filter(Boolean);
  let readyCount = 0, prototypeCount = 0;
  for (const t of visibleTools()) {
    const haystack = [t.name, t.repo, t.summary, t.description, t.platform, ...(t.tags || [])].join(" ").normalize("NFKC").toLocaleLowerCase("ja");
    const matches = (activeToolFilter === "all" || (t.audiences || []).includes(activeToolFilter)) && words.every((word) => haystack.includes(word));
    const card = document.querySelector(`[data-tool="${t.repo}"]`);
    if (card) card.hidden = !matches;
    if (matches) t.stage === "prototype" ? prototypeCount++ : readyCount++;
  }
  const count = document.getElementById("tool-result-count");
  if (count) count.textContent = `${readyCount}件のアプリ${prototypeCount ? `・試作 ${prototypeCount}件` : ""}`;
  const prototypes = document.getElementById("prototype-group");
  if (prototypes) {
    prototypes.hidden = prototypeCount === 0;
    if (query) prototypes.open = prototypeCount > 0;
    const prototypeLabel = document.getElementById("prototype-count");
    if (prototypeLabel) prototypeLabel.textContent = `${prototypeCount}件`;
  }
  const empty = document.getElementById("catalog-empty");
  if (empty) empty.hidden = readyCount + prototypeCount !== 0;
}

function bindCatalogInteractions() {
  const search = document.getElementById("tool-search");
  search?.addEventListener("input", filterTools);
  const filters = [...document.querySelectorAll("[data-tool-filter]")];
  const chooseFilter = (value) => {
    activeToolFilter = value;
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.toolFilter === value)));
    filterTools();
  };
  filters.forEach((button) => button.addEventListener("click", () => chooseFilter(button.dataset.toolFilter)));
  document.getElementById("clear-tool-filters")?.addEventListener("click", () => {
    search.value = "";
    chooseFilter("all");
    search.focus();
  });
  const dialog = document.getElementById("screen-dialog");
  let opener = null;
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-screen]");
    if (!button || !dialog) return;
    const t = visibleTools().find((tool) => tool.repo === button.dataset.screen);
    if (!t?.screenshot) return;
    opener = button;
    document.getElementById("screen-dialog-title").textContent = t.name;
    document.getElementById("screen-dialog-caption").textContent = t.screenshotLabel || "実際の操作画面";
    const img = document.getElementById("screen-dialog-image");
    img.src = t.screenshot;
    img.alt = `${t.name}：${t.screenshotLabel || "操作画面"}`;
    document.getElementById("screen-original-link").href = t.screenshot;
    const link = document.getElementById("screen-dialog-link");
    link.href = t.url;
    link.dataset.toolId = t.repo;
    link.textContent = t.cta || "アプリを開く";
    dialog.showModal();
    document.querySelector(".screen-dialog-image").scrollTop = 0;
  });
  document.getElementById("screen-dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog?.addEventListener("close", () => { if (opener?.isConnected) opener.focus(); });
}

function renderContact() {
  const card = document.getElementById("contact-card");
  const c = SITE_CONFIG.contact || {};
  const note = `<p>${esc(c.note || "お問い合わせはこちらからどうぞ。")}</p>`;
  if (c.googleFormUrl) {
    card.innerHTML =
      note +
      `<a class="contact-button" href="${esc(c.googleFormUrl)}" target="_blank" rel="noopener">メッセージを送る</a>`;
  } else {
    card.innerHTML =
      note +
      `<p style="font-size:0.85rem;color:var(--color-text-soft)">(メッセージフォームは準備中です)</p>`;
  }
}

function renderInterests() {
  const section = document.getElementById("interests");
  const cfg = SITE_CONFIG.interests || {};
  const items = (cfg.items || []).filter((t) => String(t).trim());

  // 中身が空ならセクションごと隠す（applyLayout がこの印を見て並びから外す）
  if (items.length === 0) {
    section.dataset.empty = "true";
    return;
  }
  section.dataset.empty = "false";

  if (cfg.heading) document.getElementById("interests-heading").textContent = cfg.heading;
  const lead = document.getElementById("interests-lead");
  if (cfg.lead) {
    lead.textContent = cfg.lead;
    lead.hidden = false;
  }
  document.getElementById("interest-list").innerHTML = items
    .map((t) => `<li>${esc(t)}</li>`)
    .join("");
}

// ---- セクションの並び順・表示/非表示を data.js の sectionOrder で反映 ----

const SECTION_LABELS = {
  interests: "関心のあるテーマ",
  news: "お知らせ",
  tools: "公開ツール",
  publications: "研究業績",
  career: "経歴",
  contact: "連絡先",
};
const DEFAULT_ORDER = ["interests", "news", "tools", "publications", "career", "contact"];

function applyLayout() {
  const main = document.querySelector("main");
  const nav = document.getElementById("nav-links");
  const order = (SITE_CONFIG.sectionOrder || DEFAULT_ORDER).filter((k) => SECTION_LABELS[k]);

  // まず対象セクションを全部隠し、順番どおりに出し直す
  Object.keys(SECTION_LABELS).forEach((k) => {
    const el = document.querySelector(`[data-section="${k}"]`);
    if (el) el.hidden = true;
  });

  const navLinks = [];
  order.forEach((key) => {
    const el = document.querySelector(`[data-section="${key}"]`);
    if (!el || el.dataset.empty === "true") return; // 中身が空のものは並びから外す
    el.hidden = false;
    main.appendChild(el); // sectionOrder の順に並べ直す
    navLinks.push(`<a href="#${key}">${esc(SECTION_LABELS[key])}</a>`);
  });
  nav.innerHTML = navLinks.join("");
}

// ---- researchmap から描画するセクション ----

async function renderProfile() {
  const p = await fetchRm("");

  const nameJa = `${ja(p.family_name)} ${ja(p.given_name)}`.trim();
  const kana = `${p.family_name?.["ja-Kana"] || ""} ${p.given_name?.["ja-Kana"] || ""}`.trim();
  const nameEn = `${p.given_name?.en || ""} ${p.family_name?.en || ""}`.trim();

  document.getElementById("name-main").textContent = nameJa || nameEn;
  document.getElementById("name-kana").textContent =
    [kana, nameEn].filter(Boolean).join(" / ");
  const aff = (p.affiliations || [])
    .map((a) => [ja(a.affiliation), ja(a.section), ja(a.job)].filter(Boolean).join(" "))
    .join(" ／ ");
  const degrees = (p.degrees || [])
    .map((d) => ja(d.degree))
    .filter(Boolean)
    .join("・");
  document.getElementById("affiliation-main").textContent =
    [aff, degrees].filter(Boolean).join(" ／ ");

  const links = [`<a href="${RM_PAGE}" target="_blank" rel="noopener">researchmap</a>`];
  const orcid = p.identifiers?.orc_id?.[0];
  if (orcid) {
    links.push(`<a href="https://orcid.org/${esc(orcid)}" target="_blank" rel="noopener">ORCID</a>`);
  }
  document.getElementById("profile-links").innerHTML = links.join("");

  document.getElementById("footer-line").textContent =
    `© ${new Date().getFullYear()} ${SITE_CONFIG.siteName} — 研究情報は researchmap から取得`;
}

async function renderKeywords() {
  const d = await fetchRm("/research_interests?limit=100");
  const words = (d.items || [])
    .flatMap((i) => ja(i.keyword).split("/"))
    .map((w) => w.trim())
    .filter(Boolean);
  document.getElementById("research-keywords").innerHTML = words
    .map((w) => `<span class="keyword-chip">${esc(w)}</span>`)
    .join("");
}

// 年ごとに区切ったリストを作る(論文・発表で共通)
function groupedListHtml(items, itemHtml) {
  const groups = new Map();
  for (const it of items) {
    const year = (it.publication_date || "").slice(0, 4) || "年不明";
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(it);
  }
  const years = [...groups.keys()].sort((a, b) => b.localeCompare(a));
  return years
    .map(
      (y) =>
        `<div class="pub-year">${esc(y === "年不明" ? y : y + "年")}</div>
         <ul class="pub-list">${groups.get(y).map(itemHtml).join("")}</ul>`
    )
    .join("");
}

function personNames(field) {
  const arr = field?.ja?.length ? field.ja : field?.en || [];
  return arr.map((a) => a.name).filter(Boolean).join(", ");
}

function paperHtml(p) {
  const doi = p.identifiers?.doi?.[0];
  const meta = [personNames(p.authors), ja(p.publication_name), fmtYm(p.publication_date)]
    .filter(Boolean)
    .join(" — ");
  return `<li>
    <span class="pub-title">${esc(ja(p.paper_title))}</span>
    ${p.referee ? `<span class="pub-badge">査読あり</span>` : ""}
    ${doi ? `<a class="pub-doi" href="https://doi.org/${esc(doi)}" target="_blank" rel="noopener">DOI</a>` : ""}
    <span class="pub-meta">${esc(meta)}</span>
  </li>`;
}

function presentationHtml(p) {
  const meta = [personNames(p.presenters), ja(p.event), fmtDate(p.publication_date)]
    .filter(Boolean)
    .join(" — ");
  return `<li>
    <span class="pub-title">${esc(ja(p.presentation_title))}</span>
    ${p.invited ? `<span class="pub-badge">招待</span>` : ""}
    <span class="pub-meta">${esc(meta)}</span>
  </li>`;
}

async function renderPublications() {
  const body = document.getElementById("publications-body");
  try {
    const [papers, talks] = await Promise.all([
      fetchRm("/published_papers?limit=100"),
      fetchRm("/presentations?limit=100"),
    ]);
    const paperItems = (papers.items || []).slice()
      .sort((a, b) => (b.publication_date || "").localeCompare(a.publication_date || ""));
    const talkItems = (talks.items || []).slice()
      .sort((a, b) => (b.publication_date || "").localeCompare(a.publication_date || ""));

    body.innerHTML = `
      <div class="pub-tabs">
        <button class="pub-tab active" data-tab="papers">論文 (${paperItems.length})</button>
        <button class="pub-tab" data-tab="talks">学会発表 (${talkItems.length})</button>
      </div>
      <div id="pub-panel-papers">${groupedListHtml(paperItems, paperHtml)}</div>
      <div id="pub-panel-talks" hidden>${groupedListHtml(talkItems, presentationHtml)}</div>`;

    body.querySelectorAll(".pub-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        body.querySelectorAll(".pub-tab").forEach((b) => b.classList.toggle("active", b === btn));
        document.getElementById("pub-panel-papers").hidden = btn.dataset.tab !== "papers";
        document.getElementById("pub-panel-talks").hidden = btn.dataset.tab !== "talks";
      });
    });
  } catch (e) {
    console.error(e);
    body.innerHTML = fallbackHtml("研究業績");
  }
}

async function renderCareer() {
  const body = document.getElementById("career-body");
  try {
    const [exp, edu] = await Promise.all([
      fetchRm("/research_experience?limit=100"),
      fetchRm("/education?limit=100"),
    ]);
    const expItems = (exp.items || []).slice()
      .sort((a, b) => (b.from_date || "").localeCompare(a.from_date || ""));
    const eduItems = (edu.items || []).slice()
      .sort((a, b) => (b.from_date || "").localeCompare(a.from_date || ""));

    const expHtml = expItems
      .map(
        (e) => `<li>
          ${esc([ja(e.affiliation), ja(e.section), ja(e.job)].filter(Boolean).join(" "))}
          <span class="career-period">${esc(fmtYm(e.from_date))} 〜 ${esc(fmtYm(e.to_date))}</span>
        </li>`
      )
      .join("");
    const eduHtml = eduItems
      .map(
        (e) => `<li>
          ${esc([ja(e.affiliation), ja(e.department), ja(e.course)].filter(Boolean).join(" "))}
          <span class="career-period">${esc(fmtYm(e.from_date))} 〜 ${esc(fmtYm(e.to_date))}</span>
        </li>`
      )
      .join("");

    body.innerHTML = `
      <div class="career-group"><h3>職歴</h3><ul class="career-list">${expHtml}</ul></div>
      <div class="career-group"><h3>学歴</h3><ul class="career-list">${eduHtml}</ul></div>`;
  } catch (e) {
    console.error(e);
    body.innerHTML = fallbackHtml("経歴");
  }
}

// ---- ツール広場: 利用回数とGoogleログイン掲示板 ----

const COMMUNITY = {
  ready: false,
  user: null,
  isModerator: false,
  comments: [],
  activeTool: "class-picker",
  api: null,
};

function setCommunityStatus(message) {
  const el = document.getElementById("auth-status");
  if (el) el.textContent = message;
}

function renderTopicTabs() {
  const select = document.getElementById("topic-select");
  if (!select) return;
  select.innerHTML = visibleTools().map((tool) => `<option value="${esc(tool.repo)}">${esc(tool.name)}${tool.stage === "prototype" ? "（試作中）" : ""}</option>`).join("");
  select.value = COMMUNITY.activeTool;
}

function formatCommentDate(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : null;
  if (!date) return "投稿直後";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function renderComments() {
  const list = document.getElementById("comment-list");
  if (!list) return;
  const comments = COMMUNITY.comments.filter((item) => item.toolId === COMMUNITY.activeTool);
  list.replaceChildren();

  if (!COMMUNITY.ready) {
    const p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = "Google掲示板は現在接続準備中です。";
    list.appendChild(p);
    return;
  }
  if (comments.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = "まだ投稿はありません。最初の感想や質問をお寄せください。";
    list.appendChild(p);
    return;
  }

  comments.forEach((item) => {
    const article = document.createElement("article");
    article.className = "comment-item";
    const header = document.createElement("header");
    const name = document.createElement("strong");
    name.textContent = item.displayName || "広場の参加者";
    const time = document.createElement("time");
    time.textContent = formatCommentDate(item.createdAt);
    const meta = document.createElement("div");
    meta.className = "comment-meta";
    meta.appendChild(time);
    const isOwnComment = COMMUNITY.user?.uid === item.uid;
    if (isOwnComment || COMMUNITY.isModerator) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "comment-delete";
      deleteButton.type = "button";
      deleteButton.dataset.commentDelete = item.id;
      deleteButton.textContent = isOwnComment ? "削除" : "運営者として削除";
      deleteButton.setAttribute("aria-label", `${name.textContent}さんのコメントを${isOwnComment ? "削除" : "運営者として削除"}`);
      meta.appendChild(deleteButton);
    }
    header.append(name, meta);
    const body = document.createElement("p");
    body.textContent = item.text || "";
    article.append(header, body);
    list.appendChild(article);
  });
}

async function deleteComment(commentId) {
  if (!COMMUNITY.ready || !COMMUNITY.user) return;
  const item = COMMUNITY.comments.find((comment) => comment.id === commentId);
  const isOwnComment = item?.uid === COMMUNITY.user.uid;
  if (!item || (!isOwnComment && !COMMUNITY.isModerator)) return;
  const confirmation = isOwnComment
    ? "このコメントを削除しますか？"
    : "運営者として、このコメントを削除しますか？";
  if (!window.confirm(confirmation)) return;

  const button = document.querySelector(`[data-comment-delete="${CSS.escape(commentId)}"]`);
  if (button) {
    button.disabled = true;
    button.textContent = "削除中…";
  }
  try {
    const { db, fs } = COMMUNITY.api;
    await fs.deleteDoc(fs.doc(db, "comments", commentId));
  } catch (error) {
    console.error(error);
    setCommunityStatus("コメントを削除できませんでした。もう一度お試しください。");
    if (button) {
      button.disabled = false;
      button.textContent = "削除";
    }
  }
}

function selectTopic(toolId) {
  if (!visibleTools().some((tool) => tool.repo === toolId)) return;
  COMMUNITY.activeTool = toolId;
  const select = document.getElementById("topic-select");
  if (select) select.value = toolId;
  renderComments();
}

function updateAuthUi() {
  const signin = document.getElementById("google-signin");
  const signout = document.getElementById("signout-button");
  const form = document.getElementById("comment-form");
  if (!signin || !signout || !form) return;

  signin.hidden = Boolean(COMMUNITY.user);
  signin.disabled = !COMMUNITY.ready;
  signout.hidden = !COMMUNITY.user;
  form.hidden = !COMMUNITY.user;
  if (COMMUNITY.user) {
    const role = COMMUNITY.isModerator ? "運営者として" : "";
    setCommunityStatus(`${COMMUNITY.user.displayName || "Googleユーザー"}さんが${role}参加中です。`);
  } else if (COMMUNITY.ready) {
    setCommunityStatus("コメントの閲覧はログイン不要です。投稿するときだけGoogleログインを使用します。");
  }
}

async function incrementToolCount(toolId) {
  if (!COMMUNITY.ready || !COMMUNITY.api) return;
  const { db, fs } = COMMUNITY.api;
  const ref = fs.doc(db, "toolStats", toolId);
  try {
    await fs.runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (snap.exists()) transaction.update(ref, { opens: Number(snap.data().opens || 0) + 1 });
      else transaction.set(ref, { opens: 1 });
    });
  } catch (error) {
    console.warn("利用回数を記録できませんでした", error);
  }
}

function listenToCounts() {
  const { db, fs } = COMMUNITY.api;
  fs.onSnapshot(fs.collection(db, "toolStats"), (snapshot) => {
    let total = 0;
    snapshot.forEach((item) => {
      const opens = Number(item.data().opens || 0);
      total += opens;
      document.querySelectorAll(`[data-count-for="${CSS.escape(item.id)}"]`).forEach((el) => {
        el.textContent = `試された回数: ${opens.toLocaleString("ja-JP")}回`;
      });
    });
    const totalEl = document.getElementById("total-open-count");
    if (totalEl) totalEl.textContent = total > 0 ? `${total.toLocaleString("ja-JP")}回 試されました` : "これから記録を始めます";
  }, (error) => {
    console.warn("利用回数を読み込めませんでした", error);
  });
}

function listenToComments() {
  const { db, fs } = COMMUNITY.api;
  const q = fs.query(fs.collection(db, "comments"), fs.orderBy("createdAt", "desc"), fs.limit(50));
  fs.onSnapshot(q, (snapshot) => {
    COMMUNITY.comments = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderComments();
  }, (error) => {
    console.warn("コメントを読み込めませんでした", error);
    const list = document.getElementById("comment-list");
    if (list) list.innerHTML = `<p class="empty-state">コメントを読み込めませんでした。しばらくしてから再度お試しください。</p>`;
  });
}

async function submitComment(event) {
  event.preventDefault();
  if (!COMMUNITY.ready || !COMMUNITY.user) return;
  const textarea = document.getElementById("comment-text");
  const message = document.getElementById("form-message");
  const text = textarea.value.trim();
  if (!text || text.length > 500) return;

  const { db, fs } = COMMUNITY.api;
  try {
    message.textContent = "投稿しています…";
    await fs.addDoc(fs.collection(db, "comments"), {
      toolId: COMMUNITY.activeTool,
      text,
      uid: COMMUNITY.user.uid,
      displayName: COMMUNITY.user.displayName || "Googleユーザー",
      createdAt: fs.serverTimestamp(),
    });
    textarea.value = "";
    document.getElementById("comment-count").textContent = "0";
    message.textContent = "投稿しました。";
  } catch (error) {
    console.error(error);
    message.textContent = "投稿できませんでした。時間をおいて再度お試しください。";
  }
}

function bindPlazaInteractions() {
  document.getElementById("topic-select")?.addEventListener("change", (event) => selectTopic(event.target.value));
  document.addEventListener("click", (event) => {
    const commentDelete = event.target.closest("[data-comment-delete]");
    if (commentDelete?.dataset.commentDelete) {
      deleteComment(commentDelete.dataset.commentDelete);
      return;
    }

    const openLink = event.target.closest(".tool-open");
    if (openLink?.dataset.toolId) incrementToolCount(openLink.dataset.toolId);

    const jump = event.target.closest(".discussion-jump");
    if (jump?.dataset.toolId) {
      selectTopic(jump.dataset.toolId);
      document.getElementById("community")?.scrollIntoView({ behavior: "smooth" });
    }

  });

  const textarea = document.getElementById("comment-text");
  textarea?.addEventListener("input", () => {
    document.getElementById("comment-count").textContent = String(textarea.value.length);
  });
  document.getElementById("comment-form")?.addEventListener("submit", submitComment);
}

async function initCommunity() {
  renderTopicTabs();
  renderComments();
  bindPlazaInteractions();

  const config = window.MLAB_FIREBASE_CONFIG;
  if (!config?.apiKey || !config?.projectId || !config?.authDomain) {
    setCommunityStatus("Google掲示板はFirebase接続後に利用できます。現在は準備中です。");
    updateAuthUi();
    return;
  }

  try {
    const version = "12.15.0";
    const [appModule, authModule, firestoreModule, appCheckModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`),
      import(`https://www.gstatic.com/firebasejs/${version}/firebase-app-check.js`),
    ]);
    const app = appModule.initializeApp(config);
    const appCheckSiteKey = window.MLAB_APP_CHECK_SITE_KEY;
    if (appCheckSiteKey) {
      appCheckModule.initializeAppCheck(app, {
        provider: new appCheckModule.ReCaptchaEnterpriseProvider(appCheckSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
    const auth = authModule.getAuth(app);
    const db = firestoreModule.getFirestore(app);
    await authModule.setPersistence(auth, authModule.browserLocalPersistence);
    await authModule.getRedirectResult(auth).catch(() => null);

    COMMUNITY.api = { auth, db, authModule, fs: firestoreModule };
    COMMUNITY.ready = true;
    listenToCounts();
    listenToComments();

    authModule.onAuthStateChanged(auth, async (user) => {
      COMMUNITY.user = user;
      COMMUNITY.isModerator = false;
      updateAuthUi();
      renderComments();
      if (!user) return;

      try {
        const moderatorRef = firestoreModule.doc(db, "moderators", user.uid);
        const moderatorSnapshot = await firestoreModule.getDoc(moderatorRef);
        if (COMMUNITY.user?.uid !== user.uid) return;
        COMMUNITY.isModerator = moderatorSnapshot.exists();
      } catch (error) {
        console.warn("運営者権限を確認できませんでした", error);
      }
      updateAuthUi();
      renderComments();
    });

    document.getElementById("google-signin")?.addEventListener("click", async () => {
      const provider = new authModule.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try {
        await authModule.signInWithPopup(auth, provider);
      } catch (error) {
        console.error(error);
        setCommunityStatus("Googleログインを完了できませんでした。もう一度お試しください。");
      }
    });
    document.getElementById("signout-button")?.addEventListener("click", () => authModule.signOut(auth));
  } catch (error) {
    console.error("Firebase initialization failed", error);
    setCommunityStatus("Google掲示板を読み込めませんでした。現在は準備中です。");
    updateAuthUi();
  }
}

// ---- 管理モード（URL に ?admin=1 を付けたときだけ動く）----
// ボタンで表示/非表示を切り替え → その場でプレビュー反映。
// 最後に「反映する」で、書き換え済みの data.js をコピーして GitHub の
// 編集画面を開く（貼り付けて緑のボタンを押せば公開に反映される）。
// 鍵（トークン）は使わない安全な方式。訪問者には出ません。

async function renderAdminPanel() {
  if (new URLSearchParams(location.search).get("admin") !== "1") return;
  const user = SITE_CONFIG.githubUser;
  if (!user) return;

  const SITE_REPO = "researcher-site";
  const EDIT_URL = `https://github.com/${user}/${SITE_REPO}/edit/main/data.js`;

  const panel = document.createElement("div");
  panel.className = "admin-panel";
  panel.innerHTML = `<button class="admin-close" title="閉じる">×</button>
    <h3>公開ツール 管理モード</h3>
    <p class="admin-sub">GitHub の公開リポジトリと data.js を照合中…</p>
    <div class="admin-rows"></div>
    <div class="admin-apply" hidden>
      <p class="admin-apply-note">切り替えはまだこの画面のプレビューだけです。公開サイトに反映するには:</p>
      <button class="apply-btn" type="button">反映する（コピーして GitHub を開く）</button>
      <p class="admin-apply-steps">開いたページで:
        ① 本文をクリック → <b>Ctrl+A</b>（全選択）→ <b>Ctrl+V</b>（貼り付け）
        ② 右上の緑の <b>Commit changes...</b> → もう一度緑のボタン。
        <br>※反映後も、ブラウザの読み置き（キャッシュ）のせいで<b>最大10分ほど
        古いまま見える</b>ことがあります。「戻ってしまった」ように見えても
        反映は済んでいるので、<b>Ctrl+F5</b>（強制再読込）するか少し待ってください。</p>
    </div>`;
  document.body.appendChild(panel);
  panel.querySelector(".admin-close").onclick = () => panel.remove();

  // 現在の data.js の中身（コメントも含む全文）。ボタン操作でこのテキストを書き換えていく
  let dataJsText;
  let repos;
  try {
    const [textRes, apiRes] = await Promise.all([
      fetch("data.js", { cache: "no-store" }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&type=owner&sort=updated`),
    ]);
    if (!textRes.ok || !apiRes.ok) throw new Error("fetch failed");
    dataJsText = await textRes.text();
    // このサイト自身のリポジトリは候補から除外する
    repos = (await apiRes.json()).filter((r) => !r.private && !r.fork && r.name !== SITE_REPO);
  } catch (e) {
    console.error(e);
    panel.querySelector(".admin-sub").textContent =
      "情報を取得できませんでした（時間をおいて再度お試しください）。";
    return;
  }

  const pagesUrl = (name) => `https://${user.toLowerCase()}.github.io/${name}/`;
  const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let dirty = false;

  // 状態判定は「毎回取り直した data.js の最新テキスト」で行う。
  // （ブラウザが古い data.js を覚えていても、二重追加などの事故が起きないように）
  const inText = (repo) =>
    new RegExp(`repo:\\s*"${reEscape(repo)}"`).test(dataJsText);
  const shownInText = (repo) =>
    new RegExp(`show:\\s*true\\s*,\\s*\\n\\s*repo:\\s*"${reEscape(repo)}"`).test(dataJsText);

  // data.js テキスト内の該当ツールの show: を書き換える（コメントはそのまま残る）
  function setShowInText(repo, value) {
    const re = new RegExp(`show:\\s*(?:true|false)(\\s*,\\s*\\n\\s*repo:\\s*"${reEscape(repo)}")`);
    dataJsText = dataJsText.replace(re, `show: ${value}$1`);
  }

  // 未登録リポジトリのブロックを tools 一覧の末尾に挿し込む
  // （表示順は「上=古い、下=新しい」なので、新しいツールは最後に足す）
  function addToolToText(entry) {
    const block =
`    {
      show: true,
      repo: "${entry.repo}",
      name: "${entry.name}",
      url: "${entry.url}",
      description: "${entry.description}",
      tags: [],
    },
`;
    const start = dataJsText.indexOf("tools: [");
    const closeIdx = start === -1 ? -1 : dataJsText.indexOf("\n  ],", start);
    if (closeIdx !== -1) {
      dataJsText = dataJsText.slice(0, closeIdx + 1) + block + dataJsText.slice(closeIdx + 1);
    } else {
      // 想定外の書式のときの保険: 先頭に挿す（壊すよりまし）
      dataJsText = dataJsText.replace(/tools:\s*\[\s*\n/, (m) => m + block);
    }
  }

  function markDirty() {
    dirty = true;
    panel.querySelector(".admin-apply").hidden = false;
  }

  function rowHtml(r) {
    const t = (SITE_CONFIG.tools || []).find((x) => x.repo === r.name);
    const label = esc(t?.name || r.name);
    if (inText(r.name) && shownInText(r.name)) {
      return `<div class="admin-repo" data-repo="${esc(r.name)}">
        <span class="name">${label}</span> <span class="state-on">● 表示中</span>
        <button class="row-btn" data-act="hide" type="button">非表示にする</button></div>`;
    }
    if (inText(r.name)) {
      return `<div class="admin-repo" data-repo="${esc(r.name)}">
        <span class="name">${label}</span> <span class="state-off">○ 非表示</span>
        <button class="row-btn" data-act="show" type="button">表示にする</button></div>`;
    }
    return `<div class="admin-repo" data-repo="${esc(r.name)}">
      <span class="name">${label}</span> <span class="state-new">＋ 未登録</span>
      <button class="row-btn" data-act="add" type="button">サイトに載せる</button></div>`;
  }

  function renderRows() {
    panel.querySelector(".admin-rows").innerHTML = repos.map(rowHtml).join("");
    panel.querySelectorAll(".row-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const repoName = btn.closest(".admin-repo").dataset.repo;
        const act = btn.dataset.act;
        const t = (SITE_CONFIG.tools || []).find((x) => x.repo === repoName);
        if (act === "hide") {
          setShowInText(repoName, false);
          if (t) t.show = false;
        } else if (act === "show" || (act === "add" && inText(repoName))) {
          // すでに data.js にある場合は show を切り替えるだけ（二重追加しない）
          setShowInText(repoName, true);
          if (t) {
            t.show = true;
          } else {
            // 画面プレビュー用の仮エントリ（反映される内容は data.js テキスト側が正）
            const r = repos.find((x) => x.name === repoName);
            SITE_CONFIG.tools.push({
              show: true, repo: r.name, name: r.name,
              url: r.has_pages ? pagesUrl(r.name) : r.html_url,
              description: r.description || "", tags: [],
            });
          }
        } else if (act === "add") {
          const r = repos.find((x) => x.name === repoName);
          const entry = {
            show: true,
            repo: r.name,
            name: r.name,
            url: r.has_pages ? pagesUrl(r.name) : r.html_url,
            description: (r.description || "（説明文は data.js で書き換えてください）").replace(/"/g, "'"),
            tags: [],
          };
          SITE_CONFIG.tools.push(entry);
          addToolToText(entry);
        }
        renderTools(); // ページ本体を即時プレビュー更新
        markDirty();
        renderRows();
      });
    });
  }

  panel.querySelector(".admin-sub").innerHTML =
    "ボタンで切り替えると、下のページに<b>その場でプレビュー</b>されます。";
  renderRows();

  panel.querySelector(".apply-btn").addEventListener("click", async (ev) => {
    const btn = ev.currentTarget;
    try {
      await navigator.clipboard.writeText(dataJsText);
      btn.textContent = "コピーしました ✓ GitHub を開きます…";
    } catch (_) {
      btn.textContent = "コピーできませんでした（下の全文を手動でコピーしてください）";
      if (!panel.querySelector(".admin-fulltext")) {
        panel.insertAdjacentHTML(
          "beforeend",
          `<pre class="admin-fulltext">${esc(dataJsText)}</pre>`
        );
      }
      return;
    }
    window.open(EDIT_URL, "_blank", "noopener");
  });
}

// ---- 起動 ----

renderInterests();
renderNews();
renderTools();
bindCatalogInteractions();
refreshReleaseInfo();
renderContact();
initCommunity().catch((e) => console.error(e));

renderProfile().catch((e) => {
  console.error(e);
  document.getElementById("name-main").textContent = "牧野 耀";
  document.getElementById("profile-links").innerHTML =
    `<a href="${RM_PAGE}" target="_blank" rel="noopener">researchmap</a>`;
});
renderKeywords().catch((e) => console.error(e));
renderPublications();
renderCareer();
renderAdminPanel().catch((e) => console.error(e));
