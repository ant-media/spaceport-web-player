import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js';

class threeUI{
	constructor(worker){
		const guiController = {
			Stream: "Demo - I",
			State : "Stop",
			Stage : "Scene - I"
		}
		const gui = new GUI();
		const demos = ["Demo - I", "Demo - II", "Demo - III"];
		const states = ["Play", "Stop", "Replay"];
		const stages = ["Scene - I", "Scene - II "]
		const demosFolder = gui.addFolder("Demos");
		const demoCtrl = demosFolder.add( guiController, 'Stream' ).options(demos);

		demoCtrl.onChange( function (){
			test(guiController.Stream);
		} )

		const statesFolder = gui.addFolder("States");
		function createStateCallback( name ) {
			guiController[ name ] = function () {
				//post message will be here.
				console.log(name);
			};
			statesFolder.add( guiController, name );
		}
		for ( let i = 0; i < states.length; i ++ ) {
			createStateCallback( states[ i ] );
		}

		const stagesFolder = gui.addFolder("Stages");
		const stagesCtrl = stagesFolder.add( guiController, 'Stage' ).options(stages);






	// 	const api = { demo: 'Demo - I' };
	// 	const sceneApi = { scene: 'Empty' };
	// 	const volumeApi = { volume: 0.2};
	// 	let gui = new GUI();
	// 	const demos = [ 'Demo - I'];
	// 	const emotes = [ 'Play', 'Stop', 'Replay'];
	// 	const stages = ['Empty', 'Stage - I'];
	// 	const demosFolder = gui.addFolder( 'Demos' );
	// 	const emotesFolder = gui.addFolder( 'State')
	// 	const stagesFolder = gui.addFolder( 'Scene')
	// 	const volumeFolder = gui.addFolder( 'Volume' );
	// 	volumeFolder.add( volumeApi, 'volume', 0.0, 1, 0.01 ).onChange( modifyTimeScale );
	// 	const demoCtrl = demosFolder.add( api, 'demo' ).options( demos );
	// 	demoCtrl.onChange( function () {
	// 		worker.postMessage({
	// 				type: 'gui',
	// 				sample: api.demo,
	// 				state : 'Play',
	// 				stage : sceneApi.scene,
	// 				});
	// 			} );
	
	// 	//api = { scene: 'Stage - I' };
	// 	var sceneCtrl = stagesFolder.add( sceneApi, 'scene' ).options( stages );
	// 	sceneCtrl.onChange( function () {
	// 		worker.postMessage({
	// 		type: 'gui',
	// 		sample: api.demo,
	// 		state : 'Stop',
	// 		stage : sceneApi.scene
	// 		});
	
	// } );
	
	// function modifyTimeScale( speed ) {
	
	// 	setAudioLevel(speed);
	
	// }
	
	// function createEmoteCallback( name ) {
	// 		api[ name ] = function () {
	// 			if(name=="Stop"){
	// 				stopAudio();
	// 			}
	// 			worker.postMessage({
	// 				type: 'gui',
	// 				sample: api.demo,
	// 				state: name,
	// 				stage : sceneApi.scene
	// 				});
	// 		};
		
	// 		emotesFolder.add( api, name );
	// }
	
	// for ( let i = 0; i < emotes.length; i ++ ) {
	// createEmoteCallback( emotes[ i ] );
	// }
	

	}
}


export function UI(worker){
	let UI = new threeUI(worker);
}

function test(stream){
	console.log("call gui",stream);
};


