/* get data and show on table */
  function getDataShowTable(filename)
  {
    var studyObj = {};
    var studyList = [];

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
      });

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
        }
      /* end studyList */  
      });

    });

    $("#export").show();

    

    /* prepare data */
    //prepareData(filename);
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

          var newLine = myLine.replace(/<br>/g, '\t');

          line.push(newLine);
        }
        else
        {
          line.push(cols[j].innerText);
        }
      }
      console.log("Linha:\n"+line);

      csv.push(line);
    }

    let csvContent = "data:text/csv;charset=utf-8,";

    for (var i = 0; i < csv.length; i++)
    {
      //console.log("CSV["+i+"]: "+csv[i]);
      //console.log(csv[i]);

      var line = csv[i];

      for (var j = 0; j < csv[i].length; j++)
      {
        //console.log(line[j]);

        if (csv[i][j].includes("\n") == true)
        {
          //console.log("here"+line[j]);
          csv[i][j].replace('\n', 'X');
        }
      }

      console.log("CSV:\n"+csv[i]);

      csvContent += csv[i]+ "\r\n";
    }

    //downloadData(csvContent, filename);
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