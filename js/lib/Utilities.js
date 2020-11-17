"use strict";

import { RepeatWrapping, TextureLoader } from "./three.module.js";

/**
 * Collection of general purpose utilities.
 * oskarbraten
 */
export default class Utilities {
	/**
	 * Loads image from url.
	 * @param  {String} url Location of image to load.
	 * @return {Promise} A Promise-object that resolves with the Image-object.
	 */
    static loadImage(url) {
        return new Promise((resolve, reject) => {

            if (!url) {
                reject('No URL was specified.');
            }

            let image = new Image();
            image.src = url;

            image.addEventListener('load', () => {
                resolve(image);
            });

            image.addEventListener('error', () => {
                reject('Unable to load image. Make sure the URL is correct (' + image.src + ').');
            });
        });
    }

	/**
	 * Loads heightmap data from an image.
	 * The image must be completely loaded before using this method.
	 * @param  {Image} image Image to load.
	 * @return {Array} A Uint8Array containing the heightmap data.
	 */
    static getHeightmapData(image, size) {
        let canvas = document.createElement('canvas');

        // assume texture is a square
        canvas.width = size;
        canvas.height = size;

        let context = canvas.getContext('2d');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        let data = new Float32Array(size * size);

        context.drawImage(image, 0, 0, size, size);

        let imageData = context.getImageData(0, 0, size, size).data;

        imageData.forEach((a, i) => {
            if (i % 4 === 0) { // only extract the first component of (r,g,b,a).
                data[Math.floor(i / 4)] = a / 255;
            }
        });

        return data;
    }

    static loadAndWrapTexture(url, uCoord, vCoord) {
    
      const texture = new TextureLoader().load(url);
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(uCoord, vCoord);
      return texture;
    }

    static loadTexture(url){
      return new TextureLoader().load(url);
    }

    static randomGauss(){
      "use strict";
      // See http://c-faq.com/lib/gaussian.html
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  
      var v1, v2, S;
  
      do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        S = v1 * v1 + v2 * v2;
      } while (S >= 1 || S == 0);
  
      // Ideally alternate between v1 and v2
      return v1 * Math.sqrt((-2 * Math.log(S)) / S);
    }

    static betweenRandomValues = (min, max) => Math.random() * (max - min) + min;

}