import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js';

const mouseEventHandler = makeSendPropertiesHandler([
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'button',
    'pointerType',
    'clientX',
    'clientY',
    'pageX',
    'pageY',]);

const wheelEventHandlerImpl = makeSendPropertiesHandler([
    'deltaX',
    'deltaY',]);

const keydownEventHandler = makeSendPropertiesHandler([
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'keyCode',]);

function wheelEventHandler(event, sendFn) {
    event.preventDefault();
    wheelEventHandlerImpl(event, sendFn);
}

function preventDefaultHandler(event) {
    event.preventDefault();
}

function copyProperties(src, properties, dst) {
    for (const name of properties) {
        dst[name] = src[name];
    }
}

function makeSendPropertiesHandler(properties) {
    return function sendProperties(event, sendFn) {
        const data = {type: event.type};
        copyProperties(event, properties, data);
        sendFn(data);
    };
}

function touchEventHandler(event, sendFn) {
    const touches = [];
    const data = {type: event.type, touches};
    for (let i = 0; i < event.touches.length; ++i) {
        const touch = event.touches[i];
        touches.push({
            pageX: touch.pageX,
            pageY: touch.pageY,
        });
    }
    sendFn(data);
}

// The four arrow keys
const orbitKeys = {
    '37': true,  // left
    '38': true,  // up
    '39': true,  // right
    '40': true,  // down
};

function filteredKeydownEventHandler(event, sendFn) {
    const {keyCode} = event;
    if (orbitKeys[keyCode]) {
        event.preventDefault();
        keydownEventHandler(event, sendFn);
    }
}

let nextProxyId = 0;
class ElementProxy {
    constructor(element, worker, eventHandlers) {
        this.id = nextProxyId++;
        this.worker = worker;
        const sendEvent = (data) => {
            this.worker.postMessage({
                type: 'event',
                id: this.id,
                data,
            });
        };
// register an id
    worker.postMessage({
        type: 'makeProxy',
        id: this.id,
    });
    sendSize();
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
        element.addEventListener(eventName, function(event) {
             handler(event, sendEvent);
        });
    }

    function sendSize() {
        const rect = element.getBoundingClientRect();
        sendEvent({
            type: 'size',
            left: rect.left,
            top: rect.top,
            width: element.clientWidth,
            height: element.clientHeight,
        });
    }
    // really need to use ResizeObserver
    window.addEventListener('resize', sendSize);
    }
}


export function main(worker){
    //maybe i can define the worker inside of the main
    //dunno, will try.
    //const canvas1 = document.getElementById( 'canvas1' );
    
    const offscreencanvas = document.getElementById( 'offscreencanvas' );
    const width = offscreencanvas.clientWidth;
    const height = offscreencanvas.clientHeight;
    const pixelRatio = window.devicePixelRatio;
    var progresBar=0;

    function progress(){
        progresBar++;
        bar1.set(progresBar);
        if(progresBar==100){
            progresBar.setAttribute("hidden","");
           // document.getElementById("play").style.display = "block";
}
    }



    // offscreen
    if ( 'transferControlToOffscreen' in offscreencanvas ) {
        const offscreen = offscreencanvas.transferControlToOffscreen();
        worker = new Worker( 'offscreen.js', { type: 'module' } );
        worker.onmessage = function(e) {
        if(e.data.type=="progress"){
            progresBar++;
                bar1.set(progresBar);
                if(progresBar==100){
                    document.getElementById("progressBar").setAttribute("hidden","");
                 //   document.getElementById("play").style.display = "block";
        }
    
 }if(e.data.type=="audio"){

    var audioData = e.data.audata;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var sourceTemp = audioCtx.createBufferSource();
    audioCtx.decodeAudioData(audioData, function(buffer) {
    allAudio.push(buffer); 
     });
 }

} 

 const eventHandlers = {
    contextmenu: preventDefaultHandler,
    mousedown: mouseEventHandler,
    mousemove: mouseEventHandler,
    mouseup: mouseEventHandler,
    pointerdown: mouseEventHandler,
    pointermove: mouseEventHandler,
    pointerup: mouseEventHandler,
    touchstart: touchEventHandler,
    touchmove: touchEventHandler,
    touchend: touchEventHandler,
    wheel: wheelEventHandler,
    keydown: filteredKeydownEventHandler,
 };

const proxy = new ElementProxy(offscreencanvas, worker, eventHandlers);

worker.postMessage( {
drawingSurface: offscreen,
width: offscreencanvas.clientWidth,
height: offscreencanvas.clientHeight,
pixelRatio: window.devicePixelRatio,
path: '../../',
type: 'start',
canvas: offscreen,
canvasId: proxy.id,
}, [ offscreen ] );

} else {
document.getElementById( 'message' ).style.display = 'block';
}
}



function play(){
	//document.getElementById("play").style.display="none";
	playAudio();
	worker.postMessage({
				type: 'ui',
				play: `true`,
				});
}



export function createGUI(){
	const api = { demo: 'Demo - I' };
	const sceneApi = { scene: 'Empty' };
	const volumeApi = { volume: 0.2};
	var gui = new GUI();
	const demos = [ 'Demo - I'];
	const emotes = [ 'Play', 'Stop', 'Replay'];
	const stages = ['Empty', 'Stage - I'];
	const demosFolder = gui.addFolder( 'Demos' );
	const emotesFolder = gui.addFolder( 'State')
	const stagesFolder = gui.addFolder( 'Scene')
	const volumeFolder = gui.addFolder( 'Volume' );

	volumeFolder.add( volumeApi, 'volume', 0.0, 1, 0.01 ).onChange( modifyTimeScale );
	const demoCtrl = demosFolder.add( api, 'demo' ).options( demos );
	demoCtrl.onChange( function () {

		worker.postMessage({
				type: 'gui',
				sample: api.demo,
				state : 'Play',
				stage : sceneApi.scene,
				});

} );

    //api = { scene: 'Stage - I' };
	
	var sceneCtrl = stagesFolder.add( sceneApi, 'scene' ).options( stages );
	sceneCtrl.onChange( function () {
        worker.postMessage({
		type: 'gui',
		sample: api.demo,
		state : 'Stop',
		stage : sceneApi.scene
		});

} );

function modifyTimeScale( speed ) {

	setAudioLevel(speed);

}

function createEmoteCallback( name ) {
		api[ name ] = function () {
			if(name=="Stop"){
				stopAudio();
			}
			worker.postMessage({
				type: 'gui',
				sample: api.demo,
				state: name,
				stage : sceneApi.scene
				});
		};
	
		emotesFolder.add( api, name );
}

for ( let i = 0; i < emotes.length; i ++ ) {
createEmoteCallback( emotes[ i ] );
}


	
	

}



