import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Analitos, Examenes, UnidadMedida } from 'src/app/models/Ventas/Ventas.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})
export class ExamenesComponent implements OnInit {
  FormCrearExamen: FormGroup;
  FormCrearUnidadMedida: FormGroup;
  FormCrearAnalitos: FormGroup;
  editFormExamen: FormGroup;
  tipoMuestra: any;
  submit: boolean;
  gesexamen: Examenes[];
  gesAnalitos: Analitos[];
  ExamEdit: Examenes[];
  detallExam: Examenes[];
  Unimedid: UnidadMedida[];
  filterExam: string;
  IdUsuario:any;
  // containerPrincipal = true;
  // ContainerCrearExamen = false;
  paginaExamenes: number = 1;
  paginaAnalitos: number = 1;
  IdRol: any;
  subMenuUser: any;
  permisos: boolean;
  constructor(private ApiVentas: VentasService, private fb: FormBuilder, private ApiGenerico: GenericoService,private router: Router, private ValidarPermisos:ValidarPermisos) { }

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    this.IdUsuario=sessionStorage.getItem("IdUsuario");
    this.ConsultarInfoGeneral();

    this.editFormExamen = this.fb.group({
      id: [''],
      CodAthenea: [''],
      NombreExamen: [''],
      idUsuario: [''],
      descripcion: [''],
    });

    this.FormCrearExamen = this.fb.group({
      Id: [''],
      CodAthenea: ['', [Validators.required]],
      NombreExamen: ['', [Validators.required]],
      activo: ['1'],
      idUsuario: [''],
      descripcion: ['', [Validators.required]],
    });

    this.FormCrearAnalitos = this.fb.group({
      id: [''],
      IdExam: [''],
      idUnidadMed: [''],
      CodAnalito: ['', [Validators.required]],
      NombreAnalito: ['', [Validators.required]],
      ValorMin: ['', [Validators.required]],
      ValorMax: ['', [Validators.required]],



    });

    this.FormCrearUnidadMedida = this.fb.group({
      id: [''],
      Nombreunidad: ['', [Validators.required]],

    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async ConsultarInfoGeneral(){
    this.permisos= this.ValidarPermisos.validarRol(sessionStorage.getItem('IdRol'));
    this.gesexamen= await this.ApiVentas.ConsultarExamenes();
    this.tipoMuestra= await this.ApiVentas.ConsultarTipoMuestra();
    Swal.close();
  }

  async crearExamenes() {
    this.submit = true;
    if (this.FormCrearExamen.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      this.FormCrearExamen.controls.idUsuario.setValue(this.IdUsuario);
      await this.ApiVentas.CrearExamenes(this.FormCrearExamen.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            text: resp.toString(),
            showConfirmButton: true

          }).then(async result=>{
            if(result.isConfirmed){
              this.gesexamen= await this.ApiVentas.ConsultarExamenes()
            }
          })
          this.submit = false;
        },
        (err) => { }
      );
      this.FormCrearExamen.reset();
      (<any>$('#CrearExamen')).modal('hide');
      setTimeout(() => {
        this.ListarExamenes();
      }, 1000);

    }
  }
  get f() {
    return this.FormCrearExamen.controls;
  }
  async CrearUnidadMedidas() {
    this.submit = true;
    if (this.FormCrearUnidadMedida.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.ApiVentas.CrearUnidadMedida(this.FormCrearUnidadMedida.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            text: resp.toString(),
            showConfirmButton: true
          });
          this.submit = false;
        },
        (err) => { }
      );
      this.FormCrearUnidadMedida.reset();
      (<any>$('#CrearUnidaddeMedida')).modal('hide');
      (<any>$('#AgregarAnalito')).modal('show');
      setTimeout(() => {
        this.consultarUniMedida();
      }, 2000);
    }
  }
  get UM() {
    return this.FormCrearUnidadMedida.controls;
  }
  async CrearAnalitos() {
    this.submit = true;
    if (this.FormCrearAnalitos.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.ApiVentas.CrearAnalitos(this.FormCrearAnalitos.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            text: resp.toString(),
            showConfirmButton: true,
          });
          this.submit = false;
        },
        (err) => { }
      );

      this.FormCrearAnalitos.reset();
      (<any>$('#AgregarAnalito')).modal('hide');

    }


  }
  get AN() {
    return this.FormCrearAnalitos.controls;
  }



  async ActualizarExamen() {
    this.FormCrearExamen.controls.idUsuario.setValue(this.IdUsuario);
    await this.ApiVentas.CrearExamenes(
      this.editFormExamen.value
    ).subscribe(
      (resp) => {
        Swal.fire({
          icon: 'success',
          title: resp.toString(),
          showConfirmButton: true
        });
      },
      (err) => { }
    );
    (<any>$('#EditarExamen')).modal('hide');
    setTimeout(() => {
      this.ListarExamenes();
    }, 2000);
  }

  async EditarExamenes(Id, EditExam: Examenes) {
    (<any>$('#EditarExamen')).modal('show');
    await this.ApiVentas.DetallExamAll(Id).subscribe((data) => {
      this.ExamEdit = data;
    });

    this.editFormExamen.patchValue({
      id: EditExam.id,
      CodAthenea: EditExam.CodAthenea,
      NombreExamen: EditExam.NombreExamen,
    });

  }

  async ListarExamenes() {
    await this.ApiVentas.ConsultarExamenes().then((data) => {
      this.gesexamen = data;
      sessionStorage.setItem('Examen', JSON.stringify(data));
      this.consultarUniMedida();
    });
  }

  async inactivarExaman(
    Id: number,
    cambiarestado: Examenes,
    checkedI: boolean,

  ) {
    cambiarestado.id = Id;
    cambiarestado.bandera = 1;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    cambiarestado.idUsuario=this.IdUsuario
    await this.ApiGenerico.inactivar(cambiarestado.id, cambiarestado.bandera, cambiarestado.activo,cambiarestado.idUsuario).then((data) => { });
  }

  async consultarUniMedida() {
    this.ApiVentas.ConsultarUnidadMedida().subscribe((data) => {
      this.Unimedid = data;
    });
  }

  async VerDetalle(id) {
    (<any>$('#VerDetalle')).modal('show');
    await this.ApiVentas.DetallExamAll(id).subscribe((data) => {
      this.detallExam = data;
      this.ListarAnalitos(id);
    });

  }
  async ListarAnalitos(id) {
    await this.ApiVentas.DetallAnalitosExam(id).subscribe((data) => {
      this.gesAnalitos = data;
    });
  }


  modalcrearExamen() {
    (<any>$('#CrearExamen')).modal('show');

  }

  AgregarAnalito(id) {
    (<any>$('#AgregarAnalito')).modal('show');

    this.FormCrearAnalitos.patchValue({
      IdExam: id,
    });
  }

  CrearUnidadMedida(id: any) {
    if (id == "-1") {
      (<any>$('#CrearUnidaddeMedida')).modal('show');
      (<any>$('#AgregarAnalito')).modal('hide');
    }
  }

}
