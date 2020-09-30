import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios(resultados: any[]) : Usuario[]{
  
    return resultados.map(
      u => new Usuario(u.nombre, u.email, '', u.img, u.google, u.role, u.uid) 
    );
  }

  private transformarHospitales(resultados: any[]) : Hospital[]{
  
    return resultados;
  }

  private transformarMedicos(resultados: any[]) : Medico[]{
  
    return resultados;
  }

  buscar(
    tipo: 'usuarios' | 'hospitales' | 'medicos',
    termino: string = '') {


    const url = `${base_url}/all/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( (resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);
            case 'hospitales':
              return this.transformarHospitales(resp.resultados);
              case 'medicos':
                return this.transformarMedicos(resp.resultados);                
            default:
              return[];
          }
        })
      );

  }
}
