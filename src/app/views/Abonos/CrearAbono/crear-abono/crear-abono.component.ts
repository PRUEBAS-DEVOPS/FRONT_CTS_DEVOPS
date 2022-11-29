import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbonoService } from 'src/app/services/GrupoFamiliar/AbonoService.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-abono',
  templateUrl: './crear-abono.component.html',
  styleUrls: ['./crear-abono.component.css']
})
export class CrearAbonoComponent implements OnInit {
  arrayentidades: any;
  arraymediospago: any;
  arrayplanes: any;
  arrayconceptos: any;
  arrayTipoDocumento: any;
  keywordPlan = 'Concatenado';
  idplan: any;
  formularioAbonos: FormGroup
  submit: boolean = false;
  ArrayGeneral: any[];
  Vertabla: boolean = false;
  Pagina: number = 1;
  mensajeRespuesta: string;
  IdUsuario: any;
  @ViewChild('autoPlan') autoPlan;
  verGeneral: boolean = false;
  VerTercero: boolean = false;
  VerEntidad: boolean = false;
  bandera: number;
  subMenuUser: any;
  constructor(private _ServiceVenta: VentasService, private _ServiceAbonos: AbonoService, private Builder: FormBuilder, private _ServiceGenerico: GenericoService,private router: Router,
    private ValidarPermisos:ValidarPermisos) { }

  ngOnInit(): void {
    this.cargaInfoGeneral();
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url,this.subMenuUser);
    this.formularioAbonos = this.Builder.group({
      id: [''],
      entidad: [''],
      plan: [''],
      valorAbono: [''],
      mediopago: [''],
      conceptoAbono: [''],
      categoriaAbono: [''],
      tipodocumento: [''],
      documento: [''],
      IdUsuario: this.IdUsuario
    });
  }

  async cargaInfoGeneral() {
    this.arraymediospago = await this._ServiceVenta.ConsultarMediosPago();
    this.arrayplanes = await this._ServiceVenta.ConsultarPlanes();
    this.arrayentidades = await this._ServiceVenta.ConsultarClientes();
    this.arrayconceptos = await this._ServiceAbonos.ConsultarConceptos();
    this.arrayTipoDocumento = await this._ServiceGenerico.ConsultarTipoDoc();
  //  this.Consultarabonos();
  }

  get validar() {
    return this.formularioAbonos.controls;
  }

  PreselectPlan(datosPlan) {
    this.idplan = datosPlan.Id;
  }

  SeleccionarTipo(seleccion) {
    if (seleccion == 1) {
      this.bandera=+seleccion;
      this.VerEntidad = true;
      this.verGeneral = true;
      this.VerTercero = false;
      this.formularioAbonos = this.Builder.group({
        id: [''],
        entidad: ['', [Validators.required]],
        plan: [''],
        valorAbono: ['', [Validators.required]],
        mediopago: ['', [Validators.required]],
        conceptoAbono: ['', [Validators.required]],
        categoriaAbono: ['ENT'],
        tipodocumento: [''],
        documento: [''],
        IdUsuario: this.IdUsuario
      });
    } else if (seleccion == 2) {
      this.bandera=+seleccion;
      this.VerTercero = true;
      this.VerEntidad = false;
      this.verGeneral = true;
      this.formularioAbonos = this.Builder.group({
        id: [''],
        entidad: [''],
        plan: [''],
        valorAbono: ['', [Validators.required]],
        mediopago: ['', [Validators.required]],
        conceptoAbono: ['', [Validators.required]],
        categoriaAbono: ['TER'],
        tipodocumento: ['', [Validators.required]],
        documento: ['', [Validators.required]],
        IdUsuario: this.IdUsuario
      });
    } else {
      this.VerTercero = false;
      this.VerEntidad = false;
      this.verGeneral = false;
      this.formularioAbonos.value.categoriaAbono='';
    }
  }

  async CrearAbono() {
    this.submit = true;
    if (this.formularioAbonos.invalid) {
      return;
    } else {
      this.formularioAbonos.value.plan = +this.idplan;
      this.submit = false;
      await this._ServiceAbonos.CrearAbonos(this.formularioAbonos.value).then(response => {
        this.mensajeRespuesta = response;
        (<any>$('#ModalAlerta')).modal('show');
      })
    }
  }

  async Consultarabonos() {
    this.Vertabla=true;
    this.ArrayGeneral = await this._ServiceAbonos.ListarAbonos();
  }

  CerrarModal() {
    this.Consultarabonos();
    this.Limpiar();
    (<any>$('#ModalAlerta')).modal('hide');
  }

  Limpiar() {
    if(this.bandera===1){
      this.autoPlan.clear();
      this.autoPlan.close();
    }
    this.formularioAbonos = this.Builder.group({
      id: [''],
      entidad: [''],
      plan: [''],
      valorAbono: [''],
      mediopago: [''],
      conceptoAbono: [''],
      categoriaAbono: [''],
      IdUsuario: [''],
      tipodocumento: [''],
      documento: [''],
    });
  }
  
  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }
}