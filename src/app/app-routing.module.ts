import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./views/login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {RegisterComponent} from "./views/register/register.component";
import {ForgotPasswordComponent} from "./views/forgot-password/forgot-password.component";
import {OnboardComponent} from "./onboard/onboard.component";
import {EmployeeComponent} from "./employee/employee.component";
import {LeavesComponent} from "./leaves/leaves.component";
import { ManagersComponent } from './managers/managers.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes  = [
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : '',
    component : DashboardComponent
  },
  {
    path: 'create-account',
    component : RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'onboard',
    component: OnboardComponent
  },
  {
    path: 'employee',
    component: EmployeeComponent
  },
  {
    path: 'leaves',
    component: LeavesComponent
  },
  {
    path:'manager',
    component: ManagersComponent
  },
  {
    path:'settings',
    component:SettingsComponent
  }

]

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule {}
export const routingComponents = [
  LoginComponent,
  DashboardComponent,
  RegisterComponent,
  ForgotPasswordComponent,
  OnboardComponent,
  EmployeeComponent,
  LeavesComponent,
  ManagersComponent,
  SettingsComponent
]
