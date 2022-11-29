import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CrearmoduloService } from '../../services/crearmodulo/crearmodulo.service';
import { from } from 'rxjs';
import { crearModulo } from '../../models/CreacionModulo/Creacionmodulo.model';
import {} from '../../../../node_modules/@types/jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creacion-modulo',
  templateUrl: './creacion-modulo.component.html',
  styleUrls: ['./creacion-modulo.component.css'],
  providers: [CrearmoduloService],
})
export class CreacionModuloComponent implements OnInit {
  form: FormGroup;
  editform: FormGroup;
  submit: boolean;
  gesModel: crearModulo[];
  DetalUser: crearModulo[];
  informacionEdit: crearModulo[];
  filterModul: string;
  IdRol: any;

  constructor(
    private auth: CrearmoduloService,
    private fb: FormBuilder,
    private api: CrearmoduloService,
    private router: Router
  ) {}
  paginaModulo = 1;

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    this.ListarModulos();
    this.editform = this.fb.group({
      modulo: [''],
      descripcion: [''],
      id: [''],
      activo: ['1'],
    });
    this.form = this.fb.group({
      modulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      id: [''],
      activo: ['1'],
    });
  }

  async CrearModulos() {
    this.submit = true;
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.auth.crearmodulo(this.form.value).subscribe(
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
      this.form.reset();
      (<any>$('#CrearModulos')).modal('hide');
      setTimeout(() => {
        this.ListarModulos();
      }, 1000);
    }
  }

  get f() {
    return this.form.controls;
  }

  async ListarModulos() {
    await this.api.getAllModule().subscribe((data) => {
      this.gesModel = data;
      sessionStorage.setItem('ArrayModulos', JSON.stringify(data));
    });
  }

  // tslint:disable-next-line: typedef
  async inactivarModulo(
    id: number,
    cambiarestado: crearModulo,
    checkedI: boolean
  ) {
    cambiarestado.id = id;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.api.inactivarModulo(cambiarestado).subscribe((data) => {});
  }

  async ConsultarInformacion(id) {
    await this.api.DetallUserAll(id).subscribe((data) => {
      this.DetalUser = data;
    });
  }

  async Editarinformacion(id, Module: crearModulo) {
    (<any>$('#EditarModulos')).modal('show');
    await this.api.DetallUserAll(id).subscribe((data) => {
      this.informacionEdit = data;
    });
    this.editform.patchValue({
      id: Module.id,
      modulo: Module.modulo,
      descripcion: Module.descripcion,
    });
  }

  async Guardar() {
    await this.auth.UpdateModule(this.editform.value).subscribe(
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
    (<any>$('#EditarModulos')).modal('hide');
    setTimeout(() => {
      this.ListarModulos();
    }, 1000);
  }

  async modalCrearModulo(){
    (<any>$('#CrearModulos')).modal('show');
  }

}
