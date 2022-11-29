import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class ValidarPermisos{
    subMenuUser: any;
    validacion: boolean;

    constructor(private router: Router) { }

    validarPermisos(ruta,permisos:any[]) {
        const rutanueva = ruta.substring(1)
        let validador= permisos.filter(p => p.controlador==rutanueva);
        if(validador.length>0){
            this.router.navigate(['/'+rutanueva]);
        }else{
            this.router.navigate(['/home']);
        }
    }

    
    validarRol(rol) {
        if (rol == 7 || rol==6) {
            this.validacion = true;
        } else {
            this.validacion = false;
        }

        return this.validacion
    }
}
