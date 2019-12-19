import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../../auth/services/auth.service";
import { NgForm } from "@angular/forms";
import { Location } from "@angular/common";
import { AdminService } from "../admin-routing/admin.service";
import { ContentComponent } from "../../../content.component";

declare var $: any;

@Component({
  selector: "app-clearance",
  templateUrl: "./clearance.component.html",
  styleUrls: ["./clearance.component.css"]
})
export class ClearanceComponent implements OnInit {
  pageShow: boolean = true;
  contentShow: boolean = true;
  formShow: boolean = true;
  signaShow: boolean = true;
  editModelShow: boolean = true;
  loadingShow: boolean;
  signatoriesUpdateShow: boolean;
  items: any = [];
  alertShow: boolean;
  alertType: string = "success";
  alertMessage: string;
  alertIcon: string;

  clearance: any = [];
  userType: string = this.auth.getUserType();
  clrId: number;

  constructor(
    private adminServ: AdminService,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private contComp: ContentComponent
  ) {}

  ngOnInit() {
    this.loadClearances();

    let clrId = this.getClearanceId(this.router.url);
    if (clrId) {
      this.loadingShow = true;
      this.clrId = clrId;
      this.getClearance(clrId);
    }
  }
  getClearanceId(id) {
    let arry = id.split("#");
    if (arry.length > 1) {
      return parseInt(arry[1]);
    }
    return false;
  }
  loadClearances() {
    this.adminServ.getClearances().subscribe(resp => {
      this.items = resp;
      this.pageShow = false;
    });
  }
  onBtnNew() {
    this.formShow = false;

    setTimeout(() => {
      $("#list-signatories, #list-priority").sortable({
        connectWith: ".ul-list",
        items: "li:not(.dropNoDisplay)",
        stop: function(event, ui) {
          var countLishHigh = $("#list-priority li").length;
          if (countLishHigh > 1) {
            $("#dropP").addClass("hide");
            $("#dropP input").attr("name", "highP");
          } else {
            $("#dropP").removeClass("hide");
          }

          var countList = $("#list-signatories li").length;
          if (countList > 1) {
            $("#NoSig").addClass("hide");
          } else {
            $("#NoSig").removeClass("hide");
          }
        }
      });
    }, 100);
  }
  onCancelForClearance() {
    if (window.confirm("Do you really want to cancel this transaction?")) {
      this.formShow = true;
    }
  }
  onCreateClearance(cForm: NgForm) {
    var sigForm = $("#signaForm").serializeArray();
    var signatories = [];

    if (sigForm.length < 1) {
      this.alertShow = true;
      this.alertType = "danger";
      this.alertIcon = "times";
      this.alertMessage = "Please Drop Signatory Into Priority List.";
      return;
    }

    sigForm.forEach(ele => {
      signatories.push(ele.value);
    });
    var data = {
      clearName: cForm.value.clearname,
      clearType: cForm.value.cleartype,
      clearDesc: cForm.value.description,
      signatory: signatories
    };
    this.adminServ.postClearance(data).subscribe(resp => {
      if (resp) {
        // console.log(resp);
        this.alertShow = true;
        this.alertType = "success";
        this.alertIcon = "check";
        this.alertMessage = "Clearance Successfully Save.";
        cForm.reset();
        this.loadClearances();
        this.formShow = true;
      }
    });
  }
  onbtnBack() {
    this.router.navigate([this.userType + "/clearances"]);
    this.formShow = true;
    this.contentShow = true;
  }
  alertClose() {
    this.alertShow = false;
  }
  onGetClearance(id) {
    this.clrId = id;
    this.loadingShow = true;
    $("#table-clearance tr").removeClass("border-left");
    $("#" + id).addClass("border-left");
    this.location.replaceState(this.userType + "/clearances#" + id);
    this.getClearance(id);
  }
  onSignaShow(str) {
    if (str === "show") {
      this.signaShow = false;
    } else {
      this.signaShow = true;
    }
  }
  getClearance(clearId) {
    this.adminServ.getClearance(clearId).subscribe(resp => {
      this.clearance = resp;
      this.loadingShow = false;
      this.formShow = false;
      this.contentShow = false;
      this.contComp.paramsName = resp.clearance.clearName;
    });
  }
  onDeleteClerance() {
    if (confirm("Are You sure you want to delete this clearance?")) {
      this.adminServ.deleteClearance(this.clrId).subscribe(resp => {
        this.alertShow = true;
        this.alertType = "danger";
        this.alertIcon = "times";
        this.alertMessage = "Clearance has Delete.";
        this.formShow = true;
        this.contentShow = true;
        this.location.replaceState(this.userType + "/clearances");
        this.loadClearances();
      });
    }
  }
  onBtnEdit() {
    this.editModelShow = false;
    this.signatoriesUpdateShow = true;
    setTimeout(() => {
      $("#signatoies-list").sortable();
      $("#signatoies-list").disableSelection();
    }, 100);
  }
  onUpdateCancel() {
    this.editModelShow = true;
    this.signatoriesUpdateShow = false;
  }
  onUpdateClearance(upForm: NgForm) {
    var items = {
      clrId: this.clrId,
      items: upForm.value,
      signatories: $("#signForm").serializeArray()
    };
    this.adminServ.updateClearance(items).subscribe(resp => {
      this.alertShow = true;
      this.alertType = "success";
      this.alertIcon = "check";
      this.alertMessage = "Clearance has success fully update.";
      this.signatoriesUpdateShow = false;
      this.editModelShow = true;
      this.ngOnInit();
    });
  }
  removeSignarory(str) {
    $("#" + str)
      .parent()
      .remove();
  }
}
