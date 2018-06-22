'use strict';

//////////////////////////
//    setup of voice webkit
/////////////////////////

// declaring global webkitSpeech object
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

//parameters
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;

//parameters
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;

recognition.onresult = function (event) {
  console.log('You said: ', event.results[0][0].transcript);
  var ret = event.results[0][0].transcript;
  document.getElementById("statusbutton").innerHTML = "You said: " + ret;
  // remove prefix words
  ret = ret.replace('to the ', '');
  ret = ret.replace('to', '');
  ret = ret.replace('go ', '');
  ret = ret.replace('move ', '');
  ret = ret.replace('drive ', '');
  ret = ret.replace('turn ', '');
  //similar words
  ret = ret.replace('forward', 'front');
  ret = ret.replace('backward', 'back');
  commandPi( ret );
  //console.log('final is: ' + ret);
};

recognition.onend = function () {
  //console.log('end');
  document.getElementById("robotButton").innerHTML = "Voice Command";
  if (  document.getElementById("statusbutton").innerHTML == "Give command for the robot to go in direction" ) {
    document.getElementById("statusbutton").innerHTML = "Didnt hear anything";
  }
};



//try {
//= recognition.start();
//} catch (err) {  /* console.log(err)*/ }

//////////////////////////
//    injecting the video stream
/////////////////////////

 var streamHost = window.streamHost;

function prepareFrame(url) {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", url);
  ifrm.style.width = "660px";
  ifrm.style.height = "500px";
  ifrm.style.border = "0px";
  document.getElementById('piVexStream').appendChild(ifrm);
}
prepareFrame(streamHost);

//////////////////////////
//    requests function
/////////////////////////

var direction = '';
var commandHost = window.commandHost;

function commandPi( direction ){
  httpGetAsync(commandHost, direction);
}

function httpGetAsync(theUrl, direction  , callback ) {
  var xmlHttp = new XMLHttpRequest();
  // xmlHttp.onreadystatechange = function () {
  //   if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
  //     callback(xmlHttp.responseText);
  // }
  xmlHttp.open("GET", theUrl + '/' + direction , true); // true for asynchronous 
  xmlHttp.send(null);
}

//////////////////////////
//    next code
/////////////////////////

function listenCommand() {
  recognition.start();
  document.getElementById("robotButton").innerHTML = "Listening... ";
  document.getElementById("statusbutton").innerHTML = "Give command for the robot to go in direction";
}
