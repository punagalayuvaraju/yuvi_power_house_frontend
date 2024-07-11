import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterServiceService {
  constructor(public toaster: ToastrService) {}

  successToaster(message: string) {
    this.toaster.success(message);
  }

  warnToaster(message: string) {
    this.toaster.warning(message);
  }

  errorToaster(message: string) {
    this.toaster.error(message);
  }
}
