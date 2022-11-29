import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { data } from 'jquery';
import {
  Examenes,
  FacturacioDetalle,
  Facturacion,
  MediosPago,
  TipoServ,
} from 'src/app/models/Ventas/Ventas.model';
import {
  GenericCondition,
  Options,
} from 'src/app/models/Generic/Generic.model';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import { GenericoService } from '../../services/servicesGenerico/generico.service';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { EtiquetasServiceService } from 'src/app/services/Etiqueta/etiquetas-service.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { ServicioDetrasladoService } from 'src/app/services/Punte/servicio-detraslado.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css'],
})
export class FacturacionComponent implements OnInit {
  FormAnularVenta: FormGroup;
  show = false;
  DataFacturacion: Facturacion[];
  DetallVenta: FacturacioDetalle[];
  DetallProcedureVenta: Examenes[];
  MediosPago: MediosPago[];
  LtsTipoServ: TipoServ[];
  LtsEstado: GenericCondition[];
  LtsOpc: Options[];
  LtsOpc2: Options[];
  LtsEstad: GenericCondition[];
  totalRecords: number;
  paginaFacturacion: number = 1;
  GlobalIdVenta: number;
  IdUsuario: number;
  IdVenta: number;
  DocumentoPaciente: any;
  sede: any;
  categoria: any;
  muestras: any = [];
  infoEtiquetas: any;
  procedimientos: any[];
  IdVentaCentralizada: any;
  fechaSoli: any;
  valorTotalVenta: number;
  hoy: string;
  currentYear: number;
  subMenuUser: any;
  mostrarNSolicitudCTS = false;
  nSolicitud: any;
  valores: any;

  constructor(
    private ServiceVentas: VentasService,
    private fb: FormBuilder,
    private serviceGeneric: GenericoService,
    private etiquetasSvc: EtiquetasServiceService,
    private router: Router,
    private ValidarPermisos: ValidarPermisos,
    private ServicioPuente: ServicioDetrasladoService
  ) { }

  ngOnInit(): void {
    this.ListarTipoServ();
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.DocumentoPaciente = JSON.parse(sessionStorage.getItem('Documento'));
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.sede = JSON.parse(sessionStorage.getItem('Sede'));
    this.listarmediodepago();
    this.FormAnularVenta = this.fb.group({
      Id: [''],
      IdCategoria: [''],
      CodAthenea: [''],
      NombreChequeo: [''],
      Descripcion: [''],
      Recomendaciones: [''],
    });
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date = today.getFullYear() + "-" + String((today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1)) + "-" + day[2]
    this.hoy = date
    this.currentYear = today.getFullYear();

    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  selectTipoServicio() {
    var selTipoSer = $('#selTipoSer').val();
    if (selTipoSer == 2 || selTipoSer == 3) {
      this.mostrarNSolicitudCTS = true;
    } else {
      this.mostrarNSolicitudCTS = false;
    }
  }

  Validar(ruta, permisos) {
    this.ValidarPermisos.validarPermisos(ruta, permisos);
  }

  async consultar() {
    let idtransaccion = ''; //$('#idtransaccion').val();
    let idsolicitudAth = $('#idsolicitudAth').val();
    let fechaIni = $('#fechaIni').val();
    let fechafin = $('#fechafin').val();
    let documento = $('#documento').val();
    let SelEstado = $('#SelEstado').val();
    let selMedioPa = $('#selMedioPa').val();
    let selTipoSer = $('#selTipoSer').val();
    let noSolicitud = $('#numSolicitud').val();

    if (idtransaccion != '' || idsolicitudAth != '' || fechaIni != '' || fechafin != '' || documento != '' ||
      SelEstado != '0' || selMedioPa != '0' || selTipoSer != '0' || noSolicitud != '') {
      await this.ServiceVentas.ConsultarDataFacturacion(documento, fechaIni, fechafin, SelEstado, idtransaccion,
        selMedioPa, idsolicitudAth, selTipoSer, " ", noSolicitud == undefined ? '' : noSolicitud).then((data) => {
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

  async ListarOpciones() {
    const IdCategoria = 1;
    await this.serviceGeneric.ConsultarOpciones(IdCategoria).then((data) => {
      sessionStorage.setItem('LtsOpciones', JSON.stringify(data))
      this.ListarEstados();
    });
  }

  async verDetalle(id, proceso) {
    await this.ServiceVentas.ConsultarDetalleVenta(id, proceso).then((data) => {
      this.DetallVenta = data;
      this.listarprocedimientoventas(id, proceso);
    });
    (<any>$('#VerDetalles')).modal('show');
  }

  async listarprocedimientoventas(id, proceso) {
    await this.ServiceVentas.ConsultarProcedimientosVenta(id, proceso).then(
      (data) => {
        this.DetallProcedureVenta = data;
        var total = 0;
        this.DetallProcedureVenta.forEach(element => {
          total += Number(element.Valor);
        });
        this.valorTotalVenta = total
      }
    );
  }

  ModalConfirmacion(idventa, proceso) {
    this.IdVenta = idventa;
    this.categoria = proceso;
    (<any>$('#AlertaConfirmacion')).modal('show');
  }

  Pagar() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'warning',
      text: 'Estamos procesando tú solicitud.'
    });
    Swal.showLoading();
    this.ServiceVentas.GenerarFacturacion(+this.IdVenta, +this.IdUsuario, this.categoria).then(response => {
      Swal.close();
      this.consultar();
      Swal.fire({
        icon: 'success',
        text: response.toString(),
        showConfirmButton: true
      }).then(result => {
        if (result.isConfirmed) {
          sessionStorage.removeItem('Documento');
        }
      })
    },err=>{
      Swal.close();
      console.log(err)
    });
  }

  AccionClick(idOpc, idventa, documento, proceso, IdVentaCentralizada, nSolicitud) {
    switch (idOpc) {
      case 1:
        this.verDetalle(idventa, proceso);
        break;
      case 2:
        this.ModalConfirmacion(idventa, proceso);
        break;
      case 3:
        this.Anular(idventa, proceso, IdVentaCentralizada);
        break;
      // case 6:
      //   this.FacturaManual(idventa);
      //   break;
      case 6:
        this.GenerarComprobante(idventa, proceso);
        break;
      case 43:
        this.GEtiqueta(idventa, nSolicitud)
        break;
    }
  }

  GEtiqueta(idVenta, nSolicitud) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Generando etiqueta'
    });
    Swal.showLoading();
    this.procedimientos = []
    if (nSolicitud > 0) {
      this.etiquetasSvc.ConsultarEtiquetas('', '', nSolicitud, '', '').then(resp => {
        this.infoEtiquetas = resp[0];
        if (resp.length > 0) {
          this.etiquetasSvc.ConsultarMuestraVenta(this.infoEtiquetas.IdVenta, this.infoEtiquetas.Proceso).then(data => {
            this.muestras = data;
            if (this.muestras.length > 0) {
              const objeto = { idVenta: this.infoEtiquetas.IdVenta, idMuestra: this.muestras.map(i => i.IdTipoMuestra), proceso: this.infoEtiquetas.Proceso }
              this.etiquetasSvc.ConsultarProcedimientosEtiquetas(objeto).then(resp => {
                this.procedimientos = resp;
                setTimeout(() => {
                  Swal.close();
                  this.imprimir();
                }, 3000);
              }, err => {
                Swal.close();
                Swal.fire({
                  title: 'Error',
                  icon: 'error',
                  text: err.error.ExceptionMessage,
                });
              })
            } else {
              Swal.close();
              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'No se encontraron muestras asociadas',
              });
            }
          }, err => {
            Swal.close();
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: err.error.ExceptionMessage,
            });
          });
        } else {
          Swal.close();
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Número de solicitud no encontrado',
          });
        }
      }, err => {
        Swal.close();
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Ha ocurrido un error',
        });
      })
    } else {
      Swal.close();
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'No es posible generar la etiqueta ya que el paciente no contiene un número de solicitud',
      });
    }

  }

  imprimir() {
    const printContent = document.getElementById("etiquetaPrint");
    $("text").css("color", "black");
    $("text").css("font-weight", "700");
    $("text").css("font-size", "19px");
    $("#sticker").css("margin-top", "9.5px")
    printContent.style.display = "block";
    const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0,font-size=20');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    printContent.style.display = "none";
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  Paginar(event) {
    this.paginaFacturacion = event;
    this.ValidarOpciones();
  }

  getNumBarras(idMuestra) {
    return this.infoEtiquetas.NumSolicitud + '-' + idMuestra;
  }

  getProcedimientos(id) {

  }

  async ValidarOpciones() {
    this.LtsOpc = JSON.parse(sessionStorage.getItem('LtsOpciones'));
    this.LtsOpc2 = this.LtsOpc;//.filter(x=> x.IdOpc==1)
    for (const data of this.DataFacturacion) {
      var estado = data.Estado;
      var servicio = data.TipoServicio;
      switch (estado) {
        case "Anulada":
          setTimeout(() => {
            $("#Facturar" + data.IdVenta).hide()
            $("#Anular" + data.IdVenta).hide()
            $("#Comprobante" + data.IdVenta).hide()
            $("#Etiqueta" + data.IdVenta).hide()
          }, 1500);
          break;
        case "Pendiente":
          setTimeout(() => {
            $("#Facturar" + data.IdVenta).hide()
            $("#Anular" + data.IdVenta).hide()
            $("#Comprobante" + data.IdVenta).hide()
            $("#Etiqueta" + data.IdVenta).hide()
          }, 1500);
          break;
        case "Pagada":
          if (servicio == "Servicio Presencial" || servicio == "Venta Grupo Familiar") {
            setTimeout(() => {
              $("#Facturar" + data.IdVenta).hide();
              $("#Anular" + data.IdVenta).hide();
              $("#Comprobante" + data.IdVenta).show();
              $("#Etiqueta" + data.IdVenta).show();
            }, 1500);
          } else {
            setTimeout(() => {
              $("#Facturar" + data.IdVenta).hide();
              $("#Anular" + data.IdVenta).hide();
              $("#Comprobante" + data.IdVenta).show();
              $("#Etiqueta" + data.IdVenta).hide();
            }, 1500);
          }
          break;
        case "Por Pagar":
          setTimeout(() => {
            $("#Facturar" + data.IdVenta).show()
            $("#Anular" + data.IdVenta).show()
            $("#Comprobante" + data.IdVenta).hide()
            $("#Etiqueta" + data.IdVenta).hide()
          }, 1500);
          break;
        case "Confirmada":
          setTimeout(() => {
            $("#Facturar" + data.IdVenta).show()
            $("#Anular" + data.IdVenta).show()
            $("#Comprobante" + data.IdVenta).hide()
            $("#Etiqueta" + data.IdVenta).hide()
          }, 1500);
          break;
      }
    }
  }

  FacturaManual(idventa) {
    this.IdVenta = idventa;
    (<any>$('#FacturaManual')).modal('show');
  }

  GuardarInfoFactura() {
    const IdSolicitud = $("#txtIdSol").val();
    const NoFactura = $("#txtNoFac").val();
    this.ServiceVentas.ActualizarVenta(this.IdVenta, IdSolicitud, NoFactura).subscribe(response => {
      Swal.fire({
        icon: 'success',
        text: response.toString(),
        showConfirmButton: true
      });
      (<any>$('#FacturaManual')).modal('hide');
      this.consultar();
    })
  }

  Anular(idventa, proceso, IdVentaCentralizada) {
    this.GlobalIdVenta = idventa;
    this.categoria = proceso;
    this.IdVentaCentralizada = IdVentaCentralizada;
    (<any>$('#FacturaAnularpago')).modal('show');
    this.PreAnulacion();
  }

  async PreAnulacion() {
    await this.ServiceVentas.PreAnularVentaDatafono(this.GlobalIdVenta, this.IdUsuario, this.sede[0].id, this.categoria, this.IdVentaCentralizada).then();
  }

  async guardarAnulacion() {
    var Desmotivo = $('#txtmotivo').val();
    if (Desmotivo != '' && Desmotivo != null) {
      await this.ServiceVentas.AnularVenta(this.GlobalIdVenta, Desmotivo, this.IdUsuario, this.sede[0].id, this.categoria, this.IdVentaCentralizada).then(
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
          this.consultar();
          //this.limpiar()
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

  limpiar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  async GenerarComprobante(idventa: number, proceso: string) {
    await this.ServiceVentas.ConsultarComprobante(idventa, proceso).then(response => {
      this.base64ToBlob(response);
    }).catch(err => {
      if (err.status === 400) {
        Swal.fire({
          text: err.error.Message,
          icon: 'error'
        });
        return;
      } else if (err.status === 500) {
        Swal.fire({
          text: err.error.Message,
          icon: 'error'
        });
        return;
      }
    });
  }

  public base64ToBlob(b64Data, sliceSize = 512) {
    let byteCharacters = atob(b64Data); //data.file there
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const data: Blob = new Blob(byteArrays, { type: 'application/pdf' });
    FileSaver.saveAs(data, 'Comprobante_' + new Date().getTime())
  }

  async listarmediodepago() {
    await this.ServiceVentas.ConsultarMediosPago().then((data) => {
      this.MediosPago = data;
      this.ListarTipoServ();
    });
  }

  async ListarTipoServ() {
    await this.ServiceVentas.ConsultarTipoServicio(0).then((data) => {
      this.LtsTipoServ = data;
      this.ListarOpciones();
    }).catch(err => {
      if (err.status === 400) {
        Swal.fire({
          text: err.error.Message,
          icon: 'error'
        });
        return;
      } else if (err.status === 500) {
        Swal.fire({
          text: err.error.Message,
          icon: 'error'
        });
        return;
      }
    });
  }

  async ListarEstados() {
    await this.serviceGeneric.consultarEstado().then((data) => {
      this.LtsEstad = data;
      this.ConsultarEstadoTransaccion();
    });
  }

  async ConsultarEstadoTransaccion() {
    await this.serviceGeneric.ConsultarEstadoTransaccion().then((data) => {
      this.LtsEstado = data;
      this.valores = this.ServicioPuente.obtener();
      if (this.valores.tipoServ == 2 || this.valores.tipoServ == 3) {
        $('#selTipoSer').val(String(this.valores.tipoServ));
        this.mostrarNSolicitudCTS = true;
        this.nSolicitud = this.valores.nsoliCTS;
      }
    }).catch(err => {
      if (err.status === 400) {
        Swal.fire({
          text: err.error.Message,
          icon: 'error'
        });
        return;
      } else if (err.status === 500) {
        Swal.fire({
          text: err.error.Message,
          icon: 'error'
        });
        return;
      }
    });
  }

  LimpiarFormulario() {
    $('#SelProcedimiento').val(0);
    this.mostrarNSolicitudCTS = false;
    $('#idtransaccion').val("");
    $('#idsolicitudAth').val("");
    $('#fechaIni').val("");
    $('#fechafin').val("");
    $('#documento').val("");
    $('#SelEstado').val(0);
    $('#selMedioPa').val(0);
    $('#selTipoSer').val(0);
    $('#numSolicitud').val('');
    this.show = false;
  }

  validarFecha(fecha, bandera) {
    let transformada = fecha.split("-")
    if (bandera == 1) {
      if (transformada[0] > this.currentYear) {
        $('#fechaIni').val("");
      }
    } else {
      if (transformada[0] > this.currentYear) {
        $('#fechafin').val("");
      }
    }
  }
}
