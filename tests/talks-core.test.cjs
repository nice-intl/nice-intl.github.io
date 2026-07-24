const test = require('node:test');
const assert = require('node:assert/strict');

const { filterTalks } = require('../assets/js/talks-core.js');

const talks = [
  {
    id: 186,
    title: 'Recent Agent Systems',
    speaker: 'A. Researcher',
    tags: 'Agents, Systems'
  },
  {
    id: 3,
    title: 'LLM Factuality, Hallucination, Evaluation, and Model Editing',
    speaker: 'Cunxiang Wang',
    tags: 'Evaluation, Safety, Training'
  }
];

test('searches the complete Talk dataset by title', () => {
  const result = filterTalks(talks, 'factuality', []);

  assert.deepEqual(result.map((talk) => talk.id), [3]);
});

test('searches the complete Talk dataset by speaker', () => {
  const result = filterTalks(talks, 'cunxiang', []);

  assert.deepEqual(result.map((talk) => talk.id), [3]);
});

test('filters the complete Talk dataset by tag', () => {
  const result = filterTalks(talks, '', ['safety']);

  assert.deepEqual(result.map((talk) => talk.id), [3]);
});

test('combines search text and active tags', () => {
  assert.equal(filterTalks(talks, 'factuality', ['training']).length, 1);
  assert.equal(filterTalks(talks, 'factuality', ['agents']).length, 0);
});
