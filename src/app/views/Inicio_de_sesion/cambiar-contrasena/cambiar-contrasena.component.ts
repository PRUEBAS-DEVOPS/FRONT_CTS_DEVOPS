
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/LoginModel/Login.model';
import { AuthService } from 'src/app/services/login/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent implements OnInit {
  form: FormGroup;
  usuario: UsuarioModel;
  submit: boolean = false;
  submitLongitud: boolean = false;
  Usuario: any;
  constructor(private router: Router, private fb: FormBuilder, private Service: AuthService, private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {    
    if (!this.rutaActiva.snapshot.params.usuario) {
      this.Usuario = localStorage.getItem('UsuarioCambio')
    } else {
      this.Usuario = this.rutaActiva.snapshot.params.usuario;
    }
    this.form = this.fb.group({
      contrasenaAn: [''],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      usuario: this.Usuario
    });
  }

  cancelar() {
    this.router.navigate(['/login']);
  }

  aceptar() {
    this.router.navigate(['/login']);
  }

  showModal(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#00A496',
      confirmButtonText: 'Aceptar ',
    }).then((result) => {
      if (result.value) {
        sessionStorage.removeItem('Token');
        this.router.navigate(['/']);
      }
    })

  }


  get f() {
    return this.form.controls;
  }

  GuardarCambio() {
    var nueva = $("#newPass").val();
    var confirmacion = $("#Pass").val();
    if (confirmacion != nueva) {
      this.submit = true;
      this.submitLongitud = false;
    } else if (nueva.toString().length < 6) {
      this.submitLongitud = true
      this.submit = false;
    }
    else {
      this.Service.SaveUpdatePassword(this.form.value).then(resp => {
        this.showModal(resp)
      }, (err) => { });
      this.submit = false;
      localStorage.clear();
    }
  }

}