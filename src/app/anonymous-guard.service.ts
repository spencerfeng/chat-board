import {CanActivate} from '@angular/router';
import {AuthService} from './auth/auth.service';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AnonymousGuard implements CanActivate {

  constructor (
    private authService: AuthService,
    private route: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated()
      .map(isAuthenticated => {
        if (isAuthenticated) {
          this.route.navigateByUrl('/messages');
        }
        return !isAuthenticated;
      });
  }

}
