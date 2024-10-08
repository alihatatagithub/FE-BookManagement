import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,RouterOutlet,EmployeeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BookManagement';
}
