import { Injectable, signal } from '@angular/core';
import { EMPTY, NEVER, catchError, race, tap, timeout } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';
import { SavedJobOffer } from 'src/app/services/jobs.services.types';

class SavedJobOffersState {
  private constructor(
    readonly mode: 'loading' | 'loaded' | 'error' | 'error-timeout',
    readonly status:
      | 'none'
      | 'inititialize'
      | 'loaded'
      | 'error'
      | 'delete-ongoing'
      | 'delete-done'
      | 'delete-error',
    readonly savedJobOffers: SavedJobOffer[],
    readonly selectedSavedJobOfferId: string | null | undefined,
    readonly selectedSavedJobOffer: SavedJobOffer | undefined
  ) {}

  private withValues(values: Partial<SavedJobOffersState>) {
    return new SavedJobOffersState(
      values.mode ?? this.mode,
      values.status ?? this.status,
      values.savedJobOffers ?? this.savedJobOffers,
      values.selectedSavedJobOfferId ?? this.selectedSavedJobOfferId,
      values.selectedSavedJobOffer ?? this.selectedSavedJobOffer
    );
  }

  static initialize() {
    return new SavedJobOffersState('loading', 'none', [], undefined, undefined);
  }

  loading(selectedSavedJobOfferId: string | null) {
    return this.withValues({
      mode: 'loading',
      status: 'inititialize',
      selectedSavedJobOfferId,
    });
  }

  loaded(savedJobOffers: SavedJobOffer[]) {
    let selectedSavedJobOffer = this.selectedSavedJobOffer;
    if (this.selectedSavedJobOfferId) {
      selectedSavedJobOffer = savedJobOffers.find(
        (s) => s.id === this.selectedSavedJobOfferId
      );
    }

    return new SavedJobOffersState(
      'loaded',
      'loaded',
      savedJobOffers,
      this.selectedSavedJobOfferId,
      selectedSavedJobOffer
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

  ongoingDelete() {
    if (undefined === this.selectedSavedJobOffer) {
      throw new Error('Unexpected undefined selectedSavedJobOffer');
    }
    return this.withValues({
      status: 'delete-ongoing',
    });
  }

  successDelete() {
    return new SavedJobOffersState(
      this.mode,
      'delete-done',
      this.savedJobOffers,
      undefined,
      undefined
    );
  }

  errorDelete() {
    return this.withValues({
      status: 'delete-error',
    });
  }
}

@Injectable()
export class SavedJobOfferSandbox {
  state = signal(SavedJobOffersState.initialize());

  constructor(private readonly jobsService: JobsService) {}

  initialize(savedJobOfferId: string | null) {
    try {
      this.state.update((s) => s.loading(savedJobOfferId));
      race(
        NEVER.pipe(
          timeout(30000),
          tap({ error: () => this.state.update((s) => s.timeoutError()) }),
          catchError(() => EMPTY)
        ),
        this.jobsService.getSavedJobOffer()
      )
        .pipe(
          tap({
            next: (savedJobOffers) =>
              this.state.update((s) => s.loaded(savedJobOffers)),
            error: () => this.state.update((s) => s.error()),
          })
        )
        .subscribe();
    } catch (_) {
      this.state.update((s) => s.error());
    }
  }

  deleteSavedJobOffer() {
    try {
      this.state.update((s) => s.ongoingDelete());
      this.jobsService
        .deleteSavedJobOffer(this.state().selectedSavedJobOffer!.id!)
        .pipe(
          tap({
            next: () => this.state.update((s) => s.successDelete()),
            error: () => this.state.update((s) => s.errorDelete()),
          })
        )
        .subscribe();
    } catch (_) {
      this.state.update((s) => s.errorDelete());
    }
  }
}
