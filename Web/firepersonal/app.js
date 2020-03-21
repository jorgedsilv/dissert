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

  function userClicked(e) {

    var userID = e.target.getAttribute("child-key");

    const userDetailRef = dbRef.child('personal_data/' + userID);

    const userDetailUI = document.getElementById("userDetail");
    userDetailUI.innerHTML = ""

    userDetailRef.on("child_added", snap => {
      var $p = document.createElement("p");

      if (snap.key == "fname")
      {
        $p.innerHTML = "First name: " + snap.val()
      }

      if (snap.key == "lname")
      {
        $p.innerHTML = "Last name: " + snap.val()
      }

      if (snap.key == "email")
      {
        $p.innerHTML = "Email: " + snap.val()
      }

      if (snap.key == "birthday")
      {
        $p.innerHTML = "Birthday: " + snap.val()
      }

      if (snap.key == "gender")
      {
        $p.innerHTML = "Gender: " + snap.val()
      }

      //$p.innerHTML = snap.key + " - " + snap.val()

      userDetailUI.append($p);
      /*let user = snap.val();
      var fname = user.fname;
      var lname = user.lname;
      var birth = user.birthday;
      var gender = user.gender;
      var mail = user.email;*/

      //$(#detail_body).append("<tr><td>" + fname+ "</td><td>" + lname+ "</td><td>" + mail+ "</td></tr>");

    });
  }