// Setup variables to track the inputs for change/no-change
window.inSells = ''
window.inIndustry = ''
window.inValueProp = ''
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
window.verbEndingOptions = [
  'ing', 'ion', 'ent'
]
window.infinitiveVerbEndingsOptions = [
  '@', 'sh'
]
window.verbifyOptions = [
  'ify', 'ize'
]
window.verbificationOptions = [
  'ification', 'ization'
]

function generateOKR(callback) {
  // Pull values
  var in1 = $('#in-sells').val()
  var in2 = $('#in-industry').val()
  var in3 = $('#in-valueprop').val()
  if (window.inSells == in1 && window.inIndustry == in2 && window.inValueProp == in3) {
    setTimeout(function() {
      nextOKR(callback)
    }, Math.random()*500 + 400)
    return
  }

  // Assign to window vars
  window.inSells = in1
  window.inIndustry = in2
  window.inValueProp = in3
  window.sentenceStructure = getRandomInt(0, 5)
  
  // Get the nouns first (all sentence structs require a generic noun)
  var queryTerm = window.inSells.toLowerCase().replace(/ /g, '+')
  var request = $.ajax('https://api.datamuse.com/words?md=p&ml=' + queryTerm)
    .done(function(data) {
      var nounOptions = []
      data.forEach(function(word) {
        if (word.tags && word.tags.includes('n') &&
            !word.tags.includes('adv') &&
            !['the','it'].includes(word.word)) {
          nounOptions.push(word.word)
        }
      })
      window.nounOptions = nounOptions;
      
      // Verb request
      queryTerm = randomOption([window.inIndustry, window.inValueProp])
        .toLowerCase().replace(/ /g, '+')
      var endingIn = window.sentenceStructure === 3 ? randomOption(window.infinitiveVerbEndingsOptions) : 
        randomOption(window.verbEndingOptions)
      request = $.ajax('https://api.datamuse.com/words?md=p&ml=' + queryTerm + '&sp=*' + endingIn)
        .done(function(data) {
          var verbOptions = []
          data.forEach(function(word) {
            if (word.tags && word.tags.includes('v')) {
              verbOptions.push(word.word)
            }
          })
          window.verbOptions = verbOptions
          nextOKR(callback)
        })
        .fail(function() {
          alert('failed!')
        })
      })
    .fail(function() {
      alert('failed!')
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
  var randomValue = getRandomInt(1, 101)
  var sentenceStructure = getRandomInt(0, 5)
  // Adjust verbs if necessary
  var verbOptions = window.verbOptions.slice()
  if (verbOptions.length < 2) {
    window.nounOptions.forEach(function(word) {
      verbOptions.push(word + (sentenceStructure == 3 ? randomOption(window.verbifyOptions) : 
                              randomOption(window.verbificationOptions)))
    })
  }
  switch(sentenceStructure) {
    case 0:
      callback(randomOption(randomOption([window.increaseSyns, window.decreaseSyns])) +
               ' ' + randomOption(window.nounOptions) + ' ' + randomOption(verbOptions) + ' by ' +
              numberToWord(randomValue) + ' ' + randomOption(window.valueModifierOptions) + 
              pluralize(randomOption(window.nounOptions)))
      break
    case 1:
      callback(jsUcfirst(randomValue + '') + 'X our ' + randomOption(window.nounOptions) + ' ' + randomOption(verbOptions))
      break
    case 2:
      callback(randomOption(randomOption([window.startSyns, window.stopSyns])) +
              ' ' + randomOption(verbOptions) + ' of the ' + randomOption(window.nounOptions))
      break
    case 3:
      callback(jsUcfirst(randomOption(verbOptions)) + ' the ' + randomOption(window.nounOptions) +
              ' ' + numberToWord(randomValue) + ' times')
      break
    case 4:
      callback(randomOption(window.hideSyns) + ' all ' + randomOption(window.traceSyns) + ' of ' +
              randomOption(window.nounOptions) + ' ' + randomOption(verbOptions))
      break
  }
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