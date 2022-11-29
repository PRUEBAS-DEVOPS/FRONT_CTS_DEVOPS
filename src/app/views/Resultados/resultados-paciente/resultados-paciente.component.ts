import { Component, OnInit } from '@angular/core';
import { ServiceResultadosService } from 'src/app/services/ServiceResultados/service-resultados.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultados-paciente',
  templateUrl: './resultados-paciente.component.html',
  styleUrls: ['./resultados-paciente.component.css']
})

export class ResultadosPacienteComponent implements OnInit {
  ArrayData: any[];
  ArrayHistResult: any[];
  VisualizarDiv: boolean = false;
  paginador: number = 1;
  documento: string;
  nombres: string;
  Idresultado: number;
  LtsOpc: any[];
  ArrayDataDetalle: any[];
  Porcentaje: number;
  paginaResultados: number = 1;
  hoy: string;
  currentYear: number;
  subMenuUser: any;
  constructor(private ServiceResultado: ServiceResultadosService, private serviceGeneric: GenericoService, private router: Router,
    private ValidarPermisos: ValidarPermisos) { }

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date =today.getFullYear()+"-"+String((today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+day[2]
    this.hoy = date
    this.currentYear = today.getFullYear();
    // Swal.fire({
    //   title: 'Estamos cargando información',
    //   icon: 'warning',
    //   timer: 30000,
    //   timerProgressBar: true,
    //   allowOutsideClick: false,
    //   showConfirmButton: false,
    // });
    //this.ValidacionResultados();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
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

  NoExisteInformacion(){
    Swal.fire({
      icon: 'info',
      title: 'Opps...',
      text: 'Para los filtros seleccionados no hay información',
      showConfirmButton: true,
    }).then(result=>{
      this.LimpiarFormulario();
    });
  }

  async Consultar() {
    this.VentanaCarga();
    const fechaCreI = $("#txtfechaIniCre").val()
    const fechaCreF = $("#txtfechaFinCre").val()
    const documento = $("#txtdocumento").val()
    const idsolicitud = $("#txtIdSol").val()
    const estado = $("#SelEstado").val()
    const fechaRecI = $("#txtfechaIniRec").val()
    const fechaRecF = $("#txtfechaFinRec").val()
    if (fechaCreI == "" && fechaCreF == "" && documento == "" && idsolicitud == "" && estado == "0" && fechaRecI == "" && fechaRecF == "") {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Ingrese al menos un filtro para continuar',
      });
    } else {
      const Filtro = {
        Documento: documento,
        FechaIniSol: fechaCreI,
        FechaFinSol: fechaCreF,
        FechaIniRecp: fechaRecI,
        FechaFinRecp: fechaRecF,
        IdSolicitudAthenea: idsolicitud,
        Recepcion: estado
      }
      await this.ServiceResultado.ConsultarResultados(Filtro).then(response => {
        if(response.length>0){
          Swal.close();
          this.ArrayData = response;
          this.VisualizarDiv = true;
          this.ListarOpciones();
        }else{
          this.NoExisteInformacion();
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
      });
    }
  }

  async ValidarEnvio(idResultado, documento, nombres) {
    this.documento = documento;
    this.nombres = nombres;
    this.Idresultado = idResultado;
    await this.ServiceResultado.ConsultarHistorialEnvios(idResultado).subscribe(response => {
      this.ArrayHistResult = response;
      (<any>$('#DivEnvio')).modal('show');
    });
  }

  async EnviarNotificacionResultados() {
    const correoEnvio = $("#CorreoEnvio").val()
    await this.ServiceResultado.EnvioNotificacionResultados(this.Idresultado, correoEnvio, this.documento, this.nombres, 1).subscribe(response => {
      this.ArrayHistResult = response;
      Swal.fire({
        icon: 'success',
        title: response.toString(),
        showConfirmButton: true
      });
    });
  }

  async ValidacionResultados(){
    await this.ServiceResultado.ValidarResultados().then(response=>{
      // Swal.fire({
      //   icon: 'success',
      //   title: response.toString(),
      //   showConfirmButton: true
      // });
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
    });
  }

  async ListarOpciones() {
    const IdCategoria = 2;
    await this.serviceGeneric.ConsultarOpciones(IdCategoria).then((data) => {
      this.LtsOpc = data
      this.ValidarOpciones();
    });
  }

  Paginar(event) {
    this.paginaResultados = event;
    this.ValidarOpciones();
  }

  async ValidarOpciones() {
    for (const data of this.ArrayData) {
      var estado = data.EstadoResultado;
      if (estado == "En espera Resultado") {
        setTimeout(() => {
          //document.getElementById("Descargar" + data.IdSolicitudAthenea).style.display = 'none';
          $("#Descargar" + data.IdSolicitudAthenea).hide()
        }, 1500);
      } else {
        setTimeout(() => {
          //document.getElementById("Descargar" + data.IdSolicitudAthenea).style.display = 'block';
          $("#Descargar" + data.IdSolicitudAthenea).show()
        }, 1500);
      }
    }
  }

  AccionClick(idOpc, idResultado, idAthenea, porcentaje) {
    switch (idOpc) {
      case 4:
        this.VerDetalle(idResultado, idAthenea, porcentaje);
        break;
      case 5:
        this.downloadPDF(idResultado);
        break;
    }
  }

  async VerDetalle(id, idathenea, porcentaje) {
    this.Porcentaje = porcentaje;
    await this.ServiceResultado.ConsultarDetalleResultados(id, idathenea).subscribe(response => {
      this.ArrayDataDetalle = response;
      (<any>$('#DivDetalle')).modal('show');
    });

  }

  async downloadPDF(id) {
    await this.ServiceResultado.ObtenerBase64Resultados(id).then(response=>{
      this.base64ToBlob(response);
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
    FileSaver.saveAs(data, 'Resultados_' + new Date().getTime())
  }

  LimpiarFormulario() {
    $("#txtfechaIniCre").val("")
    $("#txtfechaFinCre").val("")
    $("#txtdocumento").val("")
    $("#txtIdSol").val("")
    $("#SelEstado").val(0)
    $("#txtfechaIniRec").val("")
    $("#txtfechaFinRec").val("")
    this.VisualizarDiv = false;
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
