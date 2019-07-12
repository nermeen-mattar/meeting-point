export class TokenHandlerServiceMock {

  constructor() {}

  private getPayload(token) {
    return '';
  }

  isTokenValid(token: string) {
    return true;
  }

  decodeToken(token) {
  }
}
