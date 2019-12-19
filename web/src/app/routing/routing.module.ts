import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "../content/login/login.component";

let userType = "";
const user = localStorage.getItem("user");

if (user !== null) {
  let requestor = JSON.parse(atob(localStorage.getItem("requestor")));
  userType = requestor.reqUserRole;
} else {
  userType = "login";
}

const routes: Routes = [
  { path: "", redirectTo: userType, pathMatch: "full" },
  { path: "login", component: LoginComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  declarations: [],
  exports: [RouterModule]
})
export class RoutingModule {}
