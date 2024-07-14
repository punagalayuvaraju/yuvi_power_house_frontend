import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
