import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    // Refresh images after a new image has been updated !
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100) /* wait for a while to load image */
      )
      .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
      });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos', termino)
      .subscribe(result => {

        this.medicos = result;

      });
  }

  borrarMedico(medico: Medico) {
    console.log(medico);
    Swal.fire({
      title: '¿Borrar Médico?',
      text: `Va a borrar a ${medico.nombre} con id ${medico._id}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id)
          .subscribe(resp => {

            // TODO: Review to improve it. I so we have to take in our account the Pagination
            this.cargarMedicos();

            Swal.fire(
              'Médico borrado',
              `${medico.nombre} eliminado correctamente`,
              'success'
            );
          });
      }
    });
  }
}
