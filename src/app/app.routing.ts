import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client/client.component';
import { ClientMainComponent } from './client/client-main/client-main.component';
import { AuthComponent } from './auth/auth.component';
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from './auth-guard.service';
import {AnonymousGuard} from './anonymous-guard.service';

const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/messages' },
  { path: 'auth', component: AuthComponent, children: [
    { path: 'signin', canActivate: [AnonymousGuard], component: SigninComponent },
    { path: 'signup', canActivate: [AnonymousGuard], component: SignupComponent }
    // { path: 'signin', component: SigninComponent },
    // { path: 'signup', component: SignupComponent }
  ]},
  { path: 'messages', canActivate: [AuthGuard], component: ClientComponent, children: [
    { path: ':id', component: ClientMainComponent }
  ]
  }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
