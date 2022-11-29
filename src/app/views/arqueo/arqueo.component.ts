import { Component, OnInit } from '@angular/core';
import { List } from 'linqts';
import { CrearUsuario } from 'src/app/models/CrearUsuarioModel/CrearUsuario.model';
import { Arqueo } from 'src/app/models/Ventas/Ventas.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { PdfMakeWrapper, Table, Img, Txt } from 'pdfmake-wrapper'
import { ITable } from 'pdfmake-wrapper/lib/interfaces'
type TableRow = [string, string, string, string, string, string, string, string]
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arqueo',
  templateUrl: './arqueo.component.html',
  styleUrls: ['./arqueo.component.css']
})
export class ArqueoComponent implements OnInit {
  show = false;
  Asesores: CrearUsuario[];
  DataArqueo: Arqueo[];
  DataExcel: Arqueo[];
  PaginationArqueo = 1;
  TotalFinal: any;
  hoy: string;
  currentYear: number;
  subMenuUser: any;
  constructor(private ServiceGeneric: GenericoService, private ServiceVentas: VentasService, private router: Router, private ValidarPermisos: ValidarPermisos) { }
  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.ConsultarAsesor();
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date = today.getFullYear() + "-" + String((today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1)) + "-" + day[2]
    this.hoy = date
    this.currentYear = today.getFullYear();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta, permisos) {
    this.ValidarPermisos.validarPermisos(ruta, permisos);
  }


  async consultar() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var Asesor = $('#SelAsesor').val();
    if (fechaIni != '' || fechafin != '' || Asesor != '0') {
      await this.ServiceVentas.ConsultarArqueo(fechaIni, fechafin, Asesor).then((data) => {
        this.DataArqueo = data;
        this.show = true;
      }).catch(err => {
        if (err.status === 400) {
          Swal.fire({
            title: err.error.Message,
            text: err.error.ExceptionMessage,
            icon: 'error'
          });
          return;
        } else if (err.status === 500) {
          Swal.fire({
            title: err.error.Message,
            text: err.error.ExceptionMessage,
            icon: 'error'
          });
          return;
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Ingrese los filtros necesarios'
      });
    }//ExceptionMessage
  }

  async ConsultarAsesor() {
    await this.ServiceGeneric.ConsultarAsesores().then((data) => {
      this.Asesores = data;

    });
  }

  ventanaCarga() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Cargando información'
    });
    Swal.showLoading();
  }

  async downloadExcel() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var Asesor = $('#SelAsesor').val();
    this.ventanaCarga()
    await this.ServiceVentas.GenerarExcel(fechaIni, fechafin, Asesor).subscribe((resp) => {
      this.base64ToBlob(resp);
    })
    Swal.close();
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
    FileSaver.saveAs(data, 'ReporteArqueo_' + new Date().getTime())
  }

  async generarPdf() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var Asesor = $('#SelAsesor').val();
    this.ventanaCarga()
    await this.ServiceVentas.GenerarPDF(fechaIni, fechafin, Asesor).then((resp) => {
      this.base64ToBlobPDF(resp);
    })
    Swal.close();
  }

  public base64ToBlobPDF(b64Data, sliceSize = 512) {
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
    FileSaver.saveAs(data, 'Arqueo_' + new Date().getTime())
  }

  LimpiarFormulario() {
    $('#fechaIni').val("");
    $('#fechafin').val("");
    $('#SelAsesor').val(0);
    this.show = false
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
