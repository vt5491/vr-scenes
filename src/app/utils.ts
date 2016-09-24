import {Injectable} from '@angular/core';
// import Color = THREE.Color;
import Mesh = THREE.Mesh;
import {Base} from './base'

@Injectable()
export class Utils {

  constructor() {
    console.log('Utils: now it ctor')
  }

  static doIt () : number {

    return 7;
  }

  //static getRndColor () : THREE.Color {
  getRndColor () : THREE.Color {
    return new THREE.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  }

  // a basic cube useful for initializing a scene
  static getBasicCube () : Mesh {
    var boxGeometry : THREE.BoxGeometry = new THREE.BoxGeometry(35, 25, 40);

    var meshParms = {color: 0x6080ff}
    var boxMaterial = new THREE.MeshBasicMaterial(meshParms);

    return new THREE.Mesh(boxGeometry, boxMaterial);
  }

  // just a standard quaternion for rotating cubes
  static getBasicQuat () : THREE.Quaternion {
    return new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0,1,0), Base.ONE_DEG * 0.2 );

  }

  static buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(),
    mat;

    if(dashed) {
      mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
    } else {
      mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
    }

    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

    return axis;

  }

  static buildAxes( length ) {
    var axes = new THREE.Object3D();

    axes.add( Utils.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( Utils.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( Utils.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( Utils.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( Utils.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( Utils.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

    return axes;
  }

  static guidGenerator() {
    var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
}
