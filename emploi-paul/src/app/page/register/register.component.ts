import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterSandbox, UserCredential } from './register.sandbox';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-register',
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

  constructor(
    private readonly sandbox: RegisterSandbox,
    private router: Router
  ) {}

  handleSubmitRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    const userCredentialCandidate: UserCredential = {
      emailAddress: this.registerForm.value.emailAddress!,
      password: this.registerForm.value.emailAddress!,
    };

    this.sandbox
      .register(userCredentialCandidate)
      .pipe(
        tap({
          next: () => this.router.navigate(['jobs']),
        })
      )
      .subscribe();
  }
}
