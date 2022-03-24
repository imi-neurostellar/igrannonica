import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/_services/web-socket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private wsService: WebSocketService) { }

  ngOnInit(): void {
    // this.wsService.send('test');
  }

}
