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
  selector: 'app-cyl-proj',
  templateUrl: './cyl-proj.component.html',
  styleUrls: ['./cyl-proj.component.css']
})

@Injectable()
export class CylProjComponent implements VRRuntime {
  webGLRenderer : THREE.WebGLRenderer
  webGLRenderer_non_vr : THREE.WebGLRenderer
  bufferTexture : THREE.WebGLRenderTarget
  bufferGamePlaneTexture : THREE.WebGLRenderTarget
  boxObject : THREE.Mesh
  mainBoxObject : THREE.Mesh
  projCyl : THREE.Mesh
  bufferScene : THREE.Scene
  bufferGamePlaneScene : THREE.Scene
  bufferSceneCamera : THREE.PerspectiveCamera
  boxMaterial :  THREE.MeshBasicMaterial
  cylMaterial :  THREE.MeshBasicMaterial
  parmsHash : any = { splitMode: false}
  webVrManager : any;
  getImageData : Boolean = true
  texLoader : THREE.TextureLoader = new THREE.TextureLoader();
  gamePlaneCube: THREE.Mesh
  ship: THREE.Line

  constructor(public vrScene: VRScene, public vrRenderer: VRRenderer) {
  }

  ngOnInit() {
  }

  init() {
    var origFunc = this.vrScene.webVrManager.enterVRMode_.bind(this.vrScene.webVrManager)
    var newFuncFactory = function () {

      var parmsHashLocal = this.parmsHash

      return () => {
        console.log(`CylinderProjectionComponent: now hooking enterVRMode_`)
        parmsHashLocal.splitMode = !parmsHashLocal.splitMode
        origFunc()
        console.log(`CylinderProjectionComponent: back from hooking enterVRMode_`)
      }
    }.bind(this) 

    var newFunc = newFuncFactory()
    this.vrScene.webVrManager.enterVRMode_ = newFunc

    // this.webGLRenderer = this.vrRenderer.renderer
    // this gives no dynamic texture, but allows for split screen
    this.webGLRenderer = new THREE.WebGLRenderer() // black object
    this.webGLRenderer.setRenderTarget(this.bufferTexture)
    document.body.appendChild(document.createTextNode("WebGlRenderer"))
    document.body.appendChild( this.webGLRenderer.domElement );

    // this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
    // Create a different scene to hold our buffer objects
    this.bufferScene = new THREE.Scene();
    this.bufferSceneCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.bufferSceneCamera.position.set(0, 1.5, 10);

    this.bufferTexture = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

    var redMaterial = new THREE.MeshBasicMaterial({ color: 0xF0f0f0 });
    var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    this.boxObject = new THREE.Mesh(boxGeometry, redMaterial);
    this.boxObject.position.z = -10;
    // We add it to the bufferScene instead of the normal scene.
    this.bufferScene.add(this.boxObject);

    var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x70FF74 })
    // blueMaterial.side = THREE.DoubleSide;
    var plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    var planeObject = new THREE.Mesh(plane, blueMaterial);
    planeObject.position.z = -15;
    //We add it to the bufferScene instead of the normal scene!
    this.bufferScene.add(planeObject);

    this.boxMaterial = new THREE.MeshBasicMaterial();
    this.boxMaterial.map = this.bufferTexture.texture

    this.initGamePlane()
    this.cylMaterial = new THREE.MeshBasicMaterial()
    // this.cylMaterial.map = THREE.ImageUtils.loadTexture("../../assets/images/clouds.jpg")
    // var textureLoader = new THREE.TextureLoader()

    // this.cylMaterial.map = textureLoader.load("../../assets/images/clouds.jpg")
    // this.webGLRenderer.render(
    // this.vrScene.webVrManager.render(
    this.vrRenderer.renderer.render( //works
      this.bufferGamePlaneScene,
      this.bufferSceneCamera,
      this.bufferGamePlaneTexture
    )

    this.cylMaterial.map = this.bufferGamePlaneTexture.texture

    //  this is the projection object
    // var boxGeometry2 = new THREE.BoxGeometry(5, 5, 5);
    // // var boxGeometry2 = new THREE.BoxGeometry(4, 4, 4);
    // this.mainBoxObject = new THREE.Mesh(boxGeometry2, this.boxMaterial);
    // // this.mainBoxObject = new THREE.Mesh(boxGeometry2, material);
    // this.mainBoxObject.position.z = -10;
    // // this.mainBoxObject.position.x = -1;
    // this.vrScene.scene.add(this.mainBoxObject);
    var projCylGeom = new THREE.CylinderGeometry(3, 3, 12, 50)
    // var projCylMat = new THREE.MeshBasicMaterial({})
    // this.projCyl = new THREE.Mesh(projCylGeom, this.boxMaterial)
    this.projCyl = new THREE.Mesh(projCylGeom, this.cylMaterial)

    this.projCyl.position.z = -1
    this.projCyl.rotateX(Base.ONE_DEG * 90.0)
    this.projCyl.rotateZ(Base.ONE_DEG * 90.0)
    this.vrScene.scene.add(this.projCyl);

  }

  initGamePlane() {
    this.bufferGamePlaneScene = new THREE.Scene()

    this.bufferGamePlaneTexture = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter} 
    )

    var lineGeometry = new THREE.Geometry()

    var lineMaterial = new THREE.LineBasicMaterial();                                                   
    lineMaterial.color = new THREE.Color(255,0,0);   

    this.ship = new THREE.Line(lineGeometry, lineMaterial);

    // lineGeometry.vertices.push(new THREE.Vector3(0, 1))
    // lineGeometry.vertices.push(new THREE.Vector3(1, -0.5))
    // lineGeometry.vertices.push(new THREE.Vector3(-1, -0.5))
    // lineGeometry.vertices.push(new THREE.Vector3(0, 1))
    lineGeometry.vertices.push(new THREE.Vector3(1, 1))
    lineGeometry.vertices.push(new THREE.Vector3(1, -1))
    lineGeometry.vertices.push(new THREE.Vector3(-1, -1))
    lineGeometry.vertices.push(new THREE.Vector3(-1, 1))
    lineGeometry.vertices.push(new THREE.Vector3(1, 1))

    lineGeometry.rotateZ(Base.ONE_DEG * 90)

    this.bufferGamePlaneScene.add(this.ship)

    var cubeGeom = new THREE.CubeGeometry(5,5,5)
    var cubeMat = new THREE.MeshBasicMaterial({color: 0xff00ff})
    cubeMat.side = THREE.DoubleSide;
    this.gamePlaneCube = new THREE.Mesh(cubeGeom, cubeMat)
    this.gamePlaneCube.position.x = -3
    this.gamePlaneCube.position.z = -10

    this.bufferGamePlaneScene.add(this.gamePlaneCube)
    
    var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x70FF74 })
    blueMaterial.side = THREE.DoubleSide;
    var plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    var planeObject = new THREE.Mesh(plane, blueMaterial);
    planeObject.position.z = -15;

    this.bufferGamePlaneScene.add(planeObject)
  }

  mainLoop() {
    window.requestAnimationFrame(CylProjComponent
      .prototype.mainLoop.bind(this));

    //Make the box rotate on box axises
    this.boxObject.rotation.y += 0.01;
    this.boxObject.rotation.x += 0.01;
    //Rotate the main box too
    // this.mainBoxObject.rotation.y += 0.004;
    // this.mainBoxObject.rotation.x += 0.004;
    // this.webGLRenderer.render(//the best
    // // this.webGLRenderer_non_vr.render(// black, but does split
    //   // this.webGLRenderer_non_vr.render(
    // // this.vrScene.webVrManager.render( //works, but does require zap to WebVRManager.render
    //   this.bufferScene,
    //   // this.vrScene.camera,
    //   this.bufferSceneCamera,
    //   this.bufferTexture
    //   // ,true
    // ) 

    var renderer

    if (!this.parmsHash.splitMode) {
      // renderer = this.vrRenderer.renderer //works
      renderer = this.vrScene.vrEffect // works
      // console.log(`renderer=vrrenderer.renderer`)
    }
    else {
      renderer = this.webGLRenderer //splits, but no texture update
      // just gives blank..renders nothing
      // renderer = this.vrScene.webVrManager.renderer
      // renderer = this.vrScene.vrEffect // doesn work at all..crashes browser
      // console.log(`renderer=webGLRenderer`)
      // console.log(`renderer=webVRManager.renderer`)
      // console.log(`renderer=vrEffect`)
    }
    // if you don't call this, you can go split-screen
    // this give rotation pre-split, but shows nothing post split
    // this.vrRenderer.renderer.render( 
    // this gives no rotation, but does do post-split 
    // this.webGLRenderer.render(
    renderer.render(
      this.bufferGamePlaneScene,
      this.bufferSceneCamera,
      this.bufferGamePlaneTexture
    )

    this.bufferGamePlaneTexture.texture.needsUpdate // no effect

    this.vrScene.webVrManager.render(
    // this.vrRenderer.renderer.render(
      this.vrScene.scene,
      this.vrScene.camera
    )


    this.gamePlaneCube.rotation.y += 0.01
    this.ship.position.x += 0.01
    // console.log(`CylProj.mainLoop: ship.position.y=${this.ship.position.y}`)
    // if (this.ship.position.y > window.innerHeight) {
    if (this.ship.position.x > 3.0 * Math.PI) {
      this.ship.position.x = -3.0 * Math.PI 
    }

    this.webGLRenderer.render(
    // renderer.render(
      this.bufferGamePlaneScene, this.bufferSceneCamera
    )
  }

}
