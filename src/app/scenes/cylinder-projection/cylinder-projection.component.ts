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
  webVrManager : any;
  getImageData : Boolean = true
  texLoader : THREE.TextureLoader = new THREE.TextureLoader();


  constructor(public vrScene: VRScene, public vrRenderer: VRRenderer) {
  }

  ngOnInit() {
  }

  init() {
    //  this.vrScene.scene.add( plane ); 
    console.log('cylinder.init: entered')

    // override WebVrManagers render method to accept a target and to call
    // VREffect with a target
    // var newRenderMethodFactory = () => {
    //   return (scene, camera, target) => {
    //     (<any>this).effect.render(scene, camera, target);
    //   }
    // }

    // var newRenderMethod = newRenderMethodFactory()
    // newRenderMethod.bind(this.vrScene.webVrManager)

    // this.vrScene.webVrManager.render = newRenderMethod

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
    // this gives dynamic texture, but no split screen
    this.webGLRenderer = this.vrRenderer.renderer
    // this gives no dynamic texture, but allows for split screen
    // this.webGLRenderer = new THREE.WebGLRenderer() // black object
    this.webGLRenderer.setRenderTarget(this.bufferTexture)
    document.body.appendChild(document.createTextNode("WebGlRenderer"))
    document.body.appendChild( this.webGLRenderer.domElement );
    // adding this stuff still does not make a vanilla WebGlRenderer behave 
    // like this.vrRenderer
    // so it must mean that its the way vrRender is used by main scene?
    // var glParms = new Object();

    // glParms['antialias'] = true;
    // glParms['canvas'] = document.getElementById('scene-view');

    this.webGLRenderer_non_vr = new THREE.WebGLRenderer({preserveDrawingBuffer : true})
    document.body.appendChild(document.createTextNode("WebGlRenderer_non_vr"))
    document.body.appendChild( this.webGLRenderer_non_vr.domElement );
    this.webGLRenderer_non_vr.setRenderTarget(this.bufferTexture)
    var vrEffect_non_vr = new THREE.VREffect(this.webGLRenderer_non_vr)
    console.log(`CylinderProjection.init: vrRenderer.guid=${this.vrRenderer.guid}`)
    // works the same as the prior: dynamic texture, no split screen
    // this.webGLRenderer = this.vrScene.webVrManager.vrRenderer.renderer
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
    // this.boxMaterial.color = new THREE.Color(250,50,100) 
    // this.boxMaterial.map.needsUpdate = true
    // when I tie boxMaterial to a fixed image, I don't get problems with
    // split-screen mode 
    // this.boxMaterial.map = THREE.ImageUtils.loadTexture("../../assets/images/clouds.jpg")
    // this.boxMaterial.map = this.texLoader.load("../../assets/images/clouds.jpg")
    // boxMaterial.map = THREE.ImageUtils.loadTexture("assets/images/clouds.jpg")
    // var meshParms = new Object()
    // meshParms['color'] = 0x8080ff;

    // var material = new THREE.MeshBasicMaterial(meshParms);
    var boxGeometry2 = new THREE.BoxGeometry(5, 5, 5);
    // var boxGeometry2 = new THREE.BoxGeometry(4, 4, 4);
    this.mainBoxObject = new THREE.Mesh(boxGeometry2, this.boxMaterial);
    // this.mainBoxObject = new THREE.Mesh(boxGeometry2, material);
    this.mainBoxObject.position.z = -10;
    // this.mainBoxObject.position.x = -1;
    this.vrScene.scene.add(this.mainBoxObject);

    document.body.appendChild(document.createTextNode("screenshot"))
    var img = document.createElement('img')
    img.setAttribute("id", "screenshot")
    document.body.appendChild(img)
  }
  // from https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686

mainLoop () {
  // window.requestAnimationFrame(CylinderProjectionComponent
  //   .prototype.mainLoop.bind(this)); 

  //Make the box rotate on box axises
  this.boxObject.rotation.y += 0.01;
  this.boxObject.rotation.x += 0.01;
  //Rotate the main box too
  this.mainBoxObject.rotation.y += 0.004;
  this.mainBoxObject.rotation.x += 0.004;

  // console.log(`mainloop: this.updateTexture=${this.parmsHash.updateTexture}`)
  // this.vrScene.vrControls.update()
  //Render onto our off screen texture
  if (this.parmsHash.updateTexture) {
    // renderer.render(bufferScene, camera, bufferTexture);
    // this.vrScene.webVrManager.render(
    this.webGLRenderer.render(//the best
    // this.webGLRenderer_non_vr.render(// black, but does split
      // this.webGLRenderer_non_vr.render(
    // this.vrScene.webVrManager.render( //works, but does require zap to WebVRManager.render
      this.bufferScene,
      this.vrScene.camera, 
      // this.bufferSceneCamera,
      this.bufferTexture
      // ,true 
    )
    // and to its own canvas as well
    this.webGLRenderer.render(//the best
    // this.webGLRenderer_non_vr.render(// black, but does split
      // this.webGLRenderer_non_vr.render(
    // this.vrScene.webVrManager.render( //works, but does require zap to WebVRManager.render
      this.bufferScene,
      this.vrScene.camera 
      // this.bufferSceneCamera,
      // this.bufferTexture
      // ,true 
    )
    // override with a fixed texture  
    this.boxMaterial.map = this.texLoader.load(
      "../../assets/images/clouds.jpg", (texture) => {
        this.boxMaterial.map = texture
        this.vrScene.vrControls.update()
        this.vrScene.webVrManager.render(this.vrScene.scene, this.vrScene.camera)
        window.requestAnimationFrame(CylinderProjectionComponent
          .prototype.mainLoop.bind(this)); 
      })
    this.boxMaterial.map.needsUpdate = true
  }
  else {
    // this.vrScene.webVrManager.render(
    // (<any>this.vrScene.vrEffect).render(
    this.webGLRenderer_non_vr.render(
    // this.vrRenderer.renderer.render( // no cube is shown at all
      this.bufferScene,
      this.bufferSceneCamera,
      this.bufferTexture
    )    
    // and to our secondary buffer as well
    this.webGLRenderer_non_vr.render(
    // this.vrRenderer.renderer.render( // no cube is shown at all
      this.bufferScene,
      this.bufferSceneCamera
      // ,this.bufferTexture
    )    
    if (this.getImageData == true) {
      console.log('now processing screen shot data')
/*
      var imgData = this.webGLRenderer_non_vr.domElement.toDataURL("image/jpeg", 1.0);/*
      // this.getImageData = false;
      // var img = document.createElement("img");
      var img : HTMLImageElement = document.getElementById('screenshot') as HTMLImageElement
      img.src = imgData
      // document.body.appendChild(document.createTextNode("screenshot"))
      // document.body.appendChild(img)
      console.log('done processing screen shot data')
      // apply the image to this.boxMaterial
      // this.boxMaterial.map = img 
      // var map = THREE.ImageUtils.loadTexture( img );

      // var texture = new THREE.Texture( this.webGLRenderer_non_vr.domElement );
      var texture = new THREE.Texture( img );
      */
      // this.boxMaterial.map = texture
      // this.boxMaterial.map = THREE.ImageUtils.loadTexture("assets/images/clouds.jpg")
      // this.boxMaterial.map = this.texLoader.load("../../assets/images/clouds.jpg")
      this.boxMaterial.map = this.texLoader.load(
        "../../assets/images/clouds.jpg", (texture) => {
          this.boxMaterial.map = texture
          this.vrScene.vrControls.update()
          this.vrScene.webVrManager.render(this.vrScene.scene, this.vrScene.camera)
          window.requestAnimationFrame(CylinderProjectionComponent
            .prototype.mainLoop.bind(this)); 
        })
    }
  //  var dataURL = this.webGLRenderer_non_vr.domElement.toDataURL(); 
  //  console.log(`dataURL=${dataURL}`)
  }

  // this.boxMaterial.map.needsUpdate = true

  /*
  this.vrScene.vrControls.update()
  //Finally, draw to the screen
  // renderer.render(scene, camera);
  this.vrScene.webVrManager.render(this.vrScene.scene, this.vrScene.camera)
  */
  // this.webGLRenderer.render(this.vrScene.scene, this.vrScene.camera)
  // this.webGLRenderer_non_vr.render(this.vrScene.scene, this.vrScene.camera)
  // setTimeout(function () {
  //   console.log('now in timeout function')
  //   window.requestAnimationFrame(CylinderProjectionComponent
  //     .prototype.mainLoop.bind(this));
  // }.bind(this), 100);
}

}
