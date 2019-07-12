import { Injectable } from '@angular/core';
import { HttpRequestsService } from './http-requests.service';
import { environment } from './../../../environments/environment';

@Injectable()
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  private hostUrl: string;
  constructor(private httpRequestsService: HttpRequestsService) {
    this.hostUrl = environment.hostUrl;
  }

  /**
   * Checks in every set frequency the version of frontend application
   * @param url
   * @param {number} frequency - in milliseconds, defaults to 30 minutes
   */
  public initVersionCheck(url, frequency = 1000 * 10) {
    // disable check on localhost running server
    // if (this.hostUrl.indexOf('localhost') !== -1) { return null; }
    // this.checkVersion(url);
    // setInterval(() => {
    //   this.checkVersion(url);
    // }, frequency);
  }

  /**
   * Will do the call and check if the hash has changed or not
   * @param currentVersionCode
   */
  public updateNeeded(currentVersionCode: number) {
    // timestamp these requests to invalidate caches
    this.httpRequestsService.hostHttpGet('version.json?t=' + new Date().getTime())
      .subscribe(
        (response: any) => {
          const requiredMobileVersion = Number(response.requiredMobileVersion);

          // If requiredVersion existing and > current do update force
          if (requiredMobileVersion && requiredMobileVersion > currentVersionCode) {
            return true;
          }
          return false;
        },
        (err) => {
          console.error(err, 'Could not get version');
          return false;
        }
      );
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }
}
