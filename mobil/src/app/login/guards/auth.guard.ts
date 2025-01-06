import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private auth: AuthService,
    private roleService: RoleService
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const roles: string[] = next.data.roles as string[];
    const user = await this.auth.currentUserObservable().pipe(take(1)).toPromise();
    let canActivate = false;
    if (user) {
      if (roles?.length > 0) {
        const role = await this.roleService.getRoleByUser(user);
        if (roles.includes(role?.code)) {
          canActivate = true;
        }
      }
      // if (!canActivate) { this.logger.showToast(this.translate.transform('YOU_HAVE_NO_PERMISSION')); }
    }
    if (!canActivate) {
      if (user) {
        this.router.navigate(['main/about']);
      } else {
        this.router.navigate(['login']);
      }
    }
    return canActivate;
  }

  async canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(next, state);
  }
}