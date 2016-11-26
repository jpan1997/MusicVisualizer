// node analysis
var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

// three.js
var scene, aspectRatio, camera, renderer, spheres;

// player
var audio, volumeBar, seekBar, pausePlay, currentTime, maxTime, volumeValue, repeatToggle;
var mouseDown = false;