import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { cotizaciones } from 'src/app/models/cotizacion/cotizacion.model';
import { CrearUsuario } from 'src/app/models/CrearUsuarioModel/CrearUsuario.model';
import { GenericTipoDoc } from 'src/app/models/Generic/Generic.model';
import {  
  Chequeos,
  Examenes,
  Planes,
} from 'src/app/models/Ventas/Ventas.model';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-historial-cotizacion',
  templateUrl: './historial-cotizacion.component.html',
  styleUrls: ['./historial-cotizacion.component.css'],
})
export class HistorialCotizacionComponent implements OnInit {
  Asesores: CrearUsuario[];
  VerDatos = false;
  form: FormGroup;
  DataGeneral: cotizaciones[];
  DataDetalle: cotizaciones[];
  DataProcedimientos: Planes[];
  DetalleExamCheck: Examenes[];
  Recomendacion: any;
  GesCheck: Chequeos[];
  GesDocument: GenericTipoDoc[];
  IdChequeoSelect: number;
  InfoComplementaria: cotizaciones[];
  Datos: any;
  DataDetallePrin: cotizaciones[];
  TablaExamenes: boolean = false;
  CodigoExamen: any;
  paginahisto = 1;
  Filtro: any;
  NombrePaciente: any;
  InfoComple: any;

  PrimerNombre: string;
  SegundoNombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  correo: string;
  telefono: string;
  Direccion: string;
  submit: boolean;
  tipoDoc: Number;
  Doc: string;
  mostar: any;
  ocular: boolean;
  TotalFinalPdf:any;
  GlobalCotizacion: any;
  hoy: string;
  currentYear: number;
  subMenuUser: any;

  constructor(
    private ServiceGeneric: GenericoService,
    private servicesCotizacion: CotizacionService,
    private ServiceVentas: VentasService,
    private fb: FormBuilder,
    private router: Router,private ValidarPermisos:ValidarPermisos
  ) { }

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.ConsultarAsesor();
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date =today.getFullYear()+"-"+String((today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+day[2]
    this.hoy = date
    this.currentYear = today.getFullYear();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url,this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async ListarGeneral() {
    // this.noregistrado = true;
    await this.servicesCotizacion
      .ConsultarCotizacion('', '', 0)
      .subscribe((data) => {
        this.InfoComplementaria = data;
      });
  }

  async consultar() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var Asesor = $('#SelAsesor').val();
    if (fechaIni != '' || fechafin != '' || Asesor != '0') {
      await this.servicesCotizacion
        .ConsultarCotizacion(moment(fechaIni).locale('es-CO').format('DD/MM/YYYY'),moment(fechafin).locale('es-CO').format('DD/MM/YYYY'),
          Number(Asesor)).subscribe((data) => {
          if(data.length>0){
            this.DataGeneral = data;
            this.VerDatos = true;
          }else{
            this.MensajeSinDatos();
            return;
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Ingrese los filtros necesarios',
        showConfirmButton: true,
      });
    }
  }

  MensajeSinDatos(){
    Swal.fire({
      icon: 'info',
      title: 'Opps...',
      text: 'Para los filtros seleccionados no hay información',
      showConfirmButton: true,
    }).then(result=>{
      this.LimpiarFormulario();
    });
  }

  async Verdetalle(id) {
    this.GlobalCotizacion=id;
    await this.servicesCotizacion.DetalleCotizacion(id).subscribe((data) => {
      this.DataDetalle = data;
      (<any>$('#Verdetalle')).modal('show');
      this.DataDetallePrin = this.InfoComplementaria.filter((x) => x.id === id);
    });
  }

  async CrearPaciente(id) {
    this.consultarDocumento();
    this.DataDetallePrin = this.InfoComplementaria.filter((x) => x.id === id);

    for (let item of this.DataDetallePrin) {
      item.Nombres.split(' ');
      this.PrimerNombre = item.Nombres.split(' ')[0];
      this.SegundoNombre = item.Nombres.split(' ')[1];
      this.PrimerApellido = item.Nombres.split(' ')[2];
      this.SegundoApellido = item.Nombres.split(' ')[3];
      this.correo = item.Correo;
      this.telefono = item.Telefono;
      this.Direccion = item.Direccion;
    }
    (<any>$('#CrearPaciente')).modal('show');
  }

  InputTipodocumen($event) {
    this.tipoDoc = $event.target.value;
  }

  inputDocument($envet) {
    this.Doc = $envet.target.value;
  }

  async enviarpaciente() {
    const DatosBasicos = {
      tipodocumento: this.tipoDoc,
      documento: this.Doc,
      PrimNombre: this.PrimerNombre,
      segundoNom: this.SegundoNombre,
      primApell: this.PrimerApellido,
      segunApe: this.SegundoApellido,
      email: this.correo,
      tel: this.telefono,
      Direc: this.Direccion,
    };
    sessionStorage.setItem('DatosBasicosCoti', JSON.stringify(DatosBasicos));
    this.router.navigate(['/pacientes']);
  }

  async ListarExamenesChequeo(Id) {
    await this.ServiceVentas.ConsultarExamChequeo(String(Id), 1).subscribe(
      (data) => {
        if (data.length > 0) {
          this.DetalleExamCheck = data;
          this.TablaExamenes = true;
          this.ListarChequeos(Id);
          (<any>$('#AgregarExamen')).modal('show');
        } else {
          this.TablaExamenes = false;
        }
      }
    );
  }

  async ConsultarAsesor() {
    await this.ServiceGeneric.ConsultarAsesores().then((data) => {
      this.Asesores = data;
      this.ListarGeneral();
    });
  }

  async consultarDocumento() {
    this.ServiceGeneric.ConsultarTipoDoc().then((data) => {
      this.GesDocument = data;
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
    });;;
  }

  async ListarChequeos(Cheq) {
    await this.ServiceVentas.ConsultarChequeos().subscribe((data) => {
      this.GesCheck = data;
      this.Recomendacion = this.GesCheck.filter((x) => x.CodAthenea === Cheq);
    });
  }

  async downloadExcel() {
    var fechaIni = $('#fechaIni').val();
    var fechafin = $('#fechafin').val();
    var Asesor = $('#SelAsesor').val();
    await this.servicesCotizacion.GenerarExcel( moment(fechaIni).locale('es-CO').format('DD/MM/YYYY'),
    moment(fechafin).locale('es-CO').format('DD/MM/YYYY'), Asesor).subscribe((resp) => {
      this.base64ToBlob(resp);
    })
  }

  public base64ToBlob(b64Data, sliceSize = 512) {
    let byteCharacters = atob(b64Data);
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
    FileSaver.saveAs(data, 'ReporteCotizacion_' + new Date().getTime())
  }

  async generarPdf() {
    await  this.servicesCotizacion.GenerarPDFHistorial(this.GlobalCotizacion).then(response=>{
     this.base64ToPDF(response);
     })
   }

   public base64ToPDF(b64Data, sliceSize = 512) {
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
     FileSaver.saveAs(data, 'Cotizacion_' + new Date().getTime())
   }

  LimpiarFormulario(){
    $('#fechaIni').val("");
    $('#fechafin').val("");
    $('#SelAsesor').val(0);
    this.VerDatos = false;
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
