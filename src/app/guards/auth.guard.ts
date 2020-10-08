import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router, CanLoad, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor (private ususarioService: UsuarioService, private router: Router){

  }
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    
    return this.ususarioService.validarToken()
      .pipe(
        tap ( isAuthenticated => {
          if ( !isAuthenticated ) {
            this.router.navigateByUrl('/login');
          }
        })
      );
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
