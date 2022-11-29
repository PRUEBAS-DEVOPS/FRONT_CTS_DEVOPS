import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaternidadService } from 'src/app/services/Paternidad/PaternidadService.service';
import { ClientesService } from 'src/app/services/Preatencion/clientes.service';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import { GenericGenero } from 'src/app/models/Generic/Generic.model';
import { SignaturePad } from 'angular2-signaturepad';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { data } from 'jquery';
import * as moment from 'moment';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-gestion-solicitudes',
  templateUrl: './gestion-solicitudes.component.html',
  styleUrls: ['./gestion-solicitudes.component.css']
})
export class GestionSolicitudesComponent implements OnInit {
  Arraytipodocumento: any;
  ArrayGeneral: any;
  formCrearAcudiente: FormGroup;
  ArrayMuestra: any;
  Vertabla: boolean = false;
  Verdetalle: boolean = false;
  VerPrincipal: boolean = true;
  btn_asociar_pacientes: boolean = false;
  Pagina: number = 1;
  PaginaPaciente: number = 1;
  ArrayPacientes: any;
  numerosolicitud: any;
  contador: number = 0;
  quantityPac: number = 0;
  Porcentaje: any;
  formPacientes: FormGroup;
  IdUsuario: any;
  GesDocument: any;
  ArrayEstadoCivil: any;
  ArrayTipAfiliacion: any;
  ArrayGenero: any;
  ArrayPais: any;
  ArrayDepart: any;
  ArrayEstr: any;
  verEmbarazo: boolean = false;
  ArrayEps: any;
  ArrayParentesco: any[];
  botonCerrar: boolean = true;
  formularioPacientes: boolean;
  btn_Anterior_entrega: boolean;
  btn_Confirmar_entrega: boolean;
  validaCampos: boolean = false;
  ParrafoCorreo: boolean;
  btn_firmar_entrega: boolean;
  GesGenero: GenericGenero[];
  puntoEntrega: number;
  IdSolicitud: any;
  file: any;
  submit: boolean;
  IdAcudiente: any;
  showModalAlert: boolean;
  BandValidar: boolean;
  menordeedad: boolean;
  showAge: any;
  ArrayBarrio: any;
  ArrayDiscapacidad: any[];
  Arraylocalidad: any;
  ArrayCity: any;
  BtnVerAcudiente: boolean;
  PacienteExt: any;
  CorreoEnvio: any;
  Pacienteexistente: boolean;
  pacientenuevo: boolean;
  PacienteCre: any;
  nombre: string;
  disabledMuestra=true;
  @ViewChild(SignaturePad) signaturepad: SignaturePad;
  public optionsPad = {
    minWidth: 2,
    penColor: 'black',
    backgroundColor: 'white',
    canvasWidth: 450,
    canvasHeight: 150,
  };
  idpaciente: number;
  fechaSolicitud: any;
  examen: any;
  idgrupo: any;
  muestra: any;
  numerosolicitudFinal: any;
  texto2: string;
  texto1: string;
  alertaMuestra: boolean;
  alertaAnulacion: boolean;
  titulo: string;
  LtsOpc: any[];
  ArrayDetalle: any;
  sede: any;
  bandera_Crea_Edita: number;
  muestraanterior: any;
  IdTipoMuestra: number;
  Recepcion_Muestra: any;
  contadorMuestras: number=0;
  Porcentajemuestras: number;
  pacienteActualizar: any;
  pacienteActualizado: boolean;
  titulo_accion: string;
  subMenuUser: any;
  constructor(private _serviceGenerico: GenericoService, private _ServicePaternidad: PaternidadService, private formbuilder: FormBuilder, private ServicePaciente: ClientesService, private router: Router, private ServiceGenerico: GenericoService,
     private formbuilderAcu: FormBuilder, 
     private ValidarPermisos: ValidarPermisos) {
  }

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.sede = JSON.parse(sessionStorage.getItem('Sede'));
    this.CargarInfoGeneral();
    this.formPacientes = this.formbuilder.group({
      id: [''],
      documento: ['', [Validators.required]],
      tipodocumento: [0], fechanacimiento: [''],
      primerNombre: ['', [Validators.required]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required]],
      segundoApellido: [''], PoliticaDatos: [''], correo: [''],
      telefono: ['', [Validators.required]],
      celular: [''], direccion: ['', [Validators.required]],
      Idciudad: ['', [Validators.required]],
      Idbarrio: [''], Idestadocivil: ['', [Validators.required]],
      Idestrato: ['', [Validators.required]],
      IdTipAfil: ['', [Validators.required]],
      NombreBarrio: [''], Idsexo: ['', [Validators.required]],
      IdDepto: ['', [Validators.required]],
      IdLocalidad: [''], Pais: ['161'], IdEps: [''], edad: [''],
      AbreviaturaTipodoc: [''],
      IdParentesco: ['0'],
      bandera_origen: [''],
      IdSolicitud: [''],
      embarazo: ['0'],
      discapacidad: ['0'],
      IdUsuario: this.IdUsuario,
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  atras() {
    this.Verdetalle = false;
    this.VerPrincipal = true;
  }

  async CargarInfoGeneral() {
    this.Arraytipodocumento = await this._serviceGenerico.ConsultarTipoDoc();
    this.ArrayMuestra = await this._ServicePaternidad.ConsultarTipoMuestra();
    this.GesDocument = await this._serviceGenerico.ConsultarTipoDoc();
    this.ArrayEstadoCivil = await this._serviceGenerico.ConsultarestadoCivil();
    this.ArrayTipAfiliacion = await this._serviceGenerico.ConsultarTipoAfilicacion();
    this.ArrayGenero = await this._serviceGenerico.ConsultarGenero();
    this.ArrayDiscapacidad = await this.ServicePaciente.ConsultarDispacidades();
    this.GesGenero = await this.ServiceGenerico.ConsultarGenero();
    this.ArrayPais = await this._serviceGenerico.ConsultarPaises();
    this.ArrayDepart = await this._serviceGenerico.ConsultarDepartamento();
    this.ArrayEstr = await this._serviceGenerico.Consultarestratos();
    this.ArrayEps = await this._serviceGenerico.ConsultarEps();
    this.ArrayParentesco = await this._ServicePaternidad.ListarParentesco();
    this.LtsOpc = await this._serviceGenerico.ConsultarOpciones(10);    
  }   

  ValidarGenero(idgenero){
    if(+idgenero==2){
      this.verEmbarazo=true;
    }else{
      this.verEmbarazo=false;
    }
  }

  async ConsultarGenero() {
    await this.ServiceGenerico.ConsultarGenero().then((data) => {
      this.GesGenero = data;
    });
  }

  async ConsultarGestiones() {
    let fechainicial = $('#txtfechaini').val();
    let fechafinal = $('#txtfechafin').val();
    let noSolicitud = $('#txtnosolicitud').val();
    let noFactura = $('#txtnofactura').val();
    let tipoDocumento = $('#seltipodoc').val();
    let documento = $('#txtdocumento').val();

    if (fechainicial != '' || fechafinal != '' || noSolicitud != '' || noFactura != '' || documento != '' || tipoDocumento != '0') {
      await this._ServicePaternidad.ConsultarGestionSolicitudes(documento, fechainicial, fechafinal, noSolicitud, tipoDocumento, noFactura).then(response => {
        this.ArrayGeneral = response;
        this.Vertabla = true;
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Opps...',
        text: 'Debes seleccionar un parametro de busqueda',
        showConfirmButton: true
      });
    }

  }

  async ConsultarPacientesSolicitud(idsolicitud, numerosolicitud, cantidadPacientes, fechasolicitud, nombreexamen,Recepcion_Muestra) {
    this.ArrayPacientes = await this._ServicePaternidad.ConsultarPacientesGestionSolicitud(idsolicitud);
    this.ArrayPacientes.forEach(element => {
      setTimeout(() => {
        $("#SelMuestra"+element.IdGrupo).val(element.IdTipoMuestra);   
          if(element.Etiqueta==1){
            $("#SelMuestra"+element.IdGrupo).prop('disabled',true)   
          }else{
            $("#SelMuestra"+element.IdGrupo).prop('disabled',false)   
          }
      }, 10);      
    });
    this.Verdetalle = true;
    this.VerPrincipal = false;
    this.quantityPac = cantidadPacientes;
    this.numerosolicitud = numerosolicitud;
    this.fechaSolicitud = fechasolicitud;
    this.examen = nombreexamen;
    this.Recepcion_Muestra=Recepcion_Muestra;
    this.contador = this.ArrayPacientes.length;
    this.Porcentaje = Math.round((((this.contador) / cantidadPacientes) * 100));
    this.contadorMuestras= this.ArrayPacientes.filter(m=>m.IdTipoMuestra!=0).length;
    this.Porcentajemuestras= Math.round((((this.contadorMuestras) / this.contador) * 100));
    this.IdSolicitud = +idsolicitud;

    if (this.contador < cantidadPacientes) {
      this.btn_asociar_pacientes = true;
    } else {
      this.btn_asociar_pacientes = false
    }

  }

  MostrarEtiqueta(nombrecompleto, numeroSolicitud) {
    this.nombre = nombrecompleto;
    this.numerosolicitudFinal = numeroSolicitud;
    (<any>$('#ModalEtiqueta')).modal('show');
  }

  AsociarPacientes() {
    this.botonCerrar = true;
    this.pacienteActualizado = false;
    this.titulo_accion = "Agregar";
    $(".tabActualizar").addClass('tabActualizar');
    $('#btnActualizar').hide();
    $('#btnSiguienteFin').show();
    $("#barcodeHide").show();
    $("#menuSubServicios").show();
    this.formularioPacientes = false;
    var Entrega = $('#tabEntrega').attr('href');
    $(Entrega).hide();
    (<any>$('#DivPacientes')).modal('show');
    
  }

  
  ValidarTipoEntrega(id) {
    if (id === "1") {
      this.btn_Anterior_entrega = false;
      this.btn_Confirmar_entrega = true;
      this.ParrafoCorreo = false;
      this.btn_firmar_entrega = false;
      this.puntoEntrega = Number(id);
    } else if (id === "2") {
      this.ParrafoCorreo = true;
      this.btn_firmar_entrega = true;
      this.btn_Anterior_entrega = false;
      this.btn_Confirmar_entrega = false;
      this.puntoEntrega = Number(id);
    }
    else {
      this.btn_Anterior_entrega = true;
      this.btn_Confirmar_entrega = false;
      this.ParrafoCorreo = false;
      this.btn_firmar_entrega = false;
      this.btn_Anterior_entrega = false;
      this.btn_Confirmar_entrega = false;
    }
  }

  async FinRegistro() {
    const GrupoPaternidad = {
      IdGrupo: 0,
      IdSolicitud: this.IdSolicitud,
      IdPaciente: this.idpaciente,
      PuntoEntrega: this.puntoEntrega,
      IdTipoMuestra: 0,
      IdSede: this.sede[0].id,
      Origen: 'PA'
    }

    await this._ServicePaternidad.CrearGrupoPaternidad(GrupoPaternidad).then(response => {
      Swal.fire({
        icon: 'success',
        text: 'Solicitud creada exitosamente',
        showConfirmButton: true
      }).then(async result => {
        if (result.isConfirmed) {
          (<any>$('#DivPacientes')).modal('hide');
          this.ArrayPacientes = await this._ServicePaternidad.ConsultarPacientesGestionSolicitud(this.IdSolicitud);
          this.contador=this.ArrayPacientes.length;
          this.Porcentaje = Math.round((((this.contador) / this.quantityPac) * 100));
          if (this.quantityPac == this.ArrayPacientes.length) {
            this.btn_asociar_pacientes = false;
          }    
          this.ArrayPacientes.forEach(element => {
            setTimeout(() => {
              $("#SelMuestra"+element.IdGrupo).val(element.IdTipoMuestra);   
                if(element.Etiqueta==1){
                  $("#SelMuestra"+element.IdGrupo).prop('disabled',true)   
                }else{
                  $("#SelMuestra"+element.IdGrupo).prop('disabled',false)   
                }
            }, 10);   
          });           
          this.limpiarTabPrincipal();
          this.LimpiarFirma();
        }
      });
    })
  }

  limpiarTabPrincipal() {
    this.formPacientes = this.formbuilder.group({
      id: [''],
      documento: [''],
      tipodocumento: ['0'], fechanacimiento: [''],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''], PoliticaDatos: [''], correo: [''],
      telefono: [''],
      celular: [''], direccion: [''],
      Idciudad: [''],
      Idbarrio: [''], Idestadocivil: [''],
      Idestrato: [''],
      IdTipAfil: [''],
      NombreBarrio: [''], Idsexo: [''],
      IdDepto: [''],
      IdLocalidad: [''], Pais: ['161'], IdEps: [''], edad: [''],
      AbreviaturaTipodoc: [''],
      IdParentesco: ['0'],
      bandera_origen: [''],
      IdSolicitud: [''],
      embarazo: ['0'],
      discapacidad: ['0'],
      IdUsuario: this.IdUsuario
    });
    var activetab3 = $('#tabEntrega').attr('href');
    $(activetab3).hide()
    $('#Lipaciente').addClass('active');
    $('#Lientrega').removeClass('active');
    this.formularioPacientes = false;
    var activetabPac = $('#tabPaciente').attr('href');
    $(activetabPac).show();
  }

  LimpiarFirma() {
    this.signaturepad.clear();
  }

  CapturarFirma() {
    (<any>$('#DivPacientes')).modal('hide');
    (<any>$('#CapturarFirma')).modal('show');
  }

  GuardarFirma() {
    Swal.fire({
      text: 'Documento firmado correctamente',
      icon: 'success',
      showConfirmButton: true
    }).then(result => {
      if (result.isConfirmed) {
        (<any>$('#CapturarFirma')).modal('hide');
        this.limpiarTabPrincipal();
        this.LimpiarFirma();
      }
    });
  }

  ReiniciarProceso() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  AlertaMuestra(id,selected) {
    if(selected!='0'){      
      this.alertaMuestra = true;
      this.alertaAnulacion = false;
      this.idgrupo = +id;
      this.muestra = $('#SelMuestra'+id+' option:selected').text();
      this.texto1 = ' Muestra Seleccionada :' + this.muestra;
      this.texto2 = '¿Esta seguro que desea guardar el tipo de muestra seleccionado?';
      this.titulo = 'Tipo de muestra';      
      (<any>$('#Alerta')).modal('show');
    }
  }

  async guardarTipoMuestra() {
    let muestra = $('#SelMuestra' + this.idgrupo).val();
    const GrupoPaternidad = {
      IdGrupo: this.idgrupo,
      IdSolicitud: 0,
      IdPaciente: 0,
      PuntoEntrega: 0,
      IdTipoMuestra: +muestra,
      IdSede: this.sede[0].id,
      Origen: 'PA',
      IdUsuario:this.IdUsuario
    }
    await this._ServicePaternidad.CrearGrupoPaternidad(GrupoPaternidad);
    (<any>$('#Alerta')).modal('hide');
   
    /*Caso para validar el cambio de muestra y almacenar el motivo*/
    if(this.bandera_Crea_Edita==2){
      (<any>$('#AlertaCambioMuetra')).modal('show');
    }   
   
    this.ArrayPacientes = await this._ServicePaternidad.ConsultarPacientesGestionSolicitud(this.IdSolicitud);   
    this.contadorMuestras= this.ArrayPacientes.filter(m=>m.IdTipoMuestra!=0).length;
    this.ArrayPacientes.forEach(element => {
      setTimeout(() => {
        $("#SelMuestra"+element.IdGrupo).val(element.IdTipoMuestra);   
          if(element.Etiqueta==1){
            $("#SelMuestra"+element.IdGrupo).prop('disabled',true)   
          }else{
            $("#SelMuestra"+element.IdGrupo).prop('disabled',false)   
          }
      }, 10); 
     });  
     
     this.contadorMuestras= this.ArrayPacientes.filter(m=>m.IdTipoMuestra!=0).length;
     this.Porcentajemuestras= Math.round((((this.contadorMuestras) / this.contador) * 100));

     this.ArrayGeneral =await this._ServicePaternidad.ConsultarGestionSolicitudes('', '', '', '', 0, '')
     this.Recepcion_Muestra=this.ArrayGeneral[0].Recepcion_Muestra;
      
  }

  confirmarAnulacion(IdSolicitud) {
    this.alertaMuestra = false;
    this.alertaAnulacion = true;
    this.titulo = 'Anular solicitud';
    (<any>$('#ConfirmacionAnulacion')).modal('show');
    this.IdSolicitud = +IdSolicitud;
  }

  async AnularSolicitud() {
    let motivo = $("#txtMotivo").val();

    if (motivo == "") {
      Swal.fire({
        text: 'Debes ingresar un motivo de anulación para continuar',
        icon: 'warning',
        showConfirmButton: true
      })
    } else {
      const dataanulacion = {
        IdSolicitud: +this.IdSolicitud,
        motivoAnulacion: motivo,
        IdUsuario: this.IdUsuario
      }
      this._ServicePaternidad.CrearAnulacionSolicitud(dataanulacion).then(response => {
        this.texto1 = response;
        (<any>$('#ConfirmacionAnulacion')).modal('hide');
        (<any>$('#Alerta')).modal('show');
      })
    }
  }

  async limpiarAnulacion() {
    $("#txtMotivo").val("");
    this.ArrayGeneral = await this._ServicePaternidad.ConsultarGestionSolicitudes("", "", "", "", 0, "",);
  }

  AccionClick(idOpc, IdGrupo, tipodocumento, documento, muestra,IdTipoMuestra) {
    this.btn_Anterior_entrega = false;
    switch (idOpc) {
      case 34:
        $(".tabActualizar").removeClass('tabActualizar');
        this.verDatos(tipodocumento, documento);
        break;
      case 35:
        this.EliminarPacientes(IdGrupo);
        break;
        case 37:
          this.Editar(IdGrupo,muestra,IdTipoMuestra);
          break;
    }
  }

  Editar(idgrupo,muestra,IdTipoMuestra){
    this.bandera_Crea_Edita=2;
    this.muestraanterior=muestra;
    this.IdTipoMuestra=+IdTipoMuestra
    this.idgrupo=+idgrupo;
    $("#SelMuestra"+idgrupo).prop('disabled',false)   
    $("#checkTitular"+idgrupo).prop('disabled',false)   

  }

  async EliminarPacientes(idGrupo) {    
    await this._ServicePaternidad.EliminarPacientesPaternidad(idGrupo).then(async response => {
      this.ArrayPacientes = await this._ServicePaternidad.ConsultarPacientesGestionSolicitud(this.IdSolicitud);
      this.contador = this.ArrayPacientes.length;
      this.Porcentaje = Math.round((((this.contador) / this.quantityPac) * 100));
      if (this.contador!=this.quantityPac) {
        this.btn_asociar_pacientes = true;
      }  
      this.ArrayPacientes.forEach(element => {
        setTimeout(() => {
          $("#SelMuestra"+element.IdGrupo).val(element.IdTipoMuestra);   
            if(element.Etiqueta==1){
              $("#SelMuestra"+element.IdGrupo).prop('disabled',true)   
            }else{
              $("#SelMuestra"+element.IdGrupo).prop('disabled',false)   
            }
        }, 10);
       }); 
    })
  }

  barcode() {
    (<any>$('#DivPacientes')).modal('hide');
    (<any>$('#barcode')).modal('show');
  }

  async verDatos(tipodocumento, documento) {
    this.ArrayDetalle = await this.ServicePaciente.DetallPaciente(documento, tipodocumento);
    $(".tabActualizar").removeClass('tabActualizar');
    (<any>$('#verDatos')).modal('show');
  }

 async AsignarTitular(event,IdGrupo) {
   let titular = event == true ? 1 : 2;
   const GrupoPaternidad = {
     IdGrupo: +IdGrupo,
     IdSolicitud: 0,
     IdPaciente: 0,
     PuntoEntrega: 0,
     IdTipoMuestra: 0,
     Titular:titular,
     Origen: 'PA',
     IdUsuario:this.IdUsuario
    }
    await this._ServicePaternidad.CrearGrupoPaternidad(GrupoPaternidad);
    this.ArrayPacientes = await this._ServicePaternidad.ConsultarPacientesGestionSolicitud(this.IdSolicitud);   
    this.ArrayPacientes.forEach(element => {
      setTimeout(() => {
        $("#SelMuestra"+element.IdGrupo).val(element.IdTipoMuestra);   
          if(element.Etiqueta==1){
            $("#SelMuestra"+element.IdGrupo).prop('disabled',true)   
          }else{
            $("#SelMuestra"+element.IdGrupo).prop('disabled',false)   
          }
      }, 10);
     }); 
  }

async GuardarMotivoCambio(){
const dataCambio={
  IdGrupoPaciente:this.idgrupo,
  muestra_inicial:this.IdTipoMuestra,
  muestra_final:$('#SelMuestra' + this.idgrupo).val(),
  motivo:$('#txtMotivoCambioMuestra').val(),
  IdUsuario:this.IdUsuario
}

await this._ServicePaternidad.GenerarControlCambioMuestra(dataCambio).then(response=>{
  Swal.fire({
    icon:'success',
    text:response.toString(),
    showConfirmButton:true,
  }).then(result=>{
    if(result.isConfirmed){
      $('#txtMotivoCambioMuestra').val("");
      (<any>$('#AlertaCambioMuetra')).modal('hide');
      this.bandera_Crea_Edita=0;
    }
  })
})
}

printer() {
  const printContent = document.getElementById("etiquetaPrint");
  printContent.style.display="block";
  const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  WindowPrt.document.write(printContent.innerHTML);
  WindowPrt.document.close();
  printContent.style.display="none";
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close();
}


  /*Metodos gestion pacientes*/

  Next_Paciente(bandera) {
    $('.tab-pane3').hide();
    if (bandera == 2) {
      var activetab2 = $('#tab2').attr('href');
      $(activetab2).show()
      $('#Li2').addClass('active');
      $('#Li1').addClass('active');
    } else if (bandera == 3) {
      var activetab3 = $('#tab3').attr('href');
      $(activetab3).show()
      $('#Li3').addClass('active');
      $('#Li2').addClass('active');
    } else if (bandera == 4) {
      var activetab3 = $('#tabEntrega').attr('href');
      $(activetab3).show()
      $('#Lipaciente').removeClass('active');
      $('#Lientrega').addClass('active');
      this.formularioPacientes = false;
      var activetabPac = $('#tabPaciente').attr('href');
      $(activetabPac).hide()
    }
    
  }

  Previous_Paciente(bandera) {
    if (bandera == 1) {
      $("#menuSubDatos").hide();
      var activetab = $('#tab1').attr('href');
      var activetab2 = $('#tab2').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li1').addClass('active');
      $('#Li2').removeClass('active');
    } else if (bandera == 2) {
      var activetab = $('#tab2').attr('href');
      var activetab2 = $('#tab3').attr('href');
      $(activetab).show();
      $(activetab2).hide();
      $('#Li2').addClass('active');
      $('#Li3').removeClass('active');
    } else if (bandera == 3) {
      var activetab3 = $('#tabEntrega').attr('href');
      $(activetab3).hide()
      $('#Lipaciente').addClass('active');
      $('#Lientrega').removeClass('active');
      this.formularioPacientes = true;
      var activetabPac = $('#tabPaciente').attr('href');
      $(activetabPac).show();
    }
  }

  ValidarEmail(email: string) {
    var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(EMAIL_REGEX)) {
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formato del correo incorrecto',
        showConfirmButton: true
      });
      $("#txtcorreo").val('');
    }
  }

  


  ValidarCiudad(IdCiudad, bandera) {
    if (bandera == 1) {
      if (IdCiudad != 149 && IdCiudad != '') {
        $("#SelLocalidad").prop("disabled", true);
        $('#Selbarrio').hide();
        $('#txtbarrio').show();
        this.BandValidar = true;
      } else {
        $("#SelLocalidad").prop("disabled", false);
        $('#Selbarrio').show();
        $('#txtbarrio').hide();
        this.BandValidar = false;
      }
    } else {
      if (IdCiudad != 149 && IdCiudad != '') {
        $("#SelLocalidadAcudiente").prop("disabled", true);
        $('#SelbarrioAcudiente').hide();
        $('#txtbarrioAcudiente').show();
        this.BandValidar = true;
      } else {
        $("#SelLocalidadAcudiente").prop("disabled", false);
        $('#SelbarrioAcudiente').show();
        $('#txtbarrioAcudiente').hide();
        this.BandValidar = false;
      }
    }
  }

  async listarCiudades(Idciudad: number) {
    await this._serviceGenerico.ConsultarCiudades(Idciudad).then((data) => {
      this.ArrayCity = data;
    });
  }

  async listarLocalidades(IdCiudad: any) {
    await this._serviceGenerico.Consultarlocalidad(IdCiudad).then((resp) => {
      this.Arraylocalidad = resp;
    });
  }

  async ListarBarrios(IdLocalidad: any) {
    await this._serviceGenerico.ConsultarBarrios(IdLocalidad).then((resp) => {
      this.ArrayBarrio = resp;
    });
  }

  AsigPolitica(valor, bandera) {
    if (bandera == 1) {
      if ((valor = 'on')) {
        this.formPacientes.value.PoliticaDatos = 1;
      }
    } else {
      if ((valor = 'on')) {
        this.formCrearAcudiente.value.PoliticaDatos = 1;
      }
    }
  }

  get f() {
    return this.formPacientes.controls;
  }

  camposObligatorios() {
    Swal.fire({
      icon: 'error',
      title: 'Opps...',
      text: 'Ingrese los datos para continuar',
    });
  }

  mostrarformulario() {
    this.formularioPacientes = true;
  }
  
 

  async consultar() {
    
    var documento = $('#txtdocumento').val();
    var tipodocumento = $('#SelTipDoc').val();
    if (documento == '' || tipodocumento == '') {
      return this.camposObligatorios();
    } else {
      await this.ServicePaciente.DetallPaciente(documento, tipodocumento).then(response => {
        if (response.length > 0) {
          this.Pacienteexistente = true;
          this.pacientenuevo = false;
          this.formularioPacientes = true;
          this.botonCerrar = false;
        } else {
          (<any>$('#NoexistPaciente')).modal('show');
          this.Pacienteexistente = false;
          this.pacientenuevo = true;
          this.botonCerrar = false;
        }
        this.CargarDatosPaciente(response);
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
  }

  

  CargarDatosPaciente(datosPaciente) {
    for (const datos of datosPaciente) {
      this.formPacientes.patchValue({
        id: datos.id,
        primerNombre: datos.primerNombre,
        segundoNombre: datos.segundoNombre,
        primerApellido: datos.primerApellido,
        segundoApellido: datos.segundoApellido,
        fechanacimiento: datos.fechanacimiento,
        correo: datos.correo,
        telefono: datos.telefono,
        celular: datos.celular,
        direccion: datos.direccion,
        Idestadocivil: datos.Idestadocivil,
        Idsexo: datos.Idsexo,
        Idestrato: datos.Idestrato,
        IdTipAfil: datos.IdTipAfil,
        IdEps: datos.IdEps,
        Pais: 161,
        IdDepto: datos.IdDepto,
        Idciudad: datos.Idciudad,
        IdLocalidad: datos.IdLocalidad,
        Idbarrio: datos.Idbarrio,
        activo: datos.activo,
        embarazo: datos.embarazo,
        discapacidad: datos.discapacidad,
        IdParentesco: datos.IdParentesco
      });
      this.CorreoEnvio = datos.correo
      this.PacienteExt = datosPaciente;
      this.idpaciente = +datos.id;
      if ((datos.tipodocumento == 8) || (datos.tipodocumento == 7) && datos.IdAcudiente > 0) {
        this.BtnVerAcudiente = true;
        this.IdAcudiente = datos.IdAcudiente;
      } else {
        this.BtnVerAcudiente = false;
      }
      if (datos.PoliticaDatos == 1) {
        $("#radioPolitica").prop('checked', true);
      }

      this.cargarCiudades(datos.IdDepto, datos.Idciudad, datos.IdLocalidad, datos.fechanacimiento);
    }
    this.ValidarGenero(datosPaciente[0].Idsexo);
  }

  async cargarCiudades(IdDept: number, ciudad: number, Idlocalidad: number, fecha: any) {
    await this._serviceGenerico.ConsultarCiudades(IdDept).then((data) => {
      this.ArrayCity = data;
      this.CargarLocalidades(ciudad, Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarLocalidades(ciudad: number, Idlocalidad: number, fecha: any) {
    await this._serviceGenerico.Consultarlocalidad(ciudad).then((data) => {
      this.Arraylocalidad = data;
      this.CargarBarrios(Idlocalidad, fecha);
    });
  }
  // listamos las localidades por ciudad
  async CargarBarrios(Idlocalidad: number, fecha: any) {
    await this._serviceGenerico.ConsultarBarrios(Idlocalidad).then((data) => {
      this.ArrayBarrio = data;
      this.CalcularEdad(fecha, 1);
    });
  }

  async CalcularEdad(fecha, Bnd) {
    if (Bnd == 1) {
      const fechaActual = new Date();
      const convertAge = new Date(fecha);
      let dias = fechaActual.getUTCDate() - convertAge.getUTCDate();
      let meses = fechaActual.getUTCMonth() - convertAge.getUTCMonth();
      let years = fechaActual.getUTCFullYear() - convertAge.getUTCFullYear();
      if (dias < 0) {
        meses--;
        dias = 30 + dias;
      }
      if (meses < 0) {
        years--;
        meses = 12 + meses;
      }
      this.showAge = years + ' Años ' + meses + ' Meses ' + dias + ' Dias'
      this.validar(years);
    }
  }

  validar(edad: any) {
    const tipodocumento = $('#SelTipDoc').val();
    if (tipodocumento == '8' && edad < 14 || tipodocumento == '7') {
      $("#txtcorreo").prop("disabled", true);
    } else {
      $("#txtcorreo").prop("disabled", false);
      this.menordeedad = false;
    }
  }

  CrearPacientes(bandera) {
    if (this.BandValidar == true) {
      this.formPacientes.value.Idbarrio;
    }
    this.submit = true;
    if (bandera == 1) {
      if (this.formPacientes.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Faltan Datos Por Completar',
        });
        return;
      } else {
        Swal.fire({
          title: 'Estamos procesando tú solicitud.',
          icon: 'warning',
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
        });

        this.formPacientes.value.bandera_origen = 'PA';
        this.formPacientes.value.IdSolicitud = this.IdSolicitud;

        this.ServicePaciente.CrearPaciente(this.formPacientes.value).then(
          (resp) => {
            var IdPacNew = resp.toString().split(',')[1];
            this.idpaciente = +IdPacNew
            if (this.formPacientes.value.tipodocumento == 8 || this.formPacientes.value.tipodocumento == 7) {
              this.alerta()
              $('#btnVentaEx').show();
              $('#btnGuardar').hide();
              $('#btnSiguienteFin').show();
            } else {
              $('#btnVentaEx').show();
              $('#btnGuardar').hide();
              $('#btnSiguienteFin').show();
            }
            this.ParseoDataPaciente()

            let validarAcudiente = this.IdAcudiente;//JSON.parse(sessionStorage.getItem('IdAcudiente'))
            if (validarAcudiente > 0) {
              (<any>$('#NoexistAcudiente')).modal('hide');
            }
            Swal.fire({
              icon: 'success',
              title: resp.toString().split(',')[0],
              showConfirmButton: true,
            });
            this.submit = false;
            $('#btnGuardar').hide();
            $('#btnAthenea').show();

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
    }
  }

  EscanearDocumento() {
    // let trama = ["10184802492", "MENDOZA", "VARGAS", "KEIDER", "RAFAEL", "M", "19951027", "A+", "35904463", "1445"]
    Swal.fire({
      title: 'Escaneo de documento',
      text: 'Acerque su documento',
      imageUrl: '../../../assets/images/EscanerDeBarras.jpg',
      imageWidth: 300,
      imageHeight: 200,
      input: "text",
      inputAttributes: {
        autocapitalize: 'off',
        id: 'txtTrama'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          let trama = $("#txtTrama").val();
          $('#txtdocumento').val(trama.toString().split(',')[0]);
          $('#SelTipDoc').val(1);
          this.ParseoTrama(trama);
        }
      }
    })
  }

  async ParseoTrama(trama) {
    let sexo;   
    let fecha=moment(trama.toString().toUpperCase().split(',')[6]).locale('es-CO').format('YYYY-MM-DD')
    this.CalcularEdad(fecha,1);   
    this.consultar();
    if(trama.toString().split(',')[5] == "M"){
      sexo=1;
    }else if(trama.toString().split(',')[5] == "F"){
      sexo=2;
    }else{
      sexo="";
    }
    
    this.formPacientes.patchValue({
      tipodocumento: 1,      
      documento: trama.toString().toUpperCase().split(',')[0],
      primerNombre: trama.toString().toUpperCase().split(',')[3],
      segundoNombre: trama.toString().toUpperCase().split(',')[4],
      primerApellido: trama.toString().toUpperCase().split(',')[1],
      segundoApellido: trama.toString().toUpperCase().split(',')[2],
      fechanacimiento: moment(trama.toString().toUpperCase().split(',')[6]).locale('es-CO').format('YYYY-MM-DD'),//trama[6],
      Idsexo: sexo,
      edad: this.showAge
    });   
  }

  alerta() {
    this.showModalAlert = true;
    (<any>$('#NoexistAcudiente')).modal('show');
  }

  async ParseoDataPaciente() {
    await this.ServicePaciente.DetallPaciente(this.formPacientes.value.documento, this.formPacientes.value.tipodocumento).then(response => {
      this.PacienteCre = response;
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

  ValidarCampos() {
    this.validaCampos = false
    if (this.formPacientes.value.correo == '' || this.formPacientes.value.documento == '' || this.formPacientes.value.tipodocumento == '0'
      || this.formPacientes.value.fechanacimiento == '' || this.formPacientes.value.primerNombre == '' || this.formPacientes.value.primerApellido == ''
      || this.formPacientes.value.telefono == '' || this.formPacientes.value.direccion == '' || this.formPacientes.value.Idciudad == '0'
      || this.formPacientes.value.Idestadocivil == '0' || this.formPacientes.value.Idestrato == '0' || this.formPacientes.value.IdTipAfil == '0'
      || this.formPacientes.value.Idsexo == '0' || this.formPacientes.value.IdDepto == '0') {
      this.validaCampos = true;
    }
    return this.validaCampos;
  }

  async ActualizarDatos() {
    this.submit = true;
    if (this.formPacientes.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Faltan Datos Por Completar',
      });
      return;
    } else {
      Swal.fire({
        title: 'Estamos procesando tú solicitud.',
        icon: 'warning',
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      this.formPacientes.value.bandera_origen = 'PA';
      this.formPacientes.value.IdSolicitud = this.IdSolicitud;
      await this.ServicePaciente.UpdatePaciente(this.formPacientes.value).then(
        async (resp) => {
          var IdPacNew = resp.toString().split(',')[1];
          this.idpaciente = +IdPacNew
          $('#btnActualizar').hide();
          $('#btnSiguienteFin').show();
          this.ParseoDataPaciente()
          let validarAcudiente = this.IdAcudiente;
          if (validarAcudiente > 0) {
            (<any>$('#NoexistAcudiente')).modal('hide');
          }
          Swal.fire({
            icon: 'success',
            title: resp.toString().split(',')[0],
            showConfirmButton: true,
          });
          if (this.pacienteActualizado){
            this.ArrayPacientes = await this._ServicePaternidad.ConsultarPacientesGestionSolicitud(this.IdSolicitud);
            
            (<any>$('#DivPacientes')).modal('hide')
            this.cerrarModal();
            this.pacienteActualizado = false;
            $('#btnActualizar').show();
            $('#btnSiguienteFin').hide();
            
          }
          this.submit = false;
        }).catch(err => {
          if (err.status === 400 || err.status === 500) {
            Swal.fire({
              text: err.error.Message,
              icon: 'error'
            });
            return;
          }
        });
    }
  }

  cerrarModal(){
    this.limpiarTabPrincipal();
    var activetab = $('#tab1').attr('href');
    var activetab2 = $('#tab2').attr('href');
    var activetab3 = $('#tab3').attr('href');
    var activetabentrega = $('#tabEntrega').attr('href');
    $(activetab).show();
    $(activetab2).hide();
    $(activetab3).hide();
    $(activetabentrega).hide();
    $('#Li1').addClass('active');
    $('#Li2').removeClass('active');
    $('#Li3').removeClass('active');
    $('#tabEntrega').removeClass('active');
  }

  ActualizarPaciente(ArrayDetalle) {
    $("#menuSubServicios").hide();
    $("#barcodeHide").hide();
    this.titulo_accion = "Actualizar";
    this.pacienteActualizar = ArrayDetalle[0];
    this.ValidarGenero(this.pacienteActualizar.Idsexo);
    this.cargarCiudades(this.pacienteActualizar.IdDepto, this.pacienteActualizar.Idciudad, this.pacienteActualizar.IdLocalidad, this.pacienteActualizar.fechanacimiento);
    $(".tabActualizar").removeClass('tabActualizar');
    this.formPacientes = this.formbuilder.group({
      id: [this.pacienteActualizar.id],
      documento: [this.pacienteActualizar.documento],
      tipodocumento: [+this.pacienteActualizar.tipodocumento], 
      fechanacimiento: [this.pacienteActualizar.fechanacimiento],
      primerNombre: [this.pacienteActualizar.primerNombre],
      segundoNombre: [this.pacienteActualizar.segundoNombre],
      primerApellido: [this.pacienteActualizar.primerApellido],
      segundoApellido: [this.pacienteActualizar.segundoApellido], PoliticaDatos: [this.pacienteActualizar.PoliticaDatos], correo: [this.pacienteActualizar.correo],
      telefono: [this.pacienteActualizar.telefono],
      celular: [this.pacienteActualizar.celular], direccion: [this.pacienteActualizar.direccion],
      Idciudad: [+this.pacienteActualizar.Idciudad],
      Idbarrio: [+this.pacienteActualizar.Idbarrio], Idestadocivil: [this.pacienteActualizar.Idestadocivil],
      Idestrato: [this.pacienteActualizar.Idestrato],
      IdTipAfil: [+this.pacienteActualizar.IdTipAfil],
      NombreBarrio: [this.pacienteActualizar.NombreBarrio], Idsexo: [this.pacienteActualizar.Idsexo],
      IdDepto: [this.pacienteActualizar.IdDepto],
      IdLocalidad: [+this.pacienteActualizar.IdLocalidad], Pais: ['161'], IdEps: [this.pacienteActualizar.IdEps], edad: [this.showAge],
      AbreviaturaTipodoc: [this.pacienteActualizar.AbreviaturaTipodoc],
      IdParentesco: ['0'],
      bandera_origen: [this.pacienteActualizar.bandera_origen],
      IdSolicitud: [this.pacienteActualizar.IdSolicitud],
      IdUsuario: this.IdUsuario,
      embarazo: ['0'],
      discapacidad: [+this.pacienteActualizar.discapacidad],
    });
    this.botonCerrar=false
    this.formularioPacientes = true;
    this.Pacienteexistente = true;
    (<any>$('#verDatos')).modal('hide')
    var Entrega = $('#tabEntrega').attr('href');
    $(Entrega).hide();
    this.pacienteActualizado = true; 
    (<any>$('#DivPacientes')).modal('show')
    
  }
  
  limpiarFiltros(){
    $("#txtfechaini").val("");
    $("#txtfechafin").val("");
    $("#txtnosolicitud").val("");
    $("#txtnofactura").val("");
    $("#seltipodoc").val("0");
    $("#txtdocumento").val("");
    this.Vertabla=false;
  }
  

  
}
