import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {VRScene} from '../../vrscene';
import {VRSceneProvider} from '../../vrscene';
import {VRRenderer} from '../../vrrenderer';
import {Base} from '../../base';
import {CameraKeypressEvents} from '../../camera-keypress-events';
import Mesh = THREE.Mesh;
import {VRRuntime} from '../../vrruntime';

export class TorusProj implements VRRuntime{
  webGLRenderer: THREE.WebGLRenderer;
  bufferGamePlaneTexture: THREE.WebGLRenderTarget;
  bufferGamePlaneScene : THREE.Scene
  gamePlaneCube: THREE.Mesh
  ship: THREE.Line
  asteroid: THREE.Line
  buf1 : THREE.DataTexture
  
  constructor(public vrScene: VRScene, public vrRenderer: VRRenderer) {
  }
  
  init(){
    // this gives no dynamic texture, but allows for split screen
    this.webGLRenderer = new THREE.WebGLRenderer({antialias: true, });
    this.webGLRenderer.setClearColor(0x1313f3, 1.0);
    // this.webGLRenderer.setClearColor(0x000000, 1.0);

    // this.webGLRenderer.setRenderTarget(this.bufferTexture)
    document.body.appendChild(document.createTextNode("WebGlRenderer"));
    document.body.appendChild( this.webGLRenderer.domElement );
    
    this.initGamePlane()
    
    // Note: the binary version of fbx is not supported.  
    // use the JSON format instead.
    var mesh;
    var loader = new THREE.JSONLoader();
    // loader.load('assets/torus.json', function (geometry) {
    loader.load('/assets/torus.json', function (geometry) {
      // console.log(`geomerty=${geometry}`);
      mesh = new THREE.Mesh(geometry);
      mesh.scale.set( 10, 10, 10 )
      this.vrScene.scene.add(mesh);
    }.bind(this));
    // debugger;
    
    // note: by simply adding this plane, we get rid of the of the 
    // 'blue background from hell" problem.
    var floorGeometry = new THREE.PlaneGeometry(65, 40, 32);
    var floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    var floorPlane = new THREE.Mesh( floorGeometry, floorMaterial );
    floorPlane.rotateX(Base.ONE_DEG * 90.0)
    this.vrScene.scene.add( floorPlane );
  }
  
  initGamePlane() {
    this.bufferGamePlaneScene = new THREE.Scene()

    this.bufferGamePlaneTexture = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
    )

    // create the ship
    var shipGeometry = new THREE.Geometry()
    var shipMaterial = new THREE.LineBasicMaterial({ linewidth: 3 })
    shipMaterial.color = new THREE.Color(80, 255, 20);

    this.ship = new THREE.Line(shipGeometry, shipMaterial);
    this.ship.position.x = 2.0

    shipGeometry.vertices.push(new THREE.Vector3(0, 1))
    shipGeometry.vertices.push(new THREE.Vector3(1, -1))
    shipGeometry.vertices.push(new THREE.Vector3(-1, -1))
    shipGeometry.vertices.push(new THREE.Vector3(0, 1))

    this.bufferGamePlaneScene.add(this.ship)

    // create the asteroid
    var lineGeometry = new THREE.Geometry()

    var lineMaterial = new THREE.LineBasicMaterial({ linewidth: 2 });
    lineMaterial.color = new THREE.Color(255, 0, 0);

    this.asteroid = new THREE.Line(lineGeometry, lineMaterial);

    lineGeometry.vertices.push(new THREE.Vector3(1, 1))
    lineGeometry.vertices.push(new THREE.Vector3(1, -1))
    lineGeometry.vertices.push(new THREE.Vector3(-1, -1))
    lineGeometry.vertices.push(new THREE.Vector3(-1, 1))
    lineGeometry.vertices.push(new THREE.Vector3(1, 1))

    lineGeometry.rotateZ(Base.ONE_DEG * 90)

    this.bufferGamePlaneScene.add(this.asteroid)

    var cubeGeom = new THREE.CubeGeometry(5, 5, 5)
    var cubeMat = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    cubeMat.side = THREE.DoubleSide;
    this.gamePlaneCube = new THREE.Mesh(cubeGeom, cubeMat)
    this.gamePlaneCube.position.x = -3
    this.gamePlaneCube.position.z = -10

    this.bufferGamePlaneScene.add(this.gamePlaneCube)

    // var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x70FF74 })
    var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7070FF })
    blueMaterial.side = THREE.DoubleSide;
    var plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    var planeObject = new THREE.Mesh(plane, blueMaterial);
    planeObject.position.z = -15;

    this.bufferGamePlaneScene.add(planeObject)
  }

  mainLoop() {
    // console.log(`TorusProj.mainLoop: entered`);
    window.requestAnimationFrame(TorusProj
      .prototype.mainLoop.bind(this));
      
    this.vrScene.vrControls.update();

    this.vrScene.webVrManager.render(
      // this.vrRenderer.renderer.render(
      this.vrScene.scene,
      this.vrScene.camera
    )
  } 
}
