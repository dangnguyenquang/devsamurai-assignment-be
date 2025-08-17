import { AppModule } from './app.module';

describe('AppModule', () => {
  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });
  
  it('should have the correct properties', () => {
    const appModule = new AppModule();
    expect(appModule).toHaveProperty('someProperty');
  });
});