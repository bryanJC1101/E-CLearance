import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { AuthService } from "../../../../auth/services/auth.service";
import { MessageService } from "../message.service";

declare var $: any;

@Component({
  selector: "app-inbox",
  templateUrl: "./inbox.component.html",
  styleUrls: ["./inbox.component.css"]
})
export class InboxComponent implements OnInit {
  isPageShow: boolean = true;
  tableShow: boolean = true;
  loadingShow: boolean;
  userType: string = this.auth.getUserType();
  msgId: number = 0;
  items: any;
  message: any;
  unread: number;

  alertShow: boolean;
  alertType: string = "success";
  alertMessage: string;
  alertIcon: string;
  user: any = this.auth.getUser();

  constructor(
    private router: Router,
    public auth: AuthService,
    private location: Location,
    private msgService: MessageService
  ) {}

  ngOnInit() {
    this.isPageShow = false;
    this.setSplit(this.router.url);
    if (this.msgId > 0) {
      this.viewMessage(this.msgId);
    } else {
      this.loadRecieveMsg();
    }
  }
  loadRecieveMsg() {
    this.msgService.getRecieveMsg().subscribe(resp => {
      this.items = resp;
    });
  }
  viewMessage(id) {
    this.msgService.getViewMessage(id).subscribe(resp => {
      this.msgId = id;
      this.items = resp;
      this.tableShow = false;
      this.loadingShow = false;
      this.msgService.getCountMsg();
    });
  }
  setSplit(url) {
    var arry = url.split("#");
    if (arry.length > 1) {
      this.msgId = arry[1];
    }
  }
  OnApprovedRequest(empId, requstId) {
    const items = {
      senderEmpId: empId,
      userEmpId: this.user.employee_id,
      requstId: requstId
    };
    this.msgService.postApprovedRquest(items).subscribe(resp => {
      this.alertShow = true;
      this.alertType = "success";
      this.alertIcon = "checked";
      this.alertMessage = "Request has successfully Approved.";

      this.viewMessage(this.msgId);
    });
    // .alert(empId);
  }
  onSelectMsg(id) {
    this.loadingShow = true;
    this.location.replaceState(this.userType + "/messages/inbox#" + id);
    this.viewMessage(id);
  }
  checkAll() {
    if ($("#checkAll").is(":checked")) {
      $("#msgContent")
        .find(".msgCheckbox")
        .attr("checked", "checked");
      $("#btnDeleteMsg").removeAttr("disabled");
    } else {
      $("#msgContent")
        .find(".msgCheckbox")
        .removeAttr("checked");
      $("#btnDeleteMsg").attr("disabled", true);
    }
  }
  onSelectCheckBox(id, event) {
    let key: boolean = false;
    $($("#msgContent").find("input")).each(function(ind, ele) {
      if ($(ele).is(":checked")) {
        key = true;
      }
    });
    if (key) {
      $("#btnDeleteMsg").removeAttr("disabled");
    } else {
      $("#btnDeleteMsg").attr("disabled", true);
    }
    if (event.target.checked) {
      $("#" + id).addClass("row-active");
    } else {
      $("#" + id).removeClass("row-active");
    }
  }
  onDeleteMsg() {
    if (confirm("Delete Message")) {
      this.msgService.postDeleteMsg(this.msgId).subscribe(resp => {
        if (resp == true) {
          this.msgService.getCountMsg();
          this.loadRecieveMsg();

          this.tableShow = true;
          this.loadingShow = false;

          this.alertShow = true;
          this.alertType = "danger";
          this.alertIcon = "checked";
          this.alertMessage = "Message has has been deleted.";
          this.location.replaceState(this.userType + "/messages/inbox");
        }
      });
    }
  }
  onDeleteMessage() {
    $("#btnDeleteMsg")
      .text("Deleting...")
      .attr("disabled", true);
    let msgForm = $("#deleteMsgForm").serializeArray();

    this.msgService.postDeleteMessage({ forms: msgForm }).subscribe(resp => {
      if (resp == true) {
        this.alertShow = true;
        this.alertType = "success";
        this.alertIcon = "checked";
        this.alertMessage = "Message has has been deleted.";
        this.loadRecieveMsg();
        $("#btnDeleteMsg").text("DELETE");
      }
    });
  }
  onBack() {
    this.items = [];

    this.tableShow = true;
    this.loadingShow = false;
    this.loadRecieveMsg();

    this.location.replaceState(this.userType + "/messages/inbox");
  }
  alertClose() {
    this.alertShow = false;
  }
}
