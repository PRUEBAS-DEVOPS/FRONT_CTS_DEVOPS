import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from './services/login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'proyecto';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(
    private router: Router,
    private idle: Idle,
    private keepalive: Keepalive,
    private LoginService: AuthService
  ) {
    idle.setIdle(600);
    // sets a timeout period of 300 seconds. 5 min
    idle.setTimeout(10);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'Ya no estoy inactivo.';
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.childModal.hide();
      this.idleState = 'Timed out!';
      this.timedOut = true;
      sessionStorage.removeItem('Token');
      sessionStorage.removeItem('Usuario');
      sessionStorage.removeItem('Sede');
      sessionStorage.removeItem('menu');
      sessionStorage.removeItem('submenu');
      sessionStorage.removeItem('Rol');
      sessionStorage.removeItem('IdExamCheck');
      sessionStorage.removeItem('Chequeos');
      sessionStorage.removeItem('Examenes');
      sessionStorage.removeItem('ArraySede');
      sessionStorage.removeItem('IdUsuario');
      sessionStorage.removeItem('DatosPaciente');
      sessionStorage.removeItem('Idpaciente');
      sessionStorage.removeItem('LtsOpciones');
      document.getElementById('content').style.marginLeft = '0';
      //document.getElementById('content').style.marginLeft = '0';
      // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      // this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'Se agotara el tiempo en ' + countdown + ' segundos!';
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));
    const token = sessionStorage.getItem('Token');
    if (token != '') {
      idle.watch();
      this.timedOut = false;
    } else {
      idle.stop();
    }
  }

  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
    // (<any>$('#childModal')).modal('hide');
  }

  stay() {
    this.childModal.hide();
    // (<any>$('#childModal')).modal('hide');
    this.reset();
  }

  logout() {
    this.childModal.hide();
    this.timedOut = true;
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('Usuario');
    sessionStorage.removeItem('Sede');
    sessionStorage.removeItem('menu');
    sessionStorage.removeItem('submenu');
    sessionStorage.removeItem('ArraySede');
    sessionStorage.removeItem('Rol');
    sessionStorage.removeItem('IdExamCheck');
    sessionStorage.removeItem('Chequeos');
    sessionStorage.removeItem('Examenes');
    sessionStorage.removeItem('IdUsuario');
    sessionStorage.removeItem('DatosPaciente');
    sessionStorage.removeItem('Idpaciente');
    sessionStorage.removeItem('LtsOpciones');
    //document.getElementById('content').style.marginLeft = '0';
    document.getElementById('content').style.marginLeft = '0';
    this.router.navigate(['/']);
  }

  // tslint:disable-next-line: typedef
  mostrarMenu() {
    if (sessionStorage.getItem('Token')) {
      return true;
    } else {
      return false;
    }
  }
}
