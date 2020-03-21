$( document ).ready(function(){
//firebase
var dbRef = firebase.database().ref();
var usersRef = dbRef.child("personal_data");

var index = 0;

usersRef.on("child_added", snap => {

  //var fname = snap.child("fname").val();
  //var lname = snap.child("lname").val();
  //var email = snap.child("email").val();
  //var dnasc = snap.child("birthday").val();

  //alert(snap.val());
  var childKey = snap.key;
  var user = snap.val();

  var fname = user.fname;
  var lname = user.lname;
  var email = user.email;
  var dnasc = user.birthday;

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
  
  var firstLine = "<div id=\""+"userCell"+"\" class=\"mdl-cell mdl-cell--3-col mdl-cell--middle\">";
  
  var secondLine = "<div id=\""+"cardHeader"+"\" class=\"mdl-card mdl-shadow--2dp\">";
  
  var titleCard = "<div class=\"mdl-card__title\">";
  var thirdLine = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">person</i>"+ fname + " "+ lname +"</h2>";
  var titleCardFin = "</div>";
  
  var fifthLine = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">email</i>"+ email+"</h2>";
  
  var sixthLine = "<h2 class=\"mdl-card__title-text\"><i class=\"material-icons\">perm_contact_calendar</i>"+ dnasc+"</h2>";
  
  var buttonCard = "<div id=\""+"cardButton"+"\" class=\"mdl-card__actions mdl-card--border\">";
  
  //var buttonCardInner = "<a id=\"btn\" data-key=\""+ childKey +"\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\"> See more </a>";
  var buttonCardInner = "<a id=\""+ childKey +"\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\"> See more </a>";
  //alert(buttonCardInner);

  // Attach a delegated event handler
 // $( "#userList" ).on( "click", "a id="+childKey+"", function( event ) 
  $("#userList").on( "click", "a", function( event ) 
  {
    event.preventDefault();
    //alert("here");
    var tag = document.getElementsByTagName("a")[index];
    var cardId = tag.getAttributeNode("id").value;

    /*if (cardId == childKey) 
    {
      alert(cardId + " = " + childKey);
    }*/
    alert(cardId == childKey);

    index += 1;
  });

  index =0;

  $("#userList").append(firstLine +
                        secondLine +
                        titleCard + thirdLine + titleCardFin + 
                        titleCard + fifthLine + titleCardFin +
                        titleCard + sixthLine + titleCardFin +
                        buttonCard + buttonCardInner +
                        titleCardFin + titleCardFin + titleCardFin);
});
});
