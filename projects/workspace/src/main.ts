import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import {
  REMOVE_STYLES_ON_COMPONENT_DESTROY,
  BrowserModule,
  bootstrapApplication,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, FormsModule),
    { provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: false },
  ],
}).catch(err => console.error(err));
