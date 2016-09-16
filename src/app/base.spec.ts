
import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders,
  //vt add
  //jasmine.Matchers 
  //vt end
} from 'angular2/testing';

import {provide} from 'angular2/core';
import {Base} from './base';
import WebGLRenderer = THREE.WebGLRenderer; 

//import {THREE} from './../../../../node_modules/three/three';
//vt add
//import {requireMatchers} from '../../../../node_modules/jasmine-core/lib/jasmine-core';
//import {jasmine.Matchers} from '../../../../node_modules/jasmine-core/lib/jasmine-core';
//import {jasmine.Matchers} from 'jasmine/core';

//vt end

describe('Base Component', () => {

  //beforeEachProviders((): any[] => []);
  beforeEachProviders(() => [Base]);

  // it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
  //   return tcb.createAsync(Base).then((fixture) => {
  //     fixture.detectChanges();
  //   });
  // }));
  it('should pass easy test', function () {
    //expect(7).
    expect(true).toBe(true)
    expect(true).toEqual(true)
  });
   
  it('should have name property set', inject([Base], (base: Base) => {
    //expect(base.ONE_DEG).toEqual(Math.PI / 180.0);
    expect(Base.ONE_DEG).toEqual(Math.PI / 180.0);
  }));
       
});
