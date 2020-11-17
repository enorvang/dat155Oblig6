"use strict";

import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  Mesh,
  MeshPhongMaterial,
} from "../lib/three.module.js";

/**
 * Class that generates a launch platform for our rocket
 */
export default class LaunchPlatform extends Mesh{
  constructor(scene, terrainGeometry, texture, posX, posZ) {
    const geometry = new BoxBufferGeometry(30, 3, 30);
    const material = new MeshPhongMaterial({
      map: texture,
      shininess: 1.0,
    });
    super(geometry, material);
    this.scene = scene;
    this.position.x = posX;
    this.position.y = terrainGeometry.getHeightAt(posX, posZ) + 10;
    this.position.z = posZ;
    this.platformLegs = [];
    this.castShadow=true;
    this.receiveShadow=true;
  }

  /**
   * Function that places the platform's legs in the correct positions.
   */
  generatePlatformLegs = () => {
    const legRadius = 3;
    const radialSegments = 20;
    const heightSegments = 32;

    const geometry = new CylinderBufferGeometry(
      legRadius,
      legRadius,
      radialSegments,
      heightSegments
    );

    const platformLeg = new Mesh(geometry, this.material);

    let posX = this.position.x + this.geometry.parameters.width / 2;
    let posY = this.position.y + this.geometry.parameters.height / 2;
    let posZ = this.position.z + this.geometry.parameters.depth / 2;

    platformLeg.position.x = posX;
    platformLeg.position.y = posY-8;
    platformLeg.position.z = posZ;

    platformLeg.castShadow=true;
    platformLeg.receiveShadow=true;
    this.scene.add(platformLeg);

    const platformLeg2 = new Mesh(geometry, this.material);

    platformLeg2.position.x = this.position.x + this.geometry.parameters.width / 2;
    platformLeg2.position.y = this.position.y + this.geometry.parameters.height / 2 -8;
    platformLeg2.position.z = this.position.z - this.geometry.parameters.depth / 2;

    platformLeg2.castShadow=true;
    platformLeg2.receiveShadow=true;
    this.scene.add(platformLeg2);

    const platformLeg3 = new Mesh(geometry, this.material);

    platformLeg3.position.x = this.position.x - this.geometry.parameters.width / 2;
    platformLeg3.position.y = this.position.y + this.geometry.parameters.height / 2 -8;
    platformLeg3.position.z = this.position.z + this.geometry.parameters.depth / 2;

    platformLeg3.castShadow=true;
    platformLeg3.receiveShadow=true;
    this.scene.add(platformLeg3);

    const platformLeg4 = new Mesh(geometry, this.material);

    platformLeg4.position.x = this.position.x - this.geometry.parameters.width / 2;
    platformLeg4.position.y = this.position.y + this.geometry.parameters.height / 2-8;
    platformLeg4.position.z = this.position.z - this.geometry.parameters.depth / 2;

    platformLeg4.castShadow=true;
    platformLeg4.receiveShadow=true;
    this.scene.add(platformLeg4);

  };

    /**
   * 8 corners of a cube.
  position.x + width/2, position.y + height/2, position.z + depth/2 //nede høyre
  position.x + width/2, position.y + height/2, position.z - depth/2 //oppe høyre
  position.x + width/2, position.y - height/2, position.z + depth/2 //---
  position.x + width/2, position.y - height/2, position.z - depth/2 //---
  position.x - width/2, position.y + height/2, position.z + depth/2 //nede venstre
  position.x - width/2, position.y + height/2, position.z - depth/2 //oppe venstre
  position.x - width/2, position.y - height/2, position.z + depth/2
  position.x - width/2, position.y - height/2, position.z - depth/2
   */
}