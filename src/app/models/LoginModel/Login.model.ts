export class UsuarioModel {
  usuario: string;
  documento: string;
  idsede: string;
  sede: string;
  contrasena: string;
}

export class usuariotoken {
  usuario: string;
}

export class MenuViewModel {
  opcion: string;
  ckeckprincipal: number;
  id: number;
  depende: number;
  permitir: number;
  via: string;
  controlador:string;
}

export class SedeViewModel {
  id: number;
  nombre: string;
  IdCiudad: number;
  Ciudad: string;
  activo: number;
  EstadoBool: boolean;
  IdDepartamento:number;
}

export class DataUser{
  idUsuario:number;
  Rol:string;
  IdRol:number;
  Permisos:string;
}

