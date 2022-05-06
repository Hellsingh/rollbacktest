const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x485045);
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 10010 );

const renderer = new THREE.WebGLRenderer({alpha : true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', resizeRender);
function resizeRender()
{
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

const controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.update();

var intensity = 1;
var color = 0xFFFFFF;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(2,5,2);
light.castShadow = true;
//light.shadow.bias = 0.0001;
scene.add(light);

intensity = 2;
color = 0x00AAFF;
var pointLightRadius = 8;
const pointLight = new THREE.PointLight( color, intensity, pointLightRadius);
pointLight.castShadow = true;
pointLight.position.set( 2, 4, 1);
scene.add(pointLight);

//CreatePointLight( color, intensity, pointLightRadius, -2, 4, 1);
CreatePointLight( 0x00FF00, intensity, pointLightRadius, new THREE.Vector3(-2, 4, 1));

const ambIntensity = .2;
const ambColor = 0xFFFF00;
const ambLight = new THREE.AmbientLight(ambColor, ambIntensity);
scene.add(ambLight);

camera.position.z = 5;
camera.position.y = 5;
camera.rotation.x = THREE.Math.degToRad(-45);

const cube2 = CreateInstance(new THREE.TorusGeometry(1,0.2,16,32), 0x8014eb, 3);
const cube3 = CreateInstance(new THREE.ConeGeometry(1,2,16), 0x19e6b3, -3);

var geometry = new THREE.BoxGeometry(1 ,1 , 1);
//var material = new THREE.MeshBasicMaterial( {color : "#FFFFFF", wireframe : true, transparent : true});
var material = new THREE.MeshPhongMaterial( { map : new THREE.TextureLoader().load ( 'img/Wood2.png' ), side : THREE.FrontSide, shadowSide : THREE.BackSide } );
const wireCube = new THREE.Mesh(geometry, material);
wireCube.castShadow = true;
scene.add(wireCube);

geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
const ground = CreateInstance(geometry, 0x333333, 0);
ground.position.y = -1.5;
ground.rotation.x = THREE.Math.degToRad(-90);

function CreateInstance(geometry, color, x)
{
	const material = new THREE.MeshPhongMaterial({color , side : THREE.FrontSide, shadowSide : THREE.BackSide});
	const thisMesh = new THREE.Mesh(geometry, material);
	thisMesh.castShadow = true;
	thisMesh.receiveShadow = true;
	scene.add(thisMesh);

	thisMesh.position.x = x;
	return thisMesh;
}

function CreatePointLight( color, intensity, radius, position)
{
	const light = new THREE.PointLight( color, intensity, radius);
	light.castShadow = true;
	light.position.set(position.x, position.y, position.z);
	scene.add(light);
	return light;
}

const loader = new THREE.GLTFLoader();
loader.load( 'models/Spark.gltf' , function(gltf)
{
	scene.add(gltf.scene);
});

const animate = function () {
	requestAnimationFrame( animate );	

	const xrot = 0.01;
	const yrot = 0.01;

	cube2.rotation.x += xrot;
	cube2.rotation.y += yrot;
	cube3.rotation.x += xrot;
	cube3.rotation.y += yrot;

	wireCube.rotation.x += xrot * -1;
	wireCube.rotation.y += yrot * -1;

	renderer.render( scene, camera );
};
animate();

