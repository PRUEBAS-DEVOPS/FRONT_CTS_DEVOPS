import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit   {
  submenus: any;

  constructor( private router: Router) { }

  ngOnInit(): void {
    this.submenus=JSON.parse(sessionStorage.getItem('submenu'));
  }

  Navegar(opcion) {
    this.submenus.forEach(element => {
      switch (opcion) {
        case "Pacientes":        
        if(element.opcion==opcion){
            this.router.navigate(['/pacientes']);
          }
          break;
        case "Crear Venta":       
        if(element.opcion==opcion){
          this.router.navigate(['/ventas']);
        } 
          break;
        case "Cotización Rapida":  
        if(element.opcion==opcion){
          this.router.navigate(['/cotizacion-rapida']);
        }    
          break;
        case "Historial Cotización":      
        if(element.opcion==opcion){
          this.router.navigate(['/historial-cotizacion']);
        } 
          break;
        case "Generar Facturacion":  
        if(element.opcion==opcion){
          this.router.navigate(['/facturacion']);
        }     
          break;
          case "Generar Arqueo":    
          if(element.opcion==opcion){
            this.router.navigate(['/arqueo']);
          }   
          break;
      }
    });
  }
  
}
