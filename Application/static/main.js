//like an init function
$(document).ready(function() {
	$.ajax({
	type: "POST",
	url: "/getlist",
	data: "{}",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	success: function(msg) {
	  console.log(msg);
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

