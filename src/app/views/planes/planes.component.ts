import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { VentasService } from '../../services/VentasService/VentasService.service';
import { from } from 'rxjs';
import { Planes, Clientes, Tarifas } from '../../models/Ventas/Ventas.model';
import { Router } from '@angular/router';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css'],
  providers: [VentasService],
})
export class PlanesComponent implements OnInit {
  FormPlan: FormGroup;
  editFormPlanes: FormGroup;
  submit: boolean;
  listPlan: Planes[];
  EditPlans: Planes[];
  GetClient: Clientes[];
  LtsTarifas:Tarifas[];
  paginaPlan: number = 1;
  filterPlan:string;
  IdRol: any;
  subMenuUser: any;
  idUsuario: any;


  constructor(
    private ServiceVentas: VentasService,
    private fb: FormBuilder,
    private ServiceGenerico: GenericoService,private router: Router,
    private ValidarPermisos: ValidarPermisos
  ) {}

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.idUsuario=sessionStorage.getItem("IdUsuario");
    this.ListarPlanes();
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    this.FormPlan = this.fb.group({
      Id: [''],
      IdCliente: ['', [Validators.required]],
      IdTarifa: ['', [Validators.required]],
      CodPlan: ['', [Validators.required]],
      NombrePlan: ['', [Validators.required]],
      idUsuario:this.idUsuario
    });
    this.editFormPlanes = this.fb.group({
      Id: [''],
      IdCliente: [''],
      CodPlan: [''],
      NombrePlan: [''],
      IdTarifa: [''],
      idUsuario:this.idUsuario
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }



  async CrearPlan() {
    this.submit = true;
    if (this.FormPlan.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.ServiceVentas.CrearPlanes(this.FormPlan.value).subscribe(
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
      this.FormPlan.reset();
      (<any>$('#CrearPlanes')).modal('hide'); 
      setTimeout(() => {
        this.ListarPlanes();
      }, 1000);
    }
  }
  get f() {
    return this.FormPlan.controls;
  }

  async ListarClientes() {
    await this.ServiceVentas.ConsultarClientes().then((data) => {
      this.GetClient = data;
      this.ListarTarifas();
    });
  }

  async ListarPlanes() {
    await this.ServiceVentas.ConsultarPlanes().then((data) => {
      this.listPlan = data;
      this.ListarClientes();
    });
  }
async ListarTarifas(){
  await this.ServiceVentas.ConsultarTarifas(0).subscribe((data)=>{
    this.LtsTarifas=data;
  })
}
  async inactivarPlanes(
    id: number,
    cambiarestado: Clientes,
    checkedI: boolean
  ) {
    cambiarestado.id = id;
    cambiarestado.bandera = 8;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.ServiceGenerico.inactivar(
      cambiarestado.id,
      cambiarestado.bandera,
      cambiarestado.activo,this.idUsuario,
    ).then((data) => {});
  }

  async EditarPlanes(Id, Plans: Planes) {    
    (<any>$('#EdiarPlanes')).modal('show');
    await this.ServiceVentas.DetallPlans(Id).subscribe((data) => {
      this.EditPlans = data;      
    });

    this.editFormPlanes.patchValue({
      Id: Id,
      IdCliente: Plans.IdCliente,
      CodPlan: Plans.CodPlan,
      NombrePlan: Plans.NombrePlan,
      IdTarifa:Plans.IdTarifa
    });
   
  }

  async Actualizar() {
    await this.ServiceVentas.CrearPlanes(this.editFormPlanes.value).subscribe(
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
    (<any>$('#EdiarPlanes')).modal('hide');   
    setTimeout(() => {
      this.ListarPlanes();
    }, 1000);
  }

  async modalcrearCliente(){
    (<any>$('#CrearPlanes')).modal('show');   
  }
}
