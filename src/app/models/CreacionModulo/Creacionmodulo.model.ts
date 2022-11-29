
// la primera clase para crear los modulos y de esta misma manera editarlos
export class crearModulo{
    id: number;
    modulo: string;
    descripcion: string;
    activo: number;
}

// la segunda parte para crear los sub-modulos y tambien editarlos
export class crearSubModulo {
    id: number;
    IdModulo: number;
    Nombre: string;
    Descripcion: string;
    DependeDe: number;
    controlador: string;
    Activo: number;
    nombreModulo: string;
}
