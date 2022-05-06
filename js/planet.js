
console.log("Scriping started");
// import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
// import { OBJLoader } from "js/loaders/OBJLoader.js";
// import model from "assets/planet/planet2.obj";
// import texture from "assets/planet/planet_palette.png";
// import "./planet-full.scss"

var modelLoaded = false;

var world;
var width, height;
// var controls;

var isMouseDown = false;

const pivot = new THREE.Group();
const moon = new THREE.Group();
const rings = new THREE.Group();

const manager = new THREE.LoadingManager();

const scene = new THREE.Scene();
width = window.innerWidth; // or window.innerWidth;
height = window.innerHeight; // = window.innerHeight for full screen
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 100);

camera.position.set(0, 0, 4);       //prev (0, 0, 4)

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
document.body.appendChild( renderer.domElement );

// add light
// scene.fog = new THREE.Fog(0xa0a0a0, 1, 100);
// scene.background = 0x222222;
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
hemiLight.position.set(0, 0, -5);

const hemiLight2 = new THREE.HemisphereLight(0xeeeeee, 0x222222, 1);
hemiLight2.position.set(0, 0, 5);
// scene.add(hemiLight);
camera.add(hemiLight);
camera.add(hemiLight2);
// const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
// scene.add(hemiLightHelper);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 0, -50);
dirLight.castShadow = true;
dirLight.shadow.camera.right = 100;
dirLight.shadow.camera.left = -100;
dirLight.shadow.camera.top = 100;
dirLight.shadow.camera.bottom = -100;

camera.add(dirLight);
scene.add(camera);
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.y = 5;
camera.add(pointLight);

const geo = new THREE.BoxGeometry(1,1,1);
const mat = new THREE.MeshLambertMaterial({color : 0xFFFFFF});
const mesh = new THREE.Mesh(geo, mat);
mesh.receiveShadow = true;
mesh.castShadow = true;
// scene.add(mesh);

// load model
const loader = new THREE.OBJLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);

const tL = new THREE.TextureLoader();
tL.load('assets/background2.png', (texture) => {
    scene.background = texture;
});

loader.load('assets/planet2.obj', function (object) {
    world = object;
    console.log("World loaded ");
    // console.log(world);

    world.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      textureLoader.load('assets/planet_palette.png', (texture) => {
        child.material.map = texture;
        child.material.needsUpdate = true;
        child.material.side = THREE.DoubleSide;
      });
    }
  });

    var box = new THREE.Box3().setFromObject(world);
    box.getCenter(world.position); // this re-sets the mesh position
    world.position.multiplyScalar(-1);

    while (world.children.length > 0) {
        let child = world.children[0];
        //box.getCenter(child.position); // this re-sets the mesh position
        child.position.multiplyScalar(-1);
        if (
          child.name === "Icosphere.001_Icosphere.005" ||
          child.name.includes("Moon")
        ) {
          moon.add(child);
        } else if (child.name.includes("Ring")) {
          rings.add(child);
        } else if (child.name.includes("atmosphere_atmosphere_X")) {
          child.material.opacity = 0.1;
          child.material.transparent = true;
          pivot.add(child);
        } else pivot.add(child);

        child.position.y = 0;
    }

    // console.log(rings);

    //scene.add(world.scene);
    scene.add(pivot);
    scene.add(moon);
    scene.add(rings);

    //   camera.add(rings);
    //   rings.position.z = -4;
    //   rings.rotation.y = 20;
    //   camera.add(moon);
    //   moon.position.z = -4;
    //   moon.rotation.y = -2.5;
    //   moon.rotation.x = -5;

      //renderer.compile(scene,camera);
      modelLoaded = true;
      renderer.render(scene,camera);
      // setTimeout(() => {
      // }, 2500);
      // renderer.domElement.style.display = "block";
});

manager.onLoad = () => {
    // console.log("loaded");

    window.addEventListener("resize", handleResize);
    window.addEventListener("touchstart", onMouseDown, false);
    window.addEventListener("touchend", onMouseUp, false);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    animate();
};

// controls = new TrackballControls(camera, renderer.domElement);

// controls.rotateSpeed = 2;
// controls.noPan = true;
// controls.noZoom = false;
// controls.minDistance = 3;
// controls.maxDistance = 15;
// controls.update();

const controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.maxDistance = 5;
controls.minZoom = 5;
controls.minDistance = 3;
controls.minZoom = 3;
controls.update();

// animate
const animate = function () {
    if (!isMouseDown) {
        pivot.rotation.y += 0.002;
        // moon.rotation.x -= 0.2;
        // moon.rotation.y -= 0.2;
      }
      requestAnimationFrame(animate);
      if(modelLoaded){
        moon.rotation.z -= 0.002;
        rings.rotation.y += 0.001;
        // controls.update();
        // console.log(camera.position, " || ", camera.rotation);
        render();
      }
};

const render = () => {
    renderer.render(scene, camera);
    console.log("Rendering camera");
};

const handleResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
};

const onMouseDown = () => {
    isMouseDown = true;
};

const onMouseUp = () => {
    isMouseDown = false;
};