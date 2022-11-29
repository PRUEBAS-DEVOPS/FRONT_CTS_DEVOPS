import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WindowInterruptSource } from '@ng-idle/core';
import { EtiquetasServiceService } from 'src/app/services/Etiqueta/etiquetas-service.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.css']
})
export class EtiquetasComponent implements OnInit {
  listTipoDoc: any;
  dataImpresiones: any;
  show:boolean = false;
  paginaFacturacion: number = 1;
  paginaSolicitud: number = 1;
  DetallVenta: any;
  Procedimientos: any;
  numeroSolicitud: any;
  nombreCompleto: any;
  sexo: any;
  edad: any;
  idVenta: any;
  solicitud: any;
  Tabla = false;
  numeroDeBarras: string;
  codPlan: any;
  codAthenea: any;
  solicitudnum: any;
  nombreMuestra: any;
  fechaRecepSolicitud: any;
  Ndocumento: void;
  subMenuUser: any;

  constructor(
    private serviceEtiquetas: EtiquetasServiceService,
    private ServiceVentas: VentasService,
    private fb: FormBuilder,
    private serviceGeneric: GenericoService,
    private genericoService: GenericoService,
    private router: Router,
    private ValidarPermisos:ValidarPermisos
  ) { }

  ngOnInit(): void {
    this.cargarInfo();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async cargarInfo(){
    this.listTipoDoc = await this.genericoService.ConsultarTipoDoc();
  }

  Paginar(event) {
    this.paginaFacturacion = event;
  }

  paginarSolicitud(event){
    this.paginaSolicitud = event;
  }

  async consultar() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var numSolicitud = $('#numSolicitud').val();
    var numFac = $('#numFac').val();
    var tipoDoc = $('#tipoDoc').val();
    var numDoc = $('#numDoc').val();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      text:'Filtrando pacientes'
    });
    Swal.showLoading();
    if (fechaIni != '' || fechafin != ''  || numSolicitud != '' || numFac != '' || tipoDoc != '0' || numDoc != '' ) {
      await this.serviceEtiquetas.ConsultarEtiquetas(fechaIni, fechafin, numSolicitud, numFac, numDoc).then(data => {
        Swal.close();
        this.dataImpresiones = data;
      },err=>{
        Swal.close();
        Swal.fire({
          title: 'Error',
          icon:'error',
          text:err.error.ExceptionMessage,
        });
      });
        this.show = true;
    } else {
      Swal.close();
      Swal.fire({
        icon: 'warning',
        title: 'Opps...',
        text: 'Seleccione al menos un filtro',
      });
    }
  }

  async verDetalle(id) {
    await this.serviceEtiquetas.ConsultarExamenIdVenta(id).then(data =>{
    this.DetallVenta = data;
    });
    (<any>$('#VerDetalleDeSolicitud')).modal('show');
    this.Tabla = true;
  }

  getNumBarras(idMuestra){
    return this.solicitud+'-'+ idMuestra;
  }

  async generarEtiqueta(id, nSolicitud, nomCompleto, sexo, edad, codPlan, codAthenea, fechaRecepcionSolicitud, documento,proceso) {
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      text:'Generando etiqueta'
    });
    Swal.showLoading();
    this.solicitud = nSolicitud;
    this.nombreCompleto = nomCompleto + "  ";
    this.sexo = sexo;
    this.edad = edad;
    this.idVenta = id;
    this.codPlan = codPlan;
    this.codAthenea = codAthenea;
    this.fechaRecepSolicitud = fechaRecepcionSolicitud;
    this.Ndocumento = documento;
    await this.serviceEtiquetas.ConsultarMuestraVenta(id,proceso).then(data =>{
      this.DetallVenta = data;
      if (this.DetallVenta.length > 0){
        const Objeto = {idVenta: this.idVenta, idMuestra: this.DetallVenta.map(i => i.IdTipoMuestra),proceso:proceso}
        this.serviceEtiquetas.ConsultarProcedimientosEtiquetas(Objeto).then(data =>{
          this.Procedimientos = data;
          setTimeout(() => {
            Swal.close();
            this.imprimirEtiqueta();
          },1000);
        },err=>{
          Swal.close();
          Swal.fire({
            title: 'Error',
            icon:'error',
            text:err.error.ExceptionMessage,
          });
        });
      }else  {
        Swal.close();
        Swal.fire({
          title: 'Error',
          icon:'error',
          text:'No hay muestras asociadas',
        });
      }
    },err=>{
      Swal.close();
      Swal.fire({
        title: 'Error',
        icon:'error',
        text:err.error.ExceptionMessage,
      });
    });
  }

  cerrarErrorEtiqueta(){
    (<any>$('#ErrorEtiqueta')).modal('hide');
  }

  async modalImprimir(numSolicitud, id, nombre ) {
    const printContent = document.getElementById("etiquetaPrint");
    printContent.style.display="none";
    this.numeroSolicitud = numSolicitud + "-" + id + " " + nombre;
    this.numeroDeBarras = numSolicitud + "-" + id;
    this.solicitudnum = numSolicitud;
    this.nombreMuestra = nombre;

    (<any>$('#imprimirEtiqueta')).modal('show');
  }

  imprimirEtiqueta() {
    const printContent = document.getElementById("EnviarImprimirEtiqueta");
    $("text").css("color","black");
    $("text").css("font-weight","700");
    $("text").css("font-size","19px");
    $("#sticker").css("margin-top","10.5px");
    printContent.style.display="block";
    const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0,font-size=20');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    printContent.style.display="none";
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  limpiar(){
    $('#fechaIni').val();
    $('#fechafin').val();
    $('#numSolicitud').val();
    $('#numFac').val();
    $('#tipoDoc').val();
    $('#numDoc').val();
    this.show = false;
  }

}
