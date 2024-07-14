import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { UserService } from '../../services/user-service.service';
import { spinnerService } from 'src/services/spinner-service.service';
import { ToasterService } from 'src/services/toaster-service.service';
import { errorCodes } from '../../constants/errorCodes';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { of, throwError } from 'rxjs';
import { MatFormField } from '@angular/material/form-field';
import { MaterialModule } from 'material/material.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let spinnerServiceSpy: jasmine.SpyObj<spinnerService>;
  let toasterServiceSpy: jasmine.SpyObj<ToasterService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['createUser']);
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
      declarations: [SignUpComponent],
      imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
        MaterialModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: spinnerService, useValue: spinnerServiceSpy },
        { provide: ToasterService, useValue: toasterServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.controls['name']).toBeDefined();
    expect(component.signupForm.controls['emailId']).toBeDefined();
    expect(component.signupForm.controls['password']).toBeDefined();
  });

  it('should show warning toaster if form is invalid on submit', () => {
    component.signupForm.controls['name'].setValue('');
    component.signupForm.controls['emailId'].setValue('');
    component.signupForm.controls['password'].setValue('');
    component.onSubmit();
    expect(toasterServiceSpy.warnToaster).toHaveBeenCalledWith(
      'Please enter Mandatory Fields'
    );
  });

  it('should call createUser and navigate on successful registration', fakeAsync(() => {
    const mockResponse = { token: 'mock-token', user: { name: 'Test User' } };
    userServiceSpy.createUser.and.returnValue(Promise.resolve(mockResponse));

    component.signupForm.controls['name'].setValue('Test User');
    component.signupForm.controls['emailId'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(userServiceSpy.createUser).toHaveBeenCalledWith({
      name: 'Test User',
      emailId: 'test@example.com',
      password: 'password123',
    });
    expect(sessionStorage.getItem('token')).toBe('mock-token');
    expect(sessionStorage.getItem('user')).toBe(
      JSON.stringify({ name: 'Test User' })
    );
    expect(toasterServiceSpy.successToaster).toHaveBeenCalledWith(
      'Successfully Registered...'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle bad request error on registration', fakeAsync(() => {
    const mockError = {
      status: errorCodes.HTTP_BAD_REQUEST,
      error: { error: 'Invalid data' },
    };
    userServiceSpy.createUser.and.returnValue(Promise.reject(mockError));

    component.signupForm.controls['name'].setValue('Test User');
    component.signupForm.controls['emailId'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(userServiceSpy.createUser).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith('Invalid data');
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle general error on registration', fakeAsync(() => {
    const mockError = { status: 500, error: { error: 'Server error' } };
    userServiceSpy.createUser.and.returnValue(Promise.reject(mockError));

    component.signupForm.controls['name'].setValue('Test User');
    component.signupForm.controls['emailId'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(userServiceSpy.createUser).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith(
      'Something went wrong please try again'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should reset form and navigate to login on reset', () => {
    component.onReset();
    expect(component.submitted).toBeFalse();
    expect(component.signupForm.reset).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
