import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class spinnerService {
  constructor(
    public spinner: NgxSpinnerService,
  ) {
  }

  showSpinner(id?: string) {
    return this.spinner.show(id);
  }

  hideSpinner(id?: string) {
    return this.spinner.hide(id);
  }


}
