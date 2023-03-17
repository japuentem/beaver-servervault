import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, take } from 'rxjs';
import { ServersService } from '../../services/servers.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  servers: any[] = [];
  users: any[] = [];

  cardInfo: any[] = [];
  showPassword = false;

  passwordVisibility: { [key: string]: boolean } = {};

  constructor(
    private serversService: ServersService,
    private usersService: UsersService
  ) {
    /*     this.serversService.getServers().subscribe((servers) => {
      console.log('ServT: ', servers);
    });

    this.usersService.getUsers().subscribe((users) => {
      console.log('UsrT: ', users);
    }); */
    this.ngOnInit();
  }

  ngOnInit() {
    console.log('ngOnInit');

    forkJoin([
      this.serversService.getServers().pipe(take(1)),
      this.usersService.getUsers().pipe(take(1)),
    ]).subscribe((results) => {
      const [servers, users] = results;

      const combinedData: any[] = [];

      servers.forEach((server) => {
        const matchingUsers = users.filter((user) => user.id === server.id);
        if (matchingUsers && matchingUsers.length > 0) {
          const usersData: any[] = [];
          matchingUsers.forEach((user) => {
            const userData = {
              user: user.user,
              password: user.password,
              duedate: user.duedate,
              ...server,
            };
            usersData.push(userData);
          });
          combinedData.push(...usersData);
        } else {
          const serverData = {
            user: '',
            password: '',
            duedate: '',
            ...server,
          };
          combinedData.push(serverData);
        }
      });

      console.log('Combined data: ', combinedData);
      this.cardInfo = combinedData;
    });
  }

  togglePassword(card: number) {
    console.log('card.id: ', card);

    this.passwordVisibility[card] = !this.passwordVisibility[card];
  }

  getUsers() {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
      console.log(this.users);
    });
  }

  getServers() {
    this.serversService.getServers().subscribe((servers) => {
      this.servers = servers;
      console.log(this.servers);
    });
  }
}
