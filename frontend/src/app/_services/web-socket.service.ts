import { Injectable } from '@angular/core';
import { ConstantBackoff, Websocket, WebsocketBuilder } from 'websocket-ts';
import { API_SETTINGS } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  ws?: Websocket;

  private handlers: Function[] = [];

  constructor() {
    this.ws = new WebsocketBuilder(API_SETTINGS.apiWSUrl)
      .withBackoff(new ConstantBackoff(120000))
      .onOpen((i, e) => { /*console.log('WS: Connected to ' + API_SETTINGS.apiWSUrl)*/ })
      .onMessage((i, e) => {
        console.log('WS MESSAGE: ', e.data);
        this.handlers.forEach(handler => {
          handler(e.data);
        })
      })
      .onClose((i, e) => { /*console.log('WS: Connection closed!')*/ })
      .build();
  }

  send(msg: string) {
    this.ws?.send(msg);
  }

  addHandler(handler: Function) {
    this.handlers.push(handler);
  }

  removeHandler(handler: Function) {
    this.handlers.splice(this.handlers.indexOf(handler), 1);
  }
}
