export class pacientes {
  id: number;
  documento: string;
  tipodocumento: number;
  AbreviaturaTipodoc: string;
  fechanacimiento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  sexo: string;
  activo: number;
  PoliticaDatos: number;
  correo: string;
  telefono: string;
  celular: string;
  direccion: string;
  Idciudad: number;
  Idbarrio: number;
  BarrioPac:string;
  Idestadocivil: number;
  Idestrato: number;
  Estrato: string;
  Ciudad: string;
  CodTipoAfil: number;
  TipoAfil: string;
  NombreBarrio: string;
  Estadocivil: string;
  Idsexo: number;
  IdEps: number;
  IdDepto: number;
  IdTipAfil: number;
  TipoAfiliacion: string;
  IdLocalidad: number;
  NombreLocalidad: string;
  Eps: string;
  IdAcudiente:number;
  Depto:string;
  IdUsuario:Number;
  bandera_origen:string;
}
export class tipoDoc{
  NombreDoc: string;
  IdDoc: number;
}