import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: any = [];
  TaskCreateForm!: FormGroup;
  displayedColumns: string[] = [
    'title',
    'createdDate',
    'dueDate',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource(this.tasks);
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.initializeTask();
  }

  initializeTask() {
    this.TaskCreateForm = this.formBuilder.group({});
  }

  loadTasks() {
    try {
      this.tasks = this.taskService.getTasks();
      this.dataSource = new MatTableDataSource(this.tasks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {}
  }

  deleteTask(id: string) {
    try {
      const deleteState: any = this.taskService.deleteTask(id);
      if (deleteState) this.tasks.splice(id, 1);
    } catch (error) {}
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
