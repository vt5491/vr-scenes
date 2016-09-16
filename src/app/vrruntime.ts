/// <reference path="../../typings/index.d.ts" />
import {Component} from '@angular/core';
import {Injectable} from '@angular/core';
import WebGLRenderer = THREE.WebGLRenderer;
import {VRRenderer} from './vrrenderer'
import {VRScene} from './vrscene'
import {VRSceneProvider} from './vrscene'
// import {SphereScene} from '../sphere-scene/sphere-scene';
// import {VtDummy} from '../vt-dummy/vt-dummy'

export interface VRRuntime {
  // note: if your class doesn't have these attributes, the ts compiler will
  // flag it as an error.
  vrRenderer: VRRenderer;
  vrScene: VRScene;

  init();
  mainLoop();
}
