import init from './scene.js';
import {playVideo} from './scene.js';
import {EventDispatcher}from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import {guiSettings} from './scene.js';

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
  console.log("data canvas id || ",data.canvasId)
  proxy.ownerDocument = proxy; // HACK!
  self.document = {};  // HACK!
  console.log("data.canvas ==== ", data.canvas);
  console.log("init")
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

function gui(data){
  //console.log("gui event called");
  guiSettings(data)
  
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
    //console.log("message handle error!");
  }else{
    //console.log(data.type)
  }
  fn(data)


};