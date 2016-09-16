import { VrScenesPage } from './app.po';

describe('vr-scenes App', function() {
  let page: VrScenesPage;

  beforeEach(() => {
    page = new VrScenesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
