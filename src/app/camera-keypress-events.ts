import {Directive} from '@angular/core';
// import {CubeScene} from './cube-scene';
import Object3D = THREE.Object3D;
import Vector3 = THREE.Vector3;
import {Base} from './base';
import Quaternion = THREE.Quaternion;


@Directive({
  selector: '[camera-keypress-events]',
  providers: [],
  //host: {},
  host: {
    '(keypress)' : 'onKeypress($event)'
  },
  //vt add
  //inputs: ['cubeScene: CubeScene']
  //vt end

})

export class CameraKeypressEvents {

  constructor() {}

  static CAMERA_MOVE_DELTA = 1.2;
  static CAMERA_ROT_DELTA = 5;

  static keyHandler (event, dolly: Object3D, flipMovement? : boolean ) {
    // console.log('CameraKeypressEvents.keyHandler: event.keyCode=' + event.keyCode)
    // console.log('CameraKeypressEvents.keyHandler: dolly=' + dolly)
    var moveFactor = 1;

    if (flipMovement) {
      moveFactor = -1;
    }
    // console.log("CameraKeypressEvents.keyHandler: moveFactor=" + moveFactor)
    switch( event.keyCode) {
      case 'W'.charCodeAt(0):
        //console.log('you pressed s');
        //this.dolly.position.z -= this.CAMERA_MOVE_DELTA;
        dolly.translateZ(moveFactor * -this.CAMERA_MOVE_DELTA);
        //console.log('this.do-ly.postion.x=' + this.dolly.position.x);
      break;

      case 'S'.charCodeAt(0):
        // console.log('you pressed s');
        //dolly.position.z += CAMERA_MOVE_DELTA;
        dolly.translateZ(moveFactor * this.CAMERA_MOVE_DELTA);
        // console.log('dolly.postion.x=' + dolly.position.x);
      break;

      case 'D'.charCodeAt(0):
        //console.log('you pressed s');
        //this.dolly.position.x += this.CAMERA_MOVE_DELTA;
        dolly.translateX(moveFactor * this.CAMERA_MOVE_DELTA);
        //console.log('this.dolly.postion.x=' + this.dolly.position.x);
      break;

      case 'A'.charCodeAt(0):
        //this.dolly.position.x -= this.CAMERA_MOVE_DELTA;
        dolly.translateX(moveFactor * -this.CAMERA_MOVE_DELTA);
      break;

      case 'P'.charCodeAt(0):
        //console.log('you pressed s');
        //this.dolly.position.y += this.CAMERA_MOVE_DELTA;
        //console.log('this.dolly.postion.x=' + this.dolly.position.x);
        dolly.translateY(moveFactor * this.CAMERA_MOVE_DELTA);
      break;

      case 'N'.charCodeAt(0):
        //this.dolly.position.y -= this.CAMERA_MOVE_DELTA;
        dolly.translateY(moveFactor * -this.CAMERA_MOVE_DELTA);
      break;

      case 'Q'.charCodeAt(0):
        var tmpQuat = (new THREE.Quaternion()).setFromAxisAngle( new THREE.Vector3(0,1,0), Base.ONE_DEG * this.CAMERA_ROT_DELTA);
        dolly.quaternion.multiply(tmpQuat);
      break;

      case 'E'.charCodeAt(0):
        var tmpQuat = (new THREE.Quaternion()).setFromAxisAngle( new THREE.Vector3(0,1,0), Base.ONE_DEG * -this.CAMERA_ROT_DELTA);
        dolly.quaternion.multiply(tmpQuat);
      break;
    };
  }

   onKeypress (event, cubeScene) {
    // console.log('CameraKeypressEvents.onKeypress: event.keyCode=' + event.keyCode)
        //event.preventDefault();
    // console.log('vtClass.canvasKeyhandler: cubeScene=' + cubeScene);
    // console.log(event, event.keyCode, event.keyIdentifier);

    /*
    */
  }
}
