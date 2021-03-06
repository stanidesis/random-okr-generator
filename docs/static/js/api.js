// Setup variables to track the inputs for change/no-change
window.in1 = ''
window.in2 = ''
window.in3 = ''
// Track parsed results
window.nounOptions = []
window.verbOptions = []
// Setup hardcoded synonyms
window.increaseSyns = [
  'Increase', 'Expand', 'Gain', 'Boost', 'Improve', 'Escalate', 'Grow', 'Up', 'Strengthen',
  'Bolster', 'Enhance', 'Stimulate', 'Inflate', 'Enlarge', 'Upgrade', 'Accelerate', 'Intensify'
]
window.decreaseSyns = [
  'Decrease', 'Lesson', 'Diminish', 'Drop', 'Reduce', 'Minify', 'Shrink', 'Dwindle', 'Cut', 'Weaken',
  'Minimize', 'Depress', 'Impair', 'Erode', 'Shorten'
]
window.startSyns = [
  'Start', 'Begin', 'Commence', 'Initiate', 'Start up', 'Embark on', 'Set about', 'Resume', 'Restart'
]
window.stopSyns = [
  'Stop', 'Halt', 'Cease', 'Quit', 'Discontinue', 'Terminate', 'Kibosh', 'Arrest', 'Give up', 'Lay off',
  'Prevent', 'Curb', 'Avoid', 'Desist', 'Resist', 'Refrain from', 'Restrain', 'Curtail', 'Shut down',
  'Eliminate', 'Disrupt', 'Derail', 'Neutralize', 'Rein in', 'Quell', 'Abstain from', 'Suspend', 'Kill'
]
window.hideSyns = [
  'Hide', 'Conceal', 'Obliterate', 'Cover up', 'Blot out', 'Bury', 'Stash'
]
window.traceSyns = [
  'traces', 'hints', 'suggestions', 'tracks', 'residue', 'fragments', 'remnants', 'samples', 'footprints',
  'clues', 'tracings', 'signs', 'records', 'leftovers', 'impressions', 'tracks'
]
window.unitOptions = [
  '%', 'percent', 'kilograms', 'kg', 'tons', 'visits', 'impressions', 'cubic feet', 'square feet',
  'users', 'sign-ups', 'lakhs', 'dollars', 'sales'
]
window.valueModifierOptions = [
  '', 'dozen ', '', 'hundred ', '', 'thousand ', '', 'million ', '', 'billion ', '', 'trillion '
]
window.verbifyOptions = [
  'ify', 'ize'
]
window.verbificationOptions = [
  '-ification', '-ization', '-ery', '-ication',
]
window.shareTexts = [
  'Our winning strategy this quarter is to, {{REPLACE}} -- jealous?',
  'Your OKRs will cower in fear before, {{REPLACE}}',
  'That\'s it, we\'re pivoting to {{REPLACE}} and that\'s final',
  'Attention all employees, stop what you\'re doing and start {{REPLACE}}'
]

function generateOKR(callback) {
  // Pull values
  var in1 = $('#in-1').val()
  var in2 = $('#in-2').val()
  var in3 = $('#in-3').val()
  if (window.in1 == in1 && window.in2 == in2 && window.in3 == in3) {
    setTimeout(function() {
      nextOKR(callback)
    }, Math.random()*500 + 400)
    return
  }

  // Assign to window vars
  window.in1 = in1
  window.in2 = in2
  window.in3 = in3
  window.sentenceStructure = getRandomInt(0, 5)
  window.nounOptions = []
  window.verbOptions = []
  
  // Get words from the company name first (all sentence structs require a generic noun)
  var queryTerm = window.in1.toLowerCase().replace(/ /g, ',')
  getWords(queryTerm, null, function(result) {
    if (!result) { callback() }
    queryTerm = window.in3.toLowerCase().replace(/ /g, ',')
    var topics = window.in2.toLowerCase().split(' ').slice(0,5).join(',')
    getWords(queryTerm, topics, function(result) {
      if (!result) { callback() }
      getWords(window.in2.toLowerCase().replace(/ /g, ','), null, function(result) {
        if (!result) { callback() }
        nextOKR(callback)
      })
    })
  })
}

function getWords(searchTerm, topics, callback) {
  $.ajax('https://api.datamuse.com/words?md=p&ml=' + searchTerm + 
         (topics ? '&topics=' + topics : ''))
    .done(function(data) {
      data.forEach(function(word) {
        if (word.tags) {
          if (word.tags.includes('v')) {
            window.verbOptions.push(word.word)
          }
          if (word.tags.includes('n') &&
            !['the','it'].includes(word.word)) {
            window.nounOptions.push(word.word)
          }
        }
      })
      callback(true)
    })
    .fail(function() {
      callback(false)
    })
}

function nextOKR(callback) {
  /*
  Sentence structure works like this:
    0: [Increase]/[Decrease] {NOUN} {VERB}-ing/ion by {VALUE} {UNIT}
    1: {VALUE}x our {NOUN} {VERB}-ing/ion
    2: [Start]/[Stop] {VERB}-ing/ion of the {NOUN}
    3: {VERB}-e/sh the {NOUN} {VALUE} times
    4: [Hide] all [traces] of {NOUN} {VERB}-ing/ion
  */
  var randomValue = getRandomInt(2, 101)
  var sentenceStructure = getRandomInt(0, 5)
  var verbifyNoun = window.verbOptions.size < 2 || (getRandomInt(0, 100) > 89)
  var okr = ''
  switch(sentenceStructure) {
    case 0:
      okr = randomOption(randomOption([window.increaseSyns, window.decreaseSyns])) +
               ' ' + randomOption(window.nounOptions) + ' ' + getRandomVerb(sentenceStructure, verbifyNoun) + ' by ' +
              numberToWord(randomValue) + ' ' + randomOption(window.valueModifierOptions) + 
              pluralize(randomOption(window.nounOptions))
      break
    case 1:
      okr = jsUcfirst(randomValue + '') + 'X our ' + randomOption(window.nounOptions) + ' ' + 
        getRandomVerb(sentenceStructure, verbifyNoun)
      break
    case 2:
      okr = randomOption(randomOption([window.startSyns, window.stopSyns])) +
              ' ' + getRandomVerb(sentenceStructure, verbifyNoun) + ' of the ' + randomOption(window.nounOptions)
      break
    case 3:
      okr = jsUcfirst(getRandomVerb(sentenceStructure, verbifyNoun)) + ' the ' + randomOption(window.nounOptions) +
              ' ' + numberToWord(randomValue) + ' times'
      break
    case 4:
      okr = randomOption(window.hideSyns) + ' all ' + randomOption(window.traceSyns) + ' of ' +
              randomOption(window.nounOptions) + ' ' + getRandomVerb(sentenceStructure, verbifyNoun)
      break
  }
  okr = '“' + okr + '”'
  callback(okr, randomOption(window.shareTexts).replace('{{REPLACE}}', okr))
}

function getRandomVerb(sentenceStructure, shouldVerbify) {
  if (!shouldVerbify) { return randomOption(window.verbOptions) }
  return randomOption(window.nounOptions) + 
    (sentenceStructure == 3 ? randomOption(window.verbifyOptions) : randomOption(window.verbificationOptions))
}

function numberToWord(integer) {
  if (integer > 10) {
    return integer + ''
  }
  return ['one','two','three','four','five','six','seven','eight','nine','ten'][integer - 1]
}

function pluralize(noun) {
  if (noun.charAt(noun.length - 1) == 's') {
    return noun
  }
  return noun + 's'
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
        
function randomOption(array) {
  return array[getRandomInt(0, array.length)]
}

// Get a random integer
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}