import { Component, OnInit } from '@angular/core';
import { List } from 'linqts';
import { Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { LogSistema } from 'src/app/models/LogSistema/Log.model';
import { GestionUsuarioService } from 'src/app/services/gestionuser/gestion-usuario.service';
import { LogSistemaService } from 'src/app/services/Log/log-sistema.service';
import Swal from 'sweetalert2';
type TableRow=[string,string,string,string,string]
import * as FileSaver from 'file-saver';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-sistema',
  templateUrl: './log-sistema.component.html',
  styleUrls: ['./log-sistema.component.css'],
})
export class LogSistemaComponent implements OnInit {
  DataLog: LogSistema[];
  show = false;
  PaginaLog: number = 1;
  LtsUsuarios: any;
  hoy: string;
  currentYear: any;
  subMenuUser: any;
  constructor(private servicesLog: LogSistemaService,private ServiceUsuario: GestionUsuarioService,    
    private router: Router,
    private ValidarPermisos: ValidarPermisos) {}

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.ConsultarUsuarios();
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date =today.getFullYear()+"-"+String((today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+day[2]
    this.hoy=date
    this.currentYear = today.getFullYear();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async ConsultarUsuarios(){
    this.ServiceUsuario.getAllUser().then(data=>{
     this.LtsUsuarios=data;
   })
 }


 VentanaCarga() {
   let timerInterval
   Swal.fire({
     title: 'Cargando....',
     html: 'Estamos consultando la información',
     timer: 2000,
     timerProgressBar: true,
     didOpen: () => {
       Swal.showLoading()
       timerInterval = setInterval(() => {
         const content = Swal.getHtmlContainer()
         if (content) {
           const b = content.querySelector('b')
           if (b) {
             b.textContent = Swal.getTimerLeft().toString();
           }
         }
       }, 100)
     },
     willClose: () => {
       clearInterval(timerInterval)
     }
   }).then((result) => {
     /* Read more about handling dismissals below */
     if (result.dismiss === Swal.DismissReason.timer) {

     }
   })
 }

  async consultar() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var usuario = $('#usuario').val();


    if (fechaIni != '' || fechafin != '' || usuario != '0'  ) {
      this.VentanaCarga();
      await this.servicesLog
        .ConsultarLOG(fechaIni, fechafin, usuario)
        .then((data) => {
          this.DataLog = data;
          this.show = true;
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Opps...',
        text: 'Seleccione al menos un filtro',
        showConfirmButton: true,
      });
    }
  }

  async downloadExcel() {
    let fechaIni = $('#fechaIni').val();
    let fechafin = $('#fechafin').val();
    let usuario = $('#usuario').val();
    this.VentanaCarga();
    await this.servicesLog.GenerarExcel(fechaIni, fechafin, usuario).then(response=>{
      Swal.close();
      this.base64ToBlob(response);
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
    FileSaver.saveAs(data, 'ReporteAuditoria_' + new Date().getTime())
  }

  async generarPdf() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    let ListLog = new List<LogSistema>();
    for(const datosLog of this.DataLog){
      let LogSistem = new LogSistema();
      LogSistem.Accion = datosLog.Accion;
      LogSistem.Tabla = datosLog.Tabla;
      LogSistem.Peticion = datosLog.Peticion;
      LogSistem.NombreUsuario = datosLog.NombreUsuario;
      LogSistem.FechaAuditoria = datosLog.FechaAuditoria;
      ListLog.Add(LogSistem);
    }

    const pdf= new PdfMakeWrapper();
    pdf.pageSize('TABLOID');
    pdf.add( await (await (await new Img('assets/images/logo.png').alignment('right').width(180).margin([0, 0,10, 17 ]).build())));
    pdf.add(new Txt('Log del Sistema').alignment('center').italics().bold().fontSize(25).end)
    pdf.add(new Txt('Desde '+ fechaIni + ' Hasta '+ fechafin).alignment('left').italics().bold().margin([0, 20,10, 17 ]).end)
    pdf.add(this.createTablePdf(ListLog.ToArray()));
    pdf.create().open();
}

createTablePdf(data:LogSistema[]):ITable{
  return new Table([
     ['Accion','Tabla Afectada', 'Peticion','Usuario','fecha'],
     ...this.ExtracData(data)
  ])
  .layout('lightHorizontalLines').alignment('center').heights(rowIndex=>{return rowIndex==0?40:0}).widths([100,100,200,100,150])
  .end
}

ExtracData(data:LogSistema[]): TableRow[]{
  return data.map(row=> [row.Accion,row.Tabla,row.Peticion,row.NombreUsuario,row.FechaAuditoria]);
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
