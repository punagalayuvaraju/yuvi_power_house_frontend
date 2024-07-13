import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  user: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '');
  }

  logout() {
    this.user = null;
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
