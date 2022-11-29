import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GenericTipoDoc } from 'src/app/models/Generic/Generic.model';
import { SedeViewModel } from 'src/app/models/LoginModel/Login.model';
import { pacientes } from 'src/app/models/Preatencion/CrearPaciente.model';
import {
  CategoriaCheq,
  MediosPago,
  Planes,
} from 'src/app/models/Ventas/Ventas.model';
import { ClientesService } from 'src/app/services/Preatencion/clientes.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  providers: [VentasService],
})
export class VentasComponent implements OnInit {
  TablaProcedimientos = false;
  mostrarTaps = false;
  MostrarResponsable = false;
  VerRadioOpciones = false;
  ConsultarPacienteVenta: FormGroup;
  formResponsable: FormGroup;
  GesDocument: GenericTipoDoc[];
  Datospaciente: pacientes[];
  DataPlanes: Planes[];
  DataCategoria: CategoriaCheq[];
  DataProcedimientos: Planes[];
  ArrayChequeos: Planes[];
  ArrayExamenes: Planes[];
  ExamChequeo: any;
  Recomendacion: any;
  showAge: any;
  Verchequeo: any;
  VerExamen: any;
  TotalFinal: any;
  submit: boolean;
  contador: number = 0;
  sede: SedeViewModel[];
  mediosPago: MediosPago[];
  IdUsuario: number;
  IdPaciente: number;
  ArrayProcedimientos: any[];
  Examen: any;
  banderaExam: number = 0;
  Chequeo: any;
  banderaChe: number = 0;
  ValorChequeo: any;
  MedioPago: number = 0;
  Tarifa: number;
  ValorExamen: any;

  @ViewChild('auto') auto;
  @ViewChild('covid') covid;
  @ViewChild('covid1') covid1;
  @ViewChild('covid2') covid2;
  @ViewChild('covid3') covid3;
  @ViewChild('covid4') covid4;
  @ViewChild('covid5') covid5;
  @ViewChild('covid6') covid6;
  @ViewChild('covid7') covid7;
  @ViewChild('covid8') covid8;
  @ViewChild('autoPlan') autoPlan;
  keyword = 'NombreProcedimiento';
  NombreProcedimiento: any;
  codigoProcedimiento: any;
  detalleChequeo: boolean = false;
  detalleExam: boolean = false;
  idTransaccion: any;
  NotificacionError: string;
  VerAlerta: boolean = false;
  keywordPlan = 'Concatenado';
  disabled: boolean = false;
  idplan: any = 0;
  formularioCovid: FormGroup;
  ArrayPaises: any;
  keywordPaises = 'pais';
  ArrayEps: any;
  keywordEps = 'eps';
  ArrayTipoAfiliacion: any;
  banderapaso: string;
  paso1: number;
  paso2: number;
  paso3: number;
  activacionModal: number = 0;
  ArrayCiudades: any;
  keywordCiudades = 'ciudad';
  keywordCiudadMuestra = 'ciudad';
  ArrayCondicion: any[];
  ArrayDesicion: any[];
  ArrayEstrategia: any[];
  ArrayMuestra: any[];
  VerAntigeno: boolean = false;
  VerPCR: boolean = false;
  //nacionalidad: any;
  /* eps: any;
  pais: any;
  ciudad_viaje: any;
  pais_procedencia: any;
  ciudad_muestra: any;
  codigo_muestra: any; */
  TipoFormulario: string;
  Codigos = new Array<any>();
  keywordCodigos = 'descripcion';
  textoAlertaCovid: string;
  ArrayPrueba: any[];
  textospan='Por diligenciar';
  FechaFormuCovid= new FormControl('')
  eps = new FormControl('');
  nacionalidad = new FormControl('');
  pais = new FormControl('');
  ciudad_viaje = new FormControl('');
  ciudad_muestra = new FormControl('')
  pais_procedencia = new FormControl('');
  codigo_muestra = new FormControl('');
  hoy:any;
  categoria: string = "VG";
  idproceso: any;
  banderaAlerta: boolean = false;
  muerte: boolean = false;
  advisorId: number;
  subMenuUser: any;
  constructor(private ServicePaciente: ClientesService, private ServiceGenerico: GenericoService, private CrearVen: FormBuilder,
    private ServiceVentas: VentasService, private CrearResp: FormBuilder, private router: Router, private BuilderCovid: FormBuilder,private ValidarPermisos: ValidarPermisos) {

    }



  ngOnInit(): void {
    /* Definir fecha de diligenciamiento formulario covid 19 */
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date = today.getFullYear() + "-" + String((today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1)) + "-" + day[2]
    this.hoy = date
    this.FechaFormuCovid.setValue(date)
    //////
    this.Datospaciente = JSON.parse(sessionStorage.getItem('DatosPaciente'));
    this.sede = JSON.parse(sessionStorage.getItem('Sede'));
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.IdPaciente = JSON.parse(sessionStorage.getItem('Idpaciente'));
    this.ConsultarInfoGemeral();
    this.habilitacionFormularioCovid();
    this.ConsultarPacienteVenta = this.CrearVen.group({
      tipodocumento: [''],
      documento: [''],
      id: [''],
      idPaciente: [''],
      Plan: [''],
      idSede: [''],
      totalVenta: [''],
      idMedioPago: [''],
      ExamsVenta: this.CrearVen.array([], [Validators.required]),
      CheckupsVenta: this.CrearVen.array([], [Validators.required]),
      Observacion: [''],
      Politicadatos: [''],
      IdDomicilio: [''],
      IdTipoServ: ['1'],
      idUser: [''],
      Urgente: ['0'],
    });

    this.formResponsable = this.CrearResp.group({
      id: [''],
      idpaciente: [''],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      tipodoc: ['', [Validators.required]],
      documentoR: ['', [Validators.required]],
      correo: ['', [Validators.required]],
    });

    if (this.Datospaciente != null) {
      for (const data of this.Datospaciente) {
        this.CalcularEdad(data.fechanacimiento);
        this.ConsultarPacienteVenta.patchValue({
          tipodocumento: data.tipodocumento,
          documento: data.documento
        });
        sessionStorage.setItem('Documento', JSON.stringify(this.Datospaciente[0].documento));
      }
      this.mostrarTaps = true;
    }
    // this.paso1=1;
    // this.paso2=2;
    // this.paso3=3;
    // (<any>$('#FormularioCovid')).modal('show');
    // this.VerPCR=true
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async ConsultarInfoGemeral() {
    this.Codigos.push({ id: "110010571101", descripcion: "Laboratorio Colcan" });
    this.GesDocument = await this.ServiceGenerico.ConsultarTipoDoc();
    this.DataPlanes = await this.ServiceVentas.ConsultarPlanes();
    this.mediosPago = await this.ServiceVentas.ConsultarMediosPago();

    this.ArrayPaises = await this.ServiceGenerico.ConsultarPaises();
    this.ArrayEps = await this.ServiceGenerico.ConsultarEps();
    this.ArrayTipoAfiliacion = await this.ServiceGenerico.ConsultarTipoAfilicacion();
    this.ArrayCiudades = await this.ServiceGenerico.ConsultarCiudades(0);
    this.ArrayCondicion = await this.ServiceGenerico.ConsultarOpcionesCovid(7, 16);
    this.ArrayDesicion = await this.ServiceGenerico.ConsultarOpcionesCovid(6, 16);
    this.ArrayEstrategia = await this.ServiceGenerico.ConsultarOpcionesCovid(4, 16);

    await this.EliminarProcedimientosVentas(0, 2, 0, 0);
    await this.ServiceVentas.EliminarFormularioCovid(this.IdUsuario);
  }

  get f() {
    return this.ConsultarPacienteVenta.controls;
  }

  async consultarDocumento() {
    await this.ServiceGenerico.ConsultarTipoDoc().then((data) => {
      this.GesDocument = data;
      this.consultarPlanes();
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

  async consultarPlanes() {
    await this.ServiceVentas.ConsultarPlanes().then((data) => {
      this.DataPlanes = data;
      this.consultarCategoriaChequeos();
    });
  }

  async consultarCategoriaChequeos() {
    await this.ServiceVentas.ConsultarCategoriaChequeos().subscribe((data) => {
      this.DataCategoria = data;
      this.ConsultaMediosPago();
    });
  }

  async ConsultaMediosPago() {
    await this.ServiceVentas.ConsultarMediosPago().then((data) => {
      this.mediosPago = data;
      this.EliminarProcedimientosVentas(0, 2, 0, 0)
    });
  }

  async consultar() {
    var documento = $('#txtdocumento').val();
    var tipodocumento = $('#SelTipDoc').val();
    if (documento == '' || tipodocumento == '') {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Ingrese los datos para continuar',
      });
    } else {
      await this.ServicePaciente.DetallPaciente(documento, tipodocumento).then((data) => {
        if (data.length > 0) {
          this.Datospaciente = data;
          this.CalcularEdad(data[0].fechanacimiento);
          sessionStorage.setItem('Idpaciente', JSON.stringify(data[0].id));
          this.IdPaciente = JSON.parse(sessionStorage.getItem('Idpaciente'));
          sessionStorage.setItem('Documento', JSON.stringify(documento));
          this.mostrarTaps = true;
        } else {
          $('#txtdocumento').val("");
          $('#SelTipDoc').val("");
          Swal.fire({
            icon: 'warning',
            title: 'Opps...',
            text: 'El paciente no existe',
          });
        }
      });
    }
  }

  async CalcularEdad(fecha) {
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

  }

  siguiente(bandera) {
    $('.tab-pane').hide();
    if (bandera == 2) {
      var activetab = $('#tab2').attr('href');
      $(activetab).show();
      $('#Li2').addClass('active');
      $('#Li1').removeClass('active');
    } else if (bandera == 3) {
      if (this.ValidarListar() != true) {
        var activetab = $('#tab2').attr('href');
        $(activetab).show();
        $('#Li2').addClass('active');
        $('#Li1').removeClass('active');
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Debe agregar al menos un procedimiento',
          showConfirmButton: true
        });
      } else {
       // if (this.validarRegistroFormularioCovid() == true) {
          // var activetab = $('#tab2').attr('href');
          // $(activetab).show();
          // $('#Li2').addClass('active');
          // $('#Li1').removeClass('active');
          // (<any>$('#AlertaCovid')).modal('show');
        // } else {
          var activetab = $('#tab3').attr('href');
          $(activetab).show();
          $('#Li3').addClass('active');
          $('#Li2').removeClass('active');
        // }
      }
    } else {
      if (this.MedioPago != 0) {
        var activetab = $('#tab4').attr('href');
        $(activetab).show();
        $('#Li4').addClass('active');
        $('#Li3').removeClass('active');
      } else {
        var activetab = $('#tab3').attr('href');
        $(activetab).show();
        $('#Li3').addClass('active');
        $('#Li2').removeClass('active');
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Debe seleccionar medio de pago',
          showConfirmButton: true
        });
      }
    }
  }

  atras(bandera) {
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
      var activetab = $('#tab3').attr('href');
      var activetab2 = $('#tab4').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li3').addClass('active');
      $('#Li4').removeClass('active');
    }
  }

  ValidarListar() {
    var validador = false;
    if (this.contador > 0) {
      validador = true;
    }
    return validador;
  }

  async cargarInformacion(bandera: any) {
    const idplan = $('#selPlan').val()
    this.ServiceVentas.ConsultarProcedimientosPlan(bandera, this.idplan).then((data) => {
      if (bandera === "1") {
        this.Recomendacion = "";
        this.ValorChequeo = "";
        this.ArrayChequeos = data;
      } else if (bandera === "2") {
        this.ArrayExamenes = data
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

    await this.ServiceVentas.EliminarFormularioCovid(this.IdUsuario).then(data=>{});
  }

  VerProcedimientos() {
    const planSelec = $('#selPlan').val()
    if (this.idplan != 0) {
      (<any>$('#ProcedimientosChequeoyExamenes')).modal('show');
      this.TablaProcedimientos = true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Seleccione un plan para continuar',
        showConfirmButton: true
      });
    }
  }

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

  PreselectPlan(datosPlan) {
    this.idplan = datosPlan.Id;
  }

  SeleccionarPlan(bandera) {
    const IdPlan = $("#selPlan").val();
    for (const dato of this.DataPlanes.filter(x => x.Id === Number(this.idplan))) {
      this.Tarifa = dato.IdTarifa;
    }
    if (IdPlan === "") {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Debe seleccionar un plan para continuar',
        showConfirmButton: true
      });
    } else {
      if (bandera == 1) {
        $("#botonUsar").hide()
        $("#botonCambiar").show()
        this.disabled = true;
        this.VerRadioOpciones = true;
        this.cargarInformacion("2");
        this.VerExamen = true;
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

  ChequeoCategoria(Cat) {
    this.ArrayChequeos = this.DataProcedimientos.filter((x) => x.IdCategoria === Number(Cat));
  }

  ConsultaDatosCh(Cheq) {
    for (const data of this.ArrayChequeos.filter((x) => x.idProcedimiento === Cheq)) {
      this.Recomendacion = data.Recomendaciones;
      this.ValorChequeo = data.ValorTarifa;
      this.NombreProcedimiento = data.NombreProcedimiento;
      this.codigoProcedimiento = data.idProcedimiento;
    }
    this.detalleChequeo = true;
  }

  SelectChequeo(CodChequeo, bandera) {
    this.Chequeo = CodChequeo;
    this.banderaChe = bandera;
    this.AgregarChequeo();
  }

  async AgregarChequeo() {
    await this.ServiceVentas.GuardarProcedimientos(this.Chequeo.idProcedimiento, this.banderaChe, this.Tarifa, this.IdUsuario).then(response => {
      if (response.toString().split(',')[1] != "0") {
        Swal.fire({
          icon: 'info',
          title: response.toString().split(',')[0],
          showConfirmButton: true
        }).then(result => {
          if (result.isConfirmed) {
            this.LimpiarAutoCompleteChe();
          }
        });
      }
      if (response.toString().split(',')[1] === "0") {
        this.contador = this.contador + 1;
        this.TablaProcedimientos = true;
        this.GuardarTemProcedimientos(this.Chequeo.idProcedimiento, true, this.banderaChe);
        this.ListarProcedimientos();
        this.LimpiarAutoCompleteChe();
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

  LimpiarAutoCompleteChe() {
    this.auto.clear();
    this.auto.close();
    this.ValorExamen = "";
    this.NombreProcedimiento = "";
    this.codigoProcedimiento = "";
    this.detalleChequeo = false;
  }

  LimpiarChequeos() {
    $("#SelCat").val("");
    $("#SelChe").val("");
    this.Recomendacion = "";
    this.ValorChequeo = "";
    $("#radioCheq").prop("checked", false);
  }

  CerrarModalChequeos() {
    this.Verchequeo = false;
    this.LimpiarChequeos();
    (<any>$('#ProcedimientosChequeoyExamenes')).modal('hide');
  }

  SelectExam(AutoExamen, bandera) {
    this.Examen = AutoExamen;
    this.banderaExam = bandera;
    this.AgregarExamen();
  }

  ConsultaDatosExamen() {
    for (const data of this.ArrayExamenes.filter((x) => x.idProcedimiento === this.Examen.idProcedimiento)) {
      this.ValorExamen = data.ValorTarifa;
      this.NombreProcedimiento = data.NombreProcedimiento;
      this.codigoProcedimiento = data.idProcedimiento;
    }
    this.detalleExam = true;
  }

  async AgregarExamen() {
    await this.ServiceVentas.GuardarProcedimientos(this.Examen.idProcedimiento, this.banderaExam, this.Tarifa, this.IdUsuario).then(response => {
      if (response.toString().split(',')[1] != "0") {
        this.banderaExam = 0;
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
        this.ListarProcedimientos();
        this.TablaProcedimientos = true;
        this.GuardarTemProcedimientos(this.Examen.idProcedimiento, true, this.banderaExam);
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
    this.auto.clear();
    this.auto.close();
    this.ValorExamen = "";
    this.detalleExam = false;
  }

  async ListarProcedimientos() {
    let idplan = $('#selPlan').val();
    await this.ServiceVentas.ListarProcedimientos(this.IdUsuario, this.idplan).then((data) => {
      this.ArrayProcedimientos = data;
     for (const key of data) {
       if (key.Bandera_Formulario == 2) {
        setTimeout(() => {
          $('#spanCovid').removeClass('badge-Covid1');
          $("#spanCovid").addClass("badge-Covid2");
          this.textospan = 'Diligenciado';
        }, 5);
       }else if (key.Bandera_Formulario == 1) {
        setTimeout(() => {
          $('#spanCovid' + key.id).addClass('badge-Covid1');
          this.textospan = 'Por diligenciar';
        }, 5);
      }
     }

      //this.validarFormularioCovid();
      var total = 0;
      for (const info of data) {
        var valorcalculado = info.Valor;
        total += Number(valorcalculado);
      }
      this.TotalFinal = total;
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
    });;
  }

  EliminarProcedimientosVentas(id, bandera, codigo, banderaElimina) {
    this.ServiceVentas.EliminarProcedimientos(id, bandera, this.IdUsuario).then(response => {
      if (bandera == 1) {
        this.GuardarTemProcedimientos(codigo, false, banderaElimina);
        this.ListarProcedimientos();
        this.cerrarModal();
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

  async CrearVenta() {
    this.ConsultarPacienteVenta.value.totalVenta = this.TotalFinal;
    this.ConsultarPacienteVenta.value.idPaciente = this.IdPaciente;
    this.ConsultarPacienteVenta.value.idUser = this.IdUsuario;
    this.ConsultarPacienteVenta.value.Plan = this.idplan;
    //for (const sede of this.sede) {
    this.ConsultarPacienteVenta.value.idSede = this.sede[0].id;
    //  }
    $("#btnfinventa").hide();
    await this.ServiceVentas.CrearVentas(this.ConsultarPacienteVenta.value).then(response => {
      this.EliminarProcedimientosVentas(0, 2, 0, 0);
      if (this.MedioPago == 4) {
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
        this.Limpiar();
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

  LimpiarFormulario() {
    this.TablaProcedimientos = false;
    this.EliminarProcedimientosVentas(0, 2, 0, 0);
    $("#botonUsar").show();
    $("#botonCambiar").hide();
    this.contador = 0;
    this.autoPlan.clear();
    this.VerRadioOpciones = false;
    this.TablaProcedimientos = false;
    this.SeleccionarPlan(2);
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

  async ConfirmarPago() {
    await this.ConfirmarPagoElectronico(this.idTransaccion, this.IdUsuario, this.sede[0].id);
  }

  async ConfirmarPagoElectronico(idtransaccion, usuario, idSede) {
    await this.ServiceVentas.ConfirmarPagoDatafono(idtransaccion, usuario, idSede).then(response => {
      if (response === "") {
        this.VerModalFacturacion();
        this.Limpiar();
      } else {
        this.VerAlerta = true;
        this.NotificacionError = response.toString();
      }
    })
  }

  async AnularPagoElectronico() {
    await this.ServiceVentas.BorrarPagoDatafono(this.idTransaccion, this.IdUsuario, this.sede[0].id,'VG').then(response => {
      this.Limpiar();
    });
  }

  GuardarTemProcedimientos(id: string, isChecked: boolean, bandera: number) {
    const arrayCh = <FormArray>(
      this.ConsultarPacienteVenta.controls.CheckupsVenta
    );
    const arrayEx = <FormArray>this.ConsultarPacienteVenta.controls.ExamsVenta;

    if (bandera == 1) {
      if (isChecked) {
        arrayCh.push(new FormControl(id));
      } else {
        let index = arrayCh.controls.findIndex((x) => x.value == [id]);
        arrayCh.removeAt(index);
      }
    } else {
      if (isChecked) {
        arrayEx.push(new FormControl(id));
      } else {
        let index = arrayEx.controls.findIndex((x) => x.value == [id]);
        arrayEx.removeAt(index);
      }
    }
  }

  SelectMedioPago(Id) {
    this.MedioPago = Id;
  }

  NotificacionCreaResponsable(mensaje) {
    Swal.fire({
      icon: 'success',
      title: mensaje.toString(),
      showConfirmButton: false,
      timer: 1500,
    });
  }

  get ValidarResp() {
    return this.formResponsable.controls;
  }

  mostrarrespo() {
    this.MostrarResponsable = true;
    this.formResponsable.patchValue({
      idpaciente: JSON.parse(sessionStorage.getItem('Idpaciente')),
    });
  }

  ocultarrespo() {
    this.MostrarResponsable = false;
  }

  async CrearResponsable() {
    this.submit = true;
    if (this.formResponsable.invalid) {
      return;
    } else {
      await this.ServiceVentas.CrearResponsableFact(this.formResponsable.value).then((resp) => {
        this.NotificacionCreaResponsable(resp)
        return;
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
      });;
      this.submit = false;
      this.formResponsable.reset();
    }
  }

  AsigPolitica(valor) {
    if ((valor = 'on')) {
      this.ConsultarPacienteVenta.value.Politicadatos = 1;
    }
  }

  VerModalFacturacion() {
    (<any>$('#irfacturacion')).modal('show');
  }

  irFacturacion() {
    this.router.navigate(['/facturacion']);
    (<any>$('#irfacturacion')).modal('hide');
  }

  Limpiar() {
    this.mostrarTaps = false;
    this.TotalFinal = 0;
    this.contador = 0;
    this.TablaProcedimientos = false;
    this.Verchequeo = false;
    this.VerExamen = false;
    $("#radioCheq").prop("checked", false);
    $("#radioExam").prop("checked", false);
    $('#TableProc tbody').children().remove();
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    var activetab = $('#tab1').attr('href');
    var activetab2 = $('#tab2').attr('href');
    var activetab3 = $('#tab3').attr('href');
    var activetab4 = $('#tab4').attr('href');
    $(activetab).show();
    $(activetab2).hide();
    $(activetab3).hide();
    $(activetab4).hide();
    this.LimpiarChequeos();
    this.LimpiarAutoComplete();
    this.ConsultarPacienteVenta = this.CrearVen.group({
      tipodocumento: [''],
      documento: [''],
      id: [''],
      idPaciente: [''],
      Plan: [''],
      idSede: [''],
      totalVenta: [''],
      idMedioPago: [''],
      ExamsVenta: this.CrearVen.array([]),
      CheckupsVenta: this.CrearVen.array([]),
      Observacion: [''],
      Politicadatos: [''],
    });

    this.formResponsable = this.CrearResp.group({
      id: [''],
      idpaciente: [''],
      nombres: [''],
      apellidos: [''],
      tipodoc: [''],
      documentoR: [''],
      correo: [''],
    });
    (<any>$('#ModalTransaccion')).modal('hide');
  }


  habilitacionFormularioCovid() {
    this.formularioCovid = this.BuilderCovid.group({
      IdFormulario: [0],
      nacionalidad: ['', [Validators.required]],
      eps: ['', [Validators.required]],
      regimen: ['0'],
      pais: [],
      trabajadorSalud: ['0'],
      contacto_confirmado: ['0'],
      fechasintomas: [],
      ocupacion: [],
      cliente_remitente: ['', [Validators.required]],
      primeraVez_Control: [],
      sintomas: ['0', [Validators.required]],
      viajero: ['0'],
      ciudad_viaje: [''],
      pais_procedencia: [''],
      fechallegada: [''],
      condicion: ['0'],
      fechamuerte: [''],
      ciudad_muestra: [''],
      codigo_muestra: [''],
      fechamuestra: [''],
      fecharecepcion: [''],
      numeroorden: [''],
      tipoMuestra: ['0', [Validators.required]],
      codigoGVI: ['', [Validators.required]],
      estrategia: ['0'],
      PosSintomatico: ['0'],
      Tipo_Prueba: ['0'],
      CodAthenea: [''],
      TipoFormulario: [''],
      cercoepodemiologico: ["0", [Validators.required]],
      sintomas_previos: ["0", [Validators.required]],
      IdUsuario: this.IdUsuario,
      idproceso:['']
    });
  }


  SiguienteCovid(paso) {
    if (paso == 1) {
      if(((this.nacionalidad.value.id!=undefined && this.eps.value.id!=undefined && this.pais.value.id!=undefined &&
        this.formularioCovid.controls.cliente_remitente.valid
        && this.formularioCovid.controls.sintomas.value>0 && this.formularioCovid.value.condicion>0) && this.VerPCR) ||
        ((this.nacionalidad.value.id!=undefined && this.eps.value.id!=undefined && this.pais.value.id!=undefined &&this.formularioCovid.controls.cliente_remitente.valid) && !this.VerPCR)){
          this.banderaAlerta = false;
        $('.tab-pane2').hide();
        var activetab = $('#tabdatossecundarios').attr('href');
        $(activetab).show();
        $('#Lidatosbasicos').removeClass('active');
        $('#Lidatossecundarios').addClass('active');
      }else{
        this.banderaAlerta = true;
        this.textoAlertaCovid = "Para poder continuar con el proceso, por favor diligencia los campos obligatorios";
        $("#fasAlert").addClass("fa-exclamation-triangle");
        var activetab = $('#tab2').attr('href');
          $(activetab).show();
          $('#Li2').addClass('active');
          $('#Li1').removeClass('active');

          (<any>$('#AlertaCovid')).modal('show');
      }
    }
    else if (paso == 2) {

      if(((this.formularioCovid.controls.sintomas.value>0 && this.formularioCovid.controls.Tipo_Prueba.value>0) && !this.VerPCR) || this.VerPCR){
        this.banderaAlerta = false;
        $('.tab-pane2').hide();
        var activetab = $('#tabdatosMuestra').attr('href');
        $(activetab).show();
        $('#Lidatossecundarios').removeClass('active');
        $('#LidatosMuestra').addClass('active');
      }else{
        this.banderaAlerta = true;
        this.textoAlertaCovid = "Para poder continuar con el proceso, por favor diligencia los campos obligatorios";
        $("#fasAlert").addClass("fa-exclamation-triangle");
        var activetab = $('#tab2').attr('href');
          $(activetab).show();
          $('#Li2').addClass('active');
          $('#Li1').removeClass('active');

          (<any>$('#AlertaCovid')).modal('show');
      }
    }
  }

  RetrocederCovid(paso) {
    $('.tab-pane2').hide();
    if (paso == 1) {
      var activetab = $('#tabDatosBasicos').attr('href');
      $(activetab).show();
      $('#Lidatossecundarios').removeClass('active');
      $('#Lidatosbasicos').addClass('active');

    }
    else if (paso == 2) {
      var activetab = $('#tabdatossecundarios').attr('href');
      $(activetab).show();
      $('#LidatosMuestra').removeClass('active');
      $('#Lidatossecundarios').addClass('active');

    }
  }



  validarRegistroFormularioCovid() {
    var validador = false;
    this.ArrayProcedimientos.forEach(async element => {
      if (element.Bandera_Formulario == 1) {
        validador = true;
        this.textoAlertaCovid = "Para poder continuar con el proceso, por favor diligenciar el formulario de Covid";
        $("#fasAlert").addClass("fa-exclamation-triangle");
      }
    });
    return validador;
  }

  async validarFormularioCovid(CodAthenea) {
      if (CodAthenea == '2522' || CodAthenea == '2520' || CodAthenea == '2512' || CodAthenea == '2759') {
        this.banderapaso = 'SDS';
        this.paso1 = 1;
        this.paso2 = 2;
        this.paso3 = 3;
        this.activacionModal = 1
        this.VerAntigeno = true;
        this.VerPCR = false;
        this.ArrayPrueba = await this.ServiceGenerico.ConsultarOpcionesCovid(5, 16);
        this.TipoFormulario = "ANTIGENO";
        (<any>$('#FormularioCovid')).modal('show');
      } else if (CodAthenea == '2497' || CodAthenea == '2542' || CodAthenea == '2766' ) {
        (<any>$('#ModalCovidPR')).modal('show');
        this.TipoFormulario = "PR";
        this.activacionModal = 2
      } else if (CodAthenea == '2484' || CodAthenea == '2644' || CodAthenea == '2656' || CodAthenea == '2763' ||
                 CodAthenea == '2765') {
        this.paso1 = 1;
        this.paso2 = 2;
        this.paso3 = 3;
        this.activacionModal = 1
        this.VerPCR = true;
        this.VerAntigeno = false;
        this.TipoFormulario = "PCR";
        this.ArrayMuestra = await this.ServiceGenerico.ConsultarOpcionesCovid(8, 16);
        (<any>$('#FormularioCovid')).modal('show');
      }
  }

  validarCondicion(idopcion){
    if (+idopcion == 29) {
      this.muerte = false;
    } else {
      this.muerte = true;
    }
  }

  CerrarFormularioCovid(){
    if(this.activacionModal==1){
      (<any>$('#FormularioCovid')).modal('hide');
    }else{
      (<any>$('#ModalCovidPR')).modal('hide');
    }
  }

  GuardarFormularioCovid() {
    this.formularioCovid.value.TipoFormulario = this.TipoFormulario;
    this.formularioCovid.value.nacionalidad = String(this.nacionalidad.value.id)
    this.formularioCovid.value.eps = String(this.eps.value.id)
    this.formularioCovid.value.pais = String(this.pais.value.id)
    this.formularioCovid.value.ciudad_viaje = String(this.ciudad_viaje.value.id)
    this.formularioCovid.value.pais_procedencia = String(this.pais_procedencia.value.id)
    this.formularioCovid.value.ciudad_muestra = String(this.ciudad_muestra.value.id)
    this.formularioCovid.value.codigo_muestra = String(this.codigo_muestra.value.id)
    this.formularioCovid.value.idproceso=this.idproceso;

    if (this.Examen.idProcedimiento == '2522' || this.Examen.idProcedimiento == '2520' ||this.Examen.idProcedimiento == '2497' || this.Examen.idProcedimiento == '2759'
    || this.Examen.idProcedimiento == '2644' || this.Examen.idProcedimiento == '2656' || this.Examen.idProcedimiento == '2512' || this.Examen.idProcedimiento == '2484'
    || this.Examen.idProcedimiento == '2542' || this.Examen.idProcedimiento == '2763' || this.Examen.idProcedimiento == '2765' || this.Examen.idProcedimiento == '2766') {
      this.formularioCovid.value.CodAthenea = this.Examen.idProcedimiento;
    }

    if(( (this.ciudad_muestra.value.id!=undefined && this.formularioCovid.controls.tipoMuestra.value>0 && this.formularioCovid.controls.codigoGVI.valid
      && this.formularioCovid.value.fechamuestra!='' && this.formularioCovid.value.fecharecepcion && this.formularioCovid.value.estrategia>0)
      &&(this.VerPCR && this.activacionModal == 1)) ||
    ( (this.ciudad_muestra.value.id!=undefined &&this.formularioCovid.controls.codigoGVI.valid) &&(!this.VerPCR && this.activacionModal==1)) ||
    ((this.formularioCovid.controls.cercoepodemiologico.value>0 &&this.formularioCovid.controls.trabajadorSalud.value>0 && this.eps.value.id!=undefined && this.formularioCovid.controls.sintomas.value>0) && this.activacionModal==2) ){
      this.formularioCovid.value.fechamuestra==null? this.formularioCovid.value.fechamuestra='': this.formularioCovid.value.fechamuestra;
      this.formularioCovid.value.fecharecepcion==null? this.formularioCovid.value.fecharecepcion='': this.formularioCovid.value.fecharecepcion
      this.ServiceVentas.GuardarFormularioCovid(this.formularioCovid.value).then(response => {
          this.textoAlertaCovid = response.toString();
          $("#fasAlert").removeClass("fa-exclamation-triangle");
          $("#fasAlert").addClass("fa-check-circle");
          (<any>$('#AlertaCovid')).modal('show');
          this.ListarProcedimientos();

        });
    }
    else{
      this.banderaAlerta = true;
      this.textoAlertaCovid = "Para poder continuar con el proceso, por favor diligencia los campos obligatorios";
      $("#fasAlert").addClass("fa-exclamation-triangle");
      var activetab = $('#tab2').attr('href');
        $(activetab).show();
        $('#Li2').addClass('active');
        $('#Li1').removeClass('active');

        (<any>$('#AlertaCovid')).modal('show');
    }

  }
  limpiarFormCovid() {
    this.banderaAlerta = false;
    this.covid.clear();
    this.covid1.clear();
    this.covid2.clear();
    if(this.formularioCovid.value.viajero == 1){
      this.covid3.clear();
    }else if(this.formularioCovid.value.viajero == 2){
      this.covid4.clear();
    }

    if(this.VerPCR == true){
      this.covid5.clear();
      this.covid6.clear();
    }else if(this.VerAntigeno == true){
      this.covid7.clear();
      this.covid8.clear();
    }
   this.formularioCovid.reset();
    if (this.activacionModal == 1) {
      $('#Lidatosbasicos').addClass('active');
      $('#Lidatossecundarios').removeClass('active');
      $('#LidatosMuestra').removeClass('active');
      (<any>$('#FormularioCovid')).modal('hide');
      (<any>$('#AlertaCovid')).modal('hide');
      this.formularioCovid.reset();
    } else {
      (<any>$('#ModalCovidPR')).modal('hide');
      (<any>$('#AlertaCovid')).modal('hide');
    }
  }

  cerrarModal() {
    var activetab = $('#tabDatosBasicos').attr('href');
    var activetab2 = $('#tabdatossecundarios').attr('href');
    var activetab3 = $('#tabdatosMuestra').attr('href');
    $(activetab).show();
    $(activetab2).hide();
    $(activetab3).hide();
    $('#Lidatosbasicos').addClass('active');
    $('#Lidatossecundarios').removeClass('active');
    $('#LidatosMuestra').removeClass('active');
  }

  DiligenciarFormulario(bandera,idproceso,CodAthenea) {
    this.idproceso = idproceso;
    if(bandera==0){
        this.validarFormularioCovid(CodAthenea);
        var Entrega = $('#tabdatossecundarios').attr('href');
        $(Entrega).hide();
        var muestra = $('#tabdatosMuestra').attr('href');
        $(muestra).hide();
    }else{
      this.validarFormularioCovid(CodAthenea);
      var Entrega = $('#tabdatossecundarios').attr('href');
        $(Entrega).hide();
        var muestra = $('#tabdatosMuestra').attr('href');
        $(muestra).hide();
      this.ConsultarFormulario(bandera);
    }

  }

  async ConsultarFormulario(IdFormulario) {
    this.ServiceVentas.ConsultatFormularioCovid(IdFormulario).then(data => {
      this.formularioCovid.patchValue({
        IdFormulario: data[0].IdFormulario,
        nacionalidad: data[0].nacionalidad,
        eps: data[0].eps,
        regimen: data[0].regimen,
        pais: data[0].pais,
        trabajadorSalud: data[0].trabajadorSalud,
        contacto_confirmado: data[0].contacto_confirmado,
        fechasintomas: data[0].fechasintomas,
        ocupacion: data[0].ocupacion,
        cliente_remitente: data[0].cliente_remitente,
        primeraVez_Control: data[0].primeraVez_Control,
        sintomas: data[0].sintomas,
        viajero: data[0].viajero,
        ciudad_viaje: data[0].ciudad_viaje,
        pais_procedencia: data[0].pais_procedencia,
        fechallegada: data[0].fechallegada,
        condicion: data[0].condicion,
        fechamuerte: data[0].fechamuerte,
        ciudad_muestra: data[0].ciudad_muestra,
        codigo_muestra: data[0].codigo_muestra,
        fechamuestra: data[0].fechamuestra,
        fecharecepcion: data[0].fecharecepcion,
        numeroorden: data[0].numeroorden,
        tipoMuestra: data[0].tipoMuestra,
        codigoGVI: data[0].codigoGVI,
        estrategia: data[0].estrategia,
        PosSintomatico: data[0].PosSintomatico,
        Tipo_Prueba: data[0].Tipo_Prueba,
        CodAthenea: data[0].CodAthenea,
        TipoFormulario: data[0].TipoFormulario,
        cercoepodemiologico: data[0].cercoepodemiologico,
        sintomas_previos: data[0].sintomas_previos,
        IdUsuario: this.IdUsuario
      });

      this.validarFormularioCovid(data[0].CodAthenea);

      if (this.activacionModal == 1) {
        var Entrega = $('#tabdatossecundarios').attr('href');
        $(Entrega).hide();
        var muestra = $('#tabdatosMuestra').attr('href');
        $(muestra).hide();
        var basicos = $("#tabDatosBasicos").attr('href');
        $(basicos).show();
        (<any>$('#FormularioCovid')).modal('show');
      } else {
        (<any>$('#ModalCovidPR')).modal('show');
      }


    });
  }

}

