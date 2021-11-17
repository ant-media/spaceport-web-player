
import { UI, playMessage } from './gui.js';
import { timeUpdate,makeVisibleInfo } from './index.js';

var videoUrl;
var box = document.getElementById( 'playPauseButton' );
var bufferAnm = document.getElementById( 'buffer' );
var src = document.getElementById( 'src' );
const playerContainer = document.querySelector('.player-container');

class PlayerManager{
    constructor( ) {
        this.errorMessage = document.getElementById( 'message' );
        this.offscreencanvas = document.getElementById( 'offscreencanvas' );
        this.width = offscreencanvas.clientWidth;
        this.height = offscreencanvas.clientHeight;
        this.pixelRatio = window.devicePixelRatio;
        // offscreen canvas
        if ( 'transferControlToOffscreen' in offscreencanvas ) {
            this.offscreen = offscreencanvas.transferControlToOffscreen();
            this.worker = new Worker( './js/workers/offscreen.js', { type: 'module' } );
            //looks bad, maybe i can create a class to handle some global variables.
            this.eventHandlers = {
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
        
        this.proxy = new ElementProxy(this.offscreencanvas, this.worker, this.eventHandlers);
        this.worker.postMessage( {
        thisdrawingSurface: this.offscreen,
        width: this.offscreencanvas.clientWidth,
        height: this.offscreencanvas.clientHeight,
        pixelRatio: window.devicePixelRatio,
        path: '../../',
        type: 'start',
        canvas: this.offscreen,
        canvasId: this.proxy.id,
        src: videoUrl,
    }, [ this.offscreen ] );
        } 
        else {
        errorMessage.style.display = 'block';
    }
    }

    getWorker(){
        return this.worker;

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

// reference && detailed : https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html
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

export function main(){
    
    videoUrl = src.innerHTML.substring(src.innerHTML.indexOf(':') + 1); // 01-2020
    console.log(videoUrl);
    var progressBarDiv;
		progressBarDiv = document.createElement( 'div' );
		// progressBarDiv.innerText = "Loading...";
		progressBarDiv.style.fontSize = "3em";
		progressBarDiv.style.color = "#888";
		progressBarDiv.style.display = "block";
		progressBarDiv.style.position = "absolute";
		progressBarDiv.style.top = "50%";
		progressBarDiv.style.width = "100%";
		progressBarDiv.style.textAlign = "center";
        progressBarDiv.style.zIndex = 3;


    const webPlayer = new PlayerManager();
     var progresBar = 0;
    // const progresBarUI =  document.getElementById("progressBar");

//PLAY PAUSE
    box.style.visibility= "hidden";
    
    //to handle received message coming from worker
    //increase proggres bar or decode audio
    const handlers = {
        videoTimeUpdate,
        incProgress,
        decodeAudio,
        endVideo,
    };
    
    //to inc progress bar
    function incProgress( ) {
        progresBar=progresBar+1;
        // bar1.set(progresBar);
        if(progresBar==100){
             hideProgressBar();
            //  bufferAnm.style.visibility = "hidden";
             box.style.visibility = "visible";
             bufferAnm.style.visibility = "hidden";
             progresBar=0;

        }else if(progresBar<100){
            showProgressBar();
            updateProgressBar( progresBar );    
        }else{
         //nothing   
        }    
    }

    function videoTimeUpdate(data){
       
        // console.log(data.videoTime);
        // var minute = Math. floor(data.videoTime/60); //
        // var second = data.videoTime%60/10;
        // console.log("video minute ", minute, "video second", second);
        timeUpdate(data.videoTime);
    }

    function endVideo(){
        makeVisibleInfo();
    }

    function displayPlaybutton(){
      //  bufferAnm.style.visibility = "hidden";
        box.style.visibility = "visible";
    }

    function updateProgressBar( fraction ) {
        progressBarDiv.innerText =  fraction;
    }

    function hideProgressBar() {
        document.body.removeChild( progressBarDiv );
        progressBarDiv.style.zIndex=0;
    }

    function showProgressBar() {
        document.body.appendChild( progressBarDiv );
    }
        
    //not possible to decode audio on workers side.
    function decodeAudio( data ) {
        var audioData = data.audata;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var sourceTemp = audioCtx.createBufferSource();
        audioCtx.decodeAudioData(audioData, function(buffer) {
            allAudio.push(buffer); 
        });
    }
    
    webPlayer.getWorker().onmessage = function ( message ) {
        var data = message.data;
        
        var messageType = handlers[data.type];
        if(!messageType){
            console.log("message handle error!");
        }
        else{
            messageType(data)
        }
    };

    UI( webPlayer.getWorker(), videoUrl);
}






