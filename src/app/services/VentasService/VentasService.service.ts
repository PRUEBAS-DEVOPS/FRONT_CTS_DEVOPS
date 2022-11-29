import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Analitos, Arqueo, CategoriaCheq, Chequeos, Clientes, Examenes, FacturacioDetalle, Facturacion, MediosPago, Planes, ResponsableFac, Tarifas, TarifasValores, TipoServ, UnidadMedida, Ventas } from 'src/app/models/Ventas/Ventas.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CargaMasivaTarifas2 } from 'src/app/models/CargasMasivas/CargaMasiva';

var auth_token = sessionStorage.getItem('Token');
const Reqheaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${auth_token}`,
});

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  constructor(private http: HttpClient) { }
  private url = environment.urlApi;// 'https://localhost:44362/Api';


 async  ConsultarExamenes(): Promise<Examenes[]> {
     return await this.http.get<Examenes[]>(`${this.url + 'Exams'}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarChequeos(): Observable<Chequeos[]> {
    return this.http.get<Chequeos[]>(`${this.url + 'Checkup'}`, { headers: Reqheaders });
  }

  async ConsultarPlanes(): Promise<Planes[]> {
    return await  this.http.get<Planes[]>(`${this.url + 'Plans'}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultarProcedimientosPlan(bandera: number, idplan: any): Promise<Planes[]> {
    return await this.http.get<Planes[]>(`${this.url + 'Plans?bandera=' + bandera + '&idplan=' + idplan}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarAnalitos(): Observable<Analitos[]> {
    return this.http.get<Analitos[]>(`${this.url + 'Analytes'}`, { headers: Reqheaders });
  }

  ConsultarCategoriaChequeos(): Observable<CategoriaCheq[]> {
    return this.http.get<CategoriaCheq[]>(`${this.url + 'CategoryCheckup'}`, { headers: Reqheaders });
  }

  ConsultarExamChequeo(Idchequeo: string, bandera: number): Observable<Examenes[]> {
    return this.http.get<Examenes[]>(`${this.url + 'Checkup?IdChequeo=' + Idchequeo + '&bandera=' + bandera}`, { headers: Reqheaders });
  }

  ConsultarUnidadMedida(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(`${this.url + 'UnitMeasure'}`, { headers: Reqheaders });
  }

  async ConsultarTipoMuestra(): Promise<any> {
    return await this.http.get<any>(`${this.url + 'Exams/ConsultarTipoMuestra'}`).toPromise();
  }

  async ConsultarClientes(): Promise<Clientes[]> {
    return await this.http.get<Clientes[]>(`${this.url + 'Customers'}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultarMediosPago(): Promise<MediosPago[]> {
    return await  this.http.get<MediosPago[]>(`${this.url + 'Sales'}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarTarifas(id: number): Observable<Tarifas[]> {
    return this.http.get<Tarifas[]>(`${this.url + 'Rate?id=' + id}`, { headers: Reqheaders });
  }

  ConsultarTarifasProced(IdTarifa): Observable<TarifasValores[]> {
    return this.http.get<TarifasValores[]>(`${this.url + 'Rate?IdTarifa=' + IdTarifa}`, { headers: Reqheaders });
  }

  async ConsultarTipoServicio(id: number): Promise<TipoServ[]> {
    return await this.http.get<TipoServ[]>(`${this.url + 'ServiceType?id=' + id}`).toPromise();;
  }

  DetallExamAll(id): Observable<Examenes[]> {
    return this.http.get<Examenes[]>(`${this.url + 'Exams?id=' + id}`, {
      headers: Reqheaders,
    });
  }

  DetallCategoryAll(Id): Observable<CategoriaCheq[]> {
    return this.http.get<CategoriaCheq[]>(`${this.url + 'CategoryCheckup?id=' + Id}`, {
      headers: Reqheaders,
    });
  }

  DetallCheckAll(Id): Observable<Chequeos[]> {
    return this.http.get<Chequeos[]>(`${this.url + 'Checkup?id=' + Id}`, {
      headers: Reqheaders,
    });
  }

  DetallAnalitosExam(id): Observable<Analitos[]> {
    return this.http.get<Analitos[]>(`${this.url + 'Exams?idExam=' + id}`, {
      headers: Reqheaders,
    });
  }

  DetallPlans(id): Observable<Planes[]> {
    return this.http.get<Planes[]>(`${this.url + 'Plans?id=' + id}`, {
      headers: Reqheaders,
    });
  }

  DetallCustomers(id): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(`${this.url + 'Customers?id=' + id}`, {
      headers: Reqheaders,
    });
  }

  CrearCategoriaChequeos(CategoriaChequeos: Chequeos) {
    return this.http.post(`${this.url + 'CategoryCheckup'}`, CategoriaChequeos, {
      headers: Reqheaders,
    });
  }

  CrearChequeos(chequeos: Chequeos) {
    return this.http.post(`${this.url + 'Checkup'}`, chequeos, { headers: Reqheaders });
  }

  CrearAnalitos(analito: Analitos) {
    return this.http.post(`${this.url + 'Analytes'}`, analito, { headers: Reqheaders });
  }

  CrearUnidadMedida(unidad: UnidadMedida) {
    return this.http.post(`${this.url + 'UnitMeasure'}`, unidad, { headers: Reqheaders });
  }

  CrearExamenes(examene: Examenes) {
    return this.http.post(`${this.url + 'Exams'}`, examene, { headers: Reqheaders });
  }

  CrearPlanes(plan: Planes) {
    return this.http.post(`${this.url + 'Plans'}`, plan, { headers: Reqheaders });
  }

  CrearTarifas(tarifa: Tarifas) {
    return this.http.post(`${this.url + 'Rate'}`, tarifa, { headers: Reqheaders });
  }

  CrearClientes(cliente: Clientes) {
    return this.http.post(`${this.url + 'Customers'}`, cliente, { headers: Reqheaders });
  }

  CrearExamenesChequeo(idChequeo: number, idExamen: number, bandera: number) {
    return this.http.put(`${this.url + 'Checkup?Idcheckup=' + idChequeo + '&idExamen=' + idExamen +
      '&bandera=' + bandera}`, idExamen, { headers: Reqheaders });
  }

  CrearResponsableFact(Responsable: ResponsableFac): Promise<any> {
    return this.http.put(`${this.url + 'Sales'}`, Responsable, { headers: Reqheaders }).toPromise();
  }

  CrearVentas(Venta: Ventas): Promise<any> {
    return this.http.post(`${this.url + 'Sales'}`, Venta, { headers: Reqheaders }).toPromise();
  }

  CrearTipoServicio(tipoServ: TipoServ) {
    return this.http.post(`${this.url + 'ServiceType'}`, tipoServ, { headers: Reqheaders });
  }

  CargaMasiva(archivo: any, clasificacion: number) {
    return this.http.post(`${this.url + 'Rate?archivo=' + archivo + '&clasificacion=' + clasificacion}`, archivo, { headers: Reqheaders });
  }

  EliminarTemporales(bandera: number, id: number) {
    return this.http.delete(`${this.url + 'Checkup?bandera=' + bandera + '&Id=' + id}`, { headers: Reqheaders })
  }

  async ConsultarDetalleVenta(idventa,proceso): Promise<FacturacioDetalle[]> {
    return await this.http.get<FacturacioDetalle[]>(`${this.url + 'Sales?idventa=' + idventa +'&categoria=' + proceso}`, {
      headers: Reqheaders,
    }).toPromise();
  }

  async ConsultarProcedimientosVenta(idventa,proceso): Promise<Examenes[]> {
    return await this.http.get<Examenes[]>(`${this.url + 'Sales?IdenVenta=' + idventa+'&categoria=' + proceso}`, {
      headers: Reqheaders,
    }).toPromise();
  }

  async AnularVenta(idventa, motivo,usuario,idSede,categoria,IdVentaCentralizada):Promise<any> {
    return await this.http.post(`${this.url + 'Sales?idVenta=' + idventa + '&Motivo=' + motivo + '&Idusuario=' + usuario +'&Idsede=' + idSede+'&categoria=' + categoria+'&IdVentaCentralizada=' + IdVentaCentralizada}`, motivo, { headers: Reqheaders }).toPromise();
  }


  async ConsultarDataFacturacion(documento, fechaIni, fechafin, estado, idtransaccion, medioPago, solicitudAth, tipoServicio,NoFactura, numSolicitud): Promise<any[]> {
    return await  this.http.get<any[]>(`${this.url + 'Sales?documento=' + documento + '&fechaIni=' + fechaIni
      + '&fechafin=' + fechafin + '&estado=' + estado
      + '&idtransaccion=' + idtransaccion + '&medioPago=' + medioPago
      + '&solicitudAth=' + solicitudAth + '&tipoServicio=' + tipoServicio + '&NoFactura=' + NoFactura + '&numSolicitud=' + numSolicitud}`, {
      headers: Reqheaders,
    }).toPromise();
  }

  async GenerarFacturacion(idventa: number, IdUsuario: Number,categoria):Promise<any> {
    return await this.http.post(`${this.url + 'Sales?idVenta=' + idventa + '&idUser=' + IdUsuario+ '&categoria=' + categoria}`, '', { headers: Reqheaders }).toPromise();
  }

  NotificacionOrdenCompra(documento: any, idventa: any,categoria) {
    return this.http.post(`${this.url + 'Sales?documento=' + documento+ '&IdVenta=' + idventa+ '&categoria=' + categoria}`, idventa, { headers: Reqheaders });
  }

  ConsultarComprobante(idventa:number,categoria): Promise<any>{
    return this.http.post(`${this.url + 'Sales?IdVenta=' + idventa+ '&categoria=' + categoria}`, idventa, { headers: Reqheaders }).toPromise();

  }

  ConsultarArqueo(fechaiini, fechafin, asesor): Promise<Arqueo[]> {
    return this.http.get<Arqueo[]>(`${this.url + 'Sales?fechaIni=' + fechaiini
      + '&fechafin=' + fechafin + '&asesor=' + asesor}`, {
      headers: Reqheaders,
    }).toPromise();
  }

  GenerarExcel(fechaiini, fechafin, asesor) {
    return this.http.post(`${this.url + 'Sales?fechaIni=' + fechaiini
      + '&fechafin=' + fechafin + '&asesor=' + asesor}`,"", {headers: Reqheaders,});
  }

  // CargaMasivaTarifas(nomArchivo: string) {
  //   return this.http.post(`${this.url + 'LoadRate?nombreArchivo=' + nomArchivo}`, nomArchivo, { headers: Reqheaders });
  // }

 async CargaMasivaTarifas(IdEsquema:any,Examen:any,Valor:any,Nombre:any,nomArchivo: string, idusuario: any): Promise<any> {
    return await  this.http.post(`${this.url + 'LoadRate?IDESQUEMA='+ IdEsquema+ '&EXAMEN='+Examen + '&VALOR='+Valor+
    '&NOMBRE='+Nombre+ '&nombreArchivo=' + nomArchivo + '&Idusuario=' + idusuario}`, Examen, { headers: Reqheaders }).toPromise();
  }

  async CargaMasivaTarifas2(load: CargaMasivaTarifas2): Promise<any> {
    return await  this.http.post(`${this.url}LoadRate`, load, { headers: Reqheaders }).toPromise();
  }

  GuardarValoresCargue(idusuario: any): Promise<any> {
    return this.http.post(`${this.url + 'LoadRate?Idusuario=' + idusuario}`, idusuario, { headers: Reqheaders }).toPromise();
  }


  GuardarProcedimientos(codProcedimiento: any, bandera: any, IdTarifa: any, IdUsuario: any): Promise<any> {
    return this.http.post(`${this.url + 'Sales/GuardarProcedimientosVenta?codProcedimiento=' + codProcedimiento
      + '&bandera=' + bandera + '&IdTarifa=' + IdTarifa + '&IdUsuario=' + IdUsuario}`, codProcedimiento, { headers: Reqheaders }).toPromise();
  }

  EliminarCargue(idusuario: any): Promise<any> {
    return this.http.delete(`${this.url + 'LoadRate?Idusuario=' + idusuario}`, { headers: Reqheaders }).toPromise();
  }

  ConsultarCargue(idusuario: any): Promise<any> {
    return this.http.get(`${this.url + 'LoadRate?Idusuario=' + idusuario}`, { headers: Reqheaders }).toPromise();
  }


  ListarProcedimientos(Idusuario: any,idplan:any): Promise<any[]> {
    return this.http.get<any[]>(`${this.url + 'Sales/ConsultarProcedimientosSeleccionados?idusuario=' + Idusuario+ '&idPlan='+idplan}`, { headers: Reqheaders }).toPromise();
  }

  EliminarProcedimientos(id: any, bandera: any, Idusuario: any): Promise<any> {
    return this.http.delete(`${this.url + 'Sales?Id=' + id + '&bandera=' + bandera + '&IdUsuario=' + Idusuario}`, { headers: Reqheaders }).toPromise();
  }

  ActualizarVenta(id: any, idsolicitud: any, Nofactura: any) {
    return this.http.put(`${this.url + 'Sales?idVenta=' + id + '&idSolicitud=' + idsolicitud + '&NoFactura=' + Nofactura}`, { headers: Reqheaders });
  }

  ConsultarReporteVentas(fechaiini, fechafin): Promise<Arqueo[]> {
    return this.http.get<Arqueo[]>(`${this.url + 'Sales?fechaIni=' + fechaiini
      + '&fechafin=' + fechafin}`, {
      headers: Reqheaders,
    }).toPromise();
  }

  GenerarExcelReporteVentas(fechaiini, fechafin) {
    return this.http.post(`${this.url + 'Sales?fechaIni=' + fechaiini
      + '&fechafin=' + fechafin}`, {
      headers: Reqheaders,
    });
  }

  async listarDetalleCargue(cargue,usuario):Promise<any[]>{
    return await  this.http.get<any[]>(`${this.url + 'LoadRate?Idcargue=' + cargue+'&Idusuario='+usuario}`, { headers: Reqheaders }).toPromise();
  }

  async ConfirmarPagoDatafono(idtransaccion,idUser,IdSede):Promise<any>{
    return await this.http.post(`${this.url + 'Sales?idtransaccion=' + idtransaccion + '&idUser=' + idUser+'&IdSede='+IdSede}`,'', {headers: Reqheaders}).toPromise();
  }

  async BorrarPagoDatafono(idtransaccion,idUsuario,IdSede,categoria):Promise<any>{
    return await this.http.put(`${this.url + 'Sales?idtransaccion=' + idtransaccion + '&usuario=' + idUsuario+'&IdSede='+IdSede+'&categoria='+categoria}`, '',{headers: Reqheaders}).toPromise();
  }

  async PreAnularVentaDatafono(idventa, usuario,Idsede,categoria,IdVentaCentralizada):Promise<any> {
    return await this.http.put(`${this.url + 'Sales?idVenta=' + idventa + '&usuario=' + usuario+'&Idsede='+Idsede+'&categoria='+categoria+'&IdVentaCentralizada='+IdVentaCentralizada}`, idventa, { headers: Reqheaders }).toPromise();
  }

  async GenerarPDF(fechaiini, fechafin, asesor):Promise<any> {
    return await  this.http.post(`${this.url + 'Sales/ArqueoPdf?fechaIni=' + fechaiini  + '&fechafin=' + fechafin + '&asesor=' + asesor}`,'', {headers: Reqheaders}).toPromise();
  }

  async EliminarExamenTarifa(idtarifa,codexamen):Promise<any> {
    return await  this.http.delete(`${this.url + 'Rate?idtarifa=' +  `${idtarifa}`  + '&codexamen=' +  `${codexamen}`}`, {headers: Reqheaders}).toPromise();
  }

  async GuardarFormularioCovid(datosCovid) {
    return await this.http.post(`${this.url + 'Sales/GuardarInfoCovid'}`, datosCovid, { headers: Reqheaders }).toPromise();
  }

  async EliminarFormularioCovid(idUsuario) {
    return await this.http.delete(`${this.url + 'Sales/EliminarFormCovid?idUsuario='+ `${idUsuario}`}`, { headers: Reqheaders }).toPromise();
  }

  async ConsultatFormularioCovid(idFormulario) {
    return await this.http.get(`${this.url + 'Sales/ConsultarInfoFormCovid?idFormulario='+ `${idFormulario}`}`,  { headers: Reqheaders }).toPromise();
  }

  async GenerarExecelReporteFormulario(fechaIni,fechaFin,idFormulario,idsede){
    return await this.http.post(`${this.url + 'Sales/GenerarReporteFormulariosCovid?fechaIni='+ `${fechaIni}`+ '&fechaFin=' + `${fechaFin}`
                                                                                +'&idFormulario=' + `${idFormulario}`+'&idsede=' + `${idsede}`}`,  { headers: Reqheaders }).toPromise();
  }
  async GenerarPDFReporteFormulario(fechaIni,fechaFin,idFormulario,idsede){
    return await this.http.post(`${this.url + 'Sales/GenerarReporteFormulariosCovid?fechaIni='+ `${fechaIni}`+ '&fechaFin=' + `${fechaFin}`
                                                                                 +'&idFormulario=' + `${idFormulario}`+'&idsede=' + `${idsede}`}`,  { headers: Reqheaders }).toPromise();
  }
}
