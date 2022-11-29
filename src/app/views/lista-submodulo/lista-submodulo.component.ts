import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CrearSubmoduloService } from '../../services/crearsubmodulo/crear-submodulo.service';
import { from } from 'rxjs';
import { crearSubModulo } from '../../models/CreacionModulo/Creacionmodulo.model';
import {} from '../../../../node_modules/@types/jquery';
import { crearModulo } from 'src/app/models/CreacionModulo/Creacionmodulo.model';
import { Router } from '@angular/router';
import { CrearmoduloService } from 'src/app/services/crearmodulo/crearmodulo.service';


@Component({
  selector: 'app-lista-submodulo',
  templateUrl: './lista-submodulo.component.html',
  styleUrls: ['./lista-submodulo.component.css'],
})
export class ListaSubmoduloComponent implements OnInit {
  GetSubModel: crearSubModulo[];
  DetalUser: crearSubModulo[];
  informacionEdit: crearSubModulo[];
  form: FormGroup;
  gesModel: crearModulo[];

  constructor(
    private api: CrearSubmoduloService,
    private router: Router,
    private fb: FormBuilder,
    private athu: CrearmoduloService
  ) {}
  PaginationSubModulo = 1;

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      IdModulo: [''],
      Nombre: [''],
      Descripcion: [''],
      DependeDe: [''],
      controlador: [''],
      Activo: ['1'],
    });
    this.ListarSubmodulos()  
   

  }

async ListarSubmodulos(){
  await this.api.getAllSubModule().subscribe((data) => {
    this.GetSubModel = data;
  });
}

  // primera linea para consultar los datos
 
  async ConsultarInformacion(id) {    
    await this.api.DetallAllSubModule(id).subscribe((data) => {
      this.DetalUser = data;
    });
  }
  // segunda linea para activar o inactivar los campos
 // tslint:disable-next-line: typedef
 async inactivarSubmodulo(
  id: number,
  cambiarestado: crearSubModulo,
  checkedI: boolean
) {
  cambiarestado.id = id;
  cambiarestado.Activo = checkedI === true ? 1 : 0;
  await this.api.inactivarSubmodulo(cambiarestado).subscribe((data) => {});
}
  // showMolda para mostrar los mensajes
  showModal(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
    });
    // this.ngOnInit();
  }

  // el Get f para que returne lo que se pinte

  get f() {
    return this.form.controls;
  }

  // async CargarModulos(){
  //   await this.athu.getAllModule().subscribe((data) => {
  //     this.gesModel = data;
  //   });
  // }
  // tercer linea para editar los campos que se necesitan
 
  async Editarinformacion(id, submodulo: crearSubModulo) {   
    (<any>$('#EditarSubmodulo')).modal('show'); 
    await this.api.DetallAllSubModule(id).subscribe((data) => {
      this.informacionEdit = data;     
    });

    this.form.patchValue({
      id: submodulo.id,  Nombre: submodulo.Nombre,
      Descripcion: submodulo.Descripcion,
      IdModulo: submodulo.IdModulo,DependeDe: submodulo.DependeDe,
    });
    this.gesModel=JSON.parse(sessionStorage.getItem("ArrayModulos"));
    
  }

  // quinta linea para el boto nde actualizar los datos
  Guardar() {
    this.api.UpdateModule(this.form.value).subscribe(
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
}
