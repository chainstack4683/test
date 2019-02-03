import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ResourcesComponent } from './resources/resources.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/resources',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'resources',
    component: ResourcesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
