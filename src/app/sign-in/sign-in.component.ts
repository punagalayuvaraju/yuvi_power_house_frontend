import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.signInForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.signInForm.invalid) {
      return;
    }

    // this.userService.createUser(this.signInForm.value).subscribe(
    //   () => {
    //     this.router.navigate(['/users']);
    //   },
    //   (error) => {
    //     console.error('Error creating user!', error);
    //   }
    // );
  }

  onReset(): void {
    this.submitted = false;
    this.signInForm.reset();
    this.router.navigate(['/register']);
  }
}
