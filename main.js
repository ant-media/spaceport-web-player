var createIndex = 0;
const allAudio = [];
var audioCtx;
var volumeSeq=0;
function playAudio(){
    createIndex=1;
    var loopCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source=loopCtx.createBufferSource();
    if(volumeSeq>allAudio.length-1){
         volumeSeq=0;
        }
        source.buffer = allAudio[volumeSeq];
        source.connect(loopCtx.destination);
        source.loop = false;
        source.start(0);
        source.onended = function () {
             volumeSeq++;
             playAudio();
            }
        };
    


        