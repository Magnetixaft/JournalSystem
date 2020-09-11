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

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
      console.log("redirect")
      window.location.replace("http://127.0.0.1:5500/view.html");
    }).catch(error => console.log(error.message));

});

$("#logOutButton").on("click", function(){
  firebase.auth().signOut().then(function() {
    console.log("User signed out")
  }).catch(function(error) {
    console.log("Error signing user out: " + error.message)
  })

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

  /*textRef.put(data).then(function(snapshot) {
    var downloadURL = snapshot.downloadURL;
    console.log(downloadURL);
    });*/

    var uploadTask = storageRef.put(data); 
  
    // all working for progress bar that in html 
    // to indicate image uploading... report 
    uploadTask.on('state_changed', function(snapshot){ 
      var progress =  
       (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
        if(progress==100){
          console.log("uploaded")
        }

    }, function(error) {console.log(error); 
    }, function() { 

         // get the uploaded image url back 
         uploadTask.snapshot.ref.getDownloadURL().then( 
          function(downloadURL) { 

         // You get your url from here 
          console.log('File available at', downloadURL); 

        // print the image url  
         console.log(downloadURL); 
      }); 
    }); 
};

 function iterateFieldsFirestore(collectionRef, docRef){
  var docRef = db.collection(collectionRef).doc(docRef);
  docRef.get().then(snapshot => {
      const fields = snapshot.data();

      for(const key in fields) {
          const field = fields[key];
          //const field == varje field i ett dock iteration

      }

  })
}

function iterateDocsFirestore(collectionRef){
  var collectionRef = db.collection(collectionRef)
  collectionRef.get().then(snapshot => {

    snapshot.forEach(doc => {
      console.log(doc.id)
      renderPatientHTML(doc.id)
    })
  })
}

class Patient {
  constructor (namn, email, telefon, adress, person, textInput) {
    this.namn = namn;
    this.email = email;
    this.telefon = telefon;
    this.adress = adress;
    this.person = person;
    this.textInput = textInput;

  }
  toString(){
    return this.namn, this.email, this.telefon, this.adress, this.person, this.textInput;
  }
  toFirebase() {
      return {
        namn: this.namn, 
        email: this.email, 
        telefon: this.telefon, 
        adress: this.adress, 
        person: this.person,
        textInput: this.textInput
      }
  }
}
function createPatient(inputNamn, inputEmail, inputTelefon, inputAdress, inputPerson, textInput){
  var userRef = db.collection("patienter");
  var docRef = userRef.doc(inputNamn);
  console.log(inputNamn, inputEmail, inputTelefon, inputAdress, inputPerson, textInput)
  var patient = new Patient(inputNamn, inputEmail, inputTelefon, inputAdress, inputPerson, textInput);

  var dataToFirebase = patient.toFirebase();
  docRef.set(dataToFirebase);

}


$("#fileButton").on("click", function(){
  var textBox = $("#textInput");
  var user = firebase.auth().currentUser;
  //makeTextFile(textBox.val());



  var inputNamn = $("#inputNamn").val();
  var inputEmail = $("#inputEmail").val();
  var inputTelefon = $("#inputTelefon").val();
  var inputAdress = $("#inputAdress").val();
  var inputPerson = $("#inputPerson").val();
  var textInput = $("#textInput").val();
  createPatient(inputNamn, inputEmail, inputTelefon, inputAdress, inputPerson, textInput);
  

  });

$("#viewButton").on("click", function(){

  iterateDocsFirestore("patienter");
})

function renderPatientHTML(patientFromFirestore){
  const displayPatient = document.querySelector("#displayPatients")
  let li = document.createElement("li");
  let name = document.createElement("h5");
  let viewBtn = document.createElement("a")


  li.classList.add("list-group-item")
  name.classList.add("mb-1")
  viewBtn.classList.add("viewBtn");
  let trashIcon = '<i class="fa fa-trash"></i>'
  viewBtn.innerHTML = trashIcon;
  viewBtn.id = "viewButton"


  name.textContent = patientFromFirestore;

  li.classList.add("list-group-item");
  li.classList.add("d-flex");
  li.classList.add("justify-content-between");
  li.classList.add("align-items-center");

  li.appendChild(name);
  li.appendChild(viewBtn)
  displayPatient.appendChild(li);
}
$('#displayPatients').on('click', '#viewButton', function(){
  namnPatient = $(this).closest("li").children("h5").text();
  var patientRef = db.collection("patienter").doc(namnPatient);
  console.log(namnPatient)
  patientRef.get().then(snapshot => {
    const fields = snapshot.data();

    for(const key in fields) {
        const field = fields[key];
        console.log(field)

    }
  })
})



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(firebase.auth().currentUser.email)
  } else {
    if(window.location.href != "http://127.0.0.1:5500/index.html"){
      console.log("Not signed in and not in index.html")
      window.location.replace("http://127.0.0.1:5500/index.html");
    }
  }
});