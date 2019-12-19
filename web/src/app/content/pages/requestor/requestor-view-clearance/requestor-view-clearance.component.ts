import { Component, OnInit } from "@angular/core";
import { RequestorClearanceService } from "../requestor-clearance/requestor-clearance.service";
import { AuthService } from "../../../../auth/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-requestor-view-clearance",
  templateUrl: "./requestor-view-clearance.component.html",
  styleUrls: ["./requestor-view-clearance.component.css"]
})
export class RequestorViewClearanceComponent implements OnInit {
  pageShow: boolean = true;

  requests: any = [];

  userType: string = this.auth.getUserType();

  constructor(
    private reqServe: RequestorClearanceService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }
  loadRequests() {
    this.reqServe.getRequests().subscribe(resp => {
      this.pageShow = false;
      this.requests = resp;
    });
  }
  onGetRequest(requestId) {
    $("#table-sinatories tr").removeClass("border-left");
    $("#" + requestId).addClass("border-left");
    this.pageShow = true;
    this.router.navigate([this.userType + "/clearance/" + requestId]);
    this.loadRequests();
  }
}
