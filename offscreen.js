import init from './scene.js';
import {playVideo} from './scene.js';
import {EventDispatcher}from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import {stateChanger} from './scene.js';
import {demoChanger} from './scene.js';
import {stageChanger} from  './scene.js';

function noop() {
}

class ElementProxyReceiver extends EventDispatcher {
  constructor() {
    super();
  }
  get clientWidth() {
    return this.width;
  }
  get clientHeight() {
    return this.height;
  }
  getBoundingClientRect() {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      right: this.left + this.width,
      bottom: this.top + this.height,
    };
  }
  handleEvent(data) {
    if (data.type === 'size') {
      this.left = data.left;
      this.top = data.top;
      this.width = data.width;
      this.height = data.height;
      return;
    }
    data.preventDefault = noop;
    data.stopPropagation = noop;
    this.dispatchEvent(data);
  }
  focus() {
    // no-op
  }
}

class ProxyManager {
  constructor() {
    this.targets = {};
    this.handleEvent = this.handleEvent.bind(this);
  }
  makeProxy(data) {
    const {id} = data;
    const proxy = new ElementProxyReceiver();
    this.targets[id] = proxy;
  }
  getProxy(id) {
    return this.targets[id];
  }
  handleEvent(data) {
    this.targets[data.id].handleEvent(data.data);
  }
}

const proxyManager = new ProxyManager();

function start(data) {
  const proxy = proxyManager.getProxy(data.canvasId);
  proxy.ownerDocument = proxy; // HACK!
  self.document = {};  // HACK!
  //data.canvas look unnecessary
  init( data.drawingSurface, data.width, data.height, data.pixelRatio, data.path, data.canvas, proxy );

}

function makeProxy(data) {
  proxyManager.makeProxy(data);
}

function ui(data){
  //console.log("ui event called");
  //console.log(data.play)
  playVideo(data.play);
  //playVideo(data.play)
}

//to handle gui class 
function gui(data){
  console.log("gui event called");
  switch(data.panel){
    case "demos":
      demoChanger(data);
      //call demo changer function
      break;
    case "states":
      //call state changer function
      stateChanger(data);
      break;
    case "stages":
      //call stage changer funtion
      stageChanger(data);
      break;
  }
  
  //playVideo(data.play)
}

const handlers = {
  start,
  makeProxy,
  ui,
  gui,
  event: proxyManager.handleEvent,
};

self.onmessage = function ( message ) {
    var data = message.data;
    const fn = handlers[data.type]
    if(!fn){
      console.log("message handle error!");
    }else{
      //console.log(data.type)
    }
    fn(data)
};