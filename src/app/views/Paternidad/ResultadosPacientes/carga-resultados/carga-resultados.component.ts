import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaternidadService } from 'src/app/services/Paternidad/PaternidadService.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { GenericGenero } from 'src/app/models/Generic/Generic.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { ClientesService } from 'src/app/services/Preatencion/clientes.service';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carga-resultados',
  templateUrl: './carga-resultados.component.html',
  styleUrls: ['./carga-resultados.component.css']
})
export class CargaResultadosComponent implements OnInit {
  ArrayGeneral: any;
  ArrayProcedimientos: any;
  Vertabla: boolean = false;
  Pagina: number = 1;
  PaginaPaciente: number = 1;
  VerPrincipal: boolean = true;
  VerValidacion: boolean = false;
  fechaSolicitud: any;
  numerosolicitud: any;
  examen: any;
  pacienteActualizar: any;
  ArrayPacientes: any;
  IdSolicitud: number;
  GesDocument: any;
  submit: boolean;
  GesGenero: GenericGenero[];
  formularioPacientes: boolean;
  file: any;
  nameFile: string = 'Arrastra y suelta tu documento legal o haz clic aquí';
  TextComentario: string = 'Diligencia este campo con  los comentarios del resultado';
  IdUsuario: any;
  mensajeRespuesta: any;
  color: string;
  menordeedad: boolean;
  Arraytipodocumento: any;
  Pacienteexistente: boolean;
  Arraylocalidad: any;
  ArrayBarrio: any;
  formPacientes: FormGroup;
  PacienteExt: any;
  botonCerrar: boolean = true;
  pacientenuevo: boolean;
  banderArchivo: any;
  showAge: any;
  PacienteCre: any;
  verEmbarazo: boolean = false;
  showModalAlert: boolean;
  disabled: boolean = true;
  pacienteActualizado: boolean;
  disabledImprimir: boolean = true;
  textoBadge: string = 'Por validar';
  ArrayDetalle: any;
  CorreoEnvio: any;
  ArrayMuestra: any;
  ArrayEstadoCivil: any;
  ArrayTipAfiliacion: any;
  ArrayPais: any;
  ArrayDepart: any;
  ArrayEstr: any;
  ArrayEps: any;
  ArrayParentesco: any[];
  ArrayDiscapacidad: any[];
  ArrayGenero: any;
  ArrayCity: any;
  BandValidar: boolean;
  IdAcudiente: any;
  BtnVerAcudiente: boolean;
  idpaciente: number;
  keyword = 'NombreProcedimiento'
  procedimiento: string;
  disabledCargue: boolean = false;
  disabledComentario: boolean = false;
  archivo: any;
  contador_validar: number = 0;
  @ViewChild('auto') auto;
  extencionIncorrect: boolean=false;
  disabledValidar: boolean=true;
  subMenuUser: any;
  constructor(private _paternidadService: PaternidadService, private _ServicePaternidad: PaternidadService, private ServicePaciente: ClientesService,
     private _ventasService: VentasService, private _serviceGenerico: GenericoService,
      private _PacienteService: ClientesService, private formbuilder: FormBuilder, 
      private ServiceGenerico: GenericoService,   private router: Router,
      private ValidarPermisos: ValidarPermisos) { }


  ngOnInit(): void {
    this.CargarInfoGeneral();
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.formPacientes = this.formbuilder.group({
      id: [''],
      documento: ['', [Validators.required]],
      tipodocumento: [''], fechanacimiento: [''],
      primerNombre: ['', [Validators.required]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''], PoliticaDatos: [''], correo: [''],
      telefono: ['', [Validators.required]],
      celular: [''], direccion: ['', [Validators.required]],
      Idciudad: ['', [Validators.required]],
      Idbarrio: [''], Idestadocivil: ['', [Validators.required]],
      Idestrato: ['', [Validators.required]],
      IdTipAfil: ['', [Validators.required]],
      NombreBarrio: [''], Idsexo: ['', [Validators.required]],
      IdDepto: ['', [Validators.required]],
      IdLocalidad: [''], Pais: ['161'], IdEps: [''], edad: [''],
      AbreviaturaTipodoc: [''],
      IdParentesco: ['0'],
      bandera_origen: [''],
      IdSolicitud: [''],
      embarazo: ['0'],
      discapacidad: ['0'],
      IdUsuario: this.IdUsuario,
    });
    
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.ValidarAccesos(this.router.url, this.subMenuUser);
  }
  ValidarAccesos(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async CargarInfoGeneral() {
    this.ArrayProcedimientos = await this._ventasService.ConsultarProcedimientosPlan(2, 28);
    this.Arraytipodocumento = await this._serviceGenerico.ConsultarTipoDoc();
    this.GesDocument = await this._serviceGenerico.ConsultarTipoDoc();
    this.ArrayMuestra = await this._ServicePaternidad.ConsultarTipoMuestra();
    this.ArrayEstadoCivil = await this._serviceGenerico.ConsultarestadoCivil();
    this.ArrayTipAfiliacion = await this._serviceGenerico.ConsultarTipoAfilicacion();
    this.ArrayGenero = await this._serviceGenerico.ConsultarGenero();
    this.ArrayDiscapacidad = await this.ServicePaciente.ConsultarDispacidades();
    this.GesGenero = await this.ServiceGenerico.ConsultarGenero();
    this.ArrayPais = await this._serviceGenerico.ConsultarPaises();
    this.ArrayDepart = await this._serviceGenerico.ConsultarDepartamento();
    this.ArrayEstr = await this._serviceGenerico.Consultarestratos();
    this.ArrayEps = await this._serviceGenerico.ConsultarEps();
    this.ArrayParentesco = await this._ServicePaternidad.ListarParentesco();
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

  atras() {
    this.VerValidacion = false;
    this.VerPrincipal = true;
  }

  Selected(event) {
    this.procedimiento = event.idProcedimiento;
  }

  async ConsultarInfo() {
    let fechaini = $('#txtfechaini').val();
    let fechafin = $('#txtfechafin').val();
    let nosolicitud = $('#txtnosolicitud').val();
    let documento = $('#txtdocumento').val();
    this.ArrayGeneral = await this._paternidadService.ConsultarInfoCarga(documento, fechaini, fechafin, nosolicitud, this.procedimiento);
    this.Vertabla = true;
  }

  async CargarArchivo(idsolicitud, numerosolicitud, fechasolicitud, procedimiento, archivo, comentario, validacion) {
    this.ArrayPacientes = await this._paternidadService.ConsultarPacientesGestionSolicitud(idsolicitud);
    this.numerosolicitud = numerosolicitud;
    this.fechaSolicitud = fechasolicitud;
    this.examen = procedimiento;
    this.IdSolicitud = +idsolicitud;
    this.VerValidacion = true;
    this.VerPrincipal = false;
    if (archivo != "" && validacion == 0) {
      this.nameFile = archivo;
      this.disabledCargue = true;
      this.banderArchivo = 1;
      setTimeout(() => {
      $("#validar").removeClass('fa-check-square');
      $("#validar").addClass('fa-check-square-enabled');
      $("#preVisualizar").removeClass('fa-eye');
      $("#preVisualizar").addClass('fa-eye-enabled');
      $("#imprimir").removeClass('fa-print-enabled');
      //$("#imprimir").addClass('fa-print');
      this.textoBadge = 'Por validar'
      this.disabled = false
      this.disabledValidar=false;
      this.disabledImprimir = true;
    }, 10);
    } else {
      this.nameFile = 'Arrastra y suelta tu documento legal o haz clic aquí';
      this.disabledCargue = false;
      this.banderArchivo = 0;
    }


    if (comentario != "") {
      this.TextComentario = comentario.toString();
      $("#txtComentario").val(comentario);
    } else {
      this.TextComentario = 'Diligencia este campo con  los comentarios del resultado';
      $("#txtComentario").val();
    }

    if (validacion == 1) {
      setTimeout(() => {
        $("#validar").removeClass('fa-check-square');
        $("#validar").addClass('fa-check-square-enabled');
        $("#preVisualizar").removeClass('fa-eye');
        $("#preVisualizar").addClass('fa-eye-enabled');
        $("#badge").removeClass('badge-secondary');
        $("#badge").addClass('badge-Validacion1');
        this.textoBadge = 'Validación 1'
        this.disabled = false;
        this.disabledValidar=false;
        this.contador_validar = this.contador_validar + 1;

      }, 10);
    }else if (validacion == 2) {
      setTimeout(() => {
        $("#validar").removeClass('fa-check-square');
        $("#validar").addClass('fa-check-square-enabled');
        $("#preVisualizar").removeClass('fa-eye');
        $("#preVisualizar").addClass('fa-eye-enabled');
        $("#badge").removeClass('badge-Validacion1');
        $("#badge").addClass('badge-Validacion2');
        $("#imprimir").removeClass('fa-print');
        $("#imprimir").addClass('fa-print-enabled');
        this.textoBadge = 'Validación 2'
        this.disabled = false
        this.disabledValidar=true;
        this.disabledImprimir = false;
      }, 10);
    }
    // else {
    //   setTimeout(() => {      
    //     this.textoBadge = 'Por validar'
    //     this.disabled = true
    //     this.disabledValidar=true;
    //     this.disabledImprimir = true;
    //   }, 10);
    // }
  }

  async consultar() {
    var documento = $('#txtdocumento').val();
    var tipodocumento = $('#SelTipDoc').val();
    if (documento == '' || tipodocumento == '') {
      return this.camposObligatorios();
    } else {
      await this.ServicePaciente.DetallPaciente(documento, tipodocumento).then(response => {
        if (response.length > 0) {
          this.Pacienteexistente = true;
          this.pacientenuevo = false;
          this.formularioPacientes = true;
          this.botonCerrar = false;
        } else {
          (<any>$('#NoexistPaciente')).modal('show');
          this.Pacienteexistente = false;
          this.pacientenuevo = true;
          this.botonCerrar = false;
        }
        this.CargarDatosPaciente(response);
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
  }



  CargarDatosPaciente(datosPaciente) {
    for (const datos of datosPaciente) {
      this.formPacientes.patchValue({
        id: datos.id,
        primerNombre: datos.primerNombre,
        segundoNombre: datos.segundoNombre,
        primerApellido: datos.primerApellido,
        segundoApellido: datos.segundoApellido,
        fechanacimiento: datos.fechanacimiento,
        correo: datos.correo,
        telefono: datos.telefono,
        celular: datos.celular,
        direccion: datos.direccion,
        Idestadocivil: datos.Idestadocivil,
        Idsexo: datos.Idsexo,
        Idestrato: datos.Idestrato,
        IdTipAfil: datos.IdTipAfil,
        IdEps: datos.IdEps,
        Pais: 161,
        IdDepto: datos.IdDepto,
        Idciudad: datos.Idciudad,
        IdLocalidad: datos.IdLocalidad,
        Idbarrio: datos.Idbarrio,
        activo: datos.activo,
        embarazo: datos.embarazo,
        discapacidad: datos.discapacidad,
        IdParentesco: datos.IdParentesco
      });
      this.CorreoEnvio = datos.correo
      this.PacienteExt = datosPaciente;
      this.idpaciente = +datos.id;
      if ((datos.tipodocumento == 8) || (datos.tipodocumento == 7) && datos.IdAcudiente > 0) {
        this.BtnVerAcudiente = true;
        this.IdAcudiente = datos.IdAcudiente;
      } else {
        this.BtnVerAcudiente = false;
      }
      if (datos.PoliticaDatos == 1) {
        $("#radioPolitica").prop('checked', true);
      }

      this.cargarCiudades(datos.IdDepto, datos.Idciudad, datos.IdLocalidad, datos.fechanacimiento);
    }
    this.ValidarGenero(datosPaciente[0].Idsexo);
  }

  async cargarCiudades(IdDept: number, ciudad: number, Idlocalidad: number, fecha: any) {
    await this._serviceGenerico.ConsultarCiudades(IdDept).then((data) => {
      this.ArrayCity = data;
      this.CargarLocalidades(ciudad, Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarLocalidades(ciudad: number, Idlocalidad: number, fecha: any) {
    await this._serviceGenerico.Consultarlocalidad(ciudad).then((data) => {
      this.Arraylocalidad = data;
      this.CargarBarrios(Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarBarrios(Idlocalidad: number, fecha: any) {
    await this._serviceGenerico.ConsultarBarrios(Idlocalidad).then((data) => {
      this.ArrayBarrio = data;
      this.CalcularEdad(fecha, 1);
    });
  }

  async CalcularEdad(fecha, Bnd) {
    if (Bnd == 1) {
      const fechaActual = new Date();
      const convertAge = new Date(fecha);
      let dias = fechaActual.getUTCDate() - convertAge.getUTCDate();
      let meses = fechaActual.getUTCMonth() - convertAge.getUTCMonth();
      let years = fechaActual.getUTCFullYear() - convertAge.getUTCFullYear();
      if (dias < 0) {
        meses--;
        dias = 30 + dias;
      }
      if (meses < 0) {
        years--;
        meses = 12 + meses;
      }
      this.showAge = years + ' Años ' + meses + ' Meses ' + dias + ' Dias'
      this.validar(years);
      return this.showAge;
    }
  }

  validar(edad: any) {
    const tipodocumento = $('#SelTipDoc').val();
    if (tipodocumento == '8' && edad < 14 || tipodocumento == '7') {
      $("#txtcorreo").prop("disabled", true);
    } else {
      $("#txtcorreo").prop("disabled", false);
      this.menordeedad = false;
    }
  }

  get f() {
    return this.formPacientes.controls;
  }

  camposObligatorios() {
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: 'Ingrese los datos para continuar',
    });
  }

  async ConsultarGenero() {
    await this.ServiceGenerico.ConsultarGenero().then((data) => {
      this.GesGenero = data;
    });
  }

  async incomingfile(event) {
    let extencion=event[0].name.toString().split('.');
    if(extencion[1]!="pdf"){
      this.extencionIncorrect=true;
    }else{
      Swal.fire({
        title: 'Estamos cargando tú documento',
        icon: 'info',
        timer: 20000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      this.nameFile = event[0].name;
      this.file = event[0].base64;
      const DataDocumentacion = {
        Idsolicitud: +this.IdSolicitud,
        Validacion: 0,
        comentario: "",
        archivo: this.file,
        nombreArchivo: this.nameFile,
        Proceso: 'Cargue',
        idusuario: this.IdUsuario
      }
      await this._paternidadService.CrearDocumentacion(DataDocumentacion).then(response => {
        Swal.close();
        this.disabledCargue = true;
        this.banderArchivo = response.toString().split(',')[1];
        this.mensajeRespuesta = response.toString().split(',')[0];
        (<any>$('#ModalAlerta')).modal('show');
      });
    }
  }

  CerrarModal() {

    $("#validar").removeClass('fa-check-square');
    $("#validar").addClass('fa-check-square-enabled');

    $("#preVisualizar").removeClass('fa-eye');
    $("#preVisualizar").addClass('fa-eye-enabled');
    this.disabled = false;
    this.disabledValidar=false;

    (<any>$('#ModalAlerta')).modal('hide');
  }

  async Validar() {
    this.contador_validar = this.contador_validar + 1;
    if (this.contador_validar == 1) {
      const Datavalidar = {
        Idsolicitud: +this.IdSolicitud,
        Validacion: 1,
        comentario: "",
        archivo: this.file,
        nombreArchivo: this.nameFile,
        Proceso: 'Validar',
        idusuario: this.IdUsuario
      }
      await this._paternidadService.CrearDocumentacion(Datavalidar);
      $("#badge").removeClass('badge-secondary');
      $("#badge").addClass('badge-Validacion1');
      this.textoBadge = 'Validación 1'
    } else {
      const Datavalidar = {
        Idsolicitud: +this.IdSolicitud,
        Validacion: 2,
        comentario: "",
        archivo: this.file,
        nombreArchivo: this.nameFile,
        Proceso: 'Validar',
        idusuario: this.IdUsuario
      }
      await this._paternidadService.CrearDocumentacion(Datavalidar);
      $("#badge").removeClass('badge-Validacion1');
      $("#badge").addClass('badge-Validacion2');
      this.textoBadge = 'Validación 2'
      $("#imprimir").removeClass('fa-print');
      $("#imprimir").addClass('fa-print-enabled');
      this.disabledImprimir=false;
      $("#validar").prop('disable',true);
    }
  }

  RealizarComentario() {
    if (+this.banderArchivo == 1) {
      (<any>$('#Modalcomentario')).modal('show');
    }
  }

  async GuardarComentario() {
    let comentario = $("#txtComentario").val();
    $("#comentario").remove('');
    const Data = {
      Idsolicitud: +this.IdSolicitud,
      Validacion: 2,
      comentario: comentario,
      archivo: "",
      Proceso: 'Comentario',
      nombreArchivo: '',
      idusuario: this.IdUsuario
    };
    (<any>$('#Modalcomentario')).modal('hide');
    await this._paternidadService.CrearDocumentacion(Data).then(response => {

      this.mensajeRespuesta = response;
      (<any>$('#ModalAlerta')).modal('show');
      this.disabledImprimir = false;
      // $("#badge").removeClass('badge-Validacion1');
      // $("#badge").addClass('badge-Validacion2');
      // this.textoBadge = 'Validación 2'
      this.TextComentario = comentario.toString();
    });
  }

  CrearPacientes(bandera) {
    if (this.BandValidar == true) {
      this.formPacientes.value.Idbarrio;
    }
    this.submit = true;
    if (bandera == 1) {
      if (this.formPacientes.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Faltan Datos Por Completar',
        });
        return;
      } else {
        Swal.fire({
          title: 'Estamos procesando tú solicitud.',
          icon: 'warning',
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
        });

        this.formPacientes.value.bandera_origen = 'PA';
        this.formPacientes.value.IdSolicitud = this.IdSolicitud;

        this.ServicePaciente.CrearPaciente(this.formPacientes.value).then(
          (resp) => {
            var IdPacNew = resp.toString().split(',')[1];
            this.idpaciente = +IdPacNew
            if (this.formPacientes.value.tipodocumento == 8 || this.formPacientes.value.tipodocumento == 7) {
              this.alerta()
              $('#btnVentaEx').show();
              $('#btnGuardar').hide();
              $('#btnSiguienteFin').show();
            } else {
              $('#btnVentaEx').show();
              $('#btnGuardar').hide();
              $('#btnSiguienteFin').show();
            }
            this.ParseoDataPaciente()

            let validarAcudiente = this.IdAcudiente;//JSON.parse(sessionStorage.getItem('IdAcudiente'))
            if (validarAcudiente > 0) {
              (<any>$('#NoexistAcudiente')).modal('hide');
            }
            Swal.fire({
              icon: 'success',
              title: resp.toString().split(',')[0],
              showConfirmButton: true,
            });
            this.submit = false;
            $('#btnGuardar').hide();
            $('#btnAthenea').show();

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
    }
  }

  alerta() {
    this.showModalAlert = true;
    (<any>$('#NoexistAcudiente')).modal('show');
  }

  async ConsultarDetalle(documento, idtipodocument) {
    this.ArrayDetalle = await this._PacienteService.DetallPaciente(documento, idtipodocument);
  }

  async Previsualizar(bandera) {
    this.VentanaCarga();
    await this._paternidadService.ConsultarDocumento(+this.IdSolicitud,+this.IdUsuario).then(response => {            
      this.base64ToBlob(response, bandera);
    });    
  }

  public base64ToBlob(b64Data, bandera, sliceSize = 512) {
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
    const url = window.URL.createObjectURL(data);
    // i.e. display the PDF content via iframe
    if (bandera == 1) {  
      Swal.close();
      document.querySelector("embed").src = url + '#toolbar=0&navpanes=0&scrollbar=0';
      (<any>$('#ModalPrevisualizacion')).modal('show');
    
    } else {
      Swal.close();
      document.querySelector("embed").src = url;
      (<any>$('#ModalPrevisualizacion')).modal('show');
    }
  }

  Next_Paciente(bandera) {
    $('.tab-pane3').hide();
    if (bandera == 2) {
      var activetab2 = $('#tab2').attr('href');
      $(activetab2).show()
      $('#Li2').addClass('active');
      $('#Li1').addClass('active');
    } else if (bandera == 3) {
      var activetab3 = $('#tab3').attr('href');
      $(activetab3).show()
      $('#Li3').addClass('active');
      $('#Li2').addClass('active');
    } else if (bandera == 4) {
      var activetab3 = $('#tabEntrega').attr('href');
      $(activetab3).show()
      $('#Lipaciente').removeClass('active');
      $('#Lientrega').addClass('active');
      this.formularioPacientes = false;
      var activetabPac = $('#tabPaciente').attr('href');
      $(activetabPac).hide()
    }
  }

  Previous_Paciente(bandera) {
    if (bandera == 1) {
      var activetab = $('#tab1').attr('href');
      var activetab2 = $('#tab2').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li1').addClass('active');
      $('#Li2').removeClass('active');
    } else if (bandera == 2) {
      var activetab = $('#tab2').attr('href');
      var activetab2 = $('#tab3').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li2').addClass('active');
      $('#Li3').removeClass('active');
    } else if (bandera == 3) {
      var activetab3 = $('#tabEntrega').attr('href');
      $(activetab3).hide()
      $('#Lipaciente').addClass('active');
      $('#Lientrega').removeClass('active');
      this.formularioPacientes = true;
      var activetabPac = $('#tabPaciente').attr('href');
      $(activetabPac).show();
    }
  }

  ValidarGenero(idgenero) {
    if (+idgenero == 2) {
      this.verEmbarazo = true;
    } else {
      this.verEmbarazo = false;
    }
  }


  async verDatos(tipodocumento, documento) {
    this.ArrayDetalle = await this._PacienteService.DetallPaciente(documento, tipodocumento);
    (<any>$('#verDatos')).modal('show');
  }

  async ParseoDataPaciente() {
    await this.ServicePaciente.DetallPaciente(this.formPacientes.value.documento, this.formPacientes.value.tipodocumento).then(response => {
      this.PacienteCre = response;
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

  barcode() {
    (<any>$('#DivPacientes')).modal('hide');
    (<any>$('#barcode')).modal('show');
  }

  async ActualizarDatos() {
    this.submit = true;
    if (this.formPacientes.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      Swal.fire({
        title: 'Estamos procesando tú solicitud.',
        icon: 'warning',
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      this.formPacientes.value.bandera_origen = 'PA';
      this.formPacientes.value.IdSolicitud = this.IdSolicitud;
      await this.ServicePaciente.UpdatePaciente(this.formPacientes.value).then(
        async (resp) => {
          var IdPacNew = resp.toString().split(',')[1];
          this.idpaciente = +IdPacNew
          $('#btnActualizar').hide();
          $('#btnSiguienteFin').show();
          this.ParseoDataPaciente()
          let validarAcudiente = this.IdAcudiente;
          if (validarAcudiente > 0) {
            (<any>$('#NoexistAcudiente')).modal('hide');
          }
          Swal.fire({
            icon: 'success',
            title: resp.toString().split(',')[0],
            showConfirmButton: true,
          });
          if (this.pacienteActualizado) {
            this.ArrayPacientes = await this._ServicePaternidad.ConsultarPacientesGestionSolicitud(this.IdSolicitud);
            (<any>$('#DivPacientes')).modal('hide')
            var activetab = $('#tab1').attr('href');
            var activetab3 = $('#tab3').attr('href');
            var activetab2 = $('#tab2').attr('href');
            var activetabentrega = $('#tabEntrega').attr('href');
            $(activetab).show();
            $(activetab3).hide();
            $(activetab2).hide();
            $(activetabentrega).hide();
            $('#Li1').addClass('active');
            $('#Li3').removeClass('active');
            $('#Li2').removeClass('active');
            $('#tabEntrega').removeClass('active');
            this.pacienteActualizado = false;
            $('#btnActualizar').show();
            $('#btnSiguienteFin').hide();

          }
          this.submit = false;
        }).catch(err => {
          if (err.status === 400 || err.status === 500) {
            Swal.fire({
              text: err.error.Message,
              icon: 'error'
            });
            return;
          }
        });
    }
  }

  ActualizarPaciente(ArrayDetalle) {
    this.pacienteActualizar = ArrayDetalle[0];
    this.ValidarGenero(this.pacienteActualizar.Idsexo);
    this.cargarCiudades(this.pacienteActualizar.IdDepto, this.pacienteActualizar.Idciudad, this.pacienteActualizar.IdLocalidad, this.pacienteActualizar.fechanacimiento);
    this.formPacientes = this.formbuilder.group({
      id: [this.pacienteActualizar.id],
      documento: [this.pacienteActualizar.documento],
      tipodocumento: [+this.pacienteActualizar.tipodocumento],
      fechanacimiento: [this.pacienteActualizar.fechanacimiento],
      primerNombre: [this.pacienteActualizar.primerNombre],
      segundoNombre: [this.pacienteActualizar.segundoNombre],
      primerApellido: [this.pacienteActualizar.primerApellido],
      segundoApellido: [this.pacienteActualizar.segundoApellido], PoliticaDatos: [this.pacienteActualizar.PoliticaDatos], correo: [this.pacienteActualizar.correo],
      telefono: [this.pacienteActualizar.telefono],
      celular: [this.pacienteActualizar.celular], direccion: [this.pacienteActualizar.direccion],
      Idciudad: [+this.pacienteActualizar.Idciudad],
      Idbarrio: [+this.pacienteActualizar.Idbarrio], Idestadocivil: [this.pacienteActualizar.Idestadocivil],
      Idestrato: [this.pacienteActualizar.Idestrato],
      IdTipAfil: [+this.pacienteActualizar.IdTipAfil],
      NombreBarrio: [this.pacienteActualizar.NombreBarrio], Idsexo: [this.pacienteActualizar.Idsexo],
      IdDepto: [this.pacienteActualizar.IdDepto],
      IdLocalidad: [+this.pacienteActualizar.IdLocalidad], Pais: ['161'], IdEps: [this.pacienteActualizar.IdEps], edad: [this.showAge],
      AbreviaturaTipodoc: [this.pacienteActualizar.AbreviaturaTipodoc],
      IdParentesco: ['0'],
      bandera_origen: [this.pacienteActualizar.bandera_origen],
      embarazo: ['0'],
      IdSolicitud: [this.pacienteActualizar.IdSolicitud],
      IdUsuario: this.IdUsuario,
      discapacidad: [+this.pacienteActualizar.discapacidad],
    });
    this.botonCerrar = false
    this.formularioPacientes = true;
    this.Pacienteexistente = true;
    (<any>$('#verDatos')).modal('hide')
    var Entrega = $('#tabEntrega').attr('href');
    $(Entrega).hide();
    this.pacienteActualizado = true;
    (<any>$('#DivPacientes')).modal('show')
  }

  limpiarFiltros(){
    $("#txtfechaini").val("");
    $("#txtfechafin").val("");
    $("#seltipodoc").val("0");
    $("#txtdocumento").val("");
    $("#txtnosolicitud").val("");
    this.auto.clear();
    this.auto.close();
    this.Vertabla=false;
  }
}
