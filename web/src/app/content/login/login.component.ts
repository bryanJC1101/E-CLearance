import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../auth/services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";

declare var $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  f: FormGroup;

  errorCredentials = false;
  errorMsg: string;
  btnText: string = "Sign In";

  userType: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private appComp: AppComponent
  ) {}

  ngOnInit() {
    this.f = this.formBuilder.group({
      username: [null, [Validators.required, Validators.required]],
      password: [null, [Validators.required]]
    });
  }
  onLogin() {
    this.errorCredentials = false;
    this.btnText = "Signing In please wait...";
    $("#btn-login").attr("disabled", true);

    this.authService.login(this.f.value).subscribe(
      resp => {
        this.appComp.divClass =
          "fixed-header horizontal-menu horizontal-app-menu";
        this.userType = resp.requestor.reqUserRole;

        if (this.userType == "admin") {
          this.router.navigate([this.userType + "/home"]);
        } else {
          this.router.navigate([this.userType + "/clearance"]);
        }
        window.location.reload();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorCredentials = true;
        this.btnText = "Sign In";

        if (errorResponse.status == 500) {
          this.errorMsg = "Internal Server Error, Database or Apache.";
        }
        if (errorResponse.status == 401) {
          this.errorMsg = "Username & Password did not match.";
        }
        this.f.reset();
        setTimeout(() => {
          $("#alert-close").trigger("click");
        }, 5000);
      }
    );
  }
}
