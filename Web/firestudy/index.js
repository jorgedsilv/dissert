firebase.auth().onAuthStateChanged(function(user)
{
  if (user)
  {
    //console.log("User is signed in.");
    // User is signed in.

    //console.log(JSON.stringify(user));

    /*if (user.uid != "uyi50NiNCrgJfcZAh4uzDoK1Ucm1")
    {
      $("#loginError").show().text("Not a valid user");

      $("#loginProgress").hide();
      $("#loginBtn").show();
      $(".login-cover").show();

      var email = $("#loginEmail").val("");
      var password = $("#loginPassword").val("");
    }
    else
    {*/
    if (user.uid == "uyi50NiNCrgJfcZAh4uzDoK1Ucm1")
    {
      //console.log("user.uid == ");
      $(".login-cover").hide();

      var dialog = document.querySelector('#loginDialog');
      /*if (! dialog.showModal) 
      {
        dialogPolyfill.registerDialog(dialog);
      }*/
      dialog.close();

      loadHomescreen();
    }
    else
    {
      //console.log("user.uid != ");
      $(".login-cover").show();
      $("#loginError").show().text("Not a valid user");

      $("#loginProgress").hide();
      $("#loginBtn").show();

      var dialog = document.querySelector('#loginDialog');
      if (! dialog.showModal) 
      {
        dialogPolyfill.registerDialog(dialog);
      }
      dialog.showModal();

      //window.location.reload();
    }
  } 
  else 
  {
    // No user is signed in.
    //console.log("No user is signed in.");

    $(".login-cover").show();

    var dialog = document.querySelector('#loginDialog');
    if (! dialog.showModal) 
    {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
  }
});


/* Login process */
$("#loginBtn").click(
  function()
  {
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    if (email != "" && password != "")
    {
      $("#loginProgress").show();
      $("#loginBtn").hide();

      $("#loginEmail").val("");
      $("#loginPassword").val("");

      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error)
      {
        $("#loginError").show().text(error.message);

        $("#loginProgress").hide();
        $("#loginBtn").show();
      });

    }
  }
);

/* Logout process */
$("#logoutBtn").click(
  function ()
  {
    var email = $("#loginEmail").val("");
    var password = $("#loginPassword").val("");
    firebase.auth().signOut().then(function()
    {
      // Sign-out successful.

      var dialog = document.querySelector('#loginDialog');
      if (! dialog.showModal) 
      {
        dialogPolyfill.registerDialog(dialog);
      }
      dialog.showModal();

      $("#loginProgress").hide();
      $("#loginBtn").show();
      $("#loginError").hide();
    }).catch(function(error)
    {
      // An error happened.
      alert(error.message);
    });
  }
);

/* create new study process */
$("#createStudyBtn").click(
  function ()
  {
    $("#createStudyProgress").hide();
    $("#createStudyError").hide();

    $("#createBtn").show();
    $("#cancelBtn").show();

    $("#studyTitle").val("");
    $("#studyLocation").val("");
    $("#studyMagicWord").val("");

    var studyDialog = document.querySelector('#createStudyDialog');
    if (! studyDialog.showModal) 
    {
      dialogPolyfill.registerDialog(studyDialog);
    }
    studyDialog.showModal();

    //tentar gerar automaticamente magicword
    var code = generateMagicword();

    $("#studyLocation").change(function ()
      {
        $("#studyMagicWord").val(code);
        $("#studyMagicWord").parent().addClass('is-dirty');
      });
  }
);

function generateMagicword()
{
  let size = 12;
  let limit = size / 2;
  
  var arr = [];

  var nNumbers = Math.floor((Math.random() * limit) + 1);
  while(nNumbers == 1)
  {
    nNumbers = Math.floor((Math.random() * limit) + 1);
  }

  var nChars = size - nNumbers;

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = chars.length;
  for ( var i = 0; i < nChars; i++ )
  {
    result = chars.charAt(Math.floor(Math.random() * charactersLength));
    arr.push(result);
  }

  var numbers = '0123456789';
  var numbersLength = numbers.length;
  for ( var i = 0; i < nChars; i++ )
  {
    result = numbers.charAt(Math.floor(Math.random() * numbersLength));
    arr.push(result);
  }

  var code = '';
  for ( var i = 0; i < size; i++ )
  {
    var key = '';
    if (i % 2 == 0)
    {
      key = arr.pop(); 
    }
    else
    {
      key = arr.shift();
    }

    code += key;
  }

  return code;
}

/* create study dialog button*/
$("#createBtn").click(
  function ()
  {
    //-- dados que compõem um estudo
    var title = $("#studyTitle").val();
    var location = $("#studyLocation").val();
    var magic_word = $("#studyMagicWord").val();

    /* start date is current date */
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var startdate = dd + '/' + mm + '/' + yyyy;
    /* -- */

    //var enddate = "null";

    //var state = "open";

    //var participants = "null";
    //--

    var studyDialog = document.querySelector('#createStudyDialog');

    if (title.trim() != "" && location.trim() != "" && magic_word.trim() != "")
    {
      $("#createStudyProgress").show();
      $("#createBtn").hide();
      $("#cancelBtn").hide();

      // Get a key for a new Study
      //var newStudyKey = studyRef.push().key;
      var newStudyKey = firebase.database().ref().child('study_data').push().key;

      // A Study entry
      var newStudyData = {
        title: title,
        location: location,
        magicword: magic_word,
        startdate: startdate,
        enddate: "null",
        state: "open",
        participants: [""],
        approved: [""],
        previous: [""]
      };

      // Write the new study's data
      var updates = {};
      updates['/study_data/' + newStudyKey] = newStudyData;

      studyDialog.close();

      alert("Study created!");

      /* --> force page reload */
      window.location.reload();

      return firebase.database().ref().update(updates);
    }
    else if (title.trim() == "" || location.trim() == "" || magic_word.trim() == "")
    {
      $("#createStudyProgress").hide();
      $("#createBtn").show();
      $("#cancelBtn").show();
      $("#createStudyError").show().text("Empty field required");
    }
  }
);

/* cancel create study dialog button */
$("#cancelBtn").click(
  function ()
  {
    $("#createStudyProgress").hide();
    $("#createStudyError").hide();

    var studyDialog = document.querySelector('#createStudyDialog');

    studyDialog.close();

    $("#studyTitle").val("");
    $("#studyLocation").val("");
    $("#studyMagicWord").val("");
  }
);

function loadHomescreen()
{
  $('#afterList').empty();

  //firebase
  var dbRef = firebase.database().ref();
  var studyRef = dbRef.child("study_data");

  studyRef.once('value', function(snapshot)
  {
    snapshot.forEach(function(childSnapshot)
    {
      var childKey = childSnapshot.key;
      var study = childSnapshot.val();

      var title = study.title;
      var location = study.location;
      var participants = study.participants;
      var size = participants.length;

      var approved = study.approved;
      var appSize = approved.length;

      var state = study.state;

      if (size != 0 && participants == "")
      {
        size = 0;
      }

      if (appSize != 0 && approved == "")
      {
        appSize = 0;
      }
      else
      {
        approved.forEach(function(app)
        {
          if (participants.includes(app))
          {
            appSize -= 1;
          }
        });
      }

      if(state == "open")
      {
        $('#afterList').append(
          '<div class="mdl-grid">'+
          '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
            '<div id=+"cardHeader" class="card-users mdl-card mdl-shadow--4dp">' +
              '<div class="mdl-card__title">' +
                '<h2 class="mdl-card__title-text">'+ title +'</h2>' +
              '</div>' +
              '<div class="mdl-card__supporting-text">' +
                '<h5>' + "Location: "+ location + '</h5>' +
                '<h5>' + "#Participants: "+size + '</h5>' +
                '<h5>' + "#Pending check-in: "+appSize + '</h5>' +
              '</div>' +
              '<div id="cardButton" class="mdl-card__actions mdl-card--border">' +
                '<a id="'+ childKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">arrow_forward</i> See more about in Studies </a>' +
              '</div>' +
            '</div>' +
          '</div>'+
          '</div>'
        );

        var x = "#"+childKey;

        $(x).on( "click", function( event ) 
        {
          event.preventDefault();
          //alert(childKey);
          //window.open("studies.html");
          window.open("studies.html", "_self");
        });
      /* end if state */
      }

    /* end snapshot */
    });

  /* end studyRef */
  });


  //alert("loading loadHomescreen");
}


/* COMMENT END */