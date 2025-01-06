import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {MenuPage} from './menu.page';


@NgModule({
  declarations: [MenuPage],
  exports: [
    MenuPage
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class MenuPageModule { }
