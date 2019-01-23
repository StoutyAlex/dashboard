
const convertResolutionToAspectRatio = (resolution, widthRatio, heightRatio) => {
  const widthPixels = resolution.split('x')[0];
  const heightPixels = resolution.split('x')[1];
  return ((widthPixels * heightRatio) / (heightPixels * widthRatio) === 1);
}

const fpsRAG = (fps = 0) => {
  if (fps === 0) return 'red';
  if (fps === 25) return 'green';
  return 'amber';
}

const bitrateRAG = (bitrate = 0) => {
  if (bitrate >= 0) {
    if (bitrate < 2000) return 'red';
    if ((bitrate >= 2000) && (bitrate < 3000)) return 'amber';
    return 'green';
  }
  return 'red';
}
  
const resolutionRAG = (resolution = '') => {
  if (resolution === '1920x1080' || resolution === '1280x720') return 'green';
  if (resolution !== '' && convertResolutionToAspectRatio(resolution, 16, 9)) return 'amber';
  return 'red';
}

const audioCodecRAG = (audioCodec = '') => {
  if (audioCodec === 'AAC') return 'green';
  return 'red';
}
  
const videoCodecRAG = (videoCodec = '') => {
  if (videoCodec === 'H264') return 'green';
  return 'red';
}
  
  export {
    fpsRAG,
    resolutionRAG,
    bitrateRAG,
    audioCodecRAG,
    videoCodecRAG,
  };
  