import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCookieComponent } from './components/add-cookie/add-cookie.component';
import { CookiesManagementComponent } from './components/cookies-management/cookies-management.component';
import { ListeCommandesComponent } from './components/liste-commandes/liste-commandes.component';
import { UpdateCookieComponent } from './components/update-cookie/update-cookie.component';

const routes: Routes = [
 { path:'', component:CookiesManagementComponent},
 { path:'add-cookie', component: AddCookieComponent},
 { path:'update-cookie/:id', component:UpdateCookieComponent},
 { path:'liste-commandes', component: ListeCommandesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
