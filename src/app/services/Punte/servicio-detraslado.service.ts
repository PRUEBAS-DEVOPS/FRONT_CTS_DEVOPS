import { EventEmitter, Injectable, Output  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioDetrasladoService {
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  SolicitudCTS: any;
  tipser: any;
  constructor() {}

  async Consultar(nsolicitud: any, tipoServicio: any): Promise<any[]> {
    this.SolicitudCTS = nsolicitud;
    this.tipser = tipoServicio;
    return;
  }

  obtener() {
    const valores = {
      nsoliCTS: this.SolicitudCTS,
      tipoServ: this.tipser,
    };
    return valores;
  }
}
