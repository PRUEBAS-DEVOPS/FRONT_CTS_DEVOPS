import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PaternidadService } from 'src/app/services/Paternidad/PaternidadService.service';
import { ClientesService } from 'src/app/services/Preatencion/clientes.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { GenericGenero } from 'src/app/models/Generic/Generic.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import * as moment from 'moment';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-registro-pacientes',
  templateUrl: './registro-pacientes.component.html',
  styleUrls: ['./registro-pacientes.component.css']
})
export class RegistroPacientesComponent implements OnInit {
  Arraytipo: any = [];
  file: any = [];
  divcarga: boolean = false;
  botonSiguiente: boolean = false;
  quantityPac: number = 0;
  formPacientes: FormGroup;
  IdUsuario: any;
  mediosPago: any
  GesDocument: any = [];
  ArrayEstadoCivil: any = [];
  ArrayTipAfiliacion: any = [];
  ArrayGenero: any = [];
  ArrayPais: any = [];
  ArrayDepart: any = [];
  ArrayEstr: any = [];
  ArrayEps: any = [];
  BandValidar: boolean;
  ArrayCity: any = [];
  Arraylocalidad: any = [];
  ArrayBarrio: any = [];
  Pacienteexistente: boolean;
  pacientenuevo: boolean;
  formularioPacientes: boolean;
  PacienteExt: any;
  BtnVerAcudiente: boolean;
  IdAcudiente: any;
  showAge: any;
  showAgeAcu: number;
  menordeedad: boolean;
  submit: boolean;
  CrearAcudiente: boolean;
  showModalAlert: boolean;
  PacienteCre: any = [];
  ContainerVisualizar: boolean;
  paciente: boolean;
  Acudiente: boolean;
  ArrayDiscapacidad: any = [];
  formularioAcudiente: boolean;
  ContainerVisualizarAcudiente: boolean;
  botonCerrar: boolean = true;
  btn_Anterior_entrega: boolean = true;
  btn_Confirmar_entrega: boolean = false;
  CorreoEnvio: string;
  ParrafoCorreo: boolean = false;
  btn_firmar_entrega: boolean = false;
  ArrayParentesco: any;
  IdSolicitud: number;
  puntoEntrega: number;
  ArrayGeneral: any;
  ArrayPacientes: any;
  contador: number = 0;
  DataPlanes: any;
  verEmbarazo: boolean = false;
  keywordPlan = 'Concatenado';
  disabled: boolean = false;
  idplan: number = 0;
  Tarifa: number = 0;
  VerRadioOpciones: boolean;
  VerExamen: boolean;
  TablaProcedimientos: boolean;
  Verchequeo: boolean;
  DataProcedimientos: any = [];
  Vertabla: boolean = false;
  ArrayExamenes: any = [];
  Examen: any;
  nameFile: string = 'Arrastra y suelta tu documento legal o haz clic aquí';
  banderaExam: any;
  mensajeRespuesta: any;
  ArrayProcedimientos: any = [];
  TotalFinal: number;
  keywordExamen = 'NombreProcedimiento';
  IdValidador: number;
  disabledText: boolean;
  MedioPago = new Array<any>();
  IdMedioPago = new Array<any>();
  arrayvalores = new Array<any>();
  TotalCalculo: number = 0;
  contadorProcedimientos: number = 0;
  arrayBuffer: any;
  Porcentaje: any;
  button_asociar: boolean = true;
  @ViewChild(SignaturePad) signaturepad: SignaturePad;
  public optionsPad = {
    minWidth: 2,
    penColor: 'black',
    backgroundColor: 'white',
    canvasWidth: 450,
    canvasHeight: 150,
  };
  idpaciente: number = 0;
  MostrarResponsable: boolean = false;
  bandera_crea: number;
  idgrupo: number;
  sede: any;
  validaCampos: boolean = false;
  showAge1: string;
  fileConsentimiento: any;
  pacienteseleccionado: any;
  NumPacientes: number;
  extencionIncorrect: boolean = false;
  idTransaccion: any;
  categoria = 'PA';
  VerAlerta: boolean;
  NotificacionError: any;
  NumeroSolicitud: any;
  resumenPaciente: boolean;
  politicaAceptada: boolean;
  contadorMedios = 0;
  subtotalTemp: number;
  arrayvaloresTemp = new Array<any>();
  IdMedioPagoTemp = new Array<any>();

  ArrayPacientesResponsables: any;
  subMenuUser: any;


  constructor(private _paternidadService: PaternidadService, private formbuilder: FormBuilder, private formbuilderAcu: FormBuilder,
    private ServiceGenerico: GenericoService, private ServiceVentas: VentasService, private ServicePaciente: ClientesService, private router: Router,private ValidarPermisos: ValidarPermisos) { }

  ngOnInit(): void {
    this.CargarInfoGeneral();
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'));
    this.sede = JSON.parse(sessionStorage.getItem('Sede'));
    this.formPacientes = this.formbuilder.group({
      id: [''],
      documento: ['', [Validators.required]],
      tipodocumento: [''], fechanacimiento: ['', [Validators.required]],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''], PoliticaDatos: [''], correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      Idciudad: ['', [Validators.required]],
      Idbarrio: [''], Idestadocivil: ['', [Validators.required]],
      Idestrato: ['', [Validators.required]],
      IdTipAfil: ['0', [Validators.required]],
      NombreBarrio: [''], Idsexo: ['', [Validators.required]],
      IdDepto: ['', [Validators.required]],
      IdLocalidad: [''], Pais: ['161'], IdEps: [''],
      IdParentesco: ['', [Validators.required]],
      embarazo: ['0'],
      discapacidad: ['0'],
      IdUsuario: this.IdUsuario,
      bandera_origen: ['']
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.ValidarPermisosAcceso(this.router.url, this.subMenuUser);

  }
  
  ValidarPermisosAcceso(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }
  
  async CargarInfoGeneral() {
    this.Arraytipo = await this._paternidadService.Listartiposolicitud();
    this.ArrayDiscapacidad = await this.ServicePaciente.ConsultarDispacidades();
    this.mediosPago = await this.ServiceVentas.ConsultarMediosPago();
    this.GesDocument = await this.ServiceGenerico.ConsultarTipoDoc();
    this.ArrayEstadoCivil = await this.ServiceGenerico.ConsultarestadoCivil();
    this.ArrayTipAfiliacion = await this.ServiceGenerico.ConsultarTipoAfilicacion();
    this.ArrayGenero = await this.ServiceGenerico.ConsultarGenero();
    this.ArrayPais = await this.ServiceGenerico.ConsultarPaises();
    this.ArrayDepart = await this.ServiceGenerico.ConsultarDepartamento();
    this.ArrayEstr = await this.ServiceGenerico.Consultarestratos();
    this.ArrayEps = await this.ServiceGenerico.ConsultarEps();
    this.ArrayParentesco = await this._paternidadService.ListarParentesco();
    this.DataPlanes = await (await this.ServiceVentas.ConsultarPlanes()).filter(p => p.IdTarifa == 8);
    await this.EliminarProcedimientosVentas(0, 2, 0);
  }
  
  
  //Obtiene la cantidad de pacientes que se van a registrar durante la venta.
  getNumPacientes() {
    this.NumPacientes = Number($('#cantidadPac').val());
    if (this.NumPacientes < 1) {
      $('#cantidadPac').val('1');
      this.NumPacientes = 1;
    }
  }


  ValidarGenero(idgenero) {
    if (+idgenero == 2) {
      this.verEmbarazo = true;
    } else {
      this.verEmbarazo = false;
    }
  }

  async ConsultarInfo() {
    let fechaini = $('#txtfechaini').val();
    let fechafin = $('#txtfechafin').val();
    let nosolicitud = $('#txtnosolicitud').val();
    let documento = $('#txtdocumento').val();
    this.ArrayGeneral = await this._paternidadService.ConsultarInfoCarga(documento, fechaini, fechafin, nosolicitud, 0);
    this.Vertabla = true;
  }

  async incomingfile(event) {
    this.nameFile = event[0].name;
    this.file = event[0].base64;
  }

  habilitarCarga() {
    let opcion = $("#selTipo").val();
    if (opcion === "9") {
      this.divcarga = true;
      this.botonSiguiente = true;
    } else if (opcion === "8") {
      this.botonSiguiente = true;
      this.divcarga = false;
    } else {
      this.botonSiguiente = false;
      this.divcarga = false;
    }
  }

  siguiente(paso) {
    $('.tab-pane').hide();
    if (paso === 1) {
      if (this.validarCantidadPaciente() === true) {
        var activetab = $('#tabRegistro').attr('href');
        $(activetab).show();
        $('#LiTipo').addClass('active');
        $('#LiRegistro').addClass('active');
      } else {
        var activetab = $('#tabTipo').attr('href');
        $(activetab).show();
        $('#LiRegistro').removeClass('active');
        $('#LiTipo').addClass('active');
        Swal.fire({
          icon: 'warning',
          text: 'Por favor ingresa la cantidad de pacientes',
          showConfirmButton: true
        })
      }
    }
    else if (paso == 2) {
      if (this.CalcularCantidadPaciente() === true) {
        var activetab = $('#tabPlan').attr('href');
        $(activetab).show();
        $('#LiPlan').addClass('active');
        $('#LiRegistro').addClass('active');
      } else {
        var activetab = $('#tabRegistro').attr('href');
        $(activetab).show();
        $('#LiRegistro').addClass('active');
        $('#LiPlan').removeClass('active');
        // Swal.fire({
        //   icon: 'warning',
        //   text: 'Te hacen falta pacientes por registrar',
        //   showConfirmButton: true
        // });
        (<any>$('#faltanPacientes')).modal('show');

      }
    }
    else if (paso == 3) {
      if (this.ValidarListarProcedimientos() != true) {
        var activetab = $('#tabPlan').attr('href');
        $(activetab).show();
        $('#LiPlan').addClass('active');
        $('#LiPago').addClass('active');
        Swal.fire({
          icon: 'warning',
          text: 'Debes seleccionar por lo menos un procedimiento',
          showConfirmButton: true
        });
      } else {
        var activetab = $('#tabPago').attr('href');
        $(activetab).show();
        $('#LiPlan').addClass('active');
        $('#LiPago').addClass('active');
      }
    }
    else if (paso == 4) {
      if (this.MedioPago.length == 0) {
        var activetab = $('#tabPago').attr('href');
        $(activetab).show();
        $('#LiPago').addClass('active');
        $('#LiResumen').addClass('active');
        Swal.fire({
          icon: 'warning',
          text: 'Debes seleccionar por lo menos un medio de pago',
          showConfirmButton: true
        });
      } else if ($("#SelResponsable").val() == "0") {
        var activetab = $('#tabPago').attr('href');
        $(activetab).show();
        $('#LiPago').addClass('active');
        $('#LiResumen').removeClass('active');
        Swal.fire({
          icon: 'warning',
          text: 'Debes seleccionar un resposable para la facturación',
          showConfirmButton: true
        });
      }
      else {
        this.pacienteseleccionado = this.ArrayPacientes.filter(paci => paci.IdGrupo == this.idgrupo);
        this.crearResponsable();
        var activetab = $('#tabResumen').attr('href');
        $(activetab).show();
        $('#LiPago').addClass('active');
        $('#LiResumen').addClass('active');
      }
    }
  }

  atras(paso) {
    $('.tab-pane').hide();
    if (paso === 1) {
      var activetab = $('#tabTipo').attr('href');
      $(activetab).show();
      $('#LiRegistro').removeClass('active');
      $('#LiTipo').addClass('active');
    }
    else if (paso === 2) {
      var activetab = $('#tabPlan').attr('href');
      var activetab2 = $('#tabRegistro').attr('href');
      $(activetab2).show();
      $(activetab).hide();
      $('#LiPlan').removeClass('active');
      $('#LiRegistro').addClass('active')

    }
    else if (paso === 3) {
      var activetab = $('#tabPago').attr('href');
      var activetab2 = $('#tabPlan').attr('href');
      $(activetab).hide();
      $(activetab2).show();
      $('#LiPago').removeClass('active');
      $('#LiPlan').addClass('active')
    }
    else if (paso === 4) {
      var activetab = $('#tabResumen').attr('href');
      var activetab2 = $('#tabPago').attr('href');
      $(activetab).hide();
      $(activetab2).show();
      $('#LiResumen').removeClass('active');
      $('#LiPago').addClass('active')
    }
  }

  validarCantidadPaciente() {
    let validador = false;
    let cantidad = $("#cantidadPac").val();
    if (cantidad != "") {
      this.quantityPac = Number(cantidad);
      validador = true
    }
    return validador;
  }

  CalcularCantidadPaciente() {
    let validador = false;
    if (this.contador < this.quantityPac) {
      return validador
    } else {
      validador = true;
      return validador
    }
  }

  AsociarPacientes() {
    this.resumenPaciente = false;
    this.botonCerrar = true;
    //this.limpiarTabPrincipal();
    var Entrega = $('#tabEntrega').attr('href');
    $(Entrega).hide();
    this.cerrarModal();
    this.formularioPacientes = false;
    (<any>$('#DivPacientes')).modal('show');
  }

  ValidarTipoEntrega(id) {
    if (id === "1") {
      this.btn_Anterior_entrega = false;
      this.btn_Confirmar_entrega = true;
      this.ParrafoCorreo = false;
      this.btn_firmar_entrega = false;
      this.puntoEntrega = Number(id);
    } else if (id === "2") {
      this.ParrafoCorreo = true;
      this.btn_firmar_entrega = true;
      this.btn_Anterior_entrega = false;
      this.btn_Confirmar_entrega = false;
      this.puntoEntrega = Number(id);
    }
    else {
      this.btn_Anterior_entrega = true;
      this.btn_Confirmar_entrega = false;
      this.ParrafoCorreo = false;
      this.btn_firmar_entrega = false;
      this.btn_Anterior_entrega = false;
      this.btn_Confirmar_entrega = false;
    }
  }

  async ConfirmarSolicitud() {
    let tiposolicitud = $("#selTipo").val();
    let cantidad = $("#cantidadPac").val();
    let NoOrdenamiento = $("#NoOrdenamiento").val();

    if (tiposolicitud == "9") {
      if (this.file === undefined) {
        Swal.fire({
          icon: 'warning',
          text: 'Por favor ingrese el adjunto correspondiente',
          showConfirmButton: true
        })
      } else {
        const solicitud = {
          Id: 0,
          IdTipo: Number(tiposolicitud),
          cantidadPaciente: +cantidad,
          adjuntoSolicitud: this.file,
          NoOrdenamiento: NoOrdenamiento,
          IdSede: this.sede[0].id,
          IdUsuario: this.IdUsuario
        }
        await this._paternidadService.CrearSolicitud(solicitud).then(response => {
          this.IdSolicitud = response;
          this.siguiente(1);
        });
      }
    } else {
      const solicitud = {
        Id: 0,
        IdTipo: Number(tiposolicitud),
        cantidadPaciente: +cantidad,
        adjuntoSolicitud: "",
        NoOrdenamiento: "",
        IdSede: this.sede[0].id,
        IdUsuario: this.IdUsuario
      }
      await this._paternidadService.CrearSolicitud(solicitud).then(response => {
        this.IdSolicitud = response;
        this.siguiente(1);
      });
    }
  }

  async FinRegistro() {
    const GrupoPaternidad = {
      IdGrupo: 0,
      IdSolicitud: this.IdSolicitud,
      IdPaciente: this.idpaciente,
      PuntoEntrega: this.puntoEntrega,
      IdTipoMuestra: 0,
      IdSede: this.sede[0].id,
      Origen: 'PA',
      IdUsuario:this.IdUsuario
    }

    await this._paternidadService.CrearGrupoPaternidad(GrupoPaternidad).then(response => {
      Swal.fire({
        icon: 'success',
        text: this.puntoEntrega == 2 ? 'Consentimiento cargado correctamente' : 'Solicitud creada exitosamente',
        showConfirmButton: true
      }).then(result => {
        if (result.isConfirmed) {
          if (this.puntoEntrega == 2) {
            (<any>$('#CargarConsentimiento')).modal('hide');
            this.GuardarFinal(response);
          } else {
            (<any>$('#DivPacientes')).modal('hide');
            this.listarPacientesPaternidad();
            this.limpiarTabPrincipal();
          }
        }
      });
    })
  }

  ContinuarSinRegistro() {
    if (this.contador == 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Debes registrar al menos un paciente para continuar',
        showConfirmButton: true
      });
      (<any>$('#faltanPacientes')).modal('hide');
    } else {
      $('.tab-pane').hide();
      var activetab = $('#tabPlan').attr('href');
      $(activetab).show();
      $('#LiPlan').addClass('active');
      $('#LiRegistro').removeClass('active');

      (<any>$('#faltanPacientes')).modal('hide');
    }

  }

  limpiarTabPrincipal() {
    this.formPacientes = this.formbuilder.group({
      id: [''],
      documento: [''],
      tipodocumento: [''], fechanacimiento: [''],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''], PoliticaDatos: [''], correo: [''],
      telefono: [''],
      celular: [''], direccion: [''],
      Idciudad: [''],
      Idbarrio: [''], Idestadocivil: [''],
      Idestrato: [''],
      IdTipAfil: ['0'],
      NombreBarrio: [''],
      Idsexo: [''],
      IdDepto: [''],
      IdLocalidad: [''], Pais: ['161'], IdEps: [''], edad: [''],
      AbreviaturaTipodoc: [''],
      IdParentesco: [''],
      bandera_origen: [''],
      IdSolicitud: [''],
      embarazo: ['0'],
      discapacidad: ['0'],
      IdUsuario: this.IdUsuario
    });
    var activetab3 = $('#tabEntrega').attr('href');
    $(activetab3).hide()
    $('#Lipaciente').addClass('active');
    $('#Lientrega').removeClass('active');
    this.formularioPacientes = false;
    var activetabPac = $('#tabPaciente').attr('href');
    $(activetabPac).show();
    $('#SelEntrega').val(0);
    this.ParrafoCorreo = false;
    this.nameFile = 'Arrastra y suelta tu documento legal o haz clic aquí';;
    this.fileConsentimiento = "";
    this.showAge = '';
  }

  async listarPacientesPaternidad() {
    await this._paternidadService.ConsultarPacientesPaternidad(this.IdUsuario, this.IdSolicitud).then(data => {
      this.contador = this.contador + 1;
      this.ArrayPacientes = data;
      this.ArrayPacientesResponsables = data.filter(r => r.IdTipoDocumento != 7 && r.IdTipoDocumento != 8);
      this.Porcentaje = Math.round((((this.contador) / this.quantityPac) * 100));
      if (this.contador == this.quantityPac) {
        this.button_asociar = false;
      }
    });
  }

  async EliminarPacientes(idGrupo) {

    await this._paternidadService.EliminarPacientesPaternidad(idGrupo).then(async response => {
      this.contador = this.contador - 1;
      this.Porcentaje = Math.round((((this.contador) / this.quantityPac) * 100));
      if (this.contador != this.quantityPac) {
        this.button_asociar = true;
      }
      this.ArrayPacientes = await this._paternidadService.ConsultarPacientesPaternidad(this.IdUsuario, this.IdSolicitud);
    })

  }

  PreselectPlan(entidad) {
    this.idplan = entidad.Id;
  }

  SeleccionarPlan(bandera) {
    if (this.idplan === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Debe seleccionar un plan para continuar',
        showConfirmButton: true
      });
    } else {
      for (const dato of this.DataPlanes.filter(x => x.Id === Number(this.idplan))) {
        this.Tarifa = dato.IdTarifa;
      }
      if (bandera == 1) {
        $("#botonUsar").hide()
        $("#botonCambiar").show()
        this.disabled = true;
        this.VerRadioOpciones = true;
        $("#selopciones").val("2");
        this.cargarInformacion("2");
        this.VerExamen = true;
      } else {
        if (this.contadorProcedimientos > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: 'Debe eliminar todos los procedimientos seleccionados para cambiar de plan',
            showConfirmButton: true
          });
        } else {
          $("#botonUsar").show()
          $("#botonCambiar").hide()
          this.disabled = false;
          this.VerRadioOpciones = false;
          this.TablaProcedimientos = false;
        }
      }
    }
  }

  async cargarInformacion(bandera) {
    this.ArrayExamenes = await this.ServiceVentas.ConsultarProcedimientosPlan(bandera, this.idplan);
  }

  SelectExam(AutoExamen, bandera) {
    this.Examen = AutoExamen;
    this.banderaExam = bandera;
    this.AgregarExamen();
  }

  async AgregarExamen() {
    await this.ServiceVentas.GuardarProcedimientos(this.Examen.idProcedimiento, this.banderaExam, this.Tarifa, this.IdUsuario).then(response => {
      if (response.toString().split(',')[1] != "0") {
        Swal.fire({
          icon: 'info',
          title: response.toString().split(',')[0],
          showConfirmButton: true
        }).then(result => {
          if (result.isConfirmed) {
            this.LimpiarAutoComplete();
          }
        });
      }
      if (response.toString().split(',')[1] === "0") {
        this.contadorProcedimientos = this.contadorProcedimientos + 1;
        this.LimpiarAutoComplete();
        this.ListarProcedimientos();
        this.TablaProcedimientos = true;
        // this.GuardarTemProcedimientos(this.Examen.idProcedimiento, true, this.banderaExam);
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
  }

  LimpiarAutoComplete() {
    // this.auto.clear();
    // this.auto.close();
  }

  EliminarProcedimientosVentas(id: any, bandera: any, codigo: any) {
    this.ServiceVentas.EliminarProcedimientos(id, bandera, this.IdUsuario).then(response => {
      if (bandera == 1) {
        this.contadorProcedimientos = this.contadorProcedimientos - 1;
        if (this.contadorProcedimientos == 0) {
          this.TablaProcedimientos = false;
        }
        this.ListarProcedimientos();
      }
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

  async ListarProcedimientos() {
    await this.ServiceVentas.ListarProcedimientos(this.IdUsuario, this.idplan).then((data) => {
      this.ArrayProcedimientos = data;
      var total = 0;
      for (const info of data) {
        var valorcalculado = info.Valor;
        total += Number(valorcalculado);
      }
      this.TotalFinal = total;
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

  ValidarListarProcedimientos() {
    var validador = false;
    if (this.contadorProcedimientos > 0) {
      validador = true;
    }
    return validador;
  }

  BindingInput(bandera) {
    if (bandera === 1) {
      this.LimpiarArrays();
      this.IdValidador = bandera
      this.mediosPago.forEach(element => {
        $('#opciones' + element.id).removeClass('custom-radio').addClass('custom-checkbox');
        $('#TxtValor' + element.id).val('').removeClass('input-control').addClass('formPacientes-control').prop('disabled', true);
        $('#customRadioInline' + element.id).attr('type', 'checkbox').prop('checked', false).prop('disabled', false);
        $("#divPago").show();
        this.disabledText = true;
        this.TotalCalculo = 0;
        this.contadorMedios = 0;
      });
    } else {
      this.LimpiarArrays();
      this.IdValidador = bandera
      this.mediosPago.forEach(element => {
        $('#TxtValor' + element.id).prop('disabled', true).val("$" + this.TotalFinal).addClass('input-control').removeClass('formPacientes-control');
        $('#opciones' + element.id).removeClass('custom-checkbox').addClass('custom-radio');
        $('#customRadioInline' + element.id).attr('type', 'radio').prop('disabled', false).prop('checked', false);
        $("#divPago").hide();
        this.disabledText = false;
      });
    }
  }
  LimpiarArrays() {
    this.MedioPago.length = 0;
    this.IdMedioPago.length = 0;
    this.arrayvalores.length = 0;
  }

  SelectMedioPago(Id, descripcion) {
    if (this.IdValidador != 1) {
      $('#radioNo').prop('checked', true);
      this.MedioPago[0] = { id: Id, descripcion: descripcion };
      this.IdMedioPago[0] = Id;
    } else {
      if ($('#customRadioInline' + Id).prop('checked') == true) {
        $('#TxtValor' + Id).prop('disabled', false);
        this.contadorMedios++;
        if (this.contadorMedios > 2) {
          $('#customRadioInline' + Id).prop('checked', false);
          $('#TxtValor' + Id).prop('disabled', true).val('');
          this.contadorMedios--;
          Swal.fire({
            text: "Solo puedes seleccionar 2 medios de pago.",
            icon: 'warning',
          });
        }
      } else {
        $('#TxtValor' + Id).prop('disabled', true).val('');
        this.contadorMedios--;
        this.CalcularTotalMediosPago(Id);
      }
    }
  }

  CalcularTotalMediosPago(id) {
    let valorActual = Number($("#TxtValor" + id).val());
    this.TotalCalculo = 0;
    this.mediosPago.forEach(element => {
      let precio_compra = Number($("#TxtValor" + element.id).val());
      this.TotalCalculo += precio_compra;
      if (this.TotalCalculo > this.TotalFinal) {
        Swal.fire({
          text: "El valor excede al total a pagar.",
          icon: 'warning',
        });
        this.subtotalTemp = this.TotalCalculo
        this.subtotalTemp -= valorActual;
        this.TotalCalculo = this.subtotalTemp;
        $('#customRadioInline' + id).prop('checked', true);
        $("#TxtValor" + id).val('');
      }
    });
    if (this.TotalCalculo === this.TotalFinal) {
      (<any>$('#ConfirmarPagos')).modal('show');
    }
  }

  //Inactiva el cambio de medios de pago si son aceptados los medios elegidos.
  confirmarMedioPago(bandera: any) {
    if (bandera == 1) {
      this.arrayvalores.length = 0;
      this.arrayvaloresTemp.length = 0;
      this.IdMedioPago.length = 0;
      this.IdMedioPagoTemp.length = 0;

      this.mediosPago.forEach(element => {
        $('#TxtValor' + element.id).prop('disabled', true);
        $('#customRadioInline' + element.id).prop('disabled', true);
        let valor = Number($("#TxtValor" + element.id).val());
        this.arrayvaloresTemp.push(valor);
        if (($('#customRadioInline' + element.id).prop('checked') == true)) {
          this.IdMedioPagoTemp.push(element.id);
          this.MedioPago.push({ id: element.id, descripcion: element.medioPago });
        } else {
          this.IdMedioPagoTemp.push(0);
        }
      });
      this.arrayvalores = this.arrayvaloresTemp.filter((x) => x != 0);
      this.IdMedioPago = this.IdMedioPagoTemp.filter((x) => x != 0);
      $('#radioSi').prop('disabled', true);
      $('#radioNo').prop('disabled', true);
    } else {
      this.BindingInput(1);
    }
  }

  async crearVentaPaternidad() {
    if (this.arrayvalores.length == 0) {
      this.arrayvalores.push(this.TotalFinal);
    }

    const datosVenta = {
      IdSolicitud: +this.IdSolicitud,
      IdSede: this.sede[0].id,
      Total: this.arrayvalores,
      MediosPago: this.IdMedioPago,
      IdExamen: this.Examen.idProcedimiento,
      IdPlan: this.idplan,
      IdEstado: 1,
      Observacion: $("#Observacion").val(),
      correoConfirmacion: $("#correoConfirmacion").val(),
      Politicadatos: $("#customRadioPoliticasSi").is(':checked') === true ? 1 : 2,
      IdUsuario: this.IdUsuario,
      IdTipoServ: 3
    }
    if (datosVenta.Politicadatos == 1) {
      return await this._paternidadService.VentaPaternidad(datosVenta).then(response => {
        let index = this.IdMedioPago.filter(element => element == 4);
        if (+index == 4) {
          if (response === "Cod:16") {
            Swal.fire({
              icon: 'warning',
              title: "Atención, hemos detectado que tú token del datafono no se encuentra autorizado",
              showConfirmButton: true
            });
          } else if (response == "Cod:99") {
            Swal.fire({
              icon: 'warning',
              title: "Transacción negada o cancelada por el cajero",
              showConfirmButton: true
            });
          } else {
            this.idTransaccion = response.toString().split(',')[1];
            this.NumeroSolicitud = response.toString().split(',')[2];
            (<any>$('#ModalTransaccion')).modal('show');
          }
        } else {
          this.NumeroSolicitud = response.toString().split(',')[2];
          this.VerModalFacturacion();
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Opps...',
        text: 'Para continuar, debes estar de acuerdo con la política de tratamiento de datos.',
        showConfirmButton: true
      });
    }
  }

  async ConfirmarPago() {
    await this.ConfirmarPagoElectronico(this.idTransaccion, this.IdUsuario, this.sede[0].id);
  }

  async ConfirmarPagoElectronico(idtransaccion, usuario, idSede) {
    await this._paternidadService.ConfirmarPagoDatafono(idtransaccion, usuario, idSede, this.categoria).then(response => {
      if (response === "") {
        this.VerModalFacturacion();
      } else {
        this.VerAlerta = true;
        this.NotificacionError = response.toString();
      }
    })
  }

  AlertaProceso() {
    Swal.fire({
      icon: 'warning',
      title: 'Esta seguro que desea cancelar todo el proceso',
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Continuar',
    }).then(result => {
      if (result.isConfirmed) {
        this.AnularPagoElectronico();
      } else {
        Swal.close();
      }
    });
  }

  async AnularPagoElectronico() {
    await this.ServiceVentas.BorrarPagoDatafono(this.idTransaccion, this.IdUsuario, this.sede[0].id, 'PA').then(response => {
      (<any>$('#ModalTransaccion')).modal('hide');
      this.ReiniciarProceso()
    });
  }


  VerModalFacturacion() {
    (<any>$('#irfacturacion')).modal('show');
  }

  NavegarFacturacion() {
    this.router.navigate(['/facturacion']);
    (<any>$('#irfacturacion')).modal('hide');
  }

  ReiniciarProceso() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  LimpiarFirma() {
    this.signaturepad.clear();
  }

  CapturarFirma() {
    (<any>$('#DivPacientes')).modal('hide');
    (<any>$('#CargarConsentimiento')).modal('show');

  }

  VolverConsentimiento() {
    (<any>$('#DivPacientes')).modal('show');
    (<any>$('#CargarConsentimiento')).modal('hide');

  }

  LoadFileConsent(event) {
    let extencion = event[0].name.toString().split('.');
    if (extencion[1] != "pdf") {
      this.extencionIncorrect = true;
    } else {
      this.extencionIncorrect = false;
      this.nameFile = event[0].name;
      this.fileConsentimiento = event[0].base64;
    }
  }

  async GuardarFinal(IdGrupoCreado) {
    const Dataconsentimiento = {
      IdGrupo: +IdGrupoCreado,
      archivo: this.fileConsentimiento,
      idusuario: this.IdUsuario
    }
    await this._paternidadService.CargarConsentimiento(Dataconsentimiento).then(response => {
      Swal.fire({
        text: 'Solicitud creada exitosamente',
        icon: 'success',
        showConfirmButton: true
      }).then(result => {
        if (result.isConfirmed) {
          (<any>$('#DivPacientes')).modal('hide');
          this.listarPacientesPaternidad();
          this.limpiarTabPrincipal();
        }
      });
    });
  }

  /*Metodos gestion pacientes*/

  Next_Paciente(bandera) {
    $('.tab-pane3').hide();
    if (bandera == 2) {
      var activetab2 = $('#tab2').attr('href');
      $(activetab2).show()
      $('#Li2').addClass('active');
      $('#Li1').removeClass('active');
    } else if (bandera == 3) {
      var activetab3 = $('#tab3').attr('href');
      $(activetab3).show()
      $('#Li3').addClass('active');
      $('#Li2').removeClass('active');
    } else if (bandera == 4) {
      var activetab3 = $('#tabEntrega').attr('href');
      $(activetab3).show()
      $('#Lipaciente').addClass('active');
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
      this.formularioPacientes = false;
      var activetabPac = $('#tabPaciente').attr('href');
      $(activetabPac).show();
      setTimeout(() => {
        var activetab3 = $('#tab3').attr('href');
        var activetab = $('#tab1').attr('href');
        var activetab2 = $('#tab2').attr('href');
        $(activetab).hide();
        $(activetab2).hide();
        $(activetab3).show();
        if (this.Pacienteexistente = true) {
          $('#btnActualizar').hide();
          $('#btnSiguienteFin').show();
        } else if (this.pacientenuevo = true) {
          $('#btnGuardar').hide();
          $('#btnSiguienteFin').show();
        }

      }, 15);
    } else {
      this.resumenPaciente = true;
      this.formularioPacientes = false;
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

  //listamos la ciudades
  async listarCiudades(Idciudad: number) {
    await this.ServiceGenerico.ConsultarCiudades(Idciudad).then((data) => {
      this.ArrayCity = data;
    });
  }
  //listamos las localidades
  async listarLocalidades(IdCiudad: any) {
    await this.ServiceGenerico.Consultarlocalidad(IdCiudad).then((resp) => {
      this.Arraylocalidad = resp;
    });
  }
  //listamos los barrios
  async ListarBarrios(IdLocalidad: any) {
    await this.ServiceGenerico.ConsultarBarrios(IdLocalidad).then((resp) => {
      this.ArrayBarrio = resp;
    });
  }

  AsigPolitica(seleccion, bandera) {
    if (bandera == 1) {
      if ((seleccion == 1)) {
        this.formPacientes.value.PoliticaDatos = 1;
        $('#btnGuardar').prop('disabled', false);
        this.politicaAceptada = true;
      } else {
        this.formPacientes.value.PoliticaDatos = 2
        $('#btnGuardar').prop('disabled', true);
        this.politicaAceptada = false;
      }
    }
    // else {
    //   if ((valor = 'on')) {
    //     this.formCrearAcudiente.value.PoliticaDatos = 1;
    //   }
    // }
  }

  //get primerNombre() { return this.formPacientes.get('primerNombre'); }

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

  mostrarformulario() {
    this.resumenPaciente = false;
    this.formularioPacientes = true;

  }
  resetConsulta() {
    $('#txtdocumento').val('');
    $('#SelTipDoc').val('');
    this.pacientenuevo = false;
    this.Pacienteexistente = false;
    this.formularioPacientes = false;
    this.resumenPaciente = false;
  }

  async consultar() {
    this.pacientenuevo = false;
    this.Pacienteexistente = false;
    this.formularioPacientes = false;
    this.resumenPaciente = false;

    var documento = $('#txtdocumento').val();
    var tipodocumento = $('#SelTipDoc').val();
    if (documento == '' || tipodocumento == '') {
      return this.camposObligatorios();
    } else {
      await this.ServicePaciente.DetallPaciente(documento, tipodocumento).then(response => {
        if (response.length > 0) {
          this.Pacienteexistente = true;
          this.pacientenuevo = false;
          this.formularioPacientes = false;
          this.botonCerrar = false;
          this.CargarDatosPaciente(response);
          this.resumenPaciente = true;
        } else {
          (<any>$('#NoexistPaciente')).modal('show');
          this.Pacienteexistente = false;
          this.pacientenuevo = true;
          this.botonCerrar = false;
        }
      })
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
      if (datos.PoliticaDatos == 1) {
        $("#radioPolitica").prop('checked', true);
      }

      this.cargarCiudades(datos.IdDepto, datos.Idciudad, datos.IdLocalidad, datos.fechanacimiento);
    }
    this.ValidarGenero(datosPaciente[0].Idsexo);
  }

  async cargarCiudades(IdDept: number, ciudad: number, Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.ConsultarCiudades(IdDept).then((data) => {
      this.ArrayCity = data;
      this.CargarLocalidades(ciudad, Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarLocalidades(ciudad: number, Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.Consultarlocalidad(ciudad).then((data) => {
      this.Arraylocalidad = data;
      this.CargarBarrios(Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarBarrios(Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.ConsultarBarrios(Idlocalidad).then((data) => {
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
      this.showAge1 = years + ' Años '
      //this.validar(years);
      // return this.showAge;
    } else {
      const convertAge = new Date(fecha);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAgeAcu = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
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

        this.formPacientes.value.bandera_origen = "PA";
        this.ServicePaciente.CrearPaciente(this.formPacientes.value).then(
          (resp) => {
            var IdPacNew = resp.toString().split(',')[1];
            this.idpaciente = +IdPacNew;
            sessionStorage.setItem('Idpaciente', JSON.stringify(IdPacNew));
            this.CorreoEnvio = this.formPacientes.value.correo;
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
  }

  alerta() {
    this.showModalAlert = true;
    (<any>$('#NoexistAcudiente')).modal('show');
  }

  EscanearDocumento() {
    //let trama = ["10184802492", "MENDOZA", "VARGAS", "KEIDER", "RAFAEL", "M", "19951027", "A+", "35904463", "1445"]
    Swal.fire({
      title: 'Escaneo de documento',
      text: 'Acerque su documento',
      imageUrl: '../../../assets/images/EscanerDeBarras.jpg',
      imageWidth: 300,
      imageHeight: 200,
      input: "text",
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
    let fecha = moment(trama.toString().toUpperCase().split(',')[6]).locale('es-CO').format('YYYY-MM-DD')
    this.CalcularEdad(fecha, 1);
    this.consultar();
    if (trama.toString().split(',')[5] == "M") {
      sexo = 1;
    } else if (trama.toString().split(',')[5] == "F") {
      sexo = 2;
    } else {
      sexo = "";
    }

    this.formPacientes.patchValue({
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

  barcode() {
    (<any>$('#DivPacientes')).modal('hide');
    (<any>$('#barcode')).modal('show');
  }

  async ParseoDataPaciente() {
    await this.ServicePaciente.DetallPaciente(this.formPacientes.value.documento, this.formPacientes.value.tipodocumento).then(response => {
      this.PacienteCre = response;
    })
  }

  ValidarCampos() {
    this.validaCampos = false
    if (this.formPacientes.value.correo == '' || this.formPacientes.value.documento == '' || this.formPacientes.value.tipodocumento == '0'
      || this.formPacientes.value.fechanacimiento == '' || this.formPacientes.value.primerNombre == '' || this.formPacientes.value.primerApellido == ''
      || this.formPacientes.value.telefono == '' || this.formPacientes.value.direccion == '' || this.formPacientes.value.Idciudad == '0'
      || this.formPacientes.value.Idestadocivil == '0' || this.formPacientes.value.Idestrato == '0' || this.formPacientes.value.IdTipAfil == ''
      || this.formPacientes.value.Idsexo == '0' || this.formPacientes.value.IdDepto == '0'|| this.formPacientes.value.IdParentesco == '' ) {
      this.validaCampos = true;
    }
    return this.validaCampos;
  }

  async ActualizarDatos() {
this.submit = true;
    if (this.ValidarCampos()) {
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
      await this.ServicePaciente.UpdatePaciente(this.formPacientes.value).then(
        (resp) => {
          var IdPacNew = resp.toString().split(',')[1];
          this.idpaciente = +IdPacNew;
          sessionStorage.setItem('Idpaciente', JSON.stringify(IdPacNew));
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
          this.submit = false;
        })
    }
  }

  HabilitarRegistro(valor) {
    if (valor == "-1") {
      this.bandera_crea = 1;
      this.MostrarResponsable = true;
    } else {
      this.idgrupo = +valor;
      this.MostrarResponsable = false;
      this.bandera_crea = 2;
      // this.crearResponsable();
    }
  }

  async crearResponsable() {
    const dataresponsable = {
      id: this.bandera_crea == 1 ? 0 : this.idgrupo,
      tipodoc: this.bandera_crea == 1 ? +$("#tipodoc").val() : 0,
      Idsolicitud: +this.IdSolicitud,
      nombres: this.bandera_crea == 1 ? $("#nombres").val() : 0,
      apellidos: this.bandera_crea == 1 ? $("#apellidos").val() : 0,
      documentoR: this.bandera_crea == 1 ? $("#documentoR").val() : 0,
      correo: this.bandera_crea == 1 ? $("#correo").val() : 0,
      Categoria: 'PA',
      IdUsuario:this.IdUsuario
    }
    await this._paternidadService.CrearResponsableFactura(dataresponsable).then(response => {
    })
  }

  cerrarModal() {
    this.formularioPacientes = false;
    $('#SelTipDoc').val("");
    $('#txtdocumento').val("");
    var activetabPac = $('#tabPaciente').attr('href');
    $(activetabPac).show()
    var Entrega = $('#tabEntrega').attr('href');
    $(Entrega).hide();

  }

  detalleExamen() {
    (<any>$('#detalleExamenPaciente')).modal('show');
  }

}
