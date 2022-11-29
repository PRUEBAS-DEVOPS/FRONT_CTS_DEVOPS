import { RouterModule, Routes } from '@angular/router';
import { CrearUsuarioComponent } from './views/crear-usuario/crear-usuario.component';
import { HomeComponent } from './views/home/home.component';
import { CambiarContrasenaComponent } from './views/Inicio_de_sesion/cambiar-contrasena/cambiar-contrasena.component';
import { LoginComponent } from './views/Inicio_de_sesion/login/login.component';
import { RecuperarComponent } from './views/Inicio_de_sesion/recuperar/recuperar.component';
import { CreacionModuloComponent } from './views/creacion-modulo/creacion-modulo.component';
import { CreacionSubmoduloComponent } from './views/creacion-submodulo/creacion-submodulo.component';
import { CreacionPerfilComponent } from './views/creacion-perfil/creacion-perfil.component';
import { LogSistemaComponent } from './views/log-sistema/log-sistema.component';
import { CrearSedesComponent } from './views/creacion-sede/crear-sedes.component';
import { PacientesComponent } from './views/pacientes/pacientes.component';
import { TarifasComponent } from './views/Tarifas/tarifas.component';
import { VentasComponent } from './views/ventas/ventas.component';
import { ChequeosComponent } from './views/chequeos/chequeos.component';
import { ExamenesComponent } from './views/examenes/examenes.component';
import { CategoriasComponent } from './views/categorias/categorias.component';
import { ClientesComponent } from './views/clientes/clientes.component';
import { PlanesComponent } from './views/planes/planes.component';
import { FacturacionComponent } from './views/facturacion/facturacion.component';
import { TipoServicioComponent } from './views/TipoServicio/TipoServicio.component';
import { ArqueoComponent } from './views/arqueo/arqueo.component';
import { RecepcionResultadosComponent } from './views/Resultados/recepcion-resultados/recepcion-resultados.component';
import { ResultadosPacienteComponent } from './views/Resultados/resultados-paciente/resultados-paciente.component';
import { CotizacionComponent } from './views/cotizaciones/cotizacion/cotizacion.component';
import { HistorialCotizacionComponent } from './views/cotizaciones/historial-cotizacion/historial-cotizacion.component';
import { AuthGuard } from '../app/Gards/auth.guard'
import { CotizacionRapidaComponent } from './views/cotizaciones/cotizacion-rapida/cotizacion-rapida.component';
import { CargueTarifasComponent } from './views/Tarifas/cargue-tarifas/cargue-tarifas.component';
import { ExcepcionesPlanComponent } from './views/ExcepcionesPlan/excepciones-plan/excepciones-plan.component';
import { ReporteTipoComponent } from './views/Reportes/reporte-tipo/reporte-tipo.component';
import { AnulacionComponent } from './views/Facturacion/Anulacion/anulacion/anulacion.component';
import { GrupoFamiliarComponent } from './views/ventas/GrupoFamiliar/grupo-familiar/grupo-familiar.component';
import { RegistroPacientesComponent } from './views/Paternidad/Registro/registro-pacientes/registro-pacientes.component';
import { ReporteVentasComponent } from './views/ventas/reporte-ventas/reporte-ventas.component';
import { GestionSolicitudesComponent } from './views/Paternidad/GestionSolicitudes/gestion-solicitudes/gestion-solicitudes.component';
import { CargaResultadosComponent } from './views/Paternidad/ResultadosPacientes/carga-resultados/carga-resultados.component';
import { ConsultaResultadosComponent } from './views/Paternidad/ResultadosPacientes/consulta-resultados/consulta-resultados.component';
import { EtiquetasComponent } from './views/etiquetas/etiquetas.component';
import { AbonoEntidadesComponent } from './views/Abonos/AbonosEntidades/abono-entidades/abono-entidades.component';
import { AbonoTercerosComponent } from './views/Abonos/AbonosTerceros/abono-terceros/abono-terceros.component';
import { CrearAbonoComponent } from './views/Abonos/CrearAbono/crear-abono/crear-abono.component';
import { ReporteFormulariosComponent } from './views/Ventas/reporte-formulario/reporte-formularios/reporte-formularios.component';

const app_routes: Routes = [
  // INGRESO O AUTENTICACIÓN
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'cambiar-contrasena/:usuario', component: CambiarContrasenaComponent },
  // HOME
  { path: 'home', component: HomeComponent },
  //PACIENTES
  { path: 'pacientes', component: PacientesComponent, data: { breadcrumb: 'Preatención > Pacientes'}, canActivate: [AuthGuard] },
  // COTIZACIÓN
  { path: 'cotizacion', component: CotizacionComponent,data: { breadcrumb: 'Cotización > Crear cotización'}, canActivate: [AuthGuard] },
  { path: 'historial-cotizacion', component: HistorialCotizacionComponent,data: { breadcrumb: 'Cotización > Historial de cotización'}, canActivate: [AuthGuard] },
  { path: 'cotizacion-rapida', component: CotizacionRapidaComponent, data: { breadcrumb: 'Cotización > Cotización rápida' }, canActivate: [AuthGuard] },
  // VENTAS
  { path: 'ventas', component: VentasComponent, data: { breadcrumb: 'Ventas > Ventas'}, canActivate: [AuthGuard] },
  { path: 'grupo-familiar', component: GrupoFamiliarComponent, data: { breadcrumb: 'Ventas > Grupo familiar'}, canActivate: [AuthGuard] },
  { path: 'reporte-ventas', component: ReporteVentasComponent, data: { breadcrumb: 'Ventas > Reporte de ventas'}, canActivate: [AuthGuard] },
  //FACTURACIÓN 
  { path: 'facturacion', component: FacturacionComponent, data: { breadcrumb: 'Facturación > Generar facturación'}, canActivate: [AuthGuard] },
  { path: 'anulacion', component: AnulacionComponent, data: { breadcrumb: 'Facturación > Anulación' }, canActivate: [AuthGuard] },
  // RESULTADOS
  { path: 'recepcion-resultados', component: RecepcionResultadosComponent, data: { breadcrumb: 'Resultados > Recepción de resultados' }, canActivate: [AuthGuard] },
  { path: 'resultados-paciente', component: ResultadosPacienteComponent, data: { breadcrumb: 'Resultados > Resultados paciente' }, canActivate: [AuthGuard] },
  // ARQUEO
  { path: 'arqueo', component: ArqueoComponent, data: { breadcrumb: 'Arqueo > Generar arqueo' }, canActivate: [AuthGuard] },
  // ADMINISTRACIÓN
  { path: 'crear-usuario', component: CrearUsuarioComponent, data: { breadcrumb: 'Administración > Crear usuario' }, canActivate: [AuthGuard] },
  { path: 'creacion-modulo', component: CreacionModuloComponent, data: { breadcrumb: 'Administración > Crear módulo' }, canActivate: [AuthGuard] },
  { path: 'creacion-submodulo', component: CreacionSubmoduloComponent, data: { breadcrumb: 'Administración > Crear sub-módulo' }, canActivate: [AuthGuard] },
  { path: 'creacion-perfil', component: CreacionPerfilComponent, data: { breadcrumb: 'Administración > Crear perfil' }, canActivate: [AuthGuard] },
  { path: 'creacion-sede', component: CrearSedesComponent, data: { breadcrumb: 'Administración > Crear sede' }, canActivate: [AuthGuard] },
  // PARAMETRIZACIÓN
  { path: 'Tarifas', component: TarifasComponent, data: { breadcrumb: 'Parametrización > Tarifas' }, canActivate: [AuthGuard] },
  { path: 'cargue-tarifas', component: CargueTarifasComponent, data: { breadcrumb: 'Parametrización > Tarifas > Cargue de tarifas' }, canActivate: [AuthGuard] },
  { path: 'examenes', component: ExamenesComponent, data: { breadcrumb: 'Parametrización > Exámenes' }, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, data: { breadcrumb: 'Parametrización > Categorias' }, canActivate: [AuthGuard] },
  { path: 'chequeos', component: ChequeosComponent, data: { breadcrumb: 'Parametrización > Chequeos' }, canActivate: [AuthGuard] },
  { path: 'planes', component: PlanesComponent, data: { breadcrumb: 'Parametrización > Planes' }, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClientesComponent, data: { breadcrumb: 'Parametrización > Clientes' }, canActivate: [AuthGuard] },
  { path: 'TipoServicio', component: TipoServicioComponent, data: { breadcrumb: 'Parametrización > Tipo de servicio' }, canActivate: [AuthGuard] },
  { path: 'excepciones-plan', component: ExcepcionesPlanComponent, data: { breadcrumb: 'Parametrización > Crear excepción' }, canActivate: [AuthGuard] },
  // AUDITORIA
  { path: 'log-sistema', component: LogSistemaComponent, data: { breadcrumb: 'Auditoria > Log del sistema' }, canActivate: [AuthGuard] },
  // REPORTES 
  { path: 'reporte-tipo', component: ReporteTipoComponent, data: { breadcrumb: 'Reportes > Generar reporte' }, canActivate: [AuthGuard] },
  // PATERNIDAD
  { path: 'registro-pacientes', component: RegistroPacientesComponent, data: { breadcrumb: 'Paternidad > Registro de pacientes' }, canActivate: [AuthGuard] },
  { path: 'gestion-solicitudes', component: GestionSolicitudesComponent, data: { breadcrumb: 'Paternidad > Gestión de solicitudes' }, canActivate: [AuthGuard] },
  { path: 'cargar-resultados', component: CargaResultadosComponent, data: { breadcrumb: 'Paternidad > Resultados pacientes > Carga de resultados' }, canActivate: [AuthGuard] },
  { path: 'consulta-resultados', component: ConsultaResultadosComponent, data: { breadcrumb: 'Paternidad > Resultados pacientes > Consulta de resultados' }, canActivate: [AuthGuard] },
  // ETIQUETAS
  { path: 'impresion-etiquetas', component: EtiquetasComponent, data: { breadcrumb: 'Etiquetas > Impresión de etiquetas' }, canActivate: [AuthGuard] },

  { path: 'crear-abono', component: CrearAbonoComponent, data: { breadcrumb: 'Abonos > Crear abono' }, canActivate: [AuthGuard] },
  { path: 'abono-entidades', component: AbonoEntidadesComponent, data: { breadcrumb: 'Abonos > Abonos entidades' }, canActivate: [AuthGuard] },
  { path: 'abono-terceros', component: AbonoTercerosComponent, data: { breadcrumb: 'Abonos > Abonos terceros' }, canActivate: [AuthGuard] },
  { path: 'reporte-formularios', component: ReporteFormulariosComponent, data: { breadcrumb: 'Ventas > Reporte formularios covid' }, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: '/login' },
];

// tslint:disable-next-line: variable-name
export const app_routing = RouterModule.forRoot(app_routes, {
  relativeLinkResolution: 'legacy',
});
