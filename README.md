#Atom Audio Visualizer
Written by Justin Pan and Peter Wang

Last Updated 12/7/16

This visualizer produces a smooth 3D atom-like visualization based on the amplitudes and frequencies of the song.
We utilize the javascript AudioContext object to apply the fast fourier transform (FFT) to the desired audio stream. The primary library we used to produce the visuals was three.js, which is a library that can produce smooth renderings of 3D objects.

Users have the option of either uploading a local file, copying a soundcloud URL, or using their built-in computer microphone. 
