import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-signatory-content-header",
  templateUrl: "./signatory-content-header.component.html",
  styleUrls: ["./signatory-content-header.component.css"]
})
export class SignatoryContentHeaderComponent implements OnInit {
  moduleName: string = null;
  subModuleName: string = null;
  constructor(private router: Router) {}
  ngOnInit() {
    this.setParams(this.router.url);
  }

  setParams(url) {
    let urlArry = url.split("#");
    if (urlArry.length > 1) {
      let u = urlArry[0].split("/");
      this.moduleName = u[2];
    }
  }
}
