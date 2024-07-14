import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormField } from '@angular/material/form-field';
import { MaterialModule } from 'material/material.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        MatIconModule,
        MatStepperModule,
        MaterialModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from session storage on init', () => {
    const user = { name: 'Test User' };
    sessionStorage.setItem('user', JSON.stringify(user));
    component.ngOnInit();
    expect(component.user).toEqual(user);
  });

  it('should clear user data and navigate to login on logout', () => {
    const user = { name: 'Test User' };
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', 'test-token');
    component.ngOnInit();
    component.logout();
    expect(component.user).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
