// Froxy Client
// Ollie Phillips 2018

// element assignment
var showC = document.getElementById("show-config");
var hideC = document.getElementById("hide-config");
var start = document.getElementById("start-tracking");
var stop = document.getElementById("stop-tracking");
var config = document.getElementById("config");
var stat = document.getElementById("status");
var clientID = document.getElementById("client-id");
var accessKey = document.getElementById("access-key");

// nosleep
var noSleep = new NoSleep();

// geolocation
var gl;
var gOpts = {
	enableHighAccuracy: true
};

// froxy
var froxyURI = "https://froxy.eu-gb.mybluemix.net/client/";
var maxPollFreq = 60;
var noPoll = false;

// event listeners
showC.addEventListener("click", showConfig);
hideC.addEventListener("click", hideConfig);
start.addEventListener("click", startTracking);
stop.addEventListener("click", stopTracking);

// show config
function showConfig(){
	config.classList.remove("hidden");
	hideC.classList.remove("hidden");
	showC.classList.add("hidden");
}

// hide config
function hideConfig(){
	config.classList.add("hidden");
	showC.classList.remove("hidden");
	hideC.classList.add("hidden");
}

// tracking start
function startTracking(){
	// got config?
	if (checkConfig() == true) {
		updateStatus("Started")
		start.classList.add("hidden");
		stop.classList.remove("hidden");
		noSleep.enable();
		if (navigator.geolocation) {
			gl = navigator.geolocation.watchPosition(requester, failed, gOpts);
		} 
	}
}

// tracking stop
function stopTracking(){
	updateStatus("Stopped");
	stop.classList.add("hidden");
	start.classList.remove("hidden");
	navigator.geolocation.clearWatch(gl);
	noSleep.disable();
}

// helper for updating status
function updateStatus(msg){
	stat.innerText = msg + "...";
}

// ensure we have settings configured
function checkConfig(){
	if (clientID.value == "" || accessKey.value == "") {
		alert("Please configure first. Click 'Show config'");
		return false;
	}
	return;
}

// if geolocation fails
function failed(){
	alert("geoposition not available");
}

// handler to poll froxy on receipt of
// position information
function requester(position) {
	if (!noPoll) {
		noPoll = true;
		setTimeout(function(){noPoll = false;}, maxPollFreq * 1000);
		// makes AJAX call to froxy
		var target = froxyURI + accessKey.value;
		updateStatus("Tracking");
		fetch(target, {
			method: 'GET', 
			mode: 'cors', 
			headers: new Headers({
				'Client-ID': clientID.value,
				'Lat-Pos': position.coords.latitude,
				'Lng-Pos': position.coords.longitude
			})
		}).then(function(response) {
			updateStatus("Response code: " + response.status);
			setTimeout(function(){
				updateStatus("Idle");
			},2000);
		});
	} 
}