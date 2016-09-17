// <reference path="../../typings/index.d.ts" />
// <reference path="../typings/index.d.ts" />
import {Injectable} from '@angular/core';
import {Injector} from '@angular/core';
import {Provider} from '@angular/core';
// import {provide} from '@angular/core';

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
  //private webVrManager: WebVRManager;
  webVrManager;
  sphere: Mesh;
  cube: Mesh;
  BaseRotation = new THREE.Quaternion();
  dummy = new Vector3();
  //constructor(ctx: VRRuntime) {}
  //constructor() {}
  constructor(width, height, vrRenderer) {
    //VRScene.init(window.innerWidth, window.innerHeight, vrRenderer)
    // console.log('VRScene.ctor: entered, width=' + width + ', height=' + height + 'vrRenderer=' + vrRenderer)
    // shouldn't have to do this, but..
    vrRenderer.init()
    //var width = window.innerWidth
    //var height = window.innerHeight

    this.scene = new THREE.Scene;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
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
    // console.log('VRScene.init: this.webVrManager=' + this.webVrManager);
    this.camera.quaternion.copy(this.BaseRotation);

    //var geometry = new THREE.BoxGeometry(25, 25, 25);
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var meshParms = new Object();

    //meshParms['color'] = 0xffff00;
    meshParms['color'] = 0xff8000;

    //var material = new THREE.MeshNormalMaterial(meshParms);
    var material = new THREE.MeshBasicMaterial(meshParms);
    //material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // this.cube = new THREE.Mesh(geometry, material);
    // this.cube.translateY(25)
    // this.scene.add(this.cube);

    // draw!
    //vrRenderer.renderer.render(this.scene, this.camera);
    //window.requestAnimationFrame(this.mainLoop);
    //window.requestAnimationFrame(vtClass.prototype.mainLoop);
    vrRenderer.canvas.focus();
    //CubeOnPlaneScene.prototype.mainLoop.bind(this)
    // bind the 'this' of the canvasKeyHandler to the definition-time 'this'
    //VRScene.prototype.canvasKeyHandler.bind(this)
    this.dummy.x = 8.0
    // console.log('VRScene.init: made it to the end');
  }

  canvasKeyHandler (event) {
    // console.log('vrscene.canvasKeyHandler: event.keyCode=' + event.keyCode);
    //console.log('vrscene.canvasKeyHandler: this.dolly' + this.dolly);
    //console.log('vrscene.canvasKeyHandler: self.dolly' + this.dolly);

    CameraKeypressEvents.keyHandler(event, this.dolly)
    //CameraKeypressEvents.keyHandler(event, VRScene.prototype.canvasKeyHandler)
    //CameraKeypressEvents.keyHandler(event, dolly)
  }

  // canvasKeyHandler2 (event) {
  //   console.log('VRScene.canvasKeyHandler2: event.keyCode=' + event.keyCode);
  //
  //    this.vrRuntime.vrScene.canvasKeyHandler(event)
  // }

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
  // console.log('VRSceneFactory: width=' + width + ', vrRenderer=' + vrRenderer)
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

