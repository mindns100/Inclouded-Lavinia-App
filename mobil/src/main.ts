import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
if (environment.production) {
  enableProdMode();
  // HACK: Don't log to console in production environment.
  if (window) {
    window.console.log = window.console.warn = window.console.info = function () { };
  }
}
platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error(error));
