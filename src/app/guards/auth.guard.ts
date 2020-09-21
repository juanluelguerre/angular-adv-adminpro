import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor (private ususarioService: UsuarioService, private router: Router){

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      
      return this.ususarioService.validarToken()
      .pipe(
        tap ( isAuthenticated => {
          if ( !isAuthenticated ) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
}
