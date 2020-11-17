"use strict";

import { CatmullRomCurve3, Vector3 } from "../lib/three.module.js";
import { GLTFLoader } from "../loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export default class Rocket {
  constructor(parent) {
    this.parent = parent;
    this.model = null;
    //See #CatMullRomCurve3 in three.module.js
    this.spline = new CatmullRomCurve3([new Vector3(0, 14.55349347566225, 0),
      new Vector3(0, 50.468877958578936, 0),
      new Vector3(0, 127.468877958578936, -5),
      new Vector3(3.59355810697386, 255.33102703510173, -180.73519519620949),
      new Vector3(7.22780951323827, 350.3365615435138, -250.13985214306581),
      new Vector3(15.22780951323827, 447.3365615435138, -350.13985214306581),
      new Vector3(25.44424180938967, 645.5321517266408, -450.0637664646055),
      new Vector3(36.44424180938967, 700.5321517266408, -553.0637664646055)]
      );
  }

  generateModel = (textureUrl) => {
    loader.load(
      textureUrl,
      (object) => {
        const model = object.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        model.position.x = 0;
        model.position.y = this.parent.position.y + 2;
        model.position.z = 0;
        model.scale.multiplyScalar(5);
        this.parent.add(model);
        this.model = model;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading model.", error);
      }
    );
  };

  /**
   * Update the rocket's position the spline
   */
  animate = (index) => {
    if(index < 1.0){
      let pos = this.spline.getPointAt(index);
      this.model.position.x = pos.x;
      this.model.position.y = pos.y;
      this.model.position.z = pos.z;
      let rot = this.spline.getTangentAt(index);
      this.model.rotation.x = rot.x;
      this.model.rotation.y = rot.y;
      this.model.rotation.z = rot.z;
    }
  };
}
