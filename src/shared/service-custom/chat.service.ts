import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { MessageDto } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';
import { Message } from '../Custom-Model/message';



@Injectable()
export class ChatService {
  // messageReceived = new EventEmitter<MessageDto>();
  // connectionEstablished = new EventEmitter<Boolean>();
  currentMessageSubject = new Subject();
  // private connectionIsEstablished = false;
  // private _hubConnection: HubConnection;

  constructor() {
    // this.createConnection();
    // this.registerOnServerEvents();
    // this.startConnection();
  }

  // sendMessage(message: MessageDto) {
  //   this._hubConnection.invoke('NewMessage', message);
  // }

  // private createConnection() {
  //   // this._hubConnection = new HubConnectionBuilder()
  //   //   .withUrl(window.location.href + 'MessageHub')
  //   //   .build();

  //      this._hubConnection = new HubConnectionBuilder()
  //     .withUrl('https://localhost:44311/'+ 'MessageHub')
  //     .build();
  // }

  // private startConnection(): void {
  //   this._hubConnection
  //     .start()
  //     .then(() => {
  //       this.connectionIsEstablished = true;
  //       console.log('Hub connection started');
  //       this.connectionEstablished.emit(true);
  //     })
  //     .catch(err => {
  //       console.log('Error while establishing connection, retrying...');
  //       setTimeout(function () { this.startConnection(); }, 5000);
  //     });
  // }

  // private registerOnServerEvents(): void {
  //   this._hubConnection.on('MessageReceived', (data: any) => {
  //     this.messageReceived.emit(data);
  //   });
  // }
}
