/// <reference path="../../../typings/index.d.ts" />
import { Component, OnInit } from '@angular/core';
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
  templateUrl: './vr-scenes.component.html',
  styleUrls: ['./vr-scenes.component.css']
})
export class VrScenesComponent implements OnInit {

  // constructor() { }

  ngOnInit() {
  }

  // onCanvasInitClick(input, $event) {
  //   console.log('vr-scenes: now in onCanvasInitClick ')
  //   console.log(`first=${_.first([1, 2, 3])}`)
  //   document.getElementById('scene-view').focus();
  // }
  // export class CppScenesApp {
  defaultMeaning: number = 42;
  // cubeScene : CubeScene
  //vrRenderer: VRRenderer
  //vrScene: VRScene
  // vrRuntime: VRRuntime
  hideSpan1: boolean = false
  // vtDummy: VtDummy
  //vrRenderer: VRRenderer
  // vrScene: VRScene
  //vRSceneProvider: VRSceneProvider;
  vrScene: VRScene
  cubeOnPlaneScene: CubeOnPlaneScene
  vrRuntime: VRRuntime

  model
  flipMovement: boolean
  //constructor(vrRenderer: VRRenderer, vrScene: VRScene) {
  // constructor(vrRuntime: VRRuntime, vtDummy: VtDummy,
  constructor(
    // vtDummy: VtDummy,
    private injector: Injector, public vrRenderer: VRRenderer,
              private utils: Utils, private http: Http ) {

    console.log('cpp-scenes: now in ctor')
    // this.cubeScene = new CubeScene()

    //this.vrRenderer = vrRenderer;
    //this.vrScene = vrScene;
    //this.vrRuntime = vrRuntime;
    // this.vrRuntime = vrRuntime;
    // get a custom VRScene.  We can't rely on DI because we don't know
    // certain things until run time (after injection time)
    var width = window.innerWidth;
    var height = window.innerHeight;
    // this.vrScene.init(width, height, vrRenderer)
    // this.vrRuntime = new VRRuntime(this.vrRenderer,
    //   this.vrScene, cubeOnPlaneScene, sphereScene, vtDummy)

    // this.vtDummy = vtDummy

    this.model = {
      // scene:  "cube-on-plane-scene"
      //scene:  "mirror-scene"
      //ne:  "torus"
      scene:  "cylinder-projection"
    };
  }

  // This works, but I'm converting to cube-on-plane-scene
  // onCanvasInitClick(input, $event) {
  //   console.log('cpp-scenes: now in onCanvasInitClick')
  //   //this.cubeScene = new CubeScene()
  //   // Note: we have to init vrScene here, not in ctor because the html DOM
  //   // structure isn't set up properly until we are here.
  //   this.vrScene = this.injector.get(VRScene)
  //
  //   this.cubeScene.initWebGl()
  //   this.cubeScene.initScene()
  //   this.cubeScene.mainLoop();
  // }

  onCanvasInitClick(input, $event) {
    console.log('cpp-scenes: now in onCanvasInitClick ')
    console.log('cpp-scenes: model.scene=' + this.model.scene)
    // Note: we have to init vrScene here, not in ctor because the html DOM
    // structure isn't set up properly until we are here.
    //give keyboard focus back to the canvasKeyHandler
    document.getElementById('scene-view').focus();

    this.vrScene = this.injector.get(VRScene)

    switch (this.model.scene)
    {
      case 'cube-on-plane-scene' :
        // this.cubeOnPlaneScene = new CubeOnPlaneScene(this.vrScene, this.vrRenderer, this.vtDummy)
        //
        // this.cubeOnPlaneScene.init(10,10)
        // this.cubeOnPlaneScene.mainLoop()
        this.vrRuntime = new CubeOnPlaneScene(this.vrScene, this.vrRenderer)

        // this.vrRuntime.init()
        // this.vrRuntime.mainLoop()
        // this.flipMovement = false
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
    // console.log('cpp-scenes.canvasKeyHandler: event.keyCode=' + event.keyCode);

     //this.cubeScene.canvasKeyHandler(event)
    //  this.cubeOnPlaneScene.canvasKeyHandler(event)
    CameraKeypressEvents.keyHandler(event, this.vrRuntime.vrScene.dolly, this.flipMovement)
  }


  onVRRuntimeInitClick(input, $event) {
      console.log('cpp-scenes: now in onVRRuntimeInitClick')
      this.hideSpan1 = true
      // this.vrRuntime.init()
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
