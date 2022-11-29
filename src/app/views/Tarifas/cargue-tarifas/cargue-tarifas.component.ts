import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { VentasService } from 'src/app/services/VentasService/VentasService.service';
import { List } from 'linqts';
import { Router } from '@angular/router';
import { CargaMasivaTarifas2 } from 'src/app/models/CargasMasivas/CargaMasiva';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cargue-tarifas',
  templateUrl: './cargue-tarifas.component.html',
  styleUrls: ['./cargue-tarifas.component.css']
})
export class CargueTarifasComponent implements OnInit {
  ArrayDatos: any;
  IdUsuario: number;
  arrayBuffer: any;
  file: File;
  Cargados: any = 0;
  Rechazados: any = 0;
  paginador: number = 1;
  paginador2: number = 1;
  paginadorDetail: number = 1;
  previsualizar: boolean = false;
  ArrayPrevisualizarData: any;
  visualizar: boolean = false;
  cargarNuevoArc: boolean = false;
  verBtnCarga: boolean = true;
  Porcentaje:any;
  CargadosFinal:any=0;
  ArrayDetalle:any;
  cont=0;
  destroyInterval: any;
  filter='';
  constructor(private ServiceVentas: VentasService,private router: Router) { }

  ngOnInit(): void {
    this.IdUsuario = JSON.parse(sessionStorage.getItem('IdUsuario'))
    this.EliminarCargueTarifas();
  }

  async EliminarCargueTarifas() {
    await this.ServiceVentas.EliminarCargue(this.IdUsuario).then(response => {
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

  incomingfile(event) {
    this.file = event.target.files[0];
    this.Upload();
  }

  async Upload() {
    (<any>$('#DivProgreso')).modal('show');      
    let fileReader = new FileReader();
    fileReader.onload = async (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var info = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      let ArrayPrevisualizar = new Array(info);
      this.ArrayPrevisualizarData = info;
      let arrayData:any=[];
      for (let i = 0; i < ArrayPrevisualizar.length; i++) {
        for (let j = 0; j < ArrayPrevisualizar[i].length; j++) {
          const ArrayFinal = new Array(ArrayPrevisualizar[i][j]);
          for (const iterator of ArrayFinal) {
            const IdEsquema = iterator['IDESQUEMA'];
            const Examen = iterator['EXAMEN'];
            const Valor = iterator['VALOR'];
            const Nombre = iterator['NOMBRE'];
            let load={
              Codigo_Tarifa:IdEsquema,
              Codigo_Proced:Examen,
              Valor:Valor,
              Nom_Proced:Nombre,
              Falla:null,
              FechaRegistro:new Date(),
              Carga_Id:1,
              Estado:1,
            };
            arrayData.push(load)       
          }
        }
      }
      const load: CargaMasivaTarifas2= new CargaMasivaTarifas2();
      load.nombreArchivo=this.file.name;
      load.LoadRateviewModel=arrayData;
      load.idusuario=this.IdUsuario;
      this.cont=0;
      this.progress(info.length);
      this.destroyInterval=setInterval(() => {
        this.progress(info.length);
      }, 5);
      await this.ServiceVentas.CargaMasivaTarifas2(load).then(r=>{
        clearInterval(this.destroyInterval)
        if(this.cont<info.length){
          this.destroyInterval=setInterval(() => {
            this.progress(info.length,r);
            }, 1);
        }else{
          this.loadSucess(r)
        } 
      }).catch(err => {
        (<any>$('#DivProgreso')).modal('hide'); 
        clearInterval(this.destroyInterval)
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
    fileReader.readAsArrayBuffer(this.file);
  }
  private progress(tam:number,r=null){
    if(this.cont<tam){
      this.Porcentaje= Math.round((((this.cont=this.cont+1)/tam)*100));
      this.Cargados=this.cont
    }else{
      clearInterval(this.destroyInterval)
      this.loadSucess(r)
    }
  }

  private loadSucess(r:any){   
    if(this.Porcentaje==100){
      Swal.fire({
        icon: 'success',
        title: 'Plantilla cargada exitosamente',
        showConfirmButton: true
      }).then(result=>{
        if (result.isConfirmed) {
          // 
          this.verBtnCarga = false;
          (<any>$('#DivProgreso')).modal('hide');  
          this.CargadosFinal = r.toString().split(',')[1];
          this.previsualizar = true; 
        }
      });
    }
  }

  Cargando() {
    let timerInterval
    Swal.fire({
      title: 'Cargando....',
      html: 'Insertando Registros',
      icon: 'info',
      timer: 300000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft().toString();
            }
          }
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    })
  }  

  async GuardarValoresTarifa() {
    this.Cargando();
    await this.ServiceVentas.GuardarValoresCargue(this.IdUsuario).then((resp) => {
      this.Rechazados = resp.toString().split(',')[1];
      this.CargadosFinal= resp.toString().split(',')[2];
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: resp.toString().split(',')[0],
        showConfirmButton: true
      }).then(result => {
        this.listarCargueMasivo()
        this.visualizar = true;
        this.previsualizar = false;
        this.cargarNuevoArc = true;
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

  LimpiarCargue() {
    this.Rechazados = 0;
    this.Cargados = 0;
    this.CargadosFinal = 0;
  }

  async listarCargueMasivo() {
    this.visualizar = true;
    await this.ServiceVentas.ConsultarCargue(this.IdUsuario).then((resp) => {
      this.ArrayDatos = resp;
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


  async VerDetalle(IdenCarga){
    await this.ServiceVentas.listarDetalleCargue(IdenCarga,this.IdUsuario).then((resp) => {
      this.ArrayDetalle=resp;
      (<any>$('#DivDetalle')).modal('show');        
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

  Volver(){
    this.EliminarCargueTarifas();
    this.router.navigate(['/Tarifas']);
  }
  recargar() { 
    // window.location.reload()
    // this.router.navigate(['/cargue-tarifas']);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}