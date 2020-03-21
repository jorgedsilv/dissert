//firebase
var dbRef = firebase.database().ref();
var usersRef = dbRef.child("personal_data");

usersRef.on("child_added", snap => {

  var fname = snap.child("fname").val();
  var lname = snap.child("lname").val();
  var email = snap.child("email").val();
  var dnasc = snap.child("birthday").val();

  //alert(snap.key);
  var childKey = snap.key;

  /*
  <div class="mdl-cell mdl-cell--3-col mdl-cell--middle">
        <div class="mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title">
              <h2 class="mdl-card__title-text"><i class="material-icons">person</i> Pessoa</h2>
            </div>
            <div class="mdl-card__title">
              <h2 class="mdl-card__title-text"><i class="material-icons">email</i> Email</h2>
            </div>
            <div class="mdl-card__title">
              <h2 class="mdl-card__title-text"><i class="material-icons">perm_contact_calendar</i> Nascimento</h2>
            </div>
            <div class="mdl-card__actions mdl-card--border">
              <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                See more
              </a>
            </div>
        </div>
  </div>
  */

  let firstLine = "<div class=\"mdl-cell mdl-cell--3-col mdl-cell--middle\">";
  let secondLine = "<div class=\"mdl-card mdl-shadow--2dp\">";
  let thirdLine = "<div class=\"mdl-card__title\">";
  let thirdLineInner = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">person</i>"+ fname + " "+ lname +"</h2>";
  let forthLineFin = "</div>";
  
  let fifthLineInner = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">email</i>"+ email+"</h2>";
  
  let sixthLineInner = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">perm_contact_calendar</i>"+ dnasc+"</h2>";
  
  let buttonCard = "<div class=\"mdl-card__actions mdl-card--border\">";

  let buttonCardInner = "<a id=\"btn\" data-key=\""+ childKey +"\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\"> See more </a>";
  //alert(buttonCardInner);

  $("#userList").append(firstLine +
                        secondLine +
                        thirdLine + thirdLineInner + forthLineFin + 
                        thirdLine + fifthLineInner + forthLineFin +
                        thirdLine + sixthLineInner + forthLineFin +
                        buttonCard + buttonCardInner +
                        forthLineFin + forthLineFin + forthLineFin);

  //--
  /*var firstLine = $('<div class="mdl-cell mdl-cell--3-col mdl-cell--middle">');
  $("#userList").append(firstLine);
  
  var secondLine = $('<div class="mdl-card mdl-shadow--2dp">');
  $("#userList").append(secondLine);
  
  var titleCard = $('<div class="mdl-card__title">');
  $("#userList").append(titleCard);

  var thirdLine = $('<h2 class="mdl-card__title-text"><i class="material-icons">person</i>"+ fname + " "+ lname +"</h2>');
  $("#userList").append(thirdLine);

  var titleCardFin = $('</div>');
  $("#userList").append(titleCardFin);

  var fifthLine = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">email</i>"+ email+"</h2>";
  
  var sixthLine = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">perm_contact_calendar</i>"+ dnasc+"</h2>";
  
  var buttonCard = ('<div class="mdl-card__actions mdl-card--border">');
  $("#userList").append(buttonCard);

  var buttonCardInner = ('<a id="btn" data-key="childKey" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"> See more </a>');
  //var buttonCardInner = ('<a href="#">test</a>');
  $("#userList").append(buttonCardInner);

  $("#userList").append(titleCardFin);
  $("#userList").append(titleCardFin);
  $("#userList").append(titleCardFin);*/

  /*$("#userList").append(firstLine +
                        secondLine +
                        titleCard + thirdLine + titleCardFin + 
                        buttonCard + buttonCardInner +
                        titleCardFin + titleCardFin + titleCardFin);*/

  //buttonCardInner..on('click', function(){alert("test")});
});

/*$("#btn").click(
  function () 
  {
    //var x = document.getElementById("btn").getAttribute("data-key");
    //alert(x); 
    var x = btn.getAttribute("data-key");
    alert(x);
  }
);*/
