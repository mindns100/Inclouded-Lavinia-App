import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../login/services/auth.service';
import { RoleService } from '../login/services/role.service';
import { LoggerService } from '../shared/services/logger.service';

@Component({
  selector: 'main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  sub: Subscription;
  role: any;
  public appPages = [
    /* {
      title: 'VIDEO_TEST',
      url: '/main/videotest',
      icon: 'film',
      roles: ['admin'],
      hidden: true
    },
    {
      title: 'INSPECTION',
      url: '/main/new-inspection',
      icon: 'camera',
      roles: ['inspector', 'admin'],
      hidden: true
    },
    {
      title: 'INSPECTIONS',
      url: '/main/inspections',
      icon: 'list',
      roles: ['inspector', 'admin'],
      hidden: true
    },
    {
      title: 'SETTINGS',
      url: '/main/settings',
      icon: 'settings',
      roles: ['inspector', 'admin'],
      hidden: true
    },
    {
      title: 'ABOUT',
      url: '/main/about',
      icon: 'information',
      roles: ['inspector', 'admin', 'user'],
      hidden: true
    } */
  ];

  constructor(
    /* private auth: AuthService,
    private roleService: RoleService,
    private logger: LoggerService */
  ) { }

  async ngOnInit() {
    /* try {
      const user = await this.auth.currentUserObservable().pipe(take(1)).toPromise();
      this.role = await this.roleService.getRoleByUser(user);
      this.appPages = this.appPages.map(item => {
        if (item.roles?.includes(this.role?.code)) {
          item.hidden = false;
        }
        return item;
      });
    } catch (error) {
      this.logger.handleError(error);
    } */
  }


  async logout() {
    /* await this.auth.logout();
    window.location.href = 'login'; */
  }
}
