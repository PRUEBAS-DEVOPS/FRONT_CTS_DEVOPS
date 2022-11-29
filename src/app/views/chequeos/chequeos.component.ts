import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { VentasService } from '../../services/VentasService/VentasService.service';
import { CategoriaCheq, Examenes } from '../../models/Ventas/Ventas.model';
import { Chequeos } from '../../models/Ventas/Ventas.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chequeos',
  templateUrl: './chequeos.component.html',
  styleUrls: ['./chequeos.component.css'],
  providers: [VentasService],
})
export class ChequeosComponent implements OnInit {
  FormChequeo: FormGroup;
  editFormChequeo: FormGroup;
  formGuardarExamen: FormGroup;
  submit: boolean;
  CategoryCheck: CategoriaCheq[];
  GesCheck: Chequeos[];
  DetallCheck: Chequeos[];
  CheckEdit: Chequeos[];
  examenes: Examenes[];
  CheckDetall: Chequeos[];
  detalleChequeo: Chequeos[];
  gesexamen: Examenes[];
  DetalleExamCheck: Examenes[];
  Tabla: string;
  IdExamenSelect: number;
  IdChequeoSelect: number;
  TablaExamenes: boolean = false;

  totalRecords: number;
  paginaChequeo: number = 1;
  paginaexamen: number = 1;
  paginadetalle: number = 1;
  paginaeditar: number = 1;
  filterCheq:string;

  @ViewChild('auto') auto;
  keyword = 'NombreExamen';
  IdRol: any;
  subMenuUser: any;
  idUsuario: any;
  permisos: boolean;
  constructor(
    private ServiceVentas: VentasService,
    private fb: FormBuilder,
    private ServiceGenerico: GenericoService, private router: Router, private ValidarPermisos: ValidarPermisos
  ) {}

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.idUsuario=sessionStorage.getItem("IdUsuario");
    this.examenes = JSON.parse(sessionStorage.getItem('Examen'));
    this.ListarChequeos();
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    this.editFormChequeo = this.fb.group({
      Id: [''],
      IdCategoria: [''],
      CodAthenea: [''],
      NombreChequeo: [''],
      Descripcion: [''],
      Recomendaciones: [''],
      Exams: this.fb.array([]),
      idUsuario:this.idUsuario
    });

    this.FormChequeo = this.fb.group({
      Id: [''],
      IdCategoria: [''],
      CodAthenea: ['', [Validators.required, Validators.minLength(2)]],
      NombreChequeo: ['', [Validators.required, Validators.minLength(2)]],
      Descripcion: ['', [Validators.required, Validators.minLength(2)]],
      Recomendaciones: ['', [Validators.required, Validators.minLength(2)]],
      activo: ['1'],
      idUsuario:this.idUsuario
    });

    this.formGuardarExamen = this.fb.group({
      Id: [],
      Exams: this.fb.array([]),
    });

    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.CargarInfoGeneral();
  }

  async CargarInfoGeneral() {
    this.permisos = this.ValidarPermisos.validarRol(sessionStorage.getItem('IdRol'));
    this.ValidarPermisos.validarPermisos(this.router.url, this.subMenuUser);

  }
  async CrearChequeo() {
    this.submit = true;
    if (this.FormChequeo.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.ServiceVentas.CrearChequeos(this.FormChequeo.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            text: resp.toString(),
            showConfirmButton: false,
            timer: 1500,
          });
          this.submit = false;
         
        },
        (err) => {}
      );
      this.FormChequeo.reset();
      (<any>$('#CrearChequeos')).modal('hide');
      setTimeout(() => {
        this.ListarChequeos();
      }, 1000);
    }
  }

  get f() {
    return this.FormChequeo.controls;
  }

  async ListarChequeos() {
    await this.ServiceVentas.ConsultarChequeos().subscribe((data) => {
      this.GesCheck = data;
      this.totalRecords = data.length;
      this.consultarCategorias();
    });
  }

  async inactivarChequeo(
    Id: number,
    cambiarestado: Chequeos,
    checkedI: boolean
  ) {
    cambiarestado.Id = Id;
    cambiarestado.bandera = 2;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.ServiceGenerico.inactivar(
      cambiarestado.Id,
      cambiarestado.bandera,
      cambiarestado.activo,this.idUsuario
    ).then((data) => {});
  }

  async EditarChequo(Id, CatChek: Chequeos) {
    (<any>$('#EditarChequeo')).modal('show');
    await this.ServiceVentas.DetallCheckAll(Id).subscribe((data) => {
      this.CheckEdit = data;
      this.ListarExamenesChequeo(Id);
    });
    this.editFormChequeo.patchValue({
      Id: CatChek.Id,
      IdCategoria: CatChek.IdCategoria,
      CodAthenea: CatChek.CodAthenea,
      NombreChequeo: CatChek.NombreChequeo,
      Descripcion: CatChek.Descripcion,
      Recomendaciones: CatChek.Recomendaciones,
    });
  }

  // consultamos el documento del paciente para la venta
  async consultarCategorias() {
    await this.ServiceVentas.ConsultarCategoriaChequeos().subscribe((data) => {
      this.CategoryCheck = data;
      this.Cancelar();
    });
  }

  // async ListarExamenes() {
  //   await this.ServiceVentas.ConsultarExamenes().subscribe((data) => {
  //     this.gesexamen = data;
  //   });
  // }

  async ActualizarChequeo() {
    await this.ServiceVentas.CrearChequeos(
      this.editFormChequeo.value
    ).subscribe(
      (resp) => {
        Swal.fire({
          icon: 'success',
          title: resp.toString(),
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {}
    );
    (<any>$('#EditarChequeo')).modal('hide');
    setTimeout(() => {
      this.ListarChequeos();
    }, 1000);
  }

  LimpiarAutoComplete() {
    this.auto.clear();
    this.auto.close();
  }

  async AgregarExamen(idCh) {
    this.IdChequeoSelect = idCh;
    this.ListarExamenesChequeo(idCh);
    (<any>$('#AgregarExamen')).modal('show');
  }

  async ListarExamenesChequeo(Id) {
    await this.ServiceVentas.ConsultarExamChequeo(Id, 0).subscribe((data) => {
      if (data.length > 0) {
        this.DetalleExamCheck = data;
        this.TablaExamenes = true;
      } else {
        this.TablaExamenes = false;
      }
    });
  }

  SelectExam(AutoExamen) {
    this.IdExamenSelect = AutoExamen.id;
  }

  async GuardarExamenTemp() {
    await this.ServiceVentas.CrearExamenesChequeo(
      this.IdChequeoSelect,
      this.IdExamenSelect,
      0
    ).subscribe(
      (resp) => {
        if (resp != '1') {
          Swal.fire({
            icon: 'error',
            title: 'El examen seleccionado ya se encuentra asociado',
            showConfirmButton: false,
            timer: 2500,
          });
          this.IdChequeoSelect = 0;
          this.IdExamenSelect = 0;
          this.LimpiarAutoComplete();
        } else {
          this.TablaExamenes = true;
          this.auto.clear();
          this.ListarExamenesChequeo(this.IdChequeoSelect);
        }
      },
      (err) => {}
    );
  }

  async GuardarGeneralExamen() {
    if (this.IdChequeoSelect != 0 && this.IdExamenSelect != 0) {
      await this.ServiceVentas.CrearExamenesChequeo(
        this.IdChequeoSelect,
        this.IdExamenSelect,
        1
      ).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            title: resp.toString(),
            showConfirmButton: false,
            timer: 2500,
          });
          (<any>$('#AgregarExamen')).modal('hide');
          this.IdChequeoSelect = 0;
          this.IdExamenSelect = 0;
          this.LimpiarAutoComplete();
        },
        (err) => {}
      );
    } else {
      (<any>$('#AgregarExamen')).modal('hide');
    }
  }

  async Cancelar() {
    await this.ServiceVentas.EliminarTemporales(0, 0).subscribe(
      (<any>$('#AgregarExamen')).modal('hide')
    );
  }

  async EliminarExamen(id) {
    await this.ServiceVentas.EliminarTemporales(1, id).subscribe((resp) => {
      this.ListarExamenesChequeo(this.IdChequeoSelect);
    });
  }

  async modalcrearChequeo(){
    (<any>$('#CrearChequeos')).modal('show');
  }
}
