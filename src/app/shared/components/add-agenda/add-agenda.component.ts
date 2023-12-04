import { Component, OnInit, Input, inject } from '@angular/core';
import { Agenda } from 'src/app/model/agenda';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/model/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.component.html',
  styleUrls: ['./add-agenda.component.scss'],
})

export class AddAgendaComponent implements OnInit {

  @Input() agenda: Agenda;
  esPaciente: boolean = false; // Variable para verificar si el usuario es pasajero
  esConductor: boolean = false;
  esAdmin: boolean = false;
  agendas: Agenda[] = [];
  medicos: User[] = []

  form = new FormGroup({
    AId: new FormControl(''),
    medico: new FormControl('', [Validators.required, Validators.minLength(5)]),
    hora: new FormControl('', [Validators.required]),
    horaT: new FormControl('', [Validators.required]),
    dia: new FormControl('', Validators.required)
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  ngOnInit() {
    let user1 = this.utilsSvc.getFromLocalStorage('user');

    if (user1.role == 'Conductor') this.esConductor = true;
    else this.esAdmin = true;
  }

  submit() {
    if (this.form.valid) {
      if (this.agenda) this.updateSalida();
      else this.crearSalida();
    }
  }

  ionViewWillEnter() {
    let user1 = this.utilsSvc.getFromLocalStorage('user');
    let usu = user1.name;
    this.getUsuario();
    this.getProductos();
  }

  async crearSalida() {
    const path = 'agenda'; // Ajusta la ruta según la estructura de tu base de datos

    const loading = await this.utilsSvc.loading();
    await loading.present();


    delete this.form.value.AId;

    try {
      await this.firebaseSvc.addDocumento(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Salida agregada correctamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  async updateSalida() {
    let path = `agenda/${this.agenda.AId}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.AId;

    try {
      await this.firebaseSvc.updateDocument(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Salida actualizada correctamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  getProductos() {
    let path = 'agenda';
    let user = this.utilsSvc.getFromLocalStorage('user');
    this.firebaseSvc.getColectionData(path).subscribe({
      next: (res: any[]) => {
        if (user.role === 'x') {
          this.agendas = res.filter((p) => p.medico === user.name);
          console.log(this.agendas)
        }
        else {
          this.agendas = res;
        }
      },
      error: (err) => {
        // Manejar errores si es necesario
      },
    });
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
