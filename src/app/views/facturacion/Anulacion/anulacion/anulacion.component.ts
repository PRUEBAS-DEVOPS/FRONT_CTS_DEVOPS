import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styleUrls: ['./anulacion.component.css']
})
export class AnulacionComponent implements OnInit {
  MediosPago:any;
  LtsEstad:any;
  DataFacturacion: any;
  show:boolean=false;
  paginaFacturacion: number = 1;
  LtsOpc: any;
  LtsOpc2: any;
  DetallVenta:any;
  DetallProcedureVenta:any;
  GlobalIdVenta: any;
  IdUsuario: any;
  sede: any;
  categoria: any;
  hoy: string;
  currentYear: number;
  constructor( private ServiceVentas: VentasService, private fb: FormBuilder, private serviceGeneric: GenericoService, private router: Router) { }

  ngOnInit(): void {
    this.listarmediodepago();
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.sede = JSON.parse(sessionStorage.getItem('Sede'));
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date =today.getFullYear()+"-"+String((today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+day[2]
    this.hoy = date
    this.currentYear = today.getFullYear();
  }

  async listarmediodepago() {
    await this.ServiceVentas.ConsultarMediosPago().then((data) => {
      this.MediosPago = data;
      this.ListarEstados();
    });
  }

  async ListarEstados() {
    await this.serviceGeneric.consultarEstado().then((data) => {
      this.LtsEstad = data;
      this.ListarOpciones()
    });
  }

  async ListarOpciones() {
    const IdCategoria = 1;
    await this.serviceGeneric.ConsultarOpciones(IdCategoria).then((data) => {
      //sessionStorage.setItem('LtsOpciones', JSON.stringify(data))
      this.LtsOpc2=data.filter(l=> l.IdOpc===3 || l.IdOpc===1);
    });
  }

Paginar(event) {
  this.paginaFacturacion = event;
}

  async consultar() {
    var numfac = $('#numfac').val();
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var documento = $('#documento').val();
    var SelEstado = $('#SelEstado').val();
    var selMedioPa = $('#selMedioPa').val();
    var noSolicitud = $('#numSolicitud').val();
    if (numfac != '' || fechaIni != '' || fechafin != '' || documento != '' || SelEstado != '0' ||selMedioPa != '0') {
      await this.ServiceVentas.ConsultarDataFacturacion(documento,fechaIni,fechafin,SelEstado," ",selMedioPa," ",0,numfac,noSolicitud).then((data) => {
        this.DataFacturacion = data;
        this.ValidarOpciones();
        this.show = true;
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Opps...',
        text: 'Seleccione al menos un filtro',
      });
    }
  }

  async ValidarOpciones() {
    // this.LtsOpc = JSON.parse(sessionStorage.getItem('LtsOpciones'));
    // this.LtsOpc2 = this.LtsOpc;//.filter(x=> x.IdOpc==1)
    for (const data of this.DataFacturacion) {
      var estado = data.Estado;
      switch (estado) {
        case "Anulada":
          setTimeout(() => {
            $("#Anular" + data.IdVenta).hide()
          }, 1500);
          break;
        case "Pendiente":
          setTimeout(() => {
            $("#Anular" + data.IdVenta).show()
          }, 1500);
          break;
        case "Pagada":
          setTimeout(() => {
            $("#Anular" + data.IdVenta).show()
          }, 1500);
          break;
        case "Por Pagar":
          setTimeout(() => {
            $("#Anular" + data.IdVenta).show()
          }, 1500);
          break;
        case "Confirmada":
          setTimeout(() => {
            $("#Anular" + data.IdVenta).show()
          }, 1500);
          break;
      }
    }
  }

  AccionClick(idOpc, idventa,categoria) {
    switch (idOpc) {
      case 1:
        this.verDetalle(idventa,categoria);
        break;
      case 3:
        this.Anular(idventa,categoria);
        break;
    }
  }

  async verDetalle(id,categoria) {
    await this.ServiceVentas.ConsultarDetalleVenta(id,categoria).then((data) => {
      this.DetallVenta = data;
      this.listarprocedimientoventas(id,categoria);
    });
    (<any>$('#VerDetalles')).modal('show');
  }

  async listarprocedimientoventas(id,categoria) {
    await this.ServiceVentas.ConsultarProcedimientosVenta(id,categoria).then((data) => {
        this.DetallProcedureVenta = data;
      });
  }

  Anular(idventa,categoria) {
    this.GlobalIdVenta = idventa;
    this.categoria = categoria;
    (<any>$('#FacturaAnularpago')).modal('show');
    this.PreAnulacion();
  }

  async PreAnulacion(){
    await this.ServiceVentas.PreAnularVentaDatafono(this.GlobalIdVenta, this.IdUsuario,this.sede[0].id,this.categoria,0).then();
  }

  async guardarAnulacion() {
    var Desmotivo = $('#txtmotivo').val();
    if (Desmotivo != '' && Desmotivo != null) {
      await this.ServiceVentas.AnularVenta(this.GlobalIdVenta, Desmotivo,this.IdUsuario,this.sede[0].id,this.categoria,0).then(
        (resp) => {
          Swal.fire({
            icon: 'success',
            text: resp.toString(),
            showConfirmButton: true
          });
          (<any>$('#FacturaAnularpago')).modal('hide');
          $('#txtmotivo').val('');
          sessionStorage.removeItem('Documento');
          $("#documento").val('');
          this.limpiar()
          //this.consultar();
        }
      );
    } else {
      Swal.fire({
        title: 'Debe completar el motivo',
        icon: 'warning',
        confirmButtonColor: '#00A496',
        confirmButtonText: 'Aceptar',
      });
    }

  }

  limpiar(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  LimpiarFormulario() {
    $('#idtransaccion').val("");
    $('#idsolicitudAth').val("");
    $('#fechaIni').val("");
    $('#fechafin').val("");
    $('#documento').val("");
    $('#SelEstado').val(0);
    $('#selMedioPa').val(0);
    $('#selTipoSer').val(0);
    this.show = false;
  }

  validarFecha(fecha,bandera) {
    let transformada = fecha.split("-")
    if (bandera == 1) {
      if (transformada[0] > this.currentYear) {
        $('#fechaIni').val("");
      }
    }else{
      if (transformada[0] > this.currentYear) {
        $('#fechafin').val("");
      }
    }
  }
}
