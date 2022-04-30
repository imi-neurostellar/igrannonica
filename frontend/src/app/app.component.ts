import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from './_services/auth.service';
import { SignalRService } from './_services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import Shared from './Shared';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private titleService: Title, private authService: AuthService, private signalRService: SignalRService, private http: HttpClient) {

  }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(`${title} - Igrannonica`);
        }
      });
    if (!this.authService.isAuthenticated()) {
      if(!this.authService.alreadyGuest())
        this.authService.addGuestToken();
    }
    this.signalRService.startConnection();
    //this.startHttpRequest();
  }
}
