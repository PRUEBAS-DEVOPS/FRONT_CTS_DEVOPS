import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pacientes } from '../../models/Preatencion/CrearPaciente.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) { }

  CrearPaciente(Pacientes: pacientes): Promise<any>  {
    return this.http.post(`${this.url + 'Paciente'}`, Pacientes, { headers: Reqheaders }).toPromise();
  }

  GetAllPaciente(): Observable<pacientes[]> {
    return this.http.get<pacientes[]>(`${this.url + 'Paciente'}`, { headers: Reqheaders });
  }

  async DetallPaciente(id, idtipodoc): Promise<pacientes[]> {
    return await this.http.get<pacientes[]>(
      `${this.url + 'Paciente?documento=' + id + '&Idtipodoc=' + idtipodoc}`, { headers: Reqheaders }).toPromise()
  }

  async UpdatePaciente(Pacientes: pacientes):Promise<any> {
    return await  this.http.put(`${this.url + 'Paciente'}`, Pacientes, { headers: Reqheaders }).toPromise();
  }

  async ConsultarEdad(fecha: any):Promise<any> {
    return await this.http.get(`${this.url + 'Paciente?fecha=' + fecha}`, { headers: Reqheaders, }).toPromise();
  }

  AsociarAcudiente(IdPac: any, IdAcu: any,idUsuario:any):Promise<any> {
    return this.http.post(`${this.url + 'Acudient?IdAcudiente=' + IdAcu + '&IdPaciente=' + IdPac + '&IdUsuario='+idUsuario}`,IdPac, { headers: Reqheaders, }).toPromise();
  }

  async ConsultarAcudiente(id): Promise<pacientes[]> {
    return await  this.http.get<pacientes[]>(`${this.url + 'Acudient?id=' + id}`, { headers: Reqheaders }).toPromise();
  }

  DesvincularAcudiente(IdPac: any) {
    return this.http.put(`${this.url + 'Acudient?IdPaciente=' + IdPac}`, IdPac, { headers: Reqheaders, });
  }

  async ConsultarDispacidades(): Promise<any[]> {
    return await this.http.get<any[]>(`${this.url + 'Paciente/ConsultarDiscapacidad'}`, { headers: Reqheaders }).toPromise();
  }

}
