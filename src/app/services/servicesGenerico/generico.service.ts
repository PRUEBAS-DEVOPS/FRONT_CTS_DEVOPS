import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  GenericTipoDoc, GenericEstadoCivil,
  GenericCity,
  GenericDepartament,
  GenericEstrato,
  GenericGenero,
  GenericCountry,
  GenericLacation,
  GenericTypeAfil,
  GenericBarrio,
  GenericEps,
  GenericCondition,
  Options
} from 'src/app/models/Generic/Generic.model';
import { environment } from 'src/environments/environment.prod';
import { CrearUsuario } from 'src/app/models/CrearUsuarioModel/CrearUsuario.model';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`,
});
@Injectable({
  providedIn: 'root',
})
export class GenericoService {
  private url = environment.urlApi;// 'https://localhost:44362/Api';

  constructor(private http: HttpClient) { }

 async ConsultarCiudades(id): Promise<GenericCity[]> {
    return await this.http.get<GenericCity[]>(`${this.url + 'Generic?idDepto=' + id}`, { headers: Reqheaders, }).toPromise();
  }

  ConsultarDepartamento(): Promise<GenericDepartament[]> {
    return this.http.get<GenericDepartament[]>(`${this.url + 'Generic'}`, { headers: Reqheaders }).toPromise();
  }

  Consultarlocalidad(id): Promise<GenericLacation[]> {
    return this.http.get<GenericLacation[]>(`${this.url + 'Generic?IdCiudad=' + id}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarBarrios(id): Promise<GenericBarrio[]> {
    return this.http.get<GenericBarrio[]>(`${this.url + 'Generic?IdLocalidad=' + id}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarTipoAfilicacion(): Promise<GenericTypeAfil[]> {
    return this.http.get<GenericTypeAfil[]>(`${this.url + 'Generic?bandera1=4'}`, { headers: Reqheaders }).toPromise();
  }

  Consultarestratos(): Promise<GenericEstrato[]> {
    return this.http.get<GenericEstrato[]>(`${this.url + 'Generic?bandera2=5'}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarGenero(): Promise<GenericGenero[]> {
    return this.http.get<GenericGenero[]>(`${this.url + 'Generic?bandera3=6'}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultarTipoDoc(): Promise<GenericTipoDoc[]> {
    return await  this.http.get<GenericTipoDoc[]>(`${this.url + 'Generic?bandera4=7'}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarestadoCivil(): Promise<GenericEstadoCivil[]> {
    return this.http.get<GenericEstadoCivil[]>(`${this.url + 'Generic?bandera5=8'}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarPaises(): Promise<GenericCountry[]> {
    return this.http.get<GenericCountry[]>(`${this.url + 'Generic?bandera6=9'}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarEps(): Promise<GenericEps[]> {
    return this.http.get<GenericEps[]>(`${this.url + 'Generic?bandera7=10'}`, { headers: Reqheaders }).toPromise();
  }

  consultarEstado(): Promise<GenericCondition[]> {
    return this.http.get<GenericCondition[]>(`${this.url + 'Generic?bandera8=11'}`, { headers: Reqheaders, }).toPromise();
  }

  ConsultarOpciones(IdCategoria:number): Promise<Options[]> {
    return this.http.get<Options[]>(`${this.url + 'Generic?id='+IdCategoria+ '&bandera9=12'}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarAsesores(): Promise<CrearUsuario[]> {
    return this.http.get<CrearUsuario[]>(`${this.url + 'Generic?bandera10=13'}`, { headers: Reqheaders }).toPromise();
  }


  inactivar(id: number, bandera: number, activo: number, idUsuario) {
    return this.http.delete(
      `${this.url + 'Generic?id=' + id + '&bandera=' + bandera + '&activo=' + activo+'&idUsuario=' + idUsuario}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultarUsuariosComercial(): Promise<any[]> {
    return await  this.http.get<any[]>(`${this.url + 'Generic/ConsultarUsuariosAsesorComercial?bandera12=15'}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultarOpcionesCovid(categoria,bandera): Promise<any[]>{
    return await  this.http.get<any[]>(`${this.url + 'Generic/ConsultarOpcionesCovid?categoria='+  `${categoria}`+'&bandera='+  `${bandera}`}`, { headers: Reqheaders }).toPromise();

  }

  ConsultarEstadoTransaccion(): Promise<GenericCondition[]> {
    return this.http.get<GenericCondition[]>(`${this.url + 'Generic/ConsultarEstadosTransaccion?bandera11=14'}`, { headers: Reqheaders }).toPromise();
  }

}

