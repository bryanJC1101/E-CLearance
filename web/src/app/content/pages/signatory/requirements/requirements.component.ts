import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../../../auth/services/auth.service";
import { ClearanceService } from "../../admin/clearance/clearance.service";
import { SignatoryService } from "../signatory-routing/signatory.service";
import { ContentComponent } from "../../../content.component";

declare var $: any;

@Component({
  selector: "app-requirements",
  templateUrl: "./requirements.component.html",
  styleUrls: ["./requirements.component.css"]
})
export class RequirementsComponent implements OnInit {
  isPageShow: any = true;
  isContentShow: any = true;
  loadingShow: any;
  formShow: any = true;
  items: any = [];
  clearance: any = [];
  clrId: number;
  userType: string = this.auth.getUserType();

  alertShow: boolean;
  alertType: string = "success";
  alertMessage: string;
  alertIcon: string;

  constructor(
    private signaServ: SignatoryService,
    private auth: AuthService,
    private location: Location,
    private clrServ: ClearanceService,
    private router: Router,
    private contComp: ContentComponent
  ) {}

  ngOnInit() {
    this.jQueryInit();
    this.loadClearances();

    let clrId = this.getParams(this.router.url);
    if (clrId) {
      this.loadingShow = true;
      this.clrId = clrId;
      // this.getClearance(clrId);
      this.getClearanceById(clrId);
    }
  }

  loadClearances() {
    this.signaServ.getclearances().subscribe(resp => {
      this.isPageShow = false;
      this.items = resp;
    });
  }

  getClearanceById(id) {
    this.clrId = id;
    this.loadingShow = true;
    $("#table-clearance tr").removeClass("border-left");
    $("#" + id).addClass("border-left");
    this.clrServ.getClearance(id).subscribe(resp => {
      this.clearance = resp;
      this.loadingShow = false;
      this.isContentShow = false;
      this.formShow = false;
      this.contComp.paramsName = resp.clearance.clearName;
      this.location.replaceState(this.userType + "/requirements#" + id);
    });
  }
  getParams(id) {
    let arry = id.split("#");
    if (arry.length > 1) {
      return parseInt(arry[1]);
    }
    return false;
  }
  alertClose() {
    this.alertShow = false;
  }
  onAddRequirements() {
    var fContent = $("#divReq");
    fContent.append(this.reqContent());
    fContent.siblings("div").removeClass("hide");
  }

  onSubmitReq(reqForm: NgForm) {
    var form = $("#formReq").serializeArray();
    var fContent = $("#divReq");

    var key = true;
    $(form).each((ind, ele) => {
      if (ele.value === null || ele.value === "") {
        key = false;
      }
    });

    var items = { clrId: this.clrId, value: form };
    if (!key) {
      this.alertShow = true;
      this.alertType = "danger";
      this.alertIcon = "times";
      this.alertMessage = "Please Dont leave fields blank";
    } else {
      this.signaServ.postRequirements(items).subscribe(resp => {
        this.alertShow = true;
        this.alertType = "success";
        this.alertIcon = "check";
        this.alertMessage = "Requirements list has successfully update";

        fContent.html(null);
        fContent.siblings("div").addClass("hide");
        // reqForm.reset();
      });
    }
  }
  reqContent() {
    return `<div class="form-group form-group-default div-fields">
              <label>
                Requriments
                <a href="javascript:;" class="pull-right cancelReq" (click)="onCancelRequirement($event)" title="Cancel Requriments?">
                  <i class="fa fa-times text-danger"></i>
                </a>
              </label>
              <input type="text" class="form-control"   name="requriements" required autocomplete="off">
            </div>`;
  }

  jQueryInit() {
    $(function() {
      var doc = $(document);
      doc.on("click", ".cancelReq", function() {
        $(this)
          .parent()
          .parent()
          .remove();
        var fields = $("#divReq");
        if (fields.find(".div-fields").length < 1) {
          fields.siblings("div").addClass("hide");
        }
      });
    });
  }
}
