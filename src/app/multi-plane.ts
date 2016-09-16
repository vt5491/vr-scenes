/// <reference path="../../typings/index.d.ts" />
import {Component} from '@angular/core';
import {Injectable} from '@angular/core';
import PlaneBufferGeometry = THREE.PlaneBufferGeometry;
import Mesh = THREE.Mesh;
//import Object3D = THREE.Object3D;
import {Utils} from './utils';
import {Base} from './base';
//import {VRScene} from '../vrscene/vrscene'; 

@Component({
  selector: 'multi-plane',
  // templateUrl: 'app//multi-plane/multi-plane.html',
  // styleUrls: ['app//multi-plane/multi-plane.css'],
  // providers: [Utils],
  // directives: [],
  // pipes: []
})

@Injectable()
//export class MultiPlane extends Object3D {
export class MultiPlane {

  plane : Mesh
  planeMeshes: Mesh[] = [];
  utils: Utils;
  rotXAxis: THREE.Quaternion = (new THREE.Quaternion())
    .setFromAxisAngle( new THREE.Vector3(1,0,0), Base.ONE_DEG * 90.0)

  geometry : PlaneBufferGeometry;

  // constructor(private utils: Utils) {
  constructor() {
    // this.utils = utils
    // TODO: figure out how to inject this
    this.utils = new Utils();
  //constructor(private vrScene: VRScene) {
        //  plane = new THREE.Mesh(
        //   new THREE.PlaneBufferGeometry( gridSize, gridSize ),
        //   new THREE.MeshBasicMaterial({map: groundTexture}) );
        //
    //this.plane = new THREE.Mesh(, material?: THREE.Material new THREE.PlaneBufferGeometry(4, 4)
    //)
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(44,344),
      new THREE.MeshBasicMaterial()
    );

    for (var x =0 ; x < 3; x++) {
      for (var z=0; z < 3; z++) {
        var mat = new THREE.MeshBasicMaterial()
        // mat.color = this.utils.getRndColor()
        // mat.color = new THREE.Color(200, 100, 50)
        //mat.color.setHex(0xff0000);
        mat.color.setHex(this.utils.getRndColor().getHex())
        mat.side = THREE.DoubleSide;

        var plane = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(40, 40),
          // new THREE.MeshBasicMaterial()
          mat
        )

        plane.position.x = x * 40;
        plane.position.z = z * 40;

        // rotate about the x-axis so it laying down "flat"
        plane.quaternion.multiply(this.rotXAxis)

        this.planeMeshes.push(plane)
      }
    }
    // var geometry = new THREE.PlaneGeometry( 65, 40, 32 );
    // super()
    // this.geometry = new THREE.PlaneBufferGeometry( 5, 5);
  }
}
