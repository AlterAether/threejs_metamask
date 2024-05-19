import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';

//THREEnity
let scene;
let camera;
let renderer;

const canvas = document.querySelector('.webgl')

// A. Scene
scene = new THREE.Scene();

// B1. camera value
const fov = 60; // in degrees
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; 
const far = 1000;
// B2. Pass camera value
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
scene.add(camera);

// C. Renderer WebGL
renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
// C2. Renderer Size
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);


// D. Earth Geometry [in segments]
const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32);// D, W, H
// D2. Earh Material [textures]
const earthMaterial = new THREE.MeshPhongMaterial({
    roughness: 1,
    metalness: 0,
    map : THREE.ImageUtils.loadTexture('texture/Earth_Col_6K.png'),
    bumpMap : THREE.ImageUtils.loadTexture('texture/Earth_Nor_6K.png'),
    bumpScale: 0.1
});
// D3. Earth Mesh [geometry+ material]
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// D4. Clouds
const cloudGeometry = new THREE.SphereGeometry(0.63, 32, 32);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('texture/earthCloud.png'),
    transparent: true
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

// D5. Moon Geometry [in segments]
const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);// D, W, H
// D6. Moon Material [textures]
const moonMaterial = new THREE.MeshPhongMaterial({
    roughness: 5,
    metalness: 1,
    map : THREE.ImageUtils.loadTexture('texture/moonmap4k.jpg'),
    //bumpMap : THREE.ImageUtils.loadTexture('texture/moonbump4k.jpg'),
    bumpScale: 0.5
});
// D7. Moon Mesh [geometry+ material]
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.x = 1;
scene.add(moonMesh);

//D8. Moon Pivot
const moonPivot = new THREE.Object3D();
earthMesh.add(moonPivot);
moonPivot.add(moonMesh);


// I. Background Environment
const starGeometry = new THREE.SphereGeometry(80, 64, 64); //big sphere
const starMaterial = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('texture/8k_stars_milky_way.jpeg'), // image texture
    side: THREE.BackSide // bake the inside sphere
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);


// E. Light Sources
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 3, 5);
scene.add(ambientLight, pointLight); 

// K. Responsiveness
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
},  false);

// J. Stats
//const stats = Stats()
//document.body.appendChild(stats.dom);

// F. Animate Function [earth/moon rotation]
const animate = () =>{
    requestAnimationFrame(animate);
    cloudMesh.rotation.y -=0.0005;
    earthMesh.rotation.y -= 0.0010;
    moonPivot.rotation.y -= 0.0005;
    moonMesh.rotation.y -= 0.005;
    starMesh.rotation.y -=0.002;
    controls.update();
    render();
    stats.update();
}

// G. Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Z. Render Function
const render = () =>{
    renderer.render(scene, camera);
}

animate();