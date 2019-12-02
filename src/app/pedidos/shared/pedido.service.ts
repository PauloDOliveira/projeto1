// import { CarrinhoService } from './carrinho.service';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { DatePipe } from '@angular/common';
// import { FirebasePath } from 'src/app/core/shared/firebase-path';
// import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { FirebasePath } from 'src/app/core/shared/firebase-path';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  [x: string]: any;

  public static TIPO_FORMA_PAGAMENTO = {
    DINHEIRO: 1,
    CARTAO: 2
  };

  public static STATUS = {
    ENVIADO: 0,
    CONFIRMADO: 1,
    SAIU_PARA_ENTREGA: 2,
    ENTREGUE: 3
  };
  pedidoService: any;
  dateFormat: any;

  // constructor(private db: AngularFireDatabase,
  //             private afAuth: AngularFireAuth,
  //             private carrinhoService: CarrinhoService,
  //             private dateFormat: DatePipe) { }

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth ) { }


gerarPedido(pedido: any) {
  return new Promise( (resolve, reject) => {
    const subscribe = this.pedidoService.getAll().subscribe(produtos => {
      subscribe.unsubscribe();

      const pedidoRef = this.criarObjetoPedido(pedido);
      const pedidoKey = this.db.createPushId();
      const pedidoPath = `${FirebasePath.PEDIDOS}${pedidoKey}`;

      let pedidoObj = {};
      pedidoObj[pedidoPath] = pedidoRef;

      produtos.forEach( (produto: any) => {
        const pedidoProdutoPath = `${FirebasePath.PEDIDOS_PRODUTOS}${pedidoKey}/${produto.produtoKey}`;
        pedidoObj[pedidoProdutoPath] = {
          produtoNome: produto.produtoNome,
          produtoDescricao: produto.produtoDescricao,
          observacao: produto.observacao,
          produtoPreco: produto.produtoPreco,
          quantidade: produto.quantidade,
          total: produto.total
        };
      });

      this.db.object('/').update(pedidoObj)
        .then(() => {
          this.pedidoService.clear()
            .then(() => resolve())
            .catch(() => reject ());
        })
        .catch( () => reject());
    });
  });
}

  private criarObjetoPedido(pedido: any) {
    const numeroPedido = '#' + this.dateFormat.transform(new Date(), 'ddMMyyyyHHmmss');
    const dataPedido = this.dateFormat.transform(new Date(), 'dd/MM/yyyy');
    let pedidoRef = {
      numero: numeroPedido,
      status: PedidoService.STATUS.ENVIADO,
      data: dataPedido,
      formPagamento: pedido.formPagamento,
      trocoPara: pedido.trocoPara,
      tipoCartao: pedido.tipoCartao,
      enderecoEntrega: pedido.enderecoEntrega,
      usuarioKey: this.afAuth.auth.currentUser.uid,
      usuarioNome: this.afAuth.auth.currentUser.displayName,
      // Tecnica para filtro de varios campos
      usuarioStatus: this.afAuth.auth.currentUser.uid + '_' + PedidoService.STATUS.ENVIADO,
      total: pedido.total
    }
    return pedidoRef;
  }

  getStatusNome(status: number) {
    switch (status){
      case PedidoService.STATUS.ENVIADO:
        return 'Aguardando confirmação';
      case PedidoService.STATUS.CONFIRMADO:
        return 'Em preparação';
      case PedidoService.STATUS.SAIU_PARA_ENTREGA:
        return 'Saiu para entregar';
      case PedidoService.STATUS.ENTREGUE:
        return 'Entregue';
    }
  }

  getFormaPagamentoNome(paymentType: number) {
    switch(paymentType){
      case PedidoService.TIPO_FORMA_PAGAMENTO.DINHEIRO:
        return 'Dinheiro';
      case PedidoService.TIPO_FORMA_PAGAMENTO.CARTAO:
        return 'Cartão';
    }
  }

  getAll() {
    return this.db.list(FirebasePath.PEDIDOS,
      q => q.orderByChild('usuarioKey').endAt(this.afAuth.auth.currentUser.uid))
      .snapshotChanges().pipe(
        map(changes => {
          return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }))
        })
      )
  }

  getAllAbertos() {
    const usuarioStatus = this.afAuth.auth.currentUser.uid + '_' + PedidoService.STATUS.SAIU_PARA_ENTREGA;
    return this.db.list(FirebasePath.PEDIDOS,
      q => q.orderByChild('usuarioStatus').endAt(usuarioStatus))
      .snapshotChanges().pipe(
        map (changes => {
          return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }))
        })
      )
  }

  getAllProdutos(key: string) {
    const path = `${FirebasePath.PEDIDOS_PRODUTOS}${key}`;
    return this.db.list(path).snapshotChanges().pipe(
      map(changes => {
        return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }))
      })
    )
  }

  //carrinho

  getPedidoProdutosRef(){
    const path = `${FirebasePath.PEDIDOS}${this.afAuth.auth.currentUser.uid}/${FirebasePath.PEDIDOS}`;
    return this.db.list(path);
  }

  insert(itemProduto: any){
   return this.getPedidoProdutosRef().push(itemProduto);

 }

//  carrinhoPossuiItens(){
//    return this.getPedidoRef().snapshotChanges().pipe(map(changes => {
//      return changes.length > 0;
//    }))
//  }

 calcularTotal(preco: number, quantidade: number){ 
   return preco * quantidade;

 }

 update(key: string, quantidade: number, total: number){
   return this.getPedidoRef().update(key, {quantidade: quantidade, total: total})

 }

 remove(key: string) {
   return this.getPedidoRef().remove(key);
 }

 getAllPedido() {
  return this.getPedidoProdutosRef().snapshotChanges().pipe(
   map(changes => {
     return changes.map(m => ({key: m.payload.key, ...m.payload.val() }));
   })
  )
 }

 getTotalPedido() {
   return this.getPedidoProdutosRef().snapshotChanges().pipe(
     map(changes =>{
       return changes
       .map( (m: any) => (m.payload.val().total ))
       .reduce( (prev: number, current: number) => {
         return prev + current;
       });
     })
   );

 }

//  clear(){
//  return this.getCarrinhoProdutosRef().remove();
//  }

}






