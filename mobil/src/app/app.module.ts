import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { setupTranslateFactory, TranslateModule } from './shared/translate/translate.module';
import { TranslateService } from './shared/translate/services/translate.service';
import { TranslatePipe } from './shared/translate/pipes/translate.pipe';
import { LoginPageModule } from './login/login.module';
import { File } from '@ionic-native/file/ngx';
import { MenuPageModule } from './menu/menu.page.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    NoopAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    LoginPageModule,
    TranslateModule,
    MenuPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TranslateService,
    TranslatePipe,
    ScreenTrackingService,
    UserTrackingService,
    AppVersion,
    File,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    },
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
