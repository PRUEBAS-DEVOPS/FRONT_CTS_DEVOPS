import { Component, OnInit } from '@angular/core';
import { PaternidadService } from 'src/app/services/Paternidad/PaternidadService.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consulta-resultados',
  templateUrl: './consulta-resultados.component.html',
  styleUrls: ['./consulta-resultados.component.css']
})
export class ConsultaResultadosComponent implements OnInit {
  Pagina: number = 1;
  totalRecords: number;
  LtsOpc: any;
  file: any;
  ArrayGeneral: any;
  verTablaGeneral: boolean = false;
  documento: any;
  nombres: any;
  Idresultado: any;
  ArrayHistResult: any;
  IdUsuario: any;
  arrayDetalle: any;
  subMenuUser: any;
  constructor(private _ServicePaternidad: PaternidadService, private _ServiceGenerico: GenericoService,private router: Router,
    private ValidarPermisos: ValidarPermisos) { }

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.ListarOpciones();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async ListarOpciones() {
    const IdCategoria = 2;
    await this._ServiceGenerico.ConsultarOpciones(IdCategoria).then((data) => {
      this.LtsOpc = data
      //this.ValidarOpciones();
    });
  }

  Paginar(event) {
    this.Pagina = event;
    this.ValidarOpciones();
  }

  AccionClick(idOpc, IdSolicitud) {
    switch (idOpc) {
      case 4:
        this.DetalleSolicitud(IdSolicitud);
        break;
      case 5:
        this.DescargarResultado(IdSolicitud);
        break;

    }
  }

  async DetalleSolicitud(idsolicitud) {
   this.arrayDetalle=await this._ServicePaternidad.ConsultarDetalleSolicitud(idsolicitud);
   (<any>$('#DivDetalleResultado')).modal('show');
  }

  async DescargarResultado(IdSolicitud) {
    this.VentanaCarga();
    await this._ServicePaternidad.ConsultarDocumento(IdSolicitud,this.IdUsuario).then(response => {
      this.base64ToBlob(response);
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
    Swal.close();
    const data: Blob = new Blob(byteArrays, { type: 'application/pdf' });
    FileSaver.saveAs(data, 'PdfResultado')

  }

  async ValidarOpciones() {    
    for (const data of this.ArrayGeneral) {
      var estado = data.EstadoResultado;
      if (estado == "En espera Resultado") {
        setTimeout(() => {
          //document.getElementById("Descargar" + data.IdSolicitudAthenea).style.display = 'none';
          $("#Descargar" + data.IdSolicitud).hide()
        }, 1500);
      } else {
        setTimeout(() => {
          //document.getElementById("Descargar" + data.IdSolicitudAthenea).style.display = 'block';
          $("#Descargar" + data.IdSolicitud).show()
        }, 1500);
      }
    }
  }



  async Consultar() {
    let fechaini = $("#txtfechaini").val();
    let fechaFin = $("#txtfechafin").val();
    let nosolicitud = $("#txtnosolicitud").val();
    let estado = $("#Selestado").val();
    if (fechaini != '' || fechaFin != '' || nosolicitud != '' || estado != '0') {
      this.ArrayGeneral = await this._ServicePaternidad.ConsultarResultados(fechaini, fechaFin, nosolicitud, estado,this.IdUsuario);
      this.ValidarOpciones();
      this.verTablaGeneral = true;
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Opps...',
        text: 'Debes seleccionar un parametro de busqueda',
        showConfirmButton: true
      });
    }
  }

  limpiarFiltros() {
    $("#txtfechaini").val("");
    $("#txtfechafin").val("");
    $("#txtnosolicitud").val("");
    $("#Selestado").val("0");
    this.verTablaGeneral = false;
  }

  async ConsultarEnvios(idResultado) {
    //this.documento = documento;
    //this.nombres = nombres;
    this.Idresultado = idResultado;
    await this._ServicePaternidad.ConsultarLogEnvios(idResultado).then(response => {
      this.ArrayHistResult = response;
      (<any>$('#DivEnvio')).modal('show');
    });
  }

  async EnviarNotificacionResultados() {
    const correoEnvio = $("#CorreoEnvio").val()
    await this._ServicePaternidad.EnviarResultados(this.Idresultado, correoEnvio, this.documento, this.nombres, 2).then(response => {
      this.ArrayHistResult = response;
      Swal.fire({
        icon: 'success',
        title: response.toString(),
        showConfirmButton: true
      });
    });
  }

  VentanaCarga() {
    let timerInterval
    Swal.fire({
      title: 'Cargando....',
      html: 'Estamos generando tú resultado',
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

}
