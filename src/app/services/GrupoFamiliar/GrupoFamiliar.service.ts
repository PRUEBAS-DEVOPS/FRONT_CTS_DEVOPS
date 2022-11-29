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

export class GrupoFamiliarservice {
        
    private url = environment.urlApi;
    constructor(private http: HttpClient) { }

    async CrearProcedimientosGrupo(DataProcedimientos): Promise<any> {
        return await this.http.post(`${this.url + 'FamilyGroup'}`, DataProcedimientos, { headers: Reqheaders }).toPromise();
    }

    async ListarProcedimientosGrupo(idUsuario, idPlan,idSolicitud): Promise<any[]> {
        return await this.http.get<any[]>(`${this.url + 'FamilyGroup?idusuario=' + `${idUsuario}` + '&idPlan=' + `${idPlan}`+ '&IdSolicitud=' + `${idSolicitud}`}`, { headers: Reqheaders }).toPromise();
    }

    async EliminarProcedimientosGrupo(id,bandera, IdUsuario): Promise<any> {
        return await this.http.delete(`${this.url + 'FamilyGroup?Id=' + `${id}` + '&bandera=' + `${bandera}` + '&IdUsuario=' + `${IdUsuario}`}`, { headers: Reqheaders }).toPromise();
    }

    async ActualizarCantidadProcedimientosGrupo(id,cantidad,total){
        return await this.http.put(`${this.url + 'FamilyGroup?Id=' + id + '&cantidad=' + cantidad+ '&total=' + total}` ,cantidad, { headers: Reqheaders}).toPromise();
      }

    async AsociarExamenes(idProcedimiento, idPaciente, cantidadAsignada, idUsuario,IdExamenAsignado): Promise<any>{
        return await this.http.post(`${this.url + 'FamilyGroup/AsociarExamenes?idprocedimiento='+ `${idProcedimiento}` +
    '&idpaciente='+ `${idPaciente}` + '&cantidadAsignada='+ `${cantidadAsignada}` + '&idusuario=' + `${idUsuario}` + '&IdExamenAsignado='+ `${IdExamenAsignado}`}`,'', { headers: Reqheaders }).toPromise();
    }

    async ConsultarExamenesAsociados(idUsuario, idpaciente, IdSolicitud): Promise<any[]>{
        return await this.http.get<any[]>(`${this.url + 'FamilyGroup/ConsultarExamenesAsociados?idusuario=' + `${idUsuario}` + '&Idpaciente=' + `${idpaciente}` + '&IdSolicitud=' + `${IdSolicitud}`}`, { headers: Reqheaders }).toPromise();
    }

    async EliminarExamenesAsociados(id, idProcedimiento, idUsuario): Promise<any>{
        return await this.http.delete(`${this.url + 'FamilyGroup/EliminarExamenesAsociados?Id=' + `${id}` + '&idprocedimiento=' + `${idProcedimiento}`
         + '&idusuario=' + `${idUsuario}`}`, { headers: Reqheaders }).toPromise();
    }

    async PacientesGrupoPaciente(idUsuario, idSolicitud): Promise<any>{
        return await this.http.get<any[]>(`${this.url + 'FamilyGroup/PacientesGrupoPaciente?idusuario=' + `${idUsuario}` + '&idSolicitud=' + `${idSolicitud}` }`, { headers: Reqheaders }).toPromise();
    }

    async finalizarVentaGrupoFamiliar(DatosVenta): Promise<any>{
        return await this.http.post(`${this.url + 'FamilyGroup/Ventas'}`, DatosVenta, { headers: Reqheaders }).toPromise();
    }

    async CrearGrupoFamiliar(Infogrupo): Promise<any>{
        return await this.http.post(`${this.url + 'FamilyGroup/CrearGrupoFamiliar'}`, Infogrupo, { headers: Reqheaders }).toPromise();   
    
    }
    async crearSolicitud(idUsuario): Promise<any>{
        return await this.http.post(`${this.url + 'FamilyGroup/CrearSolicitud?idUsuario='+`${idUsuario}`}`,'', { headers: Reqheaders }).toPromise();
    }

    /*
    async registrarResponsablePago(Responsable): Promise<any> {
        return await this.http.post(`${this.url + 'FamilyGroup/ResponsablePago'}`, Responsable, { headers: Reqheaders }).toPromise();
      }
    */

      async ConfirmarPagoDatafono(idtransaccion,idUser,IdSede,categoria):Promise<any>{
        return await this.http.post(`${this.url + 'FamilyGroup/ConfirmarPagoCredibanco?idtransaccion=' + idtransaccion + '&idUser=' + idUser+'&IdSede='+IdSede+'&categoria='+categoria}`,'',{headers: Reqheaders}).toPromise();
      }
}