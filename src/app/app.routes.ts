import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BookListComponent } from './book/book-list/book-list.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path:'',component:LoginComponent },
    { path:'register',component:RegisterComponent },
    { path:'book',component:BookListComponent,canActivate: [AuthGuard]}
];
export default routes;
