(function (root, factory) {
  'use strict';

  var api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.NiceTalksCore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normaliseTags(tags) {
    if (Array.isArray(tags)) {
      return tags.map(function (tag) { return String(tag).trim().toLowerCase(); }).filter(Boolean);
    }

    return String(tags || '')
      .split(',')
      .map(function (tag) { return tag.trim().toLowerCase(); })
      .filter(Boolean);
  }

  function filterTalks(talks, query, activeTags) {
    var searchText = String(query || '').trim().toLowerCase();
    var selectedTags = normaliseTags(activeTags);

    return talks.filter(function (talk) {
      if (talk._missing) return !searchText && !selectedTags.length;

      var title = String(talk.title || '').toLowerCase();
      var speaker = String(talk.speaker || '').toLowerCase();
      var talkTags = normaliseTags(talk.tags);
      var matchesSearch = !searchText ||
        title.indexOf(searchText) !== -1 ||
        speaker.indexOf(searchText) !== -1;
      var matchesTags = !selectedTags.length ||
        selectedTags.some(function (tag) { return talkTags.indexOf(tag) !== -1; });

      return matchesSearch && matchesTags;
    });
  }

  return {
    filterTalks: filterTalks
  };
}));
