import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSandbox, UserCredential } from './login.sandbox';

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

  constructor(private router: Router) {
    effect(() => {
      if (this.sandbox.state().status === 'login-success') {
        this.router.navigate(['']);
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
