import { Component, inject } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { HomeSandbox } from './home.sandbox';
import { Router } from '@angular/router';

@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [JobsService, HomeSandbox],
})
export class HomeComponent {
  readonly columns = ['profession', 'action'];
  search = '';

  private readonly sandbox = inject(HomeSandbox);

  state = this.sandbox.state;

  constructor(private readonly router: Router) {
    this.sandbox.initialize();
  }

  goForJobOffers(profession: string) {
    // base64 to prevent problem in routing because no ID provided
    this.router.navigate(['job-offers', window.btoa(profession)]);
  }
}
