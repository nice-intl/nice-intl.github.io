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

const speakerRosters = [
  {
    slug: 'shanghai-world-model-night',
    count: '6',
    names: [
      'Siheng Chen (陈思衡)',
      'Yang Li (李阳)',
      'Zhecheng Yuan (袁哲诚)',
      'Yingtian Zou (邹应天)',
      'Hongyuan Lu (陆弘远)',
      'Zhaoxi Chen (陈昭熹)'
    ]
  },
  {
    slug: 'shenzhen-embodied-ai',
    count: '8',
    names: [
      'Kun Xie (谢琨)',
      'Qiang Nie (聂强)',
      'Ruimao Zhang (张瑞茂)',
      'Zhengxiang Chen (陈正翔)',
      'Sheng Xu (徐圣)',
      'Jiaze Wang (王佳泽)',
      'Linzhu Le (乐林株)',
      'Yizhou Fan (范翌洲)'
    ]
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
