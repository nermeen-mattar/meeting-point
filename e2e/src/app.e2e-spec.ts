import { AppPage } from './app.po';
import { LoginPage } from './login/login.po';

describe('Home', () => {
  let page: AppPage;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new AppPage();
  });

});
