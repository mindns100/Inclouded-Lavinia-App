import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { take } from 'rxjs/operators';
import { LoggerService } from './shared/services/logger.service';
import { AuthService } from './login/services/auth.service';
import { Subscription } from 'rxjs';
// import { NetworkService } from './shared/services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  noConnection = false;
  connectionSub: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private logger: LoggerService,
    private appVersion: AppVersion,
    private auth: AuthService,
    // private networkService: NetworkService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // this.networkService.listenForConnectionChanges();
      // this.connectionSub = this.networkService.subscribeConnectionStatus().subscribe((connected) => {
      //   if (!connected) {
      //     this.noConnection = true;
      //   } else {
      //     this.noConnection = false;
      //   }
      // });
      try {
        const user = await this.auth.currentUserObservable().pipe(take(1)).toPromise();
        if (user) {
          this.logger.setEmail(user.email);
          this.logger.setUserId(user.uid);
        }
        if (this.platform.is('cordova')) {
          this.statusBar.styleBlackOpaque();
          this.splashScreen.hide();
          const versionCode = await this.appVersion.getVersionCode();
          this.logger.setVersionCode(versionCode);
          const versionNumber = await this.appVersion.getVersionNumber();
          this.logger.setVersionNumber(versionNumber);
          const packageName = await this.appVersion.getPackageName();
          this.logger.setPackageName(packageName);
          const appName = await this.appVersion.getAppName();
          this.logger.setAppName(appName);
        }
      } catch (error) {
        this.logger.handleError(error, true);
      }
    });
  }

}
