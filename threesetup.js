function threeInit() {
    outerSpheres = [];
    innerSpheres = [];

    scene = new THREE.Scene();
    aspectRatio = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 4, window.innerHeight - 4);
    document.body.appendChild(renderer.domElement);

    //rotate and zoom controls
    controls = new THREE.OrbitControls(camera, renderer.domElement );

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, shading: THREE.FlatShading});

    // make the center sphere
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0,0,0);
    innerSpheres.push(sphere);
    scene.add(sphere);

    // make the 6 inner spheres
    if(!stargazeEnable) {
      for (var i=0; i<6; i++) {
          var material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, shading: THREE.FlatShading});
          sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(2*Math.cos(i*Math.PI/3), 2*Math.sin(i*Math.PI/3), 0);
          innerSpheres.push(sphere);
          scene.add(sphere);
      }
    }

    // make random small spheres scattered around
    var geometrySmall = new THREE.SphereGeometry(0.8, 32, 32);
    for (var i = 0; i <numOfOuterSpheres; i++) {
        var material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, shading: THREE.FlatShading});
        sphere = new THREE.Mesh(geometrySmall, material);
        sphere.position.x = Math.random()*2-1;
        sphere.position.y = Math.random()*2-1;
        sphere.position.z = Math.random()*2-1;
        sphere.position.normalize();
        sphere.position.multiplyScalar(10);
        outerSpheres.push(sphere);
        scene.add(sphere);
    }

    //add lighting to scene
    var light = new THREE.AmbientLight(0xF0F0F0, 1);
    var directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 1);
    var directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight2.position.set(-50,-50,-50);
    scene.add(light);
    scene.add(directionalLight1);
    scene.add(directionalLight2);
    camera.position.z = stargazeEnable? 0.1 : defaultCameraZoom;

    // when mouseover spheres, light up
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    function onMouseMove( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects( scene.children );

        for ( var i = 0; i < intersects.length; i++ ) {
            intersects[i].object.material.color.set( 0xffffff );
        }
    }

    window.addEventListener('mousemove', onMouseMove, false );
}
