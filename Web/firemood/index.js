$( document ).ready(function()
{
  //firebase
  var dbRef = firebase.database().ref();
  var usersRef = dbRef.child("personal_data");

  //var moodRef = dbRef.child("mood_data");

  //var childKey;

  var index = 0;

  usersRef.once('value', function(snapshot)
  {
    snapshot.forEach(function(childSnapshot)
    {
      var childKey = childSnapshot.key;
      //childKey = childSnapshot.key;
      var user = childSnapshot.val();

      //var fname = user.fname;
      //var lname = user.lname;
      //var email = user.email;
      var dnasc = user.birthday;
      var gender = user.gender;

      //'<div class="mdl-card__title">' +
      //        '<h2 class="mdl-card__title-text"><i class="material-icons">email</i>'+ email + '</h2>' +
      //      '</div>' +

      index = index + 1;
      var p = "Participant #"+index;

      $('#userList').append(
        '<div class="mdl-grid">'+
        '<div id="userCell" class=mdl-cell mdl-cell--3-col mdl-cell--middle">' +
          '<div id=+"cardHeader" class="mdl-card mdl-shadow--2dp">' +
            '<div class="mdl-card__title">' +
              '<h2 class="mdl-card__title-text"><i class="material-icons">person</i>'+ p +'</h2>' +
            '</div>' +
            '<div class="mdl-card__title">' +
              '<h2 class="mdl-card__title-text"><i class="material-icons">face</i>'+ gender + '</h2>' +
            '</div>' +
            '<div class="mdl-card__title">' +
              '<h2 class="mdl-card__title-text"><i class="material-icons">perm_contact_calendar</i>'+ dnasc + '</h2>' +
            '</div>' +
            '<div id="cardButton" class="mdl-card__actions mdl-card--border">' +
              '<a id="'+ childKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"> See more </a>' +
            '</div>' +
          '</div>' +
        '</div>'+
        '</div>'
      );

      var x = "#"+childKey;

      $(x).on( "click", function( event ) 
      {
        event.preventDefault();
        //alert("here");
        //alert(childKey);
        $('#userList').empty();
        userClicked(childKey);
      });

    });
  });

  function userClicked(user)
  {
    var refChild = 'mood_data/' + user;

    var userMoodRef = dbRef.child(refChild);

    userMoodRef.once('value', function(snapshot)
    {
      snapshot.forEach(function(childSnapshot)
      {
        var key = childSnapshot.key;

        if (key != "green" && key != "yellow" && key != "red")
        {
          var newRefChild = 'mood_data/' + user + '/'+key;
          var moodDetailRef = dbRef.child(newRefChild);
          
          var entry = "";

          var time = "";
          var mood = "";
          var date = "";

          moodDetailRef.once('value', function(snap)
          {
            snap.forEach(function(childSnap)
            {
              //alert(childSnap.key);
              var key = childSnap.key;
              var val = childSnap.val();

              if (key == "time")
              {
                time = val;
              }
      
              if (childSnap.key == "date")
              {
                date = childSnap.val();
              }

              if (childSnap.key == "mood")
              {
                mood = childSnap.val();
              }

              //entry = "Datapoint from " + date + " and " + time +"h, and was feeling "+ mood;
            });
            //alert(entry);

            $('#userList').append(
              '<div class="mdl-grid">'+
              '<div id="userCell" class=mdl-cell mdl-cell--2-col mdl-cell--middle">' +
                '<div id=+"cardHeader" class="mdl-card mdl-shadow--2dp">' +
                  '<div class="mdl-card__title">' +
                    '<h2 class="mdl-card__title-text"><i class="material-icons">tag_faces</i>'+ mood +'</h2>' +
                  '</div>' +
                  '<div class="mdl-card__title">' +
                    '<h2 class="mdl-card__title-text"><i class="material-icons">date_range</i>'+ date + '</h2>' +
                  '</div>' +
                  '<div class="mdl-card__title">' +
                    '<h2 class="mdl-card__title-text"><i class="material-icons">watch_later</i>'+ time + '</h2>' +
                  '</div>' +
                  '<div id="cardButton" class="mdl-card__actions mdl-card--border">' +
                    '<a id="'+ childSnapshot.key +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"> See more </a>' +
                  '</div>' +
                '</div>' +
              '</div>'+
              '</div>'
            );

            var y = "#"+childSnapshot.key;

            $(y).on( "click", function( event ) 
            {
              event.preventDefault();
              alert(" "+y);
            });

          });
        }
      });
    });
  }
});
