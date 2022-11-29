import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { app_routing } from './app.routes';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CrearUsuarioComponent } from './views/crear-usuario/crear-usuario.component';
import { MenuComponent } from './shared/menu/menu.component';
import { LoginComponent } from './views/Inicio_de_sesion/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { RecuperarComponent } from './views/Inicio_de_sesion/recuperar/recuperar.component';
import { CambiarContrasenaComponent } from './views/Inicio_de_sesion/cambiar-contrasena/cambiar-contrasena.component';
import { CreacionModuloComponent } from './views/creacion-modulo/creacion-modulo.component';

import { CreacionSubmoduloComponent } from './views/creacion-submodulo/creacion-submodulo.component';
import { CreacionPerfilComponent } from './views/creacion-perfil/creacion-perfil.component';
import { LogSistemaComponent } from './views/log-sistema/log-sistema.component';
import { CrearSedesComponent } from './views/creacion-sede/crear-sedes.component';
import { FilterPipe } from './pipes/filter.pipe';
import { PacientesComponent } from './views/pacientes/pacientes.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreadcrumbModule } from 'angular-crumbs';

import { FilterMenuPipe } from './pipes/filter-menu.pipe';
import { TarifasComponent } from './views/Tarifas/tarifas.component';
import { VentasComponent } from './views/ventas/ventas.component';
import { ChequeosComponent } from './views/chequeos/chequeos.component';
import { ExamenesComponent } from './views/examenes/examenes.component';
import { CategoriasComponent } from './views/categorias/categorias.component';
import { FilterExamesPipe } from './pipes/filter-exames.pipe';
import { ClientesComponent } from './views/clientes/clientes.component';
import { PlanesComponent } from './views/planes/planes.component';
import { FilterProcedimientosPipe } from './pipes/filter-procedimientos.pipe';
import { FacturacionComponent } from './views/facturacion/facturacion.component';
import { TipoServicioComponent } from './views/TipoServicio/TipoServicio.component';
import { FilterCategoriasPipe } from './pipes/filter-categorias.pipe';
import { FilterClientesPipe } from './pipes/filter-clientes.pipe';
import { FilterPlanesPipe } from './pipes/filter-planes.pipe';
import { FilterChequeosPipe } from './pipes/filter-chequeos.pipe';
import { FilterTarifasPipe } from './pipes/filter-tarifas.pipe';
import { FilterTipoServicesPipe } from './pipes/filter-tipo-services.pipe';
import { FilterPerfilesPipe } from './pipes/filter-perfiles.pipe';
import { FilterSedesPipe } from './pipes/filter-sedes.pipe';
import { FilterModulosPipe } from './pipes/filter-modulos.pipe';
import { FilterUsuariosPipe } from './pipes/filter-usuarios.pipe';
import { FilterSubModulosPipe } from './pipes/filter-sub-modulos.pipe';
import { ArqueoComponent } from './views/arqueo/arqueo.component';
import { RecepcionResultadosComponent } from './views/Resultados/recepcion-resultados/recepcion-resultados.component';
import { ResultadosPacienteComponent } from './views/Resultados/resultados-paciente/resultados-paciente.component';
import { CotizacionComponent } from './views/cotizaciones/cotizacion/cotizacion.component';
import { HistorialCotizacionComponent } from './views/cotizaciones/historial-cotizacion/historial-cotizacion.component';
import { CotizacionRapidaComponent } from './views/cotizaciones/cotizacion-rapida/cotizacion-rapida.component';
import { CargueTarifasComponent } from './views/Tarifas/cargue-tarifas/cargue-tarifas.component';

import  {  NgIdleKeepaliveModule  }  from  '@ng-idle/keepalive' ;
import { ModalModule } from 'ngx-bootstrap/modal';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import localeCo from '@angular/common/locales/es-CO';
import { ExcepcionesPlanComponent } from './views/ExcepcionesPlan/excepciones-plan/excepciones-plan.component';
import { ReporteTipoComponent } from './views/Reportes/reporte-tipo/reporte-tipo.component';
import { AnulacionComponent } from './views/Facturacion/Anulacion/anulacion/anulacion.component';
import { GrupoFamiliarComponent } from './views/ventas/GrupoFamiliar/grupo-familiar/grupo-familiar.component';

import { RegistroPacientesComponent } from './views/Paternidad/Registro/registro-pacientes/registro-pacientes.component';
import { FilterCargaPipe } from './pipes/filter-carga.pipe';
import { ReporteVentasComponent } from './views/ventas/reporte-ventas/reporte-ventas.component';
import {AlifeFileToBase64Module}from 'alife-file-to-base64';
import { SignaturePadModule } from 'angular2-signaturepad';
import { GestionSolicitudesComponent } from './views/Paternidad/GestionSolicitudes/gestion-solicitudes/gestion-solicitudes.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { CargaResultadosComponent } from './views/Paternidad/ResultadosPacientes/carga-resultados/carga-resultados.component';
import { ConsultaResultadosComponent } from './views/Paternidad/ResultadosPacientes/consulta-resultados/consulta-resultados.component';
import { EtiquetasComponent } from './views/etiquetas/etiquetas.component';
import { OnlyModule } from './directives/only-directive.module';
import { ExcepExamPipe } from './pipes/excep-exam.pipe';
import { CrearAbonoComponent } from './views/Abonos/CrearAbono/crear-abono/crear-abono.component';
import { AbonoEntidadesComponent } from './views/Abonos/AbonosEntidades/abono-entidades/abono-entidades.component';
import { AbonoTercerosComponent } from './views/Abonos/AbonosTerceros/abono-terceros/abono-terceros.component';
import { ReporteFormulariosComponent } from './views/Ventas/reporte-formulario/reporte-formularios/reporte-formularios.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

PdfMakeWrapper.setFonts(pdfFonts);
registerLocaleData(localeCo);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    RecuperarComponent,
    CrearUsuarioComponent,
    CambiarContrasenaComponent,
    CreacionModuloComponent,
    CreacionSubmoduloComponent,
    CreacionPerfilComponent,
    LogSistemaComponent,
    CrearSedesComponent,
    FilterPipe,
    PacientesComponent,
    FilterMenuPipe,
    TarifasComponent,
    VentasComponent,
    ChequeosComponent,
    ExamenesComponent,
    CategoriasComponent,
    FilterExamesPipe,
    ClientesComponent,
    PlanesComponent,
    FilterProcedimientosPipe,
    FacturacionComponent,
    TipoServicioComponent,
    FilterCategoriasPipe,
    FilterClientesPipe,
    FilterPlanesPipe,
    FilterChequeosPipe,
    FilterTarifasPipe,
    FilterTipoServicesPipe,
    FilterPerfilesPipe,
    FilterSedesPipe,
    FilterModulosPipe,
    FilterUsuariosPipe,
    FilterSubModulosPipe,
    ArqueoComponent,
    RecepcionResultadosComponent,
    ResultadosPacienteComponent,CotizacionComponent,HistorialCotizacionComponent,CotizacionRapidaComponent, CargueTarifasComponent, RegistroPacientesComponent,
    ExcepcionesPlanComponent, ReporteTipoComponent, AnulacionComponent, GrupoFamiliarComponent, FilterCargaPipe, ReporteVentasComponent, GestionSolicitudesComponent, CargaResultadosComponent, ConsultaResultadosComponent, EtiquetasComponent,
    ExcepExamPipe,
    CrearAbonoComponent,
    AbonoEntidadesComponent,
    AbonoTercerosComponent,
    ReporteFormulariosComponent
  ],
  imports: [
    OnlyModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    FontAwesomeModule,
    AutocompleteLibModule,
    app_routing, NgIdleKeepaliveModule.forRoot(),ModalModule.forRoot(),
    AlifeFileToBase64Module,
    SignaturePadModule, NgxBarcodeModule,
    MatDialogModule, MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
