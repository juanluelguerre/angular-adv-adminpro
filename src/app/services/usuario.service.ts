import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, delay, map, tap } from 'rxjs/operators'
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form-interfaces';
import { CargarUsuario } from '../interfaces/cargar-usuarios-interfaces';
import { Usuario } from '../models/usuario.model';
import { rawListeners } from 'process';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {

    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '401660663809-ibbt5gsgkjueabmsaoj2s70l78udpd7h.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers)
      .pipe(
        map((resp: any) => {
          console.log(resp);

          const { email, google, nombre, role, img = '', uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

          // LEARN: Explanation about how we need a new Usuario instance instead of  this.usuario = resp.usuario;
          // this.usuario.imprimirUsuario();

          this.guardarLocalStorage(resp.token, resp.menu);

          return true;
        }),
        // map(resp => true), // rxjs/operator
        // catchError(error => of(false))
        catchError(error => throwError(error))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        }),
        map(resp => true), // rxjs/operator
        // catchError(error => of(false))
        catchError(error => throwError(error))
      );
  }

  // TODO: Improve using interface !!!
  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('menu', resp.menu);
        })
      );
  }

  loginGoogle(token) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      );
  }

  cargarUsuarios(desde: number = 0) {

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        // delay(5000), -> sample to simulate loading ....
        map(resp => {
          const usuarios = resp.usuarios.map(u => new Usuario(u.nombre, u.email, '', u.img, u.google, u.role, u.uid));
          return {
            total: resp.total,
            usuarios
          }
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {

    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers)
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);

  }
}
