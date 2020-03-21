
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

          //console.log(auxList.toString());
          var str = auxList.toString();

          var app = appList.toString();

          //console.log(userID+", "+str.includes(userID));

          //alert(str);

          /*
          var before;
          var arr0 = []; 

          var first;
          var notFirst;

          var second;
          var notSecond;

          var arr1 = [];
          var arr2 = [];*/

          if (str.includes(userID) == true)
          {
            //alert(JSON.stringify(studyList));
            studyList.forEach(function(item)
            {
              //alert("Item = "+item.participants);
              if (item.participants != "")
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
                    
                    '<td>' + fname +' '+ lname + '</br>'
                           + email + '</br>'
                           + dnasc + '</br>'
                           + gender 
                    + '</td>' +
                  '</tr>'+ '</br>'
                );
                /*
                first = '<tr>' +
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
                           + gender 
                    + '</td>';

                arr1.push(first);*/
              /* end if item.participants != ""*/
              }
            /* end studyList.forEach */  
            });
          
          /* end str.includes(userID) */  
          }
          else
          {
            studyList.forEach(function(item)
            {
              //alert("Item = "+item.participants);
              if (item.participants == "")
              {
                /*notFirst = '<tr>' +
                    '<td>' + item.title + '</td>' +
                    '<td>' + item.location + '</td>' +
                    '<td>' + item.secretcode + '</td>' +
                    '<td>' + item.state + '</td>' +
                    '<td>' + item.start + '</td>' +
                    '<td>' + item.end + '</td>' +
                    '<td>' + item.numeberparticip + '</td>' +
                    
                    '<td>' + "- - -" + '</td>';

                arr1.push(notFirst);*/

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
                  '</tr>' + '</br>'
                );
              /* end if item.participants != ""*/
              }
            /* end studyList.forEach */  
            });
          /* end else str.includes */  
          }

          if (app.includes(userID) == true)
          {
            studyList.forEach(function(item)
            {
              if (item.approved != "")
              {
                /*second =
                  '<td>' + item.numeberapp + '</td>' +
                  
                  '<td>' + fname +' '+ lname + '</br>'
                         + email + '</br>'
                         + dnasc + '</br>'
                         + gender 
                  + '</td>' +
                '</tr>';

                arr2.push(second);*/

                $('#export').append(
                  '<tr>' +
                    '<td>' + item.title + '</td>' +
                    '<td>' + item.location + '</td>' +
                    '<td>' + item.secretcode + '</td>' +
                    '<td>' + item.state + '</td>' +
                    '<td>' + item.start + '</td>' +
                    '<td>' + item.end + '</td>' +

                    '<td>' + item.numeberparticip + '</td>' + //n part
                    '<td>' + "- - -" + '</td>' + //part

                    '<td>' + item.numeberapp + '</td>' + //n pending
                    '<td>' + fname +' '+ lname + '</br>'
                           + email + '</br>'
                           + dnasc + '</br>'
                           + gender 
                    + '</td>' +
                  '</tr>' + '</br>'
              );
              }
            /* end studyList forEach */
            });
          /* end app includes */  
          }
          else
          {
            studyList.forEach(function(item)
            {
              /*notSecond =
                  '<td>' + item.numeberparticip + '</td>' +
                  
                  '<td>' + "- - -" + '</td>' +
                '</tr>';

              arr2.push(notSecond);*/

              $('#export').append(
                '<tr>' +
                  '<td>' + item.title + '</td>' +
                  '<td>' + item.location + '</td>' +
                  '<td>' + item.secretcode + '</td>' +
                  '<td>' + item.state + '</td>' +
                  '<td>' + item.start + '</td>' +
                  '<td>' + item.end + '</td>' +

                  '<td>' + "- - -" + '</td>' + //n part
                  '<td>' + "- - -" + '</td>' + //part

                  '<td>' + item.numeberapp + '</td>' +
                  '<td>' + "- - -" + '</td>' + //pending
                '</tr>'+ '</br>'
              );


            /* end studyList forEach */
            });
          /* end else */ 
          }

          /*
          console.log("Array 1 size\n"+arr1.length);
          console.log("Array 2 size\n"+arr2.length);

          for (var i = 0; i < arr1.length; i++)
          {
            var line1 = arr1[i];
            //console.log("Array 1\n"+line1);

            var line2 = arr2[i];
            //console.log("Array 2\n"+line2);

            var appending = line1+line2;
            console.log(appending);

            $('#export').append(appending);
          }
          */
  
        /* end userSnap */
        });