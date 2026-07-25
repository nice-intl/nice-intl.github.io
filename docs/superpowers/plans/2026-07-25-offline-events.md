# Shanghai and Shenzhen Offline Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two poster-led offline event pages and list all homepage events in reverse chronological order.

**Architecture:** Keep the static-site architecture unchanged. Each event is a self-contained folder with one HTML page and one poster image; both homepages continue to use their existing event-card markup, with static tests enforcing page integrity and date order.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner, local HTTP preview.

---

## File map

- Create `events/shanghai-world-model-night/index.html`: English detail page for the July 18 event.
- Create `events/shanghai-world-model-night/poster.png`: supplied Shanghai poster.
- Create `events/shenzhen-embodied-ai/index.html`: English detail page for the June 27 event.
- Create `events/shenzhen-embodied-ai/poster.png`: supplied Shenzhen poster.
- Create `tests/offline-events.test.cjs`: static contract tests for pages, assets, links, and ordering.
- Modify `index.html`: add two English event cards and sort all seven cards.
- Modify `zh.html`: add two Chinese event cards and sort all seven cards.
- Modify `.gitignore`: exclude the temporary `.superpowers/` visual-companion session.

### Task 1: Detail pages and poster assets

**Files:**
- Create: `tests/offline-events.test.cjs`
- Create: `events/shanghai-world-model-night/index.html`
- Create: `events/shanghai-world-model-night/poster.png`
- Create: `events/shenzhen-embodied-ai/index.html`
- Create: `events/shenzhen-embodied-ai/poster.png`

- [ ] **Step 1: Write failing detail-page tests**

Create `tests/offline-events.test.cjs` with:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const events = [
  {
    slug: 'shanghai-world-model-night',
    title: 'World Model Night',
    date: 'July 18, 2026',
    poster: 'poster.png'
  },
  {
    slug: 'shenzhen-embodied-ai',
    title: 'Into Embodied AI',
    date: 'June 27, 2026',
    poster: 'poster.png'
  }
];

test('new offline event pages include their supplied posters and core metadata', () => {
  for (const event of events) {
    const eventDir = path.join(root, 'events', event.slug);
    const source = fs.readFileSync(path.join(eventDir, 'index.html'), 'utf8');

    assert.ok(source.includes(event.title), `${event.slug} must include its title`);
    assert.ok(source.includes(event.date), `${event.slug} must include its date`);
    assert.ok(source.includes(`src="${event.poster}"`), `${event.slug} must render its poster`);
    assert.ok(fs.existsSync(path.join(eventDir, event.poster)), `${event.slug} poster must exist`);
    assert.ok(source.includes('href="../../index.html#events"'), `${event.slug} must link back to events`);
    assert.equal(source.includes('class="event-gallery"'), false, `${event.slug} must not render an empty gallery`);
  }
});
```

- [ ] **Step 2: Run the test and verify the RED state**

Run:

```bash
node --test tests/offline-events.test.cjs
```

Expected: FAIL with `ENOENT` for `events/shanghai-world-model-night/index.html`.

- [ ] **Step 3: Add both supplied poster assets**

Copy the exact user-supplied PNG files:

```bash
mkdir -p events/shanghai-world-model-night events/shenzhen-embodied-ai
cp /var/folders/n4/hz6qrdw96wl7z7q8z561694h0000gn/T/codex-clipboard-eb68657f-1907-40ce-ab40-ef96624510d5.png events/shanghai-world-model-night/poster.png
cp /var/folders/n4/hz6qrdw96wl7z7q8z561694h0000gn/T/codex-clipboard-f836dd15-498b-4241-a1ef-683f460c22f4.png events/shenzhen-embodied-ai/poster.png
```

- [ ] **Step 4: Create the Shanghai detail page**

Create `events/shanghai-world-model-night/index.html` with the same head, CSS, navigation, poster, responsive rules, and footer classes as `events/beijing-worldmodel/index.html`. Replace its page body with:

```html
<nav>
  <a class="nav-logo" href="../../index.html">
    <img class="nav-logomark" src="../../assets/NICE_LOGO.png" alt="NICE" width="170" height="30" decoding="async">
    <span class="nav-name">NICE</span>
  </a>
  <a class="nav-back" href="../../index.html#events">&larr; All Events</a>
</nav>

<section class="event-hero">
  <div class="eh-eyebrow">Offline Event · Shanghai · WAIC 2026</div>
  <h1 class="eh-title">World Model Night: <br>WAIC Closed-Door Meetup</h1>
  <div class="eh-meta">
    <div class="eh-meta-item"><strong>July 18, 2026 · 16:30–20:30</strong></div>
    <div class="eh-meta-item"><strong>Shanghai</strong></div>
    <div class="eh-meta-item">Hosts: <strong>NICE Academic · Yunqi Partners</strong></div>
  </div>
  <p class="eh-desc">During WAIC 2026, NICE Academic and Yunqi Partners brought together researchers, founders, and practitioners for an intimate evening centered on world models, embodied intelligence, adaptive decision-making, and AI entrepreneurship. Invited talks and a cross-disciplinary panel flowed into an open-air BBQ, creating a focused setting for candid technical exchange and new connections.</p>
</section>

<div class="event-stats">
  <div class="es-item"><div class="es-num">40</div><div class="es-label">Invited Guests</div></div>
  <div class="es-item"><div class="es-num">4</div><div class="es-label">Program Sessions</div></div>
  <div class="es-item"><div class="es-num">4h</div><div class="es-label">Closed-Door Exchange</div></div>
</div>

<div class="event-details">
  <div class="ed-section">
    <div class="ed-label">Program Highlights</div>
    <ul class="ed-list">
      <li><strong>Check-in & Networking</strong> <span class="ed-role">An informal opening for introductions and conversation</span></li>
      <li><strong>Invited Talks</strong> <span class="ed-role">World models, embodied AI, and adaptive decision-making</span></li>
      <li><strong>Panel Discussion</strong> <span class="ed-role">A cross-disciplinary dialogue between academia and entrepreneurship</span></li>
      <li><strong>BBQ & Open Networking</strong> <span class="ed-role">A relaxed evening for deeper exchange and collaboration</span></li>
    </ul>
  </div>
  <div class="ed-section">
    <div class="ed-label">Hosts</div>
    <div class="partner-chips">
      <span>NICE Academic</span>
      <span>Yunqi Partners</span>
    </div>
  </div>
</div>

<div class="event-poster">
  <div class="ep-label">Event Poster</div>
  <img class="ep-img" src="poster.png" alt="World Model Night event poster">
</div>

<div class="event-footer">
  <span class="ef-copy">&copy; 2026 World Model Night · Nexus for IntelligeCE (NICE)</span>
  <a class="ef-back" href="../../index.html#events">&larr; Back to All Events</a>
</div>
```

Set the document title to `World Model Night — NICE Offline Event`.

- [ ] **Step 5: Create the Shenzhen detail page**

Create `events/shenzhen-embodied-ai/index.html` with the same head, CSS, navigation, poster, responsive rules, and footer classes as `events/beijing-worldmodel/index.html`. Replace its page body with:

```html
<nav>
  <a class="nav-logo" href="../../index.html">
    <img class="nav-logomark" src="../../assets/NICE_LOGO.png" alt="NICE" width="170" height="30" decoding="async">
    <span class="nav-name">NICE</span>
  </a>
  <a class="nav-back" href="../../index.html#events">&larr; All Events</a>
</nav>

<section class="event-hero">
  <div class="eh-eyebrow">Offline Event · Shenzhen</div>
  <h1 class="eh-title">Into Embodied AI: <br>Frontiers, Real-World Interaction &amp; Startup Opportunities</h1>
  <div class="eh-meta">
    <div class="eh-meta-item"><strong>June 27, 2026 · 14:00–18:30</strong></div>
    <div class="eh-meta-item"><strong>Shenzhen InnoX</strong></div>
    <div class="eh-meta-item">Host: <strong>NICE</strong></div>
  </div>
  <p class="eh-desc">As AI moves beyond screens and into the physical world, embodied intelligence is becoming a meeting point for robot learning, multimodal perception, control, and entrepreneurship. NICE, FITX, and Shenzhen InnoX convened researchers, builders, and founders to examine how far the field has progressed, where real-world systems remain constrained, and which technical and commercial opportunities may emerge next.</p>
</section>

<div class="event-stats">
  <div class="es-item"><div class="es-num">1</div><div class="es-label">Core Theme Forum</div></div>
  <div class="es-item"><div class="es-num">4</div><div class="es-label">Discussion Themes</div></div>
  <div class="es-item"><div class="es-num">4.5h</div><div class="es-label">Offline Exchange</div></div>
</div>

<div class="event-details">
  <div class="ed-section">
    <div class="ed-label">Discussion Themes</div>
    <ul class="ed-list">
      <li><strong>Academic Frontiers</strong> <span class="ed-role">Robot learning, multimodal perception, and embodied foundation models</span></li>
      <li><strong>Perception, Control & Interaction</strong> <span class="ed-role">The constraints shaping reliable robotic behavior</span></li>
      <li><strong>From Lab to Reality</strong> <span class="ed-role">What is still missing between demonstrations and real-world deployment</span></li>
      <li><strong>Startup Opportunities</strong> <span class="ed-role">Emerging products, platforms, and companies in embodied intelligence</span></li>
    </ul>
  </div>
  <div class="ed-section">
    <div class="ed-label">Hosts &amp; Co-hosts</div>
    <div class="partner-chips">
      <span>NICE</span>
      <span>FITX</span>
      <span>Shenzhen InnoX</span>
    </div>
  </div>
</div>

<div class="event-poster">
  <div class="ep-label">Event Poster</div>
  <img class="ep-img" src="poster.png" alt="Into Embodied AI event poster">
</div>

<div class="event-footer">
  <span class="ef-copy">&copy; 2026 Into Embodied AI · Nexus for IntelligeCE (NICE)</span>
  <a class="ef-back" href="../../index.html#events">&larr; Back to All Events</a>
</div>
```

Set the document title to `Into Embodied AI — NICE Offline Event`.

- [ ] **Step 6: Run the detail-page test and verify GREEN**

Run:

```bash
node --test tests/offline-events.test.cjs
```

Expected: 1 test passes, 0 fail.

- [ ] **Step 7: Commit the detail pages**

```bash
git add tests/offline-events.test.cjs events/shanghai-world-model-night events/shenzhen-embodied-ai
git commit -m "feat: add Shanghai and Shenzhen event pages"
```

### Task 2: Reverse-chronological homepage cards

**Files:**
- Modify: `tests/offline-events.test.cjs`
- Modify: `index.html`
- Modify: `zh.html`

- [ ] **Step 1: Add failing homepage order and link tests**

Append:

```js
const expectedOrder = [
  'events/shanghai-world-model-night/index.html',
  'events/shenzhen-embodied-ai/index.html',
  'events/beijing-worldmodel/index.html',
  'events/shanghai-openclaw/index.html',
  'events/shanghai-agent2025/index.html',
  'events/suzhou-emnlp/index.html',
  'events/beijing-rl/index.html'
];

test('both homepages list every offline event newest first', () => {
  for (const file of ['index.html', 'zh.html']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const positions = expectedOrder.map((href) => source.indexOf(`href="${href}"`));

    assert.ok(positions.every((position) => position >= 0), `${file} must link to all offline events`);
    assert.deepEqual([...positions].sort((a, b) => a - b), positions, `${file} must order events newest first`);
  }
});
```

- [ ] **Step 2: Run the test and verify the RED state**

Run:

```bash
node --test tests/offline-events.test.cjs
```

Expected: detail-page test passes; homepage order test fails because the new links are absent.

- [ ] **Step 3: Replace the English event-card sequence**

In `index.html`, replace the contents of `.events-grid` with seven existing-format cards in the exact order from `expectedOrder`. The two new cards must contain:

```html
<a class="event-card reveal" href="events/shanghai-world-model-night/index.html">
  <div class="ev-location">Shanghai</div>
  <div class="ev-date">Jul 18, 2026</div>
  <div class="ev-title">World Model Night:<br>WAIC Closed-Door Meetup</div>
  <div class="ev-stats">40 guests &middot; Invite-only BBQ night</div>
  <div class="ev-partners">
    <span class="ev-partner-chip">NICE Academic</span>
    <span class="ev-partner-chip">Yunqi Partners</span>
  </div>
  <div class="ev-arrow">View Event &rarr;</div>
</a>
<a class="event-card reveal d1" href="events/shenzhen-embodied-ai/index.html">
  <div class="ev-location">Shenzhen</div>
  <div class="ev-date">Jun 27, 2026</div>
  <div class="ev-title">Into Embodied AI:<br>Frontiers, Real-World Interaction &amp; Startup Opportunities</div>
  <div class="ev-stats">4.5-hour forum &middot; 4 discussion themes</div>
  <div class="ev-partners">
    <span class="ev-partner-chip">FITX</span>
    <span class="ev-partner-chip">Shenzhen InnoX</span>
  </div>
  <div class="ev-arrow">View Event &rarr;</div>
</a>
```

Keep the five existing cards unchanged except for their position and sequential reveal-delay class.

- [ ] **Step 4: Replace the Chinese event-card sequence**

In `zh.html`, replace the contents of `.events-grid` with the same seven paths and order. The two new cards must contain:

```html
<a class="event-card reveal" href="events/shanghai-world-model-night/index.html">
  <div class="ev-location">上海</div>
  <div class="ev-date">Jul 18, 2026</div>
  <div class="ev-title">世界模型之夜 · WAIC 闭门交流会</div>
  <div class="ev-stats">约 40 人 &middot; 闭门邀请制 BBQ 夜谈</div>
  <div class="ev-partners">
    <span class="ev-partner-chip">NICE 学术</span>
    <span class="ev-partner-chip">云启资本</span>
  </div>
  <div class="ev-arrow">查看详情 &rarr;</div>
</a>
<a class="event-card reveal d1" href="events/shenzhen-embodied-ai/index.html">
  <div class="ev-location">深圳</div>
  <div class="ev-date">Jun 27, 2026</div>
  <div class="ev-title">走进具身智能：前沿技术、真实世界交互与创业机会</div>
  <div class="ev-stats">4.5 小时交流 &middot; 4 个核心议题</div>
  <div class="ev-partners">
    <span class="ev-partner-chip">飞拓星驰</span>
    <span class="ev-partner-chip">深圳科创学院</span>
  </div>
  <div class="ev-arrow">查看详情 &rarr;</div>
</a>
```

Keep the five existing cards unchanged except for their position and sequential reveal-delay class.

- [ ] **Step 5: Run the homepage tests and verify GREEN**

Run:

```bash
node --test tests/offline-events.test.cjs
```

Expected: 2 tests pass, 0 fail.

- [ ] **Step 6: Commit homepage cards**

```bash
git add index.html zh.html tests/offline-events.test.cjs
git commit -m "feat: list offline events newest first"
```

### Task 3: Repository hygiene and complete verification

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Ignore the visual-companion working directory**

Add:

```gitignore
.superpowers/
```

- [ ] **Step 2: Run the complete automated test suite**

Run:

```bash
node --test tests/*.test.cjs
```

Expected: all tests pass with 0 failures.

- [ ] **Step 3: Check references and HTML structure**

Run:

```bash
node - <<'NODE'
const fs = require('node:fs');
for (const page of [
  'index.html',
  'zh.html',
  'events/shanghai-world-model-night/index.html',
  'events/shenzhen-embodied-ai/index.html'
]) {
  const source = fs.readFileSync(page, 'utf8');
  if (!source.includes('</html>')) throw new Error(`${page}: missing closing html tag`);
}
console.log('Checked 4 HTML files');
NODE
git diff --check HEAD
```

Expected: `Checked 4 HTML files`, no whitespace errors.

- [ ] **Step 4: Visually inspect local pages**

Open these pages through the existing local server and check desktop and mobile widths:

```text
http://127.0.0.1:4173/index.html#events
http://127.0.0.1:4173/zh.html#events
http://127.0.0.1:4173/events/shanghai-world-model-night/index.html
http://127.0.0.1:4173/events/shenzhen-embodied-ai/index.html
```

Confirm that cards appear newest first, long titles do not overflow, posters are legible, navigation works, and no empty gallery gap is present.

- [ ] **Step 5: Commit repository hygiene**

```bash
git add .gitignore
git commit -m "chore: ignore local brainstorming previews"
```

- [ ] **Step 6: Confirm the branch remains local**

Run:

```bash
git status --short
git log --oneline origin/main..HEAD
```

Expected: clean working tree and local commits listed above `origin/main`; do not run `git push`.

### Task 4: Poster-derived speaker rosters

**Files:**
- Modify: `tests/offline-events.test.cjs`
- Modify: `events/shanghai-world-model-night/index.html`
- Modify: `events/shenzhen-embodied-ai/index.html`

- [ ] **Step 1: Add failing roster tests**

Append:

```js
const speakerRosters = [
  {
    slug: 'shanghai-world-model-night',
    count: '6',
    names: ['Siheng Chen (陈思衡)', 'Yang Li (李阳)', 'Zhecheng Yuan (袁哲诚)', 'Yingtian Zou (邹应天)', 'Hongyuan Lu (陆弘远)', 'Zhaoxi Chen (陈昭熹)']
  },
  {
    slug: 'shenzhen-embodied-ai',
    count: '8',
    names: ['Kun Xie (谢琨)', 'Qiang Nie (聂强)', 'Ruimao Zhang (张瑞茂)', 'Zhengxiang Chen (陈正翔)', 'Sheng Xu (徐圣)', 'Jiaze Wang (王佳泽)', 'Linzhu Le (乐林株)', 'Yizhou Fan (范翌洲)']
  }
];

test('new event pages present poster-derived speaker rosters and partners', () => {
  for (const event of speakerRosters) {
    const source = fs.readFileSync(path.join(root, 'events', event.slug, 'index.html'), 'utf8');

    assert.ok(source.includes('Speakers &amp; Panelists'), `${event.slug} must label its speaker roster`);
    assert.ok(source.includes('Partners &amp; Co-hosts'), `${event.slug} must label its organizers`);
    assert.ok(source.includes(`<div class="es-num">${event.count}</div>`), `${event.slug} must show its speaker count`);

    for (const name of event.names) {
      assert.equal(source.split(name).length - 1, 1, `${event.slug} must list ${name} exactly once`);
    }
  }
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/offline-events.test.cjs
```

Expected: the two existing tests pass and the roster test fails because `Speakers &amp; Panelists` is absent.

- [ ] **Step 3: Replace the Shanghai highlights with its roster**

Change the middle summary statistic to six `Speakers & Panelists`. Replace the `Program Highlights` list with:

```html
<div class="ed-label">Speakers &amp; Panelists</div>
<ul class="ed-list">
  <li><strong>Siheng Chen (陈思衡)</strong> <span class="ed-role">Associate Professor, School of Artificial Intelligence, Shanghai Jiao Tong University</span></li>
  <li><strong>Yang Li (李阳)</strong> <span class="ed-role">John Hopcroft Assistant Professor, School of Computer Science, Shanghai Jiao Tong University</span></li>
  <li><strong>Zhecheng Yuan (袁哲诚)</strong> <span class="ed-role">Co-founder &amp; Chief Scientist, Pok Robotics (破壳机器人)</span></li>
  <li><strong>Yingtian Zou (邹应天)</strong> <span class="ed-role">Founder, Sreal AI</span></li>
  <li><strong>Hongyuan Lu (陆弘远)</strong> <span class="ed-role">Founder, 脸谱心智</span></li>
  <li><strong>Zhaoxi Chen (陈昭熹)</strong> <span class="ed-role">Co-founder &amp; CEO, Ropedia</span></li>
</ul>
```

Rename the organizer label to `Partners & Co-hosts`; keep `NICE Academic` and `Yunqi Partners`.

- [ ] **Step 4: Replace the Shenzhen highlights with its unique roster**

Change the middle summary statistic to eight `Speakers & Panelists`. Replace the `Discussion Themes` list with:

```html
<div class="ed-label">Speakers &amp; Panelists</div>
<ul class="ed-list">
  <li><strong>Kun Xie (谢琨)</strong> <span class="ed-role">Head of Strategic Partnerships, UBTECH Robotics</span></li>
  <li><strong>Qiang Nie (聂强)</strong> <span class="ed-role">Assistant Professor, HKUST (Guangzhou)</span></li>
  <li><strong>Ruimao Zhang (张瑞茂)</strong> <span class="ed-role">Associate Professor, Sun Yat-sen University</span></li>
  <li><strong>Zhengxiang Chen (陈正翔)</strong> <span class="ed-role">Founder, TAKS Humanoid Robotics</span></li>
  <li><strong>Sheng Xu (徐圣)</strong> <span class="ed-role">PhD Student, CUHK-Shenzhen</span></li>
  <li><strong>Jiaze Wang (王佳泽)</strong> <span class="ed-role">Founder, FITX</span></li>
  <li><strong>Linzhu Le (乐林株)</strong> <span class="ed-role">Founder &amp; CEO, 光之跃迁</span></li>
  <li><strong>Yizhou Fan (范翌洲)</strong> <span class="ed-role">Assistant Professor, The Chinese University of Hong Kong (Host)</span></li>
</ul>
```

Rename the organizer label to `Partners & Co-hosts`; keep `NICE`, `FITX`, and `Shenzhen InnoX`. List Zhengxiang Chen once even though the poster includes him in both Talk and Startup.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/offline-events.test.cjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Run full verification**

Run:

```bash
node --test tests/*.test.cjs
git diff --check
```

Expected: all tests pass with no whitespace errors.

- [ ] **Step 7: Visually inspect both detail pages**

Use the existing local server at desktop and 390px mobile widths. Confirm the roster remains readable, the details section stacks to one column on mobile, and neither page gains horizontal overflow.

- [ ] **Step 8: Compress all unpushed activity work into two commits**

Reset the local commit boundary to `origin/main` while preserving the working tree, then create:

```text
feat: add Shanghai and Shenzhen offline events
feat: list offline events newest first
```

The first commit contains documentation, event pages, poster assets, `.gitignore`, and the event tests before the homepage-order assertion. The second contains the two homepage card sequences and the homepage-order assertion. Verify the final tree and complete test suite after rewriting history. Do not push.
