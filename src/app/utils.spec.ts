import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {Utils} from './utils';
import WebGLRenderer = THREE.WebGLRenderer; 

describe('Utils Service', () => {

  beforeEachProviders(() => [Utils]);


  it('should doIt', inject([Utils], (service: Utils) => {
    console.log("Utils.doIt()=" + Utils.doIt()) 
    expect(Utils.doIt()).toEqual(7)
  }));

});
