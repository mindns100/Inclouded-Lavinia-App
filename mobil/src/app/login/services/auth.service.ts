import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { take } from 'rxjs/operators';

export const EMAIL_REGEX = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  async login(email: string, password: string, rememberMe: boolean): Promise<firebase.default.auth.UserCredential> {
    await this.afAuth.setPersistence(rememberMe ? 'local' : 'session');
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.afAuth.signOut();
  }

  async getIdToken() {
    return await this.afAuth.idToken.pipe(take(1)).toPromise();
  }

  authenticated(): boolean {
    return this.afAuth.authState !== null;
  }

  currentUserObservable(): Observable<firebase.default.User> {
    return this.afAuth.authState;
  }

  createUserWithEmailAndPassword(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  passwordRemind(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}