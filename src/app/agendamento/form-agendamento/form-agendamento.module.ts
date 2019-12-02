import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormAgendamentoPage } from './form-agendamento.page';

const routes: Routes = [
  {
    path: '',
    component: FormAgendamentoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FormAgendamentoPage]
})
export class FormAgendamentoPageModule {}
