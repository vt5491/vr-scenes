// <reference path="../../../typings/index.d.ts" />
import { Component, OnInit } from '@angular/core';
// import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import * as _ from 'lodash';
import {CameraKeypressEvents} from '../camera-keypress-events'
import {VRRenderer} from '../vrrenderer'
import {VRScene} from '../vrscene'
import {VRSceneProvider} from '../vrscene'
import {Injector} from '@angular/core';
import {CubeOnPlaneScene} from '../scenes/cube-on-plane-scene/cube-on-plane-scene';
import {Utils} from '../utils'
import {VRRuntime} from '../vrruntime'
// import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
// import {Http, HTTP_PROVIDERS} from '@angular/http';
import {Http} from '@angular/http';

@Component({
  selector: 'app-vr-scenes',
    providers: [
      // ROUTER_PROVIDERS,
        //      Http,
    // VRRuntime,
    VRRenderer,
    VRSceneProvider,
    Utils
    ],
  templateUrl: './vr-scenes.component.html',
  styleUrls: ['./vr-scenes.component.css']
})
export class VrScenesComponent implements OnInit {

  ngOnInit() {
  }

  defaultMeaning: number = 42;
  hideSpan1: boolean = false
  vrScene: VRScene
  cubeOnPlaneScene: CubeOnPlaneScene
  vrRuntime: VRRuntime

  model
  flipMovement: boolean

  constructor(
    private injector: Injector, public vrRenderer: VRRenderer,
              private utils: Utils, private http: Http ) {

    console.log('cpp-scenes: now in ctor')
    console.log(`lodash.version=${_.VERSION}`)
    console.log(`head = ${_.head([1,2,3])}`)

    var width = window.innerWidth;
    var height = window.innerHeight;

    this.model = {
      scene:  "cylinder-projection"
    };
  }

  onCanvasInitClick(input, $event) {
    console.log('cpp-scenes: now in onCanvasInitClick ')
    console.log('cpp-scenes: model.scene=' + this.model.scene)
    //give keyboard focus back to the canvasKeyHandler
    document.getElementById('scene-view').focus();

    this.vrScene = this.injector.get(VRScene)

    switch (this.model.scene)
    {
      case 'cube-on-plane-scene' :
        this.vrRuntime = new CubeOnPlaneScene(this.vrScene, this.vrRenderer)

      break;
      // case 'mirror-scene' :
      //   console.log('now kicking off mirror-scene')
      //   // var mirrorScene = new MirrorScene(this.vrScene, this.vrRenderer)
      //   //
      //   // // mirrorScene.init(10,10)
      //   // mirrorScene.init()
      //   // mirrorScene.mainLoop()
      //   this.vrRuntime = new MirrorScene(this.vrScene, this.vrRenderer)

      //   // this.vrRuntime.init()
      //   // this.vrRuntime.mainLoop()
      //   // this.flipMovement = false
      // break;
      // case 'torus' :
      //   console.log('now kicking off torus')
      //   this.vrRuntime = new Torus(this.vrScene, this.vrRenderer, this.http)
      //   //this.vrRuntime = new Torus()

      //   // this.vrRuntime.init()
      //   // this.vrRuntime.mainLoop()
      //   // this.flipMovement = false
      // break;
      // case 'cylinder-projection' :
      //   this.vrRuntime = new CylinderProjection(this.vrScene, this.vrRenderer)
      // break;
      default :
        console.log('invalid switch selection');
    }

    this.vrRuntime.init()
    this.vrRuntime.mainLoop()
  }

  canvasKeyHandler (event) {
    CameraKeypressEvents.keyHandler(event, this.vrRuntime.vrScene.dolly, this.flipMovement)
  }


  onVRRuntimeInitClick(input, $event) {
      console.log('cpp-scenes: now in onVRRuntimeInitClick')
      this.hideSpan1 = true
  }

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }

  onResize(event) {
    console.log('cpp-scenes.onResize: event=' + event)
    var camera = this.vrRuntime.vrScene.camera;
    var renderer = this.vrRuntime.vrRenderer.renderer

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }


}
