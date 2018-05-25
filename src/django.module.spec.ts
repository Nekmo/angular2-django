import { DjangoModule } from './django.module';

describe('DjangoModule', () => {
  let djangoModule: DjangoModule;

  beforeEach(() => {
    djangoModule = new DjangoModule();
  });

  it('should create an instance', () => {
    expect(djangoModule).toBeTruthy();
  });
});
