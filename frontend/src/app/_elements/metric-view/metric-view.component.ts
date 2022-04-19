import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/_services/signal-r.service';
@Component({
  selector: 'app-metric-view',
  templateUrl: './metric-view.component.html',
  styleUrls: ['./metric-view.component.css']
})
export class MetricViewComponent implements OnInit {
  myAcc:[]=[];
  myMae:[]=[];
  myMse:[]=[];
  myEpochs:[]=[];
  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    if(this.signalRService.hubConnection)
      {
        this.signalRService.hubConnection.on("NotifyEpoch", (mName: string, mId: string, stat: string, totalEpochs: number, currentEpoch: number) => {
        //console.log(stat)
        //console.log(totalEpochs)
        const data=JSON.parse(stat)
        for (let key in data) 
        {
          let value = data[key];
          //console.log(value)
        }
      });
      
    }

  }
}
