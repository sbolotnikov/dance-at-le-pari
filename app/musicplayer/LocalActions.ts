'use client'
import { AudioFileWithSettings } from '@/types/screen-settings';

// This is a browser-only module. `lamejs` is expected to be on the window object from the CDN script.
declare const lamejs: any;

const createWorker = (lamejsScriptContent: string) => {
  const workerCode = `
    ${lamejsScriptContent}

    self.onmessage = (e) => {
      const { audioData, sampleRate, bitRate } = e.data;
      const { left, right } = audioData;

      const mp3encoder = new lamejs.Mp3Encoder(2, sampleRate, bitRate);
      
      const sampleBlockSize = 1152; //can be anything but make it a multiple of 576 to make encoders life easier

      const mp3Data = [];
      const totalSamples = left.length;

      for (let i = 0; i < totalSamples; i += sampleBlockSize) {
        const leftChunk = left.subarray(i, i + sampleBlockSize);
        let rightChunk = right;
        // lamejs requires stereo channels to be of the same length
        if (right) {
           rightChunk = right.subarray(i, i + sampleBlockSize);
        }
        
        const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
        if (mp3buf.length > 0) {
            mp3Data.push(new Int8Array(mp3buf));
        }
        const progress = (i / totalSamples) * 100;
        self.postMessage({ type: 'progress', progress: progress });
      }
      const mp3buf = mp3encoder.flush();
      if (mp3buf.length > 0) {
          mp3Data.push(new Int8Array(mp3buf));
      }
      
      self.postMessage({ type: 'result', data: mp3Data });
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

const float32ToInt16 = (buffer: Float32Array): Int16Array => {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf;
};


export const processAndStitchAudio = (
  files: AudioFileWithSettings[],
  trackLength: number,
  fadeOutDuration: number,
  silenceDuration: number,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    
      
    if (files.length === 0) {
      return resolve('');
    }

    const firstFile = files[0];
    const sampleRate = firstFile.audioBuffer.sampleRate;
    const numChannels = firstFile.audioBuffer.numberOfChannels;

    let totalDuration = 0;
    const segmentDurations = files.map(file => {
        const effectiveDuration = file.duration / file.speed;
        const segmentDuration = Math.min(effectiveDuration, trackLength);
        totalDuration += segmentDuration;
        return segmentDuration;
    });

    if (files.length > 1) {
        totalDuration += (files.length - 1) * silenceDuration;
    }
    
    if (totalDuration <= 0) {
        return reject(new Error('Total duration is zero. Check length settings.'));
    }

    const offlineContext = new OfflineAudioContext(numChannels, Math.ceil(totalDuration * sampleRate), sampleRate);

    let currentTime = 0;
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (!file.audioBuffer) continue;

      const segmentDuration = segmentDurations[index];
      if (segmentDuration <= 0) continue;

      const source = offlineContext.createBufferSource();
      source.buffer = file.audioBuffer;
      source.playbackRate.value = file.speed;
      
      const gainNode = offlineContext.createGain();
      source.connect(gainNode);
      gainNode.connect(offlineContext.destination);

      gainNode.gain.setValueAtTime(1, currentTime);
      if (fadeOutDuration > 0) {
        const effectiveFadeDuration = Math.min(fadeOutDuration, segmentDuration);
        const fadeStartTime = currentTime + segmentDuration - effectiveFadeDuration;
        if(fadeStartTime > currentTime) {
            gainNode.gain.setValueAtTime(1, fadeStartTime);
        }
        gainNode.gain.linearRampToValueAtTime(0.0001, currentTime + segmentDuration);
      }

      source.start(currentTime);
      source.stop(currentTime + segmentDuration);

      currentTime += segmentDuration;
      // Add silence gap if it's not the last track
      if (index < files.length - 1) {
          currentTime += silenceDuration;
      }
    }

    const stitchedBuffer = await offlineContext.startRendering();
    
    const left = float32ToInt16(stitchedBuffer.getChannelData(0));
    const right = stitchedBuffer.numberOfChannels > 1 ? float32ToInt16(stitchedBuffer.getChannelData(1)) : left;

    const response = await fetch('/lame.min.js');
    const lamejsScriptContent = await response.text();
    console.log('Lamejs script content loaded for worker.');
    const worker = createWorker(lamejsScriptContent);
    
    worker.onmessage = (e) => {
        const { type, progress, data } = e.data;
        if (type === 'progress') {
            onProgress(progress);
        } else if (type === 'result') {
            onProgress(100);
            const blob = new Blob(data, { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            resolve(url);
            worker.terminate();
        }
    };
    
    worker.onerror = (e) => {
        reject(new Error(`Worker error: ${e.message}`));
        worker.terminate();
    };

    worker.postMessage({
        audioData: { left, right },
        sampleRate: stitchedBuffer.sampleRate,
        bitRate: 128
    });
  });
};
