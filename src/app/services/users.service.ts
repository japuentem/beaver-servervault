import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private firestore: firebase.firestore.Firestore;

  constructor() {
    const firebaseApp = firebase.initializeApp(environment.firebaseConfig);
    this.firestore = firebaseApp.firestore();
  }

  // Method to get server list
  getUsers(): Observable<any[]> {
    return new Observable((observer) => {
      this.firestore.collection('users').onSnapshot((querySnapshot) => {
        const users: any[] = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        observer.next(users);
      });
    });
  }
}
