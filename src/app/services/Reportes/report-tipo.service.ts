import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root'
})
export class ReportTipoService {

  constructor(private http: HttpClient) { }
  private url = environment.urlApi;


  async ConsultarReporte(fecha, tipo): Promise<any> {
    return await this.http.post(`${this.url + 'Reports?Tiporeport=' + tipo + '&fecha=' + fecha}`, fecha, { headers: Reqheaders }).toPromise();
  }

}
