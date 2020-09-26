import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  // Reactive Form !
  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp : any = null;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    // console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe( () => {
        
        // LEARN: In JavaScript every parameters are passed "By Ref", so when update this.usuario.xxx, the value is updated. 
        //        Observable could be another option, but in Angular,  (injection) all services are Singleton, so, same instance at time.
        const {nombre, email} = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios guardados', 'success');

    }, (err) => {
      Swal.fire('Error', err.error.msg, 'error');
    });
  }

  cambiarImagen(file: File) {
    // console.log(file);
    this.imagenSubir = file;

    if (!  file) {
      this.imgTemp = null;
      return;
    }
    
    // JavaScripñt
    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      
    }
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
    .then(img => { 
      this.usuario.img = img 
      Swal.fire('Guardado', 'Imagen actualizada', 'success');
    }).catch( err => {
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    })
  }

}
