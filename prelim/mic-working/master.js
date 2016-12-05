var SC_CLIENT_ID = "57752f80398a70ff5cacb186de7e75d4";
var scData;

var canvas, ctx, source, context, analyser, fbc_array, bars, x_pos, bar_width, bar_height, bar_spacing, micSource, micStream, audioLoaded;

bars = 128;
bar_spacing = 2;
bar_width = 1;

var audio, volumeBar, seekBar, pausePlay, currentTime, maxTime, volumeValue, repeatToggle, micToggle;
var mouseDown = false;

//intialize all objects on page load
$(document).ready(function() {
  initMp3Player();
  initLooper();
  frameLooper();
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

  //event listener for when user presses enter
  soundcloudURL.addEventListener("keypress", function(e) {
      if(e.which === 13) {
        loadAudioFromSC(soundcloudURL.value);
      }
  });

});

//animation loop
function frameLooper(){
    window.requestAnimationFrame(frameLooper);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < bars; i++){
        bar_x = i * bar_spacing;
        bar_height = -(fbc_array[i]/2);
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
}

//initalize audio player and analyser
function initMp3Player(){
    context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    canvas = document.getElementById('analyser_render');
    canvas.width = bars*bar_spacing;
    ctx = canvas.getContext('2d');
    source = context.createMediaElementSource(document.getElementById("audio-player"));
    source.connect(analyser);
    analyser.connect(context.destination);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
}

//initialize frame looper
function initLooper() {
  fbc_array = new Uint8Array(analyser.frequencyBinCount);
  ctx.fillStyle = "#00CC00";
}

//read audio upload from user
function readMusic(input) {
  if(input.files && input.files[0])
    audio.src = URL.createObjectURL(input.files[0]);
  pausePlay.innerHTML = "Pause";
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
  volumeValue.innerHTML = volume;
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
  source.connect(analyser);
  analyser.connect(context.destination);
}
