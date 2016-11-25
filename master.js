$(document).ready(function() {
    threeInit();
    initMp3Player();
  
});

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
    for (var i=0; i<len; i++) {
        var val = fbc_array[i];
        hex = (val << 16) + (val << 8) + val;
        spheres[i].material.color.setHex(hex);
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

function readMusic(input) {
    var file = input.files[0];
    var objectUrl = URL.createObjectURL(file);
    $("#audio-player").attr("src", objectUrl);
}
