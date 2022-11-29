import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearUsuario } from '../../models/CrearUsuarioModel/CrearUsuario.model';
import { SedeViewModel } from 'src/app/models/LoginModel/Login.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`
});

@Injectable({
  providedIn: 'root'
})
export class CrearusuarioService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) { }

  async CrearUsuario(usuario: CrearUsuario):Promise<any> {
    return await  this.http.post(`${this.url + 'User'}`, usuario, { headers: Reqheaders }).toPromise();
  }

  async ConsultarSedes(): Promise<SedeViewModel[]> {
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await this.http.get<SedeViewModel[]>(`${this.url + 'Sede'}`, { headers: reqHeaders }).toPromise();
  }

  SaveUSer(usuario: CrearUsuario) {
    return this.http.put(`${this.url + 'User'}`, usuario, { headers: Reqheaders });
  }

  PerfilesUsuario(PerfilUsuario: CrearUsuario) {
    return this.http.put(`${this.url + 'AssignmentModules'}`, PerfilUsuario, { headers: Reqheaders });
  }
}