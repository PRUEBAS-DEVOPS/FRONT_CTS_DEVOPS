import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataUser, MenuViewModel, SedeViewModel, UsuarioModel } from '../../models/LoginModel/Login.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.urlApi;// 'https://localhost:44362/Api';

  headers= new HttpHeaders();
  constructor(private http:HttpClient) {
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", "Bearer "+ sessionStorage.getItem('Token'));
  }

  logout(){
  }

  async login( usuario: UsuarioModel ):Promise<any>{
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await this.http.post(`${ this.url+'Login' }`,usuario,{headers:reqHeaders}).toPromise();
  }

  async generarToken(usuario){
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await this.http.post(`${ this.url+'Login?User='+ usuario}`,usuario,{headers:reqHeaders}).toPromise();
  }

  async ConsultarMenuUsuario(Entitieusuario: UsuarioModel): Promise<MenuViewModel[]>{
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await this.http.post<MenuViewModel[]>(`${ this.url+'Menu'}`,Entitieusuario,{headers:reqHeaders}).toPromise();
  }

 async PermisosModulesUser(user){
  const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  return await this.http.get(`${ this.url+'Menu?user='+ user}`,{headers:this.headers}).toPromise();
 }

  async ConsultarSedeId(idsede): Promise<SedeViewModel[]>{
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await this.http.get<SedeViewModel[]>(`${ this.url+'Sede?id='+ idsede}`,{headers:reqHeaders}).toPromise();
  }


  async ConsultarFecha(usuario){
    return await  this.http.get(`${ this.url+'Login?user='+ usuario}`,{headers:this.headers}).toPromise();
  }

  async SaveUpdatePassword(usuario: UsuarioModel){
    return await this.http.put(`${ this.url+'Login'}`,usuario,{headers:this.headers}).toPromise();
  }

  async ConsultarMenu(): Promise<MenuViewModel[]>{
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await this.http.get<MenuViewModel[]>(`${ this.url+'Menu'}`,{headers:reqHeaders}).toPromise();
  }

 async  CorreoRecuperacionContrasena(email: any):Promise<any>{
    return await this.http.post(`${ this.url+'Login?email='+ email}`,{headers:this.headers}).toPromise();
  }

  async CargarDatosUsuario(nombreusuario:any):Promise<DataUser[]>{
    const reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await this.http.get<DataUser[]>(`${ this.url+'Login?usuario='+nombreusuario}`,{headers:reqHeaders}).toPromise();
  }

}
