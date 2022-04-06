import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/_services/web-socket.service';
import Notification from 'src/app/_data/Notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications?: Notification[];
  closed: boolean = false;

  constructor(private wsService: WebSocketService) {
    this.notifications = [
      new Notification("Titanik (Preziveli)", "79768456867", 0.2),
      new Notification("Test Prediktor 1", "56758768678", 0.4),
      new Notification("Test Prediktor 2", "11344556425", 0.7)
    ]
  }

  ngOnInit(): void {
    // this.wsService.send('test');
  }

}
