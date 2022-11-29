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
import { Clientes } from '../../models/Ventas/Ventas.model';
import { Router } from '@angular/router';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [VentasService],
})
export class ClientesComponent implements OnInit {
  
  FormClientes: FormGroup;
  editFormClientes: FormGroup;
  submit: boolean;
  ListClient: Clientes[];
  EditCustom: Clientes[];
  filterclien:string;
  paginalistarCliente: number = 1;
  IdRol: any;
  idUsuario:any;
  subMenuUser: any;
  
  constructor(
    private ApiVentas: VentasService,
    private fb: FormBuilder,
    private ApiGenerico: GenericoService,
    private router: Router,private ValidarPermisos:ValidarPermisos) { }

  ngOnInit(): void {
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.idUsuario=sessionStorage.getItem("IdUsuario");
    this.ListarClientes();
    this.FormClientes = this.fb.group({
      id: [''],
      razonsocial: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      nit: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      idUsuario:this.idUsuario
    });
    this.editFormClientes = this.fb.group({
      id: [''],
      razonsocial: [''],
      correo: [''],
      nit: [''],
      telefono: [''],
      direccion: [''],
      idUsuario:this.idUsuario
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
      this.Validar(this.router.url,this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }


  async CrearClientes() {
    this.submit = true;
    if (this.FormClientes.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      await this.ApiVentas.CrearClientes(
        this.FormClientes.value
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
      this.FormClientes.reset();
      (<any>$('#Crearclientes')).modal('hide');      
      setTimeout(() => {
        this.ListarClientes();
      }, 1000);
    }
  }
    get f() {
    return this.FormClientes.controls;
  }

  async ListarClientes() {
    await this.ApiVentas.ConsultarClientes().then((data) => {
      this.ListClient = data;
  });
  }
  
  async inactivarCliente(
    id: number,
    cambiarestado: Clientes,
    checkedI: boolean
  ) {
    cambiarestado.id = id;
    cambiarestado.bandera = 7;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.ApiGenerico.inactivar(cambiarestado.id, cambiarestado.bandera, cambiarestado.activo,this.idUsuario).then((data) => {});
  }

  async Editarcategoria(Id, Custom: Clientes ) {
    (<any>$('#EdiarClientes')).modal('show');    
    await this.ApiVentas.DetallCustomers(Id).subscribe((data) => {
      this.EditCustom = data;
    });
    this.editFormClientes.patchValue({  
      id: Custom.id,
      razonsocial: Custom.razonsocial,
      correo: Custom.correo,
      nit: Custom.nit,
      telefono: Custom.telefono,
      direccion: Custom.direccion,
    });
  }

  async Actualizar() {
    await this.ApiVentas.CrearClientes(
      this.editFormClientes.value
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
    (<any>$('#EdiarClientes')).modal('hide');
    setTimeout(() => {
      this.ListarClientes();
    }, 1000);
  }

  async modalcrearCliente(){
    (<any>$('#Crearclientes')).modal('show');
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

}
