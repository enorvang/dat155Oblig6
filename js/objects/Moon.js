"use strict";

import {
  Mesh,
  MeshPhongMaterial,
  SphereBufferGeometry,
} from "../lib/three.module.js";

export default class Moon extends Mesh {
  constructor({
    texture,
    radius = 20,
    widthSegments = 64,
    heightSegments = 64,
    positions = [1, 50, -20],
    bumpMap,
  }) {
    const geometry = new SphereBufferGeometry(radius, widthSegments, heightSegments);

    const material = new MeshPhongMaterial({
      map: texture,
      shininess: 0.0,
      fog: false,
      bumpMap: bumpMap,
      bumpScale: 20,
    });

    super(geometry, material);
    this.position.x = positions[0];
    this.position.y = positions[1];
    this.position.z = positions[2];

    this.rotateMoon.bind(this);
  }

  /**
   * Rotates the moon
   * @param {Array} rotation xyz rotations
   */
  rotateMoon = (rotation) => {
    this.rotation.x += rotation[0];
    this.rotation.y += rotation[1];
    this.rotation.z += rotation[2];
  };
}
