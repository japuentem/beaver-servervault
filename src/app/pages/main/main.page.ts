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
  filteredServers = [...this.servers];

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
      const serverMap: any = {};

      servers.forEach((server) => {
        serverMap[server.id] = {
          server: server,
          users: [],
        };
      });

      users.forEach((user) => {
        const matchingServer = serverMap[user.id];
        if (matchingServer) {
          matchingServer.users.push({
            id: user.id,
            user: user.user,
            password: user.password,
            duedate: user.duedate,
          });
        }
      });

      for (const key in serverMap) {
        if (serverMap.hasOwnProperty(key)) {
          const serverEntry = serverMap[key];
          const server = serverEntry.server;
          const users = serverEntry.users;

          const combinedEntry: any = {
            ...server,
            users: [],
          };

          if (users.length > 0) {
            users.forEach(
              (user: { id: any; user: any; password: any; duedate: any }) => {
                combinedEntry.users.push({
                  id: user.id,
                  user: user.user,
                  password: user.password,
                  duedate: user.duedate,
                });
              }
            );
          } else {
            combinedEntry.user = '';
            combinedEntry.password = '';
            combinedEntry.duedate = '';
          }

          combinedData.push(combinedEntry);
        }
      }

      console.log('Combined data: ', combinedData);
      this.cardInfo = combinedData;
      this.filteredServers = this.cardInfo;
    });

    /*
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
    }); */
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

  togglePassword(card: number) {
    this.passwordVisibility[card] = !this.passwordVisibility[card];
  }

  trackByFunction(index: number, item: any) {
    return parseInt((item.id + 1).toString() + (index + 1).toString());
  }

  filterServers(event: any) {
    const searchTerm = event.detail.value?.toLowerCase() || ''; // Si event.detail.value es null, asigna una cadena vacía en su lugar
    this.filteredServers =
      searchTerm === ''
        ? this.cardInfo
        : this.cardInfo.filter((card) =>
            card.title.toLowerCase().includes(searchTerm)
          );
  }
}
