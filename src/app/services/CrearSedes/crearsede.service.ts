import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SedeViewModel } from 'src/app/models/LoginModel/Login.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root'
})
export class CrearsedeService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';


  constructor(private http: HttpClient) {}

  crearsede(sede: SedeViewModel) {
    return this.http.post(`${this.url + 'Sede'}`, sede, {headers: Reqheaders});
  }

  async getAllsede(): Promise<SedeViewModel[]> {
    return await this.http.get<SedeViewModel[]>(`${this.url + 'Sede'}`, {headers: Reqheaders}).toPromise();
  }

  DetallSedeAll(id): Observable<SedeViewModel[]> {
    return this.http.get<SedeViewModel[]>(`${this.url + 'Sede?id=' + id}`, {headers: Reqheaders});
  }

  inactivarSede(sede: SedeViewModel) {
    return this.http.delete(`${this.url + 'Sede?id=' + sede.id + '&activo=' + sede.activo}`,{headers: Reqheaders,}
    );
  }

  UpdateSede(sede: SedeViewModel) {
    return this.http.put(`${this.url + 'Sede'}`, sede, {headers: Reqheaders});
  }
}
