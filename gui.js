import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js';

class threeUI{
	constructor(worker){
		const guiController = {
			Stream : "Demo - I",
			State  : "Stop",
			Stage  : "Empty",
			Volume : 0.2
		}
		const gui = new GUI();
		const demos = ["Demo - I", "Demo - II" ];
		const states = ["Play", "Stop", "Replay"];
		const stages = ["Empty", "Scene - I", "Scene - II "]
		const demosFolder = gui.addFolder("Demos");
		const demoCtrl = demosFolder.add( guiController, 'Stream' ).options(demos);

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
		function createStateCallback( name ) {
			guiController[ name ] = function () {
				worker.postMessage({
					type  : 'gui',
					panel : 'states',
					demo  : guiController.Stream,
					state : name,
					stage : guiController.Stage,
				});
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
		
		const volumeFolder = gui.addFolder( 'Volume' );
		volumeFolder.add( guiController, 'Volume', 0.0, 1, 0.01 ).onChange( modifyVolumeLevel );
		function modifyVolumeLevel( volume ) {
			setAudioLevel(volume);	
		}




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
	

	
	// function createEmoteCallback( name ) {
	// 		api[ name ] = function () {
	// 			if(name=="Stop"){
	// 				stopAudio();
	// 			}
	// 			
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


