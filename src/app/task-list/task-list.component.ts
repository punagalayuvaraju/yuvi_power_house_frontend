import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { spinnerService } from 'src/services/spinner-service.service';
import { ToasterService } from 'src/services/toaster-service.service';
import { errorCodes } from '../../constants/errorCodes';
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
  user: any;
  dialogType: any;
  task: any;

  constructor(
    private taskService: TaskService,
    private spinnerService: spinnerService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.initializeTask();
    this.loadUserDetails();
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

  createTask(type: string, task: any) {
    this.dialogType = type;
    if (type === 'update') {
      this.task = task;
      this.loadUpdateTask(task);
    }
    this.dialogRef = this.dialog.open(this.createTaskDialog, {
      maxWidth: '50vw',
      disableClose: true,
      backdropClass: 'transparent',
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {});
  }

  loadUpdateTask(task: any) {
    this.TaskCreateForm.patchValue({
      title: task.title,
      dueDate: task.dueDate,
      status: task.status,
    });
  }

  async loadTasks() {
    try {
      this.spinnerService.showSpinner();
      this.tasks = await this.taskService.getTasks();
      this.dataSource = new MatTableDataSource(this.tasks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinnerService.hideSpinner();
    } catch (error: any) {
      if (error.status == errorCodes.HTTP_BAD_REQUEST) {
        this.toasterService.errorToaster(error?.error?.error);
      } else {
        this.toasterService.errorToaster(
          'Something went wrong please try again'
        );
      }
      this.spinnerService.hideSpinner();
    }
  }

  async deleteTask(task: any) {
    try {
      this.spinnerService.showSpinner();
      await this.taskService.deleteTask(task._id);
      this.tasks.splice(this.tasks.indexOf(task), 1);
      this.refreashTable();
      this.toasterService.successToaster('Deleted successfully...');
      this.spinnerService.hideSpinner();
    } catch (error: any) {
      if (error.status == errorCodes.HTTP_BAD_REQUEST) {
        this.toasterService.errorToaster(error?.error?.error);
      } else {
        this.toasterService.errorToaster(
          'Something went wrong please try again'
        );
      }
      this.spinnerService.hideSpinner();
    }
  }

  async UpdateTask() {
    try {
      this.spinnerService.showSpinner();
      const taskResponse = await this.taskService.updateTask(this.task._id, {
        ...this.TaskCreateForm.value,
        ...{ userId: this.user.user._id },
      });
      if (taskResponse._id) {
        const index = this.tasks.findIndex(
          (x: any) => x._id === taskResponse._id
        );
        this.tasks[index].title = taskResponse.title;
        this.tasks[index].dueDate = taskResponse.dueDate;
        this.tasks[index].status = taskResponse.status;
        this.refreashTable();
        this.toasterService.successToaster('Updated task Successfully...');
      }
      this.dialogClose();
      this.spinnerService.hideSpinner();
    } catch (error: any) {
      if (error.status == errorCodes.HTTP_BAD_REQUEST) {
        this.toasterService.errorToaster(error?.error?.error);
      } else {
        this.toasterService.errorToaster(
          'Something went wrong please try again'
        );
      }
      this.spinnerService.hideSpinner();
    }
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
    if (this.TaskCreateForm) this.TaskCreateForm.reset();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.TaskCreateForm.invalid) {
      this.toasterService.warnToaster('Please enter all required fields');
      return;
    }
    try {
      this.spinnerService.showSpinner();
      const createResponse = await this.taskService.createTask({
        ...this.TaskCreateForm.value,
        ...{ userId: this.user.user._id },
      });
      if (createResponse) {
        this.tasks.unshift(createResponse);
        this.refreashTable();
        this.TaskCreateForm.reset();
        this.dialogClose();
        this.toasterService.successToaster('Task created successfully...');
      }
      this.spinnerService.hideSpinner();
    } catch (error: any) {
      if (error.status == errorCodes.HTTP_BAD_REQUEST) {
        this.toasterService.errorToaster(error?.error?.error);
      } else {
        this.toasterService.errorToaster(
          'Something went wrong please try again'
        );
      }
      this.spinnerService.hideSpinner();
    }
  }

  refreashTable() {
    this.dataSource = new MatTableDataSource(this.tasks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUserDetails() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '');
  }
}
