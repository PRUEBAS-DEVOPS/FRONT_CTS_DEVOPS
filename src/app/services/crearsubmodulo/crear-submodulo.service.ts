import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { crearSubModulo } from '../../models/CreacionModulo/Creacionmodulo.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`
});

@Injectable({
  providedIn: 'root'
})
export class CrearSubmoduloService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) { }

  crearSubModulo(subModulo: crearSubModulo) {
    return this.http.post(`${this.url + 'SubModules'}`, subModulo, { headers: Reqheaders });
  }

  getAllSubModule(): Observable<crearSubModulo[]> {
    return this.http.get<crearSubModulo[]>(`${this.url + 'SubModules'}`, { headers: Reqheaders });
  }

  DetallAllSubModule(id): Observable<crearSubModulo[]> {
    return this.http.get<crearSubModulo[]>(`${this.url + 'SubModules?id=' + id}`, { headers: Reqheaders });
  }

  inactivarSubmodulo(subModulo: crearSubModulo) {
    return this.http.delete(`${this.url + 'SubModules?id=' + subModulo.id + '&activo=' + subModulo.Activo}`, { headers: Reqheaders });
  }

  UpdateModule(subModulo: crearSubModulo) {
    return this.http.put(`${this.url + 'SubModules'}`, subModulo, { headers: Reqheaders });
  }
}
