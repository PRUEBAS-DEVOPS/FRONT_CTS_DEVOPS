
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

const auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth_token}`,
});

@Injectable({
    providedIn: 'root',
})

export class AbonoService {
    private url = environment.urlApi;
    constructor(private http: HttpClient) { }


    async CrearAbonos(Data): Promise<any> {
        return await this.http.post(`${this.url + 'Abonos/CrearAbonos'}`, Data, { headers: Reqheaders }).toPromise();
    }

    async ListarAbonos(): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'Abonos/ConsultarAbonos'}`, { headers: Reqheaders }).toPromise();
    }

    async ConsultarConceptos(): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'Abonos/ConsultarConceptos'}`, { headers: Reqheaders }).toPromise();
    }

   async ConsultarAbonosCategoria(entidad, plan, fechaIni, fechaFin, tipoDocumento, documento, categoria): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'Abonos/ConsultarAbonosCategorias?entidad='+`${entidad}`+'&plan='+`${plan}`
        +'&fechaIni='+`${fechaIni}`+'&fechaFin='+`${fechaFin}`+'&tipoDocumento='+`${tipoDocumento}`+'&documento='+`${documento}`+'&categoria='+`${categoria}`}`, { headers: Reqheaders }).toPromise();
    }

    async CrearAnulacionAbono(dataAnulacion): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Abonos/CrearAnulacion'}`,dataAnulacion, { headers: Reqheaders }).toPromise();
    }

    async ConsultarMovimientos(IdAbono): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'Abonos/ConsultarMovimientosAbono?IdAbono='+`${IdAbono}`}`, { headers: Reqheaders }).toPromise();
    }
}