
import { UI } from './gui.js';

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

function progress(){
    progresBar++;
    bar1.set(progresBar);
    if(progresBar==100){
        progresBar.setAttribute("hidden","");
       // document.getElementById("play").style.display = "block";
    }
}

//to handle received message coming from worker
//increase proggres bar or decode audio
const handlers = {
    incProgress,
    decodeAudio,
  };

function incProgress(){
    progresBar++;
    bar1.set(progresBar);
    if(progresBar==100){
        progresBarUI.setAttribute("hidden","");
    }}

// not possible to decode audio on workers side.

function decodeAudio(data){
    var audioData = data.audata;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var sourceTemp = audioCtx.createBufferSource();
    audioCtx.decodeAudioData(audioData, function(buffer) {
    allAudio.push(buffer); 
     });
}

var progresBar=0;
export function main(){
    var worker;
    const offscreencanvas = document.getElementById( 'offscreencanvas' );
    const progresBarUI =  document.getElementById("progressBar");
    const width = offscreencanvas.clientWidth;
    const height = offscreencanvas.clientHeight;
    const pixelRatio = window.devicePixelRatio;

    // offscreen canvas
    if ( 'transferControlToOffscreen' in offscreencanvas ) {
        const offscreen = offscreencanvas.transferControlToOffscreen();
        worker = new Worker( 'offscreen.js', { type: 'module' } );
        //looks bad, maybe i can create a class to handle some global variables.
        UI(worker);
        worker.onmessage = function ( message ) {
            var data = message.data;
            var messageType = handlers[data.type]
            if(!messageType){
                console.log("message handle error!");
            }
            messageType(data)
        };

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
	
	playAudio();
	worker.postMessage({
				type: 'ui',
				play: `true`,
				});
}





