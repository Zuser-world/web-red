import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { ResetPasswordComponent } from './components/correo/reset-password/reset-password.component';
import { VerficarCorreoComponent } from './components/correo/verficar-correo/verficar-correo.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ConfigureComponent } from './components/menu/configure/configure.component';
import { ExcelComponent } from './components/menu/excel/excel.component';
import { RemoveComponent } from './components/menu/remove/remove.component';
import { UploadComponent } from './components/menu/upload/upload.component';
import { YoutubeComponent } from './components/menu/youtube/youtube.component';
import { RegisterComponent } from './components/register/register.component';
import { GuardDashboardGuard } from './guards/guard-dashboard.guard';

const routes: Routes = [
  {path: 'users', component: ConfigureComponent},
  {path: 'verficar-correo', component: VerficarCorreoComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [GuardDashboardGuard]},
  {path: 'admin', component: AdminComponent},
  {path: 'excel', component: ExcelComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'remove', component: RemoveComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'youtube', component: YoutubeComponent},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
