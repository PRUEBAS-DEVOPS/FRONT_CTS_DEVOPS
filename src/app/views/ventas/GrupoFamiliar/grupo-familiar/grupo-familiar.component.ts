import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrupoFamiliarservice } from 'src/app/services/GrupoFamiliar/GrupoFamiliar.service';
import { ClientesService } from 'src/app/services/Preatencion/clientes.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import { pacientes } from 'src/app/models/Preatencion/CrearPaciente.model';
import { Router } from '@angular/router';
import { PaternidadService } from 'src/app/services/Paternidad/PaternidadService.service';
import * as moment from 'moment';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { ServicioDetrasladoService } from 'src/app/services/Punte/servicio-detraslado.service';

@Component({
  selector: 'app-grupo-familiar',
  templateUrl: './grupo-familiar.component.html',
  styleUrls: ['./grupo-familiar.component.css']
})


export class GrupoFamiliarComponent implements OnInit {
  formPacientes: FormGroup;
  formCrearAcudiente: FormGroup;
  formResumen: FormGroup;
  @ViewChild('auto') auto;
  @ViewChild('autoPlan') autoPlan;
  idplan: any = 0;
  disabled: boolean = false;
  keywordPlan = 'Concatenado';
  keyword = 'NombreProcedimiento';
  DataPlanes: any;
  Tarifa: any;
  VerRadioOpciones: boolean;
  VerExamen = false;
  contador: number = 0;
  contador2: number = 0;
  contPacientes: number = 0;
  PorcentajeExamenes: any;
  PorcentajePacientes: any
  TablaProcedimientos: boolean;
  TablaExamenes: boolean;
  DataProcedimientos: any;
  ArrayExamenes: any;
  Verchequeo: boolean;
  ArrayChequeos: any;
  Chequeo: any;
  banderaChe: any;
  ArrayProcedimientos: any[];
  IdUsuario: any;
  TotalFinal: number;
  Examen: any;
  banderaExam: any;
  pagina: number = 1;
  MostrarResponsable = false;
  mediosPago: any[];
  disabledText: any = false;
  TotalCalculo: number = 0;
  MedioPago = new Array<any>();
  IdValidador: number;
  IdMedioPago = false;
  divPago = false;
  /*Varibales Gestion pacientes*/
  GesDocument: any;
  ArrayEstadoCivil: any;
  ArrayTipAfiliacion: any;
  ArrayGenero: any;
  ArrayPais: any;
  ArrayDepart: any;
  ArrayEstr: any;
  ArrayEps: any;
  Pacienteexistente: boolean;
  pacientenuevo: boolean;
  PacienteExt: any;
  BtnVerAcudiente: boolean;
  IdAcudiente: any;
  ArrayCity: any;
  Arraylocalidad: any;
  ArrayBarrio: any;
  showAgeAcu: number;
  showAge: string;
  menordeedad: boolean;
  formularioPacientes = false;
  submit: boolean;
  CrearAcudiente: boolean;
  BandValidar: boolean;
  showModalAlert: boolean;
  PacienteCre: any;
  ContainerVisualizar: boolean;
  vizualizaraAcudiente: pacientes[];
  paciente: boolean;
  Acudiente: boolean;
  ContainerVisualizarAcudiente: boolean;
  formularioAcudiente: boolean;
  IdRol: any;
  quantity: number = 0;
  botonCerrar: boolean;
  resumenPaciente: boolean;
  consultarPaciente = true;
  ArrayExCargados: any[] = [];
  contadorExamenes: number = 0;
  bandera_crea_edita_acu: number = 0;
  validarVinculacion: number = 0;
  selectedIdExam: any;
  IdPacNew: any;
  ArrayPacientesGrupo: any;
  exPendientes: boolean;
  ArrayTemp: any[];
  indice: any;
  idExamenGlobal: any;
  ArrayVerMas: any[];
  contadorMedios: number = 0;
  sede: any;
  idSolicitud: number = 0;
  ArrayDetallePaciente: any;
  TotalQuantity: number;
  arrMediosPago = new Array<any>();
  arrTotales = new Array<any>();
  arrCantidades = new Array<any>();
  arrExamenes = new Array<any>();
  arrChequeos = new Array<any>();
  IdSede: any;
  selectedIdTercero: any;
  TerceroRegistrado = false;
  bandera_crea: number;
  idgrupo: number;
  Completado: boolean;
  Embarazo: any;
  ArrayDiscapacidad: any[];
  politicaAceptada = false;
  NumPacientes: number = 2;
  btnVincular: boolean = false;
  ArrayResponsablePago = new Array<any>();
  NumeroSolicitud: any;
  VerAlerta: boolean;
  NotificacionError: any;
  idTransaccion: any;
  subtotalTemp = 0;
  liberador: boolean;
  arrTotalesTemp = new Array<any>();
  arrMediosPagoTemp = new Array<any>();
  disabledConfirmacion: boolean = false;
  BandResponsable = 0;
  bandera_acudiente: number = 0;
  subMenuUser: any;
  validaCampos: boolean;
  arrayExamnesSelecccionados = new Array<any>();
  arrayIdExamenGlobal = new Array<any>();
  datoasArray: { IdExamen: any; IdAsociacion: any; };
  examenesTotales: number = 0;
  longitudValidar: boolean = false;
  textoValidacion: string;

  constructor(private ServiceVentas: VentasService, private ServiceGrupo: GrupoFamiliarservice,
    private ServiceGenerico: GenericoService, private formbuilder: FormBuilder,
    private ServicePaciente: ClientesService, private formbuilderAcu: FormBuilder, private router: Router,
    private _servicePaternidad: PaternidadService, private ValidarPermisos: ValidarPermisos, private ServicioPuente: ServicioDetrasladoService) { }
  ngOnInit(): void {
    $('#numPacientes').val('2');
    this.CargarInfoGeneral();
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'));
    this.sede = JSON.parse(sessionStorage.getItem('Sede'));
    this.IdSede = this.sede[0].id;

    this.formPacientes = this.formbuilder.group({
      id: [''],
      documento: ['', [Validators.required]],
      tipodocumento: ['0'], fechanacimiento: ['', [Validators.required]],
      primerNombre: ['', [Validators.required]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''], PoliticaDatos: [''], correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      celular: [''], direccion: ['', [Validators.required]],
      Idciudad: ['0', [Validators.required]],
      Idbarrio: ['0'], Idestadocivil: ['0', [Validators.required]],
      Idestrato: ['0', [Validators.required]],
      IdEstadoCivil: ['0'], IdTipAfil: ['0', [Validators.required]],
      NombreBarrio: [''], Idsexo: ['0', [Validators.required]],
      IdDepto: ['0', [Validators.required]],
      IdLocalidad: ['0'], Pais: ['161'], IdEps: ['0'], edad: [''],
      AbreviaturaTipodoc: [''],
      IdDiscapacidad: ['0'], IdEmbarazo: ['0'],
      bandera_origen: ['GF'],
      IdSolicitud: ['0'],
      IdUsuario: this.IdUsuario,
    });

    this.formCrearAcudiente = this.formbuilderAcu.group({
      id: [''],
      tipodocumento: [''],
      documento: [''],
      fechanacimiento: [''],
      primerNombre: ['', [Validators.required]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''],
      PoliticaDatos: [''],
      correo: ['', [Validators.required]],
      telefono: [''],
      celular: [''],
      direccion: [''],
      Idciudad: [''],
      Idbarrio: [''],
      Idestadocivil: [''],
      Idestrato: [''],
      IdEstadoCivil: [''],
      IdTipAfil: [''],
      NombreBarrio: [''],
      Idsexo: [''],
      IdDepto: [''],
      IdLocalidad: [''],
      Pais: ['161'],
      IdEps: [''],
      edad: [''],
      IdUsuario: this.IdUsuario,
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta, permisos) {
    this.ValidarPermisos.validarPermisos(ruta, permisos);
  }

  //Realiza el cargue de toda la información necesaria para iniciar grupo familiar.
  async CargarInfoGeneral() {
    this.ArrayDiscapacidad = await this.ServicePaciente.ConsultarDispacidades();
    this.DataPlanes = await this.ServiceVentas.ConsultarPlanes();
    await this.ServiceGrupo.EliminarProcedimientosGrupo(0, 2, this.IdUsuario);
    this.mediosPago = await this.ServiceVentas.ConsultarMediosPago();
    this.GesDocument = await this.ServiceGenerico.ConsultarTipoDoc();
    this.ArrayEstadoCivil = await this.ServiceGenerico.ConsultarestadoCivil();
    this.ArrayTipAfiliacion = await this.ServiceGenerico.ConsultarTipoAfilicacion();
    this.ArrayGenero = await this.ServiceGenerico.ConsultarGenero();
    this.ArrayPais = await this.ServiceGenerico.ConsultarPaises();
    this.ArrayDepart = await this.ServiceGenerico.ConsultarDepartamento();
    this.ArrayEstr = await this.ServiceGenerico.Consultarestratos();
    this.ArrayEps = await this.ServiceGenerico.ConsultarEps();
  }

  //Obtiene la cantidad de pacientes que se van a registrar durante la venta.
  getNumPacientes() {
    this.NumPacientes = Number($('#numPacientes').val());
    if (this.NumPacientes < 2) {
      $('#numPacientes').val('2');
      this.NumPacientes = 2;
    }
  }

  //Pre-seleccion del plan.
  PreselectPlan(entidad) {
    this.idplan = entidad.Id;
  }

  //Selección del plan.
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
        $("#botonUsar").hide();
        $("#botonCambiar").show();
        this.disabled = true;
        this.VerRadioOpciones = true;
        $("#selopciones").val("2");
        this.cargarInformacion("2");
        this.VerExamen = false;
        this.Verchequeo = false;
      } else {
        if (this.contador > 0) {
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

  //Controles de visualización de exámenes o chequeos al seleccionar los exámenes.
  VerModalOption(bandera: any) {
    if (bandera === "1") {
      this.Verchequeo = true;
      this.VerExamen = false;
    } else if (bandera === "2") {
      this.Verchequeo = false;
      this.VerExamen = true;
    } else {
      this.Verchequeo = false;
      this.VerExamen = false;
    }
  }

  //Recupera la información de todos los procedimientos dependiendo del plan seleccionado.
  async cargarInformacion(bandera) {
    this.ServiceVentas.ConsultarProcedimientosPlan(bandera, this.idplan).then((data) => {
      if (bandera === "1") {
        this.DataProcedimientos = data;
      } else if (bandera === "2") {
        this.ArrayExamenes = data
      }
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

  //Selección de un chequeo en particular.
  SelectChequeo(CodChequeo, bandera) {
    this.Chequeo = CodChequeo;
    this.banderaChe = bandera;
    this.AgregarChequeo();
  }

  //Añade el chequeo seleccionado a la lista de procedimientos escogidos.
  async AgregarChequeo() {
    const DatosProcedimiento = {
      codProcedimiento: this.Chequeo.idProcedimiento,
      bandera: this.banderaChe,
      IdTarifa: this.Tarifa,
      IdUsuario: this.IdUsuario
    }
    await this.ServiceGrupo.CrearProcedimientosGrupo(DatosProcedimiento).then(response => {
      //alert("chequeo")
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
      if (response.toString().split(',')[1] == "0") {
        this.contador = this.contador + 1;
        this.LimpiarAutoComplete();
        this.ListarProcedimientos(0);
        this.TablaProcedimientos = true;
        this.GuardarTemProcedimientos(this.Chequeo.idProcedimiento, true, this.banderaChe);
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

  //Limpieza de campos de chequeo.
  LimpiarChequeos() {
    $("#SelCat").val("");
    $("#SelChe").val("");
    $("#radioCheq").prop("checked", false);
  }

  //Recupera todos los procedimientos seleccionados y los carga en un Array fijo (Opc !=1) o en uno que se modificará
  //durante la asignación de los procedimientos (Opc ==1).
  async ListarProcedimientos(bandera: any) {
    if (bandera != 1) {
      await this.ServiceGrupo.ListarProcedimientosGrupo(this.IdUsuario, this.idplan, this.idSolicitud).then((data) => {
        var total = 0;
        var cantidad = 0;
        for (const info of data) {
          var valorcalculado = info.Total_Cantidad;
          total += Number(valorcalculado);
          var Cant = info.Cantidad
          cantidad += Number(Cant);
        }
        this.TotalFinal = total;
        this.quantity = cantidad;
        this.ArrayProcedimientos = data;
        // this.ArrayTemp = data;
        // sessionStorage.setItem('ArrayProcedimientos', JSON.stringify(this.ArrayProcedimientos));
      }).catch(err => {
        if (err.status === 400 || err.status === 500) {
          Swal.fire({
            text: err.error.Message,
            icon: 'error'
          });
          return;
        }
      });
    } else {
      await this.ServiceGrupo.ListarProcedimientosGrupo(this.IdUsuario, this.idplan, this.idSolicitud).then((data) => {
        var total2 = 0;
        var cantidad2 = 0;
        for (const info of data) {
          var valorcalculado = info.Total_Cantidad;
          total2 += Number(valorcalculado);
          var Cant = info.Cantidad
          cantidad2 += Number(Cant);
        }
        this.quantity = cantidad2;
        this.ArrayTemp = data;
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

  //Selección de un exámen en particular.
  SelectExam(AutoExamen, bandera) {
    this.Examen = AutoExamen;
    this.banderaExam = bandera;
    this.AgregarExamen();
  }

  //Añade el examen seleccionado a la lista de procedimientos escogidos.
  async AgregarExamen() {
    const DatosProcedimiento = {
      codProcedimiento: this.Examen.idProcedimiento,
      bandera: this.banderaExam,
      IdTarifa: this.Tarifa,
      IdUsuario: this.IdUsuario
    }
    await this.ServiceGrupo.CrearProcedimientosGrupo(DatosProcedimiento).then(response => {
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
        this.contador = this.contador + 1;
        this.LimpiarAutoComplete();
        this.ListarProcedimientos(0);
        this.TablaProcedimientos = true;
        this.GuardarTemProcedimientos(this.Examen.idProcedimiento, true, this.banderaExam)
      }
    }).catch(err => {
      if (err.status === 400 || err.status === 500) {
        Swal.fire({
          title: err.error.Message,
          text: err.error.ExceptionMessage,
          icon: 'error'
        });
        return;
      }
    });
  }

  //Categoriza los procedimientos en chequeo o examen y llena arreglos que siren de parámetro para la venta final.
  GuardarTemProcedimientos(id: string, ischecked: boolean, bandera: number) {
    if (bandera == 1) {
      if (ischecked) {
        this.arrChequeos.push(id);
      }
    } else {
      if (ischecked) {
        this.arrExamenes.push(id);
      }
    }
  }

  //Limpieza de los campos autocomplete.
  LimpiarAutoComplete() {
    this.auto.clear();
    this.auto.close();
  }

  //Elimina un procedimiento seleccionado.
  async EliminarProcedimientos(id, bandera) {
    await this.ServiceGrupo.EliminarProcedimientosGrupo(id, bandera, this.IdUsuario).then(response => {
      if (bandera == 1) {
        this.contador = this.contador - 1;
        if (this.contador == 0) {
          this.TablaProcedimientos = false;
        }
        this.ListarProcedimientos(0);
      }
    })
  }

  //Limpieza de formulario de selección de plan.
  LimpiarFormulario() {
    this.TablaProcedimientos = false;
    this.EliminarProcedimientos(0, 2);
    $("#botonUsar").show();
    $("#botonCambiar").hide();
    this.contador = 0;
    this.autoPlan.clear();
    this.VerRadioOpciones = false;
    this.TablaProcedimientos = false;
    this.SeleccionarPlan(2);
  }

  //Calcula el valor del procedimiento seleccionado teniendo en cuenta la cantidad de procedimientos.
  async CalcularValorCantidad(idProcedimiento) {
    debugger
    // if (this.quantity > this.NumPacientes) {
      
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Opps...',
    //     text: 'El número de exámenes debe ser igual a la cantidad de pacientes.',
    //     showConfirmButton: true
    //   });
    // } else {
      let suma = 0;
      //let sumaFinal = 0;
      //let total = 0;
      let quantity = 0;
      let precio_compra = 0;
      let suma_row = 0;
  
      quantity = Number($(".txtCantidad" + idProcedimiento).val());
      (quantity <= 0) ? quantity = 1 : this.quantity = 0;
      this.quantity = 0;
      this.quantity = (quantity + this.quantity);
      precio_compra = Number($(".precio_venta" + idProcedimiento).text().replace(/\,/g, "").replace("$", ""));
      suma_row = quantity * precio_compra
      suma += suma_row
      $("#txtTotal" + idProcedimiento).val(suma_row);
      await this.ServiceGrupo.ActualizarCantidadProcedimientosGrupo(idProcedimiento, quantity, suma_row).then(response => {
        this.ListarProcedimientos(0);
      });
    // }
      
  }

  //Controles de navegación y validaciones asociadas al botón "Siguiente" principal.
  siguiente(bandera) {
    debugger
    $('.tab-pane').hide();
    if (bandera == 2) {
      if (this.ValidarListar() === true) {
        if (this.NumPacientes > 1) {
          if (this.quantity >= this.NumPacientes) {
            var activetab = $('#tabAsociar').attr('href');
            $(activetab).show();
            $('#LiAsociar').addClass('active');
            $('#LiPlan').removeClass('active');
            this.ArrayTemp = this.ArrayProcedimientos;
            this.TotalQuantity = this.quantity;
            this.ControlCantidades(1);
            this.CrearSolicitud();
          } else {
            var activetab = $('#tabPlan').attr('href');
            $(activetab).show();
            $('#LiAsociar').removeClass('active');
            $('#LiPlan').addClass('active');
            Swal.fire({
              icon: 'warning',
              title: 'Opps...',
              text: 'El número de exámenes debe ser igual a la cantidad de pacientes.',
              showConfirmButton: true
            });
          }
        } else {
          var activetab = $('#tabPlan').attr('href');
          $(activetab).show();
          $('#LiAsociar').removeClass('active');
          $('#LiPlan').addClass('active');
          Swal.fire({
            icon: 'warning',
            title: 'Opps...',
            text: 'Debe añadir mínimo 2 pacientes.',
            showConfirmButton: true
          });
        }
      } else {
        var activetab = $('#tabPlan').attr('href');
        $(activetab).show();
        $('#LiAsociar').removeClass('active');
        $('#LiPlan').addClass('active');
        Swal.fire({
          icon: 'warning',
          title: 'Opps...',
          text: 'Debe agregar al menos un procedimiento',
          showConfirmButton: true
        });
      }
    }
    else if (bandera == 3) {
      if (this.ValidarListar() != true) {
        var activetab = $('#tabAsociar').attr('href');
        $(activetab).show();
        $('#LiAsociar').addClass('active');
        $('#LiPago').removeClass('active');
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Debe agregar al menos un procedimiento',
          showConfirmButton: true
        });
      }
      else {
        if (this.Completado == true) {
          var activetab = $('#tabPago').attr('href');
          $(activetab).show();
          $('#LiPago').addClass('active');
          $('#LiAsociar').removeClass('active');
        } else {
          var activetab = $('#tabAsociar').attr('href');
          $(activetab).show();
          $('#LiAsociar').addClass('active');
          $('#LiPago').removeClass('active');
          Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: 'Faltan exámenes por asociar.',
            showConfirmButton: true
          });
        }
      }
    }
    else {
      if (this.IdValidador === 1) {
        if (this.MedioPago.length === 0) {
          var activetab = $('#tabPago').attr('href');
          $(activetab).show();
          $('#LiPago').addClass('active');
          $('#LiAsociar').removeClass('active');
          Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: 'Debe seleccionar medio de pago',
            showConfirmButton: true
          });
        } else if (this.TotalCalculo < this.TotalFinal) {
          var activetab = $('#tabPago').attr('href');
          $(activetab).show();
          $('#LiPago').addClass('active');
          $('#LiAsociar').removeClass('active');
          Swal.fire({
            icon: 'error',
            text: 'Los valores de pago que selecciono no coinciden con el valor total a pagar.' +
              'Por favor revise nuevamente.',
            showConfirmButton: true
          });
        } else {
          var activetab = $('#tabResumen').attr('href');
          $(activetab).show();
          $('#LiResumen').addClass('active');
          $('#LiPago').removeClass('active');
        }
      } else {
        if (this.IdMedioPago == true) {
          this.validarTercero();
          if (this.TerceroRegistrado == true) {
            var activetab = $('#tabResumen').attr('href');
            $(activetab).show();
            $('#LiResumen').addClass('active');
            $('#LiPago').removeClass('active');
          } else {
            var activetab = $('#tabPago').attr('href');
            $(activetab).show();
            $('#LiPago').addClass('active');
            $('#LiAsociar').removeClass('active');
            $('#tipoDocOtro').val('0');
            Swal.fire({
              icon: 'error',
              title: 'Opps...',
              text: 'Debe seleccionar al responsable del pago.',
              showConfirmButton: true
            });
          }
        } else {
          var activetab = $('#tabPago').attr('href');
          $(activetab).show();
          $('#LiPago').addClass('active');
          $('#LiAsociar').removeClass('active');
          Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: 'Debe seleccionar medio de pago',
            showConfirmButton: true
          });
        }
      }
    }
  }
  //Toma las cantidades de cada examen seleccionado y las añade a un arreglo como parámetro de la venta final.
  ControlCantidades(bandera: any) {
    if (bandera == 1) {
      this.ArrayProcedimientos.forEach(proc => {
        this.arrCantidades.push(proc.Cantidad);
      })
    } else {
      this.arrCantidades.length = 0;
    }
  }
  //Controles y validaciones del "Atrás" principal.
  atras(bandera) {
    debugger
    $('.tab-pane').hide();
    if (bandera == 1) {
      var activetab = $('#tabPlan').attr('href');
      $(activetab).show();
      $('#LiPlan').addClass('active');
      $('#LiAsociar').removeClass('active');
      this.ControlCantidades(2);
    } else if (bandera == 2) {
      var activetab = $('#tabAsociar').attr('href');
      $(activetab).show();
      $('#LiAsociar').addClass('active');
      $('#LiPago').removeClass('active');
    } else {
      var activetab = $('#tabPago').attr('href');
      $(activetab).show();
      $('#LiPago').addClass('active');
      $('#LiResumen').removeClass('active');
    }
  }

  //Crea una solicitud donde se relaciona el grupo familiar y los procedimientos a asociar.
  async CrearSolicitud() {
    await this.ServiceGrupo.crearSolicitud(this.IdUsuario).then(resp => {
      this.idSolicitud = resp.toString().split(',')[0];
      this.NumeroSolicitud = resp.toString().split(',')[1];
    });
  }

  /*Escaneo de documentos*/
  EscanearDocumento() {
    //let trama = ["1018480249", "MENDOZA", "VARGAS", "KEIDER", "RAFAEL", "M", "19951027", "A+", "35904463", "1445"];
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
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let trama = $("#txtTrama").val();
        $('#txtdocumento').val(trama.toString().split(',')[0]);
        $('#SelTipDoc').val(1);
        this.ParseoTrama(trama);
      }
    });
  }

  /*Parseo de la trama del documento escaneado.*/
  async ParseoTrama(trama) {
    let sexo;
    let fecha = moment(trama.toString().toUpperCase().split(',')[6]).locale('es-CO').format('YYYY-MM-DD');
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

  //Validación de lista.
  ValidarListar() {
    var validador = false;
    if (this.contador > 0) {
      validador = true;
    }
    return validador;
  }

  //Muestra el modal que contiene el proceso de asignación de pacientes con procedimientos seleccionados.
  AsociarPacientes() {
    this.contPacientes++;
    this.pacientenuevo = false;
    this.Pacienteexistente = false;
    this.resumenPaciente = false;
    this.formularioPacientes = false;
    (<any>$('#DivPacientes')).modal('show');
    this.Next_Tab2(1);
  }

  //Control y validaciones para la selección entre uno o múltiples medios de pago.
  BindingInput(bandera) {
    if (bandera === 1) {
      this.LimpiarArrays();
      this.IdValidador = bandera
      this.mediosPago.forEach(element => {
        $('#opciones' + element.id).removeClass('custom-radio').addClass('custom-checkbox');
        $('#TxtValor' + element.id).val('').removeClass('input-control').addClass('formPacientes-control').prop('disabled', true);
        $('#customRadioInline' + element.id).attr('type', 'checkbox').prop('checked', false).prop('disabled', false);
        this.disabledText = false;
        this.divPago = true;
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
        this.disabledText = false;
        this.divPago = false;
      });
    }
  }
  //Limpia los arrays de los parámetros que se requieren para la venta final.
  LimpiarArrays() {
    this.MedioPago.length = 0;
    this.arrMediosPago.length = 0;
    this.arrTotales.length = 0;
  }

  //Almacena el medio de pago seleccionado y el valor.
  SelectMedioPago(Id, descripcion) {
    this.IdMedioPago = (Id) ? true : false;
    if (this.IdValidador != 1) {
      $('#radioNo').prop('checked', true);
      this.MedioPago[0] = { id: Id, descripcion: descripcion };
      this.arrMediosPago[0] = Id;
      this.arrTotales[0] = this.TotalFinal;
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
  //Calcula y almacena el medio de pago y el valor cuando son múltples medios de pago.
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
    })
    if (this.TotalCalculo === this.TotalFinal) {
      (<any>$('#ConfirmarPagos')).modal('show');
    }
  }
  //Inactiva el cambio de medios de pago si son aceptados los medios elegidos.
  confirmarMedioPago(bandera: any) {
    if (bandera == 1) {
      this.arrTotales.length = 0;
      this.arrTotalesTemp.length = 0;
      this.arrMediosPago.length = 0;
      this.arrMediosPagoTemp.length = 0;
      this.mediosPago.forEach(element => {
        $('#TxtValor' + element.id).prop('disabled', true);
        $('#customRadioInline' + element.id).prop('disabled', true);
        let valor = Number($("#TxtValor" + element.id).val());
        this.arrTotalesTemp.push(valor);
        if (($('#customRadioInline' + element.id).prop('checked') == true)) {
          this.arrMediosPagoTemp.push(element.id);
          this.MedioPago.push({ id: element.id, descripcion: element.medioPago });
        } else {
          this.arrMediosPagoTemp.push(0);
        }
      });
      this.arrTotales = this.arrTotalesTemp.filter((x) => x != 0);
      this.arrMediosPago = this.arrMediosPagoTemp.filter((x) => x != 0);
      $('#radioSi').prop('disabled', true);
      $('#radioNo').prop('disabled', true);
    } else {
      this.BindingInput(1);
    }
  }

  //Controles y validaciónes boton "Siguiente" de la asociación de pacientes con procedimientos.
  Next_Tab2(bandera) {
    $('.tab-pane2').hide();
    if (bandera == 1) {
      var activetab = $('#tabRegistroPaciente').attr('href');
      $(activetab).show();
      $('#LiPaciente').addClass('active');
      $('#LiExamen').removeClass('active');
    }
    else if (bandera == 2) {
      var activetab2 = $('#tabExamenPaciente').attr('href');
      $(activetab2).show()
      $('#LiExamen').addClass('active');
      $('#LiPaciente').removeClass('active');
      // this.CrearGrupoFamiliar();
    } else {
      this.contPacientes--;
      this.formPacientes.reset();
      this.formPacientes.controls.tipodocumento.setValue('0');
      (<any>$('#DivPacientes')).modal('hide');
    }
  }

  //Controles para el botón "Siguiente" del formulario de pacientes.
  Next_FormPaciente(bandera) {
    this.textoValidacion = '';
    $('.tab-pane3').hide();
    if (bandera == 2) {
      var activetab2 = $('#tab2').attr('href');
      $(activetab2).show()
      $('#Li2').addClass('active');
      $('#Li1').removeClass('active');
    }
    else if (bandera == 3) {
      var activetab3 = $('#tab3').attr('href');
      $(activetab3).show()
      $('#Li3').addClass('active');
      $('#Li2').removeClass('active');
    } else {
      this.Next_Tab2(2);
    }
  }

  //Controles para el botón "Atrás" del formulario de pacientes.
  Previous_FormPaciente(bandera) {
    this.textoValidacion = '';
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
    } else {
      this.resumenPaciente = true;
      this.formularioPacientes = false;
    }
  }

  //Valida que el email tenga la estructura válida.
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

  //Valida las ciudades dependiendo de la elección realizada.
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

  //listado de las ciudades.
  async listarCiudades(Idciudad: number) {
    await this.ServiceGenerico.ConsultarCiudades(Idciudad).then((data) => {
      this.ArrayCity = data;
    });
  }
  //listado de las localidades.
  async listarLocalidades(IdCiudad: any) {
    await this.ServiceGenerico.Consultarlocalidad(IdCiudad).then((resp) => {
      this.Arraylocalidad = resp;
    });
  }

  //listado de los barrios.
  async ListarBarrios(IdLocalidad: any) {
    await this.ServiceGenerico.ConsultarBarrios(IdLocalidad).then((resp) => {
      this.ArrayBarrio = resp;
    });
  }

  //Asignación de política de datos.
  AsigPolitica(valor, seleccion, bandera) {
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
    else if (bandera == 2) {
      if ((valor == 'on')) {
        this.formCrearAcudiente.value.PoliticaDatos = 1;
      }
    }
  }

  //Obtiene los controles de los validadores para el formulario de pacientes.
  get f() {
    return this.formPacientes.controls;
  }

  //Alerta de campos obligatorios.
  camposObligatorios() {
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: 'Ingrese los datos para continuar',
    });
  }



  //Habilta el formulario de pacientes.
  mostrarformulario(bandera) {
    (<any>$('#DivPacientes')).modal('show');
    this.resumenPaciente = false;
    this.formularioPacientes = true;
    this.BtnVerAcudiente = false;
    if (bandera == 1) {
      var tipoDocTemp = this.formPacientes.get('tipodocumento').value;
      var documentoTemp = this.formPacientes.get('documento').value;
      this.LimpiarFormPacientes();
      this.formPacientes.patchValue({ tipodocumento: tipoDocTemp, documento: documentoTemp });
    } else {
      this.formPacientes.controls['edad'].setValue(this.showAge);
    }
  }

  //Consulta de un paciente por medio de su tipo y número de documento.
  async consultar(): Promise<void> {
    this.pacientenuevo = false;
    this.Pacienteexistente = false;
    this.resumenPaciente = false;
    this.formularioPacientes = false;
    var documento = $('#txtdocumento').val();
    var tipodocumento = $('#SelTipDoc').val();
    if (documento == '' || tipodocumento == '') {
      return this.camposObligatorios();
    } else {
      await this.ServicePaciente.DetallPaciente(documento, tipodocumento).then(response => {
        if (response.length > 0) {
          if(this.ArrayPacientesGrupo != undefined){
            const arrayvalidacion=this.ArrayPacientesGrupo.filter(pg=> pg.Idpaciente==response[0].id)
            if(arrayvalidacion.length > 0){
              this.pacienteDoble()
              this.resumenPaciente = false;
            }else{
              this.Pacienteexistente = true;
              this.pacientenuevo = false;
              this.resumenPaciente = true;
              this.CargarDatosPaciente(response);
            }
          }else{
            this.Pacienteexistente = true;
            this.pacientenuevo = false;
            this.resumenPaciente = true;
            this.CargarDatosPaciente(response);
          }

        } else {
          // this.CargarDatosPaciente(response);
          (<any>$('#NoexistPaciente')).modal('show');
          (<any>$('#DivPacientes')).modal('hide');
          this.Pacienteexistente = false;
          this.pacientenuevo = true;
          this.botonCerrar = false;
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
  }

  //Llena el formulario de pacientes con la información de un paciente si existe de anterioridad.
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
        IdEmbarazo: datos.embarazo,
        IdDiscapacidad: datos.discapacidad,
        activo: datos.activo,
      });

      const fechaActual = new Date();
      const convertAge = new Date(datos.fechanacimiento);
      let years = fechaActual.getUTCFullYear() - convertAge.getUTCFullYear();
      if (years < 14) {
        this.formPacientes.controls['correo'].disable();
        this.formPacientes.get('correo').clearValidators();
        this.formPacientes.get('correo').updateValueAndValidity();
      } else {
        this.formPacientes.controls['correo'].enable();
      }
      this.PacienteExt = datosPaciente;
      this.IdPacNew = datos.id;
      this.CalcularEdad(datos.fechanacimiento, 1);
      sessionStorage.setItem('Idpaciente', JSON.stringify(datos.id));
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
    this.ControlEmbarazo(datosPaciente[0].Idsexo);
  }

  //listado de las ciudades.
  async cargarCiudades(IdDept: number, ciudad: number, Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.ConsultarCiudades(IdDept).then((data) => {
      this.ArrayCity = data;
      this.CargarLocalidades(ciudad, Idlocalidad, fecha);
    });
  }
  //listado de las localidades por ciudad.
  async CargarLocalidades(ciudad: number, Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.Consultarlocalidad(ciudad).then((data) => {
      this.Arraylocalidad = data;
      this.CargarBarrios(Idlocalidad, fecha);
    });
  }
  //listado de lsos barrios.
  async CargarBarrios(Idlocalidad: number, fecha: any) {
    await this.ServiceGenerico.ConsultarBarrios(Idlocalidad).then((data) => {
      this.ArrayBarrio = data;
    });
  }

  //calcula la edad usando la fecha de nacimiento.
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

  //Valida mayoría de edad.
  validar(edad: any) {
    const tipodocumento = $('#SelTipDoc').val();
    if (tipodocumento == '8' && edad < 14 || tipodocumento == '7') {
      // $("#txtcorreo").prop("disabled", true);
      this.formPacientes.controls['correo'].disable();
    } else {
      // $("#txtcorreo").prop("disabled", false);
      this.menordeedad = false;
      this.formPacientes.controls['correo'].enable();
    }
  }


  //Manejo del campo de embarazo en el formulario de pacientes.
  ControlEmbarazo(valor) {
    this.Embarazo = (valor == 2) ? true : false;
  }

  //Crea un nuevo paciente.
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
      } else if (this.politicaAceptada == false) {
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Debes aceptar la política de tratamiento de datos para continuar.'
        });
      } else {
        Swal.fire({
          title: 'Estamos procesando tú solicitud.',
          icon: 'warning',
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
        });
        this.ServicePaciente.CrearPaciente(this.formPacientes.value).then((resp) => {
          this.IdPacNew = resp.toString().split(',')[1];
          sessionStorage.setItem('Idpaciente', JSON.stringify(this.IdPacNew));
          if (this.formPacientes.value.tipodocumento == 8 || this.formPacientes.value.tipodocumento == 7) {
            this.alerta();
          }
          this.ParseoDataPaciente();
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
          this.politicaAceptada = false;
          $('#btnGuardar').hide();
          $('#btnSiguienteFin').show();
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

  //Alerta de falta de acudiente si el paciente es menor de edad.
  alerta() {
    this.showModalAlert = true;
    (<any>$('#DivPacientes')).modal('hide');
    (<any>$('#NoexistAcudiente')).modal('show');
  }

  //Parseo de los datos del paciente.
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

  ValidarCampos() {
    this.validaCampos = false
    if (this.formPacientes.value.correo == '' || this.formPacientes.value.documento == '' || this.formPacientes.value.tipodocumento == '0'
      || this.formPacientes.value.fechanacimiento == '' || this.formPacientes.value.primerNombre == '' || this.formPacientes.value.primerApellido == ''
      || this.formPacientes.value.telefono == '' || this.formPacientes.value.direccion == '' || this.formPacientes.value.Idciudad == '0'
      || this.formPacientes.value.Idestadocivil == '0' || this.formPacientes.value.Idestrato == '0' || this.formPacientes.value.IdTipAfil == ''
      || this.formPacientes.value.Idsexo == '0' || this.formPacientes.value.IdDepto == '0') {
      this.validaCampos = true;
    }
    return this.validaCampos;
  }

  //Actualiza datos del paciente.
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
          this.IdPacNew = resp.toString().split(',')[1];
          sessionStorage.setItem('Idpaciente', JSON.stringify(this.IdPacNew));
          $('#btnVentaAct').show();
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
        }).catch(err => {
          if (err.status === 400 || err.status === 500) {
            Swal.fire({
              text: err.error.Message,
              icon: 'error'
            });
            return;
          }
        });
      this.consultar();
    }
  }

  //Obtener los controles para el formulario de acudiente.
  get Acu() {
    return this.formCrearAcudiente.controls;
  }

  //Guardar acudiente.
  async GuardarAcudiente() {
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
      this.ventanaCarga();
      await this.ServicePaciente.CrearPaciente(this.formCrearAcudiente.value).then(
        (resp) => {
          Swal.close();
          var IdAcudienteNew = resp.toString().split(',')[1];
          this.IdAcudiente = Number(IdAcudienteNew);
          Swal.fire({
            icon: 'success',
            title: resp.toString().split(',')[0],
            showConfirmButton: true
          }).then(async result => {
            if (result.isConfirmed) {
              if (this.bandera_crea_edita_acu == 1) {
                (<any>$('#ActualizarPaciente')).modal('hide');
                (<any>$('#acudiente')).modal('show');
                this.vizualizaraAcudiente = await this.ServicePaciente.ConsultarAcudiente(this.IdAcudiente);
              }
            }
          });
          this.submit = false;
          // this.btnVincular = true;
          $("#btnVincular").show();
          $("#btnGuardarAc").hide();
          this.paciente = true
          this.Acudiente = false
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

  //Visualiza el acudiente.
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

  //Actualiza datos de un acudiente.
  ActualizarAcu(Acudiente: pacientes, cerrarmodal: any) {
    (<any>$('#acudiente')).modal('hide');
    sessionStorage.setItem('Veracudiente', cerrarmodal);
    this.formCrearAcudiente.patchValue({
      IdUsuario: this.IdUsuario,
      id: Acudiente.id,
      tipodocumento: Acudiente.tipodocumento,
      documento: Acudiente.documento,
      primerNombre: Acudiente.primerNombre ,
      segundoNombre: Acudiente.segundoNombre,
      primerApellido: Acudiente.primerApellido ,
      correo: Acudiente.correo,
      segundoApellido: Acudiente.segundoApellido,
      fechanacimiento: Acudiente.fechanacimiento,
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
    this.bandera_crea_edita_acu = 1;
  }

  //Controles de navegación para regresar entre los modales del acudiente.
  atrasAcudiente(bandera: any) {
    if (bandera == 1) {
      (<any>$('#acudiente')).modal('hide');
      (<any>$('#DivPacientes')).modal('show');
    }
    else {
      (<any>$('#ActualizarPaciente')).modal('hide');
      (<any>$('#acudiente')).modal('show');
    }
  }

  //Muestra los datos del acudiente.
  async verAcudi() {
    var Idacudiente = this.IdAcudiente;
    if (Number(Idacudiente) > 0) {
      await this.ServicePaciente.ConsultarAcudiente(Idacudiente).then((data) => {
        this.vizualizaraAcudiente = data;
        sessionStorage.setItem('DatosAcu', JSON.stringify(data));
        for (const datos of data) {
          this.CalcularEdad(datos.fechanacimiento, 2);
        }
      });
      (<any>$('#acudiente')).modal('show');
      (<any>$('#DivPacientes')).modal('hide');

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Este paciente no cuenta con un acudiente',
      });
      this.alerta()
    }
  }

  // se consulta el div de crear acudiente
  DivCrearAcudiente() {
    this.formularioAcudiente = true;
    // labels del h1
    this.paciente = false;
    this.Acudiente = true;
    // botones del formulario
    this.menordeedad = false;
    this.Pacienteexistente = false;
    this.pacientenuevo = true;
  }

  ValidarCerrarAcudiente() {
    if (this.validarVinculacion == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No es posible continuar sin un acudiente vinculado',
        showConfirmButton: true
      });
    }
  }

  //Realiza la vinculación de un acudiente.
  async VincularAcudiente() {
    this.ventanaCarga();
    await this.ServicePaciente.AsociarAcudiente(this.IdPacNew, this.IdAcudiente, this.IdUsuario).then((resp) => {
      Swal.close();
      this.validarVinculacion = 1;
      Swal.fire({
        icon: 'success',
        title: resp.toString(),
        showConfirmButton: true
      }).then(result => {
        if (result.isConfirmed) {
          this.validarVinculacion = 0;
          this.ContinuarProceso();
        }
      })
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

    this.ContinuarProceso();
  }

  //Continuación del proceso normal una vez añadido el acudiente.
  ContinuarProceso() {
    (<any>$('#Visualizarpaciente')).modal('hide');
    (<any>$('#ActualizarPaciente')).modal('hide');
    this.formCrearAcudiente.reset();
    (<any>$('#DivPacientes')).modal('show');
    this.btnVincular = false;
    this.formularioPacientes = false;
    this.Next_Tab2(2);
  }

  // se consulta el div de vincular acudiente
  DivVincularAcudiente() {
    (<any>$('#Visualizarpaciente')).modal('show');
    this.paciente = true
    this.ContainerVisualizarAcudiente = true;
    this.ContainerVisualizar = false;
    this.CrearAcudiente = false;
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

  //Se desvincula un acudiente del paciente.
  ConfirmarDesv() {
    var result = '';
    this.vizualizaraAcudiente = JSON.parse(sessionStorage.getItem('DatosAcu'));
    for (const datos of this.vizualizaraAcudiente) {
      result = datos.primerNombre + ' ' + datos.primerApellido;
    }
    document.getElementById('lblAcudiente').innerHTML = result;
    (<any>$('#AlertDesvinculacion')).modal('show');
  }

  //Almacena cambios de la desvinculación.
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
    (<any>$('#DivPacientes')).modal('show');
  }

  //Obttiene la información de un paciente en particular.
  async obtenerInfoPaciente(IdPaciente, Fecha_Nacimiento) {
    this.ArrayDetallePaciente = this.ArrayPacientesGrupo.filter(p => p.Idpaciente == IdPaciente);
    this.CalcularEdad(Fecha_Nacimiento, 1);
    this.consultarExamenesAsociados2(this.IdUsuario, IdPaciente);
  }

  //Obtiene el indice del exámen a asignar.
  getSelectedIndexExam(event: any) {
    debugger
    this.selectedIdExam = event.target.value;
    let arraySelectExam = this.arrayExamnesSelecccionados.filter(x => x == event.target.value);
    if(arraySelectExam.length > 0){
      this.examenDoble();
    }else{
      this.arrayExamnesSelecccionados.push(event.target.value);
      this.examenesTotales++;
      this.asociarExamenes();
    }
  }

  //Asocia un examen a un paciente.
  async asociarExamenes() {
    debugger
    console.log(this.selectedIdExam);
    console.log(this.contadorExamenes);
    if (this.selectedIdExam != null) {
      this.contadorExamenes++;
      if (this.contadorExamenes > 0) {
        this.TablaExamenes = true;
      }
      await this.ServiceGrupo.AsociarExamenes(this.selectedIdExam, 0, 1, this.IdUsuario, 0).then(
        resp => {
          this.idExamenGlobal = resp.split(",")[1];
          this.arrayIdExamenGlobal.push(this.idExamenGlobal)
          this.consultarExamenesAsociados();
          $('#exCargados').val('0');
          this.contador2++;
          this.datoasArray = {
            IdExamen: this.arrayExamnesSelecccionados,
            IdAsociacion: this.arrayIdExamenGlobal
          }
        });
    } else {
      Swal.fire({
        text: "Debe seleccionar un examen para continuar.",
        icon: 'warning',
        showConfirmButton: true
      });
    }
  }

  //Se consultan los exámenes que se encuentran en proceso de asociación.
  async consultarExamenesAsociados() {
    debugger
    await this.ServiceGrupo.ConsultarExamenesAsociados(this.IdUsuario, 0, this.idSolicitud).then(async (data) => {
      this.ArrayExCargados = data;
      this.ArrayTemp = await (await this.ServiceGrupo.ListarProcedimientosGrupo(this.IdUsuario, this.idplan, this.idSolicitud)).filter(d => d.Cantidad > 0);
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

  ventanaCarga() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Cargando información'
    });
    Swal.showLoading();
  }

  //Almacena la asociación de un procedimiento a un determinado paciente.
  async asociarExamenesFinal() {
    if (this.selectedIdExam != null) {
      this.contadorExamenes++;
      if (this.contadorExamenes > 0) {
        if(this.contPacientes == this.NumPacientes){
          if(this.examenesTotales == this.TotalQuantity){
            this.ventanaCarga();
            this.CrearGrupoFamiliar();
            await this.ServiceGrupo.AsociarExamenes(this.selectedIdExam, this.IdPacNew, 0, this.IdUsuario, this.idExamenGlobal).then(resp => {
              Swal.fire({
                text: resp,
                icon: 'success',
                showConfirmButton: true
              }).then(result => {
                if (result.isConfirmed) {
                  (<any>$('#DivPacientes')).modal('hide');
                  this.formPacientes.reset();
                  $('#exCargados').val('0');
                  $('#SelTipDoc').val('0');
                  this.contadorExamenes = 0;
                  this.TablaExamenes = false;
                  this.ArrayExCargados.length = 0;
                  this.arrayExamnesSelecccionados.length = 0;
                  this.obtenerRegistroFinal();
                }
              })
            });
          }else{
            Swal.fire({
              icon: 'warning',
              title: 'Falta examenes por asociar',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            })
          }
        }else{
          this.ventanaCarga();
          this.CrearGrupoFamiliar();
          await this.ServiceGrupo.AsociarExamenes(this.selectedIdExam, this.IdPacNew, 0, this.IdUsuario, this.idExamenGlobal).then(resp => {
            Swal.fire({
              text: resp,
              icon: 'success',
              showConfirmButton: true
            }).then(result => {
              if (result.isConfirmed) {
                (<any>$('#DivPacientes')).modal('hide');
                this.formPacientes.reset();
                $('#exCargados').val('0');
                $('#SelTipDoc').val('0');
                this.contadorExamenes = 0;
                this.TablaExamenes = false;
                this.ArrayExCargados.length = 0;
                this.arrayExamnesSelecccionados.length = 0;
                this.obtenerRegistroFinal();
              }
            })
          });
        }
      }
    } else {
      Swal.fire({
        text: "Debe seleccionar un examen para continuar.",
        icon: 'warning',
        showConfirmButton: true
      });
    }
    this.selectedIdExam = null
  }

  //Elimina un examen asociado a un paciente.
  async eliminarExamenAsociado(id, idProcedimiento) {
    await this.ServiceGrupo.EliminarExamenesAsociados(id, idProcedimiento, this.IdUsuario).then(
      resp => {
        this.contador2--;
        for (let index = 0; index < this.arrayExamnesSelecccionados.length; index++) {
          if(this.arrayExamnesSelecccionados[index] == idProcedimiento){
            this.arrayExamnesSelecccionados.splice(index,1)
            this.examenesTotales--;
          }
        }
        if(this.arrayExamnesSelecccionados.length == 0) this.selectedIdExam = null
        this.consultarExamenesAsociados();
      })
  }

  //Lista a los pacientes de la solicitud y el mismo grupo familiar.
  async obtenerRegistroFinal() {
    await this.ServiceGrupo.PacientesGrupoPaciente(this.IdUsuario, this.idSolicitud).then((data) => {
      this.ArrayPacientesGrupo = data;
      this.ArrayResponsablePago = this.ArrayPacientesGrupo.filter(p => p.Edad >= 18);
      if (Number(this.IdAcudiente) > 0) { this.concatenarAcudientes(); }
      this.PorcentajeExamenes = Math.round((((this.contador2) / this.TotalQuantity) * 100));
      this.PorcentajePacientes = Math.round((((this.contPacientes) / this.NumPacientes) * 100));
      let valor = (this.contador2 == this.TotalQuantity) ? true : false;
      $('#btnAgregarPaciente').prop('disabled', valor);
      this.Completado = (valor == true) ? true : false;
      this.ajustarBarraProgreso();
    });
  }

  async concatenarAcudientes() {
    this.bandera_acudiente = 1;
    this.vizualizaraAcudiente = await this.ServicePaciente.ConsultarAcudiente(this.IdAcudiente);
    const AcuTercero = {
      nombreCompleto: this.vizualizaraAcudiente[0].primerNombre
        + " " + this.vizualizaraAcudiente[0].primerApellido,
      documento: this.vizualizaraAcudiente[0].documento,
      Idpaciente: this.vizualizaraAcudiente[0].id,
      Fecha_Nacimiento: this.vizualizaraAcudiente[0].fechanacimiento,
      IdGrupo: this.vizualizaraAcudiente[0].id
    }
    let doc = this.ArrayResponsablePago.findIndex(responsable => responsable.documento == AcuTercero.documento);
    if (doc == -1) {
      this.ArrayResponsablePago.push(AcuTercero);
    }

  }



  //Se realizan las modificaciones necesarias para mantener el orden visual en la vista móvil.
  ajustarBarraProgreso() {
    if (this.Completado == true) {
      $('#divProgreso').addClass('div-progress-mobile');
      $('#ProgressPacientes').addClass('div-progressPacientes-mobile');
    }
  }

  //Consulta de los exámenes asociadas a un paciente.
  async consultarExamenesAsociados2(IdUsuario, idPaciente) {
    await this.ServiceGrupo.ConsultarExamenesAsociados(IdUsuario, idPaciente, this.idSolicitud).then((data) => {
      this.ArrayVerMas = data;
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

  //Creacaión del grupo familiar.
  async CrearGrupoFamiliar() {
    const Infogrupo = {
      IdGrupo: 0,
      IdSolicitud: this.idSolicitud,
      IdPaciente: this.IdPacNew,
      PuntoEntrega: 0,
      IdTipoMuestra: 0,
      Origen: 'GF',
      Titular: 0,
      IdSede: 0
    }
    await this.ServiceGrupo.CrearGrupoFamiliar(Infogrupo).then(resp => {
      if (resp.isConfirmed) { }
    });
  }

  //Controla la habilitación del registro de un tercero para el pago.
  HabilitarRegistro(event: any) {
    this.BandResponsable = event;
    if (event == "-1") {
      this.bandera_crea = 1;
      this.MostrarResponsable = true;

    } else if (event == "0") {
      this.TerceroRegistrado = false;
      this.MostrarResponsable = false;
      this.bandera_crea = 0;
    } else {
      this.idgrupo = +event;
      this.MostrarResponsable = false;
      this.bandera_crea = 2;
      this.TerceroRegistrado = true;
    }
  }

  validarTercero() {
    if (this.BandResponsable == 0 || this.BandResponsable == -1) {
      if ($("#tipoDocOtro").val('') || $("#nombresT").val('') ||
        $("#apellidosT").val('') || $("#documentoT").val('') ||
        $("#correoT").val('')) {
        this.TerceroRegistrado = false;
      } else {
        this.TerceroRegistrado = true;
      }
    } else {
      this.TerceroRegistrado = true;
    }

  }

  //Registra el responsable del pago.
  async RegistrarResponsable() {
    if (this.bandera_crea == 1) {
      const Responsable = {
        id: 0,
        tipodoc: $("#tipoDocOtro").val(),
        Idsolicitud: +this.idSolicitud,
        nombres: $("#nombresT").val(),
        apellidos: $("#apellidosT").val(),
        documentoR: $("#documentoT").val(),
        correo: $("#correoT").val(),
        Categoria: 'GF',
        bandera_acudiente: this.bandera_acudiente,
      }
      await this._servicePaternidad.CrearResponsableFactura(Responsable).then(resp => {
      });
    } else {
      const Responsable = {
        id: this.idgrupo,
        tipodoc: 0,
        Idsolicitud: +this.idSolicitud,
        nombres: "0",
        apellidos: "0",
        documentoR: "0",
        correo: "0",
        Categoria: 'GF',
        bandera_acudiente: this.bandera_acudiente,
      }
      await this._servicePaternidad.CrearResponsableFactura(Responsable).then(resp => {
      });
    }
  }

  //Dispara la ventana que indica la carga de los datos.
  VentanaCarga() {
    let timerInterval
    Swal.fire({
      title: 'Procesando....',
      html: 'Estamos realizando validación de datos',
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

  //Realiza la confirmación del pago.
  async ConfirmarPago() {
    this.VentanaCarga();
    this.disabledConfirmacion = true;
    await this.ConfirmarPagoElectronico(this.idTransaccion, this.IdUsuario, this.sede[0].id);
  }

  //Realiza la confirmación del pago por medio electrónico.
  async ConfirmarPagoElectronico(idtransaccion, usuario, idSede) {
    await this.ServiceGrupo.ConfirmarPagoDatafono(idtransaccion, usuario, idSede, 'GF').then(response => {
      if (response === "") {
        Swal.close();
        (<any>$('#ModalTransaccion')).modal('hide');
        this.VerModalFacturacion();
      } else {
        Swal.close();
        this.VerAlerta = true;
        this.NotificacionError = response.toString();
      }
    })
  }

  //Alerta que se dispara si se busca cancelar el pago con tarjeta de crédito.
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

  pacienteDoble(){
    Swal.fire({
      icon: 'warning',
      title: 'El paciente seleccionado ya se encuentra dentro del grupo familiar',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.formPacientes.reset()
        this.formPacientes.controls.tipodocumento.setValue('0')
      } 
    });
  }

  examenDoble(){
    Swal.fire({
      icon: 'warning',
      title: 'El examen seleccionado ya se encuentra asociado',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        $('#exCargados').val('0');
      } 
    });
  }

  //Anula el pago electrónico al confirmar la anulación.
  async AnularPagoElectronico() {
    await this.ServiceVentas.BorrarPagoDatafono(this.idTransaccion, this.IdUsuario, this.sede[0].id, 'GF').then(response => {
      (<any>$('#ModalTransaccion')).modal('hide');
      this.ReiniciarProceso();
    });
  }


  //Genera la vemnta haciendo uso de los paráemtros definidos a lo largo del código y otros adicionales.
  async finalizarResumen() {
    $("#deshabilitarBoton").prop('disable',true)
    const DatosVenta = {
      idSolicitud: this.idSolicitud,
      Idsede: this.IdSede,
      MediosPago: this.arrMediosPago,
      Totales: this.arrTotales,
      Observacion: $("#observaciones").val(),
      AcuerdoPoliticas: $("#customRadioPoliticasSi").is(':checked') === true ? 1 : 2,
      Idtiposervicio: 2,
      Idplan: this.idplan,
      IdUsuario: this.IdUsuario,
      IdEstadoVenta: 1
    }
    if (DatosVenta.AcuerdoPoliticas == 1) {
      this.ventanaCarga()
      await this.ServiceGrupo.finalizarVentaGrupoFamiliar(DatosVenta).then(response => {
        Swal.close();
        this.RegistrarResponsable();
        let index = this.arrMediosPago.filter(element => element == 4);
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
            (<any>$('#ModalTransaccion')).modal('show');
          }
        } else {
          this.VerModalFacturacion();
          this.limpiar();
        }
        // });

      }).catch(err => {
        if (err.status === 400 || err.status === 500) {
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
        icon: 'info',
        title: 'Opps...',
        text: 'Para continuar, debes estar de acuerdo con la política de tratamiento de datos.',
        showConfirmButton: true
      });
    }
  }


  //Limpia el arreglo de procedimientos.
  limpiar() {
    this.ArrayProcedimientos.length = 0;
  }

  restarPacientes(){
    this.contPacientes--;
  }

  //Realiza la limpieza del formulario de pacientes.
  async LimpiarFormPacientes() {
    // this.ArrayProcedimientos = [];
    this.ArrayExCargados.forEach(element => {
      this.ServiceGrupo.EliminarExamenesAsociados(element.Id, element.IdProcedimiento, this.IdUsuario)
      this.contador2--;
      this.contadorExamenes--;
      this.examenesTotales--;
    });
    this.consultarExamenesAsociados();
    this.arrayExamnesSelecccionados = [];
    this.arrayIdExamenGlobal = [];
    this.selectedIdExam = null
    this.formPacientes = this.formbuilder.group({
      id: [''],
      documento: ['', [Validators.required]],
      tipodocumento: ['0'], fechanacimiento: ['', [Validators.required]],
      primerNombre: ['', [Validators.required]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''], PoliticaDatos: [''], correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      celular: [''], direccion: ['', [Validators.required]],
      Idciudad: ['', [Validators.required]],
      Idbarrio: [''], Idestadocivil: ['', [Validators.required]],
      Idestrato: ['', [Validators.required]],
      IdEstadoCivil: [''], IdTipAfil: ['', [Validators.required]],
      NombreBarrio: [''], Idsexo: ['', [Validators.required]],
      IdDepto: ['', [Validators.required]],
      IdLocalidad: [''], Pais: ['161'], IdEps: [''], edad: [''],
      AbreviaturaTipodoc: [''],
      IdDiscapacidad: ['0'], IdEmbarazo: ['0'],
      bandera_origen: ['GF'],
      IdSolicitud: ['0'],
      IdUsuario: this.IdUsuario,
    });
    this.TablaExamenes = false;
  }


  //Dispara el modal que da la opción de redireccionar a facturación.
  VerModalFacturacion() {
    (<any>$('#irfacturacion')).modal('show');
  }

  //Realiza la redirección al módulo de facturación.
  irFacturacion() {
    this.ServicioPuente.Consultar(this.NumeroSolicitud, 2);
    this.router.navigate(['/facturacion']);
    (<any>$('#irfacturacion')).modal('hide');
  }

  reinicio(){  
    (<any>$('#irfacturacion')).modal('hide');
    window.location.reload();
  }

  //Reinica el proceso del módulo.
  ReiniciarProceso() {
    $('#numPacientes').val('2');
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
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



