var rOffset = 0, gOffset = 0, bOffset = 0;
function updateSphereSizeColor() {
    //change overall hue randomly
    if(Math.random() < hueChangeProbability) {
      var hue = Math.trunc(Math.random() * 6);
      switch(hue) { //6 different hues, roygbv
        case 0: //red
          rOffset = hueSensitivity;
          gOffset = -hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 1: //orange
          rOffset = hueSensitivity;
          gOffset = 0.5*hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 2: //yellow
          rOffset = hueSensitivity;
          gOffset = hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 3: //green
          rOffset = -hueSensitivity;
          gOffset = hueSensitivity;
          bOffset = -hueSensitivity;
          break;
        case 4: //blue
          rOffset = -hueSensitivity;
          gOffset = -hueSensitivity;
          bOffset = hueSensitivity;
          break;
        case 5: //violet
          rOffset = hueSensitivity;
          gOffset = -hueSensitivity;
          bOffset = hueSensitivity;
          break;
      }
    }

    function changeOuter(i) {
        var val = (fbc_array[i] == 0) ? 0x88 : fbc_array[i];
        var val2 = (fbc_array[i + 10] == 0) ? 0x88 : fbc_array[i+10];
        var val3 = (fbc_array[i + 20] == 0) ? 0x88 : fbc_array[i+20];
        outerSpheres[i].material.color = new THREE.Color(val/350 + rOffset, val2/350 + gOffset, val3/350 + bOffset);
        var size = (fbc_array[i] == 0) ? 0.15 : val/300;
        outerSpheres[i].scale.set(size, size, size);
    }

    function changeInner(i) {
        var val = (fbc_array[i] == 0) ? 0x88 : fbc_array[i] - 50;
        var val2 = (fbc_array[i + 10] == 0) ? 0x88 : fbc_array[i+10] - 50;
        var val3 = (fbc_array[i + 20] == 0) ? 0x88 : fbc_array[i+20] - 50;
        innerSpheres[i].material.color = new THREE.Color(val/350 + rOffset, val2/350 + gOffset, val3/350 + bOffset);
        var size = (fbc_array[i] == 0) ? 0.25 : val/255;
        innerSpheres[i].scale.set(size, size, size);
    }

    for (var i=0; i<innerSpheres.length; i++) {
        changeInner(i);
    }

    for (var i=0; i<outerSpheres.length; i++) {
        changeOuter(i);
    }
}

//rotate outer spheres around inner spheres
var currentDirection = 0; //0 for rotate about x, 1 about y, 2 about z
var ccw = 1;      //direction of rotation
var average = 0, prevAverage = 0; //smooth the pulsing by taking the average of current  frame with previous frame
function cyclePulseSpheres(t) {
    var radius, x, y, z, theta;
    average = (averageAmplitude()/40) + 10;

    //change direction randomly
    if(Math.random() < revolutionChangeProbability) {
      currentDirection = Math.trunc(Math.random() * 3);
      ccw = (Math.random() < 0.5) ? -1 : 1;
    }

    //rotate outer spheres
    for (var i = 0; i < outerSpheres.length; i++) {
        x = outerSpheres[i].position.x;
        y = outerSpheres[i].position.y;
        z = outerSpheres[i].position.z;

        if(currentDirection == 0) {
          radius = Math.sqrt((y*y) + (z*z));
          theta = Math.atan2(y, z);
          outerSpheres[i].position.z = radius*Math.cos(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.y = radius*Math.sin(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.x = x;
        } else if(currentDirection == 1) {
          radius = Math.sqrt((z*z) + (x*x));
          theta = Math.atan2(z, x);
          outerSpheres[i].position.x = radius*Math.cos(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.z = radius*Math.sin(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.y = y;
        } else {
          radius = Math.sqrt((x*x) + (y*y));
          theta = Math.atan2(x, y);
          outerSpheres[i].position.y = radius*Math.cos(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.x = radius*Math.sin(theta + ccw*outerRevolutionSpeed);
          outerSpheres[i].position.z = z;
        }

        if(radiusPulsingEnable)
          outerSpheres[i].position.setLength(radiusScaling*(average + prevAverage)/2);
        else
          outerSpheres[i].position.setLength(10);
    }

    //rotate inner spheres
    for (var i = 1; i < innerSpheres.length; i++) {
      x = innerSpheres[i].position.x;
      y = innerSpheres[i].position.y;
      z = innerSpheres[i].position.z;
      radius = Math.sqrt((z*z) + (x*x));
      theta = Math.atan2(z, x);
      innerSpheres[i].position.x = radius*Math.cos(theta + innerRevolutionSpeed);
      innerSpheres[i].position.z = radius*Math.sin(theta + innerRevolutionSpeed);
      innerSpheres[i].position.y = y;
    }

    prevAverage = average;
}

//calculate average amplitude
function averageAmplitude() {
  var average = 0;
  for(var i = 0; i < 0.5*FFT_SIZE; i++) {
    average += fbc_array[i];
  }
  return average/(0.5*FFT_SIZE);
}
