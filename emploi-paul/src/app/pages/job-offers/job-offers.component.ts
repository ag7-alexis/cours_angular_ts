import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { tap } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';
import { JobOffer } from 'src/app/services/jobs.services.types';
import { JobOffersSandbox } from './job-offers.sandbox';
import { TuiBaseDialogContext } from '@taiga-ui/cdk';

@Component({
  selector: 'page-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.scss'],
  providers: [JobOffersSandbox, JobsService],
})
export class JobOffersComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  profession = window.atob(this.route.snapshot.paramMap.get('profession')!);

  @ViewChild('dialogContent', { static: true }) dialogContent:
    | ElementRef
    | undefined;

  private readonly sandbox = inject(JobOffersSandbox);
  state = this.sandbox.state;
  constructor() {
    this.sandbox.initialize(this.profession);
    effect(() => {
      if (this.state().selectedJobOffer) {
        this.dialogs.open(this.dialogContent).subscribe({
          complete: () => this.sandbox.unselectJobOffer(),
        });
      }
    });
  }

  private readonly dialogs: TuiDialogService = inject(TuiDialogService);

  showDialog(jobOffer: JobOffer): void {
    this.sandbox.selectJobOffer(jobOffer);
  }

  saveJobOffer() {
    this.sandbox
      .saveJobOffer()
      .pipe(
        tap({
          next: (id) => {
            this.router.navigate(['/saved-job-offers', id]);
          },
        })
      )
      .subscribe();
  }
}
