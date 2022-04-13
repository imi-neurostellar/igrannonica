import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/_services/signal-r.service';
import Notification from 'src/app/_data/Notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  closed: boolean = false;

  constructor(private signalRService: SignalRService) {

  }

  ngOnInit(): void {
    if (this.signalRService.hubConnection) {
      this.signalRService.hubConnection.on("NotifyDataset", (message: string) => {
        this.notifications.push(new Notification(message, "datasetIDOvde!!!", 1.0));
      });

      this.signalRService.hubConnection.on("NotifyEpoch", (message: string) => {
        this.notifications.push(new Notification(message, "predictorIDOvde!!!", 0.5 /*(epoch / model.epochs)*/));
      });
    } else {
      console.warn("Notifications: No connection!");
    }
  }

}
