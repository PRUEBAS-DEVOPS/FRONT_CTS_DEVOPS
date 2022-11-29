import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogSistema } from 'src/app/models/LogSistema/Log.model';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root'
})
export class LogSistemaService {
  private url = environment.urlApi;
  constructor(private http: HttpClient) { }

  async ConsultarLOG( fechaIni:any , fechafin:any , usuario: any ): Promise<LogSistema[]> {
    return this.http.get<LogSistema[]>
    (`${this.url + 'Audit?fechaIni=' + fechaIni +  '&fechafin=' + fechafin + '&usuario=' + usuario }`, {
       headers: Reqheaders,
     }
   ).toPromise();
 }

 async GenerarExcel(fechaiini, fechafin, asesor) {
  return await this.http.post(`${this.url + 'Audit?fechaIni=' + fechaiini + '&fechafin=' + fechafin + '&asesor=' + asesor}`, { headers: Reqheaders }).toPromise();
}

}
