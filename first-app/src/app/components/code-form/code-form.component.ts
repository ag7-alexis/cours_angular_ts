import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-code-form',
  templateUrl: './code-form.component.html',
  styleUrls: ['./code-form.component.css'],
})
export class CodeFormComponent {
  // [(ngModel)] est equivalent a [ngModel]="registerModel.login" + (ngModelChange)="registerModel.login=$event"

  registerForm: FormGroup<{
    login: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  register(): void {
    console.log(this.registerForm.status);
    console.log(this.registerForm.value);
  }

  /**
   *
   */
  constructor(private fb: FormBuilder) {
    this.registerForm = fb.group({
      password: ['', Validators.required],
      login: ['', Validators.required],
    });
  }
}
