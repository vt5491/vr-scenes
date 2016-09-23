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
// import {WebVRManager} from 

@Component({
  selector: 'app-cylinder-projection',
  templateUrl: './cylinder-projection.component.html',
  styleUrls: ['./cylinder-projection.component.css']
})

@Injectable()
export class CylinderProjectionComponent implements OnInit {
  webGLRenderer : THREE.WebGLRenderer
  webGLRenderer_non_vr : THREE.WebGLRenderer
  bufferTexture : THREE.WebGLRenderTarget
  boxObject : THREE.Mesh
  mainBoxObject : THREE.Mesh
  bufferScene : THREE.Scene 
  bufferSceneCamera : THREE.PerspectiveCamera
  boxMaterial :  THREE.MeshBasicMaterial
  parmsHash : any = { updateTexture: true}

  constructor(public vrScene: VRScene, public vrRenderer: VRRenderer) {
  }

  ngOnInit() {
  }

  init() {
    //  this.vrScene.scene.add( plane ); 
    console.log('cylinder.init: entered')
    // try hooking webVRManager's 'enterVRMode_' function 
    // var saveFunc = this.vrScene.webVrManager.enterVRMode_
    var saveFunc = this.vrScene.webVrManager.enterVRMode_.bind(this.vrScene.webVrManager)
    // var newFunc = () => {
    //   console.log(`CylinderProjectionComponent: now hooking enterVRMode_`)
    //   // saveFunc().bind(this.vrScene.webVrManager)
    //   // saveFunc().bind(this)
    //   saveFunc()
    //   console.log(`CylinderProjectionComponent: just called original enterVRMode_`)
    // }
    // // newFunc.bind(this.vrScene.webVrManager)
    // newFunc.bind(this)
    var newFuncFactory = function () {
      // var updateTextureLocal = this.updateTexture
      var parmsHashLocal = this.parmsHash

      return () => {
        console.log(`CylinderProjectionComponent: now hooking enterVRMode_`)
        // updateTextureLocal = !updateTextureLocal
        parmsHashLocal.updateTexture = !parmsHashLocal.updateTexture
        saveFunc()
        console.log(`CylinderProjectionComponent: back from hooking enterVRMode_`)
      } 
    }.bind(this) 

    var newFunc = newFuncFactory()
    this.vrScene.webVrManager.enterVRMode_ = newFunc
    // this.vrScene.webVrManager.setVRCallback( () => {
    //   console.log(`CylinderProjectionComponent: now in vrCallback`)
    // })
    // console.log(`CylinderProjection.init: vrscene.webVRManager.vrCallback=
    // ${this.vrScene.webVrManager.vrCallback} 
    // `)
    // (<any>window).WebVRManager.setVRCallback(this)
    // var tmp = (<any>window).WebVRManager.prototype.setVRCallback( () => {
    // (<any>WebVRManager).prototype.setVRCallback( () => {
    //   console.log(`CylinderProjectionComponent: now in vrCallback`)
    // })

    // var dummyWebVRManager = new (<any>window).WebVRManager()
    // dummyWebVRManager.setVRCallback( () => {
    //   console.log(`CylinderProjectionComponent: now in vrCallback`)
    // })
    // document.addEventListener('webkitfullscreenchange',
    //   () => {
    //     console.log(`CylinderProjectionComponent: caught webkitfullscreenchange`)
    //   })
    // document.addEventListener('vrdisplaypresentchange',
    //   () => {
    //     console.log(`CylinderProjectionComponent: caught vrdisplaypresentchange`)
    //   })
    // we need to get a standard webGLRender for the projection object 
    // because the webVRManager (webvr-boilerplate) renderer does not
    // support a 'renderTarget' option
    //vt-x-key swap the next two
    // this gives no dynamic texture, but allows for split screen
    this.webGLRenderer = new THREE.WebGLRenderer()
    this.webGLRenderer_non_vr = new THREE.WebGLRenderer()
    document.body.appendChild( this.webGLRenderer_non_vr.domElement );
    this.webGLRenderer_non_vr.setRenderTarget(this.bufferTexture)
    var vrEffect_non_vr = new THREE.VREffect(this.webGLRenderer_non_vr)
    // this gives dynamic texture, but no split screen
    this.webGLRenderer = this.vrRenderer.renderer
    // works the same as the prior: dynamic texture, no split screen
    // this.webGLRender = this.vrScene.webVrManager.vrRenderer.renderer
    this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
    // Create a different scene to hold our buffer objects
    this.bufferScene = new THREE.Scene();

    this.bufferSceneCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    this.bufferSceneCamera.name="bufferScene_camera"
    this.bufferScene.add(this.bufferSceneCamera)
    var vrControls_non_vr = new THREE.VRControls(this.bufferSceneCamera);

    // the following works, but keybindings dont work with it
    // this.bufferScene.add(this.vrScene.camera)
    // Create the texture that will store our result
    this.bufferTexture = new THREE.WebGLRenderTarget(
      window.innerWidth, 
      window.innerHeight, 
      { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 6, 1 ).normalize();
    this.bufferScene.add(light);
    // Let's  create a red box
    // var redMaterial = new THREE.MeshBasicMaterial({ color: 0xF06565 });
    var redMaterial = new THREE.MeshBasicMaterial({ color: 0xF0f0f0 });
    var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    this.boxObject = new THREE.Mesh(boxGeometry, redMaterial);
    this.boxObject.position.z = -10;
    // We add it to the bufferScene instead of the normal scene.
    this.bufferScene.add(this.boxObject);
    // temp add to the scene too for debugging
    // this.vrScene.scene.add(this.boxObject)

    // var blueMaterial = new THREE.MeshBasicMaterial({ color: 0xf0f0FF })
    var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x70FF74 })
    // blueMaterial.side = THREE.DoubleSide;
    var plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    var planeObject = new THREE.Mesh(plane, blueMaterial);
    planeObject.position.z = -15;
    //We add it to the bufferScene instead of the normal scene!
    this.bufferScene.add(planeObject);
    // temp add to the scene too for debugging
    // this.vrScene.scene.add(planeObject)

    // this is what we are projecting on
    // var boxMaterial = new THREE.MeshBasicMaterial(<any>{ map: this.bufferTexture });
    this.boxMaterial = new THREE.MeshBasicMaterial();
    this.boxMaterial.map = this.bufferTexture.texture
    // this.boxMaterial.map.needsUpdate = true
    // when I tie boxMaterial to a fixed image, I don't get problems with
    // split-screen mode 
    // this.boxMaterial.map = THREE.ImageUtils.loadTexture("../../assets/images/clouds.jpg")
    // boxMaterial.map = THREE.ImageUtils.loadTexture("assets/images/clouds.jpg")
    // var meshParms = new Object()
    // meshParms['color'] = 0x8080ff;

    // var material = new THREE.MeshBasicMaterial(meshParms);
    // var boxGeometry2 = new THREE.BoxGeometry(5, 5, 5);
    var boxGeometry2 = new THREE.BoxGeometry(4, 4, 4);
    this.mainBoxObject = new THREE.Mesh(boxGeometry2, this.boxMaterial);
    // this.mainBoxObject = new THREE.Mesh(boxGeometry2, material);
    this.mainBoxObject.position.z = -10;
    // this.mainBoxObject.position.x = -1;
    this.vrScene.scene.add(this.mainBoxObject);
  }
  // from https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686

mainLoop () {
  window.requestAnimationFrame(CylinderProjectionComponent
    .prototype.mainLoop.bind(this)); 

  //Make the box rotate on box axises
  this.boxObject.rotation.y += 0.01;
  this.boxObject.rotation.x += 0.01;
  //Rotate the main box too
  this.mainBoxObject.rotation.y += 0.005;
  this.mainBoxObject.rotation.x += 0.005;

  console.log(`mainloop: this.updateTexture=${this.parmsHash.updateTexture}`)
  // this.vrScene.vrControls.update()
  //Render onto our off screen texture
  if (this.parmsHash.updateTexture) {
    // renderer.render(bufferScene, camera, bufferTexture);
    // this.vrScene.webVrManager.render(
    this.webGLRenderer.render(
      // this.webGLRenderer_non_vr.render(
      this.bufferScene,
      // this.vrScene.camera, 
      this.bufferSceneCamera,
      this.bufferTexture
      // ,true 
    )
  }

  // this.boxMaterial.map.needsUpdate = true

  // this.webGLRenderer_non_vr.render(
  //   this.bufferScene, 
  //   this.bufferSceneCamera
  // )
  // this.bufferTexture.texture.needsUpdate = true;
    // this.bufferTexture.texture)
  // this.vrScene.vrEffect.render(
  //   this.bufferScene, 
  //   this.vrScene.camera 
  //   this.bufferTexture
  //   )
    // (<any>this.vrScene.vrEffect).render()
    // var tmpVrEffect = this.vrScene.vrEffect as any
    // tmpVrEffect.render(this.bufferScene, this.vrScene.camera, this.bufferTexture)

  this.vrScene.vrControls.update()
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
