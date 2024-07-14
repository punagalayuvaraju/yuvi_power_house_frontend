import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task-service.service';
import { environment } from '../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiEndPoint = environment.apiEndPoint + 'taskProj/v1/api/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve tasks from the API via GET', async () => {
    const mockTasks = [
      { title: 'Test Task', dueDate: new Date(), status: 'Scheduled' },
    ];

    const promise = service.getTasks();
    const req = httpMock.expectOne(apiEndPoint + 'tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);

    const tasks = await promise;
    expect(tasks).toEqual(mockTasks);
  });

  it('should create a new task via POST', async () => {
    const newTask = {
      title: 'New Task',
      dueDate: new Date(),
      status: 'Scheduled',
    };
    const mockResponse = { ...newTask, _id: '1' };

    const promise = service.createTask(newTask);
    const req = httpMock.expectOne(apiEndPoint + 'tasks');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    const task = await promise;
    expect(task).toEqual(mockResponse);
  });

  it('should update a task via PUT', async () => {
    const updatedTask = {
      title: 'Updated Task',
      dueDate: new Date(),
      status: 'Completed',
    };
    const mockResponse = { ...updatedTask, _id: '1' };
    const taskId = '1';

    const promise = service.updateTask(taskId, updatedTask);
    const req = httpMock.expectOne(apiEndPoint + `tasks/${taskId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);

    const task = await promise;
    expect(task).toEqual(mockResponse);
  });

  it('should delete a task via DELETE', async () => {
    const taskId = '1';
    const mockResponse = {};

    const promise = service.deleteTask(taskId);
    const req = httpMock.expectOne(apiEndPoint + `tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);

    const response = await promise;
    expect(response).toEqual(mockResponse);
  });
});
