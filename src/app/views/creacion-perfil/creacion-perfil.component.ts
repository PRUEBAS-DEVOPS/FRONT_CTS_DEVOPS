import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CrearPerfil } from '../../models/CreacionPerfil/CrearPerfil.model';
import { from } from 'rxjs';
import { CrearperfilService } from '../../services/CrearPerfil/crearperfil.service';
import { PerfilesAccesoService } from '../../services/AccesoPerfiles/perfiles-acceso.service';
import { } from '../../../../node_modules/@types/jquery';
import {
  MenuViewModel,
  UsuarioModel,
} from 'src/app/models/LoginModel/Login.model';
import { AuthService } from 'src/app/services/login/auth.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creacion-perfil',
  templateUrl: './creacion-perfil.component.html',
  styleUrls: ['./creacion-perfil.component.css'],
  providers: [CrearperfilService],
})
export class CreacionPerfilComponent implements OnInit {
  form: FormGroup;
  editform: FormGroup;
  submit: boolean;
  gesPerfil: CrearPerfil[];
  DetallPerfil: CrearPerfil[];
  informacionEdit: CrearPerfil[];
  menu: MenuViewModel[];
  subMenu: MenuViewModel[];
  menuPerfil: MenuViewModel[];
  subMenuPerfil: MenuViewModel[];
  perfiles: any;
  filterPerf: string;
  IdRol: any;
  subMenuUser: any;

  constructor(
    private auth: CrearperfilService,
    private fb: FormBuilder,
    private api: CrearperfilService,
    private router: Router,
    private apiPerf: PerfilesAccesoService,
    private ServiceMenu: AuthService, private ValidarPermisos: ValidarPermisos
  ) { }
  PaginationPerfil = 1;

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.menuPerfil = JSON.parse(sessionStorage.getItem('menu'));
    this.subMenuPerfil = JSON.parse(sessionStorage.getItem('submenu'));
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));
    // se crea otro envio de informacion solo para editar
    this.editform = this.fb.group({
      id: [''],
      nombre: [''],
      descripcion: [''],
      activo: ['1'],
    });
    // se crea otro envio de informacion solo para crear
    this.form = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      activo: ['1'],
      ArrayModulos: this.fb.array([]),
    });
    this.ListarPerfiles();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta, permisos) {
    this.ValidarPermisos.validarPermisos(ruta, permisos);
  }

  async ListarPerfiles() {
    this.api.getAllPerfil().subscribe((data) => {
      this.gesPerfil = data;
      sessionStorage.setItem('ArrayPerfiles', JSON.stringify(data));
      this.ConsultarMenu();
    });
  }

  // Creamos Los Perfiles que Necesitemos

  async CrearPerfil() {
    this.submit = true;
    if (this.form.invalid) {
      return;
    } else {
      await this.auth.crearPerfil(this.form.value).subscribe(
        (resp) => {
          this.showModal(resp);
          this.submit = false;
        },
        (err) => { }
      );
      // tslint:disable-next-line: no-unused-expression
      this.form.reset();
      (<any>$('#CrearPerfiles')).modal('hide');
      setTimeout(() => {
        this.ListarPerfiles();
      }, 1000);
    }
  }
  // El Get f sirve para retornar los valores del formulario
  get f() {
    return this.form.controls;
  }

  async inactivarPerfil(
    id: number,
    cambiarestado: CrearPerfil,
    checkedI: boolean
  ) {
    cambiarestado.id = id;
    cambiarestado.activo = checkedI === true ? "1" : "0";
    await this.api.inactivarPerfil(cambiarestado).subscribe((data) => { });
  }

  // Consultamos la informacion de los perfiles

  async ConsultarInformacion(id) {
    await this.api.DetallPerfilAll(id).subscribe((data) => {
      this.DetallPerfil = data;
    });
  }
  // Editamos la informacion del perfil

  async Editarinformacion(id, Profile: CrearPerfil) {
    (<any>$('#editarPefiles')).modal('show');
    await this.api.DetallPerfilAll(id).subscribe((data) => {
      this.informacionEdit = data;
    });
    // Enviamos las variables que tenemos que editar
    this.editform.patchValue({
      id: Profile.id,
      nombre: Profile.nombre,
      descripcion: Profile.descripcion,
    });
  }
  // El boton de Guardar para Acutalizar el Perfil

  async Guardar() {
    await this.auth.UpdatePerfil(this.editform.value).subscribe(
      (resp) => {
        this.showModal(resp);
      },
      (err) => { }
    );
    (<any>$('#editarPefiles')).modal('hide');
    setTimeout(() => {
      this.ListarPerfiles();
    }, 1000);
  }

  // El ShowModal De los SwallAlert no sirve para pintar todas las alertas que necesitemos

  showModal(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
    });
  }

  async ConsultarMenu() {
    await this.ServiceMenu.ConsultarMenu().then(
      (resp) => {
        this.menu = resp.filter((x) => x.ckeckprincipal === 1);
        this.subMenu = resp.filter((x) => x.ckeckprincipal === 2);
      },
      (err) => { }
    );
  }

  AgregarPermisos(IdPerfil: number) {
    this.perfiles = JSON.parse(sessionStorage.getItem('MenusPerfil'));
    this.form.patchValue({ id: IdPerfil });

    if (this.perfiles != null) {
      for (const men of this.menuPerfil) {
        for (const perfil of this.perfiles) {
          if(men.id == perfil.id && perfil.ckeckprincipal == 1){
            $('#ModulP' + perfil.id).prop('checked', true);
         }
        }
      }
      for (const sub of this.subMenuPerfil) {

        for (const perfil of this.perfiles) {
          if (sub.id == perfil.id && perfil.ckeckprincipal == 2) {
            $('#PerfPermi' + perfil.id).prop('checked', true);
            const array = this.form.controls.ArrayModulos as FormArray;
            const index = array.controls.findIndex((x) => x.value == [perfil.id]);
            if(index<0){
              array.push(new FormControl(perfil.id));
            }
          }
        }
      }
    } else {
      for (const sub of this.subMenuPerfil) {
        $('#PerfPermi' + sub.id).prop('checked', false);
        $('#ModulP' + sub.id).prop('checked', false);
      }
    }
    sessionStorage.removeItem('MenusPerfil');
  }

  Consultarporperfil(IdPerfil: number) {
    (<any>$('#AgregarPermisos')).modal('show');
    this.auth.Consultarsoloporperfil(IdPerfil).subscribe(
      (resp) => {
        if (resp.length > 0) {
          sessionStorage.setItem('MenusPerfil', JSON.stringify(resp));
          this.AgregarPermisos(IdPerfil);
        } else {
          this.AgregarPermisos(IdPerfil);
        }
      },
      (err) => { }
    );
  }

  SaveTemp(Idsub: number, ischeked: number) {
    const array = this.form.controls.ArrayModulos as FormArray;
    // tslint:disable-next-line: triple-equals
    if (ischeked == 1) {
      array.push(new FormControl(Idsub));
    } else {
      // tslint:disable-next-line: triple-equals
      const index = array.controls.findIndex((x) => x.value == [Idsub]);
      array.removeAt(index);
    }
  }

  SavePermiso() {
    this.apiPerf.Perfiles(this.form.value).subscribe(
      (resp) => {
        this.showModal(resp);
      },
      (err) => { }
    );
    this.Limpiarchecked();
  }

  async modalCrearPerfil() {
    (<any>$('#CrearPerfiles')).modal('show');
  }

  cerrarmodal() {
    (<any>$('#editarPefiles')).modal('hide');
    this.Limpiarchecked();
  }

  Limpiarchecked(){
    this.menuPerfil.forEach(m => {
      $('#ModulP' + m.id).prop('checked', false);
      $('#ModulD' + m.id).prop('checked', false);
    });
    this.subMenuPerfil.forEach(s => {
      $('#PerfPermi' + s.id).prop('checked', false);
      $('#PerfDene' + s.id).prop('checked', false);
    });
    (<any>$('.collapse')).collapse('hide');
    (<any>$('#AgregarPermisos')).modal('hide');
  }
}
