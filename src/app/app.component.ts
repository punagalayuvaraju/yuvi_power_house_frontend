import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'task-management';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!!sessionStorage.getItem('token')) {
      this.router.navigate(['dashboard']);
    }
  }
}
