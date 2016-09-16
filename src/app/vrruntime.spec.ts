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
import {VRRuntime} from './vrruntime';
import WebGLRenderer = THREE.WebGLRenderer;
import {VRRenderer} from '../vrrenderer/vrrenderer';
//import {VRScene} from '../vrscene/vrscene';
import {VRScene} from '../vrscene/vrscene'


describe('VRRuntime Component', () => {

  // //beforeEachProviders((): any[] => []);
  // //beforeEachProviders(() => [VRRuntime, Window]);
  // beforeEachProviders(() => [VRRuntime, VRScene]);

  // // beforeEachProviders(() => [
  // //    provide(TestService, {useClass: MockTestService})
  // //  ]);

  // // beforeEachProviders(() => [
  // //   provide(VRRuntime, {vrScene: VRScene})
  // // ]);

  // it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
  //   return tcb.createAsync(VRRuntime).then((fixture) => {
  //     fixture.detectChanges();
  //   });
  // }));

  // // it('should doIt', inject([Utils], (service: Utils) => {
  // //   console.log("Utils.doIt()=" + Utils.doIt())
  // //   expect(Utils.doIt()).toEqual(7)
  // // }));

  // it('instanceDoIt works', inject([VRRuntime], (component) => {
  //   console.log('window.innerWidth=' + window.innerWidth)
  //   expect(component.instanceDoIt()).toEqual(7);
  // }));

  // it('system injects VRScene properly', inject([VRRuntime, VRScene], (component) => {
  //   console.log('ut:component.vrScene=' + component.vrScene);
  //   expect(component.vrScene).toBeAnInstanceOf(VRScene);
  // }));

  // it('init works', inject([VRRuntime], (component) => {
  //   component.init()
  //   console.log('component.width=' + component.width )

  //   expect(component.width).toEqual(window.innerWidth);
  //   expect(component.height).toEqual(window.innerHeight);

  //   console.log('vrrenderer.renderer=' + component.vrRenderer.renderer)

  //   expect(component.vrRenderer.renderer).not.toBeNull()
  //   expect(component.vrRenderer.renderer).toBeAnInstanceOf(WebGLRenderer)
  // }));

});
