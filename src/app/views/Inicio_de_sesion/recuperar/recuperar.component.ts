import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/login/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  constructor(private router: Router,private LoginService: AuthService) { }

  ngOnInit(): void { }

  cancelar() {
    this.router.navigate(['/login']);
  }
  aceptar() {
    this.router.navigate(['/login']);
  }

  EnviarCorreoRecuperacion() {
    var email=document.getElementById("txtcorreo") as HTMLInputElement
    this.LoginService.CorreoRecuperacionContrasena(email.value).then((resp)=>{
      this.showModal(resp.toString().split(',')[0])
    });
  }


  showModal(mensaje) {
    if(mensaje == "0"){
      Swal.fire({
        title: 'El correo no está asociado a un usuario, el usuario no existe.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#00A496',
        confirmButtonText: 'Aceptar ',
      }).then((result) => {
        if (result.value) {
          this.router.navigate(["/login"]);
        }
      })
    }else{

    Swal.fire({
      title: mensaje,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#00A496',
      confirmButtonText: 'Aceptar ',
    }).then((result) => {
      if (result.value) {
        this.router.navigate(["/login"]);
      }
    })
   }
  }
}
