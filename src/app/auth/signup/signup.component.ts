import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';
import * as fromApp from '../../store/reducers/app.reducers';
import {ErrorService} from '../../errors/error.service';
import {ValidateEmailNotTaken} from '../../validators/async-email-not-taken.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private errorService: ErrorService
  ) {}

  // Getters
  get firstName() { return this.signUpForm.get('firstName'); }
  get lastName() { return this.signUpForm.get('lastName'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.signUpForm = this.fb.group({
      firstName: [
        '',
        Validators.required
      ],
      lastName: [
        '',
        Validators.required
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ],
        ValidateEmailNotTaken.createValidator(this.authService)
      ],
      password: [
        '',
        Validators.required
      ]
    });
  }

  onSubmit() {
    const user = new User(
      '',
      this.signUpForm.value.firstName,
      this.signUpForm.value.lastName,
      this.signUpForm.value.email,
      this.signUpForm.value.password,
      '',
      false
    );

    this.authService.signUp(user)
      .subscribe(
        data => {

          // Save token to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);

          this.store.dispatch(new AuthActions.SignUpSuccess(data.user));

          this.router.navigateByUrl('/messages');
        },
        error => {
          console.log(error);
          this.errorService.handleError(error.error);
        }
      );
  }

}
