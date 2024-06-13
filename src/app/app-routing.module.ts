import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TestListComponent } from './components/test-list/test-list.component';
import { TestDetailComponent } from './components/test-detail/test-detail.component';
import { authGuard } from './auth.guard';
import { authRedirectGuard } from './auth-redirect.guard';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { HistorialComponent } from './components/historial/historial.component';
import { TemarioListComponent } from './components/temario-list/temario-list.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [authRedirectGuard] },
  { path: 'login', component: LoginComponent, canActivate: [authRedirectGuard] },
  { path: 'tests', component: TestListComponent, canActivate: [authGuard] },
  { path: 'tests/:id', component: TestDetailComponent, canActivate: [authGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [authGuard] },
  { path: 'historial', component: HistorialComponent, canActivate: [authGuard] },
  { path: 'temarios', component: TemarioListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
