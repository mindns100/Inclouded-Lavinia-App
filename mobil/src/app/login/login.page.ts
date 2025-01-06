import { AuthService, EMAIL_REGEX } from './services/auth.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { TranslateService } from '../shared/translate/services/translate.service';
import { environment } from 'src/environments/environment';
// import { collection, FirebaseService } from '../shared/services/firebase.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  imgError = false;
  loginForm: FormGroup;
  selectedLanguage: string;
  errorMessage: string;
  errorCode: string;
  routeTo: string;
  version = environment.version;
  loading = false;
  gLoading = false;
  aLoading = false;
  loginCalled = false;

  @HostListener('document:keydown.enter') onKeydownHandler() {
    this.login();
  }

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private translateService: TranslateService,
    // private firebaseService: FirebaseService
  ) { }

  async ngOnInit() {
    this.initLoginForm();
    await this.authService.logout();
    this.routeTo = (this.route.snapshot.params.routeTo) ? this.route.snapshot.params.routeTo : '/main';
    this.selectedLanguage = this.translateService.selectedLanguage;
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      password: new FormControl('', Validators.required),
      isRememberMe: new FormControl(true)
    });
  }

  changeLanguage(event: any): void {
    this.selectedLanguage = event.detail.value;
    this.translateService.use(this.selectedLanguage);
  }

  onImgError(event) {
    if (event) {
      this.imgError = true;
    }
  }

  async login() {
    if (this.loginForm.invalid || this.loginCalled) { return; }
    this.loginCalled = true;
    this.loading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const isRememberMe = this.loginForm.value.isRememberMe;
    try {
      const result = await this.authService.login(email, password, isRememberMe);
      if (result && result.user && result.user.uid) {
        /* const fireUser = await this.firebaseService.getDataById(collection.users, result.user.uid).pipe(take(1)).toPromise();
        if (fireUser && fireUser[0]) {
          this.logger.setUserId(result.user.uid);
          this.logger.setEmail(email);
          this.logger.addLogItem('USER_LOGIN', email);
          this.navController.navigateRoot(this.routeTo);
        } else {
          this.errorMessage = 'YOU_DONT_HAVE_ACCESS';
          await this.authService.logout();
        } */
      } else {
        this.errorMessage = 'SOMETHING_WENT_WRONG';
      }
    } catch (error) {
      this.loginCalled = false;
      this.logger.handleError(error);
      switch (error.code) {
        case 'auth/user-not-found': this.errorMessage = 'USER_NOT_FOUND'; break;
        case 'auth/wrong-password': this.errorMessage = 'WRONG_PASSWORD'; break;
        default: this.errorMessage = 'SOMETHING_WENT_WRONG'; this.errorCode = error.code; break;
      }
    }
    this.loading = false;
  }

}
