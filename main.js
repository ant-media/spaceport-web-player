

  var createIndex = 0;
  const allAudio = [];
  var audioCtx;
  var volumeSeq=0;
  var x=1

  function setAudioLevel(myVolume){
  x = myVolume;

  }
  
  function playAudio(){
    
     
      createIndex=1;
      var loopCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const gainNode = loopCtx.createGain(); // Create a gainNode reference.
      gainNode.gain.value = x  // 100% VOLUME RANGE OF VALUE IS 0-1
      gainNode.connect(loopCtx.destination); // Add context to gainNode
  
      var source=loopCtx.createBufferSource();
      
      if(volumeSeq>allAudio.length-1){
           volumeSeq=0;
          }
          source.buffer = allAudio[volumeSeq];
         
          source.loop = false;
          source.connect(gainNode);
          source.start(0);
          source.onended = function () {
               volumeSeq++;
               playAudio();
              }
          };
      

        function buildWaveHeader(opts) {
            const numFrames =      opts.numFrames;
            const numChannels =    opts.numChannels || 2;
            const sampleRate =     opts.sampleRate || 48000;
            const bytesPerSample = opts.bytesPerSample || 2;
            const format =         opts.format
          
            const blockAlign = numChannels * bytesPerSample;
            const byteRate = sampleRate * blockAlign;
            const dataSize = numFrames * blockAlign;
          
            const buffer = new ArrayBuffer(44);
            const dv = new DataView(buffer);
          
            let p = 0;
          
            function writeString(s) {
              for (let i = 0; i < s.length; i++) {
                dv.setUint8(p + i, s.charCodeAt(i));
              }
              p += s.length;
          }
          
            function writeUint32(d) {
              dv.setUint32(p, d, true);
              p += 4;
            }
          
            function writeUint16(d) {
              dv.setUint16(p, d, true);
              p += 2;
            }
          
            writeString('RIFF');              // ChunkID
            writeUint32(dataSize + 36);       // ChunkSize
            writeString('WAVE');              // Format
            writeString('fmt ');              // Subchunk1ID
            writeUint32(16);                  // Subchunk1Size
            writeUint16(format);              // AudioFormat
            writeUint16(numChannels);         // NumChannels
            writeUint32(sampleRate);          // SampleRate
            writeUint32(byteRate);            // ByteRate
            writeUint16(blockAlign);          // BlockAlign
            writeUint16(bytesPerSample * 8);  // BitsPerSample
            writeString('data');              // Subchunk2ID
            writeUint32(dataSize);            // Subchunk2Size
          
            return buffer;
          }

