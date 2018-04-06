import {AbstractControl} from '@angular/forms';
import {AuthService} from '../auth/auth.service';

export class ValidateEmailNotTaken {
  static createValidator(authService: AuthService) {
    return (control: AbstractControl) => {
      return authService.checkEmailNotTaken(control.value)
        .map(res => {
          return res.emailNotTaken ? null : {emailTaken: true};
        });
    };
  }
}
