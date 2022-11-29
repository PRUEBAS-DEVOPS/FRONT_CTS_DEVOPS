import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MenuViewModel,
  SedeViewModel,
  UsuarioModel,
} from 'src/app/models/LoginModel/Login.model';
import Swal from 'sweetalert2';
import { CrearusuarioService } from '../../services/crearusuario/crearusuario.service';
import { CrearPerfil } from '../../models/CreacionPerfil/CrearPerfil.model';
import { CrearperfilService } from '../../services/CrearPerfil/crearperfil.service';
import { CrearUsuario } from 'src/app/models/CrearUsuarioModel/CrearUsuario.model';
import { GestionUsuarioService } from 'src/app/services/gestionuser/gestion-usuario.service';
import { PerfilesAccesoService } from 'src/app/services/AccesoPerfiles/perfiles-acceso.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { SignaturePad } from 'angular2-signaturepad';
import { Router } from '@angular/router';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
  providers: [CrearusuarioService],
})
export class CrearUsuarioComponent implements OnInit {
  form: FormGroup;
  FormGest: FormGroup;
  submit: boolean;
  sedes: SedeViewModel[];
  Arraysedes: SedeViewModel[];
  SedesArray = [];
  gesPerf: CrearPerfil[];
  filterSedes: string;
  gesUSer: CrearUsuario[];
  DetalUser: CrearUsuario[];
  informacionEdit: CrearUsuario[];
  menu: MenuViewModel[];
  subMenu: MenuViewModel[];
  edit: CrearUsuario;
  Listar: CrearUsuario[];
  variable: boolean;
  gesperfil: CrearPerfil[];
  ArrayPerfil: CrearPerfil[];
  subMenuUser: MenuViewModel[];
  menuUser: MenuViewModel[];
  menuVal: any;
  subMenuVal: any;
  usuario: UsuarioModel;
  filterUser: string;
  PaginationGestUser = 1;
  IdRol: any;
  perfil: [];
  @ViewChild(SignaturePad) signaturepad: SignaturePad;
  public optionsPad = {
    minWidth: 2,
    penColor: 'black',
    backgroundColor: 'white',
    canvasWidth: 659,
    canvasHeight: 206,
  };
  firma64: string;
  bandera_crea_edita: number;
  previsualizacionfirma: any;
  allmenusUser: any;
  menuche: any;
  submenuche: any;
  constructor(
    private auth: CrearusuarioService,
    private fb: FormBuilder,
    private api: CrearperfilService,
    private ServiceGestUser: GestionUsuarioService,
    private ServiceUser: CrearusuarioService,
    private ServicePerfilUser: PerfilesAccesoService,
    private ServiceMenu: AuthService,
    private router: Router,
    private ValidarPermisos: ValidarPermisos
  ) {}

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.ListarUsuarios();
    this.menuUser = JSON.parse(sessionStorage.getItem('menu'));
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.usuario = JSON.parse(sessionStorage.getItem('Usuario'));
    this.IdRol = JSON.parse(sessionStorage.getItem('IdRol'));

    this.Validar(this.router.url, this.subMenuUser);

    this.form = this.fb.group({
      nombreCOmpleto: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      idsede: [''],
      perfil: ['', [Validators.required]],
      contrasena: [''],
      SedesArray: this.fb.array([], [Validators.required]),
      UsuarioAthenea: [''],
      Firma: [''],
    });
    this.FormGest = this.fb.group({
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
      UsuarioAthenea: [''],
      Firma: [''],
    });
  }

  Validar(ruta, permisos) {
    this.ValidarPermisos.validarPermisos(ruta, permisos);
  }

  CrearUsuario() {
    this.submit = true;
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      this.auth.CrearUsuario(this.form.value).then(
        (resp) => {
          Swal.fire({
            icon: 'success',
            title: resp.toString(),
            showConfirmButton: true,
          });
          this.submit = false;
          this.ListarUsuarios();
        },
        (err) => {}
      );
      this.form.reset();
      (<any>$('#CrearUsuarios')).modal('hide');
    }
  }
  get f() {
    return this.form.controls;
  }

  onChange(id: number, isChecked: boolean) {
    const array = <FormArray>this.form.controls.SedesArray;
    if (isChecked) {
      array.push(new FormControl(id));
    } else {
      let index = array.controls.findIndex((x) => x.value == [id]);
      array.removeAt(index);
    }
  }

  async consultarPerfiles() {
    await this.api.getAllPerfil().subscribe((data) => {
      this.gesPerf = data;
      this.ArrayPerfil = this.gesPerf.filter((x) => x.activo === 'Activo');
      this.consultarSedes();
    });
  }

  async consultarSedes() {
    await this.ServiceUser.ConsultarSedes().then((resp) => {
      this.sedes = resp;
      this.Arraysedes = this.sedes.filter((x) => x.EstadoBool === true);
      this.ConsultarMenu();
    });
  }

  modalcrearUsuario() {
    this.bandera_crea_edita = 1;
    (<any>$('#CrearUsuarios')).modal('show');
  }

  async ListarUsuarios() {
    await this.ServiceGestUser.getAllUser()
      .then((data) => {
        this.gesUSer = data;
        this.consultarPerfiles();
      })
      .catch((err) => {
        if (err.status === 400) {
          Swal.fire({
            title: err.error.Message,
            text: err.error.ExceptionMessage,
            icon: 'error',
          });
          return;
        } else if (err.status === 500) {
          Swal.fire({
            title: err.error.Message,
            text: err.error.ExceptionMessage,
            icon: 'error',
          });
          return;
        }
      });
  }

  async ConsultarInformacion(id) {
    await this.ServiceGestUser.DetallUserAll(id).subscribe((data) => {
      this.DetalUser = data;
      (<any>$('#Verdetalle')).modal('show');
    });
  }

  async InactivarUsuario(
    id: number,
    cambiarestado: CrearUsuario,
    checkedI: boolean
  ) {
    cambiarestado.id = id;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.ServiceGestUser.inactivarUsuario(cambiarestado).subscribe(
      (data) => {}
    );
  }

  showModal(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
    });
  }

  get fG() {
    return this.FormGest.controls;
  }

  CargarSedes(id: number, isChecked: boolean) {
    const array = <FormArray>this.FormGest.controls.SedesArray;
    if (isChecked) {
      let index = array.controls.findIndex((x) => x.value == [id]);
      if (index < 0) {
        array.push(new FormControl(id));
      }
    } else {
      let index = array.controls.findIndex((x) => x.value == [id]);
      array.removeAt(index);
    }
  }

  async Editarinformacion(id, user: CrearUsuario, content) {
    this.bandera_crea_edita = 2;
    (<any>$('#EditarUsuarios')).modal('show');
    await this.ServiceGestUser.DetallUserAll(id).subscribe((data) => {
      this.informacionEdit = data;
      this.previsualizacionfirma = data[0].Firma;
      this.ValidarSedesUsuario(id);
    });
    this.FormGest.patchValue({
      id: user.id,
      nombreCOmpleto: user.nombreCOmpleto,
      usuario: user.usuario,
      documento: user.documento,
      correo: user.correo,
      idsede: user.idsede,
      perfil: user.perfil,
      UsuarioAthenea: user.UsuarioAthenea,
      Firma: user.Firma,
    });
  }

  async ConsultarMenu() {
    await this.ServiceMenu.ConsultarMenu().then((resp) => {
      this.menu = resp.filter((x) => x.ckeckprincipal === 1);
      this.subMenu = resp.filter((x) => x.ckeckprincipal === 2);
    });
  }

  SaveTemp(Idsub: number, ischeked: number, via: any) {
    const validador = this.allmenusUser.filter(v => v.id == Idsub && v.ckeckprincipal == 2 );

    if (validador.length == 0) {
      const array = this.FormGest.controls.ModuloArray as FormArray;
      const arrayPermisos = this.FormGest.controls.Permisos as FormArray;
      array.push(new FormControl(Idsub));
      arrayPermisos.push(new FormControl(ischeked));
    } else if (validador[0].via == 'Perfil' && ischeked == 0) {
      Swal.fire({
        title: 'No es posible denegar este menú',
        icon: 'error',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          $('#SubP' + Idsub).prop('checked', true);
        }
      });
    } else if (validador[0].via == 'Usuario' &&  (ischeked == 0 || ischeked == 1)) {
      const array = this.FormGest.controls.ModuloArray as FormArray;
      const arrayPermisos = this.FormGest.controls.Permisos as FormArray;
      array.push(new FormControl(Idsub));
      arrayPermisos.push(new FormControl(ischeked));
    }
  }

  async SaveModules() {
    await this.ServicePerfilUser.PerfilesUsuario(this.FormGest.value).subscribe(
      (resp) => {
        this.showModal(resp);
        this.Limpiarchecked();
      }
    );
  }

  LimpiarDatos(){
    this.form.reset();
    this.submit = false
    this.Arraysedes.forEach(element=>{
      $('#chekedSedes' + element.id).prop('checked', false);
      this.onChange(element.id, false)
    })
  }

  Limpiarchecked() {
    this.menu.forEach((m) => {
      $('#MenP' + m.id).prop('checked', false);
      $('#MenD' + m.id).prop('checked', false);
    });
    this.subMenu.forEach((s) => {
      $('#SubP' + s.id).prop('checked', false);
      $('#SubD' + s.id).prop('checked', false);
    });
    (<any>$('.collapse')).collapse('hide');
    (<any>$('#AgregarPerfil')).modal('hide');
  }

  async ValidarMenuUsuario(Idusuario: number, User: any) {
    this.FormGest.patchValue({ id: Idusuario });
    (<any>$('#AgregarPerfil')).modal('show');

    await this.ServiceMenu.PermisosModulesUser(User).then((u: any) => {
      this.allmenusUser = u;
      this.menuche = u.filter((m) => m.ckeckprincipal == 1);
      this.submenuche = u.filter((m) => m.ckeckprincipal == 2);

      this.menuche.forEach((menu) => {
        const con = this.submenuche.filter(a => a.depende == menu.id && a.permitir == 1 );
        if (con.length >= 1) {
          $('#MenP' + menu.id).prop('checked', true);
        } else {
          $('#MenD' + menu.id).prop('checked', true);
        }
      });

      this.submenuche.forEach((subm) => {
        switch (subm.via) {
          case 'Perfil':
            if (subm.permitir == 1) {
              $('#SubP' + subm.id).prop('checked', true);
            } else {
              $('#SubD' + subm.id).prop('checked', true);
            }
            break;
          case 'Usuario':
            if (subm.permitir == 1) {
              $('#SubP' + subm.id).prop('checked', true);
            } else {
              $('#SubD' + subm.id).prop('checked', true);
            }

            break;
          default:
            break;
        }
      });
    });
  }

  async AgregarPermisos(Idusuario: number) {
    this.FormGest.patchValue({ id: Idusuario });
    var ContMen = sessionStorage.getItem('ContadorMe');
    if (ContMen > '0') {
      /*Iteración para los sub menus*/
      for (const sub of this.subMenuUser) {
        if (sub.via == 'Usuario') {
          if (sub.permitir == 1) {
            // $('#SubP' + sub.id).prop("checked", true);
            var Subpermitir = document.getElementById(
              'SubP' + sub.id
            ) as HTMLInputElement;
            Subpermitir.checked = true;
          } else {
            // $('#SubD' + sub.id).prop("checked", true);
            var Subdenegar = document.getElementById(
              'SubD' + sub.id
            ) as HTMLInputElement;
            Subdenegar.checked = true;
          }
        }
        //  else {
        //   if (sub.permitir == 1) {
        //     for (const men of this.menuUser.filter((x) => x.via == 'Perfil')) {
        //       var Menpermitir = document.getElementById('MenP' + men.id) as HTMLInputElement;
        //       var Mendenegar = document.getElementById('MenD' + men.id) as HTMLInputElement;
        //       Menpermitir.checked = true;
        //       Menpermitir.disabled = true;
        //       Mendenegar.disabled = true;
        //     }
        //     var Subpermitir = document.getElementById('SubP' + sub.id) as HTMLInputElement;
        //     var Subdenegar = document.getElementById('SubD' + sub.id) as HTMLInputElement;
        //     Subpermitir.checked = true;
        //     Subpermitir.disabled = true;
        //     Subdenegar.disabled = true;
        //   }
        // }
      }
    }
    // else {
    //   for (const sub of this.subMenuUser) {
    //     if (sub.via == 'Usuario') {
    //       if (sub.permitir == 1) {
    //         var Subpermitir = document.getElementById('SubP' + sub.id) as HTMLInputElement;
    //         Subpermitir.checked = false;
    //         Subpermitir.disabled = false;
    //       } else {
    //         var Subdenegar = document.getElementById('SubD' + sub.id) as HTMLInputElement;
    //         Subdenegar.checked = false;
    //         Subdenegar.disabled = false;
    //       }
    //     } else {
    //       if (sub.permitir == 1) {
    //         for (const men of this.menuUser.filter((x) => x.via == 'Perfil')) {
    //           var Menpermitir = document.getElementById('MenP' + men.id) as HTMLInputElement;
    //           var Mendenegar = document.getElementById('MenD' + men.id) as HTMLInputElement;
    //           Menpermitir.checked = false;
    //           Mendenegar.checked = false;
    //           Menpermitir.disabled = false;
    //           Mendenegar.disabled = false;
    //         }
    //         var Subpermitir = document.getElementById('SubP' + sub.id) as HTMLInputElement;
    //         var Subdenegar = document.getElementById('SubD' + sub.id) as HTMLInputElement;
    //         Subpermitir.checked = false;
    //         Subdenegar.disabled = false;
    //         Subpermitir.disabled = false;
    //         Subdenegar.checked = false;
    //       }
    //     }
    //   }
    // }
    sessionStorage.removeItem('ContadorMe');
    sessionStorage.removeItem('ContadorSub');
  }

  async ValidarSedesUsuario(Idusuario: any) {
    this.ServiceGestUser.SedesPorUsuario(Idusuario).then((data) => {
      for (const SedeUser of data) {
        for (const Sedes of this.sedes) {
          if (SedeUser.id == Sedes.id) {
            $('#sede' + Sedes.id).prop('checked', true);
            const array = <FormArray>this.FormGest.controls.SedesArray;
            let index = array.controls.findIndex(
              (x) => x.value == [SedeUser.id]
            );
            if (index < 0) {
              array.push(new FormControl(SedeUser.id));
            }
          }
        }
      }
    });
  }

  async GuardarModificacion() {
    await this.ServiceUser.SaveUSer(this.FormGest.value).subscribe((resp) => {
      this.showModal(resp);
      this.ListarUsuarios();
    });
    (<any>$('#EditarUsuarios')).modal('hide');
  }

  ValidarEmail(email: string) {
    var EMAIL_REGEX =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(EMAIL_REGEX)) {
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formato del correo incorrecto',
        showConfirmButton: true,
      });
      $('#email').val('');
    }
  }

  CerrarModal() {
    (<any>$('#EditarUsuarios')).modal('hide');
    (<any>$('.collapse')).collapse('hide');
    (<any>$('#AgregarPerfil')).modal('hide');
    this.FormGest = this.fb.group({
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
      UsuarioAthenea: [''],
      Firma: [''],
    });
  }

  ReiniciarProceso() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  LimpiarFirma() {
    this.signaturepad.clear();
  }

  CapturarFirma() {
    if (this.bandera_crea_edita == 1) {
      (<any>$('#CrearUsuarios')).modal('hide');
    } else {
      (<any>$('#EditarUsuarios')).modal('hide');
    }
    (<any>$('#CapturarFirma')).modal('show');
  }

  GuardarFirma() {
    this.firma64 = this.signaturepad.toDataURL('image/png', 0.5);
    if (this.bandera_crea_edita == 1) {
      this.form.value.Firma = this.firma64;
      (<any>$('#CrearUsuarios')).modal('show');
    } else {
      this.FormGest.value.Firma = this.firma64;
      (<any>$('#EditarUsuarios')).modal('show');
    }
    this.LimpiarFirma();
    (<any>$('#CapturarFirma')).modal('hide');
  }

  Volver() {
    this.signaturepad.clear();
    if (this.bandera_crea_edita == 1) {
      (<any>$('#CapturarFirma')).modal('hide');
      (<any>$('#CrearUsuarios')).modal('show');
    } else {
      (<any>$('#CapturarFirma')).modal('hide');
      (<any>$('#EditarUsuarios')).modal('show');
    }
  }
}
