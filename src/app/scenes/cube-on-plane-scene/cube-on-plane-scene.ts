import {Component} from '@angular/core';
import {Injectable} from '@angular/core';
import {VRScene} from '../../vrscene';
import {VRSceneProvider} from '../../vrscene';
import {VRRenderer} from '../../vrrenderer'
import {Base} from '../../base'
import {CameraKeypressEvents} from '../../camera-keypress-events'
import Mesh = THREE.Mesh;
// import {VtDummy} from '../vt-dummy/vt-dummy'
import {MultiPlane} from '../../multi-plane'
import {VRRuntime} from '../../vrruntime'

@Component ({
  selector: 'cube-on-plane-scene',
  // templateUrl: 'app//cube-on-plane-scene/cube-on-plane-scene.html',
  //providers: [VRScene]
  providers: [VRSceneProvider]
})

@Injectable()
// export class CubeOnPlaneScene extends VRScene{
export class CubeOnPlaneScene implements VRRuntime{
  cube2: Mesh
  private cubeQuat = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0,1,0), Base.ONE_DEG * 0.2 );
  childDummy: THREE.Vector3 = new THREE.Vector3();
  // vtDummy: VtDummy;
  //vt add
  //multiPlane: MultiPlane
  //vt end

  //constructor(vtDummy: VtDummy) {
  // constructor(vrRenderer: VRRenderer, vtDummy: VtDummy) {
  constructor(public vrScene: VRScene, public vrRenderer: VRRenderer) {
    // super(window.innerWidth, window.innerHeight, vrRenderer)
    // console.log('CubeOnPlane.ctor: entered, vrRenderer=' + vrRenderer)
    // this.vtDummy = vtDummy
  }

  // init(width: number, height: number, vrRenderer: VRRenderer) {
  // init(width: number, height: number) {
  init () {
    console.log('CubeOnPlaneScene.init: entered')
    console.log('CubeOnPlaneScene.init: about to call super.init')
    //super.init(width, height, vrRenderer)
    var geometry = new THREE.PlaneGeometry( 65, 40, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotateX(Base.ONE_DEG * 90.0)
    //super.scene.add( plane );
    this.vrScene.scene.add( plane );

    var geometry2 = new THREE.BoxGeometry(35, 25, 25);
    //geometry2.position = (5, 0, 0)
    var meshParms2 = new Object();

    meshParms2['color'] = 0x8080ff;

    var material2 = new THREE.MeshBasicMaterial(meshParms2);
    this.cube2 = new THREE.Mesh(geometry2, material2);
    //this.cube2.position = new THREE.Vector3(5, 0, 0)
    this.vrScene.scene.add(this.cube2);

    //vt add
    console.log("CubeOnPlaneScene.init: about to get a MultiPlane")
    var multiPlane = new MultiPlane()
    console.log("CubeOnPlaneScene.init: this.multiPlane=" + multiPlane)
    // this.vrScene.scene.add(multiPlane.plane);
    for (var i=0; i < multiPlane.planeMeshes.length; i++) {
      this.vrScene.scene.add(multiPlane.planeMeshes[i])
    }
    //vt end
    // this.dummy.x = 17.0
    //TODO: I think I can remove this
    this.vrRenderer.renderer.render(this.vrScene.scene, this.vrScene.camera);
  }

  // canvasKeyHandler (event) {
  //   // console.log('cube-on-plane-scene.canvasKeyHandler: event.keyCode=' + event.keyCode);
  //   // console.log('vrscene.canvasKeyHandler: this.vrScene' + this.vrScene);
  //   //console.log('vrscene.canvasKeyHandler: self.dolly' + this.dolly);
  //   //console.log('cube-on-plane-scene.canvasKeyHandler: super' + super);
  //   // console.log('cube-on-plane-scene.canvasKeyHandler: this' + this);
  //   // console.log('cube-on-plane-scene.canvasKeyHandler: this.BaseRotation' + this.BaseRotation);
  //   // console.log('cube-on-plane-scene.canvasKeyHandler: this.dolly' + this.dolly);
  //   //
  //   CameraKeypressEvents.keyHandler(event, this.vrScene.dolly)
  //   //CameraKeypressEvents.keyHandler(event, VRScene.prototype.canvasKeyHandler)
  //   // switch( event.keyCode) {
  //   //   case 'W'.charCodeAt(0):
  //   //     this.vrScene.dolly.translateY(0.2)
  //   //   break;
  //   //   case 'S'.charCodeAt(0):
  //   //     this.vrScene.dolly.translateY(-0.2)
  //   //   break;
  //   // }
  // }

  mainLoop () {
    //window.requestAnimationFrame(this.scene.prototype.mainLoop.bind(this));
    window.requestAnimationFrame(CubeOnPlaneScene.prototype.mainLoop.bind(this));

    this.cube2.quaternion.multiply(this.cubeQuat);

    this.vrScene.vrControls.update();

    this.vrScene.webVrManager.render(this.vrScene.scene, this.vrScene.camera);
  }

}
