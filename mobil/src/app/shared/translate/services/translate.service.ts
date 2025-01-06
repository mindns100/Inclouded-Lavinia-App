import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  translation: any = {};
  selectedLanguage = '';
  defaultLanguage = 'hu';
  languageChanged = new Subject<string>();
  languageVariants = {
    'en': ['en'],
    'hu': ['hu']
  };

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async use(language: string): Promise<void> {
    console.log('TranslateService, use:', language);
    try {
      const storedLanguage = await this.storage.get('lang');
      console.log('TranslateService, stored language:', storedLanguage);
      const deviceLanguage = this.getDeviceLanguage();
      await this.fetchTranslation(language || storedLanguage || deviceLanguage || this.defaultLanguage);
      await this.storage.set('lang', this.selectedLanguage);
      this.languageChanged.next(this.selectedLanguage);
    } catch (error) {
      console.log('TranslateService, error:', error);
      await this.use(this.defaultLanguage);
    }
  }

  get(): string {
    return this.selectedLanguage;
  }

  private async fetchTranslation(lang: string) {
    console.log('TranslateService, fetching:', lang);
    const jsonPath = `assets/i18n/${lang}.json`;
    const translation = await this.http.get<{}>(jsonPath).pipe(take(1)).toPromise();
    this.translation = translation;
    this.selectedLanguage = lang;
  }

  private getDeviceLanguage(): string | undefined {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined;
    }
    let deviceLanguage: any = window.navigator.languages ? window.navigator.languages[0] : null;
    deviceLanguage = deviceLanguage || window.navigator.language;
    if (typeof deviceLanguage === 'undefined') {
      return undefined
    }
    if (deviceLanguage.indexOf('-') !== -1) {
      deviceLanguage = deviceLanguage.split('-')[0];
    }
    if (deviceLanguage.indexOf('_') !== -1) {
      deviceLanguage = deviceLanguage.split('_')[0];
    }
    console.log('TranslateService, device language:', deviceLanguage);
    for (const [key, value] of Object.entries(this.languageVariants)) {
      if (value.includes(deviceLanguage)) {
        deviceLanguage = key;
        break;
      }
    }
    return deviceLanguage;
  }
}