import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {VRScene} from '../../vrscene';
import {VRSceneProvider} from '../../vrscene';
import {VRRenderer} from '../../vrrenderer';
import {Base} from '../../base';
import {CameraKeypressEvents} from '../../camera-keypress-events';
import Mesh = THREE.Mesh;
import {VRRuntime} from '../../vrruntime';
import {Promise} from 'es6-promise';

export class TorusProj implements VRRuntime{
  webGLRenderer: THREE.WebGLRenderer;
  gl_webGLRenderer: any;
  bufferGamePlaneTexture: THREE.WebGLRenderTarget;
  bufferGamePlaneScene : THREE.Scene;
  gamePlaneCube: THREE.Mesh;
  ship: THREE.Line;
  asteroid: THREE.Line;
  buf1 : THREE.DataTexture;
  bufferSceneCamera: THREE.PerspectiveCamera;
  cylHeight = 3;
  cylWidth = 3;
  torusMaterial: THREE.MeshBasicMaterial;
  projCyl: THREE.Mesh;
  cylMaterial: THREE.MeshBasicMaterial

  constructor(public vrScene: VRScene, public vrRenderer: VRRenderer) {
  }

  init(){
    console.log('torus-proj.init: entered');
    // this gives no dynamic texture, but allows for split screen
    this.webGLRenderer = new THREE.WebGLRenderer({antialias: true, });
    // this.webGLRenderer.setClearColor(0x1313f3, 1.0);
    this.webGLRenderer.setClearColor(0xf31313, 1.0);
    this.webGLRenderer.domElement.id = 'webGLRenderer';
    // this.webGLRenderer.setClearColor(0x000000, 1.0);
    this.gl_webGLRenderer = this.webGLRenderer.getContext();

    // this.webGLRenderer.setRenderTarget(this.bufferTexture)
    // document.body.appendChild(document.createTextNode("WebGlRenderer"));

    // var br = document.createElement("br");
    // document.appendChild(br);

    // this.webGLRenderer.domElement.offsetHeight = window.innerHeight;
    // this.webGLRenderer.domElement.offsetWidth = window.innerWidth;
    this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild( this.webGLRenderer.domElement );
    var tmp = document.getElementById('webGLRenderer');
    console.log('torus-proj.init: webGLRenderer.width=' + document.getElementById('webGLRenderer').offsetWidth);
    console.log('torus-proj.init: webGLRenderer.height=' + tmp.offsetHeight);
    // var foo = document.getElementById("fooBar");
    // foo.appendChild(br);
    this.buf1 = this.generateDataTexture(tmp.offsetWidth, tmp.offsetHeight, new THREE.Color(0x000000));
    this.buf1.needsUpdate = true;

    this.bufferSceneCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

    this.initGamePlane()

    // note: by simply adding this plane, we get rid of the of the
    // 'blue background from hell" problem.
    var floorGeometry = new THREE.PlaneGeometry(65, 40, 32);
    var floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    var floorPlane = new THREE.Mesh( floorGeometry, floorMaterial );
    floorPlane.rotateX(Base.ONE_DEG * 90.0)
    this.vrScene.scene.add( floorPlane );

    // add the gamePlane to the visible renderer at the bottom
    this.webGLRenderer.render(
      this.bufferGamePlaneScene,
      this.bufferSceneCamera,
      this.bufferGamePlaneTexture
    )

    // Note: the binary version of fbx is not supported.
    // use the JSON format instead.
    var torusMesh;
    // var loader = new THREE.JSONLoader();
    // // loader.load('assets/torus.json', function (geometry) {
    // var p = new Promise<string>((resolve, reject) => {
    //   loader.load('/assets/torus.json', function (torusGeom) {
    //     // console.log(`geomerty=${geometry}`);
    //     this.torusMaterial = new THREE.MeshBasicMaterial();
    //     // this.torusMaterial.map = this.bufferGamePlaneTexture.texture;
    //
    //     torusMesh = new THREE.Mesh(torusGeom, this.torusMaterial);
    //
    //     torusMesh.scale.set(15, 15, 15)
    //     this.vrScene.scene.add(torusMesh);
    //
    //     resolve('torus_loaded');
    //   }.bind(this))
    // });
    //
    // p.then((val) => {
    //   console.log(`promise fullfilled. val=${val}`);
    // });
    //
    // console.log('after the then statement');
    // var torusGeom   = new THREE.TorusGeometry(2.41, 0.2, 50, 50);
    var torusGeom   = new THREE.TorusGeometry(25, 8, 50, 50);
    this.torusMaterial = new THREE.MeshBasicMaterial();

    torusMesh = new THREE.Mesh(torusGeom, this.torusMaterial);
    torusMesh.rotateX(Base.ONE_DEG * 90.0);

    this.vrScene.scene.add(torusMesh);

    var projCylGeom = new THREE.CylinderGeometry(3, 3, 12, 50)

    this.cylMaterial = new THREE.MeshBasicMaterial();
    this.projCyl = new THREE.Mesh(projCylGeom, this.cylMaterial)

    this.projCyl.position.z = -1
    this.projCyl.rotateX(Base.ONE_DEG * 90.0)
    this.projCyl.rotateZ(Base.ONE_DEG * 90.0)
    this.vrScene.scene.add(this.projCyl);
    // loader.load('/assets/torus.json', function (geometry) {
    //   // console.log(`geomerty=${geometry}`);
    //   this.torusMaterial = new THREE.MeshBasicMaterial();
    //   this.torusMaterial.map = this.bufferGamePlaneTexture.texture;

    //   torusMesh = new THREE.Mesh(geometry, this.torusMaterial);

    //   torusMesh.scale.set( 15, 15, 15 )
    //   this.vrScene.scene.add(torusMesh);
    // }.bind(this)
    // .then(() => {console.log('now in then handler')})
    // );

    // while (torusMesh.image.width == 0);
    // while (!torusMesh);
    // debugger;
  }

  initGamePlane() {
    this.bufferGamePlaneScene = new THREE.Scene()

    var webGLRendererCanvas = document.getElementById('webGLRenderer');

    this.bufferGamePlaneTexture = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      // webGLRendererCanvas.offsetWidth,
      // webGLRendererCanvas.offsetHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
    )

    // create the ship
    var shipGeometry = new THREE.Geometry()
    var shipMaterial = new THREE.LineBasicMaterial({ linewidth: 3 })
    shipMaterial.color = new THREE.Color(80, 255, 20);

    this.ship = new THREE.Line(shipGeometry, shipMaterial);
    // this.ship.position.x = 2.0
    this.ship.position.x = -3
    this.ship.position.z = -10

    shipGeometry.vertices.push(new THREE.Vector3(0, 1))
    shipGeometry.vertices.push(new THREE.Vector3(.1, -1))
    shipGeometry.vertices.push(new THREE.Vector3(-.1, -1))
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

    // this.bufferGamePlaneScene.add(this.gamePlaneCube)

    // var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x70FF74 })
    // var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7070FF })
    // blueMaterial.side = THREE.DoubleSide;
    // var plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    // var planeObject = new THREE.Mesh(plane, blueMaterial);
    // planeObject.position.z = -15;

    // this.bufferGamePlaneScene.add(planeObject)
  };

  generateDataTexture(width, height, color) {
    var size = width * height;
    var data = new Uint8Array(4 * size);

    var texture = new (<any> THREE.DataTexture)(data, width, height, THREE.RGBAFormat)
    texture.needsUpdate = true;

    return texture;
  };

  mainLoop() {
    // console.log(`TorusProj.mainLoop: entered`);
    window.requestAnimationFrame(TorusProj
      .prototype.mainLoop.bind(this));

    this.vrScene.vrControls.update();


    // inner scene
    this.asteroid.position.x += 0.01;

    if (this.asteroid.position.x > 3.0 * Math.PI) {
      this.asteroid.position.x = -3.0 * Math.PI
    }

    this.ship.position.y += 0.01;
    if (this.ship.position.y > this.cylHeight / 0.5) {
      this.ship.position.y = -this.cylHeight / 0.5 
    }

    this.gamePlaneCube.rotateY(Base.ONE_DEG * 0.5)

    // renderto the offscreen texture
    this.webGLRenderer.render(
      this.bufferGamePlaneScene,
      this.bufferSceneCamera,
      this.bufferGamePlaneTexture
    );

    // var gl = this.webGLRenderer.getContext();
    var webGLRendererCanvas = document.getElementById('webGLRenderer');

    try {
      this.gl_webGLRenderer.readPixels(0, 0,
        window.innerWidth, window.innerHeight,
        // webGLRendererCanvas.offsetWidth, webGLRendererCanvas.offsetHeight,
        this.gl_webGLRenderer.RGBA,
        this.gl_webGLRenderer.UNSIGNED_BYTE,
        this.buf1.image.data
      );
    }
    catch(e) {
      console.log(`torus.proj.mainLoop: caught error ${e}`)
    }
    // gl.readPixels(0,0,
    //   window.innerWidth, window.innerHeight,
    //   gl.RGBA,
    //   gl.UNSIGNED_BYTE,
    //   (<any> this.buf1.image.data)
    //   // this.buf1.image.data
    // );

    this.buf1.needsUpdate = true; //need this
    this.torusMaterial.map = this.buf1 //need this
    // this.cylMaterial.map = this.buf1;

    // render to the visible monitor canvas
    this.webGLRenderer.render(
      this.bufferGamePlaneScene,
      this.bufferSceneCamera
    );

    // var gl = this.bufferGamePlaneTexture.getContext();
    // outer scene
    this.vrScene.webVrManager.render(
      this.vrScene.scene,
      this.vrScene.camera
    );
  }
}
