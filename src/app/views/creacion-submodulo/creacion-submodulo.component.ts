import { Component, OnInit } from '@angular/core';
import { CrearmoduloService } from '../../services/crearmodulo/crearmodulo.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CrearSubmoduloService } from '../../services/crearsubmodulo/crear-submodulo.service';
import { crearModulo } from 'src/app/models/CreacionModulo/Creacionmodulo.model';
import { crearSubModulo } from '../../models/CreacionModulo/Creacionmodulo.model';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creacion-submodulo',
  templateUrl: './creacion-submodulo.component.html',
  styleUrls: ['./creacion-submodulo.component.css'],
  providers: [CrearSubmoduloService],
})
export class CreacionSubmoduloComponent implements OnInit {
  form: FormGroup;
  formEdit: FormGroup;
  submit: boolean;
  gesModel: crearModulo[];
  gesSubModel: crearSubModulo[];
  showhidepregnant: boolean;
  filterSubmodul: string;
  GetSubModel: crearSubModulo[];
  DetalUser: crearSubModulo[];
  informacionEdit: crearSubModulo[];
  PaginationSubModulo = 1;
  IdRol: any;
  subMenuUser: any;


  constructor(
    private auth: CrearSubmoduloService,
    private fb: FormBuilder,
    private api: CrearmoduloService,
    private ApiSubmodulo: CrearSubmoduloService,
    private athu: CrearmoduloService,
    private router: Router,
    private ValidarPermisos:ValidarPermisos
  ) {}

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    this.ListarSubmodulos();
    this.gesModel = JSON.parse(sessionStorage.getItem('ArrayModulos'));
    this.form = this.fb.group({
      id: [''],
      IdModulo: ['', [Validators.required]],
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.required]],
      controlador: ['', [Validators.required]],
      DependeDe: [''],
      activo: ['1'],
    });
    this.formEdit = this.fb.group({
      id: [''],
      IdModulo: [''],
      Nombre: [''],
      Descripcion: [''],
      DependeDe: [''],
      controlador: [''],
      Activo: ['1'],
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }
  //#region crear sub-modulos

  async CrearSubModulo() {
    this.submit = true;
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.auth.crearSubModulo(this.form.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            title: resp.toString(),
            showConfirmButton: false,
            timer: 1500,
          });
          this.submit = false;
        },
        (err) => {}
      );
      // tslint:disable-next-line: no-unused-expression
      this.form.reset();
      (<any>$('#CrearSubModulos')).modal('hide');
      setTimeout(() => {
        this.ListarSubmodulos();
      }, 1000);
    }
  }

  async ListarModulos() {
    await this.api.getAllModule().subscribe((data) => {
      this.gesModel = data;
    });
  }
  
  get f() {
    return this.form.controls;
  }
  showModal(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
    });
  }

  HabilitarCampo() {
    // this.form.get('IdModulo').enable();
    this.form.controls['IdModulo'].enable();
  }
  async modalCrearSubModulo() {
    (<any>$('#CrearSubModulos')).modal('show');
  }
  //#endregion

  //#region gestion sub-modulos


  async ListarSubmodulos(){
    await this.ApiSubmodulo.getAllSubModule().subscribe((data) => {
      this.GetSubModel = data;
    });
  }

  async ConsultarInformacion(id) {    
    await this.ApiSubmodulo.DetallAllSubModule(id).subscribe((data) => {
      this.DetalUser = data;
    });
  }

  async inactivarSubmodulo(id: number,cambiarestado: crearSubModulo,checkedI: boolean) {
    cambiarestado.id = id;
  cambiarestado.Activo = checkedI === true ? 1 : 0;
  await this.ApiSubmodulo.inactivarSubmodulo(cambiarestado).subscribe((data) => {});}
  
  showModals(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
    }); 
  }

  get FSUBM() {
    return this.formEdit.controls;
  }

  async Editarinformacion(id, submodulo: crearSubModulo) {   
    (<any>$('#EditarSubmodulo')).modal('show'); 
    await this.ApiSubmodulo.DetallAllSubModule(id).subscribe((data) => {
      this.informacionEdit = data;     
    });

    this.formEdit.patchValue({
      id: submodulo.id,  Nombre: submodulo.Nombre,
      Descripcion: submodulo.Descripcion,
      IdModulo: submodulo.IdModulo,DependeDe: submodulo.DependeDe,
    });
    this.gesModel=JSON.parse(sessionStorage.getItem("ArrayModulos"));
    
  }

  Guardar() {    
    this.ApiSubmodulo.UpdateModule(this.formEdit.value).subscribe(
      (resp) => {
        this.showModal(resp);
      },
      (err) => {}
    );
    (<any>$('#EditarSubmodulo')).modal('hide');      
    setTimeout(() => {
      this.ListarSubmodulos();
    }, 1000);
  }


  //#endregion
}
