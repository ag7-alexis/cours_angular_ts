import { Injectable, Provider } from '@angular/core';
import {
  Auth,
  UserCredential as FirebaseUserCredentials,
  User,
  authState,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Observable } from 'rxjs';

export interface UserCredential {
  emailAddress: string;
  password: string;
}
/**
 * Abstract class of our service to make mock easy
 */
@Injectable({ providedIn: 'root' })
export abstract class AuthService {
  abstract user$: Observable<User | null>;

  abstract signInUser(
    userCredential: UserCredential
  ): Promise<FirebaseUserCredentials>;

  abstract registerUser(
    userCredential: UserCredential
  ): Promise<FirebaseUserCredentials>;

  abstract logout(): Promise<void>;
}

export class DefaultAuthService implements AuthService {
  constructor(private readonly auth: Auth) {}

  user$ = authState(this.auth);

  signInUser(userCredential: UserCredential) {
    return signInWithEmailAndPassword(
      this.auth,
      userCredential.emailAddress,
      userCredential.password
    );
  }

  registerUser(userCredential: UserCredential) {
    return createUserWithEmailAndPassword(
      this.auth,
      userCredential.emailAddress,
      userCredential.password
    );
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
  }
}

export function provideAuthService(): Provider {
  return {
    provide: AuthService,
    useFactory: (auth: Auth) => new DefaultAuthService(auth),
    deps: [Auth],
  };
}
