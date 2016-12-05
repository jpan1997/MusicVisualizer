$(document).ready(function() {
    getElements();
    addEventListeners();
    initMp3Player();
    threeInit();
    frameLooper();
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
  micToggle = document.getElementById("mic_toggle");
  audioTitle = document.getElementById("audio-title");
  pulseToggle = document.getElementById("pulseToggle");
}

function addEventListeners() {
  //event listener for when user presses enter, process the request
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

  //fade in fade out of volume controls, seek bar, input div, pulse toggle
  $("#volumeControl").hover(function() {$("#volumeslider").stop(true, false).fadeTo(500, 1);},
    function() {$("#volumeslider").stop(true, false).fadeTo(500, 0);});

  $("#audio-controls").hover(function() {$("#timeControl").stop(true, false).fadeTo(500, 1);},
    function() {$("#timeControl").stop(true, false).fadeTo(500, 0);});

  $("#audio-input").hover(function() {$("#audio-input").stop(true, false).fadeTo(500, 1);},
    function() {$("#audio-input").stop(true, false).fadeTo(500, 0); $("#soundcloud-url").trigger("blur");});

  $("#pulseToggle").hover(function() {$("#pulseToggle").stop(true, false).fadeTo(500, 1);},
    function() {$("#pulseToggle").stop(true, false).fadeTo(500, 0);});
}

// animation loop
function frameLooper(){
    window.requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    updateSphereSizeColor();
    cyclePulseSpheres();
    renderer.render(scene, camera);
}

//initialize audio player and audio analyser
function initMp3Player(){
    context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = smoothingConstant;
    source = context.createMediaElementSource(document.getElementById("audio-player"));
    source.connect(analyser);
    analyser.connect(context.destination);
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
  if(micToggle.dataset.state == "off") { //only allow toggling mic is off
    (pausePlay.dataset.state == "pause") ? pauseAudio() : playAudio();
  }
}

//play audio
function playAudio() {
  audio.play();
  pausePlay.src = "img/pause.png";
  pausePlay.dataset.state = "pause";
}

//pause audio
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
      soundcloudURL.value = "Invalid Soundcloud URL";
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
  pauseAudio();   //pause music if any playing
}

//turns off microphone by disconnecting mic source and connecting audio source
function turnOffMicrophone() {
  micToggle.src = "img/mic-off.png";
  micSource.disconnect();
  source.connect(analyser);
  analyser.connect(context.destination);
}

//enable/disable pulsing
function togglePulse() {
  pulseToggle.innerHTML = radiusPulsingEnable ? "Pulsing Disabled" : "Pulsing Enabled";
  radiusPulsingEnable = radiusPulsingEnable ? false : true;
}
