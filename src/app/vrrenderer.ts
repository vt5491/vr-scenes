/// <reference path="../../typings/index.d.ts" />
//TODO: this class actually has nothing to do with VR.  It simply returns
// a WebGLRenderer object, which is 3-d but not VR-ized.  All the VR stuff
// is done in vrScene.  So I either need to add some VR stuff in here, or
// rename it.
import {Injectable} from '@angular/core';
import WebGLRenderer = THREE.WebGLRenderer;
import {Utils} from './utils';

@Injectable()
export class VRRenderer {

  renderer : WebGLRenderer
  canvas: HTMLElement;
  guid: String;

  constructor() {}

  init(width: number, height: number) {
    console.log('VRRenderer.init: entered')
    try {
      //TODO: this is a tight coupling on 'scene-view'. pass it
      // as a parm instead
      this.canvas = document.getElementById('scene-view');
      console.log('initWebGl: this.canvas=' + this.canvas)

      var glParms = new Object();

      glParms['antialias'] = true;
      glParms['canvas'] = this.canvas;
      // glParms['preserveDrawingBuffer']

      this.renderer = new THREE.WebGLRenderer(glParms);
      console.log('init: this.renderer=' + this.renderer)

      this.guid = Utils.guidGenerator()
    }
    catch (e) {
      alert('This application needs WebGL enabled! error=' + e);
      return false;
    }

    // this controls the ambient background color e.g of the the "sky"
    this.renderer.setClearColor(0x1313f3, 1.0);

    this.renderer.setSize(width, height);
  }
}
