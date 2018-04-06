import {Error} from './error.model';
import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';

@Injectable()
export class ErrorService {

  errOccurred = new Subject<Error>();

  handleError(error: any) {
    this.errOccurred.next(new Error(error.title, error.error.message));
  }

}

