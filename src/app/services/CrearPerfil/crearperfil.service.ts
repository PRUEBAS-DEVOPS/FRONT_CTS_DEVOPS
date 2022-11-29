import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearPerfil } from '../../models/CreacionPerfil/CrearPerfil.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`
});

@Injectable({
  providedIn: 'root'
})
export class CrearperfilService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) {}

  crearPerfil(perfil: CrearPerfil) {
    return this.http.post(`${this.url + 'Profile'}`, perfil, { headers: Reqheaders });
  }

    getAllPerfil(): Observable<CrearPerfil[]> {
    return this.http.get<CrearPerfil[]>(`${this.url + 'Profile'}`, {headers: Reqheaders,});
  }

  DetallPerfilAll(id): Observable<CrearPerfil[]> {
  return this.http.get<CrearPerfil[]>( `${this.url + 'Profile?id=' + id}`, { headers: Reqheaders });
  }
 
  inactivarPerfil(perfil: CrearPerfil) {
  return this.http.delete(`${this.url + 'Profile?id=' + perfil.id + '&activo=' + perfil.activo}`, {headers: Reqheaders,});
  }

  UpdatePerfil(perfil: CrearPerfil) {
  return this.http.put(`${this.url + 'Profile'}`, perfil, {headers: Reqheaders,});
  }

  Consultarsoloporperfil(id): Observable<CrearPerfil[]> {
    return this.http.get<CrearPerfil[]>(`${this.url + 'Menu?IdPerfil=' + id}`,{ headers: Reqheaders });
    }

  Perfiles(perfiles: CrearPerfil) {
    return this.http.post(`${this.url + 'AssignmentModules'}`, perfiles, {headers: Reqheaders,});
  }
}

