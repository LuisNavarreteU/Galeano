import { Component, Input, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'Galeano/src/app/services/firebase.service';
import { User } from 'firebase/auth';
import { Agenda } from 'src/app/model/agenda';
import { Salida } from 'src/app/model/salida.model';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.scss'],
})

export class FinanzasComponent  implements OnInit {

  
  @Input() agenda: Agenda;
  esPaciente: boolean = false; // Variable para verificar si el usuario es pasajero
  esConductor: boolean = false;
  esAdmin: boolean = false;
  medicos: User[] = []


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    let user1 = this.utilsSvc.getFromLocalStorage('user');

    if (user1.role == 'Conductor') this.esConductor = true;
    else this.esAdmin = true;
  }

  submit() {
  }

  ionViewWillEnter() {
    let user1 = this.utilsSvc.getFromLocalStorage('user');
    let usu = user1.name;
    this.getUsuario();
  }

  getUsuario() {
    let path = 'users';
    let user = this.utilsSvc.getFromLocalStorage('user');
    this.firebaseSvc.getColectionData(path).subscribe({
      next: (res: any[]) => {
        this.medicos = res.filter((p) => p.role === "Conductor");
        console.log(this.medicos  )
      },
      error: (err) => {
        // Manejar errores si es necesario
      },
    });
  }

}
