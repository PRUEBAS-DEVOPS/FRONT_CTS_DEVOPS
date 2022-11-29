import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});


@Injectable({
  providedIn: 'root'
})
export class ServiceResultadosService {
  private url = environment.urlApi;
  constructor(private http: HttpClient) { }


  ConsultarLogResultados(tipoDoc:any,documento: any,fechaIniRec:any,fechaFinRec:any): Observable<any[]> {
    try {
      return this.http.get<any[]>(`${this.url + 'ReceptionResults?tipoDoc=' + tipoDoc 
                                              +'&documento='+documento + '&fechaIniRec='+fechaIniRec + '&fechaFinRec='+fechaFinRec}`, { headers: Reqheaders, });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'La información no se pudo consultar, por favor intente de nuevo',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  }

  ConsultarResultados(filtro: any): Promise<any[]> {  
      return this.http.post<any[]>(`${this.url + 'ReceptionResults'}`, filtro, { headers: Reqheaders, }).toPromise();
  }

  ObtenerBase64Resultados(idresultado: any): Promise<any[]> {  
    return this.http.post<any[]>(`${this.url + 'ReceptionResults?Idresultado='+ idresultado}`, idresultado, { headers: Reqheaders, }).toPromise();
}

  ConsultarHistorialEnvios(idResultado: number): Observable<any[]> {
    try {
      return this.http.get<any[]>(`${this.url + 'ReceptionResults?idResultado=' + idResultado}`, { headers: Reqheaders, });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'La información no se pudo consultar, por favor intente de nuevo',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  }

  EnvioNotificacionResultados(idResultado: any, correoEnvio: any, documento: any, nombres: any, tipo: any) {
    try {
      return this.http.post<any[]>(`${this.url + 'ReceptionResults?idResultado=' + idResultado +
        '&CorreoEnvio=' + correoEnvio + '&documento=' + documento +
        '&nombres=' + nombres + '&tipo=' + tipo}`, documento, { headers: Reqheaders, });
    }
    catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'La información no se pudo consultar, por favor intente de nuevo',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  }

  ValidarResultados():Promise<any>{
    return this.http.get<any[]>(`${this.url + 'ReceptionResults'}`, { headers: Reqheaders, }).toPromise();
  }

  ConsultarDetalleResultados(idresultado: number, idsolicitud: number): Observable<any[]> {
    try {
      return this.http.get<any[]>(`${this.url + 'ReceptionResults?idResultado=' + idresultado + '&idSolicitud=' + idsolicitud}`, { headers: Reqheaders, });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'La información no se pudo consultar, por favor intente de nuevo',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  }

}
