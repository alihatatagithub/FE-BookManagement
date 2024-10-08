// app-signalr.service.ts

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppSignalRService {
  private hubConnection: signalR.HubConnection;
  EndPointBase: string = environment.apiBaseUrl;


  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.EndPointBase+'employeeHub') // SignalR hub URL
      .build();
  }

  startConnection(): Observable<void> {
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('Connection established with SignalR hub');
          observer.next();
          observer.complete();
        })
        .catch((error:any) => {
          console.error('Error connecting to SignalR hub:', error);
          observer.error(error);
        });
    });
  }

  receive(): Observable<string> {
    return new Observable<string>((observer) => {
      this.hubConnection.on('Receive', (message: string) => {
        observer.next(message);
      });
    });
  }

  addEmployeeNotifer(message:string): void {
    this.hubConnection.invoke('AddEmployeeNotifer',message);
  }
}