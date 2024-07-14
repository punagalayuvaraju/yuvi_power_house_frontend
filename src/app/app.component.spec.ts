import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { MaterialModule } from 'material/material.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [NgxSpinnerModule, MaterialModule],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title as "task-management"', () => {
    expect(component.title).toEqual('task-management');
  });

  it('should navigate to dashboard if token is present in session storage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mock-token');

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['dashboard']);
  });

  it('should not navigate if token is not present in session storage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    component.ngOnInit();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
