import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


var camera, cameraTarget, scene, renderer, group;
var numContainer=2; var iterContaier=0;
var textureLoader, dracoLoader;
var meshes = [];
var controls;
var PlayButton = false;
var index = 0;
var stage;
const allAudio = [];

function init( canvas, width, height, pixelRatio, path, testCanvas, inputElement ) {

	//camera
	camera = new THREE.PerspectiveCamera(40, width/height, 1, 250);
	camera.position.set(0, 50, 200);
	cameraTarget = new THREE.Vector3(0, 0, 0);

	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xa0a0a0 );
	scene.fog = new THREE.Fog( 0xa0a0a0, 10, 500 );

	//stage
	//createStage();

	//lights
	createLights()
	
	//controls
	createControls(camera, inputElement)

	group = new THREE.Group();
	scene.add( group );

	//renderer
	renderer = new THREE.WebGLRenderer( { antialias: true, canvas: testCanvas } );
	renderer.setClearColor(scene.fog.color);
	//hardcoded. we need to find to access window.devicePixelRatio
	//renderer.setPixelRatio(1);
	renderer.setPixelRatio( pixelRatio );
	renderer.setSize( width, height, false );
	testCanvas.addEventListener('resize', onWindowResize, false);


	initLoaders();
    initStage();
	animate();
	getVolumetricContainer(testCanvas);
}

function initLoaders(){
	textureLoader = new THREE.ImageBitmapLoader();
	textureLoader.setOptions( { imageOrientation: 'flipY' } );
	dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath( 'draco/' );
	dracoLoader.setDecoderConfig( { type: 'js' } );
}
// display meshes
//TODO: make stable the intervals
function animate() {
	var intervalId; var interval = 80;
	
	startInterval(100);
	function startInterval(_interval){
		
    intervalId = setInterval(function(){
		 self.requestAnimationFrame( function render(t) {
			 if(index>0 && PlayButton==true){
				
				 group.remove(meshes[index-1]);
				}
				 if(PlayButton==true){
				    group.add(meshes[index]);
					index++;
					interval = 83.333;
					if(index>199){
						group.remove(meshes[index-1]);
						PlayButton	= false;
						index=0;
					}
				 }
				 controls.update();
				 camera.lookAt(cameraTarget);
				 renderer.render(scene, camera);
				});
				clearInterval(intervalId)
				startInterval(interval);

	},_interval);
  
    }
}
// fetch next container to decode
function getVolumetricContainer(testCanvas){
	//var url = "sample_videos/container" + numberContainer; 
	if(iterContaier==numContainer){
		//PlayButton=true;
		return;
	}
	var url=  "sample_videos/demo2/container_" + iterContaier;
	console.log("decoded mesh", url)
	//console.log(url)
	iterContaier++;
	fetch(url)
	.then(response => response.arrayBuffer())
	.then(data =>  {
		
		var offset = 40;
    	var frameNumber = 1;
   		var i;
    	for (i = 0; i < frameNumber ; i++) {
      	var timeStamp = data.slice(offset,offset+8);
      	var byteArray = new BigUint64Array(timeStamp);
      	var myNumber = Number(byteArray[0]);
		
      	
      	offset=offset+8;
    }
		var dracoSize = data.slice(offset,offset+8);
    	var byteArray = new BigUint64Array(dracoSize);
    	var myNumber = Number(byteArray[0]);
    	offset=offset+8;
    	
		var drcMesh = data.slice(offset,offset+myNumber);
    	//drcMeshes.push(drcMesh);
    	offset=offset+myNumber;			
		var jpgSize = data.slice(offset,offset+8);
    	offset=offset+8;
    	var jpgSizeView = new Float64Array(jpgSize);
    	var byteArray = new BigUint64Array(jpgSize);
    	var myNumber = Number(byteArray[0]);
    	var newTexture =  data.slice(offset,offset+myNumber); 
    	var textureView = new Uint8Array(newTexture);
		offset=offset+myNumber;
		var imageBlob = new Blob([textureView.buffer], {type: "image/jpg"});
		var url = URL.createObjectURL(imageBlob);
		postMessage({
			type: 'incProgress',
			});
		var audioData = data.slice(offset,data.byteLength);
		//console.log(audioData);
		postMessage({
			type: 'decodeAudio',
			audata: audioData,
			});
		bitmapTextureLoader(url,drcMesh);	
		

	})
}
// texture loader
function bitmapTextureLoader(url,drcMesh){
	textureLoader.load(url, function ( imageBitmap ) {
	
	const texture = new THREE.CanvasTexture( imageBitmap );
	const material = new THREE.MeshBasicMaterial( { map: texture } );
	dracoLoader.decodeDracoFile(drcMesh,function(bufferGeometry){
		
		var geometry;
		geometry = new THREE.Mesh(bufferGeometry, material);
		geometry = setGeometryPosition(geometry);
		//group.add(geometry);
		meshes.push(geometry);
		getVolumetricContainer();});
	});
}
// to fit geometry according to scene
function setGeometryPosition(geometry){
	geometry.rotation.z = Math.PI;
	var scale = 15;
	geometry.scale.multiplyScalar(scale);
	geometry.position.x = 0.06;     
	geometry.position.y = 6;
	geometry.position.z = -5; 
	geometry.castShadow = true;
	geometry.receiveShadow = true;
	//group.add(geometry);
	return geometry;
}
// add, remove or modify lights
function createLights(){
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, 20, 0 );

	const dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( - 3, 10, - 10 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 10;
	dirLight.shadow.camera.bottom = - 10;
	dirLight.shadow.camera.left = - 10;
	dirLight.shadow.camera.right = 10;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
	const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight,10);
	const dirLightHelper = new THREE.DirectionalLightHelper(dirLight,10);
	//scene.add(hemiLightHelper);
	//scene.add(dirLightHelper);

	const light = new THREE.PointLight( 0xffffff  );
	light.position.set( 50, 100, 50 );
	light.power=3

	scene.add( light );
	scene.add( dirLight );
	scene.add( hemiLight );
}
//handle proxy elements
function createControls(camera, inputElement){
	controls = new OrbitControls(camera, inputElement);
	//	controls.target.set(0, 0, 0);
		controls.enableDamping = true; 
		  controls.dampingFactor = 0.05;
		  controls.screenSpacePanning = false;
		  controls.minDistance = 2;
		  controls.maxDistance = 115;
}
// add, remove stage
function createStage(){
	const loader = new GLTFLoader().setPath( 'models/glTF/' );
	loader.load( 'scene.gltf', function ( gltf ) {
    gltf.scene.scale.multiplyScalar(2/5);
    gltf.scene.position.y = -2         
	scene.add( gltf.scene );
	} );
}
// init stage
function initStage(){
		const loader = new GLTFLoader().setPath( 'models/glTF/' );
	loader.load( 'scene.gltf', function ( gltf ) {
	stage=gltf;
	stage.scene.scale.multiplyScalar(1);
	stage.scene.position.y = -20
	stage.scene.position.z = 10;
	stage.scene.position.x = 0.6;
   } );
	
}

// not working yet
function onWindowResize() {
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

export function playVideo(isPlay){
	
	if(isPlay=="true"){
		
		PlayButton=true;

	}

}

export function guiSettings(data){
	//console.log(data.state)
	//console.log(data.sample)
	if(data.state=="Play"){
		PlayButton=true
	}else if(data.state=="Stop"){
		PlayButton=false
	}
	if(data.state=="Replay"){
		group.remove(meshes[index-1]);
		index = 0;
		PlayButton=true;
	}

	if(data.stage=="Empty"){
		//console.log("scene remove");
		scene.remove(stage.scene);

	}else{
		scene.add( stage.scene );
	
	}

}

export default init;

