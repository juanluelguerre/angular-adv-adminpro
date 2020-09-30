import { compileNgModule } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  private imgSubs: Subscription;
  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public hospitalesTemp: Hospital[] = [];

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();

    // Refresh images after a new image has been updated !
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100) /* wait for a while to load image */
      )
      .subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
      });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Nuevo hospital',
      text: 'Introduzca el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre hospital',
      showCancelButton: true,
    })

    if (value.trim().length) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          // this.cargarHospitales();
          this.hospitales.push(resp.hospital);
        });
    }

    console.log(value);
    // if (url) {
    //   Swal.fire(`Entered URL: ${url}`)
    // }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      // return this.hospitales = this.hospitalesTemp;
      return this.cargarHospitales();
    }

    this.busquedaService.buscar('hospitales', termino)
      .subscribe(result => {

        this.hospitales = result;

      });
  }
}
