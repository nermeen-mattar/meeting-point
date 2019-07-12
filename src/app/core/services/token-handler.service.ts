import { Injectable } from '@angular/core';

import { DecodedToken } from '../models/decoded-token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenHandlerService {

  constructor() {}

  private getPayload(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  /**
   * @author Nermeen Mattar
   * @description checks if the pased token is valid, by compaing the date and time now with the token expiration date and time
   * @param {string} token
   * @returns {boolean}
   */
  isTokenValid(token: string): boolean {
    if (!token || token === '') {
      return false;
    }
    // const tokenExpirationLong = environment.authConfig.tokenExpiration;
    const payload = this.getPayload(token);
    const expirationDate = +(payload.exp + '000'); // *** currently produces NaN because the backend shoule include exp in the token payload
    const currentDate = +Date.now();
    const dateDiff = expirationDate - currentDate;
    return !dateDiff || dateDiff > 0;
  }

/**
 * @author Nermeen Mattar
 * @description decodes the encoded token (received fromt the server).
 * @param {string} token
 * @returns {Token}
 */
decodeToken(token: string): DecodedToken {
    if (token && (typeof token === 'string')) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    }
  }
}
