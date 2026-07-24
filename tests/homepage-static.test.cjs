const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'zh.html'].map((file) => ({
  file,
  source: fs.readFileSync(path.join(root, file), 'utf8')
}));

function compact(source) {
  return source.replace(/\s+/g, '');
}

function between(source, start, end) {
  const compacted = compact(source);
  return compacted.slice(compacted.indexOf(start), compacted.indexOf(end));
}

test('both homepages collapse Join paths to one column', () => {
  for (const page of pages) {
    assert.ok(
      between(page.source, '@media(max-width:1024px)', '@media(max-width:768px)')
        .includes('.join-paths{grid-template-columns:1fr;}'),
      `${page.file} must collapse Join paths at the tablet breakpoint`
    );
  }
});

test('both homepages constrain the mobile Hero', () => {
  for (const page of pages) {
    const source = compact(page.source);
    assert.ok(source.includes('.hero-inner{width:100%;padding:01.5rem;}'), `${page.file} must constrain the Hero container`);
    assert.ok(source.includes('.h-title{font-size:clamp(4rem,22vw,7rem);}'), `${page.file} must scale the Hero title below 768px`);
  }
});

test('both homepages stack Talk metadata on narrow screens', () => {
  for (const page of pages) {
    const source = compact(page.source);
    assert.ok(
      source.includes('.talk{grid-template-columns:2remminmax(0,1fr);gap:1rem;}'),
      `${page.file} must use a two-column mobile Talk layout`
    );
    assert.ok(
      source.includes('.t-date{grid-column:2;text-align:left;padding-top:0;}'),
      `${page.file} must move Talk dates below the title`
    );
  }
});

test('both homepages wrap mobile footer channels', () => {
  for (const page of pages) {
    assert.ok(
      compact(page.source).includes('.foot-soc{width:100%;flex-wrap:wrap;gap:1rem;}'),
      `${page.file} must wrap footer channels`
    );
  }
});
