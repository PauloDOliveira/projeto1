import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

//     constructor(private router: Router, private afAuth: AngularFireAuth) {}

//     canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//       return this.afAuth.user.pipe(
//         take(1),
//         map(user => !!user),
//         tap(usuarioLogado => {
//           if (!usuarioLogado) {
//             this.router.navigate(['/login']);
//           }
//         })
//       )
//     }

// }

constructor( private authService: AuthService,
  private router: Router ) { }

  canActivate(): Promise<boolean> {
return new Promise(resolve => {
this.authService.getAuth().onAuthStateChanged(user => {
if (!user) this.router.navigate(['login']);
resolve(user ? true : false);
})
});
}

}
