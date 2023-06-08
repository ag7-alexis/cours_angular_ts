import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterSandbox } from './register.sandbox';
import { UserCredential } from 'src/app/services/auth.service';

@Component({
  selector: 'page-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RegisterSandbox],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly emailAddress = new FormControl<string | null>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });
  readonly password = new FormControl<string | null>('', {
    validators: [Validators.required, Validators.minLength(8)],
  });
  readonly confirmPassword = new FormControl<string | null>('', {
    validators: [
      Validators.required,
      (control: AbstractControl): ValidationErrors | null => {
        if (this.password.value === control.value) {
          return null;
        }
        return { matchingValue: true };
      },
    ],
  });
  readonly registerForm = new FormGroup({
    emailAddress: this.emailAddress,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  private readonly sandbox = inject(RegisterSandbox);

  state = this.sandbox.state;

  constructor(router: Router) {
    effect(() => {
      if (this.sandbox.state().status === 'register-success') {
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

  async handleSubmitRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    const userCredentialCandidate: UserCredential = {
      emailAddress: this.registerForm.value.emailAddress!,
      password: this.registerForm.value.password!,
    };

    await this.sandbox.register(userCredentialCandidate);
  }
}
