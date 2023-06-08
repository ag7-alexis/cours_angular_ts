import { Injectable, signal } from '@angular/core';
import {
  EMPTY,
  NEVER,
  catchError,
  map,
  of,
  race,
  switchMap,
  tap,
  timeout,
} from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';
import {
  JobOffer,
  JobProfessionDetails,
  SavedJobOffer,
} from 'src/app/services/jobs.services.types';

class JobOffersState {
  private constructor(
    readonly mode: 'loading' | 'loaded' | 'error' | 'error-timeout',
    readonly status:
      | 'none'
      | 'inititialize'
      | 'loaded'
      | 'error'
      | 'save-job-offer-ongoing'
      | 'save-job-offer-done'
      | 'save-job-offer-error',
    readonly profession: string | undefined,
    readonly jobOffers: JobOffer[],
    readonly selectedJobOffer: JobOffer | undefined
  ) {}

  private withValues(values: Partial<JobOffersState>) {
    return new JobOffersState(
      values.mode ?? this.mode,
      values.status ?? this.status,
      values.profession ?? this.profession,
      values.jobOffers ?? this.jobOffers,
      values.selectedJobOffer ?? this.selectedJobOffer
    );
  }

  static initialize() {
    return new JobOffersState('loading', 'none', undefined, [], undefined);
  }

  loading(profession: string) {
    return new JobOffersState(
      'loading',
      'inititialize',
      profession,
      [],
      this.selectedJobOffer
    );
  }

  loaded(jobOffers: JobOffer[]) {
    if (!this.profession) {
      throw new Error('Unexpeted undefined profession');
    }
    return new JobOffersState(
      'loaded',
      'loaded',
      this.profession,
      jobOffers,
      this.selectedJobOffer
    );
  }

  error() {
    return this.withValues({
      mode: 'error',
      status: 'error',
    });
  }

  timeoutError() {
    return this.withValues({
      mode: 'error-timeout',
      status: 'error',
    });
  }

  selectJobOffer(selectedJobOffer: JobOffer) {
    return this.withValues({
      selectedJobOffer,
    });
  }

  unselectJobOffer() {
    return new JobOffersState(
      this.mode,
      this.status,
      this.profession,
      this.jobOffers,
      undefined
    );
  }

  ongoingSaveJobOffer() {
    if (undefined === this.selectedJobOffer) {
      throw new Error('Unexpeted undefined selectedJobOffer');
    }

    return this.withValues({
      status: 'save-job-offer-ongoing',
    });
  }

  doneSaveJobOffer() {
    return this.withValues({
      status: 'save-job-offer-done',
    });
  }

  errorSaveJobOffer() {
    return this.withValues({
      status: 'save-job-offer-error',
    });
  }
}

@Injectable()
export class JobOffersSandbox {
  state = signal(JobOffersState.initialize());

  constructor(private readonly jobsService: JobsService) {}

  initialize(profession: string) {
    this.state.update((s) => s.loading(profession));

    try {
      race(
        NEVER.pipe(
          timeout(30000),
          tap({ error: () => this.state.update((s) => s.timeoutError()) }),
          catchError(() => EMPTY)
        ),
        this.jobsService.retrieveProfession(profession)
      )
        .pipe(
          switchMap((professionDetails: JobProfessionDetails) =>
            this.jobsService.retrieveJobOffers(professionDetails.romes)
          ),
          tap({
            next: (jobOffers) => this.state.update((s) => s.loaded(jobOffers)),
            error: () => this.state.update((s) => s.error()),
          })
        )
        .subscribe();
    } catch (e) {
      console.error(e);
      this.state.update((s) => s.error());
    }
  }

  selectJobOffer(jobOffer: JobOffer) {
    this.state.update((s) => s.selectJobOffer(jobOffer));
  }

  unselectJobOffer() {
    this.state.update((s) => s.unselectJobOffer());
  }

  saveJobOffer() {
    this.state.update((s) => s.ongoingSaveJobOffer());

    try {
      const savedJobOfferCandidate: Partial<SavedJobOffer> = {
        jobOffer: this.state().selectedJobOffer,
        commentary: '',
      };
      return this.jobsService.createSavedJobOffer(savedJobOfferCandidate).pipe(
        tap({
          next: (r) => this.state.update((s) => s.doneSaveJobOffer()),
          error: () => this.state.update((s) => s.errorSaveJobOffer()),
        }),
        map((d) => d.id)
      );
    } catch (_) {
      this.state.update((s) => s.errorSaveJobOffer());
      return EMPTY;
    }
  }
}
