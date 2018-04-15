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
		  var norad_id = newList[i][1].substring(2, 7);
		  console.log(startDate);
		   htmlString += "<div id=sat_" + norad_id + " class='collection-item active #01579b light-blue darken-4'><h6>" + newList[i][0] + " [" + norad_id + "] </h6> <p><br> Starting at: " + startDate.toTimeString()+ "  <br>Ending at: "+ endDate.toTimeString() + "<br> Beacon: 145.800 MHz  Downlink: 437.540 MHz</p>   <a onclick='trackSat(" + norad_id + ")' class='trackBtn btn-floating waves-effect waves-light blue' style='margin-top: -142px; float: right;'><i class='material-icons'>center_focus_strong</i></a></div>";
	  }
	  document.getElementById("satList").innerHTML = htmlString;
	  document.getElementById("listloader").style.display = "none";
	 }
	});
});

var i = 0;
var map = null;
var marker = null;

function updateMap() {
	if (map != null && marker != null) {
		moveSat(map, marker, 50.323035 + i, 7.265747 + i);
		i += 0.001;
	}
}

var interval = setInterval(updateMap, 500);

function initMap() {
	console.log("Init map...");
	var sat = {lat: 50.323035, lng: 7.265747};
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 4,
	  center: sat
	});
	marker = new google.maps.Marker({
	  position: sat,
	  map: map
	});
}

function moveSat(map, marker, lat, lon) {
    marker.setPosition( new google.maps.LatLng( lat, lon ) );
    map.panTo( new google.maps.LatLng( lat, lon ) );
}

function trackSat(norad_id) {
	document.getElementById("trackPanel").style.display = "block";
	var btn_ele = document.getElementsByClassName('trackBtn');
	for (var i = 0; i < btn_ele.length; ++i) {
	    btn_ele[i].classList.add("disabled");
	}
}

function cancelTrack() {
	document.getElementById("trackPanel").style.display = "none";
	var btn_ele = document.getElementsByClassName('trackBtn');
	for (var i = 0; i < btn_ele.length; ++i) {
	    btn_ele[i].classList.remove("disabled");
	}
}