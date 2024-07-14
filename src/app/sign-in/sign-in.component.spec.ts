import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInComponent } from './sign-in.component';
import { UserService } from '../../services/user-service.service';
import { spinnerService } from 'src/services/spinner-service.service';
import { ToasterService } from 'src/services/toaster-service.service';
import { errorCodes } from '../../constants/errorCodes';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { of, throwError } from 'rxjs';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let spinnerServiceSpy: jasmine.SpyObj<spinnerService>;
  let toasterServiceSpy: jasmine.SpyObj<ToasterService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['loginUser']);
    spinnerServiceSpy = jasmine.createSpyObj('spinnerService', [
      'showSpinner',
      'hideSpinner',
    ]);
    toasterServiceSpy = jasmine.createSpyObj('ToasterService', [
      'warnToaster',
      'successToaster',
      'errorToaster',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [ReactiveFormsModule, MatIconModule, MatCardModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: spinnerService, useValue: spinnerServiceSpy },
        { provide: ToasterService, useValue: toasterServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.signInForm).toBeDefined();
    expect(component.signInForm.controls['emailId']).toBeDefined();
    expect(component.signInForm.controls['password']).toBeDefined();
  });

  it('should show warning toaster if form is invalid on submit', () => {
    component.signInForm.controls['emailId'].setValue('');
    component.signInForm.controls['password'].setValue('');
    component.onSubmit();
    expect(toasterServiceSpy.warnToaster).toHaveBeenCalledWith(
      'Please enter Mandatory Fields'
    );
  });

  it('should call loginUser and navigate on successful login', fakeAsync(() => {
    const mockResponse = { token: 'mock-token', user: { name: 'Test User' } };
    userServiceSpy.loginUser.and.returnValue(Promise.resolve(mockResponse));

    component.signInForm.controls['emailId'].setValue('test@example.com');
    component.signInForm.controls['password'].setValue('password123');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(userServiceSpy.loginUser).toHaveBeenCalledWith({
      emailId: 'test@example.com',
      password: 'password123',
    });
    expect(sessionStorage.getItem('token')).toBe('mock-token');
    expect(sessionStorage.getItem('user')).toBe(
      JSON.stringify({ name: 'Test User' })
    );
    expect(toasterServiceSpy.successToaster).toHaveBeenCalledWith(
      'Successfully Logged In...'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle bad request error on login', fakeAsync(() => {
    const mockError = {
      status: errorCodes.HTTP_BAD_REQUEST,
      error: { error: 'Invalid credentials' },
    };
    userServiceSpy.loginUser.and.returnValue(Promise.reject(mockError));

    component.signInForm.controls['emailId'].setValue('test@example.com');
    component.signInForm.controls['password'].setValue('password123');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(userServiceSpy.loginUser).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith(
      'Invalid credentials'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle general error on login', fakeAsync(() => {
    const mockError = { status: 500, error: { error: 'Server error' } };
    userServiceSpy.loginUser.and.returnValue(Promise.reject(mockError));

    component.signInForm.controls['emailId'].setValue('test@example.com');
    component.signInForm.controls['password'].setValue('password123');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(userServiceSpy.loginUser).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith(
      'Something went wrong please try again'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should reset form and navigate to register on reset', () => {
    component.onReset();
    expect(component.submitted).toBeFalse();
    expect(component.signInForm.reset).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });
});
