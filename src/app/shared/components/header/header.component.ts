import { Component, Input, OnInit, inject } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateSalidaComponent } from '../add-update-salida/add-update-salida.component';
import { Salida } from 'src/app/model/salida.model';
import { AddAgendaComponent } from '../add-agenda/add-agenda.component';
import { FinanzasComponent } from '../finanzas/finanzas.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  esPaciente: boolean = false; // Variable para verificar si el usuario es pasajero
  esConductor: boolean = false;
  esAdmin: boolean = false;

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() IsModal!: boolean;
  @Input() closeButton!: boolean;

  close= false;

  utilsSvc = inject(UtilsService)

  ngOnInit() {}

  dissmissModal() {
    this.utilsSvc.dismissModal();
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  async addaGENDA(salida?: Salida) {
    let success = await this.utilsSvc.presentAgenda({
      component: AddAgendaComponent,
      cssClass: 'add-update-modal',
      componentProps: { salida },
    });
  }

  async finanza(salida?: Salida) {
    let success = await this.utilsSvc.presentFinanza({
      component: FinanzasComponent,
      cssClass: 'add-update-modal',
      componentProps: { salida },
    });
  }
}
