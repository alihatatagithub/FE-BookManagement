import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';

export const routes: Routes = [
    { path:'',component:LoginComponent },
    { path:'register',component:RegisterComponent },
    { path:'employee',component:EmployeeListComponent,canActivate: [AuthGuard]}
];
export default routes;
