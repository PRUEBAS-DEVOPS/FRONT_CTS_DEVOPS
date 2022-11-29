import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbonoService } from 'src/app/services/GrupoFamiliar/AbonoService.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import Swal from 'sweetalert2';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-abono-terceros',
  templateUrl: './abono-terceros.component.html',
  styleUrls: ['./abono-terceros.component.css']
})
export class AbonoTercerosComponent implements OnInit {
  arrayplanes
  keywordPlan
  arrayTipoDocumento: any;
  LtsOpc: any;
  verTabla: boolean = false;
  ArrayGeneral: any[];
  Pagina: number = 1;
  PaginaMovimiento:number=1;
  idAbono: any;
  IdUsuario: any;
  texto1: any;
  ArrayDetalle: any[];
  ArrayMovimientos: any[];
  TotalFinal: number;
  ArrayCalculo: any[];
  subMenuUser: any;
  constructor(private _ServiceAbonos: AbonoService, private _ServiceGenerico: GenericoService ,private router: Router,
    private ValidarPermisos:ValidarPermisos) { }

  ngOnInit(): void {
    this.cargaInfoGeneral();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url,this.subMenuUser);
  }

  async cargaInfoGeneral() {
    this.arrayTipoDocumento = await this._ServiceGenerico.ConsultarTipoDoc();
    this.LtsOpc = await this._ServiceGenerico.ConsultarOpciones(12);
  }

  async Consultar() {
    let tipodocumento = $('#Seltipodocumento').val();
    let documento = $('#txtdocumento').val();
    let fechaIni = $('#txtfechaini').val();
    let fechaFin = $('#txtfechafin').val();
    this.ArrayGeneral = await this._ServiceAbonos.ConsultarAbonosCategoria(0, 0, fechaIni, fechaFin, tipodocumento, documento, "TER");
    var total = 0;
     this.ArrayCalculo=this.ArrayGeneral.filter(a=>a.EstadoAboono== "Vigente")
    this.ArrayCalculo.forEach(element => {
      total += Number(element.valorAbono); 
    });
    this.TotalFinal = total;
    this.verTabla = true;

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

  async verDatos(idAbono: any) {
    this.ArrayDetalle = this.ArrayGeneral.filter(a => a.IdAbono == +idAbono);
    this.ArrayMovimientos = await this._ServiceAbonos.ConsultarMovimientos(idAbono);
    (<any>$('#DetalleAbono')).modal('show');
  }

  AnularAbono(idAbono) {
    (<any>$('#ConfirmacionAnulacion')).modal('show');
    this.idAbono = +idAbono;
  }


  GuardarAnulacion() {
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
        case "Saldo Pendiente":
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
    this.ArrayGeneral = await this._ServiceAbonos.ConsultarAbonosCategoria(0, 0, "", "", 0, "", "TER");
  }


  Limpiar() {
    $('#txtfechaini').val("");
    $('#txtfechafin').val("");
    $('#txtdocumento').val("");
    $('#Seltipodocumento').val("0");
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

}
