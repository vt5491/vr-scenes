import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {VRScene} from '../../vrscene';
import {VRSceneProvider} from '../../vrscene';
import {VRRenderer} from '../../vrrenderer'
import {Base} from '../../base'
import {CameraKeypressEvents} from '../../camera-keypress-events'
import Mesh = THREE.Mesh;
import {MultiPlane} from '../../multi-plane'
import {VRRuntime} from '../../vrruntime'

@Component({
  selector: 'app-cylinder-projection',
  templateUrl: './cylinder-projection.component.html',
  styleUrls: ['./cylinder-projection.component.css']
})

@Injectable()
export class CylinderProjectionComponent implements OnInit {
  webGLRender : THREE.WebGLRenderer
  bufferTexture : THREE.WebGLRenderTarget
  boxObject : THREE.Mesh
  mainBoxObject : THREE.Mesh
  bufferScene : THREE.Scene

  constructor(public vrScene: VRScene, public vrRenderer: VRRenderer) {
  }

  ngOnInit() {
  }

  init() {
    //  this.vrScene.scene.add( plane ); 
    // we need to get a standard webGLRender for the projection object 
    // because the webVRManager (webvr-boilerplate) renderer does not
    // support a 'renderTarget' option
    this.webGLRender = new THREE.WebGLRenderer()
    this.webGLRender.setSize( window.innerWidth, window.innerHeight );
    // Create a different scene to hold our buffer objects
    this.bufferScene = new THREE.Scene();
    // Create the texture that will store our result
    this.bufferTexture = new THREE.WebGLRenderTarget(
      window.innerWidth, 
      window.innerHeight, 
      { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

    // Let's create a red box
    var redMaterial = new THREE.MeshBasicMaterial({ color: 0xF06565 });
    var boxGeometry = new THREE.BoxGeometry(50, 5, 5);
    this.boxObject = new THREE.Mesh(boxGeometry, redMaterial);
    this.boxObject.position.z = -10;
    // We add it to the bufferScene instead of the normal scene.
    this.bufferScene.add(this.boxObject);
    // temp add to the scene too for debugging
    // this.vrScene.scene.add(this.boxObject)

    ///And a blue plane behind it
    // var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7074FF })
    var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x70FF74 })
    blueMaterial.side = THREE.DoubleSide;
    var plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    var planeObject = new THREE.Mesh(plane, blueMaterial);
    planeObject.position.z = -15;
    //We add it to the bufferScene instead of the normal scene!
    this.bufferScene.add(planeObject);
    // temp add to the scene too for debugging
    // this.vrScene.scene.add(planeObject)

    // this is what we are projecting on
    // var boxMaterial = new THREE.MeshBasicMaterial(<any>{ map: this.bufferTexture });
    var boxMaterial = new THREE.MeshBasicMaterial();
    boxMaterial.map = this.bufferTexture.texture
    var meshParms = new Object()
    meshParms['color'] = 0x8080ff;

    // var material = new THREE.MeshBasicMaterial(meshParms);
    // var boxGeometry2 = new THREE.BoxGeometry(5, 5, 5);
    var boxGeometry2 = new THREE.BoxGeometry(9, 9, 9);
    this.mainBoxObject = new THREE.Mesh(boxGeometry2, boxMaterial);
    // this.mainBoxObject = new THREE.Mesh(boxGeometry2, material);
    this.mainBoxObject.position.z = -10;
    this.mainBoxObject.position.x = -1;
    this.vrScene.scene.add(this.mainBoxObject);
  }
  // from https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686
  //// This is the basic scene setup ////
 
// var scene = new THREE.Scene();
// var width, height = window.innerWidth, window.innerHeight;
// var camera = new THREE.PerspectiveCamera( 70, width/height, 1, 1000 );
// var renderer = new THREE.WebGLRenderer(); 
// renderer.setSize( width,height);
// document.body.appendChild( renderer.domElement );
 
// //// This is where we create our off-screen render target ////
 
// // Create a different scene to hold our buffer objects
// var bufferScene = new THREE.Scene();
// // Create the texture that will store our result
// var bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
 
// ////
// // Add anything you want to render/capture in bufferScene here //
// ////
mainLoop () {
  window.requestAnimationFrame(CylinderProjectionComponent.prototype.mainLoop.bind(this)); 

  //Make the box rotate on box axises
  this.boxObject.rotation.y += 0.01;
  this.boxObject.rotation.x += 0.01;
  //Rotate the main box too
  this.mainBoxObject.rotation.y += 0.02;
  this.mainBoxObject.rotation.x += 0.01;

  //Render onto our off screen texture
  // renderer.render(bufferScene, camera, bufferTexture);
  // this.vrScene.webVrManager.render(
  this.webGLRender.render(
    this.bufferScene, 
    this.vrScene.camera, 
    this.bufferTexture)
    // this.bufferTexture.texture)

  //Finally, draw to the screen
  // renderer.render(scene, camera);
  this.vrScene.webVrManager.render(this.vrScene.scene, this.vrScene.camera)
  // this.webGLRender.render(this.vrScene.scene, this.vrScene.camera)

}
 
// function render() {
//     requestAnimationFrame( render );
//     // Render onto our off-screen texture
//     renderer.render(bufferScene, camera, bufferTexture);
//     // Finally, draw to the screen
//     renderer.render( scene, camera );
// }
 
// render(); // Render everything!

}
