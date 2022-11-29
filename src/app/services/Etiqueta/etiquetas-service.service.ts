import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root',
})
export class EtiquetasServiceService {
  constructor(private http: HttpClient) {}

  private url = environment.urlApi; // 'https://localhost:44362/Api';

  async ConsultarEtiquetas(
    fechaIni, fechaFin, NSolicitud, NFactura, documento ): Promise<any[]> {
      return await this.http
      .get<any[]>(`${this.url +'Etiquetas/ConsultarPacienteEtiqueta?fechaIni=' + fechaIni + '&fechaFin=' +
          fechaFin + '&nSolicitud=' + NSolicitud + '&nFactura=' + NFactura + '&documento=' + documento }`,
        { headers: Reqheaders }
      )
      .toPromise();
  }

  async ConsultarExamenIdVenta(idVenta) : Promise<any[]> {
    return await this.http.get<any[]>(`${this.url +'Etiquetas/ConsultarExamenTipoMuestra?idVenta=' + idVenta}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultarMuestraVenta(idVenta,proceso) : Promise<any[]> {
    return await this.http.get<any[]>(`${this.url +'Etiquetas/ConsultarMuestraVenta?idVenta=' + idVenta+'&proceso='+proceso}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultarProcedimientosEtiquetas(objeto : any) : Promise<any[]> {
    return await this.http.post<any[]>(`${this.url +'Etiquetas/ConsultarProcedimientosEtiquetas'}`, objeto, { headers: Reqheaders }).toPromise();
  }
}
