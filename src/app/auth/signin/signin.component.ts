import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';
import * as fromApp from '../../store/reducers/app.reducers';
import {ErrorService} from '../../errors/error.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  // Getters
  get email() { return this.signInForm.get('email'); }
  get password() { return this.signInForm.get('password'); }

  createForm() {
    this.signInForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        Validators.required
      ]
    });
  }

  onSubmit() {
    const loginCredentials = {
      email: this.signInForm.value.email,
      password: this.signInForm.value.password
    };

    this.authService.signIn(loginCredentials)
      .subscribe(
        data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);

          this.store.dispatch(new AuthActions.SignInSuccess(data.user));

          this.router.navigateByUrl('/messages');
        },
        error => {
            this.errorService.handleError(error.error);
        }
      );
  }

}
