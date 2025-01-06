import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainPage } from './main.page';
import { TranslateModule } from '../shared/translate/translate.module';
import { AuthGuard } from '../login/guards/auth.guard';
const routes: Routes = [
  { path: 'main', redirectTo: 'main/new-inspection', pathMatch: 'full' },
  {
    path: 'main',
    component: MainPage,
    children: [
      /* { path: 'videotest', loadChildren: () => import('../videotest/videotest.module').then(m => m.VideotestPageModule), data: { roles: ['admin'] } },
      { path: 'new-inspection', loadChildren: () => import('../new-inspection/new-inspection.module').then(m => m.NewInspectionPageModule), data: { roles: ['inspector', 'admin'] } },
      { path: 'inspection/:id', loadChildren: () => import('../inspection/inspection.module').then(m => m.InspectionPageModule), data: { roles: ['inspector', 'admin'] } },
      { path: 'inspections', loadChildren: () => import('../inspections/inspections.module').then(m => m.InspectionsPageModule), data: { roles: ['inspector', 'admin'] } },
      { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule), data: { roles: ['inspector', 'admin'] } },
      { path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule), data: { roles: ['inspector', 'admin', 'user'] } } */
    ],
    canActivateChild: [AuthGuard]
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  providers: [],
  declarations: [MainPage]
})
export class MainPageModule { }