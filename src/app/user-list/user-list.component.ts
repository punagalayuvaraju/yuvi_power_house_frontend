import { UserService } from '../../services/user-service.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: any = [];
  UserCreateForm!: FormGroup;
  displayedColumns: string[] = ['name', 'emailId', 'actions'];
  dataSource = new MatTableDataSource(this.users);
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('createUserDialog') createUserDialog!: TemplateRef<any>;
  dialogRef: any;
  statuses: string[] = ['Scheduled', 'Completed', 'Cancelled'];
  submitted = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.initializeTask();
  }

  initializeTask() {
    this.UserCreateForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      password: ['Scheduled', [Validators.required]],
    });
  }

  get f() {
    return this.UserCreateForm.controls;
  }

  createUser() {
    this.dialogRef = this.dialog.open(this.createUserDialog, {
      maxWidth: '50vw',
      disableClose: true,
      backdropClass: 'transparent',
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  loadUsers() {
    try {
      this.users = this.userService.getUsers();
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {}
  }

  deleteUser(id: string) {
    try {
      const deleteState: any = this.userService.deleteUser(id);
      if (deleteState) this.users.splice(id, 1);
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
