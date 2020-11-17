"use strict";

import { Water } from "../vendor/Water.js";
import {
  PlaneBufferGeometry,
  RepeatWrapping,
  TextureLoader,
} from "../lib/three.module.js";

/**
 * Class that creates an ocean based on the Water.js class.
 */
export default class Ocean extends Water{
  constructor(width=1000, height=1000, textureUrl) {
    let geometry = new PlaneBufferGeometry(width, height);
    let options = {
      waterNormals: new TextureLoader().load(textureUrl, (texture) => {
        texture.wrapS = texture.wrapT = RepeatWrapping;
      }),
      alpha: 1.0,
      distortionScale: 3.7,
      fog: true,
    }

    super(geometry, options);

    this.rotation.x = -Math.PI/2;
    this.position.y = 1;
    
  }

  animateOcean = () => {
    this.material.uniforms["time"].value += 1.0 / 360.0;
  }

}

