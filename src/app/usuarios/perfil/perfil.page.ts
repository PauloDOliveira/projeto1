import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../shared/usuarios.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user: any = {};

  constructor(private usuariosService: UsuariosService, 
    private afAuth: AngularFireAuth, 
    private router: Router) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (!user) {
        // this.toast.show('É necessário efetuar Login ou Criar uma conta !!!');
        this.router.navigate(['/login'])
      } else {
        this.user = this.usuariosService.getDadosUsuario();

      }
    })
  }


  sair() {
    this.usuariosService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
  }


}
