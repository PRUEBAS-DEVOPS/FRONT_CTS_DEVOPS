import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MenuViewModel,
  SedeViewModel,
  UsuarioModel,
  usuariotoken,
} from '../../../models/LoginModel/Login.model';
import { AuthService } from '../../../services/login/auth.service';
import Swal from 'sweetalert2';
import { CrearusuarioService } from '../../../services/crearusuario/crearusuario.service';
import { GestionUsuarioService } from 'src/app/services/gestionuser/gestion-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [],
})

export class LoginComponent implements OnInit {
  form: FormGroup;
  usuario: UsuarioModel = new UsuarioModel();
  submit: boolean;
  Menu: MenuViewModel[];
  SubMenu: MenuViewModel[];
  sedes: SedeViewModel[];
  ArraySedeUser: SedeViewModel[];
  TercSubMenu: MenuViewModel[];

  constructor(private auth: AuthService, private fb: FormBuilder,
    private router: Router, private ServiceUser: CrearusuarioService, private ServiceGestUser: GestionUsuarioService) { }

  ngOnInit(): void {
    this.consultarSedes();
    this.form = this.fb.group({
      usuario: [''],
      contrasena: ['', [Validators.required]],
      idsede: ['', [Validators.required]],
      documento: [''],
    });
  }

  get f() {
    return this.form.controls;
  }

  faltanDatos() {
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: 'Faltan Datos Por Completar',
      confirmButtonText: 'Entendido',
    });
  }

  async login() {
    let validador = await this.auth.ConsultarFecha(this.form.value.usuario);
    if(validador.toString().split(",")[0]=="0"){
      this.router.navigate(['/cambiar-contrasena/'+validador.toString().split(",")[1]]);
    }else  if (validador.toString().split(",")[0] == "3") {
      Swal.fire({
        title: 'El usuario no existe valide por favor los datos',
        icon: 'error',
        confirmButtonText: 'Entendido',
      });
    }else{
      let rtsLogin= await this.auth.login(this.form.value);
      if(rtsLogin=="1"){
        this.usuario = this.form.value;
        sessionStorage.setItem('Usuario', JSON.stringify(this.usuario.usuario));
        this.Token(this.usuario.usuario);
        this.router.navigate(['/home']);
        this.submit = false;
      }else{
        Swal.fire({
          title: rtsLogin.toString(),
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      }
      this.submit = false;
    }
  }

  async Token(User) {
    this.submit = true;
    if (this.form.invalid) {
      return;
    } else {
      await this.auth.generarToken(User).then(
        (resp) => {
          /*Variable de session para guardar el Token */
          sessionStorage.setItem('Token', resp.toString());

        });
    }
  }

  async CargarSede() {
    this.usuario = this.form.value;
    await this.auth.ConsultarSedeId(this.usuario.idsede).then((resp) => {
      sessionStorage.setItem('Sede', JSON.stringify(resp));
    });
  }

  recuperar() {
    this.router.navigate(['/recuperar']);
  }

  async consultarSedes() {
    await this.ServiceUser.ConsultarSedes().then((resp) => {
      this.sedes = resp;
      sessionStorage.setItem('ArraySede', JSON.stringify(resp));
    });
  }

  async ConsultarMenuAcceso(User: any) {
    this.usuario.usuario = User;
    await this.auth.ConsultarMenuUsuario(this.usuario).then(
      (resp) => {
        if (resp.length > 0){
          this.Menu = resp.filter((x) => x.ckeckprincipal === 1);
          this.SubMenu = resp.filter((x) => x.ckeckprincipal === 2 || x.ckeckprincipal === 3);
          sessionStorage.setItem('menu', JSON.stringify(this.Menu));
          sessionStorage.setItem('submenu', JSON.stringify(this.SubMenu));
          this.CargarInfo();
        }else{
          $("#SelSede" ).prop( "disabled", true );
        }
      });
  }

  async CargarInfo() {
    await this.auth.CargarDatosUsuario(this.usuario.usuario).then((resp) => {
      for (const Datos of resp) {
        sessionStorage.setItem('Rol', JSON.stringify(Datos.Rol));
        sessionStorage.setItem('IdUsuario', JSON.stringify(Datos.idUsuario));
        sessionStorage.setItem('IdRol',JSON.stringify(Datos.IdRol));
        this.ValidarSedesUsuario();
      }
    });
  }

  async ValidarSedesUsuario() {
    const IdUser = sessionStorage.getItem('IdUsuario');
    await this.ServiceGestUser.SedesPorUsuario(Number(IdUser)).then((response) => {
      $("#SelSede" ).prop( "disabled", false );
      this.ArraySedeUser = response;
    });
  }
}
