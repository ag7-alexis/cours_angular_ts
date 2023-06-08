import { Injectable, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AuthService, UserCredential } from 'src/app/services/auth.service';

export class LoginState {
  readonly errorMessage: string | undefined = undefined;
  constructor(
    readonly status: 'none' | 'login-ongoing' | 'login-success' | 'login-error',
    readonly error: Error | unknown | undefined
  ) {
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = "L'adresse email ne correspond à aucun utilisateur";
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Mot de passe incorrect';
      }
    }
  }

  static initialize() {
    return new LoginState('none', undefined);
  }

  loginOngoing() {
    return new LoginState('login-ongoing', undefined);
  }

  loginSuccess() {
    return new LoginState('login-success', undefined);
  }

  loginError(error: unknown) {
    return new LoginState('login-error', error);
  }
}

@Injectable()
export class LoginSandbox {
  state = signal(LoginState.initialize());

  constructor(private readonly auth: AuthService) {}

  async login(userCredential: UserCredential): Promise<void> {
    this.state.update((s) => s.loginOngoing());
    try {
      await this.auth.signInUser(userCredential);
      this.state.update((s) => s.loginSuccess());
    } catch (e) {
      this.state.update((s) => s.loginError(e));
    }
  }
}
