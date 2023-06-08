import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderSandbox } from './header.sandbox';
import { Router } from '@angular/router';

@Component({
  selector: 'component-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [HeaderSandbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly sandbox = inject(HeaderSandbox);
  private readonly router = inject(Router);
  user = this.sandbox.user;

  async logout() {
    await this.sandbox.logout();
    this.router.navigate(['']);
  }
}
