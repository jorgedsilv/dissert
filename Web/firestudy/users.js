

firebase.auth().onAuthStateChanged(function(user)
{
  if (user && user.uid == "uyi50NiNCrgJfcZAh4uzDoK1Ucm1")
  {
    $(".login-cover").hide();
    //firebase
    var dbRef = firebase.database().ref();
    var usersRef = dbRef.child("personal_data");
    var studyRef = dbRef.child("study_data");

    $("#filterParticipantsBtn").show();
    //$("#filterUserDataBtn").hide();
    
    var filterUserData = 1; //all is default
    var uui = -1; //user unique id
    var upi = ""; //user participant id

    var sui = ""; //study unique id

    /* converting to human readable data */
    let greenToText = "Positive";
    let yellowToText = "Neutral";
    let redToText = "Negative";

    let upToText = "Good";
    let uncertainToText = "More or less";
    let downToText = "Not good";

    /* error handling */
    /*
    let bpmErr = "User bpm data not available";
    let stepsErr = "User steps data not available";
    let sleepErr = "User sleep data not available";
    let feelingErr = "User feeling feedback missing for now";
    let noteErr = "User note feedback missing for now";
    */

    let err = "NaN"
    let locationErr = err;
    let temperatureErr = err;
    let bpmErr = err;
    let stepsErr = err;
    let sleepErr = err;
    let feelingErr = err;
    let noteErr = err;

    var index = 0;

    usersRef.once('value', function(snapshot)
    {
      snapshot.forEach(function(childSnapshot)
      {
        var userID = childSnapshot.key;
        var detailKey = childSnapshot.key;
        var removeKey = childSnapshot.key;
        var addKey = childSnapshot.key;
        var eraseKey = childSnapshot.key;
        
        var user = childSnapshot.val();

        //alert("User " + userID);

        var fname = user.fname;
        //var lname = user.lname;
        //var email = user.email;
        var dnasc = user.birthday;
        var gender = user.gender;
        var reg = user.register;

        index = index + 1;
        var pID = "Participant #"+index;

        //checkUser(userID);
        var exists = 0;
        var studyID = -1;

        var userStudyObj = {};

        studyRef.once('value', function(studySnapshot)
        {
          studySnapshot.forEach(function(studyChildSnapshot)
          {
            studyID = studyChildSnapshot.key;
            var study = studyChildSnapshot.val();

            var title = study.title;
            var participants = study.participants;
            var approved = study.approved;
            var previous = study.previous;

            //alert(participants);
            //alert("Checking study "+title+"...");
            approved.forEach(function(app)
            {
              //alert(p);
              if (app == userID)
              {
                // aprovado
                //alert(title);
                //alert(p)
                //alert("exists ("+app+") user "+userID);
                
                userStudyObj = {
                  user: userID,
                  study: studyID
                };

                exists = 1;
              }
            });

            previous.forEach(function(prev)
            {
              if (prev == userID)
              {
                exists = 2;
              }
            });

            //alert("ID do estudo = " + studyID);
          });
          
          if (exists == 1)
          {
            //alert("True" + userID);
            $('#approvedUserList').append(
              '<div class="mdl-grid">'+
              '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                '<div id=+"cardHeader" class="card-square mdl-card mdl-shadow--2dp">' +
                  '<div class="mdl-card__title">' +
                    '<h2 class="mdl-card__title-text"><i class="material-icons">person</i>'+ fname +'</h2>' +
                  '</div>' +
                  '<div class="mdl-card__supporting-text">' +
                    '<h5 id="genderTag"><i class="material-icons">face</i>' + " "+gender + '</h5>' +
                    '<h5><i class="fas fa-birthday-cake"></i>' + " "+ dnasc + '</h5>' +
                    '<h5><i class="material-icons">how_to_reg</i>' + " "+ reg + '</h5>' +
                  '</div>' +
                  '<div id="approvedUserDetailBtn" class="mdl-card__actions mdl-card--border">' +
                    '<a id="'+ detailKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">info</i> See more </a>' +
                  '</div>' +
                  '<div id="approvedUserRemoveBtn" class="mdl-card__actions mdl-card--border">' +
                    '<a id="'+ removeKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">close</i> Remove participant </a>' + 
                  '</div>' +
                  '<div id="approvedUserDeleteBtn" class="mdl-card__actions mdl-card--border">' +
                    '<a id="'+ eraseKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="far fa-trash-alt"></i> Delete participant </a>' + 
                  '</div>' +
                '</div>' +
              '</div>'+
              '</div>'
            );

            if(gender == "Male")
            {
              //<i class="fas fa-mars"></i>
              //'<h5 id="genderTag"><i class="material-icons">face</i>' + " "+gender + '</h5>'
              $('#genderTag').replaceWith('<h5><i class="fas fa-mars"></i>' + " "+gender + '</h5>');
            }
            else if (gender == "Female")
            {
              //<i class="fas fa-venus"></i>
              $('#genderTag').replaceWith('<h5><i class="fas fa-venus"></i>' + " "+gender + '</h5>');
            }
            else if (gender == "Other")
            {
              //<i class="fas fa-genderless"></i>
              $('#genderTag').replaceWith('<h5><i class="fas fa-genderless"></i>' + " "+gender + '</h5>');
            }

            var detailBtnAction = "#"+detailKey;

            $(approvedUserDetailBtn).on("click", detailBtnAction, function()
            {
              event.preventDefault();
              //alert("here");
              //alert(detailKey);
              $('#approvedUserList').empty();
              $('#pendingUserList').empty();
              $('#allUserList').empty();

              $("#filterParticipantsBtn").hide();
              $("#filterUserDataBtn").show();

              uui = detailKey;
              upi = fname;

              //sui = studyID;

              userClicked(detailKey, fname);
            });

            var removeBtnAction = "#"+removeKey;

            $(approvedUserRemoveBtn).on("click", removeBtnAction, function()
            {
              event.preventDefault();
              
              //alert("User: "+userStudyObj.user);
              //alert("Study: "+userStudyObj.study);

              userRemove(userStudyObj.user, userStudyObj.study);

              /*if (studyID != -1)
              {
                userRemove(userID, studyID);
              }*/
            });

            var deleteBtnAction = "#"+eraseKey;
            $(approvedUserDeleteBtn).on("click", deleteBtnAction, function()
            {
              event.preventDefault();

              //alert("Delete btn pressed "+eraseKey);
              userDelete(eraseKey);
            });
          }
          else if (exists == 0)
          {
            //alert("False" + userID);
            $('#pendingUserList').append(
              '<div class="mdl-grid">'+
              '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                '<div id=+"cardHeader" class="card-square mdl-card mdl-shadow--2dp">' +
                  '<div class="mdl-card__title">' +
                    '<h2 class="mdl-card__title-text"><i class="material-icons">person</i>'+ fname +'</h2>' +
                  '</div>' +
                  '<div class="mdl-card__supporting-text">' +
                    '<h5 id="genderTag"><i class="material-icons">face</i>' + " "+gender + '</h5>' +
                    '<h5><i class="fas fa-birthday-cake"></i>' + " "+ dnasc + '</h5>' +
                    '<h5><i class="material-icons">how_to_reg</i>' + " "+ reg + '</h5>' +
                  '</div>' +
                  '<div id="pendingUserAddBtn" class="mdl-card__actions mdl-card--border">' +
                    '<a id="'+ addKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">check</i> Approve </a>' +
                  '</div>' +
                  '<div id="pendingUserDeleteBtn" class="mdl-card__actions mdl-card--border">' +
                    '<a id="'+ eraseKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="far fa-trash-alt"></i> Delete participant </a>' + 
                  '</div>' +
                '</div>' +
              '</div>'+
              '</div>'
            );

            /*
            '<div id="pendingUserRemoveBtn" class="mdl-card__actions mdl-card--border">' +
              '<a id="'+ removeKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">close</i> Remove </a>' + 
            '</div>' +
            */
            if(gender == "Male")
            {
              //<i class="fas fa-mars"></i>
              //'<h5 id="genderTag"><i class="material-icons">face</i>' + " "+gender + '</h5>'
              $('#genderTag').replaceWith('<h5><i class="fas fa-mars"></i>' + " "+gender + '</h5>');
            }
            else if (gender == "Female")
            {
              //<i class="fas fa-venus"></i>
              $('#genderTag').replaceWith('<h5><i class="fas fa-venus"></i>' + " "+gender + '</h5>');
            }
            else if (gender == "Other")
            {
              //<i class="fas fa-genderless"></i>
              $('#genderTag').replaceWith('<h5><i class="fas fa-genderless"></i>' + " "+gender + '</h5>');
            }

            var addBtnAction = "#"+addKey;

            $(pendingUserAddBtn).on("click", addBtnAction, function()
            {
              event.preventDefault();
              
              //alert("add btn touched!");
              //$('#approvedUserList').empty();
              approveUser(addKey);
            });

            var deleteBtnAction = "#"+eraseKey;
            $(pendingUserDeleteBtn).on("click", deleteBtnAction, function()
            {
              event.preventDefault();

              //alert("Delete btn pressed "+eraseKey);
              userDelete(eraseKey);
            });
          }
        });
        
      });
    });

    function userDelete(userID)
    {
      /*
      when delete button is clicked
      (1) removes user from study
        (a) remove from participant list
        (b) remove from approved list
        (c) remove from previous list

      (2) removes all mood data
        (a) remove from mood_data
        (b) remove from previous_data

      (3) removes all personal data
      */

      //(2a)
      var moodChild = 'mood_data/' + userID;
      moodRef = firebase.database().ref(moodChild);
      moodRef.remove().then(function()
      {
        console.log("All data collected from user was deleted");
      }
      ).catch(function(error)
      {
        console.log("Remove failed: " + error.message)
      });

      //(2b)
      var prevChild = 'previous_data/' + userID;
      prevRef = firebase.database().ref(prevChild);
      prevRef.remove().then(function()
      {
        console.log("All previous data collected from user was deleted");
      }
      ).catch(function(error)
      {
        console.log("Remove failed: " + error.message)
      });

      //3
      var personalChild = 'personal_data/' + userID;
      personalRef = firebase.database().ref(personalChild);
      personalRef.remove().then(function()
      {
        console.log("All personal data from user was deleted");
      }
      ).catch(function(error)
      {
        console.log("Remove failed: " + error.message)
      });

      var query = firebase.database().ref("study_data").orderByKey();
      query.once("value").then(function(snapshot)
      {
        snapshot.forEach(function(childSnapshot)
        {
          var studyID = childSnapshot.key;
          //var childData = childSnapshot.val();

          var newRefChild = 'study_data/' + studyID + '/';
          var studyRef = dbRef.child(newRefChild);

          studyRef.once('value', function(study)
          {
            var title = study.val().title;
            var removeParticipants = study.val().participants;
            var removeApproved = study.val().approved;
            var removePrevious = study.val().previous;

            // remove from participants list
            if (removeParticipants.includes(userID) == true)
            {
              console.log(userID+" exists in study "+title);

              var removePartIdx = removeParticipants.indexOf(userID);
              if (removePartIdx > -1)
              {
                removeParticipants.splice(removePartIdx, 1);
              }

              if (removeParticipants == "")
              {
                removeParticipants = [""];
              }

              // remove from approved list
              var removeAppIdx = removeApproved.indexOf(userID);
              if (removeAppIdx > -1)
              {
                removeApproved.splice(removeAppIdx, 1);
              }

              if (removeApproved == "")
              {
                removeApproved = [""];
              }

              // A Study entry
              var updatedStudyData = {
                title: study.val().title,
                location: study.val().location,
                magicword: study.val().magicword,
                startdate: study.val().startdate,
                enddate: study.val().enddate,
                state: study.val().state,
                participants: removeParticipants,
                approved: removeApproved,
                previous: removePrevious
              };

              // save changes to Firebase
              // Write the new study's data
              var updates = {};
              updates['/study_data/' + studyID] = updatedStudyData;

              console.log("User removed from a study");

              window.location.reload();
              return firebase.database().ref().update(updates);
            }

            if (removePrevious.includes(userID) == true)
            {
              console.log(userID+" existed in study "+title);

              // remove from previous list
              var removePrevIdx = removePrevious.indexOf(userID);
              if (removePrevIdx > -1)
              {
                removePrevious.splice(removePrevIdx, 1);
              }

              if (removePrevious == "")
              {
                removePrevious = [""];
              }

              // A Study entry
              var updatedStudyData = {
                title: study.val().title,
                location: study.val().location,
                magicword: study.val().magicword,
                startdate: study.val().startdate,
                enddate: study.val().enddate,
                state: study.val().state,
                participants: removeParticipants,
                approved: removeApproved,
                previous: removePrevious
              };

              // save changes to Firebase
              // Write the new study's data
              var updates = {};
              updates['/study_data/' + studyID] = updatedStudyData;

              console.log("User removed from a study");

              window.location.reload();
              return firebase.database().ref().update(updates);
            }
          });

        });
      });
    }

    function approveUser(user)
    {
      $("#approveUserProgress").hide();
      $("#approveUserError").hide();

      $("#approveOkBtn").show();
      $("#approveCancelBtn").show();

      const select = document.getElementById("studyOption");

      while (select.firstChild) select.removeChild(select.firstChild);

      studyRef.once('value', function(studySnapshot)
      {
        studySnapshot.forEach(function(studyChildSnapshot)
        {
          var study = studyChildSnapshot.val();
          var key = studyChildSnapshot.key;
          
          var state = study.state;

          if (state == "open")
          {
            var title = study.title;
            let opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = title;
            opt.setAttribute("user-key", user); 
            select.appendChild(opt);
          }
        });
      });

      var approveDialog = document.querySelector('#approveUserDialog');
      if (! approveDialog.showModal) 
      {
        dialogPolyfill.registerDialog(approveDialog);
      }
      approveDialog.showModal();
    }

    $("#approveOkBtn").click(
      function ()
      {
        $("#approveUserProgress").show();
        $("#approveOkBtn").hide();
        $("#approveCancelBtn").hide();

        var approveDialog = document.querySelector('#approveUserDialog');

        var e = document.getElementById("studyOption");
        var study_Key = e.options[e.selectedIndex].value;
        var user_Key = e.options[e.selectedIndex].getAttribute("user-key");

        console.log("Study = "+study_Key);
        console.log("User = "+user_Key);

        /* --> approve user to a study */
        
        var newStudyChild = 'study_data/' + study_Key;
        var newStudyRef = dbRef.child(newStudyChild);

        newStudyRef.once('value', function(studySnap)
        {
          //alert(JSON.stringify(snapshot.val()));

          var studyTitle = studySnap.val().title;
          var studyLocation = studySnap.val().location;
          var studyMagicword = studySnap.val().magicword;
          var studyStartdate = studySnap.val().startdate;
          var studyEnddate = studySnap.val().enddate;
          var studyState = studySnap.val().state;
          var studyParticipants = studySnap.val().participants;
          var studyApproved = studySnap.val().approved;
          var studyPrevious = studySnap.val().previous;

          /* --> send email with magic word */
          var newUserChild = 'personal_data/' + user_Key;
          var newUserRef = dbRef.child(newUserChild);

          var qrcode = new QRCode(document.getElementById("qrcode"), {
              width : 250,
              height : 250
            });

            qrcode.clear();
            qrcode.makeCode(studyMagicword);

          newUserRef.once('value', function(userSnap)
          {
            var userFname = userSnap.val().fname;
            var userLname = userSnap.val().lname;
            var displayName = userFname + " " + userLname;

            var userEmail = userSnap.val().email;

            //alert("here");
            sendEmail(displayName, userEmail, studyMagicword, studyTitle);
          });
          
          // add user to approved list
          // add user to approved list
          if (studyApproved == "" && studyApproved.length != 0)
          {
            studyApproved[0] = user_Key;
          }
          else if(studyApproved != "" && studyApproved.length != 0)
          {
            studyApproved.push(user_Key);
          }
          //studyApproved.push(user_Key);

          // A Study entry
          var updatedStudyData = {
            title: studyTitle,
            location: studyLocation,
            magicword: studyMagicword,
            startdate: studyStartdate,
            enddate: studyEnddate,
            state: studyState,
            participants: studyParticipants,
            approved: studyApproved, 
            previous: studyPrevious
          };

          // Write the updated study data
          var updates = {};
          updates['/study_data/' + study_Key] = updatedStudyData;
          
          approveDialog.close();

          alert("User was approved successfuly!");

          /* --> force page reload */
          window.location.reload();

          //return true;

          return firebase.database().ref().update(updates);
        });

    });

    function sendEmail(userName, userEmail, magicword, studyTitle)
    {
      var senderName = "UrJourney";
      var senderEmail = "urjourney@urjourney.com";
      var senderSubject = "Welcome to UrJourney!";

      //var image = new Image();
      //image.src = document.getElementById("qrcode").childNodes[1].currentSrc;
      //console.log(document.getElementById("qrcode").childNodes[1].currentSrc);

      var imgData = document.getElementById("qrcode").childNodes[1].currentSrc;

      var line1 = "Hello from UrJourney Team!";
      var line0 = "Hi "+userName;
      var line2 = "You have been invited to participate in the study \""+studyTitle+"\".";
      var line3 = "Below you can find the information needed to self check-in to the study.";
      var line4 = "Secret code: "+magicword;
      var line5 = "QR code: ";
      var line6 = "To ensure you have a seamless experience, here is a little guide to the data we need from you, and how we are using it.";
      var line7 = "What we need from you";
      
      //var line81 = "'\uf294'";
      var line81 = "Bluetooth";
      var line8 = "Please make sure you allow access to the Bluetooth: it allows to connect to you fitness device and sync data.";
      
      //var line91 = "\uf3c5";
      var line91 = "Location";
      var line9 = "We will ask you to give access to your location. This enables us to retrieve location and weather data whenever you make a registry of your current mood. Location data will only be used for this purpose.";
      
      //var line101 = "\uf3ab";
      var line101 = "Google Fit";
      var line10 = "Before proceeding to any registry of your current state of mind, please download and set the Google Fit app. Google Fit is a free download from the Play Store. It will work with your fitness device and enables us to retrieve health related data.";
      
      var line11 = "Thank you!";
      var line12 = "UrJourney Team";

      var msgLine1='<h2 align="center" style="color:#46B6AC">'+ line1 +'</h2>';
      var msgLine0='</br> <h4>'+ line0 +'</h4>';
      var msgLine2='<h4>'+ line2 +'</h4>';
      var msgLine3='<h4>'+ line3 +'</h4>';
      var msgLine4='</br><h4>'+ line4 +'</h4>';
      var msgLine5='<h4>'+ line5 +'</h4>';
      var msgLine51 = '<img src="'+imgData+'" border="0"><br/>';
      var msgLine6='</br> <h4>'+ line6 +'</h4>';
      var msgLine7='</br> <h3 align="center" style="color:#46B6AC">'+ line7 +'</h3>';
      var msgLine81='</br><h3 align="center"><u>'+ line81 +'</u></h3>';
      var msgLine8='<h4>'+ line8 +'</h4>';
      var msgLine91='</br><h3 align="center"><u>'+ line91 +'</u></h3>';
      //var msgLine91='</br><h3 align="center"><i class="fas fa-map-marker-alt"></i> Location</h3>';
      var msgLine9='<h4>'+ line9 +'</h4>';
      var msgLine101='</br><h3 align="center"><u>'+ line101 +'</u></h3>';
      var msgLine10='<h4>'+ line10 +'</h4>';
      var msgLine11='</br> </br> </br> <h4>'+ line11 +'</h4>';
      var msgLine12='<h3 style="color:#46B6AC">'+ line12 +'</h3>';

      /*if(document.getElementById("qrcode").childNodes[1].currentSrc != "")
      {
        alert(document.getElementById("qrcode").childNodes[1].currentSrc);
      }*/
      
      var senderMsg = msgLine1 + msgLine0 + msgLine2 + msgLine3 + msgLine4 + 
                      msgLine5 + msgLine51 + 
                      msgLine6 + msgLine7 + 
                      msgLine81 + msgLine8 +
                      msgLine91 + msgLine9 + 
                      msgLine101 + msgLine10 +
                      msgLine11 + msgLine12;

      var replyToEmail = "jorgeduartesilva@ua.pt";
      var replyToName = "Jorge Duarte";

      /* --> only for testing purposes */
      //userName = "Jorge Silva";
      //userEmail = "jorgeduartesilva@ua.pt";
      /* <-- */

      console.log("I'm sending an email to: "+userEmail);
      
      var sendData = {
        sender : {
          "name"    : senderName,
          "email"   : senderEmail
        },
        to: [
          {
            "email" : userEmail,
            "name"  : userName
          }
        ],
        htmlContent : senderMsg,
        subject     : senderSubject,
        replyTo:
        {
          "email"   : replyToEmail,
          "name"    : replyToName
        }
      };

      //alert(JSON.stringify(sendData));
      ajaxSendData = JSON.stringify(sendData);
      
      $.ajax({
        method: 'POST',
        url: 'https://api.sendinblue.com/v3/smtp/email',
        headers:
        {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': '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'
        },
        data: ajaxSendData,
        dataType: 'json'
        }).done(function(response)
         {
           console.log(response); // if you're into that sorta thing
         });
      

      alert("E-mail was sent!");
    }

    $("#approveCancelBtn").click(
      function ()
      {
        $("#approveUserProgress").hide();
        $("#approveUserError").hide();

        var approveDialog = document.querySelector('#approveUserDialog');

        approveDialog.close();
      });

    /* filter participants */
    $("#filterParticipantsBtn").click(
      function ()
      {
        var filterParticipantsDialog = document.querySelector('#filterParticipantsDialog');
        if (! filterParticipantsDialog.showModal) 
        {
          dialogPolyfill.registerDialog(filterParticipantsDialog);
        }
        filterParticipantsDialog.showModal();
      });

    $("#filterParticipantsOkBtn").click(
      function ()
      {
        var filterParticipantsDialog = document.querySelector('#filterParticipantsDialog');

        var e = document.getElementById("participantOption");
        var opt = e.options[e.selectedIndex].value;

        //alert("Selected option = "+opt);

        switch(opt)
        {
          case "00": //mixed
            //alert("Mixed option selected");

            $('#allUserList').hide();
            clean();

            document.getElementById("approvedHeader").style.display = "block";
            document.getElementById("approvedInfo").style.display = "block";

            document.getElementById("pendingHeader").style.display = "block";
            document.getElementById("pendingInfo").style.display = "block";

            $('#pendingUserList').show();
            $('#approvedUserList').show();

            break;
          case "01": //All
            //alert("All option selected");

            $('#pendingUserList').hide();
            $('#approvedUserList').hide();

            clean();
            getAllUsers();

            document.getElementById("allHeader").innerHTML = "All users";
            document.getElementById("allInfo").innerHTML = "All users that signed in";

            document.getElementById("allHeader").style.display = "block";
            document.getElementById("allInfo").style.display = "block";

            $('#allUserList').show();

            break;
          case "02": //In study
            //alert("In study option selected");

            $('#pendingUserList').hide();
            $('#approvedUserList').hide();

            clean();
            getUsersInStudy();

            document.getElementById("allHeader").innerHTML = "In study";
            document.getElementById("allInfo").innerHTML = "Users that are participating in a study";

            document.getElementById("allHeader").style.display = "block";
            document.getElementById("allInfo").style.display = "block";

            $('#allUserList').show();
            
            break;
          case "03": //Approved
            //alert("Approved option selected");

            $('#pendingUserList').hide();
            $('#allUserList').hide();

            clean();

            document.getElementById("approvedHeader").style.display = "block";
            document.getElementById("approvedInfo").style.display = "block";
            $('#approvedUserList').show();
            
            break;
          case "04": //Pending
            //alert("Pending option selected");
            
            $('#approvedUserList').hide();
            $('#allUserList').hide();

            clean();

            document.getElementById("pendingHeader").style.display = "block";
            document.getElementById("pendingInfo").style.display = "block";

            $('#pendingUserList').show();
          
            break;
        }

        filterParticipantsDialog.close();
      });

    function getUsersInStudy()
    {
      $('#allUserList').empty();

      var idx = 0;
      studyRef.once('value', function(snapshot)
      {
        snapshot.forEach(function(childSnapshot)
        {
          var studyID = childSnapshot.key;
          var childKey = childSnapshot.key;
          var study = childSnapshot.val();
          
          var title = study.title;
          var participants = study.participants;
          /*
          var size = participants.length;

          if (size != 0 && participants == "")
          {
            size = 0;
          }
          */
          if (participants != "")
          {
            idx = idx + 1;
            var pID = "User #"+idx;

            participants.forEach(function(entry)
            {
              var newUserChild = 'personal_data/' + entry;
              var newUserRef = dbRef.child(newUserChild);

              newUserRef.once('value', function(userSnap)
              {
                var userID = entry;
                var detailKey = entry;
                var removeKey = entry;
                var deleteKey = entry;

                var fname = userSnap.val().fname;
                var gender = userSnap.val().gender;
                var dnasc = userSnap.val().birthday;
                var reg = userSnap.val().register;

                $('#allUserList').append(
                  '<div class="mdl-grid">'+
                  '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                    '<div id=+"cardHeader" class="card-square mdl-card mdl-shadow--2dp">' +
                      '<div class="mdl-card__title">' +
                        '<h2 class="mdl-card__title-text"><i class="material-icons">person</i>'+ fname +'</h2>' +
                      '</div>' +
                      '<div class="mdl-card__supporting-text">' +
                        '<h5 id="titleTag"><i class="material-icons">assignment</i>' + " Study: \""+title + '\"</h5>' +
                        '<hr>'+
                        '<h5 id="genderTag"><i class="material-icons">face</i>' + " "+gender + '</h5>' +
                        '<h5><i class="fas fa-birthday-cake"></i>' + " "+ dnasc + '</h5>' +
                        '<h5><i class="material-icons">how_to_reg</i>' + " "+ reg + '</h5>' +
                      '</div>' +
                      '<div id="cardButton" class="mdl-card__actions mdl-card--border">' +
                        '<a id="'+ childKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">arrow_forward</i> See more about in Studies </a>' +
                      '</div>' +
                    '</div>' +
                  '</div>'+
                  '</div>'
                );

                /*
                '<div id="detailBtn" class="mdl-card__actions mdl-card--border">' +
                  '<a id="'+ detailKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">info</i> Details </a>' +
                '</div>' +
                '<div id="removeBtn" class="mdl-card__actions mdl-card--border">' +
                  '<a id="'+ removeKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">close</i> Remove </a>' + 
                '</div>' +
                */

                if(gender == "Male")
                {
                  $('#genderTag').replaceWith(
                    '<h5><i class="fas fa-mars"></i>' + " "+gender + '</h5>'
                  );
                }
                else if (gender == "Female")
                {
                  $('#genderTag').replaceWith(
                    '<h5><i class="fas fa-venus"></i>' + " "+gender + '</h5>'
                  );
                }
                else if (gender == "Other")
                {
                  $('#genderTag').replaceWith(
                    '<h5><i class="fas fa-genderless"></i>' + " "+gender + '</h5>'
                  );
                }

                var cardBtnAction = "#"+childKey;

                $(cardButton).on("click", cardBtnAction, function()
                {
                  event.preventDefault();

                  window.open("studies.html", "_self");
                });

                /*
                var deleteBtnAction = "#"+deleteKey;

                $(userDeleteBtn).on("click", deleteBtnAction, function()
                {
                  event.preventDefault();
                  
                  alert("Delete user "+deleteKey);
                });
                */
                
                /*
                var detailBtnAction = "#"+detailKey;

                $(detailBtn).on("click", detailBtnAction, function()
                {
                  event.preventDefault();
                  
                  $('#approvedUserList').empty();
                  $('#pendingUserList').empty();
                  $('#allUserList').empty();

                  $("#filterBtn").hide();

                  userClicked(detailKey);
                });

                var removeBtnAction = "#"+removeKey;

                $(removeBtn).on("click", removeBtnAction, function()
                {
                  event.preventDefault();
                  
                  //alert(userID);
                  //alert(studyID);
                  
                  userRemove(userID, studyID);
                });*/
              /* end newUserRef */
              });
            /* end participants.forEach */  
            });
          /* end participants not empty*/
          }

        /* end snapshot */
        });
      /* end studyRef */ 
      });
    }

    /* gets all users registered */
    function getAllUsers()
    {
      $('#allUserList').empty();

      var idx = 0;
      usersRef.once('value', function(snapshot)
      {
        snapshot.forEach(function(childSnapshot)
        {
          var deleteKey = childSnapshot.key;
          var user = childSnapshot.val();

          var fname = user.fname;
          //var lname = user.lname;
          //var email = user.email;
          var dnasc = user.birthday;
          var gender = user.gender;
          var reg = user.register;

          idx = idx + 1;
          var pID = "User #"+idx;

          $('#allUserList').append(
            '<div class="mdl-grid">'+
            '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
              '<div id=+"cardHeader" class="card-users mdl-card mdl-shadow--2dp">' +
                '<div class="mdl-card__title">' +
                  '<h2 class="mdl-card__title-text"><i class="material-icons">person</i>'+ fname +'</h2>' +
                '</div>' +
                '<div class="mdl-card__supporting-text">' +
                  '<h5 id="genderTag"><i class="material-icons">face</i>' + " "+gender + '</h5>' +
                  '<h5><i class="fas fa-birthday-cake"></i>' + " "+ dnasc + '</h5>' +
                  '<h5><i class="material-icons">how_to_reg</i>' + " "+ reg + '</h5>' +
                '</div>' +
                '<div id="userDeleteBtn" class="mdl-card__actions mdl-card--border">' +
                  '<a id="'+ deleteKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="far fa-trash-alt"></i> Delete participant </a>' + 
                '</div>' +
              '</div>' +
            '</div>'+
            '</div>'
          );

          if(gender == "Male")
          {
            $('#genderTag').replaceWith(
              '<h5><i class="fas fa-mars"></i>' + " "+gender + '</h5>'
            );
          }
          else if (gender == "Female")
          {
            $('#genderTag').replaceWith(
              '<h5><i class="fas fa-venus"></i>' + " "+gender + '</h5>'
            );
          }
          else if (gender == "Other")
          {
            $('#genderTag').replaceWith(
              '<h5><i class="fas fa-genderless"></i>' + " "+gender + '</h5>'
            );
          }

          var deleteBtnAction = "#"+deleteKey;

          $(userDeleteBtn).on("click", deleteBtnAction, function()
          {
            event.preventDefault();
                  
            //alert("Delete user "+deleteKey);
            userDelete(deleteKey);
          });
        /* end snapshot */
        });
      /* end usersRef */
      });
    /* end function */
    }

    $("#filterParticipantsCancelBtn").click(
      function ()
      {
        var filterParticipantsDialog = document.querySelector('#filterParticipantsDialog');

        filterParticipantsDialog.close();
      });

    /* -- filter user data */
    $("#filterUserDataBtn").click(
      function ()
      {
        var filterUserDataDialog = document.querySelector('#filterUserDataDialog');
        if (! filterUserDataDialog.showModal) 
        {
          dialogPolyfill.registerDialog(filterUserDataDialog);
        }
        filterUserDataDialog.showModal();
      });

    $("#filterUserDataOkBtn").click(
      function ()
      {
        var filterUserDataDialog = document.querySelector('#filterUserDataDialog');

        var e = document.getElementById("userDataOption");
        var opt = e.options[e.selectedIndex].value;

        switch(opt)
        {
          case "01": //all
            filterUserData = 1;
            if (uui != -1) 
            {
              $('#approvedUserList').empty();
              $('#pendingUserList').empty();
              $('#allUserList').empty();

              userClicked(uui, upi);
            }
            break;
          case "02": //today
            filterUserData = 2;
            if (uui != -1) 
            {
              $('#approvedUserList').empty();
              $('#pendingUserList').empty();
              $('#allUserList').empty();

              userClicked(uui, upi);
            }
            break;
          case "03": //last 7 days
            filterUserData = 3;
            if (uui != -1) 
            {
              $('#approvedUserList').empty();
              $('#pendingUserList').empty();
              $('#allUserList').empty();

              userClicked(uui, upi);
            }
            break;
          case "04": //month
            filterUserData = 4;
            if (uui != -1) 
            {
              $('#approvedUserList').empty();
              $('#pendingUserList').empty();
              $('#allUserList').empty();

              userClicked(uui, upi);
            }
            break;
          default:
            filterUserData = 1;
            break;
        }

        filterUserDataDialog.close();
      });

    $("#filterUserDataCancelBtn").click(
      function ()
      {
        var filterUserDataDialog = document.querySelector('#filterUserDataDialog');

        filterUserDataDialog.close();
      });

    function clean()
    {
      document.getElementById("approvedHeader").style.display = "none";
      document.getElementById("approvedInfo").style.display = "none";

      document.getElementById("pendingHeader").style.display = "none";
      document.getElementById("pendingInfo").style.display = "none";

      document.getElementById("allHeader").style.display = "none";
      document.getElementById("allInfo").style.display = "none";

      document.getElementById("studyInfo").style.display = "none";

      document.getElementById("approvedHeader").style.color = "#000000";
      document.getElementById("pendingHeader").style.color = "#000000";
      document.getElementById("allHeader").style.color = "#000000";
    }

    /*
      when remove button is clicked, removes user from study 
      (both participants list and approved list)
    */
    function userRemove(userID, studyID)
    {
      //alert("User "+userID+" is to be removed from "+studyID);

      var refChild = 'study_data/' + studyID;
      var userStudyRef = dbRef.child(refChild);

      userStudyRef.once('value', function(snapshot)
      {
        //alert(JSON.stringify(snapshot.val()));
        var removeParticipants = snapshot.val().participants;
        
        /* remove from participants list */
        if (removeParticipants.includes(userID) == true)
        {
          var removePartIdx = removeParticipants.indexOf(userID);
          
          if (removePartIdx > -1)
          {
            removeParticipants.splice(removePartIdx, 1);
          }
        }

        if (removeParticipants == "")
        {
          removeParticipants = [""];
        }

        var removeApproved = snapshot.val().approved;
        //alert("Before: "+removeApproved);
        
        /* remove from approved list */
        var removeAppIdx = removeApproved.indexOf(userID);
        //alert("Remove approved idx = "+removeAppIdx);
        if (removeAppIdx > -1)
        {
          removeApproved.splice(removeAppIdx, 1);
        }

        //alert("After: "+removeApproved);
        if (removeApproved == "")
        {
          removeApproved = [""];
          //alert(removeApproved);
        }

        // A Study entry
        
        var updatedStudyData = {
          title: snapshot.val().title,
          location: snapshot.val().location,
          magicword: snapshot.val().magicword,
          startdate: snapshot.val().startdate,
          enddate: snapshot.val().enddate,
          state: snapshot.val().state,
          participants: removeParticipants,
          approved: removeApproved,
          previous: snapshot.val().previous
        };

        // save changes to Firebase
        // Write the new study's data
        var updates = {};
        updates['/study_data/' + studyID] = updatedStudyData;
        
        alert("User removed from a study");

        window.location.reload();
        return firebase.database().ref().update(updates);
        //return true;
      });
    }

    function userClicked(user, pID)
    {
      //alert(user);
      var refChild = 'mood_data/' + user;
      var userMoodRef = dbRef.child(refChild);

      //id para collapse
      var id = 0;

      //remove header and info
      clean();

      studyRef.once('value', function(studySnap)
      {
        studySnap.forEach(function(childStudySnap)
        {
          //var studyID = childSnapshot.key;
          var study = childStudySnap.val();
          
          var title = study.title;
          //console.log("Parsing study \'"+title+"\'...");
          var participants = study.participants;
          
          if (participants != "")
          {
            if (participants.includes(user) == true)
            {
              //alert("title: "+title);
              document.getElementById("studyInfo").innerHTML = "Participant from study \'"+title+"\'";;
            }
          }
        });
      });

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      var nowFull = dd + '/' + mm + '/' + yyyy;
      var nowMonth = mm + '/' + yyyy;

      var moodRef = dbRef.child("mood_data");            
      moodRef.child(user).once('value', function(snapshot)
      {
        if (!snapshot.exists())
        {
          //console.log("User >"+pID+"< does not have mood data");
          document.getElementById("approvedHeader").style.color = "#FF0000";
          document.getElementById("approvedHeader").innerHTML = "Participant "+pID + " does not have data to show yet";
          document.getElementById("approvedHeader").style.display = "block";
        }
        else //exists then show
        {
          userMoodRef.once('value', function(moodSnapshot)
          {
            moodSnapshot.forEach(function(moodChildSnapshot)
            {
              var key = moodChildSnapshot.key;

              if (key != "green" && key != "yellow" && key != "red")
              {
                var newRefChild = 'mood_data/' + user + '/'+key;
                var moodDetailRef = dbRef.child(newRefChild);

                //mood_data/user/key;
                var time = "";
                var mood = "";
                var date = "";

                //mood_data/user/key/context
                var location = "";

                //mood_data/user/key/context/weather
                var temperature = "";
                var description = "";

                //mood_data/user/key/context/health
                var bpm = "";
                var steps = "";

                //mood_data/user/key/context/health/sleep
                var sleep_duration = "";
                var sleep_end = "";
                var sleep_start = "";

                //mood_data/user/key/feedback
                //var colorBlue = #0000FF;
                //var colorGrey = #808080;
                //var colorBlack = #000000;

                var feeling = "";
                var note = "";

                if (filterUserData == 1) // all
                {
                  clean();
                  document.getElementById("approvedHeader").innerHTML = "Showing all data of "+pID;

                  document.getElementById("approvedHeader").style.display = "block";
                  document.getElementById("studyInfo").style.display = "block";
                  
                  moodDetailRef.once('value', function(allMood)
                  {
                    allMood.forEach(function(allMoodChild)
                    {
                      var moodKey = allMoodChild.key;
                      var moodVal = allMoodChild.val();

                      if (moodKey == "time")
                      {
                        time = moodVal;
                      }
              
                      if (moodKey == "date")
                      {
                        date = moodVal;
                      }

                      if (moodKey == "mood")
                      {
                        mood = moodVal;
                      }

                      if (moodKey == "context")
                      {
                        location = moodVal.location;
                        
                        temperature = moodVal.weather.temperature;
                        description = moodVal.weather.description;

                        bpm = moodVal.health.bpm;
                        steps = moodVal.health.steps;

                        sleep_duration = moodVal.health.sleep.duration;
                        sleep_end = moodVal.health.sleep.end;
                        sleep_start = moodVal.health.sleep.start;
                        
                        //alert(JSON.stringify(moodVal));
                        /*if (moodVal.hasOwnProperty("location"))
                        {
                          location = moodVal.location;
                        }*/
                      }

                      if (moodKey == "feedback")
                      {
                        feeling = moodVal.feeling;
                        note = moodVal.note;
                      }

                    /* end allMood */  
                    });

                    var header = "Data collected on "+ date + ", at " + time +"h";
                    
                    id = id + 1;

                    $('#approvedUserList').append(
                      '<div class="mdl-grid">'+
                      '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                        '<div id=+"cardHeader" class="mdl-card mdl-shadow--2dp">' +

                          '<div class="mdl-card__title">' +
                            '<h2 class="mdl-card__title-text">'+ header +'</h2>' +
                          '</div>' +

                          '<div class="mdl-card__supporting-text">' +
                            '<h5 id="moodInfo"><i class="material-icons">tag_faces</i>' + " "+mood + '</h5>' +
                            '<hr>'+
                            '<h5 id="locationInfo"><i class="fas fa-map-marker-alt"></i>' + " "+ location + '</h5>' +
                            '<div id="'+ id +'" class="collapse">'+
                            '<hr>'+
                            '<h5 id="temperatureInfo"><i class="fas fa-thermometer-three-quarters"></i>' + " "+ temperature + '</h5>' +
                            '<hr>'+
                            '<h5 id="bpmInfo"><i class="fas fa-heartbeat"></i>' + " "+ bpm + '</h5>' +
                            '<h5 id="stepsInfo"><i class="fas fa-walking"></i>' + " "+ steps + '</h5>' +
                            '<h5 id="sleepStartInfo"><i class="fas fa-bed"></i>' + " "+ sleep_start+"h" + '</h5>' +
                            '<h5 id="sleepEndInfo"><i class="fas fa-bell"></i>' + " "+ sleep_end+"h" + '</h5>' +
                            '<h5 id="sleepDurationInfo"><i class="fas fa-clock"></i>' + " "+ sleep_duration + '</h5>' +
                            '<hr>'+
                            '<h5 id="feelingInfo"><i class="fas fa-thumbs-up"></i>' + " "+ feeling + '</h5>' +
                            '<h5 id="noteInfo"><i class="fas fa-sticky-note"></i>' + " "+ note + '</h5>' +
                            '</div>' +
                          '</div>' +

                          '<div class="mdl-card__actions mdl-card--border">' +
                            '<a id="btnInfo'+id+'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="#'+id+'" data-toggle="collapse">Expand</a>' +
                          '</div>' +
                        '</div>' +
                      '</div>'+
                      '</div>'
                    );

                    //<i class="far fa-frown"></i> --> negative
                    //<i class="far fa-smile"></i> --> positive
                    //<i class="far fa-meh"></i> --> neutral

                    if (mood == "green")
                    {
                      $('#moodInfo').replaceWith(
                        '<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>'
                      );
                    }
                    else if (mood == "yellow") 
                    {
                      $('#moodInfo').replaceWith(
                        '<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>'
                      );
                    }
                    else if (mood == "red")
                    {
                      $('#moodInfo').replaceWith(
                        '<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>'
                      );
                    }

                    if (location == "null")
                    {
                      $('#locationInfo').replaceWith(
                        '<h5><span style="color: #000000;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ locationErr +'</h5>'
                      );
                    }
                    else
                    {
                      //color_grey = #808080;
                      //color_black = #000000;
                      $('#locationInfo').replaceWith(
                        '<h5><span style="color: #808080;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ location +'</h5>'
                      );
                    }

                    if (temperature == "null")
                    {
                      $('#temperatureInfo').replaceWith(
                        '<h5><span style="color: #000000;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperatureErr +'</h5>'
                      );
                    }
                    else
                    {
                      //color_grey = #808080;
                      //color_black = #000000;
                      $('#temperatureInfo').replaceWith(
                        '<h5><span style="color: #808080;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperature+"C" +'</h5>'
                      );
                    }

                    if (bpm == "null")
                    {
                      $('#bpmInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-heartbeat"></i></span>'+ " "+ bpmErr +'</h5>');
                    }
                    else
                    {
                      $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                    }

                    if (steps == "null")
                    {
                      //<i class="fas fa-exclamation-triangle"></i>
                      $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                    }
                    else
                    {
                      /*
                      var minimalDate = date.replace('/2019','');
                      var stepsToInt = parseInt(steps);

                      //dd/mm/yyyy
                      var parts = date.split('/');

                      //construct date
                      var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                      
                      stepsObj = {
                        date: convertedDate,
                        steps: stepsToInt
                      };

                      stepsData.push(stepsObj);
                      */
                      $('#stepsInfo').replaceWith('<h5><span style="color: #FFA500;"><i class="fas fa-walking"></i></span>'+ " "+ steps +'</h5>');
                    }

                    if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                    {
                      $('#sleepStartInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bed"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepEndInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bell"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepDurationInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-clock"></i></span>'+ " "+ sleepErr +'</h5>');
                    }
                    else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                    {
                      /*
                      var minimalDate = date.replace('/2019','');

                      var start = new Date();
                      var end = new Date()

                      //dd/mm/yyyy
                      var parts = date.split('/');

                      //construct date
                      var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                      //hh:mm
                      var sTime = sleep_start.split(':');
                      start.setHours(sTime[0], sTime[1], 0, 0);

                      //hh:mm
                      var eTime = sleep_end.split(':');
                      end.setHours(eTime[0], eTime[1], 0, 0);

                      sleepObj = {
                        date: convertedDate,
                        sHH: parseInt(sTime[0]),
                        sMM: parseInt(sTime[1]),
                        eHH: parseInt(eTime[0]),
                        eMM: parseInt(eTime[1])
                      };

                      sleepData.push(sleepObj);
                      */

                      $('#sleepStartInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bed"></i></span>'+ " "+ sleep_start+"h" +'</h5>');
                      $('#sleepEndInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bell"></i></span>'+ " "+ sleep_end+"h"+'</h5>');
                      $('#sleepDurationInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-clock"></i></span>'+ " "+ sleep_duration +'</h5>');
                    }

                    if (feeling == "null")
                    {
                      //var colorGrey = #808080;
                      //var colorBlack = #000000;

                      //<i class="fas fa-dizzy"></i>
                      //<i class="fas fa-exclamation-triangle"></i>

                      $('#feelingInfo').replaceWith(
                        '<h5><span style="color: #000000;"><i class="fas fa-dizzy"></i></span>'+ " "+ feelingErr +'</h5>'
                      );
                    }
                    else if(feeling == "up")
                    {
                      //var colorBlue = #0000FF;
                      $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_up</i></span>' + " "+ upToText + '</h5>');
                    }
                    else if(feeling == "down")
                    {
                      $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_down</i></span>' + " "+ downToText + '</h5>');
                    }
                    else if(feeling == "uncertain")
                    {
                      $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumbs_up_down</i></span>' + " "+ uncertainToText + '</h5>');
                    }

                    if (note == "null")
                    {
                      $('#noteInfo').replaceWith(
                        '<h5><span style="color: #000000;"><i class="fas fa-sticky-note"></i></span>'+ " "+ noteErr +'</h5>'
                      );
                    }
                    else
                    {
                      $('#noteInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-sticky-note"></i></span>' + " "+ note + '</h5>');
                    }

                    var y = "#btnInfo"+id;

                    $(y).on("click", function( event ) 
                    {
                      event.preventDefault();

                      $(this).text(function(i, old)
                      {
                        return old == "Expand" ?  "Collapse" : "Expand";
                      });
                    /* end y */
                    });

                  /* end moodDetailRef */
                  });
                /* end filterUserData is all*/ 
                }
                else if (filterUserData == 2) //today
                {
                  moodDetailRef.once('value', function(todayMood)
                  {
                    todayMood.forEach(function(todayMoodChild)
                    {
                      var moodKey = todayMoodChild.key;
                      var moodVal = todayMoodChild.val();

                      if (moodKey == "time")
                      {
                        time = moodVal;
                      }
                      
                      if (moodKey == "date")
                      {
                        date = moodVal;
                      }

                      if (moodKey == "mood")
                      {
                        mood = moodVal;
                      }

                      if (moodKey == "context")
                      {
                        location = moodVal.location;
                        
                        temperature = moodVal.weather.temperature;
                        description = moodVal.weather.description;

                        bpm = moodVal.health.bpm;
                        steps = moodVal.health.steps;

                        sleep_duration = moodVal.health.sleep.duration;
                        sleep_end = moodVal.health.sleep.end;
                        sleep_start = moodVal.health.sleep.start;
                      }

                      if (moodKey == "feedback")
                      {
                        feeling = moodVal.feeling;
                        note = moodVal.note;
                      }
                    /* end todayMood */
                    });

                    //alert("Retrieved date ("+date+") is equal at today? ("+nowFull+")");

                    if (date != nowFull)
                    {
                      //alert("Data for today not found!");
                      document.getElementById("approvedHeader").innerHTML = "Data for today not found!";
                      document.getElementById("approvedHeader").style.color = "#FF0000";
                      document.getElementById("approvedHeader").style.display = "block";
                    }
                    else
                    {
                      clean();
                      document.getElementById("approvedHeader").innerHTML = "Showing today data of "+pID;
                      document.getElementById("approvedInfo").innerHTML = nowFull;

                      document.getElementById("approvedHeader").style.color = "#000000";

                      document.getElementById("approvedHeader").style.display = "block";
                      document.getElementById("approvedInfo").style.display = "block";
                      document.getElementById("studyInfo").style.display = "block";
                      
                      var header = "Data collected on "+ date + ", at " + time +"h";
                      
                      id = id + 1;

                      $('#approvedUserList').append(
                        '<div class="mdl-grid">'+
                        '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                          '<div id=+"cardHeader" class="mdl-card mdl-shadow--2dp">' +

                            '<div class="mdl-card__title">' +
                              '<h2 class="mdl-card__title-text">'+ header +'</h2>' +
                            '</div>' +

                            '<div class="mdl-card__supporting-text">' +
                              '<h5 id="moodInfo"><i class="material-icons">tag_faces</i>' + " "+mood + '</h5>' +
                              '<hr>'+
                              '<h5 id="locationInfo"><i class="fas fa-map-marker-alt"></i>' + " "+ location + '</h5>' +
                              '<div id="'+ id +'" class="collapse">'+
                              '<hr>'+
                              '<h5 id="temperatureInfo"><i class="fas fa-thermometer-three-quarters"></i>' + " "+ temperature+"C" + '</h5>' +
                              '<hr>'+
                              '<h5 id="bpmInfo"><i class="fas fa-heartbeat"></i>' + " "+ bpm + '</h5>' +
                              '<h5 id="stepsInfo"><i class="fas fa-walking"></i>' + " "+ steps + '</h5>' +
                              '<h5 id="sleepStartInfo"><i class="fas fa-bed"></i>' + " "+ sleep_start+"h" + '</h5>' +
                              '<h5 id="sleepEndInfo"><i class="fas fa-bell"></i>' + " "+ sleep_end+"h" + '</h5>' +
                              '<h5 id="sleepDurationInfo"><i class="fas fa-clock"></i>' + " "+ sleep_duration + '</h5>' +
                              '<hr>'+
                              '<h5 id="feelingInfo"><i class="fas fa-thumbs-up"></i>' + " "+ feeling + '</h5>' +
                              '<h5 id="noteInfo"><i class="fas fa-sticky-note"></i>' + " "+ note + '</h5>' +
                              '</div>' +
                            '</div>' +

                            '<div class="mdl-card__actions mdl-card--border">' +
                              '<a id="btnInfo'+id+'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="#'+id+'" data-toggle="collapse">Expand</a>' +
                            '</div>' +
                          '</div>' +
                        '</div>'+
                        '</div>'
                      );

                      if (mood == "green")
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>'
                        );
                      }
                      else if (mood == "yellow") 
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>'
                        );
                      }
                      else if (mood == "red")
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>'
                        );
                      }

                      if (location == "null")
                      {
                        $('#locationInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ locationErr +'</h5>'
                        );
                      }
                      else
                      {
                        //color_grey = #808080;
                        //color_black = #000000;
                        $('#locationInfo').replaceWith(
                          '<h5><span style="color: #808080;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ location +'</h5>'
                        );
                      }

                      if (temperature == "null")
                      {
                        $('#temperatureInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperatureErr +'</h5>'
                        );
                      }
                      else
                      {
                        //color_grey = #808080;
                        //color_black = #000000;
                        $('#temperatureInfo').replaceWith(
                          '<h5><span style="color: #808080;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperature+"C" +'</h5>'
                        );
                      }

                      if (bpm == "null")
                      {
                        $('#bpmInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-heartbeat"></i></span>'+ " "+ bpmErr +'</h5>');
                      }
                      else
                      {
                        $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                      }

                      if (steps == "null")
                      {
                        //<i class="fas fa-exclamation-triangle"></i>
                        $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                      }
                      else
                      {
                        /*
                        var minimalDate = date.replace('/2019','');
                        var stepsToInt = parseInt(steps);

                        //dd/mm/yyyy
                        var parts = date.split('/');

                        //construct date
                        var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                        
                        stepsObj = {
                          date: convertedDate,
                          steps: stepsToInt
                        };

                        stepsData.push(stepsObj);
                        */
                        $('#stepsInfo').replaceWith('<h5><span style="color: #FFA500;"><i class="fas fa-walking"></i></span>'+ " "+ steps +'</h5>');
                      }

                      if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                      {
                        $('#sleepStartInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bed"></i></span>'+ " "+ sleepErr +'</h5>');
                        $('#sleepEndInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bell"></i></span>'+ " "+ sleepErr +'</h5>');
                        $('#sleepDurationInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-clock"></i></span>'+ " "+ sleepErr +'</h5>');
                      }
                      else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                      {
                        /*
                        var minimalDate = date.replace('/2019','');

                        var start = new Date();
                        var end = new Date()

                        //dd/mm/yyyy
                        var parts = date.split('/');

                        //construct date
                        var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                        //hh:mm
                        var sTime = sleep_start.split(':');
                        start.setHours(sTime[0], sTime[1], 0, 0);

                        //hh:mm
                        var eTime = sleep_end.split(':');
                        end.setHours(eTime[0], eTime[1], 0, 0);

                        sleepObj = {
                          date: convertedDate,
                          sHH: parseInt(sTime[0]),
                          sMM: parseInt(sTime[1]),
                          eHH: parseInt(eTime[0]),
                          eMM: parseInt(eTime[1])
                        };

                        sleepData.push(sleepObj);
                        */

                        $('#sleepStartInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bed"></i></span>'+ " "+ sleep_start+"h" +'</h5>');
                        $('#sleepEndInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bell"></i></span>'+ " "+ sleep_end+"h"+'</h5>');
                        $('#sleepDurationInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-clock"></i></span>'+ " "+ sleep_duration +'</h5>');
                      }

                      if (feeling == "null")
                      {
                        //var colorGrey = #808080;
                        //var colorBlack = #000000;

                        //<i class="fas fa-dizzy"></i>
                        //<i class="fas fa-exclamation-triangle"></i>

                        $('#feelingInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-dizzy"></i></span>'+ " "+ feelingErr +'</h5>'
                        );
                      }
                      else if(feeling == "up")
                      {
                        //var colorBlue = #0000FF;
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_up</i></span>' + " "+ upToText + '</h5>');
                      }
                      else if(feeling == "down")
                      {
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_down</i></span>' + " "+ downToText + '</h5>');
                      }
                      else if(feeling == "uncertain")
                      {
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumbs_up_down</i></span>' + " "+ uncertainToText + '</h5>');
                      }

                      if (note == "null")
                      {
                        $('#noteInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-sticky-note"></i></span>'+ " "+ noteErr +'</h5>'
                        );
                      }
                      else
                      {
                        $('#noteInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-sticky-note"></i></span>' + " "+ note + '</h5>');
                      }

                      var y = "#btnInfo"+id;

                      $(y).on("click", function( event ) 
                      {
                        event.preventDefault();

                        $(this).text(function(i, old)
                        {
                          return old == "Expand" ?  "Collapse" : "Expand";
                        });
                      /* end y */
                      });
                    /* end date == nowFull */  
                    }
                  /* end moodDetailRef */
                  }); 
                /* end filterUserData is today */ 
                }
                else if (filterUserData == 3) //last 7 days
                {
                  var lastWeekDate = new Date();
                  lastWeekDate.setDate(today.getDate() - 7);

                  var lastWeekDD= String(lastWeekDate.getDate()).padStart(2, '0');
                  var lastWeekMM = String(lastWeekDate.getMonth() + 1).padStart(2, '0'); //January is 0!
                  var lastWeekYYYY = lastWeekDate.getFullYear();

                  var lastWeekFull = lastWeekDD + '/' + lastWeekMM + '/' + lastWeekYYYY;

                  var daysAgo = new Date(
                    lastWeekDate.getFullYear(), 
                    lastWeekDate.getMonth(), 
                    lastWeekDate.getDate()
                  );

                  //alert("Now is "+nowFull+", last week was "+lastWeekFull);
                  moodDetailRef.once('value', function(weekMood)
                  {
                    weekMood.forEach(function(weekMoodChild)
                    {
                      var moodKey = weekMoodChild.key;
                      var moodVal = weekMoodChild.val();

                      if (moodKey == "time")
                      {
                        time = moodVal;
                      }
                      
                      if (moodKey == "date")
                      {
                        date = moodVal;
                      }

                      if (moodKey == "mood")
                      {
                        mood = moodVal;
                      }

                      if (moodKey == "context")
                      {
                        location = moodVal.location;
                        
                        temperature = moodVal.weather.temperature;
                        description = moodVal.weather.description;

                        bpm = moodVal.health.bpm;
                        steps = moodVal.health.steps;

                        sleep_duration = moodVal.health.sleep.duration;
                        sleep_end = moodVal.health.sleep.end;
                        sleep_start = moodVal.health.sleep.start;
                      }

                      if (moodKey == "feedback")
                      {
                        feeling = moodVal.feeling;
                        note = moodVal.note;
                      }
                    /* end weekMood */  
                    });

                    //var parts ='2014-04-03'.split('-');

                    //dd/mm/yyyy
                    var parts = date.split('/');
                    //alert(parts);
                    var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]); 

                    //(date.before(today) ) && date.after(lastWeekDay)
                    if (convertedDate < today && convertedDate > daysAgo)
                    {
                      //alert(date+" é anterior a hoje "+nowFull+" e depois da semana passada "+lastWeekFull);
                      clean();
                      document.getElementById("approvedHeader").style.color = "#000000";
                      document.getElementById("approvedHeader").innerHTML = "Showing data for the last 7 days of "+pID;
                      document.getElementById("approvedInfo").innerHTML = "Dates between "+ lastWeekFull + " and "+nowFull;

                      document.getElementById("approvedHeader").style.display = "block";
                      document.getElementById("approvedInfo").style.display = "block";
                      document.getElementById("studyInfo").style.display = "block";

                      var header = "Data collected on "+ date + ", at " + time +"h";
                      
                      id = id + 1;

                      $('#approvedUserList').append(
                        '<div class="mdl-grid">'+
                        '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                          '<div id=+"cardHeader" class="mdl-card mdl-shadow--2dp">' +

                            '<div class="mdl-card__title">' +
                              '<h2 class="mdl-card__title-text">'+ header +'</h2>' +
                            '</div>' +

                            '<div class="mdl-card__supporting-text">' +
                              '<h5 id="moodInfo"><i class="material-icons">tag_faces</i>' + " "+mood + '</h5>' +
                              '<hr>'+
                              '<h5 id="locationInfo"><i class="fas fa-map-marker-alt"></i>' + " "+ location + '</h5>' +
                              '<div id="'+ id +'" class="collapse">'+
                              '<hr>'+
                              '<h5 id="temperatureInfo"><i class="fas fa-thermometer-three-quarters"></i>' + " "+ temperature+"C" + '</h5>' +
                              '<hr>'+
                              '<h5 id="bpmInfo"><i class="fas fa-heartbeat"></i>' + " "+ bpm + '</h5>' +
                              '<h5 id="stepsInfo"><i class="fas fa-walking"></i>' + " "+ steps + '</h5>' +
                              '<h5 id="sleepStartInfo"><i class="fas fa-bed"></i>' + " "+ sleep_start+"h" + '</h5>' +
                              '<h5 id="sleepEndInfo"><i class="fas fa-bell"></i>' + " "+ sleep_end+"h" + '</h5>' +
                              '<h5 id="sleepDurationInfo"><i class="fas fa-clock"></i>' + " "+ sleep_duration + '</h5>' +
                              '<hr>'+
                              '<h5 id="feelingInfo"><i class="fas fa-thumbs-up"></i>' + " "+ feeling + '</h5>' +
                              '<h5 id="noteInfo"><i class="fas fa-sticky-note"></i>' + " "+ note + '</h5>' +
                              '</div>' +
                            '</div>' +

                            '<div class="mdl-card__actions mdl-card--border">' +
                              '<a id="btnInfo'+id+'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="#'+id+'" data-toggle="collapse">Expand</a>' +
                            '</div>' +
                          '</div>' +
                        '</div>'+
                        '</div>'
                      );

                      if (mood == "green")
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>'
                        );
                      }
                      else if (mood == "yellow") 
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>'
                        );
                      }
                      else if (mood == "red")
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>'
                        );
                      }

                      if (location == "null")
                      {
                        $('#locationInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ locationErr +'</h5>'
                        );
                      }
                      else
                      {
                        //color_grey = #808080;
                        //color_black = #000000;
                        $('#locationInfo').replaceWith(
                          '<h5><span style="color: #808080;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ location +'</h5>'
                        );
                      }

                      if (temperature == "null")
                      {
                        $('#temperatureInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperatureErr +'</h5>'
                        );
                      }
                      else
                      {
                        //color_grey = #808080;
                        //color_black = #000000;
                        $('#temperatureInfo').replaceWith(
                          '<h5><span style="color: #808080;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperature+"C" +'</h5>'
                        );
                      }

                      if (bpm == "null")
                      {
                        $('#bpmInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-heartbeat"></i></span>'+ " "+ bpmErr +'</h5>');
                      }
                      else
                      {
                        $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                      }

                      if (steps == "null")
                      {
                        //<i class="fas fa-exclamation-triangle"></i>
                        $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                      }
                      else
                      {
                        /*
                        var minimalDate = date.replace('/2019','');
                        var stepsToInt = parseInt(steps);

                        //dd/mm/yyyy
                        var parts = date.split('/');

                        //construct date
                        var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                        
                        stepsObj = {
                          date: convertedDate,
                          steps: stepsToInt
                        };

                        stepsData.push(stepsObj);
                        */
                        $('#stepsInfo').replaceWith('<h5><span style="color: #FFA500;"><i class="fas fa-walking"></i></span>'+ " "+ steps +'</h5>');
                      }

                      if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                      {
                        $('#sleepStartInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bed"></i></span>'+ " "+ sleepErr +'</h5>');
                        $('#sleepEndInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bell"></i></span>'+ " "+ sleepErr +'</h5>');
                        $('#sleepDurationInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-clock"></i></span>'+ " "+ sleepErr +'</h5>');
                      }
                      else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                      {
                        /*
                        var minimalDate = date.replace('/2019','');

                        var start = new Date();
                        var end = new Date()

                        //dd/mm/yyyy
                        var parts = date.split('/');

                        //construct date
                        var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                        //hh:mm
                        var sTime = sleep_start.split(':');
                        start.setHours(sTime[0], sTime[1], 0, 0);

                        //hh:mm
                        var eTime = sleep_end.split(':');
                        end.setHours(eTime[0], eTime[1], 0, 0);

                        sleepObj = {
                          date: convertedDate,
                          sHH: parseInt(sTime[0]),
                          sMM: parseInt(sTime[1]),
                          eHH: parseInt(eTime[0]),
                          eMM: parseInt(eTime[1])
                        };

                        sleepData.push(sleepObj);
                        */

                        $('#sleepStartInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bed"></i></span>'+ " "+ sleep_start+"h" +'</h5>');
                        $('#sleepEndInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bell"></i></span>'+ " "+ sleep_end+"h"+'</h5>');
                        $('#sleepDurationInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-clock"></i></span>'+ " "+ sleep_duration +'</h5>');
                      }

                      if (feeling == "null")
                      {
                        //var colorGrey = #808080;
                        //var colorBlack = #000000;

                        //<i class="fas fa-dizzy"></i>
                        //<i class="fas fa-exclamation-triangle"></i>

                        $('#feelingInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-dizzy"></i></span>'+ " "+ feelingErr +'</h5>'
                        );
                      }
                      else if(feeling == "up")
                      {
                        //var colorBlue = #0000FF;
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_up</i></span>' + " "+ upToText + '</h5>');
                      }
                      else if(feeling == "down")
                      {
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_down</i></span>' + " "+ downToText + '</h5>');
                      }
                      else if(feeling == "uncertain")
                      {
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumbs_up_down</i></span>' + " "+ uncertainToText + '</h5>');
                      }

                      if (note == "null")
                      {
                        $('#noteInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-sticky-note"></i></span>'+ " "+ noteErr +'</h5>'
                        );
                      }
                      else
                      {
                        $('#noteInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-sticky-note"></i></span>' + " "+ note + '</h5>');
                      }

                      var y = "#btnInfo"+id;

                      $(y).on("click", function( event ) 
                      {
                        event.preventDefault();

                        $(this).text(function(i, old)
                        {
                          return old == "Expand" ?  "Collapse" : "Expand";
                        });
                      /* end y */
                      });

                    /* end convertedDate < today && convertedDate > daysAgo */
                    }
                    else if (convertedDate > today || convertedDate < daysAgo)
                    {
                      //not in parameter.. display error?
                      console.log("Date in analysis: "+date+"\n\tDates between "+ lastWeekFull + " and "+nowFull);
                      document.getElementById("approvedHeader").innerHTML = "Data for the last 7 days not found!";
                      document.getElementById("approvedHeader").style.color = "#FF0000";
                      document.getElementById("approvedHeader").style.display = "block";
                    /* end else*/
                    }

                  /* end moodDetailRef */
                  });

                /* end filterUserData is last 7 days */ 
                }
                else if (filterUserData == 4) //month
                {
                  moodDetailRef.once('value', function(monthMood)
                  {
                    monthMood.forEach(function(monthMoodChild)
                    {
                      var moodKey = monthMoodChild.key;
                      var moodVal = monthMoodChild.val();

                      if (moodKey == "time")
                      {
                        time = moodVal;
                      }
                      
                      if (moodKey == "date")
                      {
                        date = moodVal;
                      }

                      if (moodKey == "mood")
                      {
                        mood = moodVal;
                      }

                      if (moodKey == "context")
                      {
                        location = moodVal.location;
                        
                        temperature = moodVal.weather.temperature;
                        description = moodVal.weather.description;

                        bpm = moodVal.health.bpm;
                        steps = moodVal.health.steps;

                        sleep_duration = moodVal.health.sleep.duration;
                        sleep_end = moodVal.health.sleep.end;
                        sleep_start = moodVal.health.sleep.start;
                      }

                      if (moodKey == "feedback")
                      {
                        feeling = moodVal.feeling;
                        note = moodVal.note;
                      }
                    /* end monthMood */  
                    });

                    //alert("Retrieved date ("+date+") is equal to present month? ("+nowMonth+")");

                    var dateMonth = date.substring(3);

                    if (dateMonth != nowMonth)
                    {
                      //alert("Data for this month not found!");
                      document.getElementById("approvedHeader").innerHTML = "Data for this month not found!";
                      document.getElementById("approvedHeader").style.color = "#FF0000";
                      document.getElementById("approvedHeader").style.display = "block";
                    }
                    else
                    {
                      clean();
                      document.getElementById("approvedHeader").style.color = "#000000";
                      document.getElementById("approvedHeader").innerHTML = "Showing data for this month of "+pID;
                      
                      const month = today.toLocaleString('en', { month: 'long' });
                      
                      document.getElementById("approvedInfo").innerHTML = month;

                      document.getElementById("approvedHeader").style.display = "block";
                      document.getElementById("approvedInfo").style.display = "block";
                      document.getElementById("studyInfo").style.display = "block";
                      //alert("Date month!");
                      var header = "Data collected on "+ date + ", at " + time +"h";
                      
                      id = id + 1;

                      $('#approvedUserList').append(
                        '<div class="mdl-grid">'+
                        '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                          '<div id=+"cardHeader" class="mdl-card mdl-shadow--2dp">' +

                            '<div class="mdl-card__title">' +
                              '<h2 class="mdl-card__title-text">'+ header +'</h2>' +
                            '</div>' +

                            '<div class="mdl-card__supporting-text">' +
                              '<h5 id="moodInfo"><i class="material-icons">tag_faces</i>' + " "+mood + '</h5>' +
                              '<hr>'+
                              '<h5 id="locationInfo"><i class="fas fa-map-marker-alt"></i>' + " "+ location + '</h5>' +
                              '<div id="'+ id +'" class="collapse">'+
                              '<hr>'+
                              '<h5 id="temperatureInfo"><i class="fas fa-thermometer-three-quarters"></i>' + " "+ temperature+"C" + '</h5>' +
                              '<hr>'+
                              '<h5 id="bpmInfo"><i class="fas fa-heartbeat"></i>' + " "+ bpm + '</h5>' +
                              '<h5 id="stepsInfo"><i class="fas fa-walking"></i>' + " "+ steps + '</h5>' +
                              '<h5 id="sleepStartInfo"><i class="fas fa-bed"></i>' + " "+ sleep_start+"h" + '</h5>' +
                              '<h5 id="sleepEndInfo"><i class="fas fa-bell"></i>' + " "+ sleep_end+"h" + '</h5>' +
                              '<h5 id="sleepDurationInfo"><i class="fas fa-clock"></i>' + " "+ sleep_duration + '</h5>' +
                              '<hr>'+
                              '<h5 id="feelingInfo"><i class="fas fa-thumbs-up"></i>' + " "+ feeling + '</h5>' +
                              '<h5 id="noteInfo"><i class="fas fa-sticky-note"></i>' + " "+ note + '</h5>' +
                              '</div>' +
                            '</div>' +

                            '<div class="mdl-card__actions mdl-card--border">' +
                              '<a id="btnInfo'+id+'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="#'+id+'" data-toggle="collapse">Expand</a>' +
                            '</div>' +
                          '</div>' +
                        '</div>'+
                        '</div>'
                      );

                      if (mood == "green")
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>'
                        );
                      }
                      else if (mood == "yellow") 
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>'
                        );
                      }
                      else if (mood == "red")
                      {
                        $('#moodInfo').replaceWith(
                          '<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>'
                        );
                      }

                      if (location == "null")
                      {
                        $('#locationInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ locationErr +'</h5>'
                        );
                      }
                      else
                      {
                        //color_grey = #808080;
                        //color_black = #000000;
                        $('#locationInfo').replaceWith(
                          '<h5><span style="color: #808080;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ location +'</h5>'
                        );
                      }

                      if (temperature == "null")
                      {
                        $('#temperatureInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperatureErr +'</h5>'
                        );
                      }
                      else
                      {
                        //color_grey = #808080;
                        //color_black = #000000;
                        $('#temperatureInfo').replaceWith(
                          '<h5><span style="color: #808080;"><i class="fas fa-thermometer-three-quarters"></i></span>'+ " "+ temperature+"C" +'</h5>'
                        );
                      }

                      if (bpm == "null")
                      {
                        $('#bpmInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-heartbeat"></i></span>'+ " "+ bpmErr +'</h5>');
                      }
                      else
                      {
                        $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                      }

                      if (steps == "null")
                      {
                        //<i class="fas fa-exclamation-triangle"></i>
                        $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                      }
                      else
                      {
                        /*
                        var minimalDate = date.replace('/2019','');
                        var stepsToInt = parseInt(steps);

                        //dd/mm/yyyy
                        var parts = date.split('/');

                        //construct date
                        var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                        
                        stepsObj = {
                          date: convertedDate,
                          steps: stepsToInt
                        };

                        stepsData.push(stepsObj);
                        */
                        $('#stepsInfo').replaceWith('<h5><span style="color: #FFA500;"><i class="fas fa-walking"></i></span>'+ " "+ steps +'</h5>');
                      }

                      if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                      {
                        $('#sleepStartInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bed"></i></span>'+ " "+ sleepErr +'</h5>');
                        $('#sleepEndInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bell"></i></span>'+ " "+ sleepErr +'</h5>');
                        $('#sleepDurationInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-clock"></i></span>'+ " "+ sleepErr +'</h5>');
                      }
                      else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                      {
                        /*
                        var minimalDate = date.replace('/2019','');

                        var start = new Date();
                        var end = new Date()

                        //dd/mm/yyyy
                        var parts = date.split('/');

                        //construct date
                        var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                        //hh:mm
                        var sTime = sleep_start.split(':');
                        start.setHours(sTime[0], sTime[1], 0, 0);

                        //hh:mm
                        var eTime = sleep_end.split(':');
                        end.setHours(eTime[0], eTime[1], 0, 0);

                        sleepObj = {
                          date: convertedDate,
                          sHH: parseInt(sTime[0]),
                          sMM: parseInt(sTime[1]),
                          eHH: parseInt(eTime[0]),
                          eMM: parseInt(eTime[1])
                        };

                        sleepData.push(sleepObj);
                        */

                        $('#sleepStartInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bed"></i></span>'+ " "+ sleep_start+"h" +'</h5>');
                        $('#sleepEndInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bell"></i></span>'+ " "+ sleep_end+"h"+'</h5>');
                        $('#sleepDurationInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-clock"></i></span>'+ " "+ sleep_duration +'</h5>');
                      }

                      if (feeling == "null")
                      {
                        //var colorGrey = #808080;
                        //var colorBlack = #000000;

                        //<i class="fas fa-dizzy"></i>
                        //<i class="fas fa-exclamation-triangle"></i>

                        $('#feelingInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-dizzy"></i></span>'+ " "+ feelingErr +'</h5>'
                        );
                      }
                      else if(feeling == "up")
                      {
                        //var colorBlue = #0000FF;
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_up</i></span>' + " "+ upToText + '</h5>');
                      }
                      else if(feeling == "down")
                      {
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumb_down</i></span>' + " "+ downToText + '</h5>');
                      }
                      else if(feeling == "uncertain")
                      {
                        $('#feelingInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="material-icons">thumbs_up_down</i></span>' + " "+ uncertainToText + '</h5>');
                      }

                      if (note == "null")
                      {
                        $('#noteInfo').replaceWith(
                          '<h5><span style="color: #000000;"><i class="fas fa-sticky-note"></i></span>'+ " "+ noteErr +'</h5>'
                        );
                      }
                      else
                      {
                        $('#noteInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-sticky-note"></i></span>' + " "+ note + '</h5>');
                      }

                      var y = "#btnInfo"+id;

                      $(y).on("click", function( event ) 
                      {
                        event.preventDefault();

                        $(this).text(function(i, old)
                        {
                          return old == "Expand" ?  "Collapse" : "Expand";
                        });
                      /* end y */
                      });
                    /* end dateMonth == nowMonth*/
                    }
                  /* end moodDetailRef */
                  });
                /* end filterUserData is month*/ 
                }
              /* end key != green/yellow/red */
              }
            /* end moodSnapshot */
            });
          
          /* end userMoodRef */
          });

        /* end snapshot.exists() */
        }
      
      /* end moodRef.child */
      });
    /* end function userClicked */
    }
  
  }
  else
  {
    //console.log(user);
    window.open("index.html", "_self");
  }
});

/* Logout process */
$("#logoutBtn").click(
  function ()
  {
    firebase.auth().signOut().then(function()
    {
      // Sign-out successful.
      window.open("index.html", "_self");
      
    }).catch(function(error)
    {
      // An error happened.
      alert(error.message);
    });
  }
);
