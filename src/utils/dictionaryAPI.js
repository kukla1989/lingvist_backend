const dicionaryApiURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const mymemoryApiURL = 'https://api.mymemory.translated.net';

async function fetchWordTranslation(word) {
  try {
    const res = await fetch(dicionaryApiURL + word.trim());
    const data = await res.json();
    const phonetic = data[0].phonetics[0];

    return addUkrainianTranslations({
      word,
      pronunciation: phonetic?.text || null,
      audio: phonetic?.audio || null,
      wikipedia: phonetic?.sourceUrl || null,
      translations: formatMeanings(data[0].meanings)
    })
  } catch (error) {
    console.error(error);
  }
}

async function addUkrainianTranslations(word) {
  const meanings = [word.word]
  word.translations.forEach(partOfSpeech => partOfSpeech[1]
    .forEach(pair => meanings.push(pair[0], pair[1]))
  )

  const promises = meanings.filter(Boolean)
    .map(text => translate(text))
  const ukrTranslate = await Promise.all(promises)

  word.wordTranslation = ukrTranslate.shift()
    .replace(/[^А-Яа-яҐґЄєІіЇї\s]/g, '');

  word.translations.forEach(partOfSpeech => partOfSpeech[1]
    .forEach(pair => {
      pair.splice(1, 0, ukrTranslate.shift())
      pair[2] && pair.push(ukrTranslate.shift())
    })
  )

  return word;
}

function formatMeanings(meanings) {
  return meanings.map(meaning => [
    meaning.partOfSpeech,
    meaning.definitions
      .map(definition => [
        definition.definition, definition?.example || null
      ])])
}

async function translate(text, { from = 'en', to = 'uk' } = {}) {
  try {
    const res = await fetch(
      `${mymemoryApiURL}/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
    );

    const data = await res.json();
    const result = data.responseData.translatedText;
    if (result === text && data.matches.length) {
      return data.matches[0].translation;
    }

    return result;
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}


