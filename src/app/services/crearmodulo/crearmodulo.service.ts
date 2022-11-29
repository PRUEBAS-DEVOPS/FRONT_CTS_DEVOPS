import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { crearModulo } from '../../models/CreacionModulo/Creacionmodulo.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root',
})
export class CrearmoduloService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) {}

  crearmodulo(Modulo: crearModulo) {
    return this.http.post(`${this.url + 'Modules'}`, Modulo, {
      headers: Reqheaders,
    });
  }

  getAllModule(): Observable<crearModulo[]> {
    return this.http.get<crearModulo[]>(`${this.url + 'Modules'}`, {
      headers: Reqheaders,
    });
  }

  DetallUserAll(id): Observable<crearModulo[]> {
    return this.http.get<crearModulo[]>(`${this.url + 'Modules?id=' + id}`, {
      headers: Reqheaders,
    });
  }

  inactivarModulo(Modulo: crearModulo) {
    return this.http.delete(
      `${this.url + 'Modules?id=' + Modulo.id + '&activo=' + Modulo.activo}`,
      {
        headers: Reqheaders,
      }
    );
  }
  UpdateModule(Module: crearModulo) {
    return this.http.put(`${this.url + 'Modules'}`, Module, {
      headers: Reqheaders,
    });
  }
}