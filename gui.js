import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js';
export function UI(worker){
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

