import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Examenes, Planes } from 'src/app/models/Ventas/Ventas.model';
import { ExcepcionPlanServiceService } from 'src/app/services/ExcepcionPlan/excepcion-plan-service.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-excepciones-plan',
  templateUrl: './excepciones-plan.component.html',
  styleUrls: ['./excepciones-plan.component.css']
})
export class ExcepcionesPlanComponent implements OnInit {
  filterPlanes: string;
  listPlan: Planes[];
  listExamenes: Examenes[];
  filterExam: string;
  paginaExamenes: number = 1;
  formularioExepcion: FormGroup;
  submit: boolean;
  keyword = 'NombreProcedimiento';
  Examen: any;
  banderaExam: any;
  Tarifa: number;
  ArrayExamenes: Planes[];
  IdUsuario: number;
  ArrayDetalle: any;
  MostrarTablaExam: boolean = false;
  plan: any;
  ArrayExcepciones: any;
  @ViewChild('auto') auto;
  PaginationExcep = 1;
  IdExcepcion: any = 0;
  changeValue:boolean=false;
  idEdit:any;
  textButton='Cancelar';
  PaginationException=1;
  filterEx='';
  subMenuUser: any;
  ValorExamen: any;
  NombreProcedimiento: any;
  codigoProcedimiento: any;
  detalleExam: boolean = false;
  contador: number = 0;
  ValorChequeo: any;
  ArrayChequeos: Planes[];
  Verchequeo: any;
  VerExamen: any;
  DataProcedimientos: Planes[];
  Recomendacion: any;
  detalleChequeo: boolean = false;
  VerRadioOpciones: boolean;
  Chequeo: any;
  banderaChe: number = 0;
  constructor(private ExcepcionPlan: ExcepcionPlanServiceService, private PlanService: VentasService, private fb: FormBuilder, private router: Router, private ValidarPermisos: ValidarPermisos
    ,private ServiceVentas: VentasService,) { }

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.ListarPlanes();
    this.formularioExepcion = this.fb.group({
      id: [''],
      idPlan: ['', [Validators.required]],
      idusurio: this.IdUsuario,
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  get fControls() {
    return this.formularioExepcion.controls;
  }

  AbrirModalCreacion() {
    (<any>$('#CrearExcepcion')).modal('show');
    this.formularioExepcion.controls.id.setValue('');
  }

  async ListarPlanes() {
    await this.PlanService.ConsultarPlanes().then((data) => {
      this.listPlan = data;
      this.EliminarProcedimientos(0, 2)
    });
  }

  VerModalOption(bandera: any) {
    debugger
    const IdPlan = $("#selPlan").val();
    if (bandera === "1") {
      this.Verchequeo = true;
      this.VerExamen = false;
      this.cargarInformacion("1", Number(IdPlan));
    } else if (bandera === "2") {
      this.Verchequeo = false;
      this.VerExamen = true;
      this.cargarInformacion("2", Number(IdPlan));
    } else {
      this.Verchequeo = false;
      this.VerExamen = false;
    }
  }

  // ValidarProcedimiento(value) {
  //   debugger
  //   if (value == 1) {
  //     this.Verchequeo = true;
  //     this.VerExamen = false;
  //     this.cargarInformacion("1", Number(IdPlan));
  //     this.validador = "CH";
  //     this.placeholder = 'Añadir Chequeos';
  //   } else if (value == 2) {
  //     this.Verchequeo = false;
  //     this.VerExamen = true;e;
  //     this.VerVacunas=false
  //     this.cargarInformacion("2", Number(IdPlan));
  //     this.validador = "EX";
  //     this.placeholder = 'Añadir examenes';
  //   } 
  // }

    
  ConsultaDatosCh(Cheq) {
    debugger
    for (const data of this.ArrayChequeos.filter(
      (x) => x.idProcedimiento === Cheq
    )) {
      this.Recomendacion = data.Recomendaciones;
      this.ValorChequeo = data.ValorTarifa;
      this.NombreProcedimiento = data.NombreProcedimiento;
      this.codigoProcedimiento = data.idProcedimiento;
    }
    this.detalleChequeo = true;
  }

  SelectChequeo(CodChequeo) {
    debugger
    this.plan = $("#selPlan").val();
    this.Examen = CodChequeo.idProcedimiento;
    this.textButton="Cerrar"
    this.GuardarDetalleExcepcion();
  }

  LimpiarAutoCompleteChe() {
    this.auto.clear();
    this.auto.close();
    this.ValorExamen = "";
    this.NombreProcedimiento = "";
    this.codigoProcedimiento = "";
    this.detalleChequeo = false;
  }

  SelectExam(AutoExamen) {
    debugger
    this.plan = $("#selPlan").val();
    this.Examen = AutoExamen.idProcedimiento;
    this.textButton="Cerrar"
    this.GuardarDetalleExcepcion();
  }

  ConsultaDatosExamen() {
    debugger
    for (const data of this.ArrayExamenes.filter((x) => x.idProcedimiento === this.Examen.idProcedimiento)) {
      this.ValorExamen = data.ValorTarifa;
      this.NombreProcedimiento = data.NombreProcedimiento;
      this.codigoProcedimiento = data.idProcedimiento;

    }
    this.detalleExam = true;
  }

  LimpiarAutoComplete() {
    this.auto.clear();
    this.auto.close();
    this.ValorExamen = "";
    this.NombreProcedimiento = "";
    this.codigoProcedimiento = "";
    this.detalleExam = false;
  }

  async GuardarDetalleExcepcion() {
    debugger
    let IdPlan = $("#selPlan").val();
    await this.ExcepcionPlan.CrearExcepcionDetalle(0, this.Examen, 0, this.IdUsuario, 1, IdPlan).then(response => {
      Swal.fire({
        icon: 'success',
        text: response,
        showConfirmButton: true
      }).then(result=>{
        if(result.isConfirmed){
          this.MostrarTablaExam = true;
          this.LimpiarAutoComplete();
          this.CrearExecpciones();
        }
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
  }

 

  async EliminarDetalle(id,bandera,checked){
    await this.ExcepcionPlan.EliminarDatosDetalle(id,bandera,this.IdUsuario,checked.target.checked?1:0).then(response=>{
      Swal.fire({
        icon: 'success',
        text: checked.target.checked?"Activado con éxito":"Desactivado con éxito",
        showConfirmButton: true
      });
      this.ListarProcedimientos()
    })
  }

  async GuardarValor(IdRegistro, bandera) {
    let valor;
    if (bandera === 1) {
      valor = $('#ValorNuevo' + IdRegistro).val();
    } else {
      valor = $('#ValorNuevoEdit' + IdRegistro).val();
    }
    let IdPlan = $("#selPlan").val();
    await this.ExcepcionPlan.CrearExcepcionDetalle(IdRegistro, this.Examen, valor, this.IdUsuario, 1, IdPlan)
      .then(response => {
        this.ListarProcedimientos();
      }
      ).catch(err => {
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
    debugger
    await this.ExcepcionPlan.ListarExamenesDetalle(0, this.plan, this.IdExcepcion).then((data) => {
      this.ArrayDetalle = data;
      console.log(data);
      
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

  async EliminarProcedimientos(id: any, bandera: any) {
    await this.ExcepcionPlan.EliminarDatosDetalle(id, bandera, this.IdUsuario,0).then(response => {
      if (bandera === 1) {
        this.ListarProcedimientos();
      } else {
        this.listarExcepciones();
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

  Faltandatos() {
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: 'Faltan Datos Por Completar',
    });
  }

  async SeleccionarPlan() {
    this.VerRadioOpciones = false;
    debugger
    const IdPlan = $("#selPlan").val();
    for (const dato of this.listPlan.filter(x => x.Id === Number(IdPlan))) {
      this.Tarifa = dato.IdTarifa;
    }
    await this.ExcepcionPlan.ValidarPlan(Number(IdPlan)).then((response)=>{
      if(Number(response)==0){
        this.VerRadioOpciones = true;
        $("#selopciones").val("0");
        this.cargarInformacion("0", Number(IdPlan))
      }else{
        this.formularioExepcion.controls.idPlan.setValue('')
        this.ArrayExamenes=[];
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Parece que ya existe una excepción para el plan escogido',
        });
      }
    });
  }

  async cargarInformacion(bandera: any, idplan: number) {
    debugger
    let IdPlan = $("#selPlan").val();
    this.PlanService.ConsultarProcedimientosPlan(bandera, IdPlan).then((data) => {
      if (bandera === "1") {
        this.ArrayChequeos = data;
      } else if (bandera === "2") {
        this.ArrayExamenes = data
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

  activarEdicionValor(id){
    this.changeValue=!this.changeValue;
    this.idEdit=!this.changeValue?0:id;
  }

  async CrearExecpciones() {
    debugger
    this.submit = true;
    if (this.formularioExepcion.invalid) {
      return this.Faltandatos();
    } else {
      this.ExcepcionPlan.crearExcepcion(this.formularioExepcion.value).then(response => {
        let rta = response
        if(String(rta).split(';')[1]!='0'){
          this.IdExcepcion=Number(String(rta).split(';')[1])
          this.formularioExepcion.controls.id.setValue(Number(String(rta).split(';')[1]))
        }
        this.ListarProcedimientos()
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
  }

  async listarExcepciones() {
    this.ArrayExcepciones = await this.ExcepcionPlan.ListarExcepciones().then().catch(err => {
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
    })
  }

  async ConsultarInformacion(idexcepion, idPlan, bandera) {
    this.IdExcepcion = idexcepion;
    this.plan = idPlan;
    await this.ExcepcionPlan.ListarExamenesDetalle(0, idPlan, idexcepion).then((data) => {
      this.ArrayDetalle = data;
      if (bandera === 1) {
        (<any>$('#DivVerDetalle')).modal('show');
      }
      else {
        this.formularioExepcion.patchValue({
          id: idexcepion,
          idPlan: idPlan,
          idusurio: this.IdUsuario,
        });
        for (const dato of this.listPlan.filter(x => x.Id === Number(idPlan))) {
          this.Tarifa = dato.IdTarifa;
        }
        this.cargarInformacion(2, Number(idPlan));

        (<any>$('#DivEditar')).modal('show');
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

  limpiar() {
    this.VerRadioOpciones = false;
    this.Verchequeo = false;
    this.VerExamen = false;
    this.MostrarTablaExam = false;
    this.formularioExepcion = this.fb.group({
      id: [''],
      idPlan: [''],
      idusurio: this.IdUsuario,
    });
    window.location.reload();
  }

  BotonCancelar(bandera) {
    if (bandera === 1) {
      (<any>$('#CrearExcepcion')).modal('hide');
    } else {
      
    }
    this.limpiar();
  }
}

