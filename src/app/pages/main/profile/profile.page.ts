import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { Salida } from 'src/app/model/salida.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateSalidaComponent } from 'src/app/shared/components/add-update-salida/add-update-salida.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  esPaciente: boolean = false; // Variable para verificar si el usuario es pasajero
  esConductor: boolean = false;
  esAdmin: boolean = false;

  usuario = '';
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
}
