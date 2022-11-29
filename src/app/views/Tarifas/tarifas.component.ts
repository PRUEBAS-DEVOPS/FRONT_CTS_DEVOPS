import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { } from '../../../../node_modules/@types/jquery';
import Swal from 'sweetalert2';
import { Tarifas, TarifasValores } from 'src/app/models/Ventas/Ventas.model';
import { GenericoService } from 'src/app/services/servicesGenerico/generico.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ValidarPermisos } from 'src/app/Globals/ValidarPermisos';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css'],
})
export class TarifasComponent implements OnInit {
  form: FormGroup;
  submit: boolean;
  LtsTarifas: Tarifas[];
  LtsTarifasProced: TarifasValores[];
  paginaTarifa: number = 1;
  paginadetalle: number = 1;
  editform: FormGroup;
  LtsTarifasEdi: Tarifas[];
  filter: string;
  filterTarif: string;
  IdUsuario: number;
  arrayBuffer: any;
  file: File;
  Cargados: any = 0;
  Rechazados: any = 0;
  idTarifa: any;
  subMenuUser: any;

  constructor(
    private fb: FormBuilder,
    private ServiceVentas: VentasService,
    private ServiceGenerico: GenericoService,
    private router: Router,private ValidarPermisos: ValidarPermisos
  ) { }

  ngOnInit(): void {

    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    this.ListarTarifas();
    this.form = this.fb.group({
      IdTarifa: [''],
      CodTarifa: ['', [Validators.required]],
      NombreTarifa: ['', [Validators.required]],
      IdUsuario: this.IdUsuario 
    });

    this.editform = this.fb.group({
      IdTarifa: [''],
      NombreTarifa: [''],
      CodTarifa: [''],
      IdUsuario: this.IdUsuario 
    });
    this.subMenuUser = JSON.parse(sessionStorage.getItem('submenu'));
    this.Validar(this.router.url, this.subMenuUser);
  }

  Validar(ruta,permisos){
    this.ValidarPermisos.validarPermisos(ruta,permisos);
  }

  get f() {
    return this.form.controls;
  }

  async ListarTarifas() {
    await this.ServiceVentas.ConsultarTarifas(0).subscribe((data) => {
      this.LtsTarifas = data;
    });
  }

  async CrearTarifas() {

    this.submit = true;
    if (this.form.invalid) {
      return;
    } else {
      await this.ServiceVentas.CrearTarifas(this.form.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            title: resp.toString(),
            showConfirmButton: true,
          });
          this.submit = false;
          this.ListarTarifas();
          (<any>$('#CrearTarif')).modal('hide');
        }
      );
      this.form.reset();
    }
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  incomingfile(event) {
    this.file = event.target.files[0];
    //this.Upload();
  }

  // async Upload() {
  //   let fileReader = new FileReader();
  //   fileReader.onload = async (e) => {
  //     this.arrayBuffer = fileReader.result;
  //     var data = new Uint8Array(this.arrayBuffer);
  //     var arr = new Array();
  //     for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //     var bstr = arr.join("");
  //     var workbook = XLSX.read(bstr, { type: "binary" });
  //     var first_sheet_name = workbook.SheetNames[0];
  //     var worksheet = workbook.Sheets[first_sheet_name];
  //     var info = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  //     this.Cargando();
  //     await this.ServiceVentas.CargaMasivaTarifas(info, this.file.name, this.IdUsuario).then((resp) => {
  //       this.Cargados=resp.toString().split(',')[1];
  //       Swal.fire({
  //         icon: 'success',
  //         title: resp.toString().split(',')[0],
  //         showConfirmButton: true
  //       });
  //     }).catch(err => {
  //       if (err.status === 400) {
  //         Swal.fire({
  //           text: err.error.ExceptionMessage,
  //           icon: 'error'
  //         });
  //         return;
  //       } else if (err.status === 500) {
  //         Swal.fire({
  //           text: err.error.ExceptionMessage,
  //           icon: 'error'
  //         });
  //         return;
  //       }
  //     });
  //   }
  //   fileReader.readAsArrayBuffer(this.file);
  // }

  Cargando() {
    Swal.fire({
      title: 'Estamos cargando la información.',
      icon: 'info',
      timer: 35000,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  }

  async GuardarValoresTarifa() {
    this.Cargando();
    await this.ServiceVentas.GuardarValoresCargue(this.IdUsuario).then((resp) => {
      this.Rechazados = resp.toString().split(',')[1];
      Swal.fire({
        icon: 'success',
        title: resp.toString().split(',')[0],
        showConfirmButton: true
      })
    }).catch(err => {
      if (err.status === 400) {
        Swal.fire({
          text: err.error.ExceptionMessage,
          icon: 'error'
        });
        return;
      } else if (err.status === 500) {
        Swal.fire({
          text: err.error.ExceptionMessage,
          icon: 'error'
        });
        return;
      }
    });
  }

  CargarDatos() {
    // (<any>$('#SubirArchivo')).modal('show');
    this.router.navigate(['/cargue-tarifas']);
  }

  LimpiarCargue() {
    this.Rechazados = 0;
    this.Cargados = 0;
    (<any>$('#SubirArchivo')).modal('hide');
  }

  VerDetalle(Idtarifa) {
    this.idTarifa = Idtarifa;
    this.ServiceVentas.ConsultarTarifasProced(Idtarifa).subscribe((data) => {
      this.LtsTarifasProced = data;
    });
    (<any>$('#VerDetalle')).modal('show');
  }

  async Editar(IdTarifa, tarifa: Tarifas) {
    this.editform.patchValue({
      IdTarifa: tarifa.IdTarifa,
      NombreTarifa: tarifa.NombreTarifa,
      CodTarifa: tarifa.CodTarifa,
    });
    (<any>$('#EditarTarif')).modal('show');
  }

  async ModificarTarifa() {
    this.submit = true;
    if (this.editform.invalid) {
      return;
    } else {
      await this.ServiceVentas.CrearTarifas(this.editform.value).subscribe(
        (resp) => {
          Swal.fire({
            icon: 'success',
            title: resp.toString(),
            showConfirmButton: true
          });
          this.submit = false;
          this.ListarTarifas();
        }
      );
    }
    (<any>$('#EditarTarif')).modal('hide');
  }

  async InactivaTarifa(id: number, cambiarestado: Tarifas, checkedI: boolean) {
    cambiarestado.IdTarifa = id;
    cambiarestado.bandera = 9;
    cambiarestado.activo = checkedI === true ? 1 : 0;
    await this.ServiceGenerico.inactivar(
      cambiarestado.IdTarifa,
      cambiarestado.bandera,
      cambiarestado.activo,this.IdUsuario
    ).then((data) => { });
  }
  idUsuario(IdTarifa: number, bandera: number, activo: number, idUsuario: any) {
    throw new Error('Method not implemented.');
  }

  async modalCrearTarifa() {
    (<any>$('#CrearTarif')).modal('show');
  }

  async EliminarExamenes(CodExamen) {
    await this.ServiceVentas.EliminarExamenTarifa(this.idTarifa, CodExamen);
    this.VerDetalle(this.idTarifa);
  }

}
