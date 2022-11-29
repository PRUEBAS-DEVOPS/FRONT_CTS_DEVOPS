import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CrearsedeService } from '../../services/CrearSedes/crearsede.service';
import { from } from 'rxjs';
import { SedeViewModel } from '../../models/LoginModel/Login.model';
import { } from '../../../../node_modules/@types/jquery';
import { Router } from '@angular/router';
import {
  GenericCity,
  GenericDepartament,
} from 'src/app/models/Generic/Generic.model';
import { GenericoService } from '../../services/servicesGenerico/generico.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-crear-sedes',
  templateUrl: './crear-sedes.component.html',
  styleUrls: ['./crear-sedes.component.css'],
  providers: [CrearsedeService],
})
export class CrearSedesComponent implements OnInit {
  form: FormGroup;
  editform: FormGroup;
  submit: boolean;
  gesSede: SedeViewModel[];
  DetallSede: SedeViewModel[];
  informacionEdit: SedeViewModel[];
  Ciudad: GenericCity[];
  Departamento: GenericDepartament[];
  filterSede: string;
  IdRol: any;
  subMenuUser: any;

  constructor(
    private auth: CrearsedeService,
    private fb: FormBuilder,
    private api: CrearsedeService,
    private router: Router,
    private servic: GenericoService,  
    private ValidarPermisos:ValidarPermisos
  ) { }
  PaginationSedes = 1;
  ngOnInit(): void {
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.listarsedes();
    this.editform = this.fb.group({
      nombre: [''],
      IdCiudad: [''],
      IdDepartamento: [''],
      id: [''],
      activo: ['1'],
      CodAthenea: [''],
      CodCredibanco: [''],
    });

    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      IdCiudad: [''],
      id: [''],
      activo: ['1'],
      CodAthenea: ['', [Validators.required]],
      CodCredibanco: [''],
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async listarsedes() {
    this.api.getAllsede().then((data) => {
      this.gesSede = data;
      this.listardepartamentos();
    });
  }

  async listardepartamentos() {
    this.servic.ConsultarDepartamento().then((data) => {
      this.Departamento = data;
    });

  }

  listarCiudades(idciudad: number) {
    this.servic.ConsultarCiudades(idciudad).then((data) => {
      this.Ciudad = data;
    });
  }

  CrearSede() {
    this.submit = true;
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      this.auth.crearsede(this.form.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            text: resp.toString(),
            showConfirmButton: true
          }).then(result => {
            if (result.isConfirmed) {
              (<any>$('#CrearSede')).modal('hide');
              this.listarsedes();
            }
          })
          this.submit = false;
        },
        (err) => { }
      );
      this.form.reset();      
    }
  }

  async inactivarSede(
    id: number,
    cambiarestado: SedeViewModel,
    checkedI: boolean
  ) {
    cambiarestado.id = id;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.api.inactivarSede(cambiarestado).subscribe((data) => { });
  }

  Editarinformacion(Sedes) {
    (<any>$('#EditarSede')).modal('show');  
    this.editform.patchValue({
      id: Sedes.id,
      nombre: Sedes.nombre,
      IdCiudad: Sedes.IdCiudad,
      IdDepartamento: Sedes.IdDepartamento,
      CodAthenea: Sedes.CodAthenea,
      CodCredibanco:Sedes.CodCredibanco,
    });
    this.listarCiudades(Sedes.IdDepartamento);
  }

  async modalCrearSedes() {
    (<any>$('#CrearSede')).modal('show');
  }

  Guardar() {
    this.auth.UpdateSede(this.editform.value).subscribe(
      (resp) => {
        Swal.fire({
          icon: 'success',
          title: resp.toString(),
          showConfirmButton: true,
        }).then(result=>{
          (<any>$('#EditarSede')).modal('hide');
          this.listarsedes();
        })
      });
  }

  get f() {
    return this.form.controls;
  }
}


