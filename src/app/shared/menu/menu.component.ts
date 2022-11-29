import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuViewModel, SedeViewModel, UsuarioModel } from 'src/app/models/LoginModel/Login.model';
import { AuthService } from 'src/app/services/login/auth.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  campobuscar: any;
  cambiarboton: boolean;
  Menu: MenuViewModel[];
  filPrincipal: MenuViewModel[];
  SubMenu: MenuViewModel[];
  filSecundario: MenuViewModel[];
  usuario:UsuarioModel;
  sede:SedeViewModel[];
  filterSubMenu: string;
  Rol:any;
  TercSubMenu: any;
  menuUno: string;
  menuDos: string;
  verBreadcrumb: boolean;
  MenuPrincipal: any;

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize($event) {
    this.navresponsive($event);
  }

  constructor(private router: Router,private auth: AuthService) {}

  ngOnInit(): void {
    this.navresponsive(screen.width);
    this.usuario = JSON.parse(sessionStorage.getItem('Usuario'));
    this.sede = JSON.parse(sessionStorage.getItem('Sede'));
    this.Menu = JSON.parse(sessionStorage.getItem('menu'));
    this.filPrincipal = this.Menu;
    this.SubMenu = JSON.parse(sessionStorage.getItem('submenu'));
    this.filSecundario = this.SubMenu;
    this.Rol = JSON.parse(sessionStorage.getItem('Rol'));
    this.verBreadcrumb = window.location.pathname == "/home" ? false : true;
    this.ValidarMenuUsuario(this.usuario, this.Rol);
  }

  filtrarMenu(){
    if(this.campobuscar == "" ){
      this.filPrincipal = this.Menu;
      this.filSecundario = this.SubMenu;
    }else{
      this.filPrincipal = this.Menu.filter(option => option.opcion.toLowerCase().includes(this.campobuscar.toLowerCase()));
      this.filSecundario = this.SubMenu.filter(option => option.opcion.toLowerCase().includes(this.campobuscar.toLowerCase()));


      if (this.filSecundario.length > 0 ){
        this.filSecundario.forEach(s => {
          if(this.filSecundario.length == 0){
            this.filPrincipal.push(this.Menu.filter(option => option.id == s.depende)[0]);
          }else{
            if(this.filPrincipal.length >= 0){
              var index = this.filPrincipal.findIndex(i => i.id == s.depende);
              if(index == -1){
                this.filPrincipal.push(this.Menu.filter(option => option.id == s.depende)[0]);
              }
            }
          }
        });

      }else{
        this.filSecundario = this.SubMenu;
      }

      if (this.filPrincipal.length == 0 ){
        this.filPrincipal = this.Menu;
      }else{
        this.filPrincipal.forEach(element => {
          var menuu = document.getElementById('active' + element.id) as HTMLLinkElement;
          if(menuu != null && menuu != undefined){
          menuu.click();
         }
        });
      }
    }
  }

  async ValidarMenuUsuario(usuario: any, Rol: any) {
    await this.auth.PermisosModulesUser(usuario).then(
      (u: any)=> {
        this.MenuPrincipal = u;
      });
    }

  salir() {
    sessionStorage.clear();
    // sessionStorage.removeItem('Token');
    // sessionStorage.removeItem('Usuario');
    // sessionStorage.removeItem('Sede');
    // sessionStorage.removeItem('menu');
    // sessionStorage.removeItem('submenu');
    // sessionStorage.removeItem('ArraySede');
    // sessionStorage.removeItem('Rol')
    // sessionStorage.removeItem('IdExamCheck')
    // sessionStorage.removeItem('ArraySede')
    // sessionStorage.removeItem('DatosPaciente');
    // sessionStorage.removeItem('Idpaciente');
    // sessionStorage.removeItem('Permisos');
    // sessionStorage.removeItem('IdUsuario');
    // sessionStorage.removeItem('ArrayPerfiles');
    // sessionStorage.removeItem('Documento');
    // sessionStorage.removeItem('IdRol');
    // sessionStorage.removeItem('LtsOpciones');
    // sessionStorage.removeItem('Documento');
    //document.getElementById('content').style.marginLeft = '0';
    document.getElementById('content').style.marginLeft = '0';
    this.router.navigate(['/']);
  }
  openNav() {
    if (this.verBreadcrumb) {
      document.getElementById('bread').style.left = '0px';
    }
    document.getElementById('sidebar').style.left = '0px';
    document.getElementById('content').style.marginLeft = '300px';
    this.cambiarboton=false
  }

  closeNav() {
    if (this.verBreadcrumb) {
      document.getElementById('bread').style.left = '-300px';
    }
    document.getElementById('sidebar').style.left = '-300px';
    document.getElementById('content').style.marginLeft = '0';
    this.cambiarboton=true
  }

  navresponsive(size: number){
   if(size <= 990){
    if (this.verBreadcrumb) {
      document.getElementById('bread').style.left = '-300px';
    }
    document.getElementById('sidebar').style.left = '-300px';
    document.getElementById('content').style.marginLeft = '0';
    this.cambiarboton=true
   }else{
    if (this.verBreadcrumb) {
      document.getElementById('bread').style.left = '0px';
    }
    document.getElementById('sidebar').style.left = '0px';
    document.getElementById('content').style.marginLeft = '300px';
    this.cambiarboton=false
   }
  }
}
