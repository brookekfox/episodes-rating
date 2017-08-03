import { TvEpisodesAppPage } from './app.po';

describe('tv-episodes-app App', () => {
  let page: TvEpisodesAppPage;

  beforeEach(() => {
    page = new TvEpisodesAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
