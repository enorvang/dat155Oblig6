import { GLTFLoader } from "../loaders/GLTFLoader.js";

/**
 * Class to create a boat model
 */
export default class Boat {
  constructor(parent) {
    this.parent = parent;
    this.model = null;
  }

  /**
   * Loads the model and adds it as a child to its parent.
   */
  loadModel = (modelUrl) => {
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (object) => {
        const model = object.scene;
        
        model.position.x = 300;
        model.scale.multiplyScalar(0.35);
        model.castShadow = true;
        model.receiveShadow = true;
        model.rotation.y = 1.5;
        model.fog = false;
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

  animate = () => {
    if(this.model){
      this.parent.rotation.y += 0.001;

    }
  }

}
