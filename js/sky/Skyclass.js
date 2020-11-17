"use strict";

import { DirectionalLight, Vector3 } from "../lib/three.module.js";
import { Sky } from "./Sky.js";

export default class Skyclass {
  constructor(light = new DirectionalLight(0xffffff, 0.5)) {
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.sun = new Vector3();
    this.effects = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.004,
      mieDirectionalG: 0.65,
      inclination: 0.49, // elevation / inclination
      azimuth: 0.45, // Facing front,
      exposure: 1,
    };
    this.light = light;
    this.updateUniforms();
    this.updateSun();
  }

  updateUniforms() {
    this.sky.material.uniforms["turbidity"].value = this.effects.turbidity;
    this.sky.material.uniforms["rayleigh"].value = this.effects.rayleigh;
    this.sky.material.uniforms["mieCoefficient"].value = this.effects.mieCoefficient;
    this.sky.material.uniforms["mieDirectionalG"].value =
      this.effects.mieDirectionalG;
  }

  updateSun() {
    
    let theta = Math.PI * (this.effects.inclination - 0.5);
    let phi = 2 * Math.PI * (this.effects.azimuth - 0.5);

    this.sun.x = Math.cos(phi);
    this.sun.y = Math.sin(phi) * Math.sin(theta);
    this.sun.z = Math.sin(phi) * Math.cos(theta);

    this.light.position.set(this.sun.x, this.sun.y, this.sun.z);

    this.sky.material.uniforms["sunPosition"].value.copy(this.sun);
  }
}
