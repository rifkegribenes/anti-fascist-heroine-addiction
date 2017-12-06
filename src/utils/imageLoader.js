const preloadImage = (url, callback) => {
  const img = new Image();
  img.src = url;
  img.onload = callback;
};

const preloadImages = (urls, allImagesLoadedCallback) => {
  let loadedCounter = 0;
  const toBeLoadedNumber = urls.length;
  urls.forEach((url) => {
    preloadImage(url, () => {
      loadedCounter += 1;
      console.log(`Number of loaded images: ${loadedCounter}`);
      if (loadedCounter === toBeLoadedNumber) {
        allImagesLoadedCallback();
      }
    });
  });
};

export default preloadImages;
