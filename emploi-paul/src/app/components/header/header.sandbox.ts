import { Injectable } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class HeaderSandbox {
  constructor(private readonly authService: AuthService) {}

  get user() {
    return toSignal(this.authService.user$);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
