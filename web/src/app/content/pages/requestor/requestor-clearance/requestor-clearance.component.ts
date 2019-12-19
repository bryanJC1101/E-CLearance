import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { RequestorClearanceService } from "./requestor-clearance.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../../auth/services/auth.service";
import { ContentComponent } from "../../../content.component";

// import * as jsPDF from "jspdf";
import { MessageService } from "../../message/message.service";

declare var $: any;

@Component({
  selector: "app-requestor-clearance",
  templateUrl: "./requestor-clearance.component.html",
  styleUrls: ["./requestor-clearance.component.css"]
})
export class RequestorClearanceComponent implements OnInit {
  pageShow: boolean = true;
  contentShow: boolean = true;
  loadingShow: boolean;
  clearanceShow: boolean = true;
  clearances: any = [];
  requests: any = [];

  userType: string = this.auth.getUserType();
  // alert show content
  alertShow: boolean;
  alertType: string = "success";
  alertMessage: string;
  alertIcon: string;
  requestId: number;

  credentials: any = [];

  clrId: number;

  constructor(
    private requestorServ: RequestorClearanceService,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private contComp: ContentComponent,
    private msgserv: MessageService
  ) {}

  ngOnInit() {
    this.loadRequests();
    this.loadClearance();

    let requestId = this.getParamId(this.router.url);

    if (requestId) {
      this.requestId = requestId;
      this.loadingShow = true;
      this.onGetRequest(requestId);
    }
  }

  loadClearance() {
    this.requestorServ.getClearances().subscribe(resp => {
      this.pageShow = false;
      this.clearances = resp.clearances;

      console.log(resp);
    });
  }
  btnOnline() {
    this.contentShow = false;
  }
  getParamId(id) {
    let arry = id.split("#");
    if (arry.length > 1) {
      return parseInt(arry[1]);
    }
    return false;
  }
  onCancel() {
    this.contentShow = true;
  }
  onRequestForm(reqForm: NgForm) {
    let data = {
      cleartype: reqForm.value.cleartype,
      terms: true
    };
    this.requestorServ.postRequest(data).subscribe(resp => {
      this.alertShow = true;
      this.alertType = "success";
      this.alertIcon = "checked";
      this.alertMessage =
        "Request has successfully send please wait for approval.";
      this.onGetRequest(resp);
      this.loadRequests();
    });
  }
  loadRequests() {
    this.requestorServ.getRequests().subscribe(resp => {
      this.pageShow = false;
      this.requests = resp;
    });
  }
  onGetRequest(requestId) {
    this.requestId = requestId;
    this.loadingShow = true;
    $("#table-requests tr").removeClass("border-left");
    $("#" + requestId).addClass("border-left");
    this.requestorServ.getRequest(requestId).subscribe(resp => {
      let keys = Object.keys(resp);
      this.loadingShow = false;
      this.clearanceShow = false;

      if (keys[0] === "approved") {
        this.credentials = resp.approved;
      } else {
        this.credentials = resp.pending;
      }

      this.clrId = this.credentials.clearance.clearId;
      this.contComp.paramsName = this.credentials.clearance.clearName;

      this.location.replaceState(this.userType + "/clearance#" + requestId);
    });
  }
  onSendNotify(empId) {
    const data = {
      employeeId: empId,
      message: "Request for cleared"
    };
    this.msgserv.postMessage(data).subscribe(resp => {
      $(".page-container")
        .pgNotification({
          style: "simple",
          message: "Message Sent.",
          position: "top-right",
          timeout: 3000,
          type: "success"
        })
        .show();
    });
  }
  onBack() {
    this.clearanceShow = true;
    this.contentShow = true;
    $("#table-requests tr").removeClass("border-left");
    this.location.replaceState(this.userType + "/clearance");
  }
  onPrintCertificate() {
    let printContents, popupWin;
    printContents = document.getElementById("print-certification").innerHTML;
    popupWin = window.open(
      "",
      "_blank",
      "top=0,left=0,height=760,width=1366px"
    );
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print Certificate of Clearance</title>
        <style>
    
        </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`);
    popupWin.document.close();
  }
  onNotify() {
    let data = { cleartype: this.clrId, terms: true };
    this.requestorServ.postRequest(data).subscribe(resp => {
      $(".page-container")
        .pgNotification({
          style: "simple",
          message: "Notify Sent.",
          position: "top-right",
          timeout: 3000,
          type: "success"
        })
        .show();
    });
  }
}
