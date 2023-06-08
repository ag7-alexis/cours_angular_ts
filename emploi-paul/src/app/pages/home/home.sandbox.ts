import { Injectable, signal } from '@angular/core';
import { EMPTY, NEVER, catchError, race, tap, timeout } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';

export class HomeState {
  private constructor(
    readonly mode: 'loading' | 'loaded' | 'error' | 'timeout-error',
    readonly professions: string[]
  ) {}

  static loading() {
    return new HomeState('loading', []);
  }

  loaded(professions: string[]) {
    return new HomeState('loaded', professions);
  }

  error() {
    return new HomeState('error', []);
  }

  timeoutError() {
    return new HomeState('timeout-error', []);
  }
}

@Injectable()
export class HomeSandbox {
  state = signal(HomeState.loading());

  constructor(private readonly jobsService: JobsService) {}

  initialize() {
    try {
      race(
        NEVER.pipe(
          timeout(30000),
          tap({ error: () => this.state.update((s) => s.timeoutError()) }),
          catchError(() => EMPTY)
        ),
        this.jobsService.retrieveProfessions()
      )
        .pipe(
          tap({
            next: (professions) =>
              this.state.update((s) => s.loaded(professions)),
            error: () => this.state.update((s) => s.error()),
          })
        )
        .subscribe();
    } catch (_: unknown) {
      this.state.update((s) => s.error());
    }
  }
}
