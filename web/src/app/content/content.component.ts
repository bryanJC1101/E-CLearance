import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"]
})
export class ContentComponent implements OnInit {
  contentLoading: boolean;

  userType: string = this.auth.getUserType();

  moduleName: string;

  paramsName: string = null;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.setModuleName(this.router.url);
  }
  setModuleName(url) {
    let urlArr = url.split("#");
    let u = urlArr[0].split("/");
    this.moduleName = u[2];
  }
}
