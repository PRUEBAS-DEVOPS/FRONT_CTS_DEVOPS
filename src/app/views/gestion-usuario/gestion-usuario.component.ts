import { Component, OnInit } from '@angular/core';
import { GestionUsuarioService } from '../../services/gestionuser/gestion-usuario.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { CrearusuarioService } from '../../services/crearusuario/crearusuario.service';
import { PerfilesAccesoService } from 'src/app/services/AccesoPerfiles/perfiles-acceso.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { CrearPerfil } from 'src/app/models/CreacionPerfil/CrearPerfil.model';
import { MenuViewModel, SedeViewModel, UsuarioModel } from 'src/app/models/LoginModel/Login.model';
import { CrearUsuario } from 'src/app/models/CrearUsuarioModel/CrearUsuario.model';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.css'],
})
export class GestionUsuarioComponent implements OnInit {
  gesUSer: CrearUsuario[];
  DetalUser: CrearUsuario[];
  informacionEdit: CrearUsuario[];
  menu: MenuViewModel[];
  subMenu: MenuViewModel[];
  edit: CrearUsuario;
  idEdit: SedeViewModel;
  Listar: CrearUsuario[];
  form: FormGroup;
  variable: boolean;
  gesperfil: CrearPerfil[];
  sedes: SedeViewModel[];
  subMenuUser: MenuViewModel[];
  menuUser: MenuViewModel[];
  SedesArray = [];
  menuVal: any;
  subMenuVal: any;
  usuario: UsuarioModel;

  constructor(
    private ServiceGestUser: GestionUsuarioService,
    private fb: FormBuilder,
    private ServiceUser: CrearusuarioService,
    private ServicePerfilUser: PerfilesAccesoService,
    private ServiceMenu: AuthService,
    // private modalService: NgbModal,
  ) {}
  PaginationGestUser = 1;

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.menuUser = JSON.parse(sessionStorage.getItem('menu'));
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.idEdit = JSON.parse(sessionStorage.getItem('Sede'));
    this.usuario = JSON.parse(sessionStorage.getItem('Usuario'));
    this.form = this.fb.group({
      id: [''],
      nombreCOmpleto: [''],
      usuario: [''],
      documento: [''],
      fechaNacimiento: [''],
      correo: [''],
      idsede: [''],
      perfil: [''],
      contrasena: [''],
      SedesArray: this.fb.array([]),
      ModuloArray: this.fb.array([]),
      Permisos: this.fb.array([]),
    });
    this.ListarUsuarios();
  }
  async ListarUsuarios() {
    await this.ServiceGestUser.getAllUser().then((data) => {
      this.gesUSer = data;
      this.ConsultarMenu();
    });
  }
  async ConsultarInformacion(id) {
    (<any>$('#Verdetalle')).modal('show'); 
    await this.ServiceGestUser.DetallUserAll(id).subscribe((data) => {
      this.DetalUser = data;
    });
  }
  async InactivarUsuario(
    id: number,
    cambiarestado: CrearUsuario,
    checkedI: boolean
  ) {
    cambiarestado.id = id;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.ServiceGestUser.inactivarUsuario(cambiarestado).subscribe((data) => {});
  }

  showModal(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
    });
  }

  get f() {
    return this.form.controls;
  }
  
  CargarSedes(id: number, isChecked: boolean) {
    const array = <FormArray>this.form.controls.SedesArray;
    if (isChecked) {
      array.push(new FormControl(id));
    } else {
      let index = array.controls.findIndex((x) => x.value == [id]);
      array.removeAt(index);
    }
  }
  async Editarinformacion(id, user: CrearUsuario,content) {  
    (<any>$('#EditarUsuarios')).modal('show'); 
    await this.ServiceGestUser.DetallUserAll(id).subscribe((data) => {
      this.informacionEdit = data;
      this.ValidarSedesUsuario(id);
    });  
    this.form.patchValue({id: user.id, nombreCOmpleto: user.nombreCOmpleto,
      usuario: user.usuario, documento: user.documento,
      correo: user.correo,  idsede: user.idsede, perfil: user.perfil});
    this.sedes = JSON.parse(sessionStorage.getItem('ArraySede'));
    this.gesperfil = JSON.parse(sessionStorage.getItem('ArrayPerfiles'));
  }

  async ConsultarMenu() {
    await this.ServiceMenu.ConsultarMenu().subscribe(
      (resp) => {
        this.menu = resp.filter((x) => x.ckeckprincipal === 1);
        this.subMenu = resp.filter((x) => x.ckeckprincipal === 2);
      },
      (err) => {}
    );
  }

  async AgregarPermisos(Idusuario: number) {
    this.form.patchValue({ id: Idusuario });
    var ContMen = sessionStorage.getItem('ContadorMe');

    if (ContMen > '0') {
      /*Iteración para los sub menus*/
      for (const sub of this.subMenuUser) {
        if (sub.via == 'Usuario') {
          if (sub.permitir == 1) {
            var Subpermitir = document.getElementById('SubP' + sub.id) as HTMLInputElement;
            Subpermitir.checked = true;
          } else {
            var Subdenegar = document.getElementById('SubD' + sub.id) as HTMLInputElement;
            Subdenegar.checked = true;
          }
        } else {
          if (sub.permitir == 1) {
            for (const men of this.menuUser.filter((x) => x.via == 'Perfil')) {
              var Menpermitir = document.getElementById('MenP' + men.id) as HTMLInputElement;
              var Mendenegar = document.getElementById('MenD' + men.id) as HTMLInputElement;
              Menpermitir.checked = true;
              Menpermitir.disabled = true;
              Mendenegar.disabled = true;
            }
            var Subpermitir = document.getElementById('SubP' + sub.id) as HTMLInputElement;
            var Subdenegar = document.getElementById('SubD' + sub.id) as HTMLInputElement;
            Subpermitir.checked = true;
            Subpermitir.disabled = true;
            Subdenegar.disabled = true;
          }
        }
      }
    } else {
      for (const sub of this.subMenuUser) {
        if (sub.via == 'Usuario') {
          if (sub.permitir == 1) {
            var Subpermitir = document.getElementById('SubP' + sub.id) as HTMLInputElement;
            Subpermitir.checked = false;
            Subpermitir.disabled = false;
          } else {
            var Subdenegar = document.getElementById('SubD' + sub.id ) as HTMLInputElement;
            Subdenegar.checked = false;
            Subdenegar.disabled = false;
          }
        } else {
          if (sub.permitir == 1) {
            for (const men of this.menuUser.filter((x) => x.via == 'Perfil')) {
              var Menpermitir = document.getElementById('MenP' + men.id) as HTMLInputElement;
              var Mendenegar = document.getElementById('MenD' + men.id) as HTMLInputElement;
              Menpermitir.checked = false;
              Mendenegar.checked = false;
              Menpermitir.disabled = false;
              Mendenegar.disabled = false;
            }
            var Subpermitir = document.getElementById('SubP' + sub.id) as HTMLInputElement;
            var Subdenegar = document.getElementById('SubD' + sub.id) as HTMLInputElement;
            Subpermitir.checked = false;
            Subdenegar.disabled = false;
            Subpermitir.disabled = false;
            Subdenegar.checked = false;
          }
        }
      }
    }
    sessionStorage.removeItem('ContadorMe');
    sessionStorage.removeItem('ContadorSub');
  }

  SaveTemp(Idsub: number, ischeked: number) {
    const array = this.form.controls.ModuloArray as FormArray;
    const arrayPermisos = this.form.controls.Permisos as FormArray;
    array.push(new FormControl(Idsub));
    arrayPermisos.push(new FormControl(ischeked)); 
  }

  async SaveModules() {
    await this.ServicePerfilUser.PerfilesUsuario(this.form.value).subscribe(
      (resp) => {
        this.showModal(resp);
      },
      (err) => {}
    );
  }

  ValidarMenuUsuario(Idusuario: number, User: any) {
    (<any>$('#AgregarPerfil')).modal('show'); 
    this.usuario.usuario = User;
    this.ServiceMenu.ConsultarMenuUsuario(this.usuario).subscribe(
      (resp) => {
        if (resp.length > 0) {
          this.menuVal = resp.filter((x) => x.ckeckprincipal === 1).length;
          this.subMenuVal = resp.filter((x) => x.ckeckprincipal === 2).length;
          sessionStorage.setItem('ContadorMe', this.menuVal);
          this.AgregarPermisos(Idusuario);
        } else {
          this.AgregarPermisos(Idusuario);
        }
      },
      (err) => {}
    );
  }

 async ValidarSedesUsuario(Idusuario:any){
    this.ServiceGestUser.SedesPorUsuario(Idusuario).subscribe((data)=>{
      for (const SedeUser of data){
          for(const Sedes of this.sedes){
            if(SedeUser.id==Sedes.id){
              var SedeAsing = document.getElementById('sede' + Sedes.id) as HTMLInputElement;
              SedeAsing.checked = true;
              const array = <FormArray>this.form.controls.SedesArray;
              array.push(new FormControl(SedeUser.id));
            }
          }
      }
    });
  }

  async GuardarModificacion() { 
    await this.ServiceUser.SaveUSer(this.form.value).subscribe(
      (resp) => {
        this.showModal(resp);
      },
      (err) => {}
    );
    (<any>$('#EditarUsuarios')).modal('hide'); 
    setTimeout(() => {
      this.ListarUsuarios();
    }, 1000);
  }


}
