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

    // Query the 'servers' collection to get the maximum ID value
    serverRef
      .orderBy('id', 'desc')
      .limit(1)
      .get()
      .then((querySnapshot) => {
        let nextId = 1;
        if (!querySnapshot.empty) {
          // Get the maximum ID value and add 1 to get the next ID
          nextId = querySnapshot.docs[0].data()['id'] + 1;
        }

        // Crear un nuevo documento con los datos del formulario y el siguiente ID
        console.log('before add serverRef');
        serverRef
          .add({
            id: nextId,
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
      })
      .catch((error) => {
        console.error('Error getting maximum ID value: ', error);
      });
  }
}
