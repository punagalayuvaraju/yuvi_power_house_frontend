import { TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { spinnerService } from './spinner-service.service';

describe('spinnerService', () => {
  let service: spinnerService;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        spinnerService,
        { provide: NgxSpinnerService, useValue: spy },
      ],
    });

    service = TestBed.inject(spinnerService);
    spinnerServiceSpy = TestBed.inject(
      NgxSpinnerService
    ) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call show method of NgxSpinnerService with the given id', () => {
    const spinnerId = 'test-spinner';
    service.showSpinner(spinnerId);
    expect(spinnerServiceSpy.show).toHaveBeenCalledWith(spinnerId);
  });

  it('should call show method of NgxSpinnerService without id', () => {
    service.showSpinner();
    expect(spinnerServiceSpy.show).toHaveBeenCalledWith(undefined);
  });

  it('should call hide method of NgxSpinnerService with the given id', () => {
    const spinnerId = 'test-spinner';
    service.hideSpinner(spinnerId);
    expect(spinnerServiceSpy.hide).toHaveBeenCalledWith(spinnerId);
  });

  it('should call hide method of NgxSpinnerService without id', () => {
    service.hideSpinner();
    expect(spinnerServiceSpy.hide).toHaveBeenCalledWith(undefined);
  });
});
