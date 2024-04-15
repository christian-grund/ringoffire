import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ring-of-fire-ce158',
          appId: '1:241440440422:web:552020f8df317f4b8a2da7',
          storageBucket: 'ring-of-fire-ce158.appspot.com',
          apiKey: 'AIzaSyAMSgbyfYejAlSjr9J_HHqxiqIpP9_jB5g',
          authDomain: 'ring-of-fire-ce158.firebaseapp.com',
          messagingSenderId: '241440440422',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
