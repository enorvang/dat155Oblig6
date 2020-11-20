import { SpriteMaterial, Sprite } from "../lib/three.module.js";

/**
 * Class for a cloud. 
 */
export default class Cloud extends Sprite {
  /**
   * Constructor for initialization of a cloud class.
   * @param {*} texture texture of the cloud
   * @param {Array} positions array containing x, y, z coordinates
   * @param {Number} scalar scalar value
   */
  constructor(texture, positions, scalar) {
    const material = new SpriteMaterial({
      map: texture,
      color: 0xffffff,
      fog: false,
    });
    super(material);
    this.position.set(positions[0], positions[1], positions[2]);
    this.scale.multiplyScalar(scalar);
  }
}
