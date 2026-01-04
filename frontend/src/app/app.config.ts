
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
<<<<<<< HEAD


export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes)]
=======
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
>>>>>>> ade856f66af0965719114f0e6521c8fe9b1d968c
};
