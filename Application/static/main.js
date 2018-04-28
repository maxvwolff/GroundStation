var map = null;
var marker = null;


//var allSatDataList = [];
var satList = [];
var satAboveList = [];

// Current sat
var sat_id = null;
var sat_name = null;
var sat_startTime = null;
var sat_endTime = null;
var sat_lat = null;
var sat_lon = null;
var sat_ele = null;
var tracking = false;

// tracking list
var trackingList = [];





function Comparator(a, b) {
	if (a[3] < b[3]) return -1;
	if (a[3] > b[3]) return 1;
	return 0;
}


//like an init function 
$(document).ready(function() {
	updateSatList();
	//updateTrackList
});


function updateMap() {
	if (map != null && marker != null && sat_lat != null && sat_lon != null) {
		// Get position of sat
		moveSat(map, marker, sat_lat, sat_lon);
	}
}


//here the information the tracking list contains will pe displayed
function updateSatInfo() {
	if (sat_startTime != null) {
		var now = new Date();
		var secondsToTrack = (sat_startTime - now) / 1000;
		//have to change here to show the right time 
		//maybe different condition
		if (sat_ele < 0) {
			document.getElementById("satInfo").style.display = "block";
			document.getElementById("satInfo").innerHTML = "The satellite will be tracked in <strong>" + Math.round(secondsToTrack) + " s</strong> !";
		} else {
			var durationTracking = (sat_endTime - now) / 1000;
			document.getElementById("satInfo").innerHTML = "The satellite will be tracked for <strong>" + Math.round(durationTracking) + " s</strong> !";
		}
	}
}

function updateAllSatData() {

}

function updateSatList() {
	$.ajax({
	type: "POST",
	url: "/getlist",
	data: "{}",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	success: function(msg) {
		//sort with ascending start time
		function Comparator(a, b) {
			if (a[3] < b[3]) return -1;
			if (a[3] > b[3]) return 1;
			return 0;
		}



		var newList = msg.output;
		newList.sort(Comparator);
		satList = [];
		satAboveList = [];

		//now change text in HTML
		var htmlString = "";
		var aboveStr = "";

		for (var i = 0; i < newList.length; i++) {
		  var startDate = new Date(newList[i][3] * 1000 + 7200000);
		  var endDate = new Date(newList[i][4] * 1000 + 7200000);
		  var norad_id = newList[i][1].substring(2, 7);
		  var sat_name = newList[i][0].trim();

		  var ele = newList[i][5];
		  var azi = newList[i][6];
		  var alt = newList[i][7];
		  var lat = newList[i][8];
		  var lon = newList[i][9];

		  var hideBtnStr = "";
		  if (tracking) {
		  	hideBtnStr = "disabled ";
		  }
		  //adding to the SatList
		  htmlString += "<div id=sat_" + norad_id + " class='collection-item active #01579b light-blue darken-4'><h6>" + newList[i][0] + " [" + norad_id + "] </h6> <p><br> Starting at: " + startDate.toTimeString()+ "  <br>Ending at: "+ endDate.toTimeString() + "<br> Beacon: 145.800 MHz  Downlink: 437.540 MHz</p>   <a onclick='trackSat(" + norad_id + ", \"" + sat_name + "\")' class='trackBtn btn-floating " + hideBtnStr + "waves-effect waves-light blue' style='margin-top: -142px; float: right;'><i class='material-icons'>center_focus_strong</i></a></div>";

		  var satInfo = [norad_id, sat_name, startDate, endDate, alt, azi, ele, lat, lon];
		  satList.push(satInfo);

		  if (ele > 0) {
		  	// Sat is above horizon
		  	satAboveList.push(satInfo);
		  	//adding to the satAbove list
		  	aboveStr += "<div id=satAbove_" + norad_id + " class='collection-item active light-blue darken-2'><h6>" + newList[i][0] + " [" + norad_id + "] </h6> <p><br>Ending at: "+ endDate.toTimeString() + "<br> Beacon: 145.800 MHz  Downlink: 437.540 MHz</p>   <a onclick='trackSat(" + norad_id + ", \"" + sat_name + "\")' class='trackBtn btn-floating " + hideBtnStr + "waves-effect waves-light blue' style='margin-top: -142px; float: right;'><i class='material-icons'>center_focus_strong</i></a></div>";
		  }

		  if (norad_id == sat_id) {
		  	sat_lat = lat;
		  	sat_lon = lon;
		  	sat_ele = ele;
		  }
		}

		document.getElementById("satList").innerHTML = htmlString;
		document.getElementById("listloader").style.display = "none";

		document.getElementById("satsAbove").innerHTML = aboveStr;
		document.getElementById("listloader2").style.display = "none";
	 }
	});
}

//main programm -----------------------------------------------------------------------

var interval1 = setInterval(updateMap, 500);
var interval2 = setInterval(updateSatInfo, 500); 
var interval3 = setInterval(updateSatList, 500);
var interval4 = setInterval(updateTrackingList, 500);


//--------------------------------------------------------------------------------------

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

function addToTrackingList(satellite/*satelllite from newList*/) {
	console.log("valid satellite:", satellite);

	var satelliteDate = Date.parse(satellite[2]);
	var satelliteEndDate = Date.parse(satellite[3]);
	index = 0;
	if (satelliteDate > satelliteEndDate) {
		console.log("End is before next start! Impossible to add (yet)!");
	}
	//check if trackingList already contains something
	
	else if (trackingList.length == 0) {
		trackingList.splice(index, 0, satellite);
	} else {
	
	for (var i = 0; i < trackingList.length + 1; i++) {
		console.log("Geht durch die trackingList durch");
		//var satelliteDate = Date.parse(satellite[2]);
		console.log("i:", i);
		var trackingListDate = Date.parse(trackingList[i][2]);
		if (satelliteDate > trackingListDate) {
			//add case, that it's at the end of the list
			if (index == trackingList.length - 1){
					console.log("index = trackingList.length - 1")
				if (satelliteDate > Date.parse(trackingList[i][3])){
					console.log("It doesn't collide. Let's add the satellite");
					trackingList.splice(index + 1, 0, satellite);
					break;
				}else{
					console.log("It would collide");
					break;
				}
				
			}else{
			index = index + 1;
			console.log("Erhoeht index um 1, index:", index);
			}
		}else if (index == trackingList.length){
			console.log("Springt komischerweise nicht in else");
		
		} else {
			console.log("Just about to add something");
			//two satellites shouldn't be tracked at the same time

			//if it starts earlier than the first satellite in trackingList -> this case works now
			if (i== 0) {
				console.log(satellite[3]);
				//var satelliteEndDate = Date.parse(satellite[3]);
				console.log("i == 0");
				console.log("satelliteEndDate",satelliteEndDate, "startDateTrackingList", Date.parse(trackingList[i][3]));
				//now check out if it finished before the next starts
				if (satelliteEndDate < Date.parse(trackingList[i][2])) {
					console.log("Doesn't collide");
					trackingList.splice(index, 0, satellite);
				}else{
					console.log("Error, two satellites collide!");
				}
				
			//check out if beginning of new sat doesn't collide ending of sat on trackingList
			}else if (satelliteDate > Date.parse(trackingList[i - 1][3])){
				//var satelliteEndDate = Date.parse(satellite[3]);
				console.log("Already contains something -> ready to go");
				console.log("i", i);
				console.log("satelliteEndDate", satelliteEndDate);
				console.log("startingDate of next Sat on trackingList", Date.parse(trackingList[i][2]));
				//now check o
				if (satelliteEndDate < Date.parse(trackingList[i][2])) {
					
					console.log("Doesn't collide");
					trackingList.splice(index, 0, satellite);
				}else{
					console.log("Error, two satellites collide!");
				}
			} else {
				console.log("Error, two satellites collide");
			}
			break;

		}
	}
}


	console.log(trackingList)
}

function updateTrackingList() {
	//if the satellite at the first place is the same like the satellite that's currently tracked, remove it from the list
	currentDate = new Date();
	currentTime = currentDate.getTime();
	//checkout if trackingList already contain ssomething
	if (trackingList.length == 0) {
		console.log("NO trackingList yet!");
		$("#trackingList").html("");

	}
	else {
		console.log("trackingList contains something");
		var trackingListString = "";
		if (trackingList[0][2].getTime() < currentTime /*- 2000 */) {
			console.log("Have to delete satellite");
			console.log("startTime:", trackingList[0][2].getTime());
			console.log("currentTime:", currentTime);
			//track the satellite
			//remove the satellite fom the list
			trackingList.splice(0, 1);
			console.log(trackingList);
		}

		for (var i = 0; i < trackingList.length; i++) {
		 	var startDate = trackingList[i][2] ;
		 	var endDate = trackingList[i][3] ;
			var norad_id = trackingList[i][0];
			var sat_name = trackingList[i][1];


		  	var hideBtnStr = "";
		  	if (tracking) {
		  		hideBtnStr = "disabled ";
		  	}

		//put the html stuff here -> no trackingListString yet
		//hideBtnStr = "enabled ";

		trackingListString += "<div id=trackingList" + norad_id + " class='collection-item active #01579b light-blue darken-4'><h6>" + sat_name + " [" + norad_id + "] </h6> <p><br> Starting at: " + startDate.toTimeString()+ "  <br>Ending at: "+ endDate.toTimeString() + "<br> Beacon: 145.800 MHz  Downlink: 437.540 MHz</p>   <a onclick= 'deleteSatelliteFromTrackingList(" + norad_id + ")' class='trackBtn btn-floating " + hideBtnStr + "waves-effect waves-light blue' style='margin-top: -142px; float: right;'><i class='material-icons'>center_focus_strong</i></a></div>";
		//console.log(trackingListString);


		//try something new with html elements here
		$("#trackingList").html(trackingListString);



		}
	}
}

function print(){
	console.log("printing works");
}

function deleteSatelliteFromTrackingList(norad_id) {
	console.log("Attempt to delete something");

	//search for the right satellite with the norad id
	for (var i = 0; i < trackingList.length; i++) {
		if (trackingList[i][0] == norad_id) {
			trackingList.splice(i, 1);
			console.log("Satellite removed");
			break;
		}

	}
}



//will only be called if clicked on satellite which is already in the sky
function trackSat(norad_id, sat_name) { //will be changed to allow lists

	
	//tracking = true;
	document.getElementById("trackPanel").style.display = "block";
	var btn_ele = document.getElementsByClassName('trackBtn');

	document.getElementById("currentSatName").innerHTML = sat_name;



	// global vars
	sat_id = norad_id;
	sat_name = sat_name;


	for (var i = 0; i < satList.length; i++) {
		var satInfo = satList[i];
		if (satInfo[0] == norad_id) {
			sat_startTime = satInfo[2];
			sat_endTime = satInfo[3];
			sat_lat = satInfo[7];
			sat_lon = satInfo[8];

			satellite = satInfo;
			addToTrackingList(satellite)
		}
	}
}

function cancelTrack() {
	tracking = false;
	document.getElementById("trackPanel").style.display = "none";
	var btn_ele = document.getElementsByClassName('trackBtn');
	for (var i = 0; i < btn_ele.length; ++i) {
	    btn_ele[i].classList.remove("disabled");
	}
}