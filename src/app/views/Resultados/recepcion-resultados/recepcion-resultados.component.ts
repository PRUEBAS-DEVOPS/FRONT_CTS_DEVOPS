import { Component, OnInit } from '@angular/core';
import { GenericTipoDoc } from 'src/app/models/Generic/Generic.model';
import { ServiceResultadosService } from 'src/app/services/ServiceResultados/service-resultados.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recepcion-resultados',
  templateUrl: './recepcion-resultados.component.html',
  styleUrls: ['./recepcion-resultados.component.css']
})
export class RecepcionResultadosComponent implements OnInit {
  ArrayData: any[];
  ArrayTipoDoc: GenericTipoDoc[];
  paginador: number = 1;
  VisualizarDiv:boolean=false;
  hoy: string;
  currentYear: number;
  subMenuUser: any;
  constructor(private ServiceResultado: ServiceResultadosService, private ServiceGenerico:GenericoService, private router: Router,
    private ValidarPermisos: ValidarPermisos) { }

  ngOnInit(): void {
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.CargarTipoDocumento();
    const today = new Date()
    const day = (today.toDateString()).split(" ")
    const date =today.getFullYear()+"-"+String((today.getMonth()+1)>=10?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+day[2]
    this.hoy = date
    this.currentYear = today.getFullYear();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  async CargarTipoDocumento(){
    await this.ServiceGenerico.ConsultarTipoDoc().then(response=>{
      this.ArrayTipoDoc=response;
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


  async Consultar() {
    const documento = $("#txtdocumento").val()
    const TipoDoc=$("#SelTipoDoc").val();
    const FechaIniRecep=$("#txtFechaIniRecep").val();
    const FechaFinRecep=$("#txtFechaFinRecep").val();
    if (documento == "" && TipoDoc=="0" && FechaIniRecep=="" && FechaFinRecep=="") {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Ingrese los datos para continuar',
      });
    } else {
      await this.ServiceResultado.ConsultarLogResultados(TipoDoc,documento,FechaIniRecep,FechaFinRecep).subscribe(response => {
        this.ArrayData = response;
        this.VisualizarDiv=true;
      });
    }
  }

  ayuda(){
    (<any>$('#ayuda')).modal('show');
  }

  LimpiarFormulario(){
    $('#txtdocumento').val("");
    $('#txtFechaIniRecep').val("");
    $('#txtFechaFinRecep').val("");
    $('#SelTipoDoc').val(0);
    this.VisualizarDiv=false;
 }

 validarFecha(fecha,bandera) {
  let transformada = fecha.split("-")
  if (bandera == 1) {
    if (transformada[0] > this.currentYear) {
      $('#fechaIni').val("");
    }
  }else{
    if (transformada[0] > this.currentYear) {
      $('#fechafin').val("");
    }
  }
}

}
