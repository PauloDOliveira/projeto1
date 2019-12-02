import { ToastService } from './../../core/shared/toast.service';
import { PedidoService } from './../shared/pedido.service';
import { CarrinhoService } from './../shared/carrinho.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ListaEnderecoPage } from 'src/app/enderecos/lista-endereco/lista-endereco.page';

@Component({
  selector: 'app-form-pagamento',
  templateUrl: './form-pagamento.page.html',
  styleUrls: ['./form-pagamento.page.scss'],
})
export class FormPagamentoPage implements OnInit {
MENSAGEM_ENDERECO_VAZIO: string = "Escolha logo o endereco de entrega";
form: FormGroup;
produtos: Observable<any[]>;
total: number = 0;
formasPagamento: Array<any> = [
  {valor: PedidoService.TIPO_FORMA_PAGAMENTO.DINHEIRO, descricao: "Débito"},
  {valor: PedidoService.TIPO_FORMA_PAGAMENTO.CARTAO, descricao: "Crédito"}
            ]

  enderecoSelecionado: string = this.MENSAGEM_ENDERECO_VAZIO;

  constructor(
              private formBuilder: FormBuilder,
              private carrinhoService: CarrinhoService,
              private modalCtrl: ModalController,
              private pedidoService: PedidoService,
              private router: Router,
              private toast: ToastService
              ) { }
              
  ngOnInit() {
    this.criarFormulario();
    this.produtos = this.carrinhoService.getAll();
    const subscribe = this.carrinhoService.getTotalPedido().subscribe( (total:number) => {
      subscribe.unsubscribe();
      this.total = total;
      this.form.patchValue({ total:total });
    })
  }

  criarFormulario(){
    this.form = this.formBuilder.group ({
      formPagamento: [''],
      trocoPara: [''],
      tipoCartao: [''],
      enderecoEntrega: [''],
      total: ['']
    })
  }

  selecionarEndereco(){
    this.modalCtrl.create({
    component: ListaEnderecoPage,
    componentProps: {
    selecionarEndereco: true
    },
    showBackdrop: true,
    backdropDismiss: true
    }).then(modal => {
      modal.onDidDismiss().then(result => {
        if (result) {
          this.enderecoSelecionado = result.data.endereco;
        } else {
          this.enderecoSelecionado = this.MENSAGEM_ENDERECO_VAZIO;
        }
        this.form.patchValue({ enderecoEntrega: this.enderecoSelecionado });
      });

      modal.present();

       });

  }


  onSubmit(){
    if(this.form.valid){
      this.pedidoService.gerarPedido(this.form.value)
        .then( () => {
          this.toast.show(' Pedido realizado. Aguarde a confirmação! <br> Em até 24hs iremos te para fazer o agendamento.<br> Observe em "Sessões marcadas" a sua situação');
          this.router.navigate(['/tabs/produtos']);
        })
        .catch( () =>{
          this.toast.show('Erro ao salvar o pedido');
        });
      }
    }
  }

