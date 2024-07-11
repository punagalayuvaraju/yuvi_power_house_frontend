import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-service.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: any = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    try {
      this.tasks = this.taskService.getTasks();
    } catch (error) {}
  }

  deleteTask(id: string) {
    try {
      const deleteState: any = this.taskService.deleteTask(id);
      if (deleteState) this.tasks.splice(id, 1);
    } catch (error) {}
  }
}
