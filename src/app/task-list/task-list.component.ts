import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

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
  @ViewChild('createTaskDialog') createTaskDialog!: TemplateRef<any>;
  dialogRef: any;
  statuses: string[] = ['Scheduled', 'Completed', 'Cancelled'];
  submitted = false;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.initializeTask();
  }

  initializeTask() {
    this.TaskCreateForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      status: ['Scheduled', [Validators.required]],
    });
  }

  get f() {
    return this.TaskCreateForm.controls;
  }

  createTask() {
    this.dialogRef = this.dialog.open(this.createTaskDialog, {
      maxWidth: '50vw',
      disableClose: true,
      backdropClass: 'transparent',
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
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

  dialogClose() {
    if (this.dialogRef) this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;
  }
}
