import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js';

var newWorker;
var videoSrc
const guiController = {
	Stream : videoSrc,
	State  : "Stop",
	Stage  : "Empty",
	Volume : 0.2
}

class threeUI{
	constructor(worker){
	
		const gui = new GUI();
		const demos = ["Demo - I", "Demo - II", "Demo - III", "Demo - IV" ];
		const states = ["Play", "Stop", "Replay"];
		const stages = ["Empty", "Scene - I"]
		const demosFolder = gui.addFolder("Demos");
		const demoCtrl = demosFolder.add( guiController, 'Stream' ).options(demos);
        console.log("const test");
		demoCtrl.onChange( function (){
				worker.postMessage({
				type  : 'gui',
				panel : 'demos',
				demo  : guiController.Stream,
				state : 'Stop',
				stage : guiController.Stage,
			});
		});

		const statesFolder = gui.addFolder("States");
		statesFolder.close();
		function createStateCallback( name ) {
			guiController[ name ] = function () {
				playMessage(name);
			};
			statesFolder.add( guiController, name );
		}
		for ( let i = 0; i < states.length; i ++ ) {
			createStateCallback( states[ i ] );
		}

		const stagesFolder = gui.addFolder("Stages");
		const stagesCtrl = stagesFolder.add( guiController, 'Stage' ).options(stages);
		stagesCtrl.onChange( function (){
			worker.postMessage({
			type  : 'gui',
			panel : 'stages',
			demo  : guiController.Stream,
			state : guiController.State,
			stage : guiController.Stage,
		});
	});
		
		// volume level 
		// const volumeFolder = gui.addFolder( 'Volume' );
		// volumeFolder.add( guiController, 'Volume', 0.0, 1, 0.01 ).onChange( modifyVolumeLevel );
		// function modifyVolumeLevel( volume ) {
		// 	setAudioLevel(volume);	
		// }
	
	}
}

export function playMessage(name){
	    newWorker.postMessage({
		type  : 'gui',
		panel : 'states',
		demo  : videoSrc,
		state : name,
		stage : guiController.Stage,
	});
}

export function skip(seconds){
	console.log("skip called");
	newWorker.postMessage({
	type  : 'gui',
	panel : 'skip',
	demo  : guiController.Stream,
	state : 'Play',
	stage : guiController.Stage,
	skip  : seconds,
});
}

export function UI(worker, url){
	newWorker = worker;
	videoSrc = url;
	//let UI = new threeUI(worker);
}


