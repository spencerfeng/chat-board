import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorService} from './error.service';
import {Subscription} from 'rxjs/Subscription';
import {Error} from './error.model';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  display = 'none';
  error: Error;
  errOccurredSub: Subscription;

  constructor(
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.errOccurredSub = this.errorService.errOccurred
      .subscribe(
        data => {
          this.display = 'block';
          this.error = data;
        }
      );
  }

  onErrorHandled() {
    this.display = 'none';
  }

  ngOnDestroy() {
    this.errOccurredSub.unsubscribe();
  }

}
