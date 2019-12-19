import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReactiveFormsModule } from "@angular/forms";
// import { HttpClientModule } from "@angular/common/http";

import { AuthService } from "./services/auth.service";
import { LoginComponent } from "../content/login/login.component";

//  HttpClientModule
@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [LoginComponent],
  providers: [AuthService]
})
export class AuthModule {}
