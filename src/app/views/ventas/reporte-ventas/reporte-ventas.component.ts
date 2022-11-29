import { Component, OnInit } from '@angular/core';
import { CrearUsuario } from 'src/app/models/CrearUsuarioModel/CrearUsuario.model';
import { Arqueo } from 'src/app/models/Ventas/Ventas.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { List } from 'linqts';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { ITable } from 'pdfmake-wrapper/lib/interfaces'
type TableRow = [string, string, string, string, string, string, string,string]
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit {
  show = false;
  Asesores: CrearUsuario[];
  DataArqueo: Arqueo[];
  DataExcel: Arqueo[];
  PaginationArqueo = 1;
  TotalFinal: any;
  hoy: string;
  currentYear: number;
  subMenuUser: any;
  constructor(private ServiceGeneric: GenericoService, private ServiceVentas: VentasService,private ValidarPermisos: ValidarPermisos, private router: Router) { }

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date =today.getFullYear()+"-"+String((today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+day[2]
    this.hoy = date
    this.currentYear = today.getFullYear();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }


  async consultar() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    // var Asesor = $('#SelAsesor').val();
    if (fechaIni != '' || fechafin != '') {
      await this.ServiceVentas.ConsultarReporteVentas(fechaIni, fechafin,).then((data) => {
        if (data.length > 0) {
          this.DataArqueo = data;
          this.show = true;
        }
        else{
          this.Sindatos();
          return;
        }
      }).catch(err => {
        if (err.status === 400) {
          Swal.fire({
            text: err.error.ExceptionMessage,
            icon: 'error'
          });
          return;
        } else if (err.status === 500) {
          Swal.fire({
            text: err.error.ExceptionMessage,
            icon: 'error'
          });
          return;
        }
      });;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Ingrese los filtros necesarios'
      });
    }//ExceptionMessage
  }

  Sindatos(){
    Swal.fire({
      icon: 'info',
      title: 'Opps...',
      text: 'Para los filtros seleccionados no existe información',
      showConfirmButton: true
    });
  }

  async ConsultarAsesor() {
    await this.ServiceGeneric.ConsultarAsesores().then((data) => {
      this.Asesores = data;

    });
  }

  async downloadExcel() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    await this.ServiceVentas.GenerarExcelReporteVentas(fechaIni, fechafin).subscribe((resp) => {
      this.base64ToBlob(resp);
    })
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
    const data: Blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(data, 'ReporteVentas_' + new Date().getTime())
  }

  async generarPdf() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    let Lstarqueo = new List<Arqueo>();
    var total = 0;
    for (const datosArqueo of this.DataArqueo) {
      let arqueo = new Arqueo();
      arqueo.FechaVenta = datosArqueo.FechaVenta;
      arqueo.NoFactura = datosArqueo.NoFactura;
      arqueo.MedioPago = datosArqueo.MedioPago;
      arqueo.NombreCompleto = datosArqueo.NombreCompleto;
      arqueo.paciente = datosArqueo.paciente;
      arqueo.Documento = datosArqueo.Documento;
      arqueo.TotalVenta = formatCurrency(Number(datosArqueo.TotalVenta), 'es-CO', getCurrencySymbol('$', 'wide'));
      arqueo.NumTransaccion = datosArqueo.NumTransaccion;
      Lstarqueo.Add(arqueo);
      total += Number(datosArqueo.TotalVenta);
    }

    this.TotalFinal = total;
    const pdf = new PdfMakeWrapper();
    //'FOLIO', 'LEGAL', 'LETTER','TABLOID'
    pdf.pageSize('LEGAL');
    pdf.add(await (await (await new Img('assets/images/logo.png').alignment('right').width(180).margin([0, 0, 10, 17]).build())));
    pdf.add(new Txt('Reporte Ventas').alignment('center').italics().bold().fontSize(25).end)
    pdf.add(new Txt('Desde ' + fechaIni + ' Hasta ' + fechafin).alignment('left').italics().bold().margin([0, 20, 10, 17]).end)
    pdf.add(this.createTablePdf(Lstarqueo.ToArray()));
    pdf.add(new Txt('Total  ' + formatCurrency(this.TotalFinal, 'es-CO', getCurrencySymbol('$', 'wide'))).alignment('right').italics().bold().margin([0, 20, 10, 17]).end)
    pdf.create().open();
  }

  createTablePdf(data: Arqueo[]): ITable {
    return new Table([
      ['Fecha venta', 'Factura', 'Medio de pago', 'No Transacción', 'Usuario Atención','Paciente', 'Documento paciente', 'Total venta'],
      ...this.ExtracData(data)
    ])
      .layout('lightHorizontalLines').alignment('center').heights(rowIndex => { return rowIndex == 0 ? 40 : 0 }).widths('auto').fontSize(8)
      .end
  }

  ExtracData(data: Arqueo[]): TableRow[] {
    return data.map(row => [row.FechaVenta, row.NoFactura, row.MedioPago, row.NumTransaccion, row.NombreCompleto, row.paciente, row.Documento, row.TotalVenta]);
  }

  LimpiarFormulario() {
    $('#fechaIni').val("");
    $('#fechafin').val("");
    $('#SelAsesor').val(0);
    this.show = false
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
