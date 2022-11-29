import { AfterViewInit, Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import Swal from 'sweetalert2';
import { List } from 'linqts';

import {
  GenericBarrio,
  GenericCity,
  GenericCountry,
  GenericDepartament,
  GenericEps,
  GenericEstadoCivil,
  GenericEstrato,
  GenericGenero,
  GenericLacation,
  GenericTipoDoc,
  GenericTypeAfil,
} from 'src/app/models/Generic/Generic.model';
import { ClientesService } from 'src/app/services/Preatencion/clientes.service';
import { pacientes } from 'src/app/models/Preatencion/CrearPaciente.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import * as moment from 'moment';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
  providers: [ClientesService],
})
export class PacientesComponent implements OnInit{
  form: FormGroup;
  formVizualizar: FormGroup;
  formCrearAcudiente: FormGroup;
  submit: boolean;
  DatosBasicosCoti = JSON.parse(sessionStorage.getItem('DatosBasicosCoti'));
  GesDocument: GenericTipoDoc[];
  GesEstadoCivil: GenericEstadoCivil[];
  GesTipAfiliacion: GenericTypeAfil[];
  GesGenero: GenericGenero[];
  GesPais: GenericCountry[];
  GesDepart: GenericDepartament[];
  GesCity: GenericCity[];
  GesEstr: GenericEstrato[];
  GesEps: GenericEps[];
  Geslocatyon: GenericLacation[];
  GesBarrio: GenericBarrio[];
  vizualizaraAcudiente: pacientes[];
  fomurlario: pacientes;
  showAge: any;
  validarVinculacion: number=0;
  showAgeAcu: any;
  CrearAcudiente = false;
  formularioPacientes = false;
  formularioVincularAcudiente = false;
  BandValidar = false;
  showModalAcu = false;
  showModalAlert = false;
  formularioAcudiente = false;
  pacientenuevo = false;
  menordeedad = false;
  Pacienteexistente = false;
  ContainerPrincipal = true;
  ContainerVisualizarAcudiente = false;
  ContainerVisualizar = false;
  paciente = true;
  Acudiente = false;
  VincularAcu = false;
  BtnVerAcudiente = false;
  VtasMenor = false;
  PacienteExt: pacientes[];
  PacienteCre: pacientes[];
  IdUsuario: number;
  IdAcudiente: number;
  IdRol: any;
  ArrayDiscapacidad: any[];
  verEmbarazo: boolean = false;
  bandera_crea_edita: number;
  hoy: string;
  currentYear: number;
  subMenuUser: any;
  longitudValidar: boolean = false;
  textoValidacion: string;
  constructor(
    private ServicePaciente: ClientesService,
    private fb: FormBuilder,
    private AcFb: FormBuilder,
    private ServiceGenerico: GenericoService,
    private router: Router,
    private ValidarPermisos: ValidarPermisos
  ) { }

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'));
    //#region Formulario para procesos del acudiente
    this.formCrearAcudiente = this.AcFb.group({
      id: [''],
      tipodocumento: [''],
      documento: [''],
      fechanacimiento: [''],
      primerNombre: ['', [Validators.required]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''],
      PoliticaDatos: [''],
      correo: ['',  [Validators.required]],
      telefono: [''],
      celular: [''],
      direccion: [''],
      Idciudad: [''],
      Idbarrio: [''],
      Idestadocivil: [''],
      Idestrato: [''],
      IdEstadoCivil: [''],
      IdTipAfil: ['0'],
      NombreBarrio: [''],
      Idsexo: [''],
      IdDepto: ['' ],
      IdLocalidad: [''],
      Pais: ['161'],
      IdEps: [''],
      edad: [''],
      IdUsuario: this.IdUsuario,
    });
    //#endregion
    //this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    //#region Formulario para procesos del paciente
    this.form = this.fb.group({
      id: [''],
      documento: ['', [Validators.required]],
      tipodocumento: [''],
      fechanacimiento: [''],
      primerNombre: ['', [Validators.required]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''],
      PoliticaDatos: [''],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      celular: [''],
      direccion: ['', [Validators.required]],
      Idciudad: ['', [Validators.required]],
      Idbarrio: [''],
      Idestadocivil: ['', [Validators.required]],
      Idestrato: ['', [Validators.required]],
      IdEstadoCivil: [''],
      IdTipAfil: ['0', [Validators.required]],
      NombreBarrio: [''],
      Idsexo: ['', [Validators.required]],
      IdDepto: ['', [Validators.required]],
      IdLocalidad: [''],
      Pais: ['161'],
      IdEps: [''],
      edad: [''],
      AbreviaturaTipodoc: [''],
      IdUsuario: this.IdUsuario,
      IdParentesco:[0],
      bandera_origen:[''],
      IdSolicitud:[0],
      embarazo: ['0'],
      discapacidad: ['0'],
    });

    if (this.DatosBasicosCoti != null) {
      setTimeout(() => {
        this.form.patchValue({
          tipodocumento: +this.DatosBasicosCoti.tipodocumento,
          documento: this.DatosBasicosCoti.documento,
          primerNombre: this.DatosBasicosCoti.PrimNombre,
          segundoNombre: this.DatosBasicosCoti.segundoNom,
          primerApellido: this.DatosBasicosCoti.primApell,
          segundoApellido: this.DatosBasicosCoti.segunApe,
          correo: this.DatosBasicosCoti.email,
          telefono: this.DatosBasicosCoti.tel,
          direccion: this.DatosBasicosCoti.Direc,
        });

        this.formularioPacientes = true;
        this.pacientenuevo = true;
      }, 1000);
    }
    this.CargarInfoGeneral();
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

  //get primerNombre() { return this.form.get('primerNombre'); }

  async CargarInfoGeneral() {
    this.ArrayDiscapacidad = await this.ServicePaciente.ConsultarDispacidades();
    this.GesDocument = await this.ServiceGenerico.ConsultarTipoDoc();
    this.GesEstadoCivil = await this.ServiceGenerico.ConsultarestadoCivil();
    this.GesTipAfiliacion = await this.ServiceGenerico.ConsultarTipoAfilicacion();
    this.GesGenero = await this.ServiceGenerico.ConsultarGenero();
    this.GesPais = await this.ServiceGenerico.ConsultarPaises();
    this.GesDepart = await this.ServiceGenerico.ConsultarDepartamento();
    this.GesEstr= await this.ServiceGenerico.Consultarestratos();
    this.GesEps=await this.ServiceGenerico.ConsultarEps();
  }

  ValidarGenero(idgenero){
    if(+idgenero==2){
      this.verEmbarazo=true;
    }else{
      this.verEmbarazo=false;
    }
  }



  focusMethod = function getFocus(bandera) {
    if (bandera == 1) {
      document.getElementById("txtdocumento").focus();
    } else if (bandera == 2) {
      document.getElementById("txtsegundoNombre").focus();
    }
  }


  ValidarEmail(email: string) {
    var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(EMAIL_REGEX)) {
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formato del correo incorrecto',
        showConfirmButton: true
      });
      $("#txtcorreo").val('');
    }
  }

  //#region Funciones Genericas
  validar(edad: any) {
    const tipodocumento = $('#SelTipDoc').val();
    if (tipodocumento == '8' && edad < 14 || tipodocumento == '7') {
      $("#txtcorreo").prop("disabled", true);
      this.form.get('correo').clearValidators();
      this.form.get('correo').updateValueAndValidity();
    } else {
      $("#txtcorreo").prop("disabled", false);
      this.menordeedad = false;
    }
  }

  // metodo para volver el formulario al estado en blanco
  Limpiar() {
    this.form = this.fb.group({
      id: [''],
      documento: [''],
      tipodocumento: [''],
      AbreviaturaTipodoc: [''],
      fechanacimiento: [''],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      sexo: [''],
      activo: [''],
      PoliticaDatos: [''],
      correo: [''],
      telefono: [''],
      celular: [''],
      direccion: [''],
      Idciudad: [''],
      Idbarrio: [''],
      Idestadocivil: [''],
      Idestrato: [''],
      Estrato: [''],
      IdEstadoCivil: [''],
      Ciudad: [''],
      IdTipAfil: ['0'],
      TipoAfil: [''],
      NombreBarrio: [''],
      Estadocivil: [''],
      Idsexo: [''],
      IdDepto: [''],
      IdLocalidad: [''],
      Pais: ['161'],
      IdEps: [''],
      edad: [''],
    });
    var activetab = $('#tab1').attr('href');
    var activetab2 = $('#tab2').attr('href');
    var activetab3 = $('#tab3').attr('href');
    $(activetab).show();
    $(activetab2).hide();
    $(activetab3).hide();
    this.formularioPacientes = false;
    this.paciente = true;
    this.Acudiente = false;
    sessionStorage.removeItem('DatosBasicosCoti');
  }

  LimpiarCreapaciente() {
    this.form = this.fb.group({
      id: [''],
      documento: $("#txtdocumento").val(),
      tipodocumento: $("#SelTipDoc").val(),
      AbreviaturaTipodoc: [''],
      fechanacimiento: [''],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      sexo: [''],
      activo: [''],
      PoliticaDatos: [''],
      correo: [''],
      telefono: [''],
      celular: [''],
      direccion: [''],
      Idciudad: [''],
      Idbarrio: [''],
      Idestadocivil: [''],
      Idestrato: [''],
      Estrato: [''],
      IdEstadoCivil: [''],
      Ciudad: [''],
      IdTipAfil: [''],
      TipoAfil: [''],
      NombreBarrio: [''],
      Estadocivil: [''],
      Idsexo: [''],
      IdDepto: [''],
      IdLocalidad: [''],
      Pais: ['161'],
      IdEps: [''],
      embarazo: ['0'],
      discapacidad: ['0'],
      edad: [''],
    });
  }

  // Consultamos el documento del paciente
  async consultarDocumento() {
    await this.ServiceGenerico.ConsultarTipoDoc().then((data) => {
      this.GesDocument = data;
      this.consultarEstadoCivil();
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

  // Consultamos el estado civil de paciente
  async consultarEstadoCivil() {
    await this.ServiceGenerico.ConsultarestadoCivil().then((data) => {
      this.GesEstadoCivil = data;
      this.consultarTipoAfi();
    });
  }
  // Consultamos el tipo de afiliacion de paciente
  async consultarTipoAfi() {
    await this.ServiceGenerico.ConsultarTipoAfilicacion().then((data) => {
      this.GesTipAfiliacion = data;
      this.ConsultarGenero();
    });
  }
  // Consultamos los Generos del paciente
  async ConsultarGenero() {
    await this.ServiceGenerico.ConsultarGenero().then((data) => {
      this.GesGenero = data;
      this.ConsultarPais();
    });
  }
  // Consultamos Los Paises en el select
  async ConsultarPais() {
    await this.ServiceGenerico.ConsultarPaises().then((data) => {
      this.GesPais = data;
      this.listardepartamentos();
    });
  }
  // listamos los departamentos
  async listardepartamentos() {
    await this.ServiceGenerico.ConsultarDepartamento().then((data) => {
      this.GesDepart = data;
      this.ListarEstratos();
    });
  }
  //listamos la ciudades
  async listarCiudades(Idciudad: number) {
    await this.ServiceGenerico.ConsultarCiudades(Idciudad).then((data) => {
      this.GesCity = data;
    });
  }
  //listamos las localidades
  async listarLocalidades(IdCiudad: any) {
    await this.ServiceGenerico.Consultarlocalidad(IdCiudad).then((resp) => {
      this.Geslocatyon = resp;
    });
  }
  //listamos los barrios
  async ListarBarrios(IdLocalidad: any) {
    await this.ServiceGenerico.ConsultarBarrios(IdLocalidad).then((resp) => {
      this.GesBarrio = resp;
    });
  }
  // consultamos la edad, al ingresar la fecha
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
    } else {
      const convertAge = new Date(fecha);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAgeAcu = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
  }

  // listamos los estratos
  async ListarEstratos() {
    await this.ServiceGenerico.Consultarestratos().then((resp) => {
      this.GesEstr = resp;
      this.ListarEps();
    });
  }
  // listamos la eps
  async ListarEps() {
    await this.ServiceGenerico.ConsultarEps().then((resp) => {
      this.GesEps = resp;
    });
  }
  // validamos el campo de localidades siempre y cuando sea diferente bogota
  ValidarCiudad(IdCiudad, bandera) {
    if (bandera == 1) {
      if (IdCiudad != 149 && IdCiudad != '') {
        $("#SelLocalidad").prop("disabled", true);
        $('#Selbarrio').hide();
        $('#txtbarrio').show();
        this.BandValidar = true;
      } else {
        $("#SelLocalidad").prop("disabled", false);
        $('#Selbarrio').show();
        $('#txtbarrio').hide();
        this.BandValidar = false;
      }
    } else {
      if (IdCiudad != 149 && IdCiudad != '') {
        $("#SelLocalidadAcudiente").prop("disabled", true);
        $('#SelbarrioAcudiente').hide();
        $('#txtbarrioAcudiente').show();
        this.BandValidar = true;
      } else {
        $("#SelLocalidadAcudiente").prop("disabled", false);
        $('#SelbarrioAcudiente').show();
        $('#txtbarrioAcudiente').hide();
        this.BandValidar = false;
      }
    }
  }
  // asignamos la politica de datos de los pacientes
  AsigPolitica(valor, bandera) {
    if (bandera == 1) {
      if ((valor = 'on')) {
        this.form.value.PoliticaDatos = 1;
      }
    } else {
      if ((valor = 'on')) {
        this.formCrearAcudiente.value.PoliticaDatos = 1;
      }
    }
  }


  //#region Paciente
  get f() {
    return this.form.controls;
  }
  // consultamos el paciente y lo actualizamos
  camposObligatorios() {
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: 'Ingrese los datos para continuar',
    });
  }

  async consultar() {    
    this.LimpiarCreapaciente();
    var documento = $('#txtdocumento').val();
    var tipodocumento = $('#SelTipDoc').val();
    if (documento == '' || tipodocumento == '') {
      return this.camposObligatorios();
    } else {
      await this.ServicePaciente.DetallPaciente(documento, tipodocumento).then(response => {
        if (response.length > 0) {
          this.Pacienteexistente = true;
          this.pacientenuevo = false;
          this.mostrarformulario("editar");
        } else {
          (<any>$('#NoexistPaciente')).modal('show');
          this.Pacienteexistente = false;
          this.pacientenuevo = true;
          this.formularioPacientes = false;
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
      this.form.patchValue({
        id: datos.id,
        primerNombre: datos.primerNombre,
        segundoNombre: datos.segundoNombre,
        documento:datos.documento,
        tipodocumento: datos.tipodocumento,
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
        IdParentesco:0,
        embarazo: datos.embarazo,
        discapacidad: datos.discapacidad,
      });
      this.PacienteExt = datosPaciente;
      sessionStorage.setItem('Idpaciente', JSON.stringify(datos.id));
      if ((datos.tipodocumento == 8) || (datos.tipodocumento == 7) && datos.IdAcudiente > 0) {
        this.BtnVerAcudiente = true;
        //sessionStorage.setItem('IdAcudiente', JSON.stringify(datos.IdAcudiente));
        this.IdAcudiente = datos.IdAcudiente;
      } else {
        this.BtnVerAcudiente = false;
      }
      setTimeout(() => {
        if (datos.PoliticaDatos == 1) {
          var Politica = document.getElementById('radioPolitica') as HTMLInputElement;
          Politica.checked = true;
        }
      }, 3000);
      this.cargarCiudades(datos.IdDepto, datos.Idciudad, datos.IdLocalidad, datos.fechanacimiento);
    }
    this.ValidarGenero(datosPaciente[0].Idsexo);
  }

  CrearPacientes(bandera) {
    if (this.BandValidar == true) {
      this.form.value.Idbarrio;
    }
    this.submit = true;
    if (bandera == 1) {
      if (this.form.invalid) {
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
        this.fomurlario = this.form.value;
        this.ServicePaciente.CrearPaciente(this.fomurlario).then(
          (resp) => {
            var IdPacNew = resp.toString().split(',')[1];
            sessionStorage.setItem('Idpaciente', JSON.stringify(IdPacNew));
            if (this.form.value.tipodocumento == 8 || this.form.value.tipodocumento == 7) {
              this.alerta()
              $('#btnVentaEx').show();
            } else {
              $('#btnVentaEx').show();
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
    } else {
      if (this.formCrearAcudiente.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Faltan Datos Por Completar',
        });
        return;
      } else {
        this.GuardarAcudiente();
      }
    }
    this.CrearAcudiente = false;
  }

  atrasAcudiente(){
    (<any>$('#ActualizarPaciente')).modal('hide');
    (<any>$('#acudiente')).modal('show');
  }
  GuardarAcudiente() {
    this.submit = true;
    if (this.formCrearAcudiente.invalid) {

      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Faltan Datos Por Completar',
      });
      this.formCrearAcudiente.markAllAsTouched();
      return;
    } else {
      this.fomurlario = this.formCrearAcudiente.value;
      this.ventanaCarga();
      this.ServicePaciente.CrearPaciente(this.fomurlario).then(
        (resp) => {
          Swal.close();
          var IdAcudienteNew = resp.toString().split(',')[1];
          this.IdAcudiente = Number(IdAcudienteNew);
          Swal.fire({
            icon: 'success',
            title: resp.toString().split(',')[0],
            showConfirmButton: true
          }).then(async result=>{
            if(result.isConfirmed){
              if(this.bandera_crea_edita=2){
                (<any>$('#ActualizarPaciente')).modal('hide');
                (<any>$('#acudiente')).modal('hide');
                this.vizualizaraAcudiente =await this.ServicePaciente.ConsultarAcudiente(this.IdAcudiente);
                // this.verAcudi();
              }
            }
          });
          this.submit = false;
          $("#btnVincular").show();
          $("#btnGuardarAc").css('display','none');
          this.paciente=true
          this.Acudiente=false
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

  ventanaCarga() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Cargando información'
    });
    Swal.showLoading();
  }

  async VincularAcudiente() {
    const variablePaciente = JSON.parse(sessionStorage.getItem('Idpaciente'));
    const variableAcudiente = this.IdAcudiente;//sessionStorage.getItem('IdAcudiente');
    this.ventanaCarga();
    await this.ServicePaciente.AsociarAcudiente(variablePaciente, variableAcudiente, this.IdUsuario).then((resp) => {
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: resp.toString(),
        showConfirmButton: true
      });
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
    //sessionStorage.removeItem('Idpaciente');
    (<any>$('#Vizualizarpaciente')).modal('hide');
  }

  async ParseoDataPaciente() {
    let LstPac = new List<pacientes>();
    let pacients = new pacientes();
    pacients.AbreviaturaTipodoc = this.form.value.AbreviaturaTipodoc;
    pacients.IdDepto = this.form.value.IdDepto;
    pacients.IdEps = this.form.value.IdEps;
    pacients.IdLocalidad = this.form.value.IdLocalidad;
    pacients.IdTipAfil = this.form.value.IdTipAfil;
    pacients.IdUsuario = this.form.value.IdUsuario;
    pacients.Idbarrio = this.form.value.Idbarrio;
    pacients.Idciudad = this.form.value.Idciudad;
    pacients.Idestadocivil = this.form.value.Idestadocivil;
    pacients.Idestrato = this.form.value.Idestrato;
    pacients.Idsexo = this.form.value.Idsexo;
    pacients.PoliticaDatos = this.form.value.PoliticaDatos;
    pacients.celular = this.form.value.celular;
    pacients.correo = this.form.value.correo;
    pacients.direccion = this.form.value.direccion;
    pacients.documento = this.form.value.documento;
    pacients.fechanacimiento = this.form.value.fechanacimiento;
    pacients.primerApellido = this.form.value.primerApellido;
    pacients.primerNombre = this.form.value.primerNombre;
    pacients.segundoApellido = this.form.value.segundoApellido;
    pacients.segundoNombre = this.form.value.segundoNombre;
    pacients.telefono = this.form.value.telefono;
    pacients.tipodocumento = this.form.value.tipodocumento;
    LstPac.Add(pacients);
    //this.PacienteCre = LstPac.ToArray();
    await this.ServicePaciente.DetallPaciente(this.form.value.documento, this.form.value.tipodocumento).then(response => {
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

  async ActualizarDatos() {
    let IdPaciente = JSON.parse(sessionStorage.getItem('Idpaciente'));
    this.form.value.id = +IdPaciente;
    this.submit = true;
    if (this.form.invalid) {
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
      this.fomurlario = this.form.value;
      await this.ServicePaciente.UpdatePaciente(this.fomurlario).then(
        (resp) => {
          var IdPacNew = resp.toString().split(',')[1];
          sessionStorage.setItem('Idpaciente', JSON.stringify(IdPacNew));
          $('#btnVentaAct').show();
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

  // listamos las ciudades por departamento
  async cargarCiudades(IdDept: number, ciudad: number, Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.ConsultarCiudades(IdDept).then((data) => {
      this.GesCity = data;
      this.CargarLocalidades(ciudad, Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarLocalidades(ciudad: number, Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.Consultarlocalidad(ciudad).then((data) => {
      this.Geslocatyon = data;
      this.CargarBarrios(Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarBarrios(Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.ConsultarBarrios(Idlocalidad).then((data) => {
      this.GesBarrio = data;
      this.CalcularEdad(fecha, 1);
    });
  }

  // mostramos el formulario depende la validacion
  mostrarformulario(bandera) {
    if(bandera=='crear'){
      this.formularioPacientes = true;
      (<any>$('#NoexistPaciente')).modal('hide');
    }else{
      this.formularioPacientes = true;
    };
  }

  // ponemos las interacciones de Siguiente a los tabs
  Siguiente(bandera) {
    this.textoValidacion = '';
    $('.tab-pane').hide();
    if (bandera == 2) {
      var activetab2 = $('#tab2').attr('href');
      $(activetab2).show()
      $('#Li2').addClass('active');
      $('#Li1').removeClass('active');
    } else {
      var activetab3 = $('#tab3').attr('href');
      $(activetab3).show()

      $('#Li3').addClass('active');
      $('#Li2').removeClass('active');
    }
  }
  // ponemos las interacciones de atras a los tabs
  atras(bandera) {
    this.textoValidacion = '';
    if (bandera == 1) {
      var activetab = $('#tab1').attr('href');
      var activetab2 = $('#tab2').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li1').addClass('active');
      $('#Li2').removeClass('active');
    } else {
      var activetab = $('#tab2').attr('href');
      var activetab2 = $('#tab3').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li2').addClass('active');
      $('#Li3').removeClass('active');
    }
  }
  // funcio para rediriguir al vista de ventas
  irAventas(bandera) {
    if (bandera == 1) {
      sessionStorage.setItem('DatosPaciente', JSON.stringify(this.PacienteCre));
    } else if (bandera == 2) {
      sessionStorage.setItem('DatosPaciente', JSON.stringify(this.PacienteExt));
    } else if (bandera == 3) {
      sessionStorage.setItem('DatosPaciente', JSON.stringify(this.PacienteExt));
    }
    this.router.navigate(['/ventas']);
  }

  //#region  Acudiente
  get Acu() {
    return this.formCrearAcudiente.controls;
  }

  async vizualizarAcudiente() {
    var documento = $('#txtdocumentoAc').val();
    var tipodocumento = $('#SelTipDocAc').val()
    if (documento == '' || tipodocumento == '') {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Ingrese los datos para continuar',
      });
    } else {
      await this.ServicePaciente.DetallPaciente(documento, tipodocumento).then((data) => {
        if (data.length > 0) {
          this.ContainerVisualizar = true;
          this.CrearAcudiente = false;
          this.vizualizaraAcudiente = data;
          for (const edad of data) {
            this.CalcularEdad(edad.fechanacimiento, 2);
            //sessionStorage.setItem('IdAcudiente', JSON.stringify(edad.id));
            this.IdAcudiente = edad.id;
          }
          this.paciente = true;
          this.Acudiente = false;
        } else {
          this.paciente = false;
          this.Acudiente = true;
          this.CrearAcudiente = true;
          this.ContainerVisualizar = false;
        }
      });
    }
  }

  ActualizarAcu(Acudiente: pacientes, cerrarmodal: any) {
    this.bandera_crea_edita=2;
    (<any>$('#acudiente')).modal('hide');

    //sessionStorage.setItem('Veracudiente', cerrarmodal);
    this.formCrearAcudiente.patchValue({
      IdUsuario: this.IdUsuario,
      id: Acudiente.id,
      tipodocumento: Acudiente.tipodocumento,
      documento: Acudiente.documento,
      primerNombre: Acudiente.primerNombre,
      segundoNombre: Acudiente.segundoNombre,
      primerApellido: Acudiente.primerApellido,
      segundoApellido: Acudiente.segundoApellido,
      fechanacimiento: Acudiente.fechanacimiento,
      correo: Acudiente.correo,
      telefono: Acudiente.telefono,
      celular: Acudiente.celular,
      direccion: Acudiente.direccion,
      Idestadocivil: Acudiente.Idestadocivil,
      Idsexo: Acudiente.Idsexo,
      Idestrato: Acudiente.Idestrato,
      IdTipAfil: Acudiente.IdTipAfil,
      IdEps: Acudiente.IdEps,
      Pais: 161,
      IdDepto: Acudiente.IdDepto,
      Idciudad: Acudiente.Idciudad,
      IdLocalidad: Acudiente.IdLocalidad,
      Idbarrio: Acudiente.Idbarrio,
      activo: Acudiente.activo,
    });
    (<any>$('#ActualizarPaciente')).modal('show');

    // setTimeout(() => {
    //   this.vizualizarAcudiente();
    // }, 1000);
  }

  async verAcudi() {
    var Idacudiente = this.IdAcudiente;//sessionStorage.getItem('IdAcudiente');
    if (Number(Idacudiente) > 0) {
      await this.ServicePaciente.ConsultarAcudiente(Idacudiente).then((data) => {
        this.vizualizaraAcudiente = data;
        sessionStorage.setItem('DatosAcu', JSON.stringify(data));
        for (const datos of data) {
          this.CalcularEdad(datos.fechanacimiento, 2);
        }
      });
      (<any>$('#acudiente')).modal('show');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Este paciente no cuenta con un acudiente',
      });
    }
  }
  // se muestra el modal de guardar menor de edad
  alerta() {
    this.showModalAlert = true;
    (<any>$('#NoexistAcudiente')).modal('show');
  }

  // se consulta el div de crear acudiente
  DivCrearAcudiente() {
    this.Limpiar();
    this.formularioAcudiente = true;
    // labels del h1
    this.paciente = false;
    this.Acudiente = true;
    // botones del formulario
    this.menordeedad = false;
    this.Pacienteexistente = false;
    this.pacientenuevo = true;
  }
  // se consulta el div de vincular acudiente
  DivVincularAcudiente() {
    (<any>$('#Vizualizarpaciente')).modal('show');
    this.ContainerVisualizarAcudiente = true;
  }

  ValidarCerrarAcudiente(){
    if(this.validarVinculacion==0){
      Swal.fire({
        icon: 'warning',
        title: 'No es posible continuar sin un acudiente vinculado',
        showConfirmButton: true
      });
    }
  }

  // ponemos las interacciones de Siguiente a los tabs
  SiguienteAcu(bandera) {
    $('.tab-pane1').hide();
    if (bandera == 2) {
      var activetab = $('#TabAcu2').attr('href');
      $(activetab).show();
      $('#Li2').addClass('active');
      $('#Li1').removeClass('active');
    } else {
      var activetab = $('#TabAcu3').attr('href');
      $(activetab).show();
      $('#Li3').addClass('active');
      $('#Li2').removeClass('active');
    }
  }
  // ponemos las interacciones de atras a los tabs
  atrasAcu(bandera) {
    if (bandera == 1) {
      var activetab = $('#TabAcu1').attr('href');
      var activetab2 = $('#TabAcu2').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li1').addClass('active');
      $('#Li2').removeClass('active');
    } else {
      var activetab = $('#TabAcu2').attr('href');
      var activetab2 = $('#TabAcu3').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li2').addClass('active');
      $('#Li3').removeClass('active');
    }
  }



  ConfirmarDesv() {
    var result = '';
    this.vizualizaraAcudiente = JSON.parse(sessionStorage.getItem('DatosAcu'));
    for (const datos of this.vizualizaraAcudiente) {
      result = datos.primerNombre + ' ' + datos.primerApellido;
    }
    document.getElementById('lblAcudiente').innerHTML = result;
    (<any>$('#AlertDesvinculacion')).modal('show');
  }

  async GuardarDesvinculacion() {
    const variablePaciente = sessionStorage.getItem('Idpaciente');
    await this.ServicePaciente.DesvincularAcudiente(variablePaciente).subscribe(
      (resp) => {
        Swal.fire({
          icon: 'success',
          titleText: resp.toString(),
          showConfirmButton: true
        });
      }
    );
    (<any>$('#AlertDesvinculacion')).modal('hide');
    (<any>$('#acudiente')).modal('hide');
  }

  /*Escaneo de documentos*/
  EscanearDocumento() {
   // let trama = ["10184802493", "GARZON", "VARGAS", "JUAN", "RAFAEL", "M", "19951027", "A+", "35904463", "1445"]
    Swal.fire({
      title: 'Escaneo de documento',
      text: 'Acerque su documento',
      imageUrl: '../../../assets/images/EscanerDeBarras.jpg',
      imageWidth: 400,
      imageHeight: 200,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        id: 'txtTrama'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
         let trama = $("#txtTrama").val();
          $('#txtdocumento').val(trama.toString().split(',')[0]);
          $('#SelTipDoc').val(1);
          this.ParseoTrama(trama);
        }
      }
    })
  }

  async ParseoTrama(trama) {
    let sexo;
    let fecha=moment(trama.toString().toUpperCase().split(',')[6]).locale('es-CO').format('YYYY-MM-DD')
    this.CalcularEdad(fecha,1);
    this.consultar();
    if(trama.toString().split(',')[5] == "M"){
      sexo=1;
    }else if(trama.toString().split(',')[5] == "F"){
      sexo=2;
    }else{
      sexo="";
    }

    this.form.patchValue({
      tipodocumento: 1,
      documento: trama.toString().toUpperCase().split(',')[0],
      primerNombre: trama.toString().toUpperCase().split(',')[3],
      segundoNombre: trama.toString().toUpperCase().split(',')[4],
      primerApellido: trama.toString().toUpperCase().split(',')[1],
      segundoApellido: trama.toString().toUpperCase().split(',')[2],
      fechanacimiento: moment(trama.toString().toUpperCase().split(',')[6]).locale('es-CO').format('YYYY-MM-DD'),//trama[6],
      Idsexo: sexo,
      edad: this.showAge
    });
  }

  validarFecha(fecha,bandera) {
    let transformada = fecha.split("-")
    if (bandera == 1) {
      if (transformada[0] > this.currentYear) {
        $('#fechaIni').val("");
      }
    }
  }

  validarLongitud(bandera) {
    debugger
    if(bandera == 'T'){
      let telefono = $("#txttelefono").val();
      if (telefono.toString().length < 7) {
        this.longitudValidar = true;
        this.textoValidacion = ' Debe tener como mínimo 7 caracteres';
        $("#txttelefono").val("");
      } else if (telefono.toString().length > 30) {
        this.longitudValidar = true;
        this.textoValidacion = ' Debe tener como maximo 30 caracteres';
        $("#txttelefono").val("");
      }else {
        this.longitudValidar = false;
      }
    } else if(bandera == 'D'){
      let direccion = $("#txtdireccion").val();
      if (direccion.toString().length < 10) {
        this.longitudValidar = true;
        this.textoValidacion = '  Debe tener como mínimo 10 caracteres';
        $("#txtdireccion").val("");
      }else {
        this.longitudValidar = false;
      }
    }else {
      this.longitudValidar = false;
    }
  }
}
