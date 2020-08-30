var firebaseConfig = {
    apiKey: "AIzaSyCLX19KkRYYTJLJbQJHEj7WibRfD6HAvNI",
    authDomain: "journalsystem-b5ff8.firebaseapp.com",
    databaseURL: "https://journalsystem-b5ff8.firebaseio.com",
    projectId: "journalsystem-b5ff8",
    storageBucket: "journalsystem-b5ff8.appspot.com",
    messagingSenderId: "697940753516",
    appId: "1:697940753516:web:ef04ec4405fa1b11a7ac49",
    measurementId: "G-TZG5RC8PH0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const db = firebase.firestore();



  $("#logInButton").on("click", function(){
    var email = $("#inputEmail").val();
    var password = $("#inputPassword").val();

    const promise = firebase.auth().signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
});
$("#userButton").on("click", function() {
  var user = firebase.auth().currentUser;
  $("#user").text(user.email)
})



var storage = firebase.storage();
var storageRef = storage.ref("patients/");
var textRef = storageRef.child("test");

  
var textFile = null;
function makeTextFile(text) {
    var data = new Blob([text], {type: 'text'});

    textRef.put(data).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    });

      
};

$("#fileButton").on("click", function(){
  var textBox = $("#textInput");
  var user = firebase.auth().currentUser;
  makeTextFile(textBox.val());
  });

$("#viewButton").on("click", function(){



  storageRef.listAll().then(function(res) {
    res.items.forEach(function(itemRef) {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
      getText(itemRef)

    });
  })
})
function getText(itemsRef){
  itemsRef.getMetaDate().then(function(URL){
    console.log(URL)
  })
}