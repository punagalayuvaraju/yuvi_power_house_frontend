import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiEndPoint: string = environment.apiEndPoint + 'taskProj/v1/api/';

  constructor(private http: HttpClient) {}

  getTasks() {
    return lastValueFrom(this.http.get<any>(this.apiEndPoint + `tasks`));
  }

  createTask(task: any) {
    return lastValueFrom(this.http.post<any>(this.apiEndPoint + `tasks`, task));
  }

  updateTask(id: string, task: any) {
    return lastValueFrom(
      this.http.put<any>(this.apiEndPoint + `tasks/${id}`, task)
    );
  }

  deleteTask(id: string) {
    return lastValueFrom(
      this.http.delete<any>(this.apiEndPoint + `tasks/${id}`)
    );
  }
}
