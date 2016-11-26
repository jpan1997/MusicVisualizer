$(document).ready(function() {
    threeInit();
    initMp3Player();
    getElements();
  
});

function getElements() {
    audio = document.getElementById("audio-player");
    volumeBar = document.getElementById("volumeBar");
    seekbar = document.getElementById("seekbar");
    pausePlay = document.getElementById("pause_play");
    currentTime = document.getElementById("currentTime");
    maxTime = document.getElementById("maxTime");
    volumeValue = document.getElementById("volumeValue");
    repeatToggle = document.getElementById("repeat_toggle");

    soundcloudURL = document.getElementById("sc-url");
    $("#sc-url").hover(function() {$("#sc-url").focus();},
                        function() {$("#sc-url").blur();});
    //event listener for when user presses enter
    soundcloudURL.addEventListener("keypress", function(e) {
      if(e.which === 13) {
        loadAudioFromSC($("#sc-url").text());
        console.log($("#sc-url").text())
        e.preventDefault();
      }
  });
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
    updateSpheres();
}

function updateSpheres() {
    var len = spheres.length;
    var change = function(i) {
        var val = fbc_array[i] == 0 ? 50 : fbc_array[i];
        var val2 = fbc_array[i+10] == 0 ? 50 : fbc_array[i+10];
        var val3 = fbc_array[i+20] == 0 ? 50 : fbc_array[i+20];
        // hex = (val << 16) + (val << 8) + val;
        // spheres[i].material.color = new THREE.Color(hex);
        spheres[i].material.color = new THREE.Color(val/260, val2/260, val3/260);
        // var size = val == 0 ? 0.9 : Math.log(Math.log(val));
        var size = val == 0 ? 0.9 : val/240;
        spheres[i].scale.set(size, size, size);
        }
    for (var i=0; i<len; i++) {
        change(i);
    }
}

function initMp3Player(){
    context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    canvas = document.getElementById('analyser_render');
    ctx = canvas.getContext('2d');
    source = context.createMediaElementSource(document.getElementById("audio-player"));
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
}

//read audio upload from user
function readMusic(input) {
    var file = input.files[0];
    var objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;
    if(audio.autoplay == true) toggleAudio();
    // change the song title displayed
    var patt = /\\(.+\\)*(.+\.mp3|\.m4a)/i;
    var res = input.value.match(patt);
    $("#songTitle").html(res[res.length - 1]);
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
    $("#songTitle").html(sound.title);
  });
}