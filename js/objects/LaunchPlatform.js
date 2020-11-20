"use strict";

import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
} from "../lib/three.module.js";

/**
 * Class that generates a launch platform for our rocket
 */

const textureLoader = new TextureLoader();



export default class LaunchPlatform extends Mesh {

  constructor(scene, terrainGeometry, texture, posX, posZ) {
    const geometry = new BoxBufferGeometry(30, 3, 30);
    const vertexShader = `
      uniform vec2 uvScale;
      varying vec2 vUv;

      void main()
      {

        vUv = uvScale * uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;

      }
    `
    const fragmentShader = `
      uniform float time;
            
      uniform float fogDensity;
      uniform vec3 fogColor;

      uniform sampler2D texture1;
      uniform sampler2D texture2;

      varying vec2 vUv;

      void main(void) {
        vec2 position = - 1.0 + 2.0 * vUv;

        vec4 noise = texture2D( texture1, vUv );
        vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
        vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;

        T1.x += noise.x * 2.0;
        T1.y += noise.y * 2.0;
        T2.x -= noise.y * 0.2;
        T2.y += noise.z * 0.2;

        float p = texture2D( texture1, T1 * 2.0 ).a;

        vec4 color = texture2D( texture2, T2 * 2.0 );
        vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

        if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
        if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
        if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

        gl_FragColor = temp;

        float depth = gl_FragCoord.z / gl_FragCoord.w;
        const float LOG2 = 1.442695;
        float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
        fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
      }
    `
    const uniforms = {
      time: { value: 1.0 },
      uvScale: { value: new Vector2(3.0, 1.0) },
      texture1: {
        value: textureLoader.load("resources/textures/lavacloud.png"),
      },
      texture2: {
        value: textureLoader.load("resources/textures/lavatile.jpg"),
      },
    };

    uniforms["texture1"].value.wrapS = uniforms[
      "texture1"
    ].value.wrapT = RepeatWrapping;
    uniforms["texture2"].value.wrapS = uniforms[
      "texture2"
    ].value.wrapT = RepeatWrapping;

    const material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    super(geometry, material);
    this.scene = scene;
    this.position.x = posX;
    this.position.y = terrainGeometry.getHeightAt(posX, posZ) + 10;
    this.position.z = posZ;
    this.platformLegs = [];
    this.castShadow = true;
    this.receiveShadow = true;

  }

  animate = (delta) => {
    this.material.uniforms[ 'time' ].value += 0.001 * delta;
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
    platformLeg.position.y = posY - 8;
    platformLeg.position.z = posZ;

    platformLeg.castShadow = true;
    platformLeg.receiveShadow = true;
    this.scene.add(platformLeg);

    const platformLeg2 = new Mesh(geometry, this.material);

    platformLeg2.position.x =
      this.position.x + this.geometry.parameters.width / 2;
    platformLeg2.position.y =
      this.position.y + this.geometry.parameters.height / 2 - 8;
    platformLeg2.position.z =
      this.position.z - this.geometry.parameters.depth / 2;

    platformLeg2.castShadow = true;
    platformLeg2.receiveShadow = true;
    this.scene.add(platformLeg2);

    const platformLeg3 = new Mesh(geometry, this.material);

    platformLeg3.position.x =
      this.position.x - this.geometry.parameters.width / 2;
    platformLeg3.position.y =
      this.position.y + this.geometry.parameters.height / 2 - 8;
    platformLeg3.position.z =
      this.position.z + this.geometry.parameters.depth / 2;

    platformLeg3.castShadow = true;
    platformLeg3.receiveShadow = true;
    this.scene.add(platformLeg3);

    const platformLeg4 = new Mesh(geometry, this.material);

    platformLeg4.position.x =
      this.position.x - this.geometry.parameters.width / 2;
    platformLeg4.position.y =
      this.position.y + this.geometry.parameters.height / 2 - 8;
    platformLeg4.position.z =
      this.position.z - this.geometry.parameters.depth / 2;

    platformLeg4.castShadow = true;
    platformLeg4.receiveShadow = true;
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
