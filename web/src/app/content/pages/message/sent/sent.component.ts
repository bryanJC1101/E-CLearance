import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { MessageService } from "../message.service";

declare var $: any;
@Component({
  selector: "app-sent",
  templateUrl: "./sent.component.html",
  styleUrls: ["./sent.component.css"]
})
export class SentComponent implements OnInit {
  isPageShow: boolean = true;
  sents: any = [];

  alertShow: boolean;
  alertType: string = "success";
  alertMessage: string;
  alertIcon: string;

  constructor(private msgService: MessageService) {}

  ngOnInit() {
    this.isPageShow = false;

    this.loadSentMessages();
  }

  loadSentMessages() {
    this.msgService.getSentMessages().subscribe(resp => {
      this.sents = resp;
      this.isPageShow = false;
      console.log(resp);
    });
  }

  checkAll() {
    if ($("#checkAll").is(":checked")) {
      $("#msgContent")
        .find(".msgCheckbox")
        .attr("checked", "checked");
      $("#msgContent tr").addClass("row-active");
      $("#btnDeleteMsg").removeAttr("disabled");
    } else {
      $("#msgContent")
        .find(".msgCheckbox")
        .removeAttr("checked");
      $("#msgContent tr").removeClass("row-active");
      $("#btnDeleteMsg").attr("disabled", true);
    }
  }

  onSelectRow(id, event) {
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

  onDeleteMessage() {
    $("#btnDeleteMsg")
      .text("Deleting...")
      .attr("disabled", true);
    let msgForm = $("#deleteMsgForm").serializeArray();
    this.msgService.postDeleteMessage({ forms: msgForm }).subscribe(resp => {
      this.alertShow = true;
      this.alertType = "danger";
      this.alertIcon = "checked";
      this.alertMessage = "Message has has been deleted.";
      this.loadSentMessages();
      $("#btnDeleteMsg").text("DELETE");
    });
  }

  // onSelectRow(id, event) {
  //   let key = event.target.checked;
  //   if (key) {
  //     $("#" + id).addClass("row-active");
  //     $("#btnDeleteMsg").removeAttr("disabled");
  //   } else {
  //     $("#" + id).removeClass("row-active");
  //     $("#btnDeleteMsg").attr("disabled", true);
  //   }
  // }

  JqueryInit() {}
}
