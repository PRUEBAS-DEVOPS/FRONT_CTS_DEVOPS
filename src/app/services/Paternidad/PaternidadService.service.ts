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

export class PaternidadService {
    private url = environment.urlApi;
    constructor(private http: HttpClient) { }

    async Listartiposolicitud(): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'Paternidad'}`, { headers: Reqheaders }).toPromise();
    }

    async ListarParentesco(): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'Paternidad/Parentesco'}`, { headers: Reqheaders }).toPromise();
    }

    async CrearSolicitud(solicitud): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/CrearSolicitud'}`,solicitud, { headers: Reqheaders }).toPromise();
    }

    async CrearGrupoPaternidad(data): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/CrearGrupoPaternidad'}`,data, { headers: Reqheaders }).toPromise();
    }

    async ConsultarPacientesPaternidad(IdUsuario,idsolicitud): Promise<any> {
        return await this.http.get<any>(`${this.url + 'Paternidad/PacientesPaternidad?idUsuario='+`${IdUsuario}`+'&idsolicitud='+`${idsolicitud}`}`, { headers: Reqheaders }).toPromise();
    }

    async VentaPaternidad(datosVenta){
        return await this.http.post<any>(`${this.url + 'Paternidad/Ventas'}`,datosVenta, { headers: Reqheaders }).toPromise();
    }

    async ConsultarGestionSolicitudes(documento,fechaIni,fechaFin,noSolicitud,tipoDocumento,Nofactura): Promise<any> {
        return await this.http.get<any>(`${this.url + 'Paternidad/ConsultarGestionSolicitud?documento='+`${documento}`+'&fechaIni='+`${fechaIni}`
        +'&fechaFin='+`${fechaFin}` +'&noSolicitud='+`${noSolicitud}` +'&tipoDocumento='+`${tipoDocumento}`+'&Nofactura='+`${Nofactura}`}`, { headers: Reqheaders }).toPromise();
    }
    async ConsultarPacientesGestionSolicitud(idsolicitud): Promise<any> {
        return await this.http.get<any>(`${this.url + 'Paternidad/ConsultarPacientesSolicitud?idsolicitud='+`${idsolicitud}`}`, { headers: Reqheaders }).toPromise();
    }

    async ConsultarTipoMuestra(): Promise<any> {
        return await this.http.get<any>(`${this.url + 'Paternidad/ConsultarTipoMuestra'}`, { headers: Reqheaders }).toPromise();
    }

    async EliminarPacientesPaternidad(IdGrupo): Promise<any> {
        return await this.http.delete<any>(`${this.url + 'Paternidad/EliminarPacientes?idGrupo='+`${IdGrupo}`}`, { headers: Reqheaders }).toPromise();
    }

    async CrearResponsableFactura(dataResponsable): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/CrearResponsable'}`,dataResponsable, { headers: Reqheaders }).toPromise();
    }

    async ConsultarInfoCarga(documento,fechaIni,fechaFin,noSolicitud,procedimiento): Promise<any> {
        return await this.http.get<any>(`${this.url + 'Paternidad/ConsultarCargueResultados?documento='+`${documento}`+'&fechaIni='+`${fechaIni}`
        +'&fechaFin='+`${fechaFin}` +'&noSolicitud='+`${noSolicitud}` +'&procedimiento='+`${procedimiento}`}`, { headers: Reqheaders }).toPromise();
    }

    async CrearDocumentacion(data): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/CrearDocumentacion'}`,data, { headers: Reqheaders }).toPromise();
    }

    async CrearAnulacionSolicitud(dataAnulacion): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/CrearAnulacion'}`,dataAnulacion, { headers: Reqheaders }).toPromise();
    }

    async ConsultarResultados(fechaIni,fechaFin,noSolicitud,estado,idusuario): Promise<any> {
        return await this.http.get<any>(`${this.url + 'Paternidad/ConsultarDeResultados?fechaIni='+`${fechaIni}`
        +'&fechaFin='+`${fechaFin}` +'&noSolicitud='+`${noSolicitud}` +'&estado='+`${estado}` +'&idusuario='+`${idusuario}`}`, { headers: Reqheaders }).toPromise();
    }

    async ConsultarDocumento(idSolicitud,idusuario): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/GenerarReporte?idsolicitud='+`${idSolicitud}`+'&idusuario='+`${idusuario}`}`,'', { headers: Reqheaders }).toPromise();
    }

    async CargarConsentimiento(dataConsentimiento): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/CargarConsentimiento'}`,dataConsentimiento, { headers: Reqheaders }).toPromise();
    }
    async GenerarControlCambioMuestra(Datacambio): Promise<any> {
        return await this.http.post<any>(`${this.url + 'Paternidad/CambioMuestra'}`,Datacambio, { headers: Reqheaders }).toPromise();
    }

    async ConfirmarPagoDatafono(idtransaccion,idUser,IdSede,categoria):Promise<any>{
        return await this.http.post(`${this.url + 'Paternidad/ConfirmarPagoCredibanco?idtransaccion=' + idtransaccion + '&idUser=' + idUser+'&IdSede='+IdSede+'&categoria='+categoria}`, {headers: Reqheaders}).toPromise();
      }

      async ConsultarLogEnvios(idresultado): Promise<any> {
        return await this.http.get<any>(`${this.url + 'Paternidad/ConsultarLogEnvioResultados?idResultado='+`${idresultado}`}`, { headers: Reqheaders }).toPromise();

      }

     async EnviarResultados(idResultado: any, correoEnvio: any, documento: any, nombres: any, tipo: any):Promise<any> {        
          return this.http.post<any[]>(`${this.url + 'ReceptionResults?idResultado=' + idResultado +
            '&CorreoEnvio=' + correoEnvio + '&documento=' + documento +
            '&nombres=' + nombres + '&tipo=' + tipo}`, documento, { headers: Reqheaders, }).toPromise();    
      }

      async ConsultarDetalleSolicitud(idsolicitud): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'Paternidad/ConsultarDetalleSolicitud?idsolicitud='+`${idsolicitud}`}`, { headers: Reqheaders }).toPromise();
    }    
    
}
