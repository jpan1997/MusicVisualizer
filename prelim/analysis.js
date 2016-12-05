var audioCtx = new (window.AudioContext || window.webkitAudioContext);
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

var audioSrc = document.getElementById('music');

audioSrc.connect(analyser);

