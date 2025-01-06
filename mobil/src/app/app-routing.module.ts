import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './login/guards/auth.guard';
import { LoginPage } from './login/login.page';
const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./main/main.module').then(m => m.MainPageModule), canActivate: [AuthGuard], data: { roles: ['inspector', 'admin', 'user'] } },
  { path: 'login', component: LoginPage, data: { title: 'Bejelentkezés' } },
  { path: 'login/:routeTo', component: LoginPage, data: { title: 'Bejelentkezés' } },
  /* { path: 'register', component: RegisterPage, data: { title: 'Regisztráció' } }, */
  { path: '**', redirectTo: 'main' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }