// node analysis
var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

// three.js
var scene, aspectRatio, camera, renderer, spheres, controls;

// player
var audio, volumeBar, seekBar, pausePlay, currentTime, maxTime, volumeValue, repeatToggle;
var mouseDown = false;

// SoundCloud 
var SC_CLIENT_ID = "57752f80398a70ff5cacb186de7e75d4";
var scData;