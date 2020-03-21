function getDataShowTable(filename)
  {
    var studyObj = {};
    var studyList = [];
    
    var partcipantObj = {};
    var partcipantList = [];

    var approvedObj = {};
    var approvedList = [];

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
        '<th>Number participants</th>'+
        '<th>Participants</th>'+
        '<th>Number pending checkin</th>'+
        '<th>Pending checkin</th>'+
      '</tr>'
    );

    studyRef.once('value', function(studySnap)
    {
      studySnap.forEach(function(studyChild)
      {
        var s = studyChild.val();

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

            partcipantObj = {
              title: title,
              location: location,
              secretcode: magicword,
              state: state,
              start: startdate,
              end: stateTmp,
              size: pSize,
              participant: pChild
            };

            partcipantList.push(partcipantObj);
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
              filteredApproved.push(aChild);

              approvedObj = {
                title: title,
                location: location,
                secretcode: magicword,
                state: state,
                start: startdate,
                end: stateTmp,
                size: aSize,
                approved: aChild
              };

              approvedList.push(approvedObj);
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
      });

      /*
      partcipantList.forEach(function(item)
      {
        console.log("Item title:\n"+item.title);
        console.log("Item location:\n"+item.location);
        console.log("Item participant:\n"+item.participant);

        var usersRef = dbRef.child('personal_data/'+item.participant);
            usersRef.once('value', function(userSnap)
            {
              var user = userSnap.val();

              var fname = user.fname;
              var lname = user.lname;
              var email = user.email;
              var dnasc = user.birthday;
              var gender = user.gender;

              //console.log("Vou tratar do user "+fname+" do estudo "+item.title);
              
              $('#export').append(
                '<tr>' +
                  '<td>' + item.title + '</td>' +
                  '<td>' + item.location + '</td>' +
                  '<td>' + item.secretcode + '</td>' +
                  '<td>' + item.state + '</td>' +
                  '<td>' + item.start + '</td>' +
                  '<td>' + item.end + '</td>' +
                  '<td>' + item.size + '</td>' +

                  '<td>' + fname +' '+ lname + '</br>'
                         + email + '</br>'
                         + dnasc + '</br>'
                         + gender +
                  '</td>' +

                  '<td>' + "- - -" + '</td>' +
                  '<td>' + "- - -" + '</td>' +
                '</tr>'
              );

              prepareData(filename);

            });
      });
      */
      
      studyList.forEach(function(item)
      {
        //console.log("Processando estudo "+item.title);
        if (item.participants != "")
        {
          item.participants.forEach(function(p)
          {
            //console.log(p);

            var usersRef = dbRef.child('personal_data/'+p);
            usersRef.once('value', function(userSnap)
            {
              var user = userSnap.val();

              var fname = user.fname;
              var lname = user.lname;
              var email = user.email;
              var dnasc = user.birthday;
              var gender = user.gender;

              //console.log("Vou tratar do user "+fname+" do estudo "+item.title);
              
              $('#export').append(
                '<tr>' +
                  '<td>' + item.title + '</td>' +
                  '<td>' + item.location + '</td>' +
                  '<td>' + item.secretcode + '</td>' +
                  '<td>' + item.state + '</td>' +
                  '<td>' + item.start + '</td>' +
                  '<td>' + item.end + '</td>' +
                  '<td>' + item.numeberparticip + '</td>' +

                  '<td>' + fname +' '+ lname + '</br>'
                         + email + '</br>'
                         + dnasc + '</br>'
                         + gender +
                  '</td>' +

                  '<td>' + item.numeberapp + '</td>' +
                  '<td>' + "- - -" + '</td>' +
                '</tr>'
              );

              prepareData(filename);
            });
          });
        }
        else if (item.approved != "")
        {
          item.approved.forEach(function(a)
          {
            //console.log(a);

            var usersRef = dbRef.child('personal_data/'+a);
            usersRef.once('value', function(userSnap)
            {
              var user = userSnap.val();

              var fname = user.fname;
              var lname = user.lname;
              var email = user.email;
              var dnasc = user.birthday;
              var gender = user.gender;
              
              $('#export').append(
                '<tr>' +
                  '<td>' + item.title + '</td>' +
                  '<td>' + item.location + '</td>' +
                  '<td>' + item.secretcode + '</td>' +
                  '<td>' + item.state + '</td>' +
                  '<td>' + item.start + '</td>' +
                  '<td>' + item.end + '</td>' +

                  '<td>' + item.numeberparticip + '</td>' +
                  '<td>' + " " + '</td>' +

                  '<td>' + item.numeberapp + '</td>' +
                  '<td>' + fname +' '+ lname + '</br>'
                         + email + '</br>'
                         + dnasc + '</br>'
                         + gender +
                  '</td>' +
                '</tr>'
              );

              prepareData(filename);
            });
          });
        } 
        else if(item.participants == "" && item.approved == "")
        {
          $('#export').append(
            '<tr>' +
              '<td>' + item.title + '</td>' +
              '<td>' + item.location + '</td>' +
              '<td>' + item.secretcode + '</td>' +
              '<td>' + item.state + '</td>' +
              '<td>' + item.start + '</td>' +
              '<td>' + item.end + '</td>' +

              '<td>' + item.numeberparticip + '</td>' +
              '<td>' + "- - -" + '</td>' +

              '<td>' + item.numeberapp + '</td>' +
              '<td>' + "- - -" + '</td>' +
            '</tr>'
          );

          prepareData(filename);
        }
      // end studyList
      });

    });

    $("#export").show();
    alert("here");