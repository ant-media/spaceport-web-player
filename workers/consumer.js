    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
    import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
    import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
    import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';

console.log("consumer thread is working")
//import { sayHello } from './greet.js';
//import { sayHello } from './greet.js';

self.addEventListener('message',(m)=>{
  var document = {}
  const loadManager = new THREE.LoadingManager();
  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( '../draco/' );
  dracoLoader.setDecoderConfig( { type: 'js' } );


    var offset = 40;
    console.log("consumer.js")
    console.log(m.data)
    var frameNumber = 1;
    var i;
    for (i = 0; i < frameNumber ; i++) {
      var timeStamp = m.data.slice(offset,offset+8);
      var byteArray = new BigUint64Array(timeStamp);
      var myNumber = Number(byteArray[0]);
      console.log("worker thread timestamp  decode - | "+ myNumber);
      //timeStamps.push(myNumber);
      offset=offset+8;
      //var framePosition = reader.result.slice(offset,offset+8);
      //var byteArray = new BigUint64Array(framePosition);
      //offset=offset+8; 
    }
    var dracoSize = m.data.slice(offset,offset+8);
    var byteArray = new BigUint64Array(dracoSize);
    var myNumber = Number(byteArray[0]);
    offset=offset+8;
    console.log("worker thread dracosize  decode - | "+ myNumber);

    var drcMesh = m.data.slice(offset,offset+myNumber);
    //drcMeshes.push(drcMesh);
    offset=offset+myNumber;

    var jpgSize = m.data.slice(offset,offset+8);
    offset=offset+8;
    var jpgSizeView = new Float64Array(jpgSize);
    var byteArray = new BigUint64Array(jpgSize);
    var myNumber = Number(byteArray[0]);
    var newTexture =  m.data.slice(offset,offset+myNumber); 
    var textureView = new Uint8Array(newTexture);
    offset=offset+myNumber;

    var imageBlob = new Blob([textureView.buffer], {type: "image/jpg"});
    var url = URL.createObjectURL(imageBlob);
    console.log(url);

    //const loader = new THREE.ImageLoader();
    // this is for load texture but not working well.
    // loader.load(
    //     // resource URL
    //     'indir.jpg',
    
    //     // onLoad callback
    //     function ( image ) {
    //         // use the image, e.g. draw part of it on a canvas
    //         console.log("image loaded");
    //     },
    
    //     // onProgress callback currently not supported
    //     undefined,
    
    //     // onError callback
    //     function () {
    //         console.error( 'An error happened.' );
    //     }
    // );

    //texture loader
    // const textureLoader = new THREE.TextureLoader();
    // textureLoader.load(
    //   // resource URL
    //   'url',
    
    //   // onLoad callback
    //   function ( texture ) {
    //     // in this example we create the material when the texture is loaded
    //     const material = new THREE.MeshBasicMaterial( {
    //       map: texture
    //      } );
    //   },
    
    //   // onProgress callback currently not supported
    //   undefined,
    
    //   // onError callback
    //   function ( err ) {
    //     console.error( 'An error happened.' );
    //   }
    // );

    // const loader = new THREE.TextureLoader(loadManager);
    // var material = new THREE.MeshBasicMaterial({map: loader.load(url)});
    // loadManager.onLoad = () => {};

   // const texture = new THREE.TextureLoader().load('indir.jpg');

// instantiate a loader
const textureLoader = new THREE.ImageBitmapLoader();


// set options if needed


// load a image resource
textureLoader.load(
	// resource URL
	url,

	// onLoad callback
	function ( imageBitmap ) {
		const texture = new THREE.CanvasTexture( imageBitmap );
		const material = new THREE.MeshBasicMaterial( { map: texture } );
    const newMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    dracoLoader.decodeDracoFile(drcMesh,function(bufferGeometry){
    var geometry;
    geometry = new THREE.Mesh(bufferGeometry, newMaterial);
    var serializedGeometry = geometry.toJSON();
    postMessage(serializedGeometry);
    
});

	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );
	}
);






});



// addEventListener('message', e => {
//     console.log("test")
//   });