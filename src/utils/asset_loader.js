import createjs from 'preload-js';
import Sound from 'createjs-soundjs';
import manifest from '../sounds/asset_manifest.json';

export const assetLoader = () => {
  // Reset the UI
  document.getElementById('progress').style.width = '0px';

  // Create a preloader.
  const preload = new createjs.LoadQueue();
  preload.installPlugin(createjs.Sound);
  const assetManifest = manifest.manifest;


  // If there is an open preload queue, close it.
  if (preload != null) {
    preload.close();
  }

  // File complete handler
  const handleFileLoad = (event) => {
    console.log(`Preloaded: ${event.item.id}`);
    Sound.play(event.item.id);
    // const file = preload.getResult(event.item.id);

    // Get a reference to the loaded file and
    // add it to the DOM -- uncomment when start loading images
    // document.body.appendChild(event.result);
  };
  // Overall progress handler
  const handleOverallProgress = () => {
    document.getElementById('progress').style.width = `${(preload.progress * document.getElementById('progress-wrap').clientWidth)}px`;
  };
  // Error handler
  const handleFileError = (event) => {
    console.log(`error: ${event.item.id}, ${event.text}`);
  };

  const handleComplete = () => {
    console.log('loading complete');
  };

  preload.on('fileload', handleFileLoad);
  preload.on('progress', handleOverallProgress);
  preload.on('error', handleFileError);
  preload.on('complete', handleComplete);
  preload.setMaxConnections(5);

  const loadAnother = () => {
    // Get the next manifest item, and load it
    const item = assetManifest.shift();
    preload.loadFile(item);
  };
  const loadAll = () => {
    while (assetManifest.length > 0) {
      loadAnother();
    }
  };
  loadAll();
};

export const playSound = (item) => {
  console.log(item);
  console.log(`playing sound: ${item}`);
  // const sound = document.createElement('audio');
  // sound.setAttribute('autoplay', 'autoplay');
  // sound.setAttribute('src', sounds[item]);
  const preload = new createjs.LoadQueue();
  preload.installPlugin(createjs.Sound);
  createjs.Sound.play(item);
};
