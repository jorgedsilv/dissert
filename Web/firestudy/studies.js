/*
$( document ).ready(function()
{*/
firebase.auth().onAuthStateChanged(function(user)
{

  if (user && user.uid == "uyi50NiNCrgJfcZAh4uzDoK1Ucm1")
  {


  $(".login-cover").hide();
  //firebase
  var dbRef = firebase.database().ref();
  var studyRef = dbRef.child("study_data");

  var filterUserData = 1; //all is default
  var uui = -1; //user unique id
  var upi = ""; //user participant id

  var sui = "";       //study unique id
  var sui_state = ""; //study state
  var sui_end = "";   //study end date

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

  studyRef.once('value', function(snapshot)
  {
    snapshot.forEach(function(childSnapshot)
    {
      var studyID = childSnapshot.key;
      var detailKey = childSnapshot.key;
      var closeKey = childSnapshot.key;
      var eraseKey = childSnapshot.key;

      var study = childSnapshot.val();

      var title = study.title;
      var location = study.location;
      var magicword = study.magicword;
      var startdate = study.startdate;
      var enddate = study.enddate;
      var state = study.state;

      var participants = study.participants;
      var size = participants.length;

      var approved = study.approved;
      var appSize = approved.length;

      var filteredApproved = [];

      var previous = study.previous;
      var prevSize = previous.length;

      if (size != 0 && participants == "")
      {
        size = 0;
        //$('#openStudyDetailBtn').hide();
      }

      if (appSize != 0 && approved == "")
      {
        appSize = 0;
      }
      else
      {
        approved.forEach(function(app)
        {
          //console.log(app);
          if (!participants.includes(app))
          {
            //console.log("vai ser adicionado à lista dos aprovados");
            filteredApproved.push(app);
          }
          else
          {
            appSize -= 1;
          }
        });
      }

      if (prevSize != 0 && previous == "")
      {
        prevSize = 0;
      }

      //console.log("filtrado = "+filteredApproved);

      if(state == "open")
      {
        $('#openStudyList').append(
          '<div class="mdl-grid">'+
          '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
            '<div id=+"cardHeader" class="card-study mdl-card mdl-shadow--2dp">' +
              '<div class="mdl-card__title">' +
                '<h2 class="mdl-card__title-text">'+ title +'</h2>' +
              '</div>' +
              '<div class="mdl-card__supporting-text">' +
                '<h5>' + "Location: "+ location + '</h5>' +
                '<h5>' + "Start: "+startdate + '</h5>' +
                '<h5>' + "#Participants: "+size + '</h5>' +
                '<h5>' + "#Pending check-in: "+appSize + '</h5>' +
              '</div>' +
              '<div id="openStudyDetailBtn" class="mdl-card__actions mdl-card--border">' +
                '<a id="'+ detailKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">info</i> View study </a>' +
              '</div>' +
              '<div id="openStudyCloseBtn" class="mdl-card__actions mdl-card--border">' +
                '<a id="'+ closeKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">close</i> Close study </a>' + 
              '</div>' +
              '<div id="openStudyDeleteBtn" class="mdl-card__actions mdl-card--border">' +
                  '<a id="'+ eraseKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="far fa-trash-alt"></i> Delete study </a>' + 
              '</div>' +
            '</div>' +
          '</div>'+
          '</div>'
        );
        
        var detailBtnAction = "#"+detailKey;
        var closeBtnAction = "#"+closeKey;
        var deteleBtnAction = "#"+eraseKey;

        $(openStudyDetailBtn).on("click", detailBtnAction, function()
        {
          event.preventDefault();
          //alert(detailKey);
          clean();

          $("#exportAllStudyDataBtn").hide();
          $("#exportStudyDataBtn").show();
          $("#exportUserStudyDataBtn").hide();

          $("#inviteUserBtn").show();

          sui = studyID;

          //$('#qrcode').qrcode(magicword);

          $('#openStudyList').append(
            '<div class="mdl-grid">'+
              '<div id="qrcode"></div>' +
            '</div>'
          );

          var qrcode = new QRCode(document.getElementById("qrcode"), {
            width : 325,
            height : 325
          });

          qrcode.clear();
          qrcode.makeCode(magicword);

          $("#addUsersBtn").show();

          $("#addUsersBtn").click(
            function ()
            {
              $("#table_body tr").remove();

              var usersToAdd = [];
              var usersNotAvailable = [];
              var list = [];
              
              //console.log("Add users to study "+ title);
              //console.log("StudyID = "+studyID); //add a este estudo

              studyRef.once('value', function(studySnap)
              {
                studySnap.forEach(function(studyChild)
                {
                  var key = studyChild.key;
                  var study = studyChild.val();

                  //var participants = study.participants;
                  //var size = participants.length;

                  var approved = study.approved;
                  var appSize = approved.length;

                  //console.log("> approved: "+approved);

                  var studyObj = {
                    approved: approved,
                    studyKey: String(key)
                  }

                  list.push(studyObj);
                });
                
                list.forEach(function(item)
                {
                  if(item.approved != "" && studyID != item.studyKey)
                  {
                    //console.log(item.approved);
                    //console.log("!> não posso meter este no meu estudo");
                    usersNotAvailable.push(String(item.approved));
                  }
                  else if(item.approved != "" && studyID == item.studyKey)
                  {
                    //console.log(item.approved);
                    //console.log("!> este já está no meu estudo");
                    usersNotAvailable.push(String(item.approved));
                  }
                });

                //console.log("> Not available: "+usersNotAvailable);

                var usersRef = dbRef.child("personal_data");
                usersRef.once('value', function(userSnap)
                {
                  userSnap.forEach(function(userChild)
                  {
                    var userID = userChild.key;
                    var user = userChild.val();

                    var fname = user.fname;
                    var lname = user.lname;
                    var email = user.email;
                    var dnasc = user.birthday;
                    var gender = user.gender;
                    var reg = user.register;

                    //console.log(usersNotAvailable);
                    //alert(userID+", "+usersNotAvailable.includes(userID));
                    //alert(userID);

                    var str = usersNotAvailable.toString();

                    if (str.includes(userID) == false)
                    {
                      //alert("adding user "+ userID);
                      //usersToAdd.push(user);

                      $('#table_body').append(
                        '<tr>' +
                          '<td class="mdl-data-table__cell--non-numeric">' + fname + '</td>' +
                          '<td class="mdl-data-table__cell--non-numeric">' + gender +'</td>' +
                          '<td class="mdl-data-table__cell--non-numeric">' + dnasc +'</td>'+
                          '<td class="mdl-data-table__cell--non-numeric">' + reg +'</td>'+
                          '<td class="mdl-data-table__cell--non-numeric">' +
                            '<button id="'+userID+'" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">' +
                              '<i class="material-icons"> add </i> Add'+ 
                            '</button>' +
                          '</td>'+
                        '</tr>'
                      );

                      var btnAction = "#"+userID;

                      $(btnAction).on("click", function()
                      {
                        //alert("add btn touched "+userID);
                        addDirectlyToStudy(userID, fname, lname, email, studyID);
                      });

                    }

                  /* end userSnap */
                  });

                  //alert(JSON.stringify(usersAvailableToAdd));
                  var rows = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
                  //alert(rows);

                  if (rows != 0)
                  {
                    $("#table").show();
                    //alert(usersNotAvailable);
                  }
                  else if (rows == 0)
                  {
                    alert("There are no users available to add at this moment");
                    //document.getElementById("table_caption").innerText = "There is no users available to add at this moment";
                    $("#table").hide();
                    //$("#table_head").hide();
                    //$("#table_body").hide();
                  }

                /* end usersRef */
                });

              });

            /* end function */  
            });
          

          if (participants == "" && filteredApproved == "")
          {
            /*
            $("#exportAllStudyDataBtn").hide();
            $("#exportStudyDataBtn").hide();
            $("#exportUserStudyDataBtn").hide();
            */

            document.getElementById("studyHeader").innerHTML = "Study "+ title +" has no participants or users pending check-in";
            document.getElementById("openStudyInfo").innerHTML = "Use the <em><strong>Add users</strong></em> button above to add users, or go to <em><strong>Participants</strong></em> section to approve users</br>Alternatively, you can use the <em><strong>Invite to participate</strong></em> button above to send and invitation e-mail";
            //you can invite users to participate by using the <em><strong>Invite to participate</strong></em> button above

            document.getElementById("studyHeader").style.display = "block";
            document.getElementById("openStudyInfo").style.display = "block";
          }
          
          if(participants != "")
          {
            var index = 0;
            
            /* chart data of how my users are doing */
            var greenCount = 0;
            var yellowCount = 0;
            var redCount = 0;

            /* last and least user that has input data */
            var allLastInput = [];
            var lastActive;
            var leastActive;
            
            /* number of users that have mood data */
            var nUserWithData = 0;

            /* number of users that interacted in the last 7 days */
            var nUser7days = 0;
            var nUser7daysTemp = [];
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            var nowFull = dd + '/' + mm + '/' + yyyy;

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
            
            participants.forEach(function(entry)
            {
              //alert(entry);

              index = index + 1;
              var pID = "Participant #"+index;

              document.getElementById("studyHeader").innerHTML = title;
              document.getElementById("openStudyInfo").innerHTML = "Showing study data of study "+title;

              document.getElementById("studyHeader").style.display = "block";
              document.getElementById("openStudyInfo").style.display = "block";

              /* getting personal data of participant */
              var newPersonalChild = 'personal_data/' + entry;
              var newPersonalRef = dbRef.child(newPersonalChild);

              newPersonalRef.once('value', function(userSnap)
              {
                //alert(JSON.stringify(userSnap.val()));
                
                //alert(entry);
                var moreKey = entry;
                var removeKey = entry;
                var deleteKey = entry;

                var fname = userSnap.val().fname;
                var dnasc = userSnap.val().birthday;
                var gender = userSnap.val().gender;
                var reg = userSnap.val().register;

                var lastInput = err;
                var lastInputTag = "lastInput"+entry;
                var numMoodData = 0;
                var collectedDataTag = "collectedData"+entry;

                //var newMoodChild = 'mood_data/' + entry;
                //var newMoodRef = dbRef.child(newMoodChild);

                /* showing personal data */
                $('#openStudyList').append
                (
                  '<div class="mdl-grid">'+
                  '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                    '<div id=+"cardHeader" class="card-study mdl-card mdl-shadow--2dp">' +
                      '<div class="mdl-card__title">' +
                        '<h2 class="mdl-card__title-text"><i class="material-icons">person</i>'+ fname +'</h2>' +
                      '</div>' +
                      '<div class="mdl-card__supporting-text">' +
                        '<h5 id="genderTag"><i class="material-icons">face</i>' + " "+gender + '</h5>' +
                        '<h5><i class="fas fa-birthday-cake"></i>' + " "+ dnasc + '</h5>' +
                        '<h5><i class="material-icons">how_to_reg</i>' + " "+ reg + '</h5>' +
                        '<h5 id="'+ lastInputTag +'"><i class="fas fa-calendar-times"></i>'+ " Last data: "+ lastInput + '</h5>' +
                        '<h5 id="'+ collectedDataTag +'"><i class="fas fa-stream"></i>' + " Total data: "+ numMoodData + '</h5>' +
                      '</div>' +
                      '<div id="approvedUserDetailBtn" class="mdl-card__actions mdl-card--border">' +
                        '<a id="'+ moreKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">info</i> View collected data </a>' +
                      '</div>' +
                      '<div id="approvedUserRemoveBtn" class="mdl-card__actions mdl-card--border">' +
                        '<a id="'+ removeKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">close</i> Remove from study </a>' + 
                      '</div>' +
                      '<div id="approvedUserDeleteBtn" class="mdl-card__actions mdl-card--border">' +
                        '<a id="'+ deleteKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="far fa-trash-alt"></i> Delete collected data </a>' + 
                      '</div>' +
                    '</div>' +
                  '</div>'+
                  '</div>'
                );

                if(gender == "Male")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-mars"></i>' + " "+gender + '</h5>');
                }
                else if (gender == "Female")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-venus"></i>' + " "+gender + '</h5>');
                }
                else if (gender == "Other")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-genderless"></i>' + " "+gender + '</h5>');
                }

                var moodRef = dbRef.child("mood_data");            
                moodRef.child(entry).once('value', function(moodSnap)
                {
                  if (!moodSnap.exists()) //does not have mood data
                  {
                    //console.log("User >"+fname+"< does not have mood data");

                    //lastInput = err;
                    //numMoodData = 0;

                    /*
                    $('#lastInputTag').replaceWith(
                      '<h5><i class="fas fa-calendar-times"></i>'+ " "+ err + '</h5>'
                    );

                    $('#collectedDataTag').replaceWith(
                      '<h5><i class="fas fa-stream"></i>' + " "+ 0 + '</h5>'
                    );
                    */
                  }
                  else if (moodSnap.exists())
                  {
                    //console.log(snapshot.key);
                    nUserWithData = nUserWithData + 1;
                    
                    var nChildren = moodSnap.numChildren() - 3;
                    //console.log("User >"+fname+"< has "+ nChildren +" mood data");

                    numMoodData = nChildren;

                    var newMoodChild = 'mood_data/' + entry;
                    //console.log(newMoodChild);
                    var newMoodRef = dbRef.child(newMoodChild);
                    
                    //var ref = firebase.database().ref("dinosaurs");
                    //newMoodRef.orderByKey().limitToLast(4).on("child_added", function(snapshot)
                    newMoodRef.orderByKey().limitToLast(4).once("child_added", function(snapshot)
                    {
                      var key = snapshot.key;

                      //console.log(key);

                      if (key != "green" && key != "yellow" && key != "red")
                      {
                        //console.log("Last one:\n"+snapshot.val().date + ", " + snapshot.val().time + ": " + snapshot.val().mood);

                        var moodToText;
                        if (snapshot.val().mood == "green") moodToText = greenToText;
                        else if (snapshot.val().mood == "yellow") moodToText = yellowToText;
                        else if (snapshot.val().mood == "red") moodToText = redToText;
                        
                        lastInput = snapshot.val().date + ", " + snapshot.val().time + "h";

                        var lastTag = "#lastInput"+entry;
                        $(lastTag).replaceWith(
                          '<h5><i class="fas fa-calendar-check"></i>'+ " Last data: "+ lastInput + '</h5>'
                        );

                        //dd/mm/yyyy
                        var readDate = snapshot.val().date.split('/');

                        //hh:mm
                        var readTime = snapshot.val().time.split(':');

                        //construct date
                        var convertDate = new Date(readDate[2], readDate[1] - 1, readDate[0], readTime[0], readTime[1]);

                        var allLastInputObj = {
                          id: entry,
                          user: fname,
                          date: snapshot.val().date,
                          time: snapshot.val().time,
                          convertDate: convertDate,
                          mood: moodToText
                        };

                        allLastInput.push(allLastInputObj);
                      }

                      //get last active
                      const sortedLast = allLastInput.slice().sort((a, b) => b.convertDate - a.convertDate);

                      //console.log("Last active: "+sortedLast[0].user);
                      //console.log("Least active: "+sortedLast[sortedLast.length - 1].user);

                      lastActive = "Last active user was " + sortedLast[0].user + " on "+ sortedLast[0].date;
                      leastActive = sortedLast[sortedLast.length - 1].user + " does not interact since "+sortedLast[sortedLast.length - 1].date;
                      /*if (sortedLast.length > 1)
                      {
                        leastActive = sortedLast[sortedLast.length - 1].user + " does not interact since "+sortedLast[sortedLast.length - 1].date;
                      }
                      else
                      {
                        leastActive = "";
                      }*/

                      allLastInput.forEach(function(item)
                      {
                        if (nUser7daysTemp == "" || !nUser7daysTemp.includes(item.id))
                        {
                          if (item.convertDate < today && item.convertDate > daysAgo)
                          {
                            console.log(item.user);
                            nUser7days = nUser7days + 1;
                            //nUser7daysTemp = item.id;
                            nUser7daysTemp.push(item.id);
                          }
                        }
                      });

                      //console.log("interacted last 7 days: "+nUser7days);
                    });

                    var collectedTag = "#collectedData"+entry;
                    $(collectedTag).replaceWith(
                      '<h5><i class="fas fa-stream"></i>' + " Total data: "+ numMoodData + '</h5>'
                    );

                    //---
                    
                    newMoodRef.once('value', function(allMood)
                    {
                      allMood.forEach(function(allMoodChild)
                      {
                        var moodKey = allMoodChild.key;
                        var moodVal = allMoodChild.val();

                        //console.log("moodKey: "+moodKey);
                        //console.log("moodVal: "+moodVal);

                        if (moodKey == "green") greenCount = greenCount + parseInt(moodVal);
                        else if (moodKey == "yellow") yellowCount = yellowCount + + parseInt(moodVal);
                        else if (moodKey == "red") redCount = redCount + parseInt(moodVal);;

                      });

                      //console.log("Total green: "+greenCount);
                      //console.log("Total yellow: "+yellowCount);
                      //console.log("Total red: "+redCount);

                      //fazer gráfico
                      drawMetrics(greenCount, yellowCount, redCount);

                      var overall;
                      if (greenCount > yellowCount && greenCount > redCount)
                      {
                        overall = "Overall, participants were in a positive mood";
                      }
                      else if (yellowCount > greenCount && yellowCount > redCount)
                      {
                        overall = "Overall, participants were in a neutral mood";
                      }
                      else if (redCount > greenCount && redCount > yellowCount)
                      {
                        overall = "Overall, participants were in a negative mood";
                      }
                      else if (greenCount == yellowCount && greenCount > redCount)
                      {
                        overall = "Overall, participants were in both positive and neutral mood";
                      }
                      else if (greenCount == redCount && greenCount > yellowCount)
                      {
                        overall = "Overall, participants were in both positive and negative mood";
                      }
                      else if (yellowCount == redCount && yellowCount > greenCount)
                      {
                        overall = "Overall, participants were in both neutral and negative mood";
                      }
                      else if (yellowCount == redCount && yellowCount == greenCount)
                      {
                        overall = "Overall, participants were in a balanced mood";
                      }

                      document.getElementById('info').innerHTML = overall + "</br></br>" +lastActive + "</br></br>" + leastActive+ "</br></br>" + "#Participants that have generated data: " + nUserWithData + "</br></br>" + "#Participants that interacted last 7 days: " + nUser7days;

                      document.getElementById('info').style.display = "block";
                      document.getElementById('metrics_data').style.display = "block";
                      document.getElementById('metricsInfo').style.display = "block";
                    });
                  }
                });

                var detailBtnAction = "#"+moreKey;

                $(approvedUserDetailBtn).on("click", detailBtnAction, function()
                {
                  event.preventDefault();
                  //alert("here");
                  //alert(moreKey);

                  uui = moreKey;
                  //upi = pID;
                  upi = fname;

                  $('#openStudyList').empty();
                  $("#filterUserDataBtn").show();
                  $("#addUsersBtn").hide();
                  $("#inviteUserBtn").hide();
                  $("#table").hide();
                  
                  $("#metrics_data").hide();
                  $("#metricsInfo").hide();
                  //document.getElementById('metrics_data').style.display = "block";
                  //document.getElementById('metricsInfo').style.display = "block";

                  $("#exportAllStudyDataBtn").hide();
                  $("#exportStudyDataBtn").hide();
                  $("#exportUserStudyDataBtn").show(); //--> se não tiver dados não pode aparecer

                  sui_state = state;
                  sui_end = enddate;

                  userDetail(moreKey, fname);
                });

                var removeBtnAction = "#"+removeKey;

                $(approvedUserRemoveBtn).on("click", removeBtnAction, function()
                {
                  event.preventDefault();
                  //alert("remove btn touched: "+removeKey);
                  
                  $("#addUsersBtn").hide();
                  $("#inviteUserBtn").hide();
                  $("#table").hide();

                  /*
                  $("#exportAllStudyDataBtn").hide();
                  $("#exportStudyDataBtn").hide();
                  $("#exportUserStudyDataBtn").hide();
                  */

                  userRemove(removeKey, studyID);
                });

                var deleteBtnAction = "#"+deleteKey;
                $(approvedUserDeleteBtn).on("click", deleteBtnAction, function()
                {
                  event.preventDefault();
                  //alert("DELETE");
                  /*
                  $("#addUsersBtn").hide();
                  $("#inviteUserBtn").hide();
                  $("#table").hide();*/

                  //userDelete(removeKey, studyID, fname);
                  dataDelete(removeKey, fname, state);
                });

              /* end newPersonalRef */
              });

            /* end participants forEach*/
            });

          /* participants != "" */
          }
          
          if (filteredApproved != "")
          {
            var appIdx = 0;
            //alert("Size = "+ filteredApproved.length);

            $("#exportAllStudyDataBtn").hide();
            $("#exportStudyDataBtn").show();
            $("#exportUserStudyDataBtn").hide();

            filteredApproved.forEach(function(entry)
            {
              //alert("AQUIIIII");
              appIdx = appIdx + 1;
              var aID = "User #"+appIdx;

              document.getElementById("studyHeader").innerHTML = title;
              document.getElementById("openStudyInfo").innerHTML = "Showing study data of study "+title;

              document.getElementById("studyHeader").style.display = "block";
              document.getElementById("openStudyInfo").style.display = "block";

              document.getElementById("closedStudyInfo").innerHTML = "Users pending check-in in study";
              document.getElementById("closedStudyInfo").style.display = "block";

              /* getting personal data of participant */
              var newPersonalChild = 'personal_data/' + entry;
              var newPersonalRef = dbRef.child(newPersonalChild);

              newPersonalRef.once('value', function(userSnap)
              {
                var removeKey = entry;

                var fname = userSnap.val().fname;
                var dnasc = userSnap.val().birthday;
                var gender = userSnap.val().gender;
                var reg = userSnap.val().register;

                /* showing personal data */
                $('#closedStudyList').append
                (
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
                      '<div id="pendingUserRemoveBtn" class="mdl-card__actions mdl-card--border">' +
                        '<a id="'+ removeKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">close</i> Remove </a>' + 
                      '</div>' +
                    '</div>' +
                  '</div>'+
                  '</div>'
                );

                if(gender == "Male")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-mars"></i>' + " "+gender + '</h5>');
                }
                else if (gender == "Female")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-venus"></i>' + " "+gender + '</h5>');
                }
                else if (gender == "Other")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-genderless"></i>' + " "+gender + '</h5>');
                }

                var removeBtnAction = "#"+removeKey;

                $(pendingUserRemoveBtn).on("click", removeBtnAction, function()
                {
                  event.preventDefault();
                  //alert("remove btn touched: "+removeKey);
                
                  userRemove(removeKey, studyID);
                });

              /* end newPersonalRef */ 
              });

            /* end filteredApproved forEach */
            });
          /* end filteredApproved != "" */
          }
        /* end btn*/
        });
        
        /* close the study */
        $(openStudyCloseBtn).on("click", closeBtnAction, function()
        {
          //alert("Closing study with key: "+closeKey);

          // end date is current date
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();

          var enddate = dd + '/' + mm + '/' + yyyy;

          // move mood entries

          if (participants != "")
          {
            //percorrer users
            participants.forEach(function(part)
            {
              console.log("Parsing user: "+part);

              var moodChild = 'mood_data/' + part;
              var moodRef = dbRef.child(moodChild);
              
              //move collected data from mood_data to previous_data
              moodRef.once('value', function(moodSnap)
              {
                //console.log(JSON.stringify(moodSnap.val()));
                firebase.database().ref('previous_data/' + part).set(moodSnap.val());
                console.log("\tMoved data of user "+part+" to previous_data");

                moodRef.remove();
                console.log("\tCollected data of user "+part +" was removed from branch mood_data!");
              });

            });
          }

          //close study

          // A Study entry
          var updatedStudyData = {
            title: title,
            location: location,
            magicword: magicword,
            startdate: startdate,
            enddate: enddate,
            state: "closed",
            participants: [""],
            approved: [""],
            previous: participants,
          };

          // Write the new study's data
          var updates = {};
          updates['/study_data/' + closeKey] = updatedStudyData;

          alert("Study \""+ title+"\" is now closed");

          window.location.reload();
          return firebase.database().ref().update(updates);
        });

        /* delete open study */
        $(openStudyDeleteBtn).on("click", deteleBtnAction, function()
        {
          //alert("Deleting study \""+ title+"\"");
          studyDelete(studyID, title, state, participants, previous);
          window.location.reload();
        });
      }
      else if (state == "closed")
      {
        $('#closedStudyList').append
        (
          '<div class="mdl-grid">'+
          '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
            '<div id=+"cardHeader" class="card-square mdl-card mdl-shadow--2dp">' +
              '<div class="mdl-card__title">' +
                '<h2 class="mdl-card__title-text">'+ title +'</h2>' +
              '</div>' +
              '<div class="mdl-card__supporting-text">' +
                '<h5>' + "Location: "+ location + '</h5>' +
                '<h5>' + "Start: "+startdate + '</h5>' +
                '<h5>' + "End: "+enddate + '</h5>' +
                '<h5>' + "#Previous participants: "+prevSize + '</h5>' +
              '</div>' +
              '<div id="closedStudyDetailBtn" class="mdl-card__actions mdl-card--border">' +
                '<a id="'+ detailKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">info</i> View study </a>' +
              '</div>' +
              '<div id="closedStudyDeleteBtn" class="mdl-card__actions mdl-card--border">' +
                  '<a id="'+ eraseKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="far fa-trash-alt"></i> Delete study </a>' + 
              '</div>' +
            '</div>' +
          '</div>'+
          '</div>'
        );

        var detailBtnAction = "#"+detailKey;
        var deteleBtnAction = "#"+eraseKey;

        /* see closed study */
        $(closedStudyDetailBtn).on("click", detailBtnAction, function()
        {
          //event.preventDefault();
          //alert(detailKey);
          clean();

          sui = studyID;

          if (previous == "")
          {
            $("#exportAllStudyDataBtn").hide();
            $("#exportStudyDataBtn").hide();
            $("#exportUserStudyDataBtn").hide();

            document.getElementById("studyHeader").innerHTML = "No data found";
            //document.getElementById("openStudyInfo").innerHTML = "Showing study data of study "+title;

            document.getElementById("studyHeader").style.display = "block";
            //document.getElementById("openStudyInfo").style.display = "block";
          }
          else
          {
            $("#exportAllStudyDataBtn").hide();
            $("#exportStudyDataBtn").show();
            $("#exportUserStudyDataBtn").hide();

            $('#closedStudyList').append
            (
              '<div class="mdl-grid">'+
                '<div id="qrcode"></div>' +
              '</div>'
            );

            //$('#qrcode').qrcode(magicword);

            var qrcode = new QRCode(document.getElementById("qrcode"), {
              width : 325,
              height : 325
            });

            qrcode.clear();
            qrcode.makeCode(magicword);

            var index = 0;
            previous.forEach(function(entry)
            {
              index = index + 1;
              var pID = "Participant #"+index;

              document.getElementById("studyHeader").innerHTML = title;
              document.getElementById("openStudyInfo").innerHTML = "Showing study data of study "+title;

              document.getElementById("studyHeader").style.display = "block";
              document.getElementById("openStudyInfo").style.display = "block";

              /* getting personal data of participant */
              var newPersonalChild = 'personal_data/' + entry;
              var newPersonalRef = dbRef.child(newPersonalChild);

              newPersonalRef.once('value', function(userSnap)
              {
                var detailKey = entry;
                var deleteKey = entry;

                var fname = userSnap.val().fname;
                var dnasc = userSnap.val().birthday;
                var gender = userSnap.val().gender;
                var reg = userSnap.val().register;

                /* showing personal data */
                $('#closedStudyList').append
                (
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
                      '<div id="closedUserDetailBtn" class="mdl-card__actions mdl-card--border">' +
                        '<a id="'+ detailKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="material-icons">info</i> View collected data </a>' +
                      '</div>' +
                      '<div id="closedUserDeleteBtn" class="mdl-card__actions mdl-card--border">' +
                        '<a id="'+ deleteKey +'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="far fa-trash-alt"></i> Delete collected data </a>' + 
                      '</div>' +
                    '</div>' +
                  '</div>'+
                  '</div>'
                );

                if(gender == "Male")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-mars"></i>' + " "+gender + '</h5>');
                }
                else if (gender == "Female")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-venus"></i>' + " "+gender + '</h5>');
                }
                else if (gender == "Other")
                {
                  $('#genderTag').replaceWith('<h5><i class="fas fa-genderless"></i>' + " "+gender + '</h5>');
                }

                var detailBtnAction = "#"+detailKey;
                var deleteBtnAction = "#"+deleteKey;

                $(closedUserDetailBtn).on("click", detailBtnAction, function()
                  {
                    event.preventDefault();
                    //alert("here");
                    //alert(detailKey);

                    uui = detailKey;
                    //upi = pID;
                    upi = fname;

                    $('#closedStudyList').empty();
                    //--> vale a pena aqui a filtragem?
                    //$("#filterUserDataBtn").show();

                    $("#exportAllStudyDataBtn").hide();
                    $("#exportStudyDataBtn").hide();
                    $("#exportUserStudyDataBtn").show();

                    //userDetail(detailKey, pID);

                    sui_state = state;
                    sui_end = enddate;

                    closedUserDetail(detailKey, upi, enddate);
                  });

                $(closedUserDeleteBtn).on("click", deleteBtnAction, function()
                  {
                    event.preventDefault();
                    //alert("Deleting collected data in a closed study");
                    dataDelete(deleteKey, fname, state);
                  });

              /* end newPersonalRef */
              });

            /* end participants forEach */
            });
          /* end participants empty */
          }
        /* end closedStudyDetailBtn */
        });
        
        /* delete the study */
        $(closedStudyDeleteBtn).on("click", deteleBtnAction, function()
        {
          //alert("Deleting study \""+ title+"\"");
          studyDelete(studyID, title, state, participants, previous);
          window.location.reload();
        });
      
      /* end if state*/
      }
      
    });
  });

  $("#exportAllStudyDataBtn").click(
    function ()
    {
      exportAllStudies();
    });

  function exportAllStudies()
  {
    var studyList = [];

    var userList = [];

    var moodList = [];

    var closedUserList = [];
    var closedMoodList = [];

    //array containing tableID with mood data
    var arrTableId = []; 

    //aux counters
    var countPart = 0; //conta se já percorreu os participantes todos
    var countApp = 0; //conta se já percorreu os pendentes todos
    var howManyPartHaveData = 0; //how many participants have mood data
    var countPrev = 0;
    var howManyPrevHaveData = 0;

    studyRef.once('value', function(studySnap)
    {
      studySnap.forEach(function(studyChild)
      {
        var studyID = studySnap.key;

        var study = studyChild.val();

        var studyTitle = study.title;
        var studyLocation = study.location;
        var studyMagicword = study.magicword;
        var studyStartdate = study.startdate;
        var studyEnddate = study.enddate;
        var studyState = study.state;
        var studyParticipants = study.participants;
        var studyApproved = study.approved;

        var studyPrevious = study.previous;
        
        var stateTmp;

        if (studyState == "open") stateTmp = "- - -";
        else stateTmp = studyEnddate;

        var filteredParticipants = [];
        var pSize = studyParticipants.length;

        if (pSize != 0 && studyParticipants == "")
        {
          pSize = 0;
        }
        else
        {
          studyParticipants.forEach(function(pChild)
          {
            filteredParticipants.push(pChild);
          });
        }

        var filteredApproved = [];
        var aSize = studyApproved.length;

        if (aSize != 0 && studyApproved == "")
        {
          aSize = 0;
        }
        else
        {
          studyApproved.forEach(function(aChild)
          {
            if (!studyParticipants.includes(aChild))
            {
              filteredApproved.push(aChild);
            }
            else
            {
              aSize -= 1;
            }
          });
        }

        var filteredPrevious = [];
        var prevSize = studyPrevious.length;
        
        if (prevSize != 0 && studyPrevious == "")
        {
          prevSize = 0;
        }
        else
        {
          studyPrevious.forEach(function(prevChild)
          {
            filteredPrevious.push(prevChild);
          });
        }

        var studyObj = {
          id: studyID,
          title: studyTitle,
          location: studyLocation,
          secretcode: studyMagicword,
          state: studyState,
          start: studyStartdate,
          end: stateTmp,
          pSize: pSize,
          participants: filteredParticipants,
          aSize: aSize,
          approved: filteredApproved,
          prevSize: prevSize,
          previous: filteredPrevious
        };

        studyList.push(studyObj);

      /* end studySnap.forEach */
      });

      studyList.forEach(function(studyItem)
      {
        //to send to exportToExcel function
        var tableArr = [];
        var sheetArr = [];
        var filename;

        createTable("exportStudy"); 
        var studyTable = document.getElementById("exportStudy");

        if (studyItem.state == "open")
        {
          userList = [];
          moodList = [];

          /* estudo vazio, exporta de imediato */
          if (studyItem.approved == "" && studyItem.participants == "")
          {
            //console.log("Empty study \'"+studyItem.title+"\'");
            
            /* define export filename */
            filename = studyItem.title + '.xls';

            $(studyTable).append(
              '<tr>'+
                '<th>Title</th>'+
                '<th>Location</th>'+
                '<th>Secret code</th>'+
                '<th>State</th>'+
                '<th>Start date</th>'+
                '<th>End date</th>'+
                '<th>Number pending checkin</th>'+
                '<th>Number participants</th>'+
              '</tr>'
            );

            $(studyTable).append(
              '<tr>' +
                '<td>' + studyItem.title + '</td>' +
                '<td>' + studyItem.location + '</td>' +
                '<td>' + studyItem.secretcode + '</td>' +
                '<td>' + studyItem.state + '</td>' +
                '<td>' + studyItem.start + '</td>' +
                '<td>' + studyItem.end + '</td>' +
                
                '<td>' + studyItem.pSize + '</td>' +
                '<td>' + studyItem.aSize + '</td>' +
              '</tr>'
            );

            tableArr.push(studyTable);
            sheetArr.push('Information');

            //exportToExcel(tableArr, sheetArr, filename);
            removeTables(tableArr);
            //$(studyTable).parents("tr").remove();
          }
          else
          {
            console.log("Study not empty \'"+studyItem.title+"\'");

            /* define export filename */
            filename = studyItem.title + '.xls';

            //console.log(studyTable);
            $(studyTable).remove();

            $(studyTable).append(
              '<tr>'+
                '<th>Title</th>'+
                '<th>Location</th>'+
                '<th>Secret code</th>'+
                '<th>State</th>'+
                '<th>Start date</th>'+
                '<th>End date</th>'+
                '<th>Number pending checkin</th>'+
                '<th>Number participants</th>'+
              '</tr>'
            );

            $(studyTable).append(
              '<tr>' +
                '<td>' + studyItem.title + '</td>' +
                '<td>' + studyItem.location + '</td>' +
                '<td>' + studyItem.secretcode + '</td>' +
                '<td>' + studyItem.state + '</td>' +
                '<td>' + studyItem.start + '</td>' +
                '<td>' + studyItem.end + '</td>' +
                
                '<td>' + studyItem.pSize + '</td>' +
                '<td>' + studyItem.aSize + '</td>' +
              '</tr>'
            );

            //console.log(studyTable);

            tableArr.push(studyTable);
            sheetArr.push('Information');

            if (studyItem.aSize != 0)
            {
              createTable("exportPending");
              var pendingTable = document.getElementById("exportPending");
              
              $(pendingTable).append(
                '<tr>'+
                  '<th>Full name</th>'+
                  '<th>Email</th>'+
                  '<th>Birthday</th>'+
                  '<th>Gender</th>'+
                  '<th>Date of registry</th>'+
                '</tr>'
              );

              tableArr.push(pendingTable);
              sheetArr.push('Pending');
              //alert(aSize);
            }

            if (studyItem.pSize != 0)
            {
              createTable("exportParticipant");
              var participantTable = document.getElementById("exportParticipant");
              
              $(participantTable).append(
                '<tr>'+
                  '<th>Full name</th>'+
                  '<th>Email</th>'+
                  '<th>Birthday</th>'+
                  '<th>Gender</th>'+
                  '<th>Date of registry</th>'+
                '</tr>'
              );

              tableArr.push(participantTable);
              sheetArr.push('Participants');
            }

            var usersRef = dbRef.child("personal_data");
            usersRef.once('value', function(userSnap)
            {
              userSnap.forEach(function(userChild)
              {
                var userID = userChild.key;
                var user = userChild.val();

                var fname = user.fname;
                var lname = user.lname;
                var email = user.email;
                var dnasc = user.birthday;
                var gender = user.gender;
                var reg = user.register;

                var displayName = fname + " " + lname;

                var userObj = {
                  id: userID,
                  name: displayName,
                  email: email,
                  dnasc: dnasc,
                  gender: gender,
                  reg: reg
                };

                userList.push(userObj);
              //--> end userSnap
              });

              var keyToReadList = [];

              userList.forEach(function(userItem) //users do estudo
              {
                //alert(userItem.name);
                if (studyItem.participants.includes(userItem.id) == true)
                {
                  //alert("Participant "+userItem.name+" in study "+studyItem.title);
                  var moodRef = dbRef.child("mood_data");            
                  moodRef.child(userItem.id).once('value', function(snapshot)
                  {
                    if (snapshot.exists())
                    {
                      //console.log(userItem.id);
                      howManyPartHaveData +=1;
                    }
                  });

                  var newMoodRef = dbRef.child("mood_data/"+userItem.id);
                  newMoodRef.once('value', function(newMoodSnap) //ler dados do user userKey
                  {         
                    newMoodSnap.forEach(function(newMoodChild)
                    {
                      var keyToRead = newMoodChild.key;
                      if (keyToRead != "green" && keyToRead != "yellow" && keyToRead != "red")
                      {
                        //console.log("KEY: "+newMoodChild.key+", VAL: "+ newMoodChild.val());

                        var keyToReadObj = {
                          user: userItem.id,
                          val: newMoodChild.val()
                        };

                        keyToReadList.push(keyToReadObj);
                      //--> end if keyToRead  
                      }

                    //--> end newMoodSnap.forEach
                    });

                    //console.log(keyToReadList);

                    keyToReadList.forEach(function(keyItem)
                    {
                      var u = keyItem.user;

                      var time = keyItem.val.time;
                      var mood = keyItem.val.mood;
                      var date = keyItem.val.date;

                      //console.log(u+": "+date+", "+time+": "+mood);

                      //mood_data/user/key/context
                      var location = keyItem.val.context.location;
                      
                      //mood_data/user/key/context/weather
                      var temperature = keyItem.val.context.weather.temperature;
                      var description = keyItem.val.context.weather.description;

                      //mood_data/user/key/context/health
                      var bpm = keyItem.val.context.health.bpm;
                      var steps = keyItem.val.context.health.steps;

                      //mood_data/user/key/context/health/sleep
                      var sleep_duration = keyItem.val.context.health.sleep.duration;
                      var sleep_end = keyItem.val.context.health.sleep.end;
                      var sleep_start = keyItem.val.context.health.sleep.start;

                      //mood_data/user/key/feedback
                      var feeling = keyItem.val.feedback.feeling;
                      var note = keyItem.val.feedback.note;

                      //-- personalize data to human read
                      var dateFull = date+" "+time+"h";

                      var moodToText;
                      if (mood == "green") moodToText = greenToText;
                      else if (mood == "yellow") moodToText = yellowToText;
                      else if (mood == "red") moodToText = redToText;

                      var city;
                      var country;
                      if (location == "null")
                      {
                        city = locationErr;
                        country = locationErr;
                      }
                      else
                      {
                        var newLocation = location.split(",");
                        city = newLocation[0];
                        country = newLocation[1].trim();
                      }

                      var newTemperature;
                      if (temperature == "null") newTemperature = temperatureErr;
                      else newTemperature = temperature.slice(0, -1);

                      var bpmToText;
                      if (bpm == "null") bpmToText = bpmErr;
                      else bpmToText = parseInt(bpm); 

                      var stepsToText;
                      if (steps == "null") stepsToText = stepsErr;
                      else stepsToText = parseInt(steps);

                      var sleepStartToText;
                      var sleepEndToText;
                      var sleepDurationToText;
                      if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                      {
                        sleepStartToText = sleepErr;
                        sleepEndToText = sleepErr;
                        sleepDurationToText = sleepErr;
                      }
                      else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                      {
                        sleepStartToText = sleep_start;
                        sleepEndToText = sleep_end;
                        var newDuration = sleep_duration.split(" ");
                        //console.log(newDuration);

                        var newDurationHours = newDuration[0].slice(0, -2);
                        //console.log("hours: "+newDurationHours);
                        var newDurationMinutes = newDuration[1].slice(0, -2);
                        //console.log("minutes: "+newDurationMinutes);
                        
                        if (newDurationMinutes.length == 1)
                        {
                          newDurationMinutes = "0"+newDurationMinutes;
                        }

                        if (newDurationHours.length == 1)
                        {
                          newDurationHours = "0"+newDurationHours;
                        }

                        sleepDurationToText = newDurationHours+":"+newDurationMinutes;
                        //console.log(sleepDurationToText);
                      }

                      var feelingToText;
                      if (feeling == "null") feelingToText = feelingErr;
                      /*else
                      {
                        const lower = feeling;
                        const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                        feelingToText = upper;
                      }*/
                      else if (feeling == "up") feelingToText = upToText;
                      else if (feeling == "down") feelingToText = downToText;
                      else if (feeling == "uncertain") feelingToText = uncertainToText;

                      var noteToText;
                      if (note == "null") noteToText = noteErr;
                      else
                      {
                        const lower = note;
                        const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                        noteToText = upper;
                      }

                      var moodObj = {
                        user: keyItem.user,
                        date: date,
                        time: time,
                        mood: moodToText,
                        city: city,
                        country: country,
                        temperature: newTemperature,
                        description: description,
                        bpm: bpmToText,
                        steps: stepsToText,
                        sleepStart: sleepStartToText,
                        sleepEnd: sleepEndToText,
                        sleepDuration: sleepDurationToText,
                        feeling: feelingToText,
                        note: noteToText
                      };

                      moodList.push(moodObj);

                    /* end keyToReadList.forEach */
                    });
                    
                    $(participantTable).append(
                      '<tr>' +
                        '<td>' + userItem.name    + '</td>' +
                        '<td>' + userItem.email   + '</td>' +
                        '<td>' + userItem.dnasc   + '</td>' +
                        '<td>' + userItem.gender  + '</td>' +
                        '<td>' + userItem.reg     + '</td>' +
                      '</tr>'
                    );

                    var tableID = "export_"+userItem.id;
                    createTable(tableID); //1 tabela por user
                    var myTable = document.getElementById(tableID);
                    countPart += 1;

                    $(myTable).append(
                      '<tr>'+
                        '<th>Date</th>'+
                        '<th>Time</th>'+
                        '<th>Mood</th>'+
                        '<th>City</th>'+
                        '<th>Country</th>'+
                        '<th>Temperature (celsius)</th>'+
                        '<th>BPM</th>'+
                        '<th>Steps</th>'+
                        '<th>Start sleep session </th>'+
                        '<th>End sleep session end</th>'+
                        '<th>Duration sleep session</th>'+
                        '<th>Feeling</th>'+
                        '<th>Note</th>'+
                      '</tr>'
                    );

                    //console.log(myTable);

                    moodList.forEach(function(moodItem)
                    {
                      if (moodItem.user == userItem.id)
                      {
                        var tableID = "export_"+moodItem.user;
                        var table = document.getElementById(tableID);

                        $(table).append(
                          '<tr>' +
                            '<td>' + moodItem.date + '</td>' +
                            '<td>' + moodItem.time + '</td>' +
                            '<td>' + moodItem.mood + '</td>' +
                            '<td>' + moodItem.city + '</td>' +
                            '<td>' + moodItem.country + '</td>' +
                            '<td>' + moodItem.temperature + '</td>' +
                            '<td>' + moodItem.bpm + '</td>' +
                            '<td>' + moodItem.steps + '</td>' +
                            '<td>' + moodItem.sleepStart + '</td>' +
                            '<td>' + moodItem.sleepEnd + '</td>' +
                            '<td>' + moodItem.sleepDuration + '</td>' +
                            '<td>' + moodItem.feeling + '</td>' +
                            '<td>' + moodItem.note + '</td>' +
                          '</tr>'
                        );

                        if (arrTableId.id != moodItem.user)
                        {
                          //console.log("here");
                          var obj = {
                            name: userItem.name,
                            id: moodItem.user
                          };
                          //arrTableId.push(moodItem.user);
                          arrTableId.push(obj);
                        }

                      }

                    /* end moodList.forEach */
                    });

                    //console.log(myTable);
                    //console.log("name = "+userItem.name);
                    //console.log(arrTableId);
                    //console.log(countPart+" = "+studyItem.participants.length+" ? ");

                    tableArr.push(myTable);
                    var sheet = userItem.name + ' data';
                    sheetArr.push(sheet);
                    
                    if (countPart == studyItem.participants.length)
                    {
                      /*
                      $(studyTable).append(
                        '<tr>'+
                          '<th>Title</th>'+
                          '<th>Location</th>'+
                          '<th>Secret code</th>'+
                          '<th>State</th>'+
                          '<th>Start date</th>'+
                          '<th>End date</th>'+
                          '<th>Number pending checkin</th>'+
                          '<th>Number participants</th>'+
                        '</tr>'
                      );

                      $(studyTable).append(
                        '<tr>' +
                          '<td>' + studyItem.title + '</td>' +
                          '<td>' + studyItem.location + '</td>' +
                          '<td>' + studyItem.secretcode + '</td>' +
                          '<td>' + studyItem.state + '</td>' +
                          '<td>' + studyItem.start + '</td>' +
                          '<td>' + studyItem.end + '</td>' +
                          
                          '<td>' + studyItem.pSize + '</td>' +
                          '<td>' + studyItem.aSize + '</td>' +
                        '</tr>'
                      );
                      */
                      
                      exportToExcel(tableArr, sheetArr, filename);
                      removeTables(tableArr);
                      //$(studyTable).parents("tr").remove();
                    }

                  /* end newMoodRef */
                  });

                }

                if (studyItem.approved.includes(userItem.id) == true && studyItem.participants == "")
                {
                  //alert("Pending: "+userItem.name+" in study "+studyItem.title);
                  countApp += 1;

                  $(pendingTable).append(
                    '<tr>' +
                      '<td>' + userItem.name    + '</td>' +
                      '<td>' + userItem.email   + '</td>' +
                      '<td>' + userItem.dnasc   + '</td>' +
                      '<td>' + userItem.gender  + '</td>' +
                      '<td>' + userItem.reg     + '</td>' +
                    '</tr>'
                  );

                  if (countApp == studyItem.approved.length)
                  {
                    /*
                    $(studyTable).append(
                      '<tr>'+
                        '<th>Title</th>'+
                        '<th>Location</th>'+
                        '<th>Secret code</th>'+
                        '<th>State</th>'+
                        '<th>Start date</th>'+
                        '<th>End date</th>'+
                        '<th>Number pending checkin</th>'+
                        '<th>Number participants</th>'+
                      '</tr>'
                    );

                    $(studyTable).append(
                      '<tr>' +
                        '<td>' + studyItem.title + '</td>' +
                        '<td>' + studyItem.location + '</td>' +
                        '<td>' + studyItem.secretcode + '</td>' +
                        '<td>' + studyItem.state + '</td>' +
                        '<td>' + studyItem.start + '</td>' +
                        '<td>' + studyItem.end + '</td>' +
                        
                        '<td>' + studyItem.pSize + '</td>' +
                        '<td>' + studyItem.aSize + '</td>' +
                      '</tr>'
                    );
                    */

                    exportToExcel(tableArr, sheetArr, filename);
                    removeTables(tableArr);
                    //$(studyTable).parents("tr").remove();
                    //console.log(studyTable);
                  }
                }
                else if (studyItem.approved.includes(userItem.id) == true && studyItem.participants != "")
                {
                  $(pendingTable).append(
                    '<tr>' +
                      '<td>' + userItem.name    + '</td>' +
                      '<td>' + userItem.email   + '</td>' +
                      '<td>' + userItem.dnasc   + '</td>' +
                      '<td>' + userItem.gender  + '</td>' +
                      '<td>' + userItem.reg     + '</td>' +
                    '</tr>'
                  );
                }

              });

            /* end usersRef.once*/
            });
          
          /* end else */
          }
        
        /* end studyItem.state == "open" */
        }
        else if (studyItem.state == "closed")
        {
          closedUserList = [];
          closedMoodList = [];

          var parts = studyItem.end.split('/');
          var endDate = new Date(parts[2], parts[1] - 1, parts[0]);

          /* estudo vazio, exporta de imediato */
          if (studyItem.previous == "")
          {
            //console.log("Empty study \'"+studyItem.title+"\'");
            
            /* define export filename */
            filename = studyItem.title + '.xls';

            $(studyTable).append(
              '<tr>'+
                '<th>Title</th>'+
                '<th>Location</th>'+
                '<th>Secret code</th>'+
                '<th>State</th>'+
                '<th>Start date</th>'+
                '<th>End date</th>'+
                '<th>Number participants</th>'+
              '</tr>'
            );

            $(studyTable).append(
              '<tr>' +
                '<td>' + studyItem.title + '</td>' +
                '<td>' + studyItem.location + '</td>' +
                '<td>' + studyItem.secretcode + '</td>' +
                '<td>' + studyItem.state + '</td>' +
                '<td>' + studyItem.start + '</td>' +
                '<td>' + studyItem.end + '</td>' +
                
                '<td>' + studyItem.prevSize + '</td>' +
              '</tr>'
            );

            tableArr.push(studyTable);
            sheetArr.push('Information');

            exportToExcel(tableArr, sheetArr, filename);
            removeTables(tableArr);
            //$(studyTable).parents("tr").remove();
          
          /* end studyItem.previous == "" */
          }
          else
          {
            /* define export filename */
            filename = studyItem.title + '.xls';

            //console.log(studyTable);
            $(studyTable).remove();

            $(studyTable).append(
              '<tr>'+
                '<th>Title</th>'+
                '<th>Location</th>'+
                '<th>Secret code</th>'+
                '<th>State</th>'+
                '<th>Start date</th>'+
                '<th>End date</th>'+
                '<th>Number participants</th>'+
              '</tr>'
            );

            $(studyTable).append(
              '<tr>' +
                '<td>' + studyItem.title + '</td>' +
                '<td>' + studyItem.location + '</td>' +
                '<td>' + studyItem.secretcode + '</td>' +
                '<td>' + studyItem.state + '</td>' +
                '<td>' + studyItem.start + '</td>' +
                '<td>' + studyItem.end + '</td>' +
                
                '<td>' + studyItem.prevSize + '</td>' +
              '</tr>'
            );

            //console.log(studyTable);

            tableArr.push(studyTable);
            sheetArr.push('Information');

            createTable("exportPreviousParticipant");
            var prevParticipantTable = document.getElementById("exportPreviousParticipant");
              
            $(prevParticipantTable).append(
              '<tr>'+
                '<th>Full name</th>'+
                '<th>Email</th>'+
                '<th>Birthday</th>'+
                '<th>Gender</th>'+
                '<th>Date of registry</th>'+
              '</tr>'
            );

            tableArr.push(prevParticipantTable);
            sheetArr.push('Previous participants');

            var usersRef = dbRef.child("personal_data");
            usersRef.once('value', function(userSnap)
            {
              userSnap.forEach(function(userChild)
              {
                var userID = userChild.key;
                var user = userChild.val();

                var fname = user.fname;
                var lname = user.lname;
                var email = user.email;
                var dnasc = user.birthday;
                var gender = user.gender;
                var reg = user.register;

                var displayName = fname + " " + lname;

                var userObj = {
                  id: userID,
                  name: displayName,
                  email: email,
                  dnasc: dnasc,
                  gender: gender,
                  reg: reg
                };

                closedUserList.push(userObj);
              //--> end userSnap
              });

              var keyToReadList = [];

              closedUserList.forEach(function(closedUserItem) //users do estudo
              {
                //alert(userItem.name);
                if (studyItem.previous.includes(closedUserItem.id) == true)
                {
                  //alert("Participant "+userItem.name+" in study "+studyItem.title);
                  /*var moodRef = dbRef.child("mood_data");            
                  moodRef.child(userItem.id).once('value', function(snapshot)
                  {
                    if (snapshot.exists())
                    {
                      //console.log(userItem.id);
                      howManyPartHaveData +=1;
                    }
                  });*/

                  var newMoodRef = dbRef.child("previous_data/"+closedUserItem.id);
                  newMoodRef.once('value', function(newMoodSnap) //ler dados do user userKey
                  {         
                    newMoodSnap.forEach(function(newMoodChild)
                    {
                      var keyToRead = newMoodChild.key;
                      if (keyToRead != "green" && keyToRead != "yellow" && keyToRead != "red")
                      {
                        //console.log("KEY: "+newMoodChild.key+", VAL: "+ newMoodChild.val());

                        var keyToReadObj = {
                          user: closedUserItem.id,
                          val: newMoodChild.val()
                        };

                        keyToReadList.push(keyToReadObj);
                      //--> end if keyToRead  
                      }

                    //--> end newMoodSnap.forEach
                    });

                    //console.log(keyToReadList);

                    keyToReadList.forEach(function(keyItem)
                    {
                      var u = keyItem.user;

                      var time = keyItem.val.time;
                      var mood = keyItem.val.mood;
                      var date = keyItem.val.date;

                      //console.log(u+": "+date+", "+time+": "+mood);

                      //mood_data/user/key/context
                      var location = keyItem.val.context.location;
                      
                      //mood_data/user/key/context/weather
                      var temperature = keyItem.val.context.weather.temperature;
                      var description = keyItem.val.context.weather.description;

                      //mood_data/user/key/context/health
                      var bpm = keyItem.val.context.health.bpm;
                      var steps = keyItem.val.context.health.steps;

                      //mood_data/user/key/context/health/sleep
                      var sleep_duration = keyItem.val.context.health.sleep.duration;
                      var sleep_end = keyItem.val.context.health.sleep.end;
                      var sleep_start = keyItem.val.context.health.sleep.start;

                      //mood_data/user/key/feedback
                      var feeling = keyItem.val.feedback.feeling;
                      var note = keyItem.val.feedback.note;

                      //-- personalize data to human read
                      var dateFull = date+" "+time+"h";

                      var moodToText;
                      if (mood == "green") moodToText = greenToText;
                      else if (mood == "yellow") moodToText = yellowToText;
                      else if (mood == "red") moodToText = redToText;

                      var city;
                      var country;
                      if (location == "null")
                      {
                        city = locationErr;
                        country = locationErr;
                      }
                      else
                      {
                        var newLocation = location.split(",");
                        city = newLocation[0];
                        country = newLocation[1].trim();
                      }

                      var newTemperature;
                      if (temperature == "null") newTemperature = temperatureErr;
                      else newTemperature = temperature.slice(0, -1);

                      var bpmToText;
                      if (bpm == "null") bpmToText = bpmErr;
                      else bpmToText = parseInt(bpm); 

                      var stepsToText;
                      if (steps == "null") stepsToText = stepsErr;
                      else stepsToText = parseInt(steps);

                      var sleepStartToText;
                      var sleepEndToText;
                      var sleepDurationToText;
                      if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                      {
                        sleepStartToText = sleepErr;
                        sleepEndToText = sleepErr;
                        sleepDurationToText = sleepErr;
                      }
                      else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                      {
                        sleepStartToText = sleep_start;
                        sleepEndToText = sleep_end;
                        var newDuration = sleep_duration.split(" ");
                        //console.log(newDuration);

                        var newDurationHours = newDuration[0].slice(0, -2);
                        //console.log("hours: "+newDurationHours);
                        var newDurationMinutes = newDuration[1].slice(0, -2);
                        //console.log("minutes: "+newDurationMinutes);
                        
                        if (newDurationMinutes.length == 1)
                        {
                          newDurationMinutes = "0"+newDurationMinutes;
                        }

                        if (newDurationHours.length == 1)
                        {
                          newDurationHours = "0"+newDurationHours;
                        }

                        sleepDurationToText = newDurationHours+":"+newDurationMinutes;
                        //console.log(sleepDurationToText);
                      }

                      var feelingToText;
                      if (feeling == "null") feelingToText = feelingErr;
                      else if (feeling == "up") feelingToText = upToText;
                      else if (feeling == "down") feelingToText = downToText;
                      else if (feeling == "uncertain") feelingToText = uncertainToText;

                      var noteToText;
                      if (note == "null") noteToText = noteErr;
                      else
                      {
                        const lower = note;
                        const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                        noteToText = upper;
                      }

                      var moodObj = {
                        user: keyItem.user,
                        date: date,
                        time: time,
                        mood: moodToText,
                        city: city,
                        country: country,
                        temperature: newTemperature,
                        description: description,
                        bpm: bpmToText,
                        steps: stepsToText,
                        sleepStart: sleepStartToText,
                        sleepEnd: sleepEndToText,
                        sleepDuration: sleepDurationToText,
                        feeling: feelingToText,
                        note: noteToText
                      };

                      closedMoodList.push(moodObj);

                    /* end keyToReadList.forEach */
                    });
                    
                    $(prevParticipantTable).append(
                      '<tr>' +
                        '<td>' + closedUserItem.name    + '</td>' +
                        '<td>' + closedUserItem.email   + '</td>' +
                        '<td>' + closedUserItem.dnasc   + '</td>' +
                        '<td>' + closedUserItem.gender  + '</td>' +
                        '<td>' + closedUserItem.reg     + '</td>' +
                      '</tr>'
                    );

                    var tabID = "closed_"+closedUserItem.id+"_export";
                    createTable(tabID); //1 tabela por user
                    var myTbl = document.getElementById(tabID);
                    countPrev += 1;

                    $(myTbl).append(
                      '<tr>'+
                        '<th>Date</th>'+
                        '<th>Time</th>'+
                        '<th>Mood</th>'+
                        '<th>City</th>'+
                        '<th>Country</th>'+
                        '<th>Temperature (celsius)</th>'+
                        '<th>BPM</th>'+
                        '<th>Steps</th>'+
                        '<th>Start sleep session </th>'+
                        '<th>End sleep session end</th>'+
                        '<th>Duration sleep session</th>'+
                        '<th>Feeling</th>'+
                        '<th>Note</th>'+
                      '</tr>'
                    );

                    //console.log(myTable);

                    closedMoodList.forEach(function(closedMoodItem)
                    {
                      if (closedMoodItem.user == closedUserItem.id)
                      {
                        var tabID = "closed_"+closedMoodItem.user+"_export";
                        var myTbl = document.getElementById(tabID);

                        var parts = closedMoodItem.date.split('/');
                        var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]); 

                        //se é anterior à data do fecho do estudo
                        //if (convertedDate < endDate) 
                        //{
                          //console.log("mood data " + moodItem.date + " é anterior à data de fecho " + studyEnddate);

                          $(myTbl).append(
                            '<tr>' +
                              '<td>' + closedMoodItem.date + '</td>' +
                              '<td>' + closedMoodItem.time + '</td>' +
                              '<td>' + closedMoodItem.mood + '</td>' +
                              '<td>' + closedMoodItem.city + '</td>' +
                              '<td>' + closedMoodItem.country + '</td>' +
                              '<td>' + closedMoodItem.temperature + '</td>' +
                              '<td>' + closedMoodItem.bpm + '</td>' +
                              '<td>' + closedMoodItem.steps + '</td>' +
                              '<td>' + closedMoodItem.sleepStart + '</td>' +
                              '<td>' + closedMoodItem.sleepEnd + '</td>' +
                              '<td>' + closedMoodItem.sleepDuration + '</td>' +
                              '<td>' + closedMoodItem.feeling + '</td>' +
                              '<td>' + closedMoodItem.note + '</td>' +
                            '</tr>'
                          );
                        //}

                        /*
                        if (arrTableId.id != closedMoodItem.user)
                        {
                          //console.log("here");
                          var obj = {
                            name: closedUserItem.name,
                            id: closedMoodItem.user
                          };
                          //arrTableId.push(moodItem.user);
                          arrTableId.push(obj);
                        }
                        */
                      }

                    /* end closedMoodList.forEach */
                    });

                    //console.log(myTable);
                    //console.log("name = "+userItem.name);
                    //console.log(arrTableId);
                    //console.log(countPart+" = "+studyItem.participants.length+" ? ");

                    tableArr.push(myTbl);
                    var sheet = closedUserItem.name + ' data';
                    sheetArr.push(sheet);
                    
                    if (countPrev == studyItem.previous.length)
                    {
                      exportToExcel(tableArr, sheetArr, filename);
                      removeTables(tableArr);
                      //$(studyTable).parents("tr").remove();
                    }

                  /* end newMoodRef */
                  });

                //--> end if
                }

              /* end userList.forEach */
              });

            /* end usersRef.once */
            });

          /* end studyItem.previous != ""*/
          }
        }
      /* end studyList.forEach */  
      });

    /* end studyRef.once */
    });

  /* end function */
  }

  $("#exportStudyDataBtn").click(
    function ()
    {
      //alert("Do Export this Study Data");
      //console.log(sui);
      exportOneStudy(sui);
      //exportOneStudy("qYkHsviR7FNCI1nCDdaabDjsUFu2");
    });

  function exportOneStudy(studyID)
  {
    //alert(studyID);

    var userList = [];

    var moodList = [];

    //to send to exportToExcel function
    var tableArr = [];
    var sheetArr = [];
    var filename;
    
    createTable("exportStudy"); //tabela do estudo
    
    createTable("exportPending"); //tabela dos pendentes
    
    createTable("exportParticipant"); //tabela dos pendentes
    
    //array contendo ID das tabelas com dados do mood
    var arrTableId = []; 

    var studyChild = 'study_data/' + studyID;
    var studyRef = dbRef.child(studyChild);

    var countPart = 0; //conta se já percorreu os participantes todos
    var countApp = 0; //conta se já percorreu os pendentes todos
    var howManyPartHaveData = 0; //conta quantos participantes têm dados
    var countPrev = 0;
    var howManyPrevHaveData = 0;

    studyRef.once('value', function(studySnap)
    {
      var studyTitle = studySnap.val().title;
      var studyLocation = studySnap.val().location;
      var studyMagicword = studySnap.val().magicword;
      var studyStartdate = studySnap.val().startdate;
      var studyEnddate = studySnap.val().enddate;
      var studyState = studySnap.val().state;
      var studyParticipants = studySnap.val().participants;
      var studyApproved = studySnap.val().approved;

      var studyPrevious = studySnap.val().previous;

      var stateTmp;

      if (studyState == "open") stateTmp = "- - -";
      else stateTmp = studyEnddate;

      var filteredParticipants = [];
      var pSize = studySnap.val().participants.length;

      if (pSize != 0 && studyParticipants == "")
      {
        pSize = 0;
      }
      else
      {
        studyParticipants.forEach(function(pChild)
        {
          filteredParticipants.push(pChild);
        });
      }

      var filteredApproved = [];
      var aSize = studyApproved.length;

      if (aSize != 0 && studyApproved == "")
      {
        aSize = 0;
      }
      else
      {
        studyApproved.forEach(function(aChild)
        {
          if (!studyParticipants.includes(aChild))
          {
            filteredApproved.push(aChild);
          }
          else
          {
            aSize -= 1;
          }
        });
      }

      var filteredPrevious = [];
      var prevSize = studyPrevious.length;
      
      if (prevSize != 0 && studyPrevious == "")
      {
        prevSize = 0;
      }
      else
      {
        studyPrevious.forEach(function(prevChild)
        {
          filteredPrevious.push(prevChild);
        });
      }

      /* define export filename */
      filename = studyTitle + '.xls';

      if (studyState == "open")
      {
        var studyTable = document.getElementById("exportStudy");
        $(studyTable).append(
          '<tr>'+
            '<th>Title</th>'+
            '<th>Location</th>'+
            '<th>Secret code</th>'+
            '<th>State</th>'+
            '<th>Start date</th>'+
            '<th>End date</th>'+
            '<th>Number pending checkin</th>'+
            '<th>Number participants</th>'+
          '</tr>'
        );

        var pendingTable = document.getElementById("exportPending");
        $(pendingTable).append(
          '<tr>'+
            '<th>Full name</th>'+
            '<th>Email</th>'+
            '<th>Birthday</th>'+
            '<th>Gender</th>'+
            '<th>Date of registry</th>'+
          '</tr>'
        );

        var participantTable = document.getElementById("exportParticipant");
        $(participantTable).append(
          '<tr>'+
            '<th>Full name</th>'+
            '<th>Email</th>'+
            '<th>Birthday</th>'+
            '<th>Gender</th>'+
            '<th>Date of registry</th>'+
          '</tr>'
        );

        $(studyTable).append(
          '<tr>' +
            '<td>' + studyTitle + '</td>' +
            '<td>' + studyLocation + '</td>' +
            '<td>' + studyMagicword + '</td>' +
            '<td>' + studyState + '</td>' +
            '<td>' + studyStartdate + '</td>' +
            '<td>' + stateTmp + '</td>' +
            
            '<td>' + aSize + '</td>' +
            '<td>' + pSize + '</td>' +
          '</tr>'
        );

        tableArr.push(studyTable);
        sheetArr.push('Information');

        if (aSize != 0)
        {
          tableArr.push(pendingTable);
          sheetArr.push('Pending');
        }

        if (pSize != 0)
        {
          tableArr.push(participantTable);
          sheetArr.push('Participants');
        }

        /* estudo vazio, exporta de imediato */
        if (filteredApproved == "" && filteredParticipants == "")
        {
          exportToExcel(tableArr, sheetArr, filename);
          removeTables(tableArr);
        }
        else
        {
          var usersRef = dbRef.child("personal_data");
          usersRef.once('value', function(userSnap)
          {
            userSnap.forEach(function(userChild)
            {
              var userID = userChild.key;
              var user = userChild.val();

              var fname = user.fname;
              var lname = user.lname;
              var email = user.email;
              var dnasc = user.birthday;
              var gender = user.gender;
              var reg = user.register;

              var displayName = fname + " " + lname;

              var userObj = {
                id: userID,
                name: displayName,
                email: email,
                dnasc: dnasc,
                gender: gender,
                reg: reg
              };

              userList.push(userObj);
            //--> end userSnap
            });

            var keyToReadList = [];

            userList.forEach(function(userItem) //users do estudo
            {
              if (filteredParticipants.includes(userItem.id) == true)
              {  
                var newMoodRef = dbRef.child("mood_data/"+userItem.id);
                newMoodRef.once('value', function(newMoodSnap) //ler dados do user userKey
                {         
                  newMoodSnap.forEach(function(newMoodChild)
                  {
                    var keyToRead = newMoodChild.key;
                    if (keyToRead != "green" && keyToRead != "yellow" && keyToRead != "red")
                    {
                      //console.log("KEY: "+newMoodChild.key+", VAL: "+ newMoodChild.val());

                      var keyToReadObj = {
                        user: userItem.id,
                        val: newMoodChild.val()
                      };

                      keyToReadList.push(keyToReadObj);
                    //--> end if keyToRead  
                    }

                  //--> end newMoodSnap.forEach
                  });

                  //console.log(keyToReadList);
                  
                  keyToReadList.forEach(function(keyItem)
                  {
                    //-- get data

                    //mood_data/user/key;
                    var time = keyItem.val.time;
                    var mood = keyItem.val.mood;
                    var date = keyItem.val.date;
                    
                    //mood_data/user/key/context
                    var location = keyItem.val.context.location;
                    
                    //mood_data/user/key/context/weather
                    var temperature = keyItem.val.context.weather.temperature;
                    var description = keyItem.val.context.weather.description;

                    //mood_data/user/key/context/health
                    var bpm = keyItem.val.context.health.bpm;
                    var steps = keyItem.val.context.health.steps;

                    //mood_data/user/key/context/health/sleep
                    var sleep_duration = keyItem.val.context.health.sleep.duration;
                    var sleep_end = keyItem.val.context.health.sleep.end;
                    var sleep_start = keyItem.val.context.health.sleep.start;

                    //mood_data/user/key/feedback
                    var feeling = keyItem.val.feedback.feeling;
                    var note = keyItem.val.feedback.note;

                    //-- personalize data to human read
                    var dateFull = date+" "+time+"h";

                    var moodToText;
                    if (mood == "green") moodToText = greenToText;
                    else if (mood == "yellow") moodToText = yellowToText;
                    else if (mood == "red") moodToText = redToText;

                    var city;
                    var country;
                    if (location == "null")
                    {
                      city = locationErr;
                      country = locationErr;
                    }
                    else
                    {
                      var newLocation = location.split(",");
                      city = newLocation[0];
                      country = newLocation[1].trim();
                    }

                    var newTemperature;
                    if (temperature == "null") newTemperature = temperatureErr;
                    else newTemperature = temperature.slice(0, -1);

                    var bpmToText;
                    if (bpm == "null") bpmToText = bpmErr;
                    else bpmToText = parseInt(bpm); 

                    var stepsToText;
                    if (steps == "null") stepsToText = stepsErr;
                    else stepsToText = parseInt(steps);

                    var sleepStartToText;
                    var sleepEndToText;
                    var sleepDurationToText;
                    if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                    {
                      sleepStartToText = sleepErr;
                      sleepEndToText = sleepErr;
                      sleepDurationToText = sleepErr;
                    }
                    else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                    {
                      sleepStartToText = sleep_start;
                      sleepEndToText = sleep_end;
                      //sleepDurationToText = sleep_duration;

                      /*
                      var start = new Date();
                      var end = new Date()

                      //hh:mm
                      var sTime = sleep_start.split(':');
                      start.setHours(sTime[0], sTime[1], 0, 0);

                      //hh:mm
                      var eTime = sleep_end.split(':');
                      end.setHours(eTime[0], eTime[1], 0, 0);

                      var durationInMilli = end - start; // millisecond

                      let dura = new Date(durationInMilli);
                      let hours = dura.getUTCHours();
                      let minutes = dura.getUTCMinutes();

                      sleepDurationToText = hours+":"+minutes;
                      console.log(sleepDurationToText);
                      */

                      var newDuration = sleep_duration.split(" ");
                      //console.log(newDuration);

                      var newDurationHours = newDuration[0].slice(0, -2);
                      //console.log("hours: "+newDurationHours);
                      var newDurationMinutes = newDuration[1].slice(0, -2);
                      //console.log("minutes: "+newDurationMinutes);

                      //sleepDurationToText = sleep_duration;
                      
                      if (newDurationMinutes.length == 1)
                      {
                        newDurationMinutes = "0"+newDurationMinutes;
                      }

                      if (newDurationHours.length == 1)
                      {
                        newDurationHours = "0"+newDurationHours;
                      }

                      /*if (newDurationHours.length == 1)
                      {
                        sleepDurationToText = "0"+newDurationHours+":"+newDurationMinutes;
                      }
                      else if (newDurationHours.length > 1)
                      {
                        sleepDurationToText = newDurationHours+":"+newDurationMinutes;
                      }*/

                      sleepDurationToText = newDurationHours+":"+newDurationMinutes;
                      //console.log(sleepDurationToText);
                    }

                    var feelingToText;
                    if (feeling == "null") feelingToText = feelingErr;
                    /*else
                    {
                      const lower = feeling;
                      const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                      feelingToText = upper;
                    }*/
                    else if (feeling == "up") feelingToText = upToText;
                    else if (feeling == "down") feelingToText = downToText;
                    else if (feeling == "uncertain") feelingToText = uncertainToText;

                    var noteToText;
                    if (note == "null") noteToText = noteErr;
                    else
                    {
                      const lower = note;
                      const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                      noteToText = upper;
                    }

                    var moodObj = {
                      user: keyItem.user,
                      date: date,
                      time: time,
                      mood: moodToText,
                      city: city,
                      country: country,
                      temperature: newTemperature,
                      description: description,
                      bpm: bpmToText,
                      steps: stepsToText,
                      sleepStart: sleepStartToText,
                      sleepEnd: sleepEndToText,
                      sleepDuration: sleepDurationToText,
                      feeling: feelingToText,
                      note: noteToText
                    };

                    moodList.push(moodObj);
                  //--> end keyToReadList.forEach
                  });
                  
                  $(participantTable).append(
                    '<tr>' +
                      '<td>' + userItem.name    + '</td>' +
                      '<td>' + userItem.email   + '</td>' +
                      '<td>' + userItem.dnasc   + '</td>' +
                      '<td>' + userItem.gender  + '</td>' +
                      '<td>' + userItem.reg     + '</td>' +
                    '</tr>'
                  );

                  var tableID = "export_"+userItem.id;
                  createTable(tableID); //1 tabela por user
                  var myTable = document.getElementById(tableID);
                  countPart += 1;
                  //$(table).hide();

                  $(myTable).append(
                    '<tr>'+
                      '<th>Date</th>'+
                      '<th>Time</th>'+
                      '<th>Mood</th>'+
                      '<th>City</th>'+
                      '<th>Country</th>'+
                      '<th>Temperature (celsius)</th>'+
                      '<th>BPM</th>'+
                      '<th>Steps</th>'+
                      '<th>Start sleep session</th>'+
                      '<th>End sleep session</th>'+
                      '<th>Duration sleep session</th>'+
                      '<th>Feeling</th>'+
                      '<th>Note</th>'+
                    '</tr>'
                  );

                  moodList.forEach(function(moodItem)
                  {
                    if (moodItem.user == userItem.id)
                    {
                      //console.log("userItem id :"+userItem.id);
                      //console.log("mood user: "+ moodItem.user);
                      //console.log("userItem name:"+userItem.name);

                      //console.log("Mood size: "+moodList.length);

                      var tableID = "export_"+moodItem.user;
                      var table = document.getElementById(tableID);

                      $(table).append(
                        '<tr>' +
                          '<td>' + moodItem.date + '</td>' +
                          '<td>' + moodItem.time + '</td>' +
                          '<td>' + moodItem.mood + '</td>' +
                          '<td>' + moodItem.city + '</td>' +
                          '<td>' + moodItem.country + '</td>' +
                          '<td>' + moodItem.temperature + '</td>' +
                          '<td>' + moodItem.bpm + '</td>' +
                          '<td>' + moodItem.steps + '</td>' +
                          '<td>' + moodItem.sleepStart + '</td>' +
                          '<td>' + moodItem.sleepEnd + '</td>' +
                          '<td>' + moodItem.sleepDuration + '</td>' +
                          '<td>' + moodItem.feeling + '</td>' +
                          '<td>' + moodItem.note + '</td>' +
                        '</tr>'
                      );

                      /*
                      if (arrTableId.includes(moodItem.user) == false)
                      {
                        arrTableId.push(moodItem.user);
                      }
                      */
          
                      if (arrTableId.id != moodItem.user)
                      {
                        //console.log("here");
                        var obj = {
                          name: userItem.name,
                          id: moodItem.user
                        };
                        //arrTableId.push(moodItem.user);
                        arrTableId.push(obj);
                      }

                    //--> end if moodItem.user
                    }
                  //--> end moodList.forEach
                  });

                  const filteredArrTableId = arrTableId.reduce((acc, current) => {
                    const x = acc.find(item => item.id === current.id);
                    if (!x) {
                      return acc.concat([current]);
                    } else {
                      return acc;
                    }
                  }, []);

                  //console.log("Size da filteredArrTableId: "+filteredArrTableId.length);
                  //console.log("howManyPartHaveData: "+howManyPartHaveData);
                  //console.log("countPart: "+countPart);

                  filteredArrTableId.forEach(function(idItem)
                  {
                    //console.log("ID: "+idItem.id);
                    //console.log("Nome: "+idItem.name);

                    var tableID = "export_"+idItem.id;

                    //if (filteredArrTableId.length % howManyPartHaveData == 0)
                    if (!tableArr.includes(tableID))
                    { 
                      //console.log("ID: "+idItem.id);
                      //console.log("Nome: "+idItem.name);

                      /*var table = document.getElementById(idItem.id);
                      //tableArr.push(table);*/

                      tableArr.push(tableID);
                      //console.log("tableArr:\n"+tableArr);
                      var sheet = idItem.name + ' data';
                      sheetArr.push(sheet);

                      howManyPartHaveData = howManyPartHaveData + 1;
                      //console.log(howManyPartHaveData);
                    }

                  //--> end arrTableId.forEach
                  });
                  
                  if (countPart == filteredParticipants.length)
                  //if (countPart == howManyPartHaveData)
                  //if (howManyPartHaveData == filteredParticipants.length)
                  {
                    /*tableArr.forEach(function(arrItem)
                    {
                      //-now
                      //console.log("arrItem: "+arrItem );
                      var tbl = document.getElementById(arrItem);
                      if(tbl) console.log(tbl);
                    });*/

                    exportToExcel(tableArr, sheetArr, filename);
                    removeTables(tableArr);
                  }

                  //console.log("Val of countPart: "+countPart);
                  //console.log("filteredParticipants size: "+filteredParticipants.length);
                
                //--> end newMoodRef
                });
              
              //--> end if filteredParticipants.includes(userItem.id)
              }

              //if pendente
              if (filteredApproved.includes(userItem.id) == true && filteredParticipants == "")
              {
                countApp += 1;

                $(pendingTable).append(
                  '<tr>' +
                    '<td>' + userItem.name    + '</td>' +
                    '<td>' + userItem.email   + '</td>' +
                    '<td>' + userItem.dnasc   + '</td>' +
                    '<td>' + userItem.gender  + '</td>' +
                    '<td>' + userItem.reg     + '</td>' +
                  '</tr>'
                );

                if (countApp == filteredApproved.length)
                {
                  exportToExcel(tableArr, sheetArr, filename);
                  removeTables(tableArr);
                }
                
                //console.log("Val of countApp: "+countApp);
                //console.log("filteredApproved size: "+filteredApproved.length);
              //--> end filteredApproved
              }
              else if(filteredApproved.includes(userItem.id) == true && filteredParticipants != "")
              {
                $(pendingTable).append(
                  '<tr>' +
                    '<td>' + userItem.name    + '</td>' +
                    '<td>' + userItem.email   + '</td>' +
                    '<td>' + userItem.dnasc   + '</td>' +
                    '<td>' + userItem.gender  + '</td>' +
                    '<td>' + userItem.reg     + '</td>' +
                  '</tr>'
                );
              }
            
            //--> end userList.forEach
            });
            
          //--> end usersRef
          });
        
        //--> se não está vazio, vai percorrer "tudo"  
        }
      /* end if studyState == open */
      }
      else if (studyState == "closed")
      {
        var parts = studyEnddate.split('/');
        var endDate = new Date(parts[2], parts[1] - 1, parts[0]);

        var studyTable = document.getElementById("exportStudy");
        $(studyTable).append(
          '<tr>'+
            '<th>Title</th>'+
            '<th>Location</th>'+
            '<th>Secret code</th>'+
            '<th>State</th>'+
            '<th>Start date</th>'+
            '<th>End date</th>'+
            '<th>Number participants</th>'+
          '</tr>'
        );

        $(studyTable).append(
          '<tr>' +
            '<td>' + studyTitle + '</td>' +
            '<td>' + studyLocation + '</td>' +
            '<td>' + studyMagicword + '</td>' +
            '<td>' + studyState + '</td>' +
            '<td>' + studyStartdate + '</td>' +
            '<td>' + stateTmp + '</td>' +
            
            '<td>' + prevSize + '</td>' +
          '</tr>'
        );

        tableArr.push(studyTable);
        sheetArr.push('Information');

        var participantTable = document.getElementById("exportParticipant");
        $(participantTable).append(
          '<tr>'+
            '<th>Full name</th>'+
            '<th>Email</th>'+
            '<th>Birthday</th>'+
            '<th>Gender</th>'+
            '<th>Date of registry</th>'+
          '</tr>'
        );

        if (prevSize != 0)
        {
          tableArr.push(participantTable);
          sheetArr.push('Participants');
        }

        /* estudo vazio, exporta de imediato */
        if (filteredPrevious == "")
        {
          exportToExcel(tableArr, sheetArr, filename);
          removeTables(tableArr);
        }
        else
        {
          var usersRef = dbRef.child("personal_data");
          usersRef.once('value', function(userSnap)
          {
            userSnap.forEach(function(userChild)
            {
              var userID = userChild.key;
              var user = userChild.val();

              var fname = user.fname;
              var lname = user.lname;
              var email = user.email;
              var dnasc = user.birthday;
              var gender = user.gender;
              var reg = user.register;

              var displayName = fname + " " + lname;

              var userObj = {
                id: userID,
                name: displayName,
                email: email,
                dnasc: dnasc,
                gender: gender,
                reg: reg
              };

              userList.push(userObj);
            //--> end userSnap
            });

            var keyToReadList = [];

            userList.forEach(function(userItem) //users do estudo
            {
              if (filteredPrevious.includes(userItem.id) == true)
              {  
                var newMoodRef = dbRef.child("previous_data/"+userItem.id);
                newMoodRef.once('value', function(newMoodSnap) //ler dados do user userKey
                {         
                  newMoodSnap.forEach(function(newMoodChild)
                  {
                    var keyToRead = newMoodChild.key;
                    if (keyToRead != "green" && keyToRead != "yellow" && keyToRead != "red")
                    {
                      //console.log("KEY: "+newMoodChild.key+", VAL: "+ newMoodChild.val());

                      var keyToReadObj = {
                        user: userItem.id,
                        val: newMoodChild.val()
                      };

                      keyToReadList.push(keyToReadObj);
                    //--> end if keyToRead  
                    }

                  //--> end newMoodSnap.forEach
                  });

                  //console.log(keyToReadList);
                  
                  keyToReadList.forEach(function(keyItem)
                  {
                    //-- get data

                    //mood_data/user/key;
                    var time = keyItem.val.time;
                    var mood = keyItem.val.mood;
                    var date = keyItem.val.date;
                    
                    //mood_data/user/key/context
                    var location = keyItem.val.context.location;
                    
                    //mood_data/user/key/context/weather
                    var temperature = keyItem.val.context.weather.temperature;
                    var description = keyItem.val.context.weather.description;

                    //mood_data/user/key/context/health
                    var bpm = keyItem.val.context.health.bpm;
                    var steps = keyItem.val.context.health.steps;

                    //mood_data/user/key/context/health/sleep
                    var sleep_duration = keyItem.val.context.health.sleep.duration;
                    var sleep_end = keyItem.val.context.health.sleep.end;
                    var sleep_start = keyItem.val.context.health.sleep.start;

                    //mood_data/user/key/feedback
                    var feeling = keyItem.val.feedback.feeling;
                    var note = keyItem.val.feedback.note;

                    //-- personalize data to human read
                    var dateFull = date+" "+time+"h";

                    var moodToText;
                    if (mood == "green") moodToText = greenToText;
                    else if (mood == "yellow") moodToText = yellowToText;
                    else if (mood == "red") moodToText = redToText;

                    var city;
                    var country;
                    if (location == "null")
                    {
                      city = locationErr;
                      country = locationErr;
                    }
                    else
                    {
                      var newLocation = location.split(",");
                      city = newLocation[0];
                      country = newLocation[1].trim();
                    }

                    var newTemperature;
                    if (temperature == "null") newTemperature = temperatureErr;
                    else newTemperature = temperature.slice(0, -1);

                    var bpmToText;
                    if (bpm == "null") bpmToText = bpmErr;
                    else bpmToText = parseInt(bpm); 

                    var stepsToText;
                    if (steps == "null") stepsToText = stepsErr;
                    else stepsToText = parseInt(steps);

                    var sleepStartToText;
                    var sleepEndToText;
                    var sleepDurationToText;
                    if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                    {
                      sleepStartToText = sleepErr;
                      sleepEndToText = sleepErr;
                      sleepDurationToText = sleepErr;
                    }
                    else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                    {
                      sleepStartToText = sleep_start;
                      sleepEndToText = sleep_end;
                      //sleepDurationToText = sleep_duration;

                      var newDuration = sleep_duration.split(" ");
                      console.log(newDuration);

                      var newDurationHours = newDuration[0].slice(0, -2);
                      //console.log("hours: "+newDurationHours);
                      var newDurationMinutes = newDuration[1].slice(0, -2);
                      //console.log("minutes: "+newDurationMinutes);

                      //sleepDurationToText = sleep_duration;
                      
                      if (newDurationMinutes.length == 1)
                      {
                        newDurationMinutes = "0"+newDurationMinutes;
                      }

                      if (newDurationHours.length == 1)
                      {
                        newDurationHours = "0"+newDurationHours;
                      }

                      /*if (newDurationHours.length == 1)
                      {
                        sleepDurationToText = "0"+newDurationHours+":"+newDurationMinutes;
                      }
                      else if (newDurationHours.length > 1)
                      {
                        sleepDurationToText = newDurationHours+":"+newDurationMinutes;
                      }*/

                      sleepDurationToText = newDurationHours+":"+newDurationMinutes;
                      //console.log(sleepDurationToText);
                    }

                    var feelingToText;
                    if (feeling == "null") feelingToText = feelingErr;
                    else if (feeling == "up") feelingToText = upToText;
                    else if (feeling == "down") feelingToText = downToText;
                    else if (feeling == "uncertain") feelingToText = uncertainToText;

                    var noteToText;
                    if (note == "null") noteToText = noteErr;
                    else
                    {
                      const lower = note;
                      const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                      noteToText = upper;
                    }

                    var moodObj = {
                      user: keyItem.user,
                      date: date,
                      time: time,
                      mood: moodToText,
                      city: city,
                      country: country,
                      temperature: newTemperature,
                      description: description,
                      bpm: bpmToText,
                      steps: stepsToText,
                      sleepStart: sleepStartToText,
                      sleepEnd: sleepEndToText,
                      sleepDuration: sleepDurationToText,
                      feeling: feelingToText,
                      note: noteToText
                    };

                    moodList.push(moodObj);
                  //--> end keyToReadList.forEach
                  });
                  
                  $(participantTable).append(
                    '<tr>' +
                      '<td>' + userItem.name    + '</td>' +
                      '<td>' + userItem.email   + '</td>' +
                      '<td>' + userItem.dnasc   + '</td>' +
                      '<td>' + userItem.gender  + '</td>' +
                      '<td>' + userItem.reg     + '</td>' +
                    '</tr>'
                  );

                  var tableID = "export_"+userItem.id;
                  createTable(tableID); //1 tabela por user
                  var myTable = document.getElementById(tableID);
                  countPrev += 1;
                  //$(table).hide();

                  $(myTable).append(
                    '<tr>'+
                      '<th>Date</th>'+
                      '<th>Time</th>'+
                      '<th>Mood</th>'+
                      '<th>City</th>'+
                      '<th>Country</th>'+
                      '<th>Temperature (celsius)</th>'+
                      '<th>BPM</th>'+
                      '<th>Steps</th>'+
                      '<th>Start sleep session</th>'+
                      '<th>End sleep session</th>'+
                      '<th>Duration sleep session</th>'+
                      '<th>Feeling</th>'+
                      '<th>Note</th>'+
                    '</tr>'
                  );

                  moodList.forEach(function(moodItem)
                  {
                    if (moodItem.user == userItem.id)
                    {
                      //console.log("userItem id :"+userItem.id);
                      //console.log("mood user: "+ moodItem.user);
                      //console.log("userItem name:"+userItem.name);

                      //console.log("Mood size: "+moodList.length);

                      var tableID = "export_"+moodItem.user;
                      var table = document.getElementById(tableID);

                      var parts = moodItem.date.split('/');
                      var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]); 

                      //se é anterior à data do fecho do estudo
                      //if (convertedDate < endDate) 
                      //{
                        //console.log("mood data " + moodItem.date + " é anterior à data de fecho " + studyEnddate);

                        $(table).append(
                          '<tr>' +
                            '<td>' + moodItem.date + '</td>' +
                            '<td>' + moodItem.time + '</td>' +
                            '<td>' + moodItem.mood + '</td>' +
                            '<td>' + moodItem.city + '</td>' +
                            '<td>' + moodItem.country + '</td>' +
                            '<td>' + moodItem.temperature + '</td>' +
                            '<td>' + moodItem.bpm + '</td>' +
                            '<td>' + moodItem.steps + '</td>' +
                            '<td>' + moodItem.sleepStart + '</td>' +
                            '<td>' + moodItem.sleepEnd + '</td>' +
                            '<td>' + moodItem.sleepDuration + '</td>' +
                            '<td>' + moodItem.feeling + '</td>' +
                            '<td>' + moodItem.note + '</td>' +
                          '</tr>'
                        );
                      //}

                      /*
                      if (arrTableId.includes(moodItem.user) == false)
                      {
                        arrTableId.push(moodItem.user);
                      }
                      */
          
                      if (arrTableId.id != moodItem.user)
                      {
                        //console.log("here");
                        var obj = {
                          name: userItem.name,
                          id: moodItem.user
                        };
                        //arrTableId.push(moodItem.user);
                        arrTableId.push(obj);
                      }

                    //--> end if moodItem.user
                    }
                  //--> end moodList.forEach
                  });

                  const filteredArrTableId = arrTableId.reduce((acc, current) => {
                    const x = acc.find(item => item.id === current.id);
                    if (!x) {
                      return acc.concat([current]);
                    } else {
                      return acc;
                    }
                  }, []);

                  //console.log("Size da filteredArrTableId: "+filteredArrTableId.length);
                  filteredArrTableId.forEach(function(idItem)
                  {
                    //console.log("ID: "+idItem.id);
                    //console.log("Nome: "+idItem.name);

                    var tableID = "export_"+idItem.id;

                    //if (filteredArrTableId.length % howManyPartHaveData == 0)
                    if (!tableArr.includes(tableID))
                    { 
                      //console.log("ID: "+idItem.id);
                      //console.log("Nome: "+idItem.name);

                      /*var table = document.getElementById(idItem.id);
                      //tableArr.push(table);*/

                      tableArr.push(tableID);
                      console.log("tableArr:\n"+tableArr);
                      var sheet = idItem.name + ' data';
                      sheetArr.push(sheet);

                      howManyPrevHaveData = howManyPrevHaveData + 1;
                      console.log("howManyPrevHaveData: "+howManyPrevHaveData);
                    }

                  //--> end arrTableId.forEach
                  });
                  
                  if (countPrev == filteredPrevious.length)
                  //if (countPart == howManyPartHaveData)
                  //if (howManyPartHaveData == filteredParticipants.length)
                  {
                    /*tableArr.forEach(function(arrItem)
                    {
                      //-now
                      //console.log("arrItem: "+arrItem );
                      var tbl = document.getElementById(arrItem);
                      if(tbl) console.log(tbl);
                    });*/

                    exportToExcel(tableArr, sheetArr, filename);
                    removeTables(tableArr);
                  }

                  //console.log("Val of countPart: "+countPart);
                  //console.log("filteredParticipants size: "+filteredParticipants.length);
                
                //--> end newMoodRef
                });
              
              //--> end if filteredParticipants.includes(userItem.id)
              }

            });//--> end 

          //--> end usersRef.once
          });
        
        //--> end else filteredPrevious
        }
      }

    //--> end studyRef
    });

    //$("#exportStudy").show();
    //$("#exportPending").show();
    //$("#exportParticipant").show();
    //$("#exportData").show();  

    //alert("here");
  //--> end function 
  }

  function removeTables(arr)
  {
    arr.forEach(function(arrItem)
    {
      //-now
      //console.log("arrItem: "+arrItem.id );
      var tbl = document.getElementById(arrItem.id);
      if(tbl) tbl.parentNode.removeChild(tbl);
    });
  }

  function createTable(id) //id do user
  {
    var tlb = document.createElement("table");
    tlb.setAttribute("id", id);
    tlb.setAttribute("border", 2);
    tlb.setAttribute("style", "display: none");
    document.body.appendChild(tlb);

    /*
    var studyTable = document.getElementById("exportStudy");
    tlb.insertAdjacentElement("afterend", studyTable);
    */
  }

  //function exportToExcel(tableArr, sheetArr, filename)
  function exportToExcel(tables, wsnames, wbname)
  {
    var appname = 'Excel';
    //var tablesToExcel = (function()
    //{
      var uri = 'data:application/vnd.ms-excel;base64,'
      , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
        + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
        + '<Styles>'
        + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
        + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
        + '</Styles>' 
        + '{worksheets}</Workbook>'
      , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
      , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
      , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
      
      //return function(tables, wsnames, wbname, appname)
      //{
        var ctx = "";
        var workbookXML = "";
        var worksheetsXML = "";
        var rowsXML = "";

        for (var i = 0; i < tables.length; i++)
        {
          if (!tables[i].nodeType)
          {
            tables[i] = document.getElementById(tables[i]);
          }
          
          //console.log("tamanho: "+tables[i].rows.length);
          
          for (var j = 0; j < tables[i].rows.length; j++)
          {
            rowsXML += '<Row>'
            
            for (var k = 0; k < tables[i].rows[j].cells.length; k++)
            {
              var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
              
              var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
              
              var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
              dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
              
              var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
              dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
              
              ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':''
                     , nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String'
                     , data: (dataFormula)?'':dataValue
                     , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
                    };
              rowsXML += format(tmplCellXML, ctx);
            }

            rowsXML += '</Row>'
          }

          ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
          
          worksheetsXML += format(tmplWorksheetXML, ctx);
          
          rowsXML = "";
        }

        ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
        workbookXML = format(tmplWorkbookXML, ctx);

        //console.log(workbookXML);

        var link = document.createElement("a");
        link.href = uri + base64(workbookXML);
        link.download = wbname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      //}
    //})();

    //tablesToExcel(tableArr, sheetArr, filename, 'Excel');
  }

  $("#exportUserStudyDataBtn").click(
    function ()
    {
      //alert("Export this User Data");

      //var p = "ZMguIqYkHsbDjsUNCI1nGGKq4Au1";
      //exportParticipant(p);

      //sui_state = state;
      //sui_end = enddate;

      exportParticipant(uui, sui_state, sui_end);
    });

  function exportParticipant(userID, studyState, studyEnd)
  {
    createTable("exportParticipant"); //tabela com dados pessoais
    var participantTable = document.getElementById("exportParticipant");
    //$(participantTable).hide();

    var endDate;
    if (studyState == "closed")
    {
      var parts = studyEnd.split('/');
      endDate = new Date(parts[2], parts[1] - 1, parts[0]);
    }

    $(participantTable).append(
      '<tr>'+
        '<th>Full name</th>'+
        '<th>Email</th>'+
        '<th>Birthday</th>'+
        '<th>Gender</th>'+
        '<th>Date of registry</th>'+
      '</tr>'
    );

    createTable("exportData"); //tabela com dados pessoais
    var dataTable = document.getElementById("exportData");
    
    $(dataTable).append(
      '<tr>'+
        '<th>Date</th>'+
        '<th>Time</th>'+
        '<th>Mood</th>'+
        '<th>City</th>'+
        '<th>Country</th>'+
        '<th>Temperature (celsius)</th>'+
        '<th>BPM</th>'+
        '<th>Steps</th>'+
        '<th>Start sleep session</th>'+
        '<th>End sleep session</th>'+
        '<th>Duration sleep session</th>'+
        '<th>Feeling</th>'+
        '<th>Note</th>'+
      '</tr>'
    );

    var keyToReadList = [];
    var moodList = [];

    //to send to exportToExcel function
    var tableArr = [];
    var sheetArr = [];
    var filename;

    var userChild = 'personal_data/' + userID;
    var userRef = dbRef.child(userChild);

    userRef.once('value', function(userSnap)
    {
      //var userID = userSnap.key;
      var user = userSnap.val();

      var fname = user.fname;
      var lname = user.lname;
      var email = user.email;
      var dnasc = user.birthday;
      var gender = user.gender;
      var reg = user.register;

      var displayName = fname + " " + lname;
      
      filename = fname+lname+'.xls';
      //console.log(displayName);
      
      $(participantTable).append(
        '<tr>' +
          '<td>' + displayName    + '</td>' +
          '<td>' + email   + '</td>' +
          '<td>' + dnasc   + '</td>' +
          '<td>' + gender  + '</td>' +
          '<td>' + reg     + '</td>' +
        '</tr>'
      );

      tableArr.push(participantTable);
      sheetArr.push('Personal data'); 

      if (studyState == "open")
      {

      var newMoodRef = dbRef.child("mood_data/"+userID);
      newMoodRef.once('value', function(newMoodSnap) //ler dados do user userKey
      {         
        newMoodSnap.forEach(function(newMoodChild)
        {
          var keyToRead = newMoodChild.key;
          if (keyToRead != "green" && keyToRead != "yellow" && keyToRead != "red")
          {
            //console.log(JSON.stringify(newMoodChild.val()));

            keyToReadList.push(newMoodChild.val());
          //--> end keyToRead  
          }
        //--> end newMoodSnap.forEach
        });

        keyToReadList.forEach(function(keyItem)
        {
          //-- get data

          //mood_data/user/key;
          var time = keyItem.time;
          var mood = keyItem.mood;
          var date = keyItem.date;
          
          //mood_data/user/key/context
          var location = keyItem.context.location;
          
          //mood_data/user/key/context/weather
          var temperature = keyItem.context.weather.temperature;
          var description = keyItem.context.weather.description;

          //mood_data/user/key/context/health
          var bpm = keyItem.context.health.bpm;
          var steps = keyItem.context.health.steps;

          //mood_data/user/key/context/health/sleep
          var sleep_duration = keyItem.context.health.sleep.duration;
          var sleep_end = keyItem.context.health.sleep.end;
          var sleep_start = keyItem.context.health.sleep.start;

          //mood_data/user/key/feedback
          var feeling = keyItem.feedback.feeling;
          var note = keyItem.feedback.note;

          //-- personalize data to human read
          var dateFull = date+" "+time+"h";

          var moodToText;
          if (mood == "green") moodToText = greenToText;
          else if (mood == "yellow") moodToText = yellowToText;
          else if (mood == "red") moodToText = redToText;

          var city;
          var country;
          if (location == "null")
          {
            city = locationErr;
            country = locationErr;
          }
          else
          {
            var newLocation = location.split(",");
            city = newLocation[0];
            country = newLocation[1].trim();
          }

          var newTemperature;
          if (temperature == "null") newTemperature = temperatureErr;
          else newTemperature = temperature.slice(0, -1);

          var bpmToText;
          if (bpm == "null") bpmToText = bpmErr;
          else bpmToText = parseInt(bpm); 

          var stepsToText;
          if (steps == "null") stepsToText = stepsErr;
          else stepsToText = parseInt(steps);

          var sleepStartToText;
          var sleepEndToText;
          var sleepDurationToText;
          if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
          {
            sleepStartToText = sleepErr;
            sleepEndToText = sleepErr;
            sleepDurationToText = sleepErr;
          }
          else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
          {
            sleepStartToText = sleep_start;
            sleepEndToText = sleep_end;
            //sleepDurationToText = sleep_duration;

            var newDuration = sleep_duration.split(" ");
            //console.log(newDuration);

            var newDurationHours = newDuration[0].slice(0, -2);
            //console.log("hours: "+newDurationHours);
            var newDurationMinutes = newDuration[1].slice(0, -2);
            //console.log("minutes: "+newDurationMinutes);
            
            if (newDurationMinutes.length == 1)
            {
              newDurationMinutes = "0"+newDurationMinutes;
            }

            if (newDurationHours.length == 1)
            {
              newDurationHours = "0"+newDurationHours;
            }

            sleepDurationToText = newDurationHours+":"+newDurationMinutes;
            //console.log(sleepDurationToText);
          }

          var feelingToText;
          if (feeling == "null") feelingToText = feelingErr;
          /*else
          {
            const lower = feeling;
            const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

            feelingToText = upper;
          }*/
          else if (feeling == "up") feelingToText = upToText;
          else if (feeling == "down") feelingToText = downToText;
          else if (feeling == "uncertain") feelingToText = uncertainToText;

          var noteToText;
          if (note == "null") noteToText = noteErr;
          else
          {
            const lower = note;
            const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

            noteToText = upper;
          }

          var moodObj = {
            date: date,
            time: time,
            mood: moodToText,
            city: city,
            country: country,
            temperature: newTemperature,
            description: description,
            bpm: bpmToText,
            steps: stepsToText,
            sleepStart: sleepStartToText,
            sleepEnd: sleepEndToText,
            sleepDuration: sleepDurationToText,
            feeling: feelingToText,
            note: noteToText
          };

          moodList.push(moodObj);
        //--> end keyToReadList.forEach
        });

        moodList.forEach(function(moodItem)
        {
          //console.log(moodItem.date+", "+moodItem.time+": "+moodItem.mood);

          /*if (studyState == "closed")
          {
            var parts = moodItem.date.split('/');
            var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

            //se é anterior à data do fecho do estudo
            if (convertedDate < endDate) 
            {
              $(dataTable).append(
                '<tr>' +
                  '<td>' + moodItem.date + '</td>' +
                  '<td>' + moodItem.time + '</td>' +
                  '<td>' + moodItem.mood + '</td>' +
                  '<td>' + moodItem.city + '</td>' +
                  '<td>' + moodItem.country + '</td>' +
                  '<td>' + moodItem.temperature + '</td>' +
                  '<td>' + moodItem.bpm + '</td>' +
                  '<td>' + moodItem.steps + '</td>' +
                  '<td>' + moodItem.sleepStart + '</td>' +
                  '<td>' + moodItem.sleepEnd + '</td>' +
                  '<td>' + moodItem.sleepDuration + '</td>' +
                  '<td>' + moodItem.feeling + '</td>' +
                  '<td>' + moodItem.note + '</td>' +
                '</tr>'
              );
            }

          }*/
          //else if(studyState == "open")
          //{
            $(dataTable).append(
              '<tr>' +
                '<td>' + moodItem.date + '</td>' +
                '<td>' + moodItem.time + '</td>' +
                '<td>' + moodItem.mood + '</td>' +
                '<td>' + moodItem.city + '</td>' +
                '<td>' + moodItem.country + '</td>' +
                '<td>' + moodItem.temperature + '</td>' +
                '<td>' + moodItem.bpm + '</td>' +
                '<td>' + moodItem.steps + '</td>' +
                '<td>' + moodItem.sleepStart + '</td>' +
                '<td>' + moodItem.sleepEnd + '</td>' +
                '<td>' + moodItem.sleepDuration + '</td>' +
                '<td>' + moodItem.feeling + '</td>' +
                '<td>' + moodItem.note + '</td>' +
              '</tr>'
            );
          //}
        //--> end moodList.forEach  
        });

        tableArr.push(dataTable);
        sheetArr.push('Collected data');

        exportToExcel(tableArr, sheetArr, filename);
        removeTables(tableArr);
        
      //--> end newMoodRef 
      });
      }
      else if (studyState == "closed")
      {
        var newMoodRef = dbRef.child("previous_data/"+userID);
        newMoodRef.once('value', function(newMoodSnap) //ler dados do user userKey
        {         
          newMoodSnap.forEach(function(newMoodChild)
          {
            var keyToRead = newMoodChild.key;
            if (keyToRead != "green" && keyToRead != "yellow" && keyToRead != "red")
            {
              //console.log(JSON.stringify(newMoodChild.val()));

              keyToReadList.push(newMoodChild.val());
            //--> end keyToRead  
            }
          //--> end newMoodSnap.forEach
          });

          keyToReadList.forEach(function(keyItem)
          {
            //-- get data

            //mood_data/user/key;
            var time = keyItem.time;
            var mood = keyItem.mood;
            var date = keyItem.date;
            
            //mood_data/user/key/context
            var location = keyItem.context.location;
            
            //mood_data/user/key/context/weather
            var temperature = keyItem.context.weather.temperature;
            var description = keyItem.context.weather.description;

            //mood_data/user/key/context/health
            var bpm = keyItem.context.health.bpm;
            var steps = keyItem.context.health.steps;

            //mood_data/user/key/context/health/sleep
            var sleep_duration = keyItem.context.health.sleep.duration;
            var sleep_end = keyItem.context.health.sleep.end;
            var sleep_start = keyItem.context.health.sleep.start;

            //mood_data/user/key/feedback
            var feeling = keyItem.feedback.feeling;
            var note = keyItem.feedback.note;

            //-- personalize data to human read
            var dateFull = date+" "+time+"h";

            var moodToText;
            if (mood == "green") moodToText = greenToText;
            else if (mood == "yellow") moodToText = yellowToText;
            else if (mood == "red") moodToText = redToText;

            var city;
            var country;
            if (location == "null")
            {
              city = locationErr;
              country = locationErr;
            }
            else
            {
              var newLocation = location.split(",");
              city = newLocation[0];
              country = newLocation[1].trim();
            }

            var newTemperature;
            if (temperature == "null") newTemperature = temperatureErr;
            else newTemperature = temperature.slice(0, -1);

            var bpmToText;
            if (bpm == "null") bpmToText = bpmErr;
            else bpmToText = parseInt(bpm); 

            var stepsToText;
            if (steps == "null") stepsToText = stepsErr;
            else stepsToText = parseInt(steps);

            var sleepStartToText;
            var sleepEndToText;
            var sleepDurationToText;
            if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
            {
              sleepStartToText = sleepErr;
              sleepEndToText = sleepErr;
              sleepDurationToText = sleepErr;
            }
            else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
            {
              sleepStartToText = sleep_start;
              sleepEndToText = sleep_end;
              //sleepDurationToText = sleep_duration;

              var newDuration = sleep_duration.split(" ");
              //console.log(newDuration);

              var newDurationHours = newDuration[0].slice(0, -2);
              //console.log("hours: "+newDurationHours);
              var newDurationMinutes = newDuration[1].slice(0, -2);
              //console.log("minutes: "+newDurationMinutes);
              
              if (newDurationMinutes.length == 1)
              {
                newDurationMinutes = "0"+newDurationMinutes;
              }

              if (newDurationHours.length == 1)
              {
                newDurationHours = "0"+newDurationHours;
              }

              sleepDurationToText = newDurationHours+":"+newDurationMinutes;
              //console.log(sleepDurationToText);
            }

            var feelingToText;
            if (feeling == "null") feelingToText = feelingErr;
            /*else
            {
              const lower = feeling;
              const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

              feelingToText = upper;
            }*/
            else if (feeling == "up") feelingToText = upToText;
            else if (feeling == "down") feelingToText = downToText;
            else if (feeling == "uncertain") feelingToText = uncertainToText;

            var noteToText;
            if (note == "null") noteToText = noteErr;
            else
            {
              const lower = note;
              const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

              noteToText = upper;
            }

            var moodObj = {
              date: date,
              time: time,
              mood: moodToText,
              city: city,
              country: country,
              temperature: newTemperature,
              description: description,
              bpm: bpmToText,
              steps: stepsToText,
              sleepStart: sleepStartToText,
              sleepEnd: sleepEndToText,
              sleepDuration: sleepDurationToText,
              feeling: feelingToText,
              note: noteToText
            };

            moodList.push(moodObj);
          //--> end keyToReadList.forEach
          });

          moodList.forEach(function(moodItem)
          {
            //console.log(moodItem.date+", "+moodItem.time+": "+moodItem.mood);

            $(dataTable).append(
              '<tr>' +
                '<td>' + moodItem.date + '</td>' +
                '<td>' + moodItem.time + '</td>' +
                '<td>' + moodItem.mood + '</td>' +
                '<td>' + moodItem.city + '</td>' +
                '<td>' + moodItem.country + '</td>' +
                '<td>' + moodItem.temperature + '</td>' +
                '<td>' + moodItem.bpm + '</td>' +
                '<td>' + moodItem.steps + '</td>' +
                '<td>' + moodItem.sleepStart + '</td>' +
                '<td>' + moodItem.sleepEnd + '</td>' +
                '<td>' + moodItem.sleepDuration + '</td>' +
                '<td>' + moodItem.feeling + '</td>' +
                '<td>' + moodItem.note + '</td>' +
              '</tr>'
            );
              
          //--> end moodList.forEach  
          });

          tableArr.push(dataTable);
          sheetArr.push('Collected data');

          exportToExcel(tableArr, sheetArr, filename);
          removeTables(tableArr);
          
        //--> end newMoodRef 
        });
      }
        
    //--> end userSnap
    });

  }

  function prepareData(filename) //csv
  {
    var dataTable = document.getElementById("export");
    var rows = dataTable.querySelectorAll("tr");

    var csv = [];

    for(var i = 0; i < rows.length; i++)
    {
      var line = [];
      var cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++)
      {
        //console.log("Coluna "+j+"\n"+cols[j].innerText);
        if(cols[j].innerHTML.includes("<br>"))
        {
          var myLine = cols[j].innerHTML;

          //var newLine = myLine.replace(/<br>/g, "~");

          //var newLine = myLine.replace(/<br ?\/?>/g, "\r")

          line.push(myLine);
        }
        else
        {
          line.push(cols[j].innerText);
        }
      }
      //console.log("Linha:\n"+line);

      csv.push(line);
    }

    let csvContent = "data:text/csv;charset=utf-8,";

    for (var i = 0; i < csv.length; i++)
    {
      //var newLine;
      //console.log(csv[i][7]);
      for (var j = 0; j < csv[i].length; j++)
      {
        if (csv[i][j].includes("<br>") == true)
        {
          //console.log("Analisando a linha ["+i+"] e coluna ["+j+"]:\n"+csv[i][j]);

          //var newLine = csv[i][j].replace(/<br>/g, "\n");
          var parts = csv[i][j].split("<br>");

          //construct new line
          var newLine = "\""+parts[0] + "\n" + parts[1] + "\n" + parts[2] + "\n" + parts[3]+"\"";
          //console.log(newLine);

          //alert(newLine);
          csv[i][j] = newLine;
          //console.log("Alterações à linha ["+i+"] e coluna ["+j+"]:\n"+csv[i]);
          //csv[i] = newLine;
        }
        //csvContent += csv[i][j];
      }

      //console.log(csv[i]);

      csvContent += csv[i] + "\r\n";
    }

    downloadData(csvContent, filename);
  }

  function downloadData(csvContent, filename)
  {
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "studies.csv");
    //document.body.appendChild(link); // Required for FF
    //link.click();

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  /* adds a user directly to study 
    1- approves the user and he stays pending 
    2- sends an email with check-in data of that study
  */
  function addDirectlyToStudy(userID, fname, lname, email, studyID)
  {
    //aprova e fica pendente
    /* --> approve user to a study */
    var newStudyChild = 'study_data/' + studyID;
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
      var displayName = fname + " " + lname;
      sendEmail(displayName, email, studyMagicword, studyTitle);
    
      // add user to approved list
      if (studyApproved == "" && studyApproved.length != 0)
      {
        studyApproved[0] = userID;
      }
      else if(studyApproved != "" && studyApproved.length != 0)
      {
        studyApproved.push(userID);
      }

      //alert(studyApproved);

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
      updates['/study_data/' + studyID] = updatedStudyData;

      alert("User was added successfuly!");

      /* --> force page reload */
      window.location.reload();

      //return true;

      return firebase.database().ref().update(updates);
    });
  }

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
    

    alert("E-mail was sent to "+userName+"!");
  }

  /* -- invite user*/
  $("#inviteUserBtn").click(
    function ()
    {
      $("#inviteUserProgress").hide();
      $("#inviteUserError").hide();

      $("#inviteUserOkBtn").show();
      $("#inviteUserCancelBtn").show();

      $("#inviteUserFirstName").val("");
      $("#inviteUserLastName").val("");
      $("#inviteUserEmail").val("");

      var inviteUserDialog = document.querySelector('#inviteUserDialog');
      if (! inviteUserDialog.showModal) 
      {
        dialogPolyfill.registerDialog(inviteUserDialog);
      }
      inviteUserDialog.showModal();
    });

  $("#inviteUserOkBtn").click(
    function ()
    {
      var fname = $("#inviteUserFirstName").val();
      var lname = $("#inviteUserLastName").val();
      var email = $("#inviteUserEmail").val();

      var inviteUserDialog = document.querySelector('#inviteUserDialog');

      var valid = false;

      function validateEmail(email)
      {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }

      if (validateEmail(email))
      {
        valid = true;
      }
      else
      {
        valid = false;
      }

      if (fname.trim() != "" && lname.trim() != "" && email.trim() != "" && valid == true)
      {
        $("#inviteUserProgress").show();
        $("#inviteUserOkBtn").hide();
        $("#inviteUserCancelBtn").hide();

        var newStudyChild = 'study_data/' + sui;
        var newStudyRef = dbRef.child(newStudyChild);

        newStudyRef.once('value', function(studySnap)
        {
          //alert(JSON.stringify(snapshot.val()));
          var studyTitle = studySnap.val().title;
          //var studyLocation = studySnap.val().location;
          var studyMagicword = studySnap.val().magicword;
          /*
          var studyStartdate = studySnap.val().startdate;
          var studyEnddate = studySnap.val().enddate;
          var studyState = studySnap.val().state;
          var studyParticipants = studySnap.val().participants;
          var studyApproved = studySnap.val().approved;
          */

          //alert("SEND EMAIL!");
          var displayName = fname + " " + lname;
          sendEmail(displayName, email, studyMagicword, studyTitle);
        });

        inviteUserDialog.close();
      }
      else if (fname.trim() == "" || lname.trim() == "" && email.trim() == "")
      {
        $("#inviteUserProgress").hide();
        $("#inviteUserOkBtn").show();
        $("#inviteUserCancelBtn").show();
        $("#inviteUserError").show().text("Empty field required");
      }
      else if(valid == false)
      {
        $("#inviteUserProgress").hide();
        $("#inviteUserOkBtn").show();
        $("#inviteUserCancelBtn").show();
        $("#inviteUserError").show().text("E-mail is not valid");
      }

      //alert("OK!");
    });

  $("#inviteUserCancelBtn").click(
    function ()
    {
      $("#inviteUserProgress").hide();
      $("#inviteUserError").hide();

      var inviteUserDialog = document.querySelector('#inviteUserDialog');

      inviteUserDialog.close();

      $("#inviteUserFirstName").val("");
      $("#inviteUserLastName").val("");
      $("#inviteUserEmail").val("");
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
          if (uui != -1 && upi != "") 
          {
            $('#openStudyList').empty();

            userDetail(uui, upi);
          }
          break;
        case "02": //today
          filterUserData = 2;
          if (uui != -1 && upi != "") 
          {
            $('#openStudyList').empty();

            userDetail(uui, upi);
          }
          break;
        case "03": //last 7 days
          filterUserData = 3;
          if (uui != -1 && upi != "") 
          {
            $('#openStudyList').empty();

            userDetail(uui, upi);
          }
          break;
        case "04": //month
          filterUserData = 4;
          if (uui != -1 && upi != "") 
          {
            $('#openStudyList').empty();

            userDetail(uui, upi);
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
  
  /*
    when delete button is clicked
      (1) removes user from study
        (a) remove from participant list
        (b) remove from approved list
        (c) remove from previous list

      (2) removes all mood data
      (3) removes all personal data
  */
  function userDelete(userID, studyID, fname)
  {
    //(1)
    var refChild = 'study_data/' + studyID;
    var userStudyRef = dbRef.child(refChild);

    /*userStudyRef.once('value', function(snapshot)
    {
      //alert(JSON.stringify(snapshot.val()));

      //(a)
      var removeParticipants = snapshot.val().participants;
      
      // remove from participants list
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

      //(b)
      var removeApproved = snapshot.val().approved;
      
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

      //(c)
      var removePrevious = snapshot.val().previous;
      
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
        title: snapshot.val().title,
        location: snapshot.val().location,
        magicword: snapshot.val().magicword,
        startdate: snapshot.val().startdate,
        enddate: snapshot.val().enddate,
        state: snapshot.val().state,
        participants: removeParticipants,
        approved: removeApproved,
        previous: removePrevious
      };

      // save changes to Firebase
      // Write the new study's data
      var updates = {};
      updates['/study_data/' + studyID] = updatedStudyData;
      
      alert("User "+fname +" removed from study");

      //window.location.reload();
      return firebase.database().ref().update(updates);
      //return true;
    });*/

    //(2)
    var moodChild = 'mood_data/' + userID;
    userRef = firebase.database().ref(moodChild);
    userRef.remove().then(function()
    {
      alert("All data collected from user "+fname +" was deleted");
    }
    ).catch(function(error)
    {
      console.log("Remove failed: " + error.message)
    });

    //(3)
    /*
    var moodChild = 'personal_data/' + userID;
    userRef = firebase.database().ref(moodChild);
    userRef.remove().then(function()
    {
      alert("Personal data from user "+fname +" was deleted");
    }
    ).catch(function(error)
    {
      console.log("Remove failed: " + error.message)
    });
    */

  /* end userDelete */  
  }

  /*
    when delete button is clicked, erases all collected data
  */
  function dataDelete(userID, userFname, studyState)
  {
    if (studyState == "open")
    {
      var moodChild = 'mood_data/' + userID;
      userRef = firebase.database().ref(moodChild);
      userRef.remove().then(function()
      {
        alert("All data collected from user "+userFname +" was deleted");
      }
      ).catch(function(error)
      {
        console.log("Remove failed: " + error.message)
      });
    }
    else if (studyState == "closed")
    {
      var prevChild = 'previous_data/' + userID;
      prevRef = firebase.database().ref(prevChild);
      prevRef.remove().then(function()
      {
        alert("All data collected from user "+userFname +" was deleted");
      }
      ).catch(function(error)
      {
        console.log("Remove failed: " + error.message)
      });
    }
  }

  function studyDelete(studyID, studyTitle, studyState, studyParticipants, studyPrevious)
  {
    var studyChild = 'study_data/' + studyID;
    studyRef = firebase.database().ref(studyChild);
    
    if (studyState == "open")
    {
      if (studyParticipants != "")
      {
        //console.log("participants list not empty!");

        //percorrer users e apagar os seus dados
        studyParticipants.forEach(function(part)
        {
          console.log("> Deleting participant collected data: "+part);

          var moodChild = 'mood_data/' + part;
          userRef = firebase.database().ref(moodChild);
          userRef.remove().then(function()
          {
            console.log("\tAll data collected from user "+part +" was deleted!");
          }
          ).catch(function(error)
          {
            console.log("\tDeleting participant collected data failed: " + error.message)
          });

        });
      }
      else
      {
        //console.log("participants list is empty, not to worry about deleting collected data!");

        //apagar estudo de imediato
      }
    }
    else if (studyState == "closed")
    {
      if (studyPrevious != "")
      {
        //console.log("previous list not empty!");

        //percorrer users e apagar os seus dados
        studyPrevious.forEach(function(prev)
        {
          console.log("Deleting prev collected data: "+prev);

          var prevChild = 'previous_data/' + prev;
          prevRef = firebase.database().ref(prevChild);
          prevRef.remove().then(function()
          {
            console.log("\tAll data previously collected from user "+prev +" was deleted!");
          }
          ).catch(function(error)
          {
            console.log("\tDeleting participant collected data failed: " + error.message)
          });
        });
      }
      else
      {
        //console.log("previous list is empty!");

        //apagar estudo de imediato
      }
    }
    
    /* apagar efectivamente o estudo */
    
    studyRef.remove().then(function()
    {
      alert("Study "+studyTitle+" was deleted");
    }
    ).catch(function(error)
    {
      console.log("Remove failed: " + error.message)
    });
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
      //se existir, remove --> para generalizar para remoção de users pendentes
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
      if (removeAppIdx > -1)
      {
        removeApproved.splice(removeAppIdx, 1);
      }

      if (removeApproved == "")
      {
        removeApproved = [""];
        //alert(removeApproved);
      }

      //alert("After: "+removeApproved);

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
      
      alert("User removed from study");

      window.location.reload();
      return firebase.database().ref().update(updates);
      //return true;
    });
  }
  
  /* resets all information */
  function clean()
  {
    $('#openStudyList').empty();
    $('#closedStudyList').empty();

    document.getElementById("studyHeader").style.display = "none";
    document.getElementById("openStudyInfo").style.display = "none";

    document.getElementById("closedStudyInfo").style.display = "none";

    document.getElementById("studyHeader").style.color = "#000000";
  }

  /*
    in a closed study, when a details button is clicked, 
    shows information regarding the mood data of user until
    enddate of that study
  */
  function closedUserDetail(user, pID, enddate)
  {
    var refChild = 'previous_data/' + user;
    var userMoodRef = dbRef.child(refChild);

    //id para collapse
    var id = 0;

    //remove header and info
    clean();

    var newStudyChild = 'study_data/' + sui;
    var newStudyRef = dbRef.child(newStudyChild);

    newStudyRef.once('value', function(studySnap)
    {
      var studyTitle = studySnap.val().title;
      //alert("Participant from study \'"+studyTitle+"\'");
      document.getElementById("metricsInfo").innerHTML = "Participant from study \'"+studyTitle+"\'";
    });

    //get enddate as date
    //dd/mm/yyyy
    var parts = enddate.split('/');
    var endDate = new Date(parts[2], parts[1] - 1, parts[0]);
    
    // charts data
    var end_gCount = 0;
    var end_yCount = 0;
    var end_rCount = 0;

    var end_bpmData = [];
    var end_stepsData = [];
    var end_sleepData = [];

    var moodRef = dbRef.child("previous_data");            
    moodRef.child(user).once('value', function(snapshot)
    {
      if (!snapshot.exists())
      {
        //console.log("User >"+pID+"< does not have mood data");
        document.getElementById("studyHeader").style.color = "#FF0000";
        document.getElementById("studyHeader").innerHTML = "Participant "+pID + " did not have data";
        document.getElementById("studyHeader").style.display = "block";

        document.getElementById('chart_data').style.display = "none";
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
              var newRefChild = 'previous_data/' + user + '/'+key;
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
              var feeling = "";
              var note = "";

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
                  //if (convertedDate < endDate) //se é anterior à data do fecho do estudo
                  //{
                    //console.log(date+" é anterior a "+enddate);
                    //clean();

                    /*
                    studyHeader
                    openStudyInfo
                    closedStudyList 
                    */

                    document.getElementById("studyHeader").style.color = "#000000";
                    document.getElementById("studyHeader").innerHTML = "Showing data of "+pID;
                    
                    document.getElementById("studyHeader").style.display = "block";
                    document.getElementById("metricsInfo").style.display = "block";
                    
                    var header = "Data collected on "+ date + ", at " + time +"h";
                    
                    id = id + 1;

                    $('#closedStudyList').append(
                      '<div class="mdl-grid">'+
                      '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                        '<div id=+"cardHeader" class="card-mood mdl-card mdl-shadow--2dp">' +

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
                      $('#moodInfo').replaceWith('<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>');
                      end_gCount = end_gCount + 1;
                    }
                    else if (mood == "yellow") 
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>');
                      end_yCount = end_yCount + 1;
                    }
                    else if (mood == "red")
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>');
                      end_rCount = end_rCount + 1;
                    }

                    if (location == "null")
                    {
                      $('#locationInfo').replaceWith(
                        '<h5><span style="color: #000000;"><i class="fas fa-map-marker-alt"></i></span>'+ " "+ locationErr +'</h5>'
                      );
                    }
                    else
                    {
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
                      var minimalDate = date.replace('/2019','');
                      var bpmToInt = parseInt(bpm);

                      //dd/mm/yyyy
                      var parts = date.split('/');

                      //construct date
                      var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                      var bpmObj = {
                        minDate: minimalDate,
                        date: convertedDate,
                        bpm: bpmToInt
                      };

                      end_bpmData.push(bpmObj);

                      $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                    }

                    if (steps == "null")
                    {
                      $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                    }
                    else
                    {
                      var minimalDate = date.replace('/2019','');
                      var stepsToInt = parseInt(steps);

                      //dd/mm/yyyy
                      var parts = date.split('/');

                      //construct date
                      var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                      
                      var stepsObj = {
                        date: convertedDate,
                        steps: stepsToInt
                      };

                      end_stepsData.push(stepsObj);

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

                      var sleepObj = {
                        date: convertedDate,
                        sHH: parseInt(sTime[0]),
                        sMM: parseInt(sTime[1]),
                        eHH: parseInt(eTime[0]),
                        eMM: parseInt(eTime[1])
                      };

                      end_sleepData.push(sleepObj);

                      $('#sleepStartInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bed"></i></span>'+ " "+ sleep_start+"h" +'</h5>');
                      $('#sleepEndInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-bell"></i></span>'+ " "+ sleep_end+"h"+'</h5>');
                      $('#sleepDurationInfo').replaceWith('<h5><span style="color: #0000FF;"><i class="fas fa-clock"></i></span>'+ " "+ sleep_duration +'</h5>');
                    }

                    if (feeling == "null")
                    {
                      $('#feelingInfo').replaceWith(
                        '<h5><span style="color: #000000;"><i class="fas fa-dizzy"></i></span>'+ " "+ feelingErr +'</h5>'
                      );
                    }
                    else if(feeling == "up")
                    {
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

                  /* end convertedDate < endDate */
                  /*}
                  else if (convertedDate > endDate)
                  {
                    document.getElementById('chart_data').style.display = "none";
                  }*/

                  document.getElementById('chart_data').style.display = "block";
                  drawAllCharts(end_gCount, end_yCount, end_rCount, end_bpmData, end_stepsData, end_sleepData);
                /* end moodDetailRef */
                });

            /* end if (key != "green" && key != "yellow" && key != "red") */
            }
          /* end moodSnapshot */
          });

        /* end userMoodRef.once */
        });

      /* end else //exists then show */
      }

    /* end moodRef.child(user)*/
    });

  /* end function closedUserDetail */
  }
  
  /* when a details button is clicked, shows information regarding the mood data */
  function userDetail(user, pID)
  {
    //console.log("Processing user "+pID);
    var refChild = 'mood_data/' + user;
    var userMoodRef = dbRef.child(refChild);

    //id para collapse
    var id = 0;

    //remove header and info
    clean();

    var newStudyChild = 'study_data/' + sui;
    var newStudyRef = dbRef.child(newStudyChild);

    newStudyRef.once('value', function(studySnap)
    {
      var studyTitle = studySnap.val().title;
      document.getElementById("metricsInfo").innerHTML = "Participant from study \'"+studyTitle+"\'";
    });

    //get current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var nowFull = dd + '/' + mm + '/' + yyyy;
    var nowMonth = mm + '/' + yyyy;

    // charts data
    var gCount = 0;
    var yCount = 0;
    var rCount = 0;

    var bpmData = [];
    var stepsData = [];
    var sleepData = [];

    var moodRef = dbRef.child("mood_data");            
    moodRef.child(user).once('value', function(snapshot)
    {
      if (!snapshot.exists())
      {
        //console.log("User >"+pID+"< does not have mood data");
        document.getElementById("studyHeader").style.color = "#FF0000";
        document.getElementById("studyHeader").innerHTML = "Participant "+pID + " does not have data to show yet";
        document.getElementById("studyHeader").style.display = "block";
      }
      else //exists then show
      {
        //console.log("User "+pID+" has mood data");
      
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
              var feeling = "";
              var note = "";

              if (filterUserData == 1) // all
              {
                document.getElementById("studyHeader").innerHTML = "Showing all data of "+pID;

                document.getElementById("studyHeader").style.display = "block";
                document.getElementById("metricsInfo").style.display = "block";

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

                  //<i class="far fa-frown"></i> --> negative
                  //<i class="far fa-smile"></i> --> positive
                  //<i class="far fa-meh"></i> --> neutral

                  var header = "Data collected on "+ date + ", at " + time +"h";
                  
                  id = id + 1;
                  $('#openStudyList').append(
                    '<div class="mdl-grid">'+
                    '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                      '<div id=+"cardHeader" class="card-mood mdl-card mdl-shadow--2dp">' +

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
                  
                  if (mood == "green")
                  {
                    $('#moodInfo').replaceWith('<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>');
                    gCount = gCount + 1;
                  }
                  else if (mood == "yellow") 
                  {
                    $('#moodInfo').replaceWith('<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>');
                    yCount = yCount + 1;
                  }
                  else if (mood == "red")
                  {
                    $('#moodInfo').replaceWith('<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>');
                    rCount = rCount + 1;
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
                    var minimalDate = date.replace('/2019','');
                    var bpmToInt = parseInt(bpm);

                    //dd/mm/yyyy
                    var parts = date.split('/');

                    //construct date
                    var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                    bpmObj = {
                      minDate: minimalDate,
                      date: convertedDate,
                      bpm: bpmToInt
                    };

                    bpmData.push(bpmObj);

                    //alert(bpmData.length);

                    $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                  }

                  if (steps == "null")
                  {
                    //<i class="fas fa-exclamation-triangle"></i>
                    $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                  }
                  else
                  {
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

                    //'<h5 id="sleepStartInfo"><i class="fas fa-bed"></i>' + " "+ sleep_start+"h" + '</h5>' +
                    //'<h5 id="sleepEndInfo"><i class="fas fa-bell"></i>' + " "+ sleep_end+"h" + '</h5>' +
                    //'<h5 id="sleepDurationInfo"><i class="fas fa-clock"></i>' + " "+ sleep_duration + '</h5>' +
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
                      return old == "Expand" ? "Collapse" : "Expand";
                    });
                  /* end y */
                  });
                  
                  document.getElementById('chart_data').style.display = "block";
                  drawAllCharts(gCount, yCount, rCount, bpmData, stepsData, sleepData);

                /* end moodDetailRef */
                });
              /* end filterUserData is all */
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
                    document.getElementById("studyHeader").innerHTML = "Data for today not found!";
                    document.getElementById("studyHeader").style.color = "#FF0000";
                    document.getElementById("studyHeader").style.display = "block";

                    /*
                    document.getElementById('mood_chart');
                    document.getElementById('bpm_chart');
                    document.getElementById('step_chart');
                    document.getElementById('sleep_chart');*/

                    document.getElementById('chart_data').style.display = "none";
                  }
                  else
                  {
                    //clean();
                    document.getElementById("studyHeader").innerHTML = "Showing today data of "+pID;
                    document.getElementById("openStudyInfo").innerHTML = nowFull;
                    
                    document.getElementById("studyHeader").style.color = "#000000";

                    document.getElementById("studyHeader").style.display = "block";
                    document.getElementById("metricsInfo").style.display = "block";
                    document.getElementById("openStudyInfo").style.display = "block";
                    
                    var header = "Data collected on "+ date + ", at " + time +"h";
                    
                    id = id + 1;

                    $('#openStudyList').append(
                      '<div class="mdl-grid">'+
                      '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                        '<div id=+"cardHeader" class="card-mood mdl-card mdl-shadow--2dp">' +

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

                    if (mood == "green")
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>');
                      gCount = gCount + 1;
                    }
                    else if (mood == "yellow") 
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>');
                      yCount = yCount + 1;
                    }
                    else if (mood == "red")
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>');
                      rCount = rCount + 1;
                    }

                    /* */
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
                      var minimalDate = date.replace('/2019','');
                      var bpmToInt = parseInt(bpm);

                      //dd/mm/yyyy
                      var parts = date.split('/');

                      //hh:mm
                      var readTime = time.split(':');

                      //construct date
                      var convertedDate = new Date(parts[2], parts[1] - 1, parts[0], readTime[0], readTime[1]);

                      bpmObj = {
                        minDate: minimalDate,
                        date: convertedDate,
                        bpm: bpmToInt
                      };

                      alert(minimalDate+" "+time+"h, "+bpm);

                      bpmData.push(bpmObj);

                      //alert(bpmData.length);

                      $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                    }

                    if (steps == "null")
                    {
                      //<i class="fas fa-exclamation-triangle"></i>
                      $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                    }
                    else
                    {
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

                      $('#stepsInfo').replaceWith('<h5><span style="color: #FFA500;"><i class="fas fa-walking"></i></span>'+ " "+ steps +' </h5>');
                    }

                    if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                    {
                      $('#sleepStartInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bed"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepEndInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bell"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepDurationInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-clock"></i></span>'+ " "+ sleepErr +'</h5>');
                    }
                    else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                    {
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
                        return old == "Expand" ? "Collapse" : "Expand";
                      });
                    /* end y */
                    });

                    document.getElementById('chart_data').style.display = "block";
                    drawAllCharts(gCount, yCount, rCount, bpmData, stepsData, sleepData);
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

                  //dd/mm/yyyy
                  var parts = date.split('/');

                  //construct date
                  var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                  if (convertedDate < today && convertedDate > daysAgo)
                  {
                    //alert(date+" é anterior a hoje "+nowFull+" e depois da semana passada "+lastWeekFull);

                    document.getElementById("studyHeader").style.color = "#000000";
                    document.getElementById("studyHeader").innerHTML = "Showing data for the last 7 days of "+pID;
                    
                    document.getElementById("openStudyInfo").innerHTML = "Dates between "+ lastWeekFull + " and "+nowFull;

                    document.getElementById("studyHeader").style.display = "block";
                    document.getElementById("metricsInfo").style.display = "block";
                    document.getElementById("openStudyInfo").style.display = "block";

                    var header = "Data collected on "+ date + ", at " + time +"h";
                    
                    id = id + 1;

                    $('#openStudyList').append(
                      '<div class="mdl-grid">'+
                      '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                        '<div id=+"cardHeader" class="card-mood mdl-card mdl-shadow--2dp">' +

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

                    if (mood == "green")
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>');
                      gCount = gCount + 1;
                    }
                    else if (mood == "yellow") 
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>');
                      yCount = yCount + 1;
                    }
                    else if (mood == "red")
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>');
                      rCount = rCount + 1;
                    }

                    /* */
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
                      var minimalDate = date.replace('/2019','');

                      //dd/mm/yyyy
                      var readDate = date.split('/');

                      //hh:mm
                      var readTime = time.split(':');

                      //construct date
                      var convertDate = new Date(readDate[2], readDate[1] - 1, readDate[0], readTime[0], readTime[1]);

                      bpmObj = {
                        minDate: minimalDate,
                        date: convertDate,
                        bpm: parseInt(bpm)
                      };

                      bpmData.push(bpmObj);

                      $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                    }

                    if (steps == "null")
                    {
                      //<i class="fas fa-exclamation-triangle"></i>
                      $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                    }
                    else
                    {
                      //dd/mm/yyyy
                      var readDate = date.split('/');

                      //construct date
                      var convertDate = new Date(readDate[2], readDate[1] - 1, readDate[0]);
                      
                      stepsObj = {
                        date: convertDate,
                        steps: parseInt(steps)
                      };

                      stepsData.push(stepsObj);

                      $('#stepsInfo').replaceWith('<h5><span style="color: #FFA500;"><i class="fas fa-walking"></i></span>'+ " "+ steps +' </h5>');
                    }

                    if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                    {
                      $('#sleepStartInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bed"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepEndInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bell"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepDurationInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-clock"></i></span>'+ " "+ sleepErr +'</h5>');
                    }
                    else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                    {
                      //dd/mm/yyyy
                      var readDate = date.split('/');

                      //construct date
                      var convertDate = new Date(readDate[2], readDate[1] - 1, readDate[0]);

                      //hh:mm
                      var sTime = sleep_start.split(':');

                      //hh:mm
                      var eTime = sleep_end.split(':');

                      sleepObj = {
                        date: convertDate,
                        sHH: parseInt(sTime[0]),
                        sMM: parseInt(sTime[1]),
                        eHH: parseInt(eTime[0]),
                        eMM: parseInt(eTime[1])
                      };

                      sleepData.push(sleepObj);

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
                        return old == "Expand" ? "Collapse" : "Expand";
                      });
                    /* end y */
                    });

                    document.getElementById('chart_data').style.display = "block";
                    drawAllCharts(gCount, yCount, rCount, bpmData, stepsData, sleepData);

                  /* end convertedDate < today && convertedDate > daysAgo */  
                  }
                  else if (convertedDate > today || convertedDate < daysAgo)
                  {
                    //not in parameter.. display error?
                    console.log("Date in analysis: "+date+"\n\tDates between "+ lastWeekFull + " and "+nowFull);
                    document.getElementById("studyHeader").innerHTML = "Data for the last 7 days not found!";
                    document.getElementById("studyHeader").style.color = "#FF0000";
                    document.getElementById("studyHeader").style.display = "block";

                    document.getElementById('chart_data').style.display = "none";
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
                  //alert("Data = "+date);

                  if (dateMonth != nowMonth)
                  {
                    //alert("Data for this month not found!");
                    document.getElementById("studyHeader").innerHTML = "Data for this month not found!";
                    document.getElementById("studyHeader").style.color = "#FF0000";
                    document.getElementById("studyHeader").style.display = "block";

                    document.getElementById('chart_data').style.display = "none";
                  }
                  else
                  {
                    document.getElementById("studyHeader").style.color = "#000000";
                    document.getElementById("studyHeader").innerHTML = "Showing data for this month of "+pID;
                    
                    const month = today.toLocaleString('en', { month: 'long' });
                    
                    document.getElementById("openStudyInfo").innerHTML = month;

                    document.getElementById("studyHeader").style.display = "block";
                    document.getElementById("metricsInfo").style.display = "block";
                    document.getElementById("openStudyInfo").style.display = "block";
                    //alert("Date month!");
                    var header = "Data collected on "+ date + ", at " + time +"h";
                    
                    id = id + 1;

                    $('#openStudyList').append(
                      '<div class="mdl-grid">'+
                      '<div id="userCell" class=mdl-cell mdl-cell--4-col mdl-cell--middle">' +
                        '<div id=+"cardHeader" class="card-mood mdl-card mdl-shadow--2dp">' +

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
                      $('#moodInfo').replaceWith('<h5><span style="color: #008000;"><i class="far fa-smile"></i></span> Positive</h5>');
                      gCount = gCount + 1;
                    }
                    else if (mood == "yellow") 
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #E6E600;"><i class="far fa-meh"></i></span> Neutral</h5>');
                      yCount = yCount + 1;
                    }
                    else if (mood == "red")
                    {
                      $('#moodInfo').replaceWith('<h5><span style="color: #FF0000;"><i class="far fa-frown"></i></span> Negative</h5>');
                      rCount = rCount + 1;
                    }

                    /* */

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
                      var minimalDate = date.replace('/2019','');

                      //dd/mm/yyyy
                      var readDate = date.split('/');

                      //hh:mm
                      var readTime = time.split(':');

                      //construct date
                      var convertDate = new Date(readDate[2], readDate[1] - 1, readDate[0], readTime[0], readTime[1]);

                      bpmObj = {
                        minDate: minimalDate,
                        date: convertDate,
                        bpm: parseInt(bpm)
                      };

                      bpmData.push(bpmObj);

                      $('#bpmInfo').replaceWith('<h5><span style="color: Red;"><i class="fas fa-heartbeat"></i></span>' + " "+ bpm + '</h5>');
                    }

                    if (steps == "null")
                    {
                      //<i class="fas fa-exclamation-triangle"></i>
                      $('#stepsInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-walking"></i></span>'+ " "+ stepsErr +'</h5>');
                    }
                    else
                    {
                      //dd/mm/yyyy
                      var readDate = date.split('/');

                      //construct date
                      var convertDate = new Date(readDate[2], readDate[1] - 1, readDate[0]);
                      
                      stepsObj = {
                        date: convertDate,
                        steps: parseInt(steps)
                      };

                      stepsData.push(stepsObj);

                      $('#stepsInfo').replaceWith('<h5><span style="color: #FFA500;"><i class="fas fa-walking"></i></span>'+ " "+ steps +' </h5>');
                    }

                    if (sleep_start == "null" || sleep_end == "null" || sleep_duration == "null")
                    {
                      $('#sleepStartInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bed"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepEndInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-bell"></i></span>'+ " "+ sleepErr +'</h5>');
                      $('#sleepDurationInfo').replaceWith('<h5><span style="color: #000000;"><i class="fas fa-clock"></i></span>'+ " "+ sleepErr +'</h5>');
                    }
                    else if (sleep_start != "null" && sleep_end != "null" && sleep_duration != "null")
                    {
                      //dd/mm/yyyy
                      var readDate = date.split('/');

                      //construct date
                      var convertDate = new Date(readDate[2], readDate[1] - 1, readDate[0]);

                      //hh:mm
                      var sTime = sleep_start.split(':');

                      //hh:mm
                      var eTime = sleep_end.split(':');

                      sleepObj = {
                        date: convertDate,
                        sHH: parseInt(sTime[0]),
                        sMM: parseInt(sTime[1]),
                        eHH: parseInt(eTime[0]),
                        eMM: parseInt(eTime[1])
                      };

                      sleepData.push(sleepObj);

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
                        return old == "Expand" ? "Collapse" : "Expand";
                      });
                    /* end y */
                    });

                    document.getElementById('chart_data').style.display = "block";
                    drawAllCharts(gCount, yCount, rCount, bpmData, stepsData, sleepData);
                  }
                /* end moodDetailRef */
                });
              /* end filterUserData is month */
              }
            /* end if key != green/yellow/red */
            }

          /* end moodSnapshot */;
          });

        /* end userMoodRef */
        });
    
      /* end snapshot.exists() */
      }
    
    /* end moodRef.child */
    });

  /* end function userClicked*/
  }

  function drawMetrics(greenCount, yellowCount, redCount)
  {
    let width = 350;
    let height = 350;

    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(drawPieChart);

    let chartContainer = document.getElementById('chart');

    function drawPieChart()
    {
      var chart = new google.visualization.PieChart(chartContainer);
      chart.clearChart();

      var data = google.visualization.arrayToDataTable([
        ['Mood', 'Value'],
        ['Positive', greenCount],
        ['Neutral',  yellowCount],
        ['Negative', redCount]
      ]);

      // Set chart options
      var options = {
        title:    'Mood',
        slices: {
          0: {color: '#008000'},
          1: {color: '#E6E600'}, 
          2: {color: '#FF0000'}
        },
        tooltip: { text: 'percentage' },
        pieHole:  0.4,
        width:    width,
        height:   height
      };

      chart.draw(data, options);
    }
  }

  function drawAllCharts(gCount, yCount, rCount, bpmData, stepsData, sleepData)
  {
    let width = 500;
    let height = 500;

    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(drawMoodChart);
    google.charts.setOnLoadCallback(drawBPMChart);
    google.charts.setOnLoadCallback(drawStepChart);
    google.charts.setOnLoadCallback(drawSleepChart);

    let moodContainer = document.getElementById('mood_chart');
    let bpmContainer = document.getElementById('bpm_chart');
    let stepsContainer = document.getElementById('step_chart');
    let sleepContainer = document.getElementById('sleep_chart');

    function drawMoodChart()
    {
      var chart = new google.visualization.PieChart(moodContainer);
      chart.clearChart();

      var data = google.visualization.arrayToDataTable([
        ['Mood', 'Value'],
        ['Positive', gCount],
        ['Neutral',  yCount],
        ['Negative', rCount]
      ]);

      // Set chart options
      var options = {
        title:    'Mood',
        slices: {
          0: {color: '#008000'},
          1: {color: '#E6E600'}, 
          2: {color: '#FF0000'}
        },
        tooltip: { text: 'percentage' },
        pieHole:  0.4,
        width:    width,
        height:   height
      };

      chart.draw(data, options);
    }

    function drawBPMChart()
    {
      if (bpmData.length == 0)
      {
        bpmContainer.style.display = "none";
      }
      else
      {
        bpmContainer.style.display = "block";
        var chart = new google.visualization.ScatterChart(bpmContainer);
        chart.clearChart();
        
        if (bpmData.length == 1)
        {
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Day');
          data.addColumn('number', 'BPM');

          for (var i = 0; i < bpmData.length; i++)
          {
            //alert(JSON.stringify(bpmData))
            data.addRow([bpmData[i].minDate, bpmData[i].bpm]);
          }
        }
        else if (bpmData.length > 1) 
        {
          var data = new google.visualization.DataTable();
          data.addColumn('date', 'Day');
          data.addColumn('number', 'BPM');

          for (var i = 0; i < bpmData.length; i++)
          {
            //alert(JSON.stringify(bpmData))
            data.addRow([bpmData[i].date, bpmData[i].bpm]);
          }
        }

        var options = {
          title:  'BPM',
          width:  width,
          height: height,
          pointSize: 10,
          colors: ['#FF0000'],
          legend: { position: 'none' }
        };

        chart.draw(data, options);
      }
    }
    
    function drawStepChart()
    {
      if (stepsData.length == 0)
      {
        stepsContainer.style.display = "none";
      }
      else
      {
        stepsContainer.style.display = "block";

        var chart = new google.visualization.BarChart(stepsContainer);
        chart.clearChart();

        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Day');
        data.addColumn('number', 'Total');

        for (var i = 0; i < stepsData.length; i++)
        {
          data.addRow([stepsData[i].date, stepsData[i].steps]);
        }

        var options = {
          title:  'Steps',
          width:  width,
          height: height,
          colors: ['#FFA500'],
          legend: { position: 'none' },
          bars: 'horizontal',
          axes: {
            x: {
              0: { side: 'top', label: 'Total'} // Top x-axis.
            }
          },
          bar: { groupWidth: "85%" }
        };

        chart.draw(data, options);
      }
    }

    function drawSleepChart()
    {
      if (sleepData.length == 0)
      {
        sleepContainer.style.display = "none";
      }
      else
      {
        sleepContainer.style.display = "block";

        var chart = new google.visualization.CandlestickChart(sleepContainer);
        chart.clearChart();

        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Day');
        data.addColumn('timeofday', 'Start');
        data.addColumn('timeofday', 'End');
        data.addColumn('timeofday', 'Start');
        data.addColumn('timeofday', 'End');

        for (var i = 0; i < sleepData.length; i++)
        {
          data.addRow([
            sleepData[i].date,
            [sleepData[i].sHH, sleepData[i].sMM, 0],
            [sleepData[i].eHH, sleepData[i].eMM, 0],
            [sleepData[i].sHH, sleepData[i].sMM, 0],
            [sleepData[i].eHH, sleepData[i].eMM, 0]
          ]);
        }

        var options = {
          title:  'Sleep',
          legend: 'none',
          width:  width,
          height: height,
          colors: ['#0000FF'],
          vAxis: {
            gridlines: {
              units: {
                //days: {format: ['MMM dd']},
                hours: {format: ['HH:mm', 'ha']},
              }
            }
          },
          bar: { groupWidth: '85%' }, // Remove space between bars.
          candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#0000FF' },
            risingColor: { strokeWidth: 0, fill: '#0000FF' }
          }
        };

        chart.draw(data, options);
      }
    }
 
  }

  }
  else
  {
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
