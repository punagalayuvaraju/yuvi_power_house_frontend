import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { ToasterService } from './toaster-service.service';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('ToasterService', () => {
  let service: ToasterService;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    // Create a spy object for ToastrService with success, warning, and error methods
    const spy = jasmine.createSpyObj('ToastrService', [
      'success',
      'warning',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [ToasterService, { provide: ToastrService, useValue: spy }],
    });

    // Inject the ToasterService and the ToastrService spy into the test bed
    service = TestBed.inject(ToasterService);
    toastrServiceSpy = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call success method of ToastrService with the given message', () => {
    const message = 'Success message';
    service.successToaster(message);
    expect(toastrServiceSpy.success).toHaveBeenCalledWith(message);
  });

  it('should call warning method of ToastrService with the given message', () => {
    const message = 'Warning message';
    service.warnToaster(message);
    expect(toastrServiceSpy.warning).toHaveBeenCalledWith(message);
  });

  it('should call error method of ToastrService with the given message', () => {
    const message = 'Error message';
    service.errorToaster(message);
    expect(toastrServiceSpy.error).toHaveBeenCalledWith(message);
  });
});
