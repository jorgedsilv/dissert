studyList.forEach(function(item)
{
	if ( (item.participants != "") && (str.includes(userID) == true) )
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
					   + gender + 
				'</td>' +

				'<td>' + " " + '</td>' + //n pending
	            '<td>' + " " + '</td>' + //pending
			'</tr>'
		);
	}
	else if ( (item.approved != "") && (app.includes(userID) == true))
	{
		$('#export').append(
			'<tr>' +
				'<td>' + item.title + '</td>' +
				'<td>' + item.location + '</td>' +
				'<td>' + item.secretcode + '</td>' +
				'<td>' + item.state + '</td>' +
				'<td>' + item.start + '</td>' +
				'<td>' + item.end + '</td>' +

	            '<td>' + " " + '</td>' + //n part
	            '<td>' + " " + '</td>' + //part

	            '<td>' + item.numeberapp + '</td>' + //n pending
	            '<td>' + fname +' '+ lname + '</br>'
			           + email + '</br>'
			           + dnasc + '</br>'
			           + gender +
	            '</td>' +
            '</tr>'
        );
	}
	else
	{
		$('#export').append(
			'<tr>' +
				'<td>' + item.title + '</td>' +
				'<td>' + item.location + '</td>' +
				'<td>' + item.secretcode + '</td>' +
				'<td>' + item.state + '</td>' +
				'<td>' + item.start + '</td>' +
				'<td>' + item.end + '</td>' +

	            '<td>' + " " + '</td>' + //n part
	            '<td>' + " " + '</td>' + //part

	            '<td>' + " " + '</td>' + //n pending
	            '<td>' + " " + '</td>' + //n pending
            '</tr>'
        );
	}
/* end studyList forEach */
}