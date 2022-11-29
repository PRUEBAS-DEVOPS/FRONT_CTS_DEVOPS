import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { cotizaciones } from 'src/app/models/cotizacion/cotizacion.model';
import { environment } from 'src/environments/environment.prod';

const auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private url = environment.urlApi;
  constructor(private http: HttpClient) {}

  CrearCotizacion(cotiza: cotizaciones) {
    return this.http.post(`${this.url + 'Quotation'}`, cotiza, {
      headers: Reqheaders,
    });
  }

  ConsultarCotizacion( fechaIni:any , fechafin:any , asesor: any ): Observable<cotizaciones[]> {
     return this.http.get<cotizaciones[]>
     (`${this.url + 'Quotation?fechaIni=' + fechaIni +  '&fechafin=' + fechafin + '&asesor=' + asesor }`, {
        headers: Reqheaders,
      }
    );
  }

  DetalleCotizacion(IdCotizacion): Observable<cotizaciones[]> {
    return this.http.get<cotizaciones[]>(`${this.url + 'Quotation?IdCotizacion=' + IdCotizacion}`, { headers: Reqheaders });
  }

  GenerarExcel(fechaiini, fechafin, asesor) {
    return this.http.post(`${this.url + 'Quotation?fechaIni=' + fechaiini + '&fechafin=' + fechafin + '&asesor=' + asesor}` ,fechaiini, { headers: Reqheaders});
  }

  EnviarEmailCotizacion(correo:any,idcotizacion:number):Promise<any>{
    return this.http.post(`${this.url + 'Quotation?correo=' + correo + '&idCotizacion=' + idcotizacion}` ,correo, { headers: Reqheaders}).toPromise();
  }

  async actualizarCantidad(id,cantidad,total){
    return await this.http.put(`${this.url + 'Quotation?Id=' + id + '&cantidad=' + cantidad+ '&total=' + total}` ,cantidad, { headers: Reqheaders}).toPromise();
  }
  
  async GenerarPDF(usuario,plan):Promise<any>{
    return await this.http.post(`${this.url + 'Quotation?usuario=' + usuario + '&plan=' + plan}` ,plan, { headers: Reqheaders}).toPromise();
  }
  
  async GenerarPDFHistorial(idcotizacion):Promise<any>{
    return await this.http.post(`${this.url + 'Quotation?IdCotizacion=' + idcotizacion}` ,idcotizacion, { headers: Reqheaders}).toPromise();
  }

  async actualizarCantidadCotizacion(id,cantidad){
    return await this.http.put(`${this.url + 'Quotation?Id=' + id + '&cantidad=' + cantidad}` ,cantidad, { headers: Reqheaders}).toPromise();
  }
  
}
