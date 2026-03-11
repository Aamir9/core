import { OpticianTemplatePage } from './app.po';

describe('Optician App', function() {
  let page: OpticianTemplatePage;

  beforeEach(() => {
    page = new OpticianTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
