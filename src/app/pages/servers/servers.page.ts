import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { environment } from '../../../environments/environment'; // Importar environment

@Component({
  selector: 'app-servers',
  templateUrl: './servers.page.html',
  styleUrls: ['./servers.page.scss'],
})
export class ServersPage implements OnInit {
  // Declare formulary variables
  id: number = 0;
  title?: string;
  ip?: string;
  hostname?: string;
  notes?: string;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  // Método que se llama al hacer clic en el botón ion-fab-button
  addServer() {
    console.log('in addServer');

    firebase.initializeApp(environment.firebaseConfig); // Inicializar Firebase
    // Crear una referencia a la colección 'tasks' en Firebase 11
    const db = firebase.firestore();
    const serverRef = db.collection('servers');

    // Validar que todos los campos tengan un valor definido
    if (!this.title || !this.ip || !this.hostname || !this.notes) {
      console.error(
        'Error adding server info in Firebase: Some fields are missing'
      );
      return;
    }

    // Crear un nuevo documento con los datos del formulario
    console.log('before add serverRef');
    serverRef
      .add({
        id: 0,
        title: this.title,
        ip: this.ip,
        hostname: this.hostname,
        notes: this.notes,
      })
      .then(() => {
        console.log('Server added in Firebase');
        // Clean formulary fields after saving data
        this.id = 0;
        this.title = '';
        this.ip = '';
        this.hostname = '';
        this.notes = '';
        this.navCtrl.navigateBack('/main');
      })
      .catch((error) => {
        console.error('Error adding server info in Firebase: ', error);
      });
  }
}
