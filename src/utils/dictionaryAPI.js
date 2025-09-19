let baseURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

async function fetchWordTranslation(word) {
  try {
    const res = await fetch(baseURL + word.trim());
    const data = await res.json();
    const phonetic = data[0].phonetics[0];

    return {
      word,
      pronunciation: phonetic.text || null,
      audio: phonetic.audio || null,
      wikipedia: phonetic.sourceUrl || null,
      translations: formatMeanings(data[0].meanings)
    }
  } catch (error) {
    console.error(error);
  }
}

function formatMeanings(meanings) {
  return meanings.map(meaning => [
    meaning.partOfSpeech,
    meaning.definitions
      .map(definition => [
        definition.definition, definition?.example || null
      ])])
}
