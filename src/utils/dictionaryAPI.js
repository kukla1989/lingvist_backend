require('dotenv').config();

const merriamApiURL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'
const merriamApikey = process.env.MERRIAM_API_KEY;
console.log(merriamApikey, 'merriamApikey')
const myMemoryApiURL = 'https://api.mymemory.translated.net'; // limit 50 000 chars/day.
const mail = 'roma1987@protonmail.com';

async function fetchWordTranslation(word) {
  try {
    const data = await fetch(`${merriamApiURL + word.trim()}?key=${merriamApikey}`);
    const response = await data.json();

    return addUkrainianTranslations({
      word,
      pronunciation: response[0]?.hwi.prs[0].mw || null,
      audio: response[0]?.hwi.prs[0].sound.audio || null,
      translations: extractDefinitions(response),
    })
  } catch (error) {
    console.error(error);
  }
}

async function addUkrainianTranslations(word) {
  let meanings = [word.word]
  Object.entries(word.translations)
    .forEach(partOfSpeech => partOfSpeech[1]
      .slice(0, 2)
      .forEach(el => el
        .slice(0, 2)
        .forEach(pair => {
          meanings.push(pair.definition)
          if (pair.example) {
            meanings.push(pair.example)
          }
        })
      ))

  meanings = meanings.map(sentence => removeBraces(sentence))

  const promises = meanings.filter(Boolean)
    .map(text => translate(text))
  const ukrMeanings = await Promise.all(promises)

  word.wordTranslation = ukrMeanings.shift()
    .replace(/[^А-Яа-яҐґЄєІіЇї\s]/g, '');

  Object.entries(word.translations)
    .forEach(partOfSpeech => partOfSpeech[1]
      .slice(0, 2)
      .forEach(el => el
        .slice(0, 2)
        .forEach(pair => {
          pair.ukrDefinition = ukrMeanings.shift()
          pair.example && (pair.ukrExample = ukrMeanings.shift())
        })
      ))

  return word;
}

async function translate(text, { from = 'en', to = 'uk' } = {}) {
  try {
    const res = await fetch(
      `${myMemoryApiURL}/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}&de=${mail}`
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

/**
 *
 * @param data
 * * @returns {{ noun: { definition: string, example: string }[] }}
 * */
function extractDefinitions(data) {
  const res = {};

  data.forEach(el => {
    const definitions = formatDefinitions(el);
    const partOfSpeech = el.fl;

    if (res[partOfSpeech]) {
      res[partOfSpeech].push(...definitions);
    } else {
      res[partOfSpeech] = definitions;
    }
  })

  return res
}

function formatDefinitions(data) {
  const res = []

  data.def[0].sseq.map(el => {
    const definitions = []
    el.forEach(el => {
      if (el.dt === undefined) {
        definitions.push({
            definition: el[1].dt[0][1],
            example: el[1]?.dt?.[1]?.[1]?.[0]?.t ?? null
          }
        );
      }

      definitions.push({
          definition: el[1].dt[0][1],
          example: (el[1].dt[1] || null) && el[1].dt[1][1][0].t
        }
      )
    })

    res.push(definitions)
  })

  return res;
}


function removeBraces(str) {
  return str
    .replace(/\{sx\|([^|]*)\|\|[^}]*}/g, '$1') // retrieve 'string' from {sx|string||...}
    .replace(/\{[^}]*}/g, '')                  // delete all other {string}
    .trim();
}

module.exports = { fetchWordTranslation, translate };


