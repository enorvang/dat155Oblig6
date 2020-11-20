"use strict";

import {  Mesh } from "../lib/three.module.js";
import TextureSplattingMaterial from "../materials/TextureSplattingMaterial.js";
import TerrainBufferGeometry from "./TerrainBufferGeometry.js";

export default class Island extends Mesh{
  constructor(heightmapImage, width, textures=[], splatmaps=[]) {
    const geometry = new TerrainBufferGeometry({
      width: width,
      heightmapImage: heightmapImage,
      numberOfSubdivisions: 128,
      height: 30,
    });
    let material = new TextureSplattingMaterial({
      color: 0xffffff,
      shininess: 0,
      textures: textures,
      splatMaps: splatmaps,
    });


    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
  }
}
