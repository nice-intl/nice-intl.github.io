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
