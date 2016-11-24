function threeInit() {    
    var scene = new THREE.Scene();
    var aspectRatio = window.innerWidth/window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(2, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    camera.position.z = 5;

    var render = function() {
        requestAnimationFrame(render);
        
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
    render();
}