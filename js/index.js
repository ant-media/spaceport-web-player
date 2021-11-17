import { UI, playMessage, skip} from './gui.js';
// Dom elements, global constants
const backward = document.querySelector('.backward');
const currentTime = document.querySelector('.current-time');
const durationVideo = document.querySelector('.duration-video');
const expand = document.querySelector('.expand');
const forward = document.querySelector('.forward');
const informationContainer = document.querySelector('.information-container');
const pause = document.querySelector('.pause');
const play = document.querySelector('.play');
const progress = document.querySelector('.video-progress');
const progressBar = document.querySelector('.video-progress-filled');
const reduce = document.querySelector('.reduce');
const silence = document.querySelector('.silence');
const video = document.querySelector('.video');
const volume = document.querySelector('.volume');
const volumeProgress = document.querySelector('.volume-progress');
const volumeProgressBar = document.querySelector('.volume-progress-filled');
const playerHover = document.querySelector('.player-overlay');
const playerContainer = document.querySelector('.player-container');
const offscreencanvas = document.querySelector('#offscreencanvas');
var playBox = document.getElementById( 'playPauseButton' );
var bufferAnm = document.getElementById('buffer');
var currentVideoTime;
var videoPaused=true;
/**
// global functions
*/
function pauseVideo() {
  //console.log("video stop");
  pause.hidden = true;
  play.hidden = false;
  playMessage("Stop")
}

function playVideo() {
  //video.play();
  play.hidden = true;
  pause.hidden = false;
  playMessage("Play");
  makeInvisibleInfo();
}

function backwardVideo() {
  currentVideoTime -= 15;
  skip(currentVideoTime);
  playVideo();

}

function forwardVideo() {
  currentVideoTime += 15;
  skip(currentVideoTime);
  playVideo();

}

function showSilenceIcon() {
  volume.hidden = true;
  silence.hidden = false;
}

function showVolumeIcon() {
  volume.hidden = false;
  silence.hidden = true;
}

function videoTime(data) {
  data=data/10;
  let currentMinutes = Math.floor(data / 60);
  let currentSeconds = Math.floor(data % 60);
  // let durationMinutes = Math.floor(video.duration / 60);
  // let durationSeconds = Math.floor(video.duration - durationMinutes * 60);
  //hardcoded
  let durationMinutes = 0; //0 minute
  let durationSeconds = 20; //20 seconds
  //console.log("video minute ", currentMinutes, "video second", currentSeconds);

  currentTime.innerHTML = `${currentMinutes}:${
    currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds
  }`;

  durationVideo.innerHTML = `${durationMinutes}:${
    durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds
  }`;
}

function expandVideo() {
  if (document.body.webkitRequestFullscreen) {
    // chrome and safari
    document.body.webkitRequestFullscreen();
    expand.hidden = true;
    reduce.hidden = false;
  } else {
    // firefox
    document.body.requestFullscreen();
    expand.hidden = true;
    reduce.hidden = false;
  }
}

function reduceVideo() {
  if (document.body.webkitRequestFullscreen) {
    // chrome and safari
    document.webkitExitFullscreen();
    expand.hidden = false;
    reduce.hidden = true;
  } else {
    // firefox
    document.mozCancelFullScreen();
    expand.hidden = false;
    reduce.hidden = true;
  }
}

function makeInvisibleInfo(){
  playBox.style.visibility= "hidden";
  // bufferAnm.style.visibility= "hidden";
  informationContainer.style.zIndex=-1;
}

export function makeVisibleInfo(){
  //playBox.style.visibility= "visible";
 // informationContainer.style.zIndex=1;
 pauseVideo();
}

export function timeUpdate(data){
    //console.log("somethings happened on video progress bar");
    currentVideoTime = data;
    videoTime(data);
    // progress bar
    data=data/10;
    //harcoded ll be change in the future. i hope.
    var duration=20
    const percentage = (data / duration) * 100;
    //console.log("percentage", percentage);
    progressBar.style.width = `${percentage}%`;
    // if (video.currentTime === video.duration) {
    //   pause.hidden = true;
    //   play.hidden = false;
    // }
   
}

/**
// show or hide controls
 */
let timeout = 0;
offscreencanvas.addEventListener('mousemove', () => {
  clearTimeout(timeout);
  //console.log("make opacity 1");
  playerContainer.style.opacity = 1;
  timeout = setTimeout(function () {
    playerContainer.style.opacity = 0;
  }, 3000);
});
/**
//
 */

/**
// video functionality
*/
video.addEventListener('loadedmetadata', () => {
  video.volume = 0.5;
  volumeProgressBar.style.width = '50%';
});


video.addEventListener('volumechange', () => {
  if (video.volume > 0) {
    showVolumeIcon();
  } else {
    showSilenceIcon();
  }
});
/**
//
*/

// progress bar functionality
progress.addEventListener('click', (event) => {
  console.log("clicked video progress bar!");
  //hardcoded
  const progressTime = (event.offsetX / progress.offsetWidth) * 20*10;
   var setTime = Math.round(progressTime);
   console.log(setTime);
   currentVideoTime = setTime;
   skip(currentVideoTime);
   playVideo();
});

// play functionality
play.addEventListener('click', playVideo);

// pause functionality
pause.addEventListener('click', pauseVideo);

// backward functionality
backward.addEventListener('click', () => {
  backwardVideo();
});

// forward functionality
forward.addEventListener('click', () => {
  forwardVideo();
});

// play-pause on the video
informationContainer.addEventListener('click', () => {
  if (video.paused) {
    playVideo();
  } else {
    pauseVideo();
  }
});

/**
// volume functionality
*/
volumeProgress.addEventListener('click', (event) => {
  const progressVolume = (event.offsetX / volumeProgress.offsetWidth) * 1;
  const percentage = progressVolume * 100;
  volumeProgressBar.style.width = `${percentage}%`;
  video.volume = progressVolume;
});

volume.addEventListener('click', () => {
  showVolumeIcon;
  video.volume = 0;
  volumeProgressBar.style.width = '0';
});

silence.addEventListener('click', () => {
  showSilenceIcon;
  video.volume = 0.5;
  volumeProgressBar.style.width = '50%';
});
/**
//
*/

/**
// expand / reduce fullscreen
*/

// expand functionality
expand.addEventListener('click', expandVideo);

// reduce functionality
reduce.addEventListener('click', reduceVideo);

// chrome & safari
document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitIsFullScreen) {
    expand.hidden = false;
    reduce.hidden = true;
  }
});

// firefox
document.addEventListener('fullscreenchange', () => {
  if (!document.mozFullScreen) {
    expand.hidden = false;
    reduce.hidden = true;
  }
});

/**
//
*/

// keyboard functionality
document.addEventListener('keydown', (event) => {
  // space bar - play/plause
  if (event.code === 'Space') {
    if (videoPaused) {
      videoPaused=false;
      playVideo();
    } else {
      videoPaused=true;
      pauseVideo();
    }
  }

  // letter F - fullscreen
  if (event.code === 'KeyF') {
    expandVideo();
  }
});


playBox.addEventListener('click', (e)=>{
  makeInvisibleInfo();
  playVideo();
})

