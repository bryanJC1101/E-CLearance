import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AuthService } from "./auth/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  titleHeader: string = "E-Clearance | ";
  divClass: string;
  userType: string;

  constructor(
    private titleService: Title,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userType =
      this.auth.getUser() !== null ? this.auth.getUserType() : null;
    this.divClass =
      this.userType !== null
        ? "fixed-header horizontal-menu horizontal-app-menu"
        : "fixed-header ";

    let title = this.auth.getUser() == null ? "Login" : this.auth.getUserType();

    this.titleHeader += title[0].toUpperCase() + title.slice(1);
    
    this.setTitle(this.titleHeader);
  }

  public setTitle(titleHeader: string) {
    this.titleService.setTitle(titleHeader);
  }
}
