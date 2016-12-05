$(document).ready(function() {
    threeInit();
    getElements();
    addEventListeners();
    initMp3Player();
    loadAudioFromSC(DEFAULT_SC_MUSIC);
});

function getElements() {
  soundcloudURL = document.getElementById("soundcloud-url");
  audio = document.getElementById("audio-player");
  volumeBar = document.getElementById("volumeBar");
  seekbar = document.getElementById("seekbar");
  pausePlay = document.getElementById("pause_play");
  currentTime = document.getElementById("currentTime");
  maxTime = document.getElementById("maxTime");
  volumeValue = document.getElementById("volumeValue");
  repeatToggle = document.getElementById("repeat_toggle");
  micToggle = document.getElementById("mic_toggle");
  audioTitle = document.getElementById("audio-title");
  pulseToggle = document.getElementById("pulseToggle");
}

function addEventListeners() {
  //event listener for when user presses enter
  soundcloudURL.addEventListener("keypress", function(e) {
      if(e.which === 13) {
        loadAudioFromSC(soundcloudURL.value);
      }
  });

  //event listeners to change the internal text
  soundcloudURL.addEventListener("click", function(e) {
    soundcloudURL.value = "";
  });

  soundcloudURL.addEventListener("blur", function(e) {
    soundcloudURL.value = "Soundcloud URL";
  });

  //fade in fade out of volume controls, seek bar, input div, pulsing toggle
  $("#volumeControl").hover(function() {$("#volumeslider").stop(true, false).fadeTo(500, 1);},
    function() {$("#volumeslider").stop(true, false).fadeTo(500, 0);});

  $("#audio-controls").hover(function() {$("#timeControl").stop(true, false).fadeTo(500, 1);},
    function() {$("#timeControl").stop(true, false).fadeTo(500, 0);});

  $("#audio-input").hover(function() {$("#audio-input").stop(true, false).fadeTo(500, 1);},
    function() {$("#audio-input").stop(true, false).fadeTo(500, 0); $("#soundcloud-url").trigger("blur");});

  $("#pulseToggle").hover(function() {$("#pulseToggle").stop(true, false).fadeTo(500, 1);},
    function() {$("#pulseToggle").stop(true, false).fadeTo(500, 0); $("#soundcloud-url").trigger("blur");});

}

// animation loop
function frameLooper(){
    window.requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00CCFF";
    bars = 128;
    for (var i = 0; i < bars; i++){
        bar_x = i * 3;
        bar_width = 2;
        bar_height = -(fbc_array[i*2]/2);
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
    updateSphereSizeColor();
    cyclePulseSpheres();
}

var rOffset = 0, gOffset = 0, bOffset = 0;
function updateSphereSizeColor() {
    var hue;
    //change overall hue randomly
    if(Math.random() < hueChangeProbability) {
      hue = Math.trunc(Math.random() * 6);
      switch(hue) { //6 different hues, roygbv
        case 0: //red
          rOffset = hueSensitivity;
          gOffset = -hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 1: //orange
          rOffset = hueSensitivity;
          gOffset = 0.5*hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 2: //yellow
          rOffset = hueSensitivity;
          gOffset = hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 3: //green
          rOffset = -hueSensitivity;
          gOffset = hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 4: //blue
          rOffset = -hueSensitivity;
          gOffset = -hueSensitivity;
          bOffset = hueSensitivity;
          break;
        case 5: //violet
          rOffset = hueSensitivity;
          gOffset = -hueSensitivity;
          bOffset = hueSensitivity;
          break;
      }
    }

    var changeOuter = function(i) {
        var val = (fbc_array[i] == 0) ? 0x88 : fbc_array[i];
        var val2 = (fbc_array[i + 10] == 0) ? 0x88 : fbc_array[i+10];
        var val3 = (fbc_array[i + 20] == 0) ? 0x88 : fbc_array[i+20];
        outerSpheres[i].material.color = new THREE.Color(val/350 + rOffset, val2/350 + gOffset, val3/350 + bOffset);
        var size = (fbc_array[i] == 0) ? 0.15 : val/300;
        outerSpheres[i].scale.set(size, size, size);
    }
    var changeInner = function(i) {
        var val = (fbc_array[i] == 0) ? 0x88 : fbc_array[i] - 50;
        var val2 = (fbc_array[i + 10] == 0) ? 0x88 : fbc_array[i+10] - 50;
        var val3 = (fbc_array[i + 20] == 0) ? 0x88 : fbc_array[i+20] - 50;
        innerSpheres[i].material.color = new THREE.Color(val/350 + rOffset, val2/350 + gOffset, val3/350 + bOffset);
        var size = (fbc_array[i] == 0) ? 0.15 : val/255;
        innerSpheres[i].scale.set(size, size, size);
    }

    for (var i=0; i<innerSpheres.length; i++) {
        changeInner(i);
    }

    for (var i=0; i<outerSpheres.length; i++) {
        changeOuter(i);
    }
}

//rotate outer spheres around inner spheres
var currentDirection = 0; //0 for rotate about x, 1 about y, 2 about z
var ccw = 1;
var average = 0, prevAverage = 0; //smooth the pulsing by taking the average of current  frame with previous frame
function cyclePulseSpheres(t) {
    var radius, x, y, z, theta;
    average = (averageAmplitude()/40) + 10;

    //change direction randomly
    if(Math.random() < revolutionChangeProbability) {
      currentDirection = Math.trunc(Math.random() * 3);
      ccw = (Math.random() < 0.5) ? -1 : 1;
    }

    //rotate outer spheres
    for (var i = 0; i < outerSpheres.length; i++) {
        x = outerSpheres[i].position.x;
        y = outerSpheres[i].position.y;
        z = outerSpheres[i].position.z;

        if(currentDirection == 0) {
          radius = Math.sqrt((y*y) + (z*z));
          theta = Math.atan2(y, z);
          outerSpheres[i].position.z = radius*Math.cos(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.y = radius*Math.sin(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.x = x;
        } else if(currentDirection == 1) {
          radius = Math.sqrt((z*z) + (x*x));
          theta = Math.atan2(z, x);
          outerSpheres[i].position.x = radius*Math.cos(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.z = radius*Math.sin(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.y = y;
        } else {
          radius = Math.sqrt((x*x) + (y*y));
          theta = Math.atan2(x, y);
          outerSpheres[i].position.y = radius*Math.cos(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.x = radius*Math.sin(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.z = z;
        }

        if(radiusPulsingEnable)
          outerSpheres[i].position.setLength(radiusScaling*(average + prevAverage)/2);
        else
          outerSpheres[i].position.setLength(10);
    }

    for (var i = 1; i < innerSpheres.length; i++) {
      x = innerSpheres[i].position.x;
      y = innerSpheres[i].position.y;
      z = innerSpheres[i].position.z;
      radius = Math.sqrt((z*z) + (x*x));
      theta = Math.atan2(z, x);
      innerSpheres[i].position.x = radius*Math.cos(theta + innerRevolutionSpeed);
      innerSpheres[i].position.z = radius*Math.sin(theta + innerRevolutionSpeed);
      innerSpheres[i].position.y = y;
    }

    prevAverage = average;
}

function initMp3Player(){
    context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = smoothingConstant;
    canvas = document.getElementById('simple_fft');
    ctx = canvas.getContext('2d');
    source = context.createMediaElementSource(document.getElementById("audio-player"));
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
}

//read audio upload from user
function readMusic(input) {
  if(input.files && input.files[0]) {
    audio.src = URL.createObjectURL(input.files[0]);
    audioTitle.innerHTML = input.files[0].name.slice(0,-4);
    playAudio();
  }
}

//play/pause button
function toggleAudio() {
  if(micToggle.dataset.state == "off") { //only allow toggling if music loaded and mic is off
    if(pausePlay.dataset.state == "pause") {
      pauseAudio();
    } else {
      playAudio();
    }
  }
}

function playAudio() {
  audio.play();
  pausePlay.src = "img/pause.png";
  pausePlay.dataset.state = "pause";
}

function pauseAudio() {
  audio.pause();
  pausePlay.src = "img/play.png";
  pausePlay.dataset.state = "play";
}

//change audio volume
function setVolume(volume) {
  audio.volume = volume/100;
}

//set max of seek bar when audio selected
function initSeekBar() {
  seekbar.max = audio.duration;
  maxTime.innerHTML = toMinSec(audio.duration);
}

//update seek bar as music plays
function updateSeekBar() {
  if(!mouseDown) {
    seekbar.value = audio.currentTime;
    currentTime.innerHTML = toMinSec(audio.currentTime);
  }
}

//jump to specified seekbar time
function seekBarMouseUp() {
  audio.currentTime = seekbar.value;
  mouseDown = false;
}

//allow for seeking
function seekBarMouseDown() {
  mouseDown = true;
  currentTime.innerHTML = toMinSec(seekbar.value);
}

//convert seconds to MIN:SEC format for display
function toMinSec(seconds) {
  var minutes = Math.floor(seconds / 60);
  var seconds = Math.floor(seconds % 60);
  var results = minutes + ":" + ((seconds < 10) ? ("0" + seconds) : seconds);
  return results;
}

//toggle repeat button
function toggleRepeat() {
  if(repeatToggle.innerHTML == "Repeat Off") {
    audio.loop = true;
    repeatToggle.innerHTML = "Repeat On";
  } else {
    audio.loop = false;
    repeatToggle.innerHTML = "Repeat Off";
  }
}

//load audio from soundcloud given url
function loadAudioFromSC(input) {
  SC.initialize({client_id: SC_CLIENT_ID});
  SC.get("https://api.soundcloud.com/resolve", { url: input, client_id: SC_CLIENT_ID },
  function(sound) {
    scData = sound;
    try {
      audio.src = sound.stream_url + '?client_id=' + SC_CLIENT_ID;
      audioTitle.innerHTML = sound.title;
    } catch(e) {
      soundcloudURL.value = "Unable to load Soundcloud Go";
    }
    playAudio();
  });
}


//toggle microphone
function toggleMic() {
  if(micToggle.dataset.state == "off") {
    micToggle.dataset.state = "on";
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then(initMicrophone)
      .catch(function(e) {});
  } else {
    micToggle.dataset.state = "off";
    turnOffMicrophone();
  }
}

//initialize microphone by disconnecting audio souce from analyser and connecting mic source to the analyser
function initMicrophone(stream) {
  micToggle.src = "img/mic-on.png";
  source.disconnect();
  micSource = context.createMediaStreamSource(stream);
  micSource.connect(analyser);
  analyser.disconnect();    //disconnects the analyser from the window audio output
  audioTitle.innerHTML = "Microphone";
  pauseAudio();   //pause music if any playing
}

//turns off microphone by disconnecting mic source and connecting audio source
function turnOffMicrophone() {
  micToggle.src = "img/mic-off.png";
  micSource.disconnect();
  analyser = context.createAnalyser(); //create new analyser to erase the canvas
  analyser.fftSize = FFT_SIZE;
  analyser.smoothingTimeConstant = smoothingConstant;
  source.connect(analyser);
  analyser.connect(context.destination);
  audioTitle.innerHTML = "";
}

//calculate average amplitude
function averageAmplitude() {
  var average = 0;
  for(var i = 0; i < bars; i++) {
    average += fbc_array[i];
  }
  return average/bars;
}

function togglePulse() {
  pulseToggle.innerHTML = radiusPulsingEnable ? "Pulsing Disabled" : "Pulsing Enabled";
  radiusPulsingEnable = radiusPulsingEnable ? false : true;
}
