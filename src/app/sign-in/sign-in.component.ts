import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { spinnerService } from 'src/services/spinner-service.service';
import { ToasterService } from 'src/services/toaster-service.service';
import { errorCodes } from '../../constants/errorCodes';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signInForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinnerService: spinnerService,
    private toasterService: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.signInForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.signInForm.invalid) {
      this.toasterService.warnToaster('Please enter Mandatory Fields');
      return;
    }
    try {
      this.spinnerService.showSpinner();
      const response: any = await this.userService.loginUser(
        this.signInForm.value
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
    this.signInForm.reset();
    this.router.navigate(['/register']);
  }
}
