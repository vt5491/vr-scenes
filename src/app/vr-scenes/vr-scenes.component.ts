// <reference path="../../../typings/index.d.ts" />
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {CameraKeypressEvents} from '../camera-keypress-events'
import {VRRenderer} from '../vrrenderer'
import {VRScene} from '../vrscene'
import {VRSceneProvider} from '../vrscene'
import {Injector} from '@angular/core';
import {CubeOnPlaneScene} from '../scenes/cube-on-plane-scene/cube-on-plane-scene';
import {CylinderProjectionComponent} from '../scenes/cylinder-projection/cylinder-projection.component';
import {CylProjComponent} from '../scenes/cyl-proj/cyl-proj.component';
import {TorusProj} from '../scenes/torus-proj/torus-proj';
// import {SandboxComponent} from '../scenes/sandbox/sandbox.component';
import {Utils} from '../utils'
import {VRRuntime} from '../vrruntime'
import {Http} from '@angular/http';

@Component({
  selector: 'app-vr-scenes',
    providers: [
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

    console.log('vr-scenes: now in ctor')
    console.log(`lodash.version=${_.VERSION}`)
    console.log(`head = ${_.head([1,2,3])}`)

    var width = window.innerWidth;
    var height = window.innerHeight;

    this.model = {
      scene:  "cylinder-projection"
    };
  }

  onSandboxClick(input, $event) {
    console.log('vr-scenes.onSandboxClick: entered')

    this.vrScene = this.injector.get(VRScene)
    // this.vrRuntime = new SandboxComponent(this.vrScene, this.vrRenderer)
    // var sandbox =  new SandboxComponent(this.vrScene, this.vrRenderer)
    // this.vrRuntime = sandbox
    // var sandbox = new SandboxComponent(this.injector)
    this.vrRuntime.init()
  }

  onCanvasInitClick(input, $event) {
    console.log('vr-scenes: now in onCanvasInitClick ')
    console.log('vr-scenes: model.scene=' + this.model.scene)
    //give keyboard focus back to the canvasKeyHandler
    document.getElementById('scene-view').focus();

    this.vrScene = this.injector.get(VRScene)

    switch (this.model.scene)
    {
      case 'cube-on-plane-scene' :
        this.vrRuntime = new CubeOnPlaneScene(this.vrScene, this.vrRenderer)
      break;
      case 'cylinder-projection' :
        this.vrRuntime = new CylinderProjectionComponent(this.vrScene, this.vrRenderer)
      break;
      // case 'sandbox' :
      //   this.vrRuntime = new SandboxComponent(this.vrScene, this.vrRenderer)
      // break;
      case 'cyl-proj' :
        this.vrRuntime = new CylProjComponent(this.vrScene, this.vrRenderer)
      break;
      case 'torus-proj' :
        this.vrRuntime = new TorusProj(this.vrScene, this.vrRenderer)
      break;
      default :
        console.log('invalid switch selection');
    }

    this.vrRuntime.init()
    this.vrRuntime.mainLoop()
  }

  canvasKeyHandler (event) {
    CameraKeypressEvents.keyHandler(
      event, 
      this.vrRuntime.vrScene.dolly, 
      this.flipMovement,
      this.vrRuntime 
      )
  }


  onVRRuntimeInitClick(input, $event) {
      console.log('vr-scenes: now in onVRRuntimeInitClick')
      this.hideSpan1 = true
  }

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }

  onResize(event) {
    console.log('vr-scenes.onResize: event=' + event)
    var camera = this.vrRuntime.vrScene.camera;
    var renderer = this.vrRuntime.vrRenderer.renderer

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }


}
