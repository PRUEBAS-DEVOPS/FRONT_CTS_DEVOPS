import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoServ } from 'src/app/models/Ventas/Ventas.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './TipoServicio.component.html',
  styleUrls: ['./TipoServicio.component.css']
})
export class TipoServicioComponent implements OnInit {
  form: FormGroup; submit: boolean;
  LtsTipoServ: TipoServ[];
  editform: FormGroup;  paginaTarifa : number = 1; 
  TipServicerfilter: string;
  subMenuUser: any;
  idUsuario: any;
  constructor(private fb: FormBuilder, private ServiceVentas: VentasService, private ServiceGenerico: GenericoService, private router: Router,private ValidarPermisos: ValidarPermisos) { }

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.idUsuario=sessionStorage.getItem("IdUsuario");
    this.ListarTipoServ();
    this.form = this.fb.group({
      IdTipoServ: [''],
      TipoServicio: ['', [Validators.required]],
      idUsuario:this.idUsuario
    });

    this.editform = this.fb.group({
      IdTipoServ: [''],
      TipoServicio: [''],
      idUsuario:this.idUsuario
    })
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  get f() {
    return this.form.controls;
  }

  async ListarTipoServ() {
    await this.ServiceVentas.ConsultarTipoServicio(0).then((data) => {
      this.LtsTipoServ = data;      
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

  async CrearTipoServ(){
    this.submit = true;
    if (this.form.invalid) {
      return;
    } else {
      await this.ServiceVentas.CrearTipoServicio(this.form.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            title: resp.toString(),
            showConfirmButton: false,
            timer: 1500,
          });
          this.ListarTipoServ();
          this.submit = false;
        }
        );
        this.form.reset();
        (<any>$('#CrearServicio')).modal('hide');             
    }    
  }


  Editar(id:number, servicio:TipoServ){
    this.editform.patchValue({
      IdTipoServ: servicio.IdTipoServ,
      TipoServicio:servicio.TipoServicio
    });
    (<any>$('#EditarServicio')).modal('show');    
  }

  async ModificarTipo(){
    await this.ServiceVentas.CrearTipoServicio(this.editform.value).subscribe(
      (resp) => {
        Swal.fire({
          icon: 'success',
          title: resp.toString(),
          showConfirmButton: false,
          timer: 1500,
        });
        this.ListarTipoServ();
      },
      (err) => {}
    );
    (<any>$('#EditarServicio')).modal('hide');   
  }

  async InactivaTipo(id: number,cambiarestado: TipoServ, checkedI: boolean){
    cambiarestado.IdTipoServ = id;
    cambiarestado.bandera = 10;
    cambiarestado.Activo = checkedI === true ? 1 : 0;
    await this.ServiceGenerico.inactivar(cambiarestado.IdTipoServ,cambiarestado.bandera,cambiarestado.Activo,this.idUsuario
    ).then((data) => {});
  }
  async modalcrearTipServices(){
    (<any>$('#CrearServicio')).modal('show');    
  }
}
