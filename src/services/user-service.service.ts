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

  loginUser(user: any) {
    return lastValueFrom(
      this.http.post<any>(this.apiEndPoint + `users/login`, user)
    );
  }

  deleteUser(id: string) {
    return lastValueFrom(
      this.http.delete<any>(this.apiEndPoint + `tasks/${id}`)
    );
  }

  public isAuthenticated(): boolean {
    if (sessionStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
