import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


var camera, cameraTarget, scene, renderer, group;
var numContainer=199; var iterContaier=0;
var textureLoader, dracoLoader;
var meshes = [];
var controls;
var PlayButton = false;
var index = 0;
var stage;
const allAudio = [];
var path = "../../sample_videos/demo1/container_";

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
    //initStage();
	animate();
	getVolumetricContainer(testCanvas);
}

function initLoaders(){
	textureLoader = new THREE.ImageBitmapLoader();
	textureLoader.setOptions( { imageOrientation: 'flipY' } );
	dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath( '../../draco/' );
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
								
				// meshes[index-1].texture.dispose();
				// console.log("texture dispose");
				 meshes[index-1].material.dispose();
                 meshes[index-1].geometry.dispose();;	
				 scene.remove(meshes[index-1]);		
				 delete meshes[index-1]	
				 meshes[index-1]=[]	
				};
				 if(PlayButton==true){
				    scene.add(meshes[index]);
					index++;
					interval = 83.333;
					if(index>=numContainer){
						scene.remove(meshes[index-1]);
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
	var url=  path + iterContaier;
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
		//assume that having 100 frame
		if(iterContaier<199){
			postMessage({
				type: 'incProgress',
				});
		}
		//comment for some interval tests
		// var audioData = data.slice(offset,data.byteLength);
		// //console.log(audioData);
		// postMessage({
		// 	type: 'decodeAudio',
		// 	audata: audioData,
		// 	});
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
		texture.dispose();
		material.dispose();
		geometry.geometry.dispose();
		if(iterContaier==20){
			showPreview(20);
		}
		iterContaier++;
		getVolumetricContainer();});
	});
}

function showPreview(frame){
	group.add(meshes[20]);
}

function removePreview(frame){
	group.remove(meshes[20]);
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
	const loader = new GLTFLoader().setPath( '../../models/glTF/' );
	loader.load( 'scene.gltf', function ( gltf ) {
    gltf.scene.scale.multiplyScalar(2/5);
    gltf.scene.position.y = -2         
	scene.add( gltf.scene );
	} );
}
// init stage
function stage1(){
	const loader = new GLTFLoader().setPath( '../../models/glTF/' );
	loader.load( 'scene.gltf', function ( gltf ) {
	stage=gltf;
	stage.scene.scale.multiplyScalar(1);
	stage.scene.position.y = -20
	stage.scene.position.z = 10;
	stage.scene.position.x = 0.6;
	scene.add( stage.scene );
   } );
	
}

function stage2(){
	//add stage 2

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

export function stateChanger(data){
	//do somet
	if(data.state=="Play"){
		removePreview(20);
		PlayButton=true
	}else if(data.state=="Stop"){
		PlayButton=false
	}else{
		group.remove(meshes[index-1]);
		index = 0;
		PlayButton=true;
	}
}

//todo: add xml to create dynamic demo structure
//following version is also working but its for some quick test. ll change.
export function demoChanger(data){
	resetStream();
	if(data.demo=="Demo - I"){
		numContainer=199;
		path = "../../sample_videos/demo1/container_";
	}else if(data.demo=="Demo - II"){
		numContainer=199;
		path = "../../sample_videos/demo2/container";
	}
	getVolumetricContainer();
	
}

export function stageChanger(data){
		if(data.stage=="Empty"){
		scene.remove(stage.scene);
	}else if("Stage - I"){
		stage1();
	}else{
		stage2();
	}

}

function resetStream(){
	PlayButton=false;
	scene.remove(meshes[index-1]);
	index = 0;
	meshes = [];
	iterContaier=0;
}

export default init;

