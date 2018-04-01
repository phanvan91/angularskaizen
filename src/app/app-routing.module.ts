import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {BaoHanhComponent} from './bao-hanh/bao-hanh.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/danh-sach-cong-viec',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  },
    {
        path: 'dich-vu-bao-hanh',
        component: BaoHanhComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
