import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiEndPoint: string = environment.apiEndPoint + 'taskProj/v1/api/';

  constructor(private http: HttpClient) {}

  getUsers() {
    return lastValueFrom(this.http.get<any>(this.apiEndPoint + `users`));
  }

  createUser(user: any) {
    return lastValueFrom(this.http.post<any>(this.apiEndPoint + `users`, user));
  }

  public isAuthenticated(): boolean {
    console.log(localStorage.getItem('token'));
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
