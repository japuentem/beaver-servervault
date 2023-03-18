import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ServersService } from '../../services/servers.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { environment } from '../../../environments/environment'; // Importar environment

interface Server {
  id: string;
  title: string;
  ip: string;
  hostname: string;
  notes: string;
}
@Component({
  selector: 'app-server-user',
  templateUrl: './server-user.page.html',
  styleUrls: ['./server-user.page.scss'],
})
export class ServerUserPage implements OnInit {
  // Declare formulary variables
  serverList: any[] = [];
  selectedServer?: Server;

  id?: number = 0;
  user?: string;
  password?: string;
  duedate?: string;

  constructor(
    private serversService: ServersService,
    private navCtrl: NavController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.serversService.getServers().subscribe((servers) => {
      this.serverList = servers.map((servers) => {
        return {
          id: servers.id,
          title: servers.title,
        };
      });
    });
  }

  onServerSelected(event: any) {
    if (this.selectedServer) {
      console.log('Selected Server Text: ', this.selectedServer.title);
      console.log('Selected Server Value: ', this.selectedServer.id);
      this.id = parseInt(this.selectedServer.id, 10);
    }
  }

  // Método que se llama al hacer clic en el botón ion-fab-button
  addUserServer() {
    console.log('in addServer');

    firebase.initializeApp(environment.firebaseConfig); // Inicializar Firebase
    // Crear una referencia a la colección 'tasks' en Firebase 11
    const db = firebase.firestore();
    const userRef = db.collection('users');

    // Validar que todos los campos tengan un valor definido
    if (!this.user || !this.password || !this.duedate) {
      console.error(
        'Error adding user info in Firebase: Some fields are missing'
      );
      return;
    }

    // Crear un nuevo documento con los datos del formulario
    console.log('before add serverRef');
    userRef
      .add({
        id: this.id,
        user: this.user,
        password: this.password,
        duedate: this.duedate,
      })
      .then(() => {
        console.log('Server added in Firebase');
        // Clean formulary fields after saving data
        this.id = 0;
        this.user = '';
        this.password = '';
        this.duedate = '';
        this.navCtrl.navigateBack('/main?timestamp=' + new Date().getTime());
      })
      .catch((error) => {
        console.error('Error adding server info in Firebase: ', error);
      });
  }
}
