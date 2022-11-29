import { tipoDoc } from '../Preatencion/CrearPaciente.model';
export class CategoriaCheq {
  idUsuario(Id: number, bandera: number, activo: number, idUsuario: any) {
    throw new Error('Method not implemented.');
  }
  Id: number;
  descripcion: string;
  Nombre: string;
  bandera: number;
  NomEstado: string;
  activo: number;
}

export class Chequeos {
  idUsuario(Id: number, bandera: number, activo: number, idUsuario: any) {
    throw new Error('Method not implemented.');
  }
  Id: number;
  IdCategoria: number;
  CodAthenea: string;
  NombreChequeo: string;
  Descripcion: string;
  Recomendaciones: string;
  NombreCategoria: string;
  NomEstado: boolean;
  bandera: number;
  activo: number;
}

export class Tarifas {
  idUsuario(IdTarifa: number, bandera: number, activo: number, idUsuario: any) {
    throw new Error('Method not implemented.');
  }
  IdTarifa: number;
  NombreTarifa: string;
  CodTarifa: number;
  EstadoNom: boolean;
  bandera: number;
  activo: number;
}

export class TarifasValores {
  CodProcedimiento: string;
  Procedimiento: string;
  Categoria: string;
  valor: number;
}

export class Analitos {
  id: number;
  IdExam: number;
  idUnidadMed: number;
  NomUnidadMed: string;
  CodAnalito: string;
  NombreAnalito: string;
  ValorMin: number;
  ValorMax: number;
  bandera: number;
  NomEstado: boolean;
}

export class Examenes {
  id: number;
  CodAthenea: string;
  NombreExamen: string;
  bandera: number;
  NomEstado: boolean;
  activo: number;
  Valor: number;
  idUsuario: any;
}

export class Planes {
  Id: number;
  IdCliente: number;
  CodPlan: string;
  NombrePlan: string;
  Fechacreacion: Date;
  IdTarifa: number;
  idProcedimiento: string;
  NombreProcedimiento: string;
  ValorTarifa: number;
  IdCategoria: number;
  Recomendaciones: string;
  NomEstado: boolean;
}

export class UnidadMedida {
  id: number;
  Nombreunidad: string;
}

export class Clientes {
  idUsuario(id: number, bandera: number, activo: number, idUsuario: any) {
    throw new Error('Method not implemented.');
  }
  id: number;
  razonsocial: string;
  correo: string;
  nit: string;
  telefono: number;
  direccion: string;
  bandera: number;
  NomEstado: boolean;
  activo: number;
}

export class ResponsableFac {
  id: number;
  idpaciente: number;
  nombres: string;
  apellidos: string;
  tipodoc: number;
  documentoR: string;
  correo: string;
}

export class Ventas {
  id: number;
  idPaciente: number;
  idSede: number;
  totalVenta: number;
  idMedioPago: number;
  ExamsVenta: string;
  CheckupsVenta: string;
  Observacion: string;
  Politicadatos: number;
  idUser:number;
  IdDomicilio:string;
}

export class MediosPago {
  id: number;
  medioPago: string;
}

export class TipoServ {
  idUsuario(IdTipoServ: number, bandera: number, Activo: number, idUsuario: any) {
    throw new Error('Method not implemented.');
  }
  IdTipoServ: number;
  TipoServicio: string;
  Activo: number;
  NombreEstado: string;
  bandera: number;
}
export class Facturacion {
  IdVenta: number;
  Documento: string;
  NombreCompleto: string;
  NoFactura: string;
  IdSolicitudAthenea: number;
  IdTransaccion: string;
  TipoServicio: string;
  Estado: string;
  Num_Transaccion: string;
  FechaFacturacion: string;
}

export class FacturacioDetalle {
  Documento: string;
  NombreCompleto: string;
  TipoDoc: string;
  TipoServicio: string;
  TotalVenta: string;
  MedioPago: string;
  FechaVenta: Date;
  Observacion: string;
  FechaTransaccion:string;
  Observacion_Athenea:string;
}

export class Arqueo{
  FechaVenta:string;
  NoFactura:string;
  MedioPago:string;
  NombreCompleto:string;
  paciente:string;
  Documento:string;
  TotalVenta:string;
  NumTransaccion:string;
}

