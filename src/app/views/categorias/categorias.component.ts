import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { VentasService } from '../../services/VentasService/VentasService.service';
import { CategoriaCheq } from '../../models/Ventas/Ventas.model';
import { Router } from '@angular/router';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [VentasService],
})
export class CategoriasComponent implements OnInit {
  FormCategoria: FormGroup;
  editFormCategoria: FormGroup;
  submit: boolean;
  gesCategory: CategoriaCheq[];
  DetallCategory: CategoriaCheq[];
  CategoryEdit: CategoriaCheq[];
  Categoriafilter: string;
  IdRol: any;
  subMenuUser: any;
  idUsuario: any;

  constructor(private ServiceVentas: VentasService,private fb: FormBuilder, private ApiGenerico: GenericoService, private router: Router, private ValidarPermisos: ValidarPermisos) {}
  paginaCategoria = 1;

  ngOnInit(): void {
     sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.idUsuario=sessionStorage.getItem("IdUsuario");
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    this.ListarCategorias();
    this.editFormCategoria = this.fb.group({
      id: [''],
      Nombre: [''],
      descripcion: [''],
      activo: ['1'],
      idUsuario:this.idUsuario
    });
    this.FormCategoria = this.fb.group({
      id: [''],
      Nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      activo: ['1'],
      idUsuario:this.idUsuario
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta, permisos) {
    this.ValidarPermisos.validarPermisos(ruta, permisos);
  }

  async CrearCategorias() {
    this.submit = true;
    if (this.FormCategoria.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.ServiceVentas.CrearCategoriaChequeos(
        this.FormCategoria.value
      ).subscribe(
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
      this.FormCategoria.reset();
      (<any>$('#crearCategorias')).modal('hide');
      setTimeout(() => {
        this.ListarCategorias();
      }, 1000);
     
    }
  }

  get f() {
    return this.FormCategoria.controls;
  }

  async ListarCategorias() {
    await this.ServiceVentas.ConsultarCategoriaChequeos().subscribe((data) => {
      this.gesCategory = data;
  });
  }

  async inactivarCategoria(
    Id: number,
    cambiarestado: CategoriaCheq,
    checkedI: boolean
  ) {
    cambiarestado.Id = Id;
    cambiarestado.bandera = 3;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.ApiGenerico.inactivar(cambiarestado.Id, cambiarestado.bandera, cambiarestado.activo,this.idUsuario).then((data) => {});
  }

 

  async Editarcategoria(Id, Catego: CategoriaCheq) {
    (<any>$('#EditarCategorias')).modal('show');
    await this.ServiceVentas.DetallCategoryAll(Id).subscribe((data) => {
      this.CategoryEdit = data;
    });
    this.editFormCategoria.patchValue({
      id: Catego.Id,
      Nombre: Catego.Nombre,
      descripcion: Catego.descripcion,
    });
  }

  async Guardar() {
    await this.ServiceVentas.CrearCategoriaChequeos(
      this.editFormCategoria.value
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
    (<any>$('#EditarCategorias')).modal('hide');
    setTimeout(() => {
      this.ListarCategorias();
    }, 1000);   
  }

async modalcrearCategoria(){
  (<any>$('#crearCategorias')).modal('show');
}

}
