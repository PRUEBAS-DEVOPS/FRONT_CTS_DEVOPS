import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbonoService } from 'src/app/services/GrupoFamiliar/AbonoService.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abono-entidades',
  templateUrl: './abono-entidades.component.html',
  styleUrls: ['./abono-entidades.component.css']
})
export class AbonoEntidadesComponent implements OnInit {
  arrayentidades: any;
  arrayplanes: any;
  @ViewChild('autoPlan') autoPlan;
  keywordPlan = 'Concatenado';
  idplan: any=0;
  verTabla: boolean = false;
  ArrayGeneral: any;
  ArrayDetalle: any;
  LtsOpc:any;
  idAbono: number;
  IdUsuario: any;
  Pagina: number = 1;
  texto1: void;
  subMenuUser: any;
  constructor(private _ServiceVenta: VentasService, private _ServiceAbonos: AbonoService,private _serviceGenerico:GenericoService,  private router: Router,
    private ValidarPermisos:ValidarPermisos) { }

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));

      this.Validar(this.router.url,this.subMenuUser);
    this.cargaInfoGeneral();
  }

  async cargaInfoGeneral() {
    this.arrayplanes = await this._ServiceVenta.ConsultarPlanes();
    this.arrayentidades = await this._ServiceVenta.ConsultarClientes();
    this.LtsOpc = await this._serviceGenerico.ConsultarOpciones(12);  
  }

  PreselectPlan(datosPlan) {
    this.idplan = datosPlan.Id;
  }

  async Consultar() {
    let entidad = $('#SelEntidad').val();
    let fechaIni = $('#txtfechaini').val();
    let fechaFin = $('#txtfechafin').val();
    this.verTabla=true;
    this.ArrayGeneral = await this._ServiceAbonos.ConsultarAbonosCategoria(entidad, this.idplan, fechaIni, fechaFin, 0, "", "ENT");  
    this.ValidarOpciones();
  }

  AccionClick(idOpc, idAbono) {
    switch (idOpc) {
      case 41:
        this.verDatos(idAbono);
        break;
      case 42:
        this.AnularAbono(idAbono);
        break;
    }
  }
  
  verDatos(idAbono: any) {
    this.ArrayDetalle=this.ArrayGeneral.filter(a=> a.IdAbono==+idAbono);
    (<any>$('#DetalleAbono')).modal('show');
  }

  AnularAbono(idAbono) {
    (<any>$('#ConfirmacionAnulacion')).modal('show');
    this.idAbono = +idAbono;
  }

  GuardarAnulacion(){
    let motivo = $("#txtMotivo").val();

    if (motivo == "") {
      Swal.fire({
        text: 'Debes ingresar un motivo de anulación para continuar',
        icon: 'warning',
        showConfirmButton: true
      })
    } else {
      const dataanulacion = {
        IdAbono: +this.idAbono,
        motivoAnulacion: motivo,
        IdUsuario: this.IdUsuario
      }
      this._ServiceAbonos.CrearAnulacionAbono(dataanulacion).then(response => {
        this.texto1 = response;
        (<any>$('#ConfirmacionAnulacion')).modal('hide');
        (<any>$('#Alerta')).modal('show');
      })
    }
  }

  async ValidarOpciones() {   
    for (const data of this.ArrayGeneral) {
      var estado = data.EstadoAboono;
      switch (estado) {
        case "Anulado":
          setTimeout(() => {         
            $("#Anular" + data.IdAbono).hide();
            $("#Detalle" + data.IdAbono).show();                
          }, 10);
          break;      
        case "Vigente":
          setTimeout(() => {
            $("#Anular" + data.IdAbono).show();
            $("#Detalle" + data.IdAbono).show(); 
          }, 10);
          break;       
      }
    }
  }

  Paginar(event) {
    this.Pagina = event;
    this.ValidarOpciones();
  }

  async limpiarAnulacion() {
    $("#txtMotivo").val("");
    (<any>$('#Alerta')).modal('hide');
    this.ArrayGeneral = await this._ServiceAbonos.ConsultarAbonosCategoria(0, 0, "", "", 0, "", "ENT");
  }


  Limpiar() {
    this.autoPlan.clear();
    this.autoPlan.close();
    $('#txtfechaini').val("");
    $('#txtfechafin').val("");
    $('#SelEntidad').val("0");
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }
}
