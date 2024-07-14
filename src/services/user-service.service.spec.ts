import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user-service.service';
import { environment } from '../environments/environment';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiEndPoint = environment.apiEndPoint + 'taskProj/v1/api/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users from the API via GET', async () => {
    const mockUsers = [{ name: 'Test User', emailId: 'test@example.com' }];

    const promise = service.getUsers();
    const req = httpMock.expectOne(apiEndPoint + 'users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    const users = await promise;
    expect(users).toEqual(mockUsers);
  });

  it('should create a new user via POST', async () => {
    const newUser = {
      name: 'New User',
      emailId: 'newuser@example.com',
      password: 'password123',
    };
    const mockResponse = { ...newUser, _id: '1' };

    const promise = service.createUser(newUser);
    const req = httpMock.expectOne(apiEndPoint + 'users');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    const user = await promise;
    expect(user).toEqual(mockResponse);
  });

  it('should login a user via POST', async () => {
    const userCredentials = {
      emailId: 'test@example.com',
      password: 'password123',
    };
    const mockResponse = {
      token: 'mock-token',
      user: { name: 'Test User', emailId: 'test@example.com' },
    };

    const promise = service.loginUser(userCredentials);
    const req = httpMock.expectOne(apiEndPoint + 'users/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    const response = await promise;
    expect(response).toEqual(mockResponse);
  });

  it('should delete a user via DELETE', async () => {
    const userId = '1';
    const mockResponse = {};

    const promise = service.deleteUser(userId);
    const req = httpMock.expectOne(apiEndPoint + `users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);

    const response = await promise;
    expect(response).toEqual(mockResponse);
  });

  it('should return true if user is authenticated', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mock-token');

    const isAuthenticated = service.isAuthenticated();

    expect(isAuthenticated).toBeTrue();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('should return false if user is not authenticated', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    const isAuthenticated = service.isAuthenticated();

    expect(isAuthenticated).toBeFalse();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('token');
  });
});
