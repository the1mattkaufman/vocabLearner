const functions = require('firebase-functions');

exports.getRandomWord = functions.https.onRequest((request, response) => {
  const words = [
    { 'word':'consider', 'definition':'deem to be' },
    { 'word':'minute', 'definition':'infinitely or immeasurably small' },
    { 'word':'accord', 'definition':'concurrence of opinion' },
    { 'word':'evident', 'definition':'clearly revealed to the mind or the senses or judgment' },
    { 'word':'practice', 'definition':'a customary way of operation or behavior' },
    { 'word':'intend', 'definition':'have in mind as a purpose' },
    { 'word':'concern', 'definition':'something that interests you because it is important'},
    { 'word':'commit', 'definition':'perform an act, usually with a negative connotation' },
    { 'word':'issue', 'definition':'some situation or event that is thought about' },
    { 'word':'approach', 'definition':'move towards' }
  ];
  const w = words[Math.floor(Math.random()*words.length)];
  response.json(w);
});
