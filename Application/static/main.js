//like an init function 
$(document).ready(function() {
	$.ajax({
	type: "POST",
	url: "/getlist",
	data: "{}",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	success: function(msg) {
		//now it's pirnted correctly
	  console.log(msg.output);
	  //sort with ascending start time

	  function Comparator(a, b) {
	  	if (a[3] < b[3]) return -1;
	  	if (a[3] > b[3]) return 1;
	  	return 0;
	  }



	  var newList = msg.output;
	  newList.sort(Comparator);

	 console.log(newList);

	  //now change text in HTML
	  var htmlString = ""
	  for (var i = 0; i < newList.length; i++) {
		  var startDate = new Date(newList[i][3] * 1000 + 7200000);
		  var endDate = new Date(newList[i][4] * 1000 + 7200000);
		  console.log(startDate);
		   htmlString += "<div class='collection-item active #01579b light-blue darken-4'><h6>" + newList[i][0] + " [12345] </h6> <p><br> Starting at: " + startDate.toTimeString()+ "  <br>Ending at: "+ endDate.toTimeString() + "<br> Beacon: 145.800 MHz  Downlink: 437.540 MHz</p>   <a class='btn-floating waves-effect waves-light blue' style='margin-top: -142px; float: right;'><i class='material-icons'>center_focus_strong</i></a></div>";
	  }
	  document.getElementById("satList").innerHTML = htmlString;
	 }
	});
});


function myFunction() {
	document.getElementById("response").innerHTML = "Enter Something";
		}

function trackSatellite() {
	//check if data is correct or id something is missing
	//document.getElementById("response").innerHTML = document.getElementById("line1").value;



	if (document.getElementById("line1").value == "") {
		document.getElementById("response").innerHTML = "line 1 is missing";
	} else if (document.getElementById("line2").value == "") {
		document.getElementById("response").innerHTML = "line 2 is missing";
	} else if (document.getElementById("line3").value == "") {
		document.getElementById("response").innerHTML = "line 3 is missing";
	}



	//send it to the ground station


}

