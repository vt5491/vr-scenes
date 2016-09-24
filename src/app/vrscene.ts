// <reference path="../../typings/index.d.ts" />
// <reference path="../typings/index.d.ts" />
import {Injectable} from '@angular/core';
import {Injector} from '@angular/core';
import {Provider} from '@angular/core';
import Object3D = THREE.Object3D;
import Vector3 = THREE.Vector3;
import Scene = THREE.Scene;
import PerspectiveCamera = THREE.PerspectiveCamera;
import Mesh = THREE.Mesh;
import VRControls = THREE.VRControls;
import VREffect = THREE.VREffect;

import {VRRenderer} from './vrrenderer'
import {CameraKeypressEvents} from './camera-keypress-events'

@Injectable()

@Injectable()
export class VRScene {
  private _scene: Scene;
  camera: PerspectiveCamera;
  dolly: Object3D;
  vrControls: VRControls;
  vrEffect: VREffect;
  webVrManager;
  sphere: Mesh;
  cube: Mesh;
  BaseRotation = new THREE.Quaternion();

  constructor(width, height, vrRenderer) {
    // shouldn't have to do this, but..
    vrRenderer.init()
    console.log(`VrScene.ctor: vrRenderer.guid=${vrRenderer.guid}`)

    this.scene = new THREE.Scene;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.camera.name = 'vrscene_camera'
    this.camera.position.set(0, 1.5, 100);
    this.dolly = new THREE.Object3D();
    this.dolly.position.z = 50;
    this.scene.add(this.dolly);
    //
    this.dolly.add(this.camera);

    this.vrControls = new THREE.VRControls(this.camera);

    this.vrEffect = new THREE.VREffect(vrRenderer.renderer);
    this.vrEffect.setSize(width, height);
    this.webVrManager = new (<any>window).WebVRManager(vrRenderer.renderer, this.vrEffect);
    this.camera.quaternion.copy(this.BaseRotation);

    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var meshParms = new Object();

    meshParms['color'] = 0xff8000;

    var material = new THREE.MeshBasicMaterial(meshParms);

    vrRenderer.canvas.focus();
  }

  canvasKeyHandler (event) {
    CameraKeypressEvents.keyHandler(event, this.dolly)
  }

  doIt() : string {
    return 'hello from VRScene'
  }

  // getters  and setters
  get scene():Scene {
     return this._scene;
  }

  set scene(scene: Scene) {
    if (scene === undefined) throw 'Please supply a scene';
    this._scene = scene;
  }
}

let VRSceneFactory = (vrRenderer: VRRenderer) => {
  var width = window.innerWidth
  var height = window.innerHeight

  vrRenderer.init(width, height)
  return new VRScene(window.innerWidth, window.innerHeight, vrRenderer);
}

// export let VRSceneProvider =
//   provide(VRScene, {
//     useFactory: VRSceneFactory,
//     deps: [VRRenderer]
//   });
  //{ provide: LocationStrategy, useClass: HashLocationStrategy }
export let VRSceneProvider = {
  provide: VRScene,
  useFactory: VRSceneFactory,
  deps: [VRRenderer]
}
