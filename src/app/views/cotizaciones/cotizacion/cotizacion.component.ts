import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import {
  GenericTipoDoc,
} from 'src/app/models/Generic/Generic.model';
import { CategoriaCheq, Planes } from 'src/app/models/Ventas/Ventas.model';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { GenericoService } from '../../../services/servicesGenerico/generico.service';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
})
export class CotizacionComponent implements OnInit {
  DataPlanes: Planes[];
  Asesor: number;
  Fechacoti: any;
  datosusuario: any;
  crearcotizcion: FormGroup;
  DataCategoria: CategoriaCheq[];
  DataProcedimientos: Planes[];
  DataProcedimientosF: Planes[];
  DataProcedimientosE: Planes[];
  Recomendacion: any;
  files: any[] = [];
  quantity: number = 0;
  ExamChequeo: any;
  Verchequeo: any;
  VerExamen: any;
  contador: number = 0;
  TablaProcedimientos = false;
  TotalFinal: any;
  submit: boolean;
  ContactoVitalea: [''];
  GesDocument: GenericTipoDoc[];
  CotizacionWhatsapp: [''];
  keyword = 'idProcedimiento';//,'NombreProcedimiento'
  ValorChequeo: any;
  ArrayProcedimientos: any[];
  ArrayExamenes: Planes[];
  ArrayChequeos: Planes[];
  Examen: any;
  banderaExam: number = 0;
  Chequeo: any;
  banderaChe: number = 0;
  Tarifa: number;
  IdUsuario: number;
  idplan:number;
  @ViewChild('auto') auto;
  @ViewChild('autoPlan') autoPlan;
  ValorExamen:any;
  NombreProcedimiento:any;
  codigoProcedimiento:any;
  detalleExam:boolean=false;
  detalleChequeo:boolean=false;
  idCoti:number;
  correoCotizacion:any;
  keywordPlan = 'Concatenado';
  disabled: boolean = false;
  VerRadioOpciones: boolean;
  descripcion: any;
  CodAthenea: any;
  NombreExamen: any;
  contactoVitalea: number;
  contactoWP: number;
  subMenuUser: any;

  constructor(
    private ServiceVentas: VentasService,
    private Fb: FormBuilder,
    private servicesCotizacion: CotizacionService,
    private ServiceGenerico: GenericoService, private router: Router,private ValidarPermisos:ValidarPermisos
  ) {}

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.consultarPlanes();
    this.datosusuario = {
      Nombres: '-',
      Apellidos: '-',
      Documento: '-',
      tipodocumento: '-',
      Correo: '-',
      Telefono: '-',
      Direccion: '-',
    };
    this.Asesor = JSON.parse(sessionStorage.getItem('IdUsuario'));
    this.Fechacoti = JSON.parse(sessionStorage.getItem('fechaCotizacion'));
    this.crearcotizcion = this.Fb.group({
      id: [''],
      Documento: [''],
      tipodocumento: [''],
      Nombres: ['', [Validators.required]],
      Apellidos: ['', [Validators.required]],
      Telefono: ['', [Validators.required]],
      Correo: ['', [Validators.required]],
      Direccion: ['', [Validators.required]],
      Observaciones: [''],
      ContactoVitalea: [''],
      CotizacionWhatsapp: [''],
      plan: [''],
      Examenes: this.Fb.array([]),
      Chequeos: this.Fb.array([]),
      IdUsuario: this.Asesor,
      Cantidades: this.Fb.array([]),
    });
    this.CargarInfoGeneral();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url,this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  get f() {
    return this.crearcotizcion.controls;
  }

  async consultarPlanes() {
    this.ServiceVentas.ConsultarPlanes().then((data) => {
      this.DataPlanes = data;
      this.consultarCategoriaChequeos();
    });
  }

  async CargarInfoGeneral() {

    this.GesDocument = await this.ServiceGenerico.ConsultarTipoDoc();

  }

  async consultarCategoriaChequeos() {
    this.ServiceVentas.ConsultarCategoriaChequeos().subscribe((data) => {
      this.DataCategoria = data;
      this.EliminarProcedimientosVentas(0, 2)
    });
  }

  siguiente(bandera) {
    $('.tab-pane').hide();
    if (bandera == 2) {
      var activetab = $('#tab2').attr('href');
      $(activetab).show();
      $('#Li2').addClass('active');
      $('#Li1').removeClass('active');
      sessionStorage.setItem('UserDatos', JSON.stringify(this.crearcotizcion.value));
      this.datosusuario = '';
      this.datosusuario = JSON.parse(sessionStorage.getItem('UserDatos'));
      const strTipoDoc = this.GesDocument.filter(item => item.id == Number(this.datosusuario.tipodocumento));
      this.datosusuario.strTipoDoc = strTipoDoc[0].tipodocumento;
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
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        var activetab = $('#tab3').attr('href');
        $(activetab).show();
        $('#Li3').addClass('active');
        $('#Li2').removeClass('active');
      }
    } else {
      var activetab = $('#tab4').attr('href');
      $(activetab).show();
      $('#Li4').addClass('active');
      $('#Li3').removeClass('active');
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
      sessionStorage.removeItem('UserDatos');
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

  async cargarInformacion(bandera: number) {
    const idplan = $('#selPlan').val()
    this.ServiceVentas.ConsultarProcedimientosPlan(bandera, this.idplan).then((data) => {
      if (bandera === 1) {
        this.Recomendacion = "";
        this.ValorChequeo = "";
        this.DataProcedimientos = data;
      } else {
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
   }

  VerProcedimientos() {
    const planSelec = $('#selPlan').val()
    if (planSelec != '') {
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
    for (const dato of this.DataPlanes.filter(x => x.Id === Number(this.idplan))) {
      this.Tarifa = dato.IdTarifa;
    }
    if (this.idplan == 0) {
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
        this.disabled=true;
        this.VerRadioOpciones = true;
        $("#selopciones").val("2");
        this.cargarInformacion(2);
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
          this.disabled=false;
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
    for (const data of this.DataProcedimientos.filter((x) => x.idProcedimiento === Cheq)) {
      this.Recomendacion = data.Recomendaciones;
      this.ValorChequeo = data.ValorTarifa;
      this.NombreProcedimiento=data.NombreProcedimiento;
      this.codigoProcedimiento=data.idProcedimiento;
    }
    this.detalleChequeo=true;
  }

  SelectChequeo(CodChequeo, bandera) {
    this.Chequeo = CodChequeo;
    this.banderaChe = bandera;
    this.AgregarChequeo();
  }

  async AgregarChequeo() {
    await this.ServiceVentas.GuardarProcedimientos(this.Chequeo, this.banderaChe, this.Tarifa, this.IdUsuario).then(response => {
      Swal.fire({
        icon: 'info',
        title: response.toString(),
        showConfirmButton: true
      });
      this.contador = this.contador + 1;
      this.ListarProcedimientos()
      this.GuardarTemProcedimientos(this.Chequeo, true, this.banderaChe);
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

  LimpiarChequeos() {
    $("#SelCat").val("");
    $("#SelChe").val("");
    this.Recomendacion = "";
    this.ValorChequeo = "";
    $("#radioCheq").prop("checked", false);
    this.NombreProcedimiento="";
    this.codigoProcedimiento="";
    this.detalleChequeo=false;
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
      this.NombreProcedimiento=data.NombreProcedimiento;
      this.codigoProcedimiento=data.idProcedimiento;
    }
    this.detalleExam=true;
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
    this.ValorExamen="";
    this.NombreProcedimiento="";
    this.codigoProcedimiento="";
    this.detalleExam=false;
  }

  async ListarProcedimientos() {
    await this.ServiceVentas.ListarProcedimientos(this.IdUsuario,this.idplan).then((data) => {
      this.ArrayProcedimientos = data;
      var total = 0;
      for (const info of data) {
        var valorcalculado = info.Total_Cantidad;
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

  EliminarProcedimientosVentas(id: any, bandera: any) {
    this.ServiceVentas.EliminarProcedimientos(id, bandera, this.IdUsuario).then(response => {
      if (bandera == 1) {
        if (this.banderaChe != 0) {
          this.GuardarTemProcedimientos(this.Chequeo, false, this.banderaChe);
        } else if (this.banderaExam != 0) {
          this.GuardarTemProcedimientos(this.Examen.idProcedimiento, false, this.banderaExam);
        }
        this.contador = this.contador - 1;
        if (this.contador == 0) {
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

  GuardarTemProcedimientos(id: string, isChecked: boolean, bandera: number) {
    const arrayCh = <FormArray>this.crearcotizcion.controls.Chequeos;
    const arrayEx = <FormArray>this.crearcotizcion.controls.Examenes;
    const arrayCantidad= <FormArray>this.crearcotizcion.controls.Cantidades;


    if (bandera == 1) {
      if (isChecked) {
        arrayCh.push(new FormControl(id));
        //arrayCantidad.push(new FormControl(cantidad));
      } else {
        let index = arrayCh.controls.findIndex((x) => x.value == [id]);
        arrayCh.removeAt(index);
        //arrayCantidad.removeAt(index);
      }
    } else {
      if (isChecked) {
        arrayEx.push(new FormControl(id));
        //arrayCantidad.push(new FormControl(cantidad));
      } else {
        let index = arrayEx.controls.findIndex((x) => x.value == [id]);
        arrayEx.removeAt(index);
        //arrayCantidad.removeAt(index);
      }
    }
  }

  async CrearCotizacion() {
    this.crearcotizcion.controls.ContactoVitalea.setValue(this.contactoVitalea);
    this.crearcotizcion.controls.CotizacionWhatsapp.setValue(this.contactoWP );
    this.submit = true;
    this.crearcotizcion.value.plan=this.idplan;
    if (this.crearcotizcion.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
        showConfirmButton: true,
      });
      return;
    } else {
      await this.servicesCotizacion.CrearCotizacion(this.crearcotizcion.value).subscribe((resp) => {
            const IdCotizacion = resp.toString().split(',')[1];
            this.idCoti=Number(IdCotizacion);
            Swal.fire({
              icon: 'success',
              text: resp.toString().split(',')[0],
              showConfirmButton: true,
            }).then(result=>{
              //this.EnviarCotizacion();
              this.ActualizarCantidadCotizacion();
            });
            this.submit = false;
          },
          (err) => {}
        );
      //this.Limpiar();
      sessionStorage.removeItem('UserDatos');
    }
  }

  async ActualizarCantidadCotizacion(){
    await this.servicesCotizacion.actualizarCantidadCotizacion(this.idCoti,this.crearcotizcion.value.Cantidades).then(response=>{
      this.EnviarCotizacion();
    });
  }

  asignarEmail(email){
    this.correoCotizacion=email;
  }

  async EnviarCotizacion(){
    await this.servicesCotizacion.EnviarEmailCotizacion(this.correoCotizacion,this.idCoti).then(response=>{
      Swal.fire({
        icon: 'success',
        text: response.toString(),
        showConfirmButton: true,
      }).then(result=>{
        if(result.isConfirmed){
          this.Limpiar();
        }
      })
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

  contactvitalea(valor) {
    if (valor ==1) {
      this.contactoVitalea=1;
    }else{
      this.contactoVitalea=0;
    }
  }

  contactowhatsapp(valor) {
    if (valor == 1) {
      this.contactoWP = 1;
    }else{
      this.contactoWP = 0;
    }
  }


  Limpiar() {
    this.TotalFinal = 0;
    this.contador = 0;
    this.TablaProcedimientos = false;
    $('#TableProc tbody').children().remove();
    sessionStorage.removeItem('UserDatos');
    sessionStorage.removeItem('IdExamCheck');
    sessionStorage.removeItem('Idpaciente');
    sessionStorage.removeItem('Chequeos');
    sessionStorage.removeItem('Examenes');

    this.crearcotizcion = this.Fb.group({
      id: [''],
      Nombres: [''],
      Apellidos: [''],
      Documento: [''],
      tipodocumento: [''],
      Telefono: [''],
      Correo: [''],
      Direccion: [''],
      Observaciones: [''],
      ContactoVitalea: [''],
      plan: [''],
      ExamsVenta: this.Fb.array([]),
      CheckupsVenta: this.Fb.array([]),
      CotizacionWhatsapp: [''],
    });
    var activetab = $('#tab1').attr('href');
    var activetab2 = $('#tab2').attr('href');
    var activetab3 = $('#tab3').attr('href');
    var activetab4 = $('#tab4').attr('href');
    $(activetab).show();
    $(activetab2).hide();
    $(activetab3).hide();
    $(activetab4).hide();

    var categorias = document.getElementById('SelCat') as HTMLInputElement;
    var chequeo = document.getElementById('SelChe') as HTMLInputElement;
    categorias.value = '';
    chequeo.value = '';
    this.autoPlan.clear();
    this.autoPlan.close();
    this.VerRadioOpciones=false;

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
      $("#TxtCorreo").val('');
    }
  }


  async CalcularValorCantidad(idProcedimiento) {
    let suma = 0;
    let sumaFinal = 0;
    let total = 0;
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

     const arrayCantidad= <FormArray>this.crearcotizcion.controls.Cantidades;
     arrayCantidad.push(new FormControl(quantity));
    await this.servicesCotizacion.actualizarCantidad(idProcedimiento, quantity, suma_row).then(response => {
      this.ListarProcedimientos();
    });
  }

  detalleExamen(procedimientos, Examenes){
    this.descripcion=procedimientos.descripcion;
    this.CodAthenea=procedimientos.CodAthenea;
    this.NombreExamen=procedimientos.NombreExamen;
    (<any>$('#detalleExamenPaciente')).modal('show');
  }
}
