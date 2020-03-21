//firebase
var dbRef = firebase.database().ref();
var usersRef = dbRef.child("personal_data");

//html
var userListUI = document.getElementById("userList");


usersRef.on("child_added", snap => {
  let user = snap.val();
  let $li = document.createElement("li");
  $li.innerHTML = user.fname + " " + user.lname;
  $li.setAttribute("child-key", snap.key); 
  $li.addEventListener("click", userClicked)
  userListUI.append($li);
});

function userClicked(e)
{
  var userID = e.target.getAttribute("child-key");
  var refChild = 'mood_data/' + userID
  var moodRef = dbRef.child(refChild);
  
  var moodListlUI = document.getElementById("moodList");
  moodListlUI.innerHTML = ""

  var moodDetailUI = document.getElementById("moodDetail");
  moodDetailUI.innerHTML = ""

  moodRef.on("child_added", snap => {

    let key = snap.key

    if (key != "green" && key != "yellow" && key != "red")
    {
      var newRefChild = 'mood_data/' + userID + '/'+snap.key
      
      var moodDetailRef = dbRef.child(newRefChild);
      var entry = ""
      moodDetailRef.on("child_added", snap => {

        entry = ""

        if (snap.key == "time")
        {
          time = snap.val()
        }

        if (snap.key == "date")
        {
          date = snap.val()
        }

        entry = "Datapoint from " + date + " " + time

      });

      let $li = document.createElement("li");
      $li.innerHTML = entry
      $li.setAttribute("child-key", newRefChild); 
      $li.addEventListener("click", moodClicked)
      moodListlUI.append($li);
    }
    
  });
}

function moodClicked(e)
{
  var position = e.target.getAttribute("child-key");
  var moodDetailRef = dbRef.child(position);

  var moodDetailUI = document.getElementById("moodDetail");
  moodDetailUI.innerHTML = ""

  moodDetailRef.on("child_added", snap => {
    
    //alert(snap.val());

    var $p = document.createElement("p");

    if (snap.key == "mood")
    {
      $p.innerHTML = "Mood: " + snap.val()
    }

    if (snap.key == "time")
    {
      $p.innerHTML = "Time: " + snap.val()
    }

    if (snap.key == "date")
    {
      $p.innerHTML = "Date: " + snap.val()
    }

    //$p.innerHTML = snap.key + " - " + snap.val()

    moodDetailUI.append($p);
      
  });
}
