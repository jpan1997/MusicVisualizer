$(document).ready(function() {
    threeInit();
    initMp3Player();
    getElements();

});

function getElements() {
  soundcloudURL = document.getElementById("soundcloud-url");
  audio = document.getElementById("audio-player");
  audio.crossOrigin = "anonymous";
  volumeBar = document.getElementById("volumeBar");
  seekbar = document.getElementById("seekbar");
  pausePlay = document.getElementById("pause_play");
  currentTime = document.getElementById("currentTime");
  maxTime = document.getElementById("maxTime");
  volumeValue = document.getElementById("volumeValue");
  repeatToggle = document.getElementById("repeat_toggle");
  micToggle = document.getElementById("mic_toggle");

$("#audio-player").attr("src", "../I See Fire (Kygo Remix).mp3");
audio.play().then(function() {console.log("success");});
  //event listener for when user presses enter
  soundcloudURL.addEventListener("keypress", function(e) {
      if(e.which === 13) {
        loadAudioFromSC(soundcloudURL.value);
      }
  });

  $("#volumeControl").hover(function() {$("#volumeControl").stop(true, false).fadeTo(300, 1);},
    function() {$("#volumeControl").stop(true, false).fadeTo(300, 0);});
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
        var val = (fbc_array[i] == 0) ? 0x16 : fbc_array[i];
        var val2 = (fbc_array[i + 10] == 0) ? 0x86 : fbc_array[i+10];
        var val3 = (fbc_array[i + 20] == 0) ? 0xBA : fbc_array[i+20];
        outerSpheres[i].material.color = new THREE.Color(val/350 + rOffset, val2/350 + gOffset, val3/350 + bOffset);
        var size = (fbc_array[i] == 0) ? 0.15 : val/260;
        outerSpheres[i].scale.set(size, size, size);
    }
    var changeInner = function(i) {
        var val = (fbc_array[i] == 0) ? 0x16 : fbc_array[i] * 2/3;
        var val2 = (fbc_array[i + 10] == 0) ? 0x86 : fbc_array[i+10] *2/3;
        var val3 = (fbc_array[i + 20] == 0) ? 0xBA : fbc_array[i+20] *2/3;
        innerSpheres[i].material.color = new THREE.Color(val/350 + rOffset, val2/350 + gOffset, val3/350 + bOffset);
        var size = (fbc_array[i] == 0) ? 0.15 : val/260;
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
    average = (averageAmplitude()/35) + 10;

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
    pausePlay.innerHTML = "Pause";
  }
}

//play/pause button
function toggleAudio() {
  if(micToggle.innerHTML == "Turn On") { //only allow toggling if music loaded and mic is off
    if(pausePlay.innerHTML == "Pause") {
      pauseAudio();
    } else {
      playAudio();
    }
  }
}

//play audio
function playAudio() {
  pausePlay.innerHTML = "Pause";
  audio.play();
}

//pause audio
function pauseAudio() {
  pausePlay.innerHTML = "Play";
  audio.pause();
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
    audio.src = sound.stream_url + '?client_id=' + SC_CLIENT_ID;
    pausePlay.innerHTML = "Pause";
  });
}


//toggle microphone
function toggleMic() {
  if(micToggle.innerHTML == "Turn On") {
    micToggle.innerHTML = "Turn Off";
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then(initMicrophone)
      .catch(function(e) {console.log("Mic Blocked");});
  } else {
    micToggle.innerHTML = "Turn On";
    turnOffMicrophone();
  }
}

//initialize microphone by disconnecting audio souce from analyser and connecting mic source to the analyser
function initMicrophone(stream) {
  source.disconnect();
  micSource = context.createMediaStreamSource(stream);
  micSource.connect(analyser);
  analyser.disconnect();    //disconnects the analyser from the window audio output

  pauseAudio();   //pause music if any playing
}

//turns off microphone by disconnecting mic source and connecting audio source
function turnOffMicrophone() {
  micSource.disconnect();
  analyser = context.createAnalyser(); //create new analyser to erase the canvas
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = smoothingConstant;
  source.connect(analyser);
  analyser.connect(context.destination);
}

//calculate average amplitude
function averageAmplitude() {
  var average = 0;
  for(var i = 0; i < bars; i++) {
    average += fbc_array[i];
  }
  return average/bars;
}
