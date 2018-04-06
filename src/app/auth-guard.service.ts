import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './auth/auth.service';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.hasToken()) {
      this.router.navigateByUrl('/auth/signin');
      return false;
    }

    return this.authService.isAuthenticated()
      .do(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth/signin');
        }
      });
  }

}
