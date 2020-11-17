"use strict";

import {  Mesh, MeshPhongMaterial } from "../lib/three.module.js";
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
    const material = new TextureSplattingMaterial({
      color: 0xffffff,
      shininess: 0,
      textures: textures,
      splatMaps: splatmaps,
    });
    // const material = new MeshPhongMaterial({
    //   map: textures[1],
    // }) 

    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
  }
}
