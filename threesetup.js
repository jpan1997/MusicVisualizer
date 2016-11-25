function threeInit() {    
    var scene = new THREE.Scene();
    var aspectRatio = window.innerWidth/window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00, wireframe: true});
    var spheres = [];
    
    // make the center sphere
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0,0,0);
    spheres.push(sphere);
    scene.add(sphere);

    // make the surrounding spheres
    // 6 spheres (256/2/20)
    for (var i=0; i<6; i++) {
        var material = new THREE.MeshPhongMaterial({color: 0x00ff00, wireframe: true});
        sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(2*Math.cos(i*Math.PI/3), 2*Math.sin(i*Math.PI/3), 0);
        spheres.push(sphere);
        scene.add(sphere);
    }
    var light = new THREE.AmbientLight(0x404040);
    scene.add(light);
    camera.position.z = 5;

    function rotateSpheres() {
        var len = spheres.length;
        for (var i=0; i<len; i++) {
            spheres[i].rotation.x += 0.01*i;
            spheres[i].rotation.y += 0.01*i;
        }
    }

    function changeSphereColors() {
        var hex, color, len = spheres.length;
        var change = function(i) {
            var hex = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
            spheres[i].material.color = new THREE.Color(hex);
            var size = Math.random();
            spheres[i].scale.set(size, size, size);
        }
        for (var i=0; i<len; i++) {
            change(i);
        }
    }
    var render = function() {
        requestAnimationFrame(render);
        rotateSpheres();
        var num = Math.random();
        if (num<0.1) {
            changeSphereColors();
        }
        renderer.render(scene, camera);
    }
    render();
}

function updateSpheres() {
    analyser.getByteFrequencyData(fbc_array);
    var len = spheres.length;
    setTimeout(changeSphereColors, 10000);
    for (var i=0; i<len; i++) {
        var val = fbc_array[i];
        hex = (val << 16) + (val << 8) + val;
        spheres[i].material.color.setHex(hex);
    }
}