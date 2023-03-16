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

  constructor(
    private serversService: ServersService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    console.log('ngOnInit');

    /*     this.serversService.getServers().subscribe((servers) => {
      console.log('ServT: ', servers);
    });

    this.usersService.getUsers().subscribe((users) => {
      console.log('UsrT: ', users);
    }); */

    forkJoin([
      this.serversService.getServers().pipe(take(1)),
      this.usersService.getUsers().pipe(take(1)),
    ]).subscribe((results) => {
      const [servers, users] = results;

      const combinedData: any[] = [];

      servers.forEach((server) => {
        const matchingUser = users.find((user) => user.id === server.id);
        if (matchingUser) {
          const combinedInfo = { ...server, ...matchingUser };
          combinedData.push(combinedInfo);
        }
      });

      this.cardInfo = combinedData;
      console.log('Combined data: ', combinedData);
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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
