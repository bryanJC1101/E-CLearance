// tslint:disable-next-line:quotemark
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../auth/services/auth.service";
import { SignatoryService } from "../signatory-routing/signatory.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  isPageShow = true;
  isContentShow = true;
  isFormShow = true;
  isLoading: boolean;
  requestors: any = [];
  clearance: any = [];

  alertShow: boolean;
  alertType: string = "success";
  alertMessage: string;
  alertIcon: string;

  user: any = this.auth.getUser();
  userType: string = this.auth.getUserType();

  clrStatus: string;

  reqDetId: number;
  requestId: number;

  constructor(
    private auth: AuthService,
    private signaServ: SignatoryService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRequests();
    const urlArry = this.router.url.split("#");
    if (urlArry.length > 1) {
      const urlAr = urlArry[1].split("_");
      this.onGetRequestor(urlAr[1], urlAr[2]);
      this.requestId = parseInt(urlAr[2]);
    }
  }

  loadRequests() {
    this.signaServ.getRequestors().subscribe(resp => {
      this.isPageShow = false;
      this.requestors = resp;
    });
  }
  onClearedRequest(empId) {
    $("#btnCleared")
      .text("Submitting...")
      .attr("disabled", "disabled");
    this.signaServ
      .postCleared({ reqdetId: this.reqDetId, empId: empId })
      .subscribe(resp => {
        this.alertShow = true;
        this.alertType = "success";
        this.alertIcon = "checked";
        this.alertMessage = "Request has successfully Cleared.";
        this.onGetRequestor(this.reqDetId, this.requestId);
        $("#btnCleared")
          .text("Cleared")
          .removeAttr("disabled");
      });
  }
  onSubmitHold(form: NgForm) {
    let items = {
      empId: form.value.empId,
      reason: form.value.reason
    };
    this.signaServ.postHoldRequest(items).subscribe(resp => {
      $(".page-container")
        .pgNotification({
          style: "simple",
          message: "Reason Sent.",
          position: "top-right",
          timeout: 3000,
          type: "success"
        })
        .show();
      form.reset();
    });
  }
  onGetRequestor(id, requestId) {
    this.isLoading = true;
    this.signaServ.getRequest(id, requestId).subscribe(resp => {
      this.isLoading = false;
      this.requestId = requestId;
      this.reqDetId = id;
      this.clearance = resp.clearance.original.approved;
      this.clrStatus = resp.status;

      this.isContentShow = false;

    
      this.location.replaceState(
        this.userType + "/request#_" + this.reqDetId + "_" + requestId
      );

      $("#table-requestor tr").removeAttr("class");
      $("#" + id).addClass("border-left");
      this.isFormShow = true;
       
    });
  }
  onHold() {
    this.isFormShow = false;
  }
  onCancel() {
    this.isFormShow = true;
  }
}
