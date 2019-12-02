import { SharedModule } from 'src/app/core/shared/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ListaItemPedidoPage } from './lista-item-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ListaItemPedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaItemPedidoPage]
})
export class ListaItemPedidoPageModule {}
