import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from } from 'rxjs';

export interface UserCredential {
  emailAddress: string;
  password: string;
}

@Injectable()
export class RegisterSandbox {
  constructor(private readonly auth: Auth) {}

  register(userCredential: UserCredential) {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        userCredential.emailAddress,
        userCredential.password
      )
    );
  }
}
