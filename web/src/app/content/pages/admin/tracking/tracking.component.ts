import { Component, OnInit } from "@angular/core";
import { AdminService } from "../admin-routing/admin.service";
import { AuthService } from "../../../../auth/services/auth.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ContentComponent } from "../../../content.component";

declare const $: any;
@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.component.html",
  styleUrls: ["./tracking.component.css"]
})
export class TrackingComponent implements OnInit {
  isPageShow: boolean = true;
  isContentShow: boolean = true;
  loadingShow: boolean;
  employees: any = [];
  credentials: any;

  userType: any = this.auth.getUserType();
  requestId: number;
  constructor(
    private adminServ: AdminService,
    private auth: AuthService,
    private location: Location,
    private router: Router,
    private contComp: ContentComponent
  ) {}

  ngOnInit() {
    this.loadRequests();

    let paramsId = this.getParams(this.router.url);
    if (paramsId) {
      this.requestId = paramsId;
      this.onGetRequestor(paramsId);
    }
  }
  loadRequests() {
    this.adminServ.getRequests().subscribe(resp => {
      this.employees = resp;
      this.isPageShow = false;
    });
  }
  onGetRequestor(id) {
    this.loadingShow = true;
    $("#table-requestor tr").removeClass("border-left");
    $("#" + id).addClass("border-left");
    this.adminServ.getRequestById(id).subscribe(resp => {
      let keys = Object.keys(resp);
      this.loadingShow = false;
      this.isContentShow = false;
      if (keys[0] === "approved") {
        this.credentials = resp.approved;
      } else {
        this.credentials = resp.pending;
      }
      this.location.replaceState(this.userType + "/tracking#" + id);
    });
  }
  getParams(id) {
    let arry = id.split("#");
    if (arry.length > 1) {
      return parseInt(arry[1]);
    }
    return false;
  }
  onPrintClearance() {
    $("#printClearance")
      .removeClass("hide")
      .print({ globalStyles: true })
      .addClass("hide");
  }
}
