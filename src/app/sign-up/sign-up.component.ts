import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { spinnerService } from 'src/services/spinner-service.service';
import { ToasterService } from 'src/services/toaster-service.service';
import { errorCodes } from '../../constants/errorCodes';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signupForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinnerService: spinnerService,
    private toasterService: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.toasterService.warnToaster('Please enter Mandatory Fields');
      return;
    }
    try {
      this.spinnerService.showSpinner();
      const response: any = await this.userService.createUser(
        this.signupForm.value
      );
      if (response) {
        const { token, ...userData } = response;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        this.toasterService.successToaster('Successfully Registered...');
        this.router.navigate(['/dashboard']);
      }
      this.spinnerService.hideSpinner();
    } catch (error: any) {
      if (error.status == errorCodes.HTTP_BAD_REQUEST) {
        this.toasterService.errorToaster(error?.error?.error);
      } else {
        this.toasterService.errorToaster(
          'Something went wrong please try again'
        );
      }

      this.spinnerService.hideSpinner();
    }
  }

  onReset(): void {
    this.submitted = false;
    this.signupForm.reset();
    this.router.navigate(['/login']);
  }
}
