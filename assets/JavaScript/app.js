$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyCFe022nkmCELTnvdLMr9g9IdXRg8KqJxQ",
    authDomain: "train-scheduler-419ea.firebaseapp.com",
    databaseURL: "https://train-scheduler-419ea.firebaseio.com",
    projectId: "train-scheduler-419ea",
    storageBucket: "train-scheduler-419ea.appspot.com",
    messagingSenderId: "146986506562",
    appId: "1:146986506562:web:777ba010de222879"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Variables for the onClick event
  var name;
  var destination;
  var firstTrain;
  var frequency = 0;

  $("#add-train").on("click", function() {
      event.preventDefault();
      // Storing and retreiving new train data
      name = $("#TrainName").val().trim();
      destination = $("#Destination").val().trim();
      firstTrain = $("#TrainTime").val().trim();
      frequency = $("#Frequency").val().trim();
    // temporary object for holding new train data 
    var tempTrain = {
    name:name,
    destination:destination,
    firstTrain:firstTrain,
    frequency:frequency
    };

      // Pushing to database
      database.ref().push(tempTrain)
        console.log(tempTrain.name)
      
      
    
  });

  database.ref().on("child_added", function(childSnapshot) {
     
      var minAway;
      // Chang year so first train comes before now
      var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
      // Difference between the current and firstTrain
      var diffTime = moment().diff(moment(firstTrainNew), "minutes");
      var remainder = diffTime % childSnapshot.val().frequency;
      // Minutes until next train
      var minAway = childSnapshot.val().frequency - remainder;
      // Next train time
      var nextTrain = moment().add(minAway, "minutes");
      nextTrain = moment(nextTrain).format("hh:mm");

      $("#Current-Train-table").append("<tr><td>" + childSnapshot.val().name +
              "</td><td>" + childSnapshot.val().destination +
              "</td><td>" + childSnapshot.val().frequency +
              "</td><td>" + nextTrain + 
              "</td><td>" + minAway + "</td></tr>");

          // Handle the errors
      }, function(errorObject) {
          console.log("Errors handled: " + errorObject.code);
  });
});
