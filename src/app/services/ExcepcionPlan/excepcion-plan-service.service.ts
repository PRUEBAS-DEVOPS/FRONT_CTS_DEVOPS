import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`,
});


@Injectable({
  providedIn: 'root'
})
export class ExcepcionPlanServiceService {
  constructor(private http: HttpClient) { }
  private url = environment.urlApi;


  async crearExcepcion(Excepcion: any): Promise<any> {
    return await this.http.post(`${this.url + 'ExceptionPlans'}`, Excepcion, { headers: Reqheaders }).toPromise();
  }
  
  async ListarExcepciones(): Promise<any[]> {
    return await this.http.get<any[]>(`${this.url + 'ExceptionPlans'}`, { headers: Reqheaders }).toPromise();
  }

  async CrearExcepcionDetalle(id,idexamen, valor, idusuario, activo,idPlan): Promise<any> {
    return await this.http.post(`${this.url + 'ExceptionPlans?Id=' + id +'&examen='+idexamen+ '&valor=' + valor +
      '&idusurio=' + idusuario + '&activo=' + activo+'&idPlan='+idPlan}`, idexamen, { headers: Reqheaders }).toPromise();
  }

  async ListarExamenesDetalle(Idusuario: any,idplan:any,idexcepcion:any): Promise<any[]> {
    return await this.http.get<any[]>(`${this.url + 'ExceptionPlans?idusuario=' + Idusuario+ '&idplan='+idplan
                                        + '&idexcepcion='+idexcepcion}`, { headers: Reqheaders }).toPromise();
  }

  async EliminarDatosDetalle(id: any, bandera: any, Idusuario: any, activo): Promise<any> {
    return await this.http.delete(`${this.url + 'ExceptionPlans?Id=' + id + '&bandera=' + bandera + '&IdUsuario=' + Idusuario +'&activo='+activo}`, { headers: Reqheaders }).toPromise();
  }

  async ValidarPlan(id: any): Promise<any> {
    return await this.http.get(`${this.url + 'ExceptionPlans/ValidarPlansExcepcion?idPlan=' + id}`, { headers: Reqheaders }).toPromise();
  }

}
