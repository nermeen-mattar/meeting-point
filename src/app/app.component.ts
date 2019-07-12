import { Component } from '@angular/core';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { filter, map, first } from 'rxjs/operators';
import { LocalizedAlertService } from './core/services/localized-alert.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginStatusService } from './core/services/login-status.service';
import { LanguagesService } from './core/services/languages.service';
import { TeamsService } from './core/services/teams.service';
import { environment } from './../environments/environment';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  loginState$: Observable<boolean | string>;
  public loggedInStateMenuItems = [
    {
      title: 'EVENT.EVENTS',
      url: '/events-list',
      icon: 'calendar'
    },
    {
      title: 'MEMBER.MEMBERS',
      url: '/members-list',
      icon: 'contacts'
    },
    {
      title: 'TEAM.TEAMS',
      url: '/teams-list',
      icon: 'list-box'
    }
  ];
  public loggedOutStateMenuItems = [
    {
      title: 'LOGIN.LOGIN',
      url: '/login',
      icon: 'lock'
    },
    {
      title: 'REGISTER.REGISTER',
      url: '/register',
      icon: 'lock'
    }
  ];
  menuOpened = false;
  hasAdminRole: boolean;
  showCookies = false;
  primaryColor = '#FF9800';
  resumeReference = null;
  private hostUrl: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private teamsService: TeamsService,
    public translate: TranslateService,
    private loginStatusService: LoginStatusService,
    public languagesService: LanguagesService,
    private localizedAlertService: LocalizedAlertService,
    private appVersion: AppVersion,
    private market: Market,
    private httpClient: HttpClient,
    private alertCtrl: AlertController
  ) {
    this.hostUrl = environment.hostUrl;
    this.initializeApp();
    this.resumeReference = this.platform.resume.subscribe(() => {
      this.checkAppVersion();
    });
  }

  ionViewWillUnload() {
    this.resumeReference.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkAppVersion();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.styleLightContent();
      // set status bar to primary color
      this.statusBar.backgroundColorByHexString(this.primaryColor);
    });
    this.loginState$ = this.loginStatusService.$userLoginState;
    this.loginState$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.resetData();
      }
    });
    this.teamsService.$teamRoles
      .pipe(filter(teamRoles => !!teamRoles))
      .subscribe(() => (this.hasAdminRole = this.teamsService.hasAdminRole()));
  }
  logout() {
    this.loginStatusService.logout();
  }
  async checkAppVersion() {
    try {
      const currentVersionNumber = await this.appVersion.getVersionNumber();
      const serverVersion: any = await this.httpClient.get(this.hostUrl + 'version.json?t=' + new Date().getTime())
        .pipe(first())
        .toPromise();
      if (serverVersion && this.isUpdateNeeded(serverVersion.requiredMobileVersion, currentVersionNumber)) {
        const confirmationAlert = {
          header: 'USER_MESSAGES.FORCE_UPDATE.HEADER',
          message: 'USER_MESSAGES.FORCE_UPDATE.MESSAGE',
          buttons: [
            this.platform.is('android') && {
              text: 'CANCEL',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                navigator['app'].exitApp();
              }
            },
            {
              text: 'OK',
              handler: () => {
                if (this.platform.is('android')) {
                  this.market.open('com.meeting-point');
                }
                if (this.platform.is('ios')) {
                  this.market.open('com.meeting-point');
                }
              }
            }
          ]
        };
        this.localizedAlertService.displayLocalizedAlert(confirmationAlert);
      }
    } catch (_error) {
    }
  }

  isUpdateNeeded(serverVersion, localVersion) {
    if (this.compareVersion(serverVersion, localVersion) === 1) { return true; }
    return false;
  }

  compareVersion(serverVersion, localVersion) {
    if (typeof serverVersion !== 'string') { return false; }
    if (typeof localVersion !== 'string') { return false; }
    serverVersion = serverVersion.split('.');
    localVersion = localVersion.split('.');
    const k = Math.min(serverVersion.length, localVersion.length);
    for (let i = 0; i < k; ++i) {
      serverVersion[i] = parseInt(serverVersion[i], 10);
      localVersion[i] = parseInt(localVersion[i], 10);
      if (serverVersion[i] > localVersion[i]) { return 1; }
      if (serverVersion[i] < localVersion[i]) { return -1; }
    }
    return serverVersion.length === localVersion.length ? 0 : (serverVersion.length < localVersion.length ? -1 : 1);
  }

  /**
   * @author Nermeen Mattar
   * @description displays the change language dialog and triggers change selected language when the user changes the selected
   * language and clicks on confirm
   */
  async showLanguageOptions() {
    const languageInputs = this.languagesService.appLanguages.map(language => {
      return {
        name: language.code,
        type: 'radio',
        label: 'LANGUAGE.' + language.code,
        value: language.code,
        checked: language.code === this.languagesService.selectedLanguageCode
      };
    });
    const languageAlert = {
      header: 'LANGUAGE.CHANGE_LANGUAGE',
      inputs: languageInputs,
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel'
        },
        {
          text: 'CONFIRM',
          handler: selectedLanguage => {
            if (
              selectedLanguage !== this.languagesService.selectedLanguageCode
            ) {
              this.languagesService.languageSelected(selectedLanguage);
            }
          }
        }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(languageAlert);
  }
  /**
   * @author Nermeen Mattar
   * @description resets the class variables
   */
  resetData() {
    this.hasAdminRole = null;
  }
}
