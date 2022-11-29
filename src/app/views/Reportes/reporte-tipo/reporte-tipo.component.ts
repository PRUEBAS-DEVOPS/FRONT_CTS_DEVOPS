import { Component, OnInit } from '@angular/core';
import { ReportTipoService } from 'src/app/services/Reportes/report-tipo.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-tipo',
  templateUrl: './reporte-tipo.component.html',
  styleUrls: ['./reporte-tipo.component.css']
})
export class ReporteTipoComponent implements OnInit {
  
  mediosPago:any;
  subMenuUser: any;
  constructor(private ReportService: ReportTipoService, private MediosPagoService: VentasService,  private router: Router,
    private ValidarPermisos: ValidarPermisos) { }

  ngOnInit(): void {
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
    this.ConsultaMediosPago();
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }


  async ConsultaMediosPago() {
    await this.MediosPagoService.ConsultarMediosPago().then((data) => {
      this.mediosPago = data;
      this.mediosPago=this.mediosPago.filter(m=> m.id===1 ||m.id===4 || m.id===16)      
    });
  }

  async downloadExcel() {
    var fechaIni = $('#fechaIni').val();
    var tipo = $('#Seltipo').val();
    if (fechaIni != '' || tipo != '0') {
      await this.ReportService.ConsultarReporte(fechaIni, tipo).then((response) => {
        if(response==="0"){
          Swal.fire({
            icon:'warning',
            title: 'Opps...',
            text: 'Para los filtros seleccionados no hay datos',
            showConfirmButton: true
          }).then(result=>{
            if(result.isConfirmed){
              this.LimpiarFormulario();
            }
          })
        }else{
          this.base64ToBlob(response);      
        }
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
    FileSaver.saveAs(data, 'Reporte_' + new Date().getTime())
  }

  LimpiarFormulario() {
    $('#fechaIni').val("");
    $('#fechafin').val("");
    $('#Seltipo').val(0);
  }

}
