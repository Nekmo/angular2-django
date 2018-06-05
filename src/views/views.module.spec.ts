import { ViewsModule } from './views.module';

describe('ViewsModule', () => {
  let viewsModule: ViewsModule;

  beforeEach(() => {
    viewsModule = new ViewsModule();
  });

  it('should create an instance', () => {
    expect(viewsModule).toBeTruthy();
  });
});
