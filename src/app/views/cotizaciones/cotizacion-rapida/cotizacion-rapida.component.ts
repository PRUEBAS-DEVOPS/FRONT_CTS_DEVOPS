import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { CategoriaCheq, Planes } from 'src/app/models/Ventas/Ventas.model';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-cotizacion-rapida',
  templateUrl: './cotizacion-rapida.component.html',
  styleUrls: ['./cotizacion-rapida.component.css']
})

export class CotizacionRapidaComponent implements OnInit {
  DataPlanes: Planes[];
  DataCategoria: CategoriaCheq[];
  DataProcedimientos: Planes[];
  DataProcedimientosF: Planes[];
  DataProcedimientosE: Planes[];
  Recomendacion: any;
  files: any[] = [];
  ExamChequeo: any;
  Verchequeo: any;
  VerExamen: any;
  contador: number = 0;
  TablaProcedimientos = false;
  TotalFinal: any;
  submit: boolean;
  ContactoVitalea: [''];
  CotizacionWhatsapp: [''];
  keyword = 'NombreProcedimiento';//['idProcedimiento', 'NombreProcedimiento'];//,'NombreProcedimiento'
  ValorChequeo: any;
  ArrayProcedimientos: any[];
  ArrayExamenes: Planes[];
  ArrayChequeos: Planes[];
  Examen: any;
  banderaExam: number = 0;
  Chequeo: any;
  banderaChe: number = 0;
  Tarifa: number;
  IdUsuario: number;
  idplan: number;
  @ViewChild('auto') auto;
  @ViewChild('autoPlan') autoPlan;
  ValorExamen: any;
  NombreProcedimiento: any;
  codigoProcedimiento: any;
  detalleExam: boolean = false;
  detalleChequeo: boolean = false;
  TotalFinalPdf: any;
  suma_row: any;
  quantity: number = 0;
  keywordPlan = 'Concatenado';
  disabled: boolean = false;
  fecha: any
  VerRadioOpciones = false;
  descripcion: any;
  CodAthenea: any;
  NombreExamen: any;
  subMenuUser: any;

  constructor(private ServiceVentas: VentasService,
    private Fb: FormBuilder,
    private servicesCotizacion: CotizacionService ,private router: Router,private ValidarPermisos:ValidarPermisos) { }

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.consultarPlanes();
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url,this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }


  async consultarPlanes() {
    this.ServiceVentas.ConsultarPlanes().then((data) => {
      this.DataPlanes = data;
      this.consultarCategoriaChequeos();
    });
  }

  async consultarCategoriaChequeos() {
    this.ServiceVentas.ConsultarCategoriaChequeos().subscribe((data) => {
      this.DataCategoria = data;
      this.EliminarProcedimientosVentas(0, 2)
    });
  }


  ValidarListar() {
    var validador = false;
    if (this.contador > 0) {
      validador = true;
    }
    return validador;
  }

  async cargarInformacion(bandera: any) {
    this.ServiceVentas.ConsultarProcedimientosPlan(bandera, this.idplan).then((data) => {
      if (bandera === "1") {
        this.Recomendacion = "";
        this.ValorChequeo = "";
        this.ArrayChequeos = data;
      } else if (bandera === "2") {
        this.ArrayExamenes = data
      }
      /* if (bandera === 1) {
        this.Recomendacion = "";
        this.ValorChequeo = "";
        this.DataProcedimientos = data;
      } else {
        this.ArrayExamenes = data
      } */
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

  VerProcedimientos() {
    if (this.idplan != 0) {
      (<any>$('#ProcedimientosChequeoyExamenes')).modal('show');
      this.TablaProcedimientos = true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Seleccione un plan para continuar',
        showConfirmButton: true
      });
    }
  }

  VerModalOption(bandera: any) {
    if (bandera === "1") {
      this.Verchequeo = true;
      this.VerExamen = false;
    } else if (bandera === "2") {
      this.Verchequeo = false;
      this.VerExamen = true;
    } else {
      this.Verchequeo = false;
      this.VerExamen = false;
    }
  }

  PreselectPlan(datosPlan) {
    this.idplan = datosPlan.Id;
  }

  SeleccionarPlan(bandera) {
    const IdPlan = $("#PlanesAutocomplete").val();
    for (const dato of this.DataPlanes.filter(x => x.Id === Number(this.idplan))) {
      this.Tarifa = dato.IdTarifa;
    }
    if (this.idplan == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Debe seleccionar un plan para continuar',
        showConfirmButton: true
      });
    } else {
      if (bandera == 1) {
        $("#botonUsar").hide()
        $("#botonCambiar").show()
        this.disabled = true;
        this.VerRadioOpciones = true;
        $("#selopciones").val("2");
        this.cargarInformacion("2");
        this.VerExamen = true;
      } else {
        if (this.contador > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: 'Debe eliminar todos los procedimientos seleccionados para cambiar de plan',
            showConfirmButton: true
          });
        } else {
          $("#botonUsar").show()
          $("#botonCambiar").hide()
          this.disabled = false;
          this.VerRadioOpciones = false;
          this.TablaProcedimientos = false;
        }
      }
    }
  }

  ChequeoCategoria(Cat) {
    this.ArrayChequeos = this.DataProcedimientos.filter((x) => x.IdCategoria === Number(Cat));
  }

  ConsultaDatosCh(Cheq) {
    for (const data of this.ArrayChequeos.filter((x) => x.idProcedimiento === Cheq.idProcedimiento)) {
      this.Recomendacion = data.Recomendaciones;
      this.ValorChequeo = data.ValorTarifa;
      this.NombreProcedimiento = data.NombreProcedimiento;
      this.codigoProcedimiento = data.idProcedimiento;
    }
    this.detalleChequeo = true;
  }

  SelectChequeo(CodChequeo, bandera) {
    this.Chequeo = CodChequeo;
    this.banderaChe = bandera;
    this.AgregarChequeo();
  }

  async AgregarChequeo() {
    await this.ServiceVentas.GuardarProcedimientos(this.Chequeo.idProcedimiento, this.banderaChe, this.Tarifa, this.IdUsuario).then(response => {
      if (response.toString().split(',')[1] != "0") {
        Swal.fire({
          icon: 'info',
          title: response.toString().split(',')[0],
          showConfirmButton: true
        }).then(result => {
          if (result.isConfirmed) {
            this.LimpiarAutoCompleteChe();
          }
        });
      }
      if (response.toString().split(',')[1] === "0") {
        this.contador = this.contador + 1;
        this.LimpiarAutoCompleteChe();
        this.ListarProcedimientos();
        this.TablaProcedimientos = true;
      }
    }).catch(err => {
      if (err.status === 400) {
        Swal.fire({
          title: err.error.Message,
          text: err.error.ExceptionMessage,
          icon: 'error'
        });
        return;
      } else if (err.status === 500) {
        Swal.fire({
          title: err.error.Message,
          text: err.error.ExceptionMessage,
          icon: 'error'
        });
        return;
      }
     /*  Swal.fire({
        icon: 'info',
        title: response.toString(),
        showConfirmButton: true
      });
      this.contador = this.contador + 1;
      this.ListarProcedimientos()
      this.LimpiarAutoComplete();
      //this.GuardarTemProcedimientos(this.Chequeo, true, this.banderaChe);
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
      } */
    });
  }

  LimpiarChequeos() {
    $("#SelCat").val("");
    $("#SelChe").val("");
    this.Recomendacion = "";
    this.ValorChequeo = "";
    $("#radioCheq").prop("checked", false);
    this.NombreProcedimiento = "";
    this.codigoProcedimiento = "";
    this.detalleChequeo = false;
  }

  CerrarModalChequeos() {
    this.Verchequeo = false;
    this.LimpiarChequeos();
    (<any>$('#ProcedimientosChequeoyExamenes')).modal('hide');
  }

  SelectExam(AutoExamen, bandera) {
    this.Examen = AutoExamen;
    this.banderaExam = bandera;
    this.AgregarExamen();
  }

  ConsultaDatosExamen() {
    for (const data of this.ArrayExamenes.filter((x) => x.idProcedimiento === this.Examen.idProcedimiento)) {
      this.ValorExamen = data.ValorTarifa;
      this.NombreProcedimiento = data.NombreProcedimiento;
      this.codigoProcedimiento = data.idProcedimiento;

    }
    this.detalleExam = true;
  }

  async AgregarExamen() {
    await this.ServiceVentas.GuardarProcedimientos(this.Examen.idProcedimiento, this.banderaExam, this.Tarifa, this.IdUsuario).then(response => {
      if (response.toString().split(',')[1] != "0") {
        Swal.fire({
          icon: 'info',
          title: response.toString().split(',')[0],
          showConfirmButton: true
        }).then(result => {
          if (result.isConfirmed) {
            this.LimpiarAutoComplete();
          }
        });
      }
      if (response.toString().split(',')[1] === "0") {
        this.contador = this.contador + 1;
        this.LimpiarAutoComplete();
        this.ListarProcedimientos();
        this.TablaProcedimientos = true;
      }
    }).catch(err => {
      if (err.status === 400) {
        Swal.fire({
          title: err.error.Message,
          text: err.error.ExceptionMessage,
          icon: 'error'
        });
        return;
      } else if (err.status === 500) {
        Swal.fire({
          title: err.error.Message,
          text: err.error.ExceptionMessage,
          icon: 'error'
        });
        return;
      }
    });
  }

  LimpiarAutoComplete() {
    this.auto.clear();
    this.auto.close();
    this.ValorExamen = "";
    this.NombreProcedimiento = "";
    this.codigoProcedimiento = "";
    this.detalleExam = false;
  }

  LimpiarAutoCompleteChe() {
    this.auto.clear();
    this.auto.close();
    this.ValorExamen = "";
    this.NombreProcedimiento = "";
    this.codigoProcedimiento = "";
    this.detalleChequeo = false;
  }

  async ListarProcedimientos() {
    await this.ServiceVentas.ListarProcedimientos(this.IdUsuario, this.idplan).then((data) => {
      this.ArrayProcedimientos = data;
      var total = 0;
      for (const info of data) {
        var valorcalculado = info.Total_Cantidad;
        total += Number(valorcalculado);
      }
      this.TotalFinal = total;
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
    });;
  }

  EliminarProcedimientosVentas(id: any, bandera: any) {
    this.ServiceVentas.EliminarProcedimientos(id, bandera, this.IdUsuario).then(response => {
      if (bandera == 1) {
        this.contador = this.contador - 1;
        if (this.contador == 0) {
          this.TablaProcedimientos = false;
        }
        this.ListarProcedimientos();
      }
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

  public base64ToBlob(b64Data, sliceSize = 512) {
    let byteCharacters = atob(b64Data); //data.file there
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const data: Blob = new Blob(byteArrays, { type: 'application/pdf' });
    FileSaver.saveAs(data, 'CotizacionRapida_' + new Date().getTime())
  }


  async generarPdf() {
    this.servicesCotizacion.GenerarPDF(this.IdUsuario, this.idplan).then(response => {
      this.base64ToBlob(response);
    })
  }

  LimpiarFormulario() {
    this.TablaProcedimientos = false;
    this.EliminarProcedimientosVentas(0, 2);
    $("#botonUsar").show();
    $("#botonCambiar").hide();
    this.contador = 0;
    this.autoPlan.clear();
    // this.autoPlan.close();
    this.VerRadioOpciones = false;
    this.TablaProcedimientos = false;
  }

  CalcularValorCantidad(idProcedimiento) {
    let suma = 0;
    let sumaFinal = 0;
    let total = 0;
    let quantity = 0;
    let precio_compra = 0;
    let suma_row = 0;

    quantity = Number($(".txtCantidad" + idProcedimiento).val());
    (quantity <= 0) ? quantity = 1 : this.quantity = 0;
    this.quantity = 0;
    this.quantity = (quantity + this.quantity);
    precio_compra = Number($(".precio_venta" + idProcedimiento).text().replace(/\,/g, "").replace("$", ""));
    suma_row = quantity * precio_compra
    suma += suma_row
    $("#txtTotal" + idProcedimiento).val(suma_row);

    this.servicesCotizacion.actualizarCantidad(idProcedimiento, quantity, suma_row).then(response => {
      this.ListarProcedimientos();
    });
  }

  detalleExamen(procedimientos, Examenes){
    this.descripcion=procedimientos.descripcion;
    this.CodAthenea=procedimientos.CodAthenea;
    this.NombreExamen=procedimientos.NombreExamen;
    (<any>$('#detalleExamenPaciente')).modal('show');
  }

  // AgregarInput() {
  //   // var input = document.createElement("select");
  //   // input.setAttribute('type', 'text');
  //   // input.setAttribute('class','form-control')
  //   // input.setAttribute('option','Seleccione')
  //   let select = document.createElement("select");
  //   select.setAttribute('type', 'text');
  //   select.setAttribute('class','form-control')
  //   for (const iterator of  this.DataPlanes) {
  //     let option1 = document.createElement("option");
  //     option1.setAttribute("value", iterator.Id.toString());
  //     let option1Texto = document.createTextNode(iterator.NombrePlan);
  //     option1.appendChild(option1Texto);
  //     select.appendChild(option1);
  //   }

  //   // let option2 = document.createElement("option");
  //   // option2.setAttribute("value", "value2");
  //   // let option2Texto = document.createTextNode("opcion 2");
  //   // option2.appendChild(option2Texto);

  //   // let option3 = document.createElement("option");
  //   // option3.setAttribute("value", "value3");
  //   // let option3Texto = document.createTextNode("opcion 3");
  //   // option3.appendChild(option3Texto);

  //   //select.appendChild(option1);
  //   //select.appendChild(option2);
  //   //select.appendChild(option3);

  //   document.body.appendChild(select);
  //   var parent = document.getElementById("Contenedor");
  //   parent.appendChild(select);
  // }

}
