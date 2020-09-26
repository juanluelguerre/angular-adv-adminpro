import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public imgSubs: Subscription;
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100) /* wait for a while to load image */
      )
      .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;

        this.cargando = false;
      })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar('usuarios', termino)
      .subscribe(result => {

        this.usuarios = result;

      });
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'Usuario actual no puede ser borrado∫');
    }

    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Va a borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {

            // TODO: Review to improve it. I so we have to take in our account the Pagination
            this.cargarUsuarios();

            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} eliminado correctamente`,
              'success'
            );
          });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {

        console.log(resp);

      })
  }


  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
