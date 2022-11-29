import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CrearPerfil } from '../../models/CreacionPerfil/CrearPerfil.model';
import { CrearUsuario } from '../../models/CrearUsuarioModel/CrearUsuario.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root'
})
export class PerfilesAccesoService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) { }
  Perfiles(perfiles: CrearPerfil) {
    return this.http.post(`${this.url + 'AssignmentModules'}`, perfiles, {
      headers: Reqheaders,
    });
  }

  PerfilesUsuario(PerfilUsuario: CrearUsuario) {
    return this.http.put(`${this.url + 'AssignmentModules'}`, PerfilUsuario, {
      headers: Reqheaders,
    });
  }
}
