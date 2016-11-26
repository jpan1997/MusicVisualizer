var SC_CLIENT_ID = "57752f80398a70ff5cacb186de7e75d4";
var scData;

var canvas, ctx, source, context, analyser, fbc_array, bars, x_pos, bar_width, bar_height, bar_spacing;

bars = 128;
bar_spacing = 2;
bar_width = 1;

var audio, volumeBar, seekBar, pausePlay, currentTime, maxTime, volumeValue, repeatToggle;
var mouseDown = false;

//intialize all objects on page load
$(document).ready(function() {
  initMp3Player();
  frameLooper();
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
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00CC00";
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
}

//read audio upload from user
function readMusic(input) {
  if(input.files && input.files[0])
    audio.src = URL.createObjectURL(input.files[0]);
}

//play/pause button
function toggleAudio() {
  if(pausePlay.innerHTML == "Pause") {
    pausePlay.innerHTML = "Play";
    audio.pause();
  } else {
    pausePlay.innerHTML = "Pause";
    audio.play();
  }
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
  });
}
