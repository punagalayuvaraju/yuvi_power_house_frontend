import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task-service.service';
import { spinnerService } from 'src/services/spinner-service.service';
import { ToasterService } from 'src/services/toaster-service.service';
import { errorCodes } from '../../constants/errorCodes';
import { MaterialModule } from 'material/material.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let spinnerServiceSpy: jasmine.SpyObj<spinnerService>;
  let toasterServiceSpy: jasmine.SpyObj<ToasterService>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
    ]);
    spinnerServiceSpy = jasmine.createSpyObj('spinnerService', [
      'showSpinner',
      'hideSpinner',
    ]);
    toasterServiceSpy = jasmine.createSpyObj('ToasterService', [
      'warnToaster',
      'successToaster',
      'errorToaster',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MaterialModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: spinnerService, useValue: spinnerServiceSpy },
        { provide: ToasterService, useValue: toasterServiceSpy },
        { provide: MatDialogRef, useValue: dialogSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.TaskCreateForm).toBeDefined();
    expect(component.TaskCreateForm.controls['title']).toBeDefined();
    expect(component.TaskCreateForm.controls['dueDate']).toBeDefined();
    expect(component.TaskCreateForm.controls['status']).toBeDefined();
  });

  it('should load tasks on init', fakeAsync(() => {
    const mockTasks = [
      {
        title: 'Test Task',
        createdDate: new Date(),
        dueDate: new Date(),
        status: 'Scheduled',
      },
    ];
    taskServiceSpy.getTasks.and.returnValue(Promise.resolve(mockTasks));

    component.ngOnInit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle error while loading tasks', fakeAsync(() => {
    const mockError = {
      status: errorCodes.HTTP_BAD_REQUEST,
      error: { error: 'Invalid request' },
    };
    taskServiceSpy.getTasks.and.returnValue(Promise.reject(mockError));

    component.ngOnInit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith(
      'Invalid request'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should create a new task', fakeAsync(() => {
    const mockTask = {
      title: 'Test Task',
      createdDate: new Date(),
      dueDate: new Date(),
      status: 'Scheduled',
    };
    taskServiceSpy.createTask.and.returnValue(Promise.resolve(mockTask));
    component.user = { user: { _id: '12345' } };

    component.TaskCreateForm.controls['title'].setValue('Test Task');
    component.TaskCreateForm.controls['dueDate'].setValue(new Date());
    component.TaskCreateForm.controls['status'].setValue('Scheduled');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
      title: 'Test Task',
      dueDate: new Date(),
      status: 'Scheduled',
      userId: '12345',
    });
    expect(component.tasks).toContain(mockTask);
    expect(toasterServiceSpy.successToaster).toHaveBeenCalledWith(
      'Task created successfully...'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle error while creating a task', fakeAsync(() => {
    const mockError = {
      status: errorCodes.HTTP_BAD_REQUEST,
      error: { error: 'Invalid request' },
    };
    taskServiceSpy.createTask.and.returnValue(Promise.reject(mockError));
    component.user = { user: { _id: '12345' } };

    component.TaskCreateForm.controls['title'].setValue('Test Task');
    component.TaskCreateForm.controls['dueDate'].setValue(new Date());
    component.TaskCreateForm.controls['status'].setValue('Scheduled');
    component.onSubmit();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.createTask).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith(
      'Invalid request'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should delete a task', fakeAsync(() => {
    const mockTask = {
      _id: '1',
      title: 'Test Task',
      createdDate: new Date(),
      dueDate: new Date(),
      status: 'Scheduled',
    };
    taskServiceSpy.deleteTask.and.returnValue(Promise.resolve(null));
    component.tasks = [mockTask];

    component.deleteTask(mockTask);
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('1');
    expect(component.tasks).not.toContain(mockTask);
    expect(toasterServiceSpy.successToaster).toHaveBeenCalledWith(
      'Deleted successfully...'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle error while deleting a task', fakeAsync(() => {
    const mockError = {
      status: errorCodes.HTTP_BAD_REQUEST,
      error: { error: 'Invalid request' },
    };
    taskServiceSpy.deleteTask.and.returnValue(Promise.reject(mockError));
    const mockTask = {
      _id: '1',
      title: 'Test Task',
      createdDate: new Date(),
      dueDate: new Date(),
      status: 'Scheduled',
    };

    component.deleteTask(mockTask);
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.deleteTask).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith(
      'Invalid request'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should update a task', fakeAsync(() => {
    const mockTask = {
      _id: '1',
      title: 'Updated Task',
      dueDate: new Date(),
      status: 'Completed',
    };
    taskServiceSpy.updateTask.and.returnValue(Promise.resolve(mockTask));
    component.tasks = [
      {
        _id: '1',
        title: 'Test Task',
        createdDate: new Date(),
        dueDate: new Date(),
        status: 'Scheduled',
      },
    ];
    component.user = { user: { _id: '12345' } };

    component.createTask('update', component.tasks[0]);
    component.TaskCreateForm.controls['title'].setValue('Updated Task');
    component.TaskCreateForm.controls['dueDate'].setValue(new Date());
    component.TaskCreateForm.controls['status'].setValue('Completed');
    component.UpdateTask();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('1', {
      title: 'Updated Task',
      dueDate: new Date(),
      status: 'Completed',
      userId: '12345',
    });
    expect(component.tasks[0].title).toBe('Updated Task');
    expect(component.tasks[0].status).toBe('Completed');
    expect(toasterServiceSpy.successToaster).toHaveBeenCalledWith(
      'Updated task Successfully...'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should handle error while updating a task', fakeAsync(() => {
    const mockError = {
      status: errorCodes.HTTP_BAD_REQUEST,
      error: { error: 'Invalid request' },
    };
    taskServiceSpy.updateTask.and.returnValue(Promise.reject(mockError));
    const mockTask = {
      _id: '1',
      title: 'Test Task',
      createdDate: new Date(),
      dueDate: new Date(),
      status: 'Scheduled',
    };
    component.tasks = [mockTask];
    component.user = { user: { _id: '12345' } };

    component.createTask('update', mockTask);
    component.TaskCreateForm.controls['title'].setValue('Updated Task');
    component.TaskCreateForm.controls['dueDate'].setValue(new Date());
    component.TaskCreateForm.controls['status'].setValue('Completed');
    component.UpdateTask();
    tick();

    expect(spinnerServiceSpy.showSpinner).toHaveBeenCalled();
    expect(taskServiceSpy.updateTask).toHaveBeenCalled();
    expect(toasterServiceSpy.errorToaster).toHaveBeenCalledWith(
      'Invalid request'
    );
    expect(spinnerServiceSpy.hideSpinner).toHaveBeenCalled();
  }));

  it('should reset form and close dialog on reset', () => {
    component.dialogRef = dialogSpy;
    expect(component.submitted).toBeFalse();
    expect(component.TaskCreateForm.reset).toHaveBeenCalled();
    expect(dialogSpy.close).toHaveBeenCalled();
  });
});
