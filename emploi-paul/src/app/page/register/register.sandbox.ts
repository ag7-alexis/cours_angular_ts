import { Injectable, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

export interface UserCredential {
  emailAddress: string;
  password: string;
}

/**
 * Class that manage state of our component to know 100% of what we are doing
 * Look completacted for nothing but easy scall of complexity
 */
export class RegisterState {
  readonly errorMessage: string | undefined = undefined;
  constructor(
    readonly status:
      | 'none'
      | 'register-ongoing'
      | 'register-success'
      | 'register-error',
    readonly error: Error | unknown | undefined
  ) {
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Adresse email déjà utilisé';
      }
    }
  }

  static initialize() {
    return new RegisterState('none', undefined);
  }

  registerOngoing() {
    return new RegisterState('register-ongoing', undefined);
  }

  registerSuccess() {
    return new RegisterState('register-success', undefined);
  }

  registerError(error: unknown) {
    return new RegisterState('register-error', error);
  }
}

@Injectable()
export class RegisterSandbox {
  state = signal(RegisterState.initialize());

  constructor(private readonly auth: Auth) {}

  async register(userCredential: UserCredential): Promise<void> {
    this.state.update((s) => s.registerOngoing());
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        userCredential.emailAddress,
        userCredential.password
      );
      this.state.update((s) => s.registerSuccess());
    } catch (e) {
      this.state.update((s) => s.registerError(e));
    }
  }
}
