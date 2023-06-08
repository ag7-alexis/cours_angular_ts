import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { JobsService } from 'src/app/services/jobs.service';
import { SavedJobOfferSandbox } from './saved-job-offers.sandbox';

@Component({
  selector: 'app-saved-job-offers',
  templateUrl: './saved-job-offers.component.html',
  styleUrls: ['./saved-job-offers.component.scss'],
  providers: [SavedJobOfferSandbox, JobsService],
})
export class SavedJobOffersComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  savedJobOfferId = this.route.snapshot.paramMap.get('savedJobOfferId');

  private readonly sandbox = inject(SavedJobOfferSandbox);
  state = this.sandbox.state;

  @ViewChild('dialogContent', { static: true }) dialogContent:
    | ElementRef
    | undefined;

  private readonly dialogs: TuiDialogService = inject(TuiDialogService);

  constructor() {
    this.sandbox.initialize(this.savedJobOfferId);

    effect(async () => {
      if (this.state().selectedSavedJobOffer) {
        this.dialogs.open(this.dialogContent).subscribe({
          complete: () => this.router.navigate(['/saved-job-offers']),
        });
      }
    });
  }

  deleteSavedJobOffer() {
    this.sandbox.deleteSavedJobOffer();
  }
}
