$("#exportAllStudyDataBtn").click(
    function ()
    {
      //alert("Please Export All Study Data!");
      getDataShowTable("studies.csv");
    });

  /* get data and show on table */
  function getDataShowTable(filename)
  {
    var studyObj = {};
    var studyList = [];
    
    var userObj = {};
    var userList = [];

    var moodObj = {};
    var moodList = [];

    var auxList = [];

    //var filename = "studies.csv";

    $("#export tr").remove();

    $("#export").append(
      '<tr>'+
        '<th>Title</th>'+
        '<th>Location</th>'+
        '<th>Secret code</th>'+
        '<th>State</th>'+
        '<th>Start date</th>'+
        '<th>End date</th>'+
        '<th>Number pending checkin</th>'+
        '<th>Pending checkin</th>'+
        '<th>Number participants</th>'+
        '<th>Participants</th>'+
        '<th>Participant collected data</th>'+ //yes/no
        '<th>Date</th>'+
        '<th>Mood</th>'+
        '<th>Location</th>'+
        '<th>Temperature</th>'+
        '<th>BPM</th>'+
        '<th>Steps</th>'+
        '<th>Sleep session start</th>'+
        '<th>Sleep session end</th>'+
        '<th>Sleep session duration</th>'+
        '<th>Feeling</th>'+
        '<th>Note</th>'+
      '</tr>'
    );

    $("#exportStudy tr").remove();
    $("#exportPending tr").remove();
    $("#exportParticipant tr").remove();
    $("#exportData tr").remove();

    $("#exportStudy").append(
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

    $("#exportPending").append(
      '<tr>'+
        '<th>Full name</th>'+
        '<th>Email</th>'+
        '<th>Birthday</th>'+
        '<th>Gender</th>'+
      '</tr>'
    );

    $("#exportParticipant").append(
      '<tr>'+
        '<th>Full name</th>'+
        '<th>Email</th>'+
        '<th>Birthday</th>'+
        '<th>Gender</th>'+
      '</tr>'
    );

    $("#exportData").append(
      '<tr>'+
        '<th>Date</th>'+
        '<th>Mood</th>'+
        '<th>Location</th>'+
        '<th>Temperature</th>'+
        '<th>BPM</th>'+
        '<th>Steps</th>'+
        '<th>Sleep session start</th>'+
        '<th>Sleep session end</th>'+
        '<th>Sleep session duration</th>'+
        '<th>Feeling</th>'+
        '<th>Note</th>'+
      '</tr>'
    );

    var x = 0;

    studyRef.once('value', function(studySnap)
    {
      studySnap.forEach(function(studyChild)
      {
        var s = studyChild.val();
        //console.log(studyChild.val());

        var title = s.title;
        var location = s.location;
        var magicword = s.magicword;
        var startdate = s.startdate;
        var enddate = s.enddate;
        var state = s.state;
        var participants = s.participants;
        var approved = s.approved;

        //alert(JSON.stringify(s));

        var stateTmp;

        if (state == "open")
        {
          stateTmp = "- - -";
        }
        else
        {
          stateTmp = enddate;
        }

        var filteredParticipants = [];
        var pSize = participants.length;

        if (pSize != 0 && participants == "")
        {
          pSize = 0;
        }
        else
        {
          participants.forEach(function(pChild)
          {
            //console.log("Participantes filtrados:\n"+pChild);
            filteredParticipants.push(pChild);
          });
        }

        var filteredApproved = [];
        var aSize = approved.length;

        if (aSize != 0 && approved == "")
        {
          aSize = 0;
        }
        else
        {
          approved.forEach(function(aChild)
          {
            if (!participants.includes(aChild))
            {
              //console.log("Estão em approved mas não são participantes:\n"+aChild);
              filteredApproved.push(aChild);
            }
            else
            {
              aSize -= 1;
            }
          });
        }

        studyObj = {
          title: title,
          location: location,
          secretcode: magicword,
          state: state,
          start: startdate,
          end: stateTmp,
          numeberparticip: pSize,
          participants: filteredParticipants,
          numeberapp: aSize,
          approved: filteredApproved
        };

        studyList.push(studyObj);
      //--> end studySnap
      });

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

          var displayName = fname + " " + lname;

          userObj = {
            id: userID,
            name: displayName,
            email: email,
            dnasc: dnasc,
            gender: gender
          };

          userList.push(userObj);
        //--> end userSnap
        });
        //console.log(userList);
        //alert(userList);

        var refObj = {};
        var refList = []; 

        var userKeyList = [];
        var keyToReadList = [];

        var moodRef = dbRef.child("mood_data");
        moodRef.once('value', function(moodSnap)
        {
          moodSnap.forEach(function(moodChild)
          {
            //console.log("KEY: "+moodChild.key+", VAL: "+ moodChild.val());
            var userKey = moodChild.key;
            //var newMoodRef = dbRef.child("mood_data/"+userKey);
            
            userKeyList.push(userKey);
            //console.log( JSON.stringify(moodChild.val()) );

          //--> end moodSnap
          });

          userKeyList.forEach(function(userKeyItem)
          {
            var newMoodRef = dbRef.child("mood_data/"+userKeyItem);

            newMoodRef.once('value', function(newMoodSnap) //ler dados do user userKey
            {
              newMoodSnap.forEach(function(newMoodChild)
              {
                var keyToRead = newMoodChild.key;

                if (keyToRead != "green" && keyToRead != "yellow" && keyToRead != "red")
                {
                  //console.log("KEY: "+newMoodChild.key+", VAL: "+ newMoodChild.val());
                  //keyToReadList.push(keyToRead);
                  //console.log( JSON.stringify(newMoodChild.val()) );
                  keyToReadList.push(newMoodChild.val());
                }
              });

              keyToReadList.forEach(function(keyItem)
              {
                //console.log(keyItem.time);
                
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
                if (mood == "green")
                {
                  moodToText = greenToText;
                }
                else if (mood == "yellow") 
                {
                  moodToText = yellowToText;
                }
                else if (mood == "red")
                {
                  moodToText = redToText;
                }

                var bpmToText;
                if (bpm == "null")
                {
                  bpmToText = bpmErr;
                }
                else
                {
                  bpmToText = bpm;
                }

                var stepsToText;
                if (steps == "null")
                {
                  stepsToText = stepsErr;
                }
                else
                {
                  stepsToText = steps;
                }

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
                  sleepStartToText = sleep_start+"h";
                  sleepEndToText = sleep_end+"h";
                  sleepDurationToText = sleep_duration;
                }

                var feelingToText;
                if (feeling == "null")
                {
                  feelingToText = feelingErr;
                }
                else
                {
                  const lower = feeling;
                  const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                  feelingToText = upper;
                }

                var noteToText;
                if (note == "null")
                {
                  noteToText = noteErr;
                }
                else
                {
                  const lower = note;
                  const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

                  noteToText = upper;
                }

                var newLocation = location.split(",");

                moodObj = {
                  user: userKeyItem,
                  date: dateFull,
                  mood: moodToText,
                  location: newLocation[0],
                  temperature: temperature,
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
              //--> end keyToReadList forEach
              });
              
              //console.log(moodList.length);
              studyList.forEach(function(studyItem)
              {
                if (studyItem.participants != "")
                {
                  //console.log("Participants:\n"+studyItem.participants);
                  userList.forEach(function(userItem)
                  {
                    //console.log("User:\n"+userItem.id);
                    if (studyItem.participants.includes(userItem.id) == true)
                    {
                      //console.log(userItem.id);
                      //console.log(userItem.id + " está no estudo " + studyItem.title);

                      moodList.forEach(function(moodItem)
                      {
                        if (moodItem.user == userItem.id)
                        {
                          $('#export').append(
                            '<tr>' +
                              '<td>' + studyItem.title + '</td>' +
                              '<td>' + studyItem.location + '</td>' +
                              '<td>' + studyItem.secretcode + '</td>' +
                              '<td>' + studyItem.state + '</td>' +
                              '<td>' + studyItem.start + '</td>' +
                              '<td>' + studyItem.end + '</td>' +
                              
                              '<td>' + studyItem.numeberapp + '</td>' +
                              '<td>' + "- - -" + '</td>' +

                              '<td>' + studyItem.numeberparticip + '</td>' +
                              '<td>' + userItem.name + '</br>'
                                     + userItem.email + '</br>'
                                     + userItem.dnasc + '</br>'
                                     + userItem.gender +
                              '</td>' +

                              '<td>' + "Yes" + '</td>' +
                              '<td>' + moodItem.date + '</td>' +
                              '<td>' + moodItem.mood + '</td>' +
                              '<td>' + moodItem.location + '</td>' +
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
                        
                      });
                    }
                  //--> end userList.forEach
                  });

                //--> end if (studyItem.participants != "")
                }
                
                if (studyItem.approved != "")
                {
                  //console.log("Pending:\n"+studyItem.approved);
                  userList.forEach(function(userItem)
                  {
                    //console.log("Approved:\n"+userItem.id);
                    if (studyItem.approved.includes(userItem.id) == true)
                    {
                      //console.log(userItem.id);
                      //console.log(userItem.id + " está no estudo " + studyItem.title);

                      $('#export').append(
                        '<tr>' +
                          '<td>' + studyItem.title + '</td>' +
                          '<td>' + studyItem.location + '</td>' +
                          '<td>' + studyItem.secretcode + '</td>' +
                          '<td>' + studyItem.state + '</td>' +
                          '<td>' + studyItem.start + '</td>' +
                          '<td>' + studyItem.end + '</td>' +

                          '<td>' + studyItem.numeberapp + '</td>' +
                          '<td>' + userItem.name + '</br>'
                                 + userItem.email + '</br>'
                                 + userItem.dnasc + '</br>'
                                 + userItem.gender +
                          '</td>' +

                          '<td>' + studyItem.numeberparticip + '</td>' +
                          '<td>' + "- - -" + '</td>' +

                          '<td>' + "No" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                          '<td>' + "- - -" + '</td>' +
                        '</tr>'
                      );
                    }

                  //--> end userList.forEach
                  });
                
                //--> end studyItem.approved != ""
                }

                if (studyItem.participants == "" && studyItem.approved == "")
                {
                  //console.log("Empty:\n"+studyItem.title);

                  $('#export').append(
                    '<tr>' +
                      '<td>' + studyItem.title + '</td>' +
                      '<td>' + studyItem.location + '</td>' +
                      '<td>' + studyItem.secretcode + '</td>' +
                      '<td>' + studyItem.state + '</td>' +
                      '<td>' + studyItem.start + '</td>' +
                      '<td>' + studyItem.end + '</td>' +

                      '<td>' + studyItem.numeberapp + '</td>' +
                      '<td>' + "- - -" + '</td>' +

                      '<td>' + studyItem.numeberparticip + '</td>' +
                      '<td>' + "- - -" + '</td>' +

                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                      '<td>' + "- - -" + '</td>' +
                    '</tr>'
                  );

                //--> end empty study
                }

              //--> end studyList.forEach
              });
              
              prepareData(filename);
              exportTableToExcel("export", "studies")

            //--> end newMoodRef
            });
          
          //--> end userKeyList forEach
          });

        //--> end moodRef 
        });
        
        //console.log(auxList.length);
        
        /*
        studyList.forEach(function(studyItem)
        {
          if (studyItem.participants != "")
          {
            //console.log("Participants:\n"+studyItem.participants);
            userList.forEach(function(userItem)
            {
              //console.log("User:\n"+userItem.id);
              if (studyItem.participants.includes(userItem.id) == true)
              {
                //console.log(userItem.id);
                //console.log(userItem.id + " está no estudo " + studyItem.title);

                $('#export').append(
                  '<tr>' +
                    '<td>' + studyItem.title + '</td>' +
                    '<td>' + studyItem.location + '</td>' +
                    '<td>' + studyItem.secretcode + '</td>' +
                    '<td>' + studyItem.state + '</td>' +
                    '<td>' + studyItem.start + '</td>' +
                    '<td>' + studyItem.end + '</td>' +
                    
                    '<td>' + studyItem.numeberapp + '</td>' +
                    '<td>' + "- - -" + '</td>' +

                    '<td>' + studyItem.numeberparticip + '</td>' +
                    '<td>' + userItem.name + '</br>'
                           + userItem.email + '</br>'
                           + userItem.dnasc + '</br>'
                           + userItem.gender +
                    '</td>' +

                    '<td>' + "MOOD" + '</td>' +
                    
                  '</tr>'
                );
              }
            //--> end userList.forEach
            });

          //--> end if (studyItem.participants != "")
          }
          
          if (studyItem.approved != "")
          {
            //console.log("Pending:\n"+studyItem.approved);
            userList.forEach(function(userItem)
            {
              //console.log("Approved:\n"+userItem.id);
              if (studyItem.approved.includes(userItem.id) == true)
              {
                //console.log(userItem.id);
                //console.log(userItem.id + " está no estudo " + studyItem.title);

                $('#export').append(
                  '<tr>' +
                    '<td>' + studyItem.title + '</td>' +
                    '<td>' + studyItem.location + '</td>' +
                    '<td>' + studyItem.secretcode + '</td>' +
                    '<td>' + studyItem.state + '</td>' +
                    '<td>' + studyItem.start + '</td>' +
                    '<td>' + studyItem.end + '</td>' +

                    '<td>' + studyItem.numeberapp + '</td>' +
                    '<td>' + userItem.name + '</br>'
                           + userItem.email + '</br>'
                           + userItem.dnasc + '</br>'
                           + userItem.gender +
                    '</td>' +

                    '<td>' + studyItem.numeberparticip + '</td>' +
                    '<td>' + "- - -" + '</td>' +

                    '<td>' + "MOOD" + '</td>' +
                  '</tr>'
                );
              }

            //--> end userList.forEach
            });
          
          //--> end studyItem.approved != ""
          }

          if (studyItem.participants == "" && studyItem.approved == "")
          {
            //console.log("Empty:\n"+studyItem.title);

            $('#export').append(
              '<tr>' +
                '<td>' + studyItem.title + '</td>' +
                '<td>' + studyItem.location + '</td>' +
                '<td>' + studyItem.secretcode + '</td>' +
                '<td>' + studyItem.state + '</td>' +
                '<td>' + studyItem.start + '</td>' +
                '<td>' + studyItem.end + '</td>' +

                '<td>' + studyItem.numeberapp + '</td>' +
                '<td>' + "- - -" + '</td>' +

                '<td>' + studyItem.numeberparticip + '</td>' +
                '<td>' + "- - -" + '</td>' +

                '<td>' + "MOOD" + '</td>' +
              '</tr>'
            );

          //--> end empty study
          }

        //--> end studyList.forEach
        });
        
        */
        //console.log(auxList);

        $("#export").show();
        //alert("here");
        //prepareData(filename);

      //--> end usersRef
      });
    });
  }

  function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
  }

  function prepareData(filename) 
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

    link.click();
  }