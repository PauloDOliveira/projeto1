import { AngularFireAuth } from '@angular/fire/auth';
// import { CarrinhoService } from './../shared/carrinho.service';
import { ProdutosService } from './../../produtos/shared/produtos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/shared/toast.service';
import { PedidoService } from '../shared/pedido.service';

@Component({
  selector: 'app-form-item-pedido',
  templateUrl: './form-item-pedido.page.html',
  styleUrls: ['./form-item-pedido.page.scss'],
})
export class FormItemPedidoPage implements OnInit {
  produto: any = {}
  form: FormGroup;
  total: number = 0;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, private produtosService: ProdutosService,
    // private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService,
    private afAuth: AngularFireAuth,
    private toast: ToastService) { }

  ngOnInit() {
    this.criarFormulario();
    let key = this.route.snapshot.paramMap.get('key');
    if (key) {
      const subscribe = this.produtosService.getByKey(key).subscribe((produto: any) => {
        subscribe.unsubscribe();
        this.produto = produto;

        this.form.patchValue({
          produtoKey: produto.key,
          produtoNome: produto.nome,
          produtoDescricao: produto.descricao,
          produtoPreco: produto.preco,
          quantidade: 1,
        })
        this.executaCalcularTotal();

      })
    }

  }

  criarFormulario() {
    this.form = this.formBuilder.group({
      produtoKey: [''],
      produtoNome: [''],
      produtoDescricao: [''],
      produtoPreco: [''],
      quantidade: [''],
      observacao: [''],
      total: [''],
      data: ['DD/MM/YYYY'],
      hora: ['HH:mm'],
      telefone: [],
    })
  }


  executaCalcularTotal() {
    this.atualizaTotal(this.form.value.quantidade);
  }

  adicionarQuantidade() {
    let qtd = this.form.value.quantidade;
    qtd++;
    this.atualizaTotal(qtd);
  }

  removerQuantidade() {
    let qtd = this.form.value.quantidade;
    qtd--;
    if (qtd <= 0)
      qtd = 1;

    this.atualizaTotal(qtd);
  }

  atualizaTotal(quantidade: number) {
    this.total = this.produto.preco * quantidade;
    this.form.patchValue({ quantidade: quantidade, total: this.total });
  }

  onSubmit() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (!user) {
        this.toast.show('Efetue o Login');
        this.router.navigate(['/login'])
      } else {
        if (this.form.valid) {
          this.pedidoService.insert(this.form.value)
          // .then(() =>{this.toast.show('Produto Adicionado com sucesso ao carrinho');
          this.toast.show(' Pedido realizado. <br> Aguarde a confirmação em "Agenda" <br> ');
          this.router.navigate(['/tabs/home']);
        }
      }
    })

  }

}