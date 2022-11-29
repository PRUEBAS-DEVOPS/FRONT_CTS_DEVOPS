import { Component, OnInit } from '@angular/core';
import { CrearsedeService } from 'src/app/services/CrearSedes/crearsede.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-reporte-formularios',
  templateUrl: './reporte-formularios.component.html',
  styleUrls: ['./reporte-formularios.component.css']
})
export class ReporteFormulariosComponent implements OnInit {
  ArraySedes: any;
  hoy: string;
  currentYear: number;
  subMenuUser: any;
  constructor(private _SedeService: CrearsedeService, private _ServiceVentas:VentasService,private ValidarPermisos: ValidarPermisos, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.ArraySedes = await (await this._SedeService.getAllsede()).filter(s => s.EstadoBool == true);
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


  async GenerarExcel() {
    let fechaIni = $("#fechaIni").val();
    let fechafin = $("#fechafin").val();
    let selTipoFormulario = $("#selTipoFormulario").val();
    let selSede = $("#selSede").val();
    if(selTipoFormulario!=0){
      this.VentanaCarga();
      this._ServiceVentas.GenerarExecelReporteFormulario(fechaIni,fechafin,selTipoFormulario,selSede).then(response=>{
        if(response!=''){
          Swal.close();
          this.base64ToBlob(response);
        }else{
          Swal.fire({
            icon: 'info',
            text: 'Para los filtros seleccionados no se encontro información',
            showConfirmButton:true
          });
        }
      });
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Para continuar con el proceso es necesario seleccionar un tipo de formulario',
        showConfirmButton:true
      });
    }
  }

  VentanaCarga() {
    let timerInterval
    Swal.fire({
      title: 'Cargando....',
      html: 'Estamos consultando la información',
      timer: 30000,
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
    FileSaver.saveAs(data, 'ReporteFormulario_' + new Date().getTime())
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
