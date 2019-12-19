import { Component, OnInit } from "@angular/core";
import { AppComponent } from "../../../../app.component";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.css"]
})
export class AdminHomeComponent implements OnInit {
  constructor(private appComp: AppComponent) {}

  ngOnInit() {
    this.appComp.divClass = "fixed-header horizontal-menu horizontal-app-menu";
  }
}
