import { Injectable } from '@angular/core';
import { CrearUsuario } from '../../models/CrearUsuarioModel/CrearUsuario.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SedeViewModel } from 'src/app/models/LoginModel/Login.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root',
})

export class GestionUsuarioService {
  private urlgestion = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) { }

  getAllUser(): Promise<CrearUsuario[]> {
    return this.http.get<CrearUsuario[]>(`${this.urlgestion + 'User'}`, { headers: Reqheaders }).toPromise();
  }

  DetallUserAll(id): Observable<CrearUsuario[]> {
    return this.http.get<CrearUsuario[]>(`${this.urlgestion + 'User?id=' + id}`, { headers: Reqheaders });
  }

  inactivarUsuario(usuario: CrearUsuario) {
    return this.http.delete(`${this.urlgestion + 'User?id=' + usuario.id + '&activo=' + usuario.activo}`, { headers: Reqheaders });
  }

  async SedesPorUsuario(IdUsuario: any) {
    const Headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return await this.http.get<SedeViewModel[]>(`${this.urlgestion + 'Sede?idUsuario=' + IdUsuario}`, { headers: Headers }).toPromise();
  }
}
