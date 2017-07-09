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
  'Hide', 'Conceal', 'Obliterate', 'Cover up', 'Enshroud', 'Blot out', 'Bury', 'Stash'
]
window.traceSyns = [
  'traces', 'hints', 'suggestions', 'tracks', 'residue', 'fragments', 'remnants', 'samples', 'footprints',
  'clues', 'tracings', 'signs', 'records', 'leftovers', 'impressions', 'breadcrumbs', 'tracks'
]
window.unitOptions = [
  '%', 'percent', 'kilograms', 'kg', 'tons', 'visits', 'impressions', 'cubic feet', 'square feet',
  'users', 'sign-ups', 'thousand', 'million', 'billion', 'trillion', 'lakhs', 'dollars', 'sales'
]
window.verbEndingOptions = [
  'ing', 'ion'
]
window.infinitiveVerbEndingsOptions = [
  'e', 'sh'
]

function generateOKR(callback) {
  // Pull values
  var in1 = $('#in-sells').val()
  var in2 = $('#in-industry').val()
  var in3 = $('#in-valueprop').val()
  if (window.inSells == in1 && window.inIndustry == in2 && window.inValueProp == in3) {
    console.log('No change detected, returning')
    callback()
    return
  }

  // Assign to window vars
  window.inSells = in1
  window.inIndustry = in2
  window.inValueProp = in3

  /*
  Sentence structure works like this:
    0: [Increase]/[Decrease] {NOUN} {VERB}-ing/ion by {VALUE} {UNIT}
    1: {VALUE}x our {NOUN} {VERB}-ing/ion
    2: [Start]/[Stop] {VERB}-ing/ion the {NOUN}
    3: {VERB}-e/sh the {NOUN} {VALUE} times
    4: [Hide] all [traces] of {NOUN} {VERB}-ing/ion
  */
  var sentenceStructure = getRandomInt(0, 5);
  var randomValue = getRandomInt(1, 999)
  // Get the nouns first (all structures require a generic noun)
  var nounQuery = randomOption([window.inSells,window.inIndustry,window.inValueProp])
    .toLowerCase().replace(/ /g, '+')
  var request = $.ajax('https://api.datamuse.com/words?md=p&ml='+nounQuery)
    .done(function(data){
      var jsonNounResult = JSON.parse(data)
      var nounOptions = []
      
    })
    .fail(function() {
      alert('failed!')
    })
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