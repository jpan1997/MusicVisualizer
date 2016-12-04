// node analysis
var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
var smoothingConstant = 0.8;

// three.js
var scene, aspectRatio, camera, renderer, innerSpheres, outerSpheres, controls;

// player
var audio, volumeBar, seekBar, pausePlay, currentTime, maxTime, volumeValue, repeatToggle, micSource, micToggle;
var mouseDown = false;

//visualization controls
var outerRevolutionSpeed = 0.005;
var innerRevolutionSpeed = 0.0025;
var revolutionChangeProbability = 0.01;
var radiusScaling = 1;
var radiusPulsingEnable = true;
var defaultCameraZoom = 18;
var stargazeEnable = false;
var numOfOuterSpheres = 80;
var hueChangeProbability = 0.01;
var hueSensitivity = 0.08;

// SoundCloud
var SC_CLIENT_ID = "57752f80398a70ff5cacb186de7e75d4";
var scData;
