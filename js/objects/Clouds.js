import { TextureLoader, SpriteMaterial, Sprite } from "../lib/three.module.js";
import Utilities from "../lib/Utilities.js";

export default class Clouds {
  constructor(scene) {
    this.scene = scene;
  }


  generateBillboardClouds() {
    const loader = new TextureLoader();
    for (let i = 0; i < 50; i++) {
      loader.load("resources/textures/cloud.png", (texture) => {
        let material = new SpriteMaterial({
          map: texture,
          color: 0xffffff,
          fog: false,
        });
        let skyPlane = new Sprite(material);
        skyPlane.castShadow = true;

        //Generate random positions and scale
        let posX = this.betweenRandomValues(-2000, 2000);
        var posY = this.betweenRandomValues(200, 500);
        let posZ = this.betweenRandomValues(-500, -1000);

        //Set positions and scale
        skyPlane.position.set(posX, posY, posZ);
        skyPlane.scale.multiplyScalar(Utilities.betweenRandomValues(100, 500));

        //Add to scene
        this.scene.add(skyPlane);
      });
    }
  }

  betweenRandomValues = (min, max) => Math.random() * (max - min) + min;

}
