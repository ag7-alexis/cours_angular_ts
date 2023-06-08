import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSandbox } from './login.sandbox';
import { UserCredential } from 'src/app/services/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginSandbox],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly emailAddress = new FormControl<string | null>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });
  readonly password = new FormControl<string | null>('', {
    validators: [Validators.required],
  });

  readonly loginForm = new FormGroup({
    emailAddress: this.emailAddress,
    password: this.password,
  });

  private readonly sandbox = inject(LoginSandbox);

  state = this.sandbox.state;

  constructor(router: Router) {
    effect(() => {
      if (this.sandbox.state().status === 'login-success') {
        const redirectToUrl = new URL(
          router.routerState.snapshot.url,
          location.origin
        );
        const params = new URLSearchParams(redirectToUrl.search);
        const redirectTo = params.get('redirectTo');
        if (redirectTo) {
          router.navigate([redirectTo]);
        } else {
          router.navigate(['']);
        }
      }
    });
  }

  async handleSubmitLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const userCredentialCandidate: UserCredential = {
      emailAddress: this.loginForm.value.emailAddress!,
      password: this.loginForm.value.password!,
    };

    await this.sandbox.login(userCredentialCandidate);
  }
}
