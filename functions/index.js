const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = admin.initializeApp();
const settings = {timestampsInSnapshots: true};

var db = admin.firestore();
db.settings(settings);

const words = [
  { 'word':'consider', 'definition':'deem to be', 'timesViewed':0 },
  { 'word':'minute', 'definition':'infinitely or immeasurably small', 'timesViewed':0 },
  { 'word':'accord', 'definition':'concurrence of opinion', 'timesViewed':0 },
  { 'word':'evident', 'definition':'clearly revealed to the mind or the senses or judgment', 'timesViewed':0 },
  { 'word':'practice', 'definition':'a customary way of operation or behavior', 'timesViewed':0 },
  { 'word':'intend', 'definition':'have in mind as a purpose', 'timesViewed':0 },
  { 'word':'concern', 'definition':'something that interests you because it is important', 'timesViewed':0},
  { 'word':'commit', 'definition':'perform an act, usually with a negative connotation', 'timesViewed':0 },
  { 'word':'issue', 'definition':'some situation or event that is thought about', 'timesViewed':0 },
  { 'word':'approach', 'definition':'move towards', 'timesViewed':0 }
];

const collectionReference = db.collection('words');

let incrementWord = (wordObject) => {
  console.info('incrementWord on '+wordObject.word);

  return collectionReference.doc(wordObject.word).update({timesViewed: wordObject.timesViewed+1})
  .then( updateRes => {
    console.log('updateRes',updateRes);
    return wordObject;
  }).catch( err => {
    console.log( 'err46',err );
    return err;
  });
};

let queryWord = () => {
  return collectionReference.orderBy("timesViewed").limit(1)
  .get()
  .then( querySnapshot => {
    if (querySnapshot.empty) {
      console.log('no documents found');
      return { error: 'no documents found'};
    } else {
      var data = querySnapshot.docs.map( documentSnapshot => {
        return documentSnapshot.data();
      });
      console.log('data',data[0]);
      return data[0];
    }
  })
}

let getWord = () => {
  return queryWord()
  .then( wordObject => {
    console.log('wordObject',wordObject);
    return incrementWord(wordObject);
  }).catch( err2=>{
    console.log( 'err2',err2 );
    return { error: err2 };
  });
}

exports.getLeastViewedWord = functions.https.onCall((data) => {
  return getWord();
});

exports.getNextWord = functions.https.onRequest((request, response) => {
  let word = getWord();
  response.json( word );
});

exports.populateSampleData = functions.https.onRequest((request, response) => {
  var batch = db.batch();
  for ( let w in words ){
    var wRef = db.collection("words").doc(words[w].word);
    batch.set(wRef, words[w] );
  }
  batch.commit().then(() => {
    console.log('done');
    response.json(words);
    return;
  })
  .catch( error => {
    console.log(error);
    response.send(error);
  });
});