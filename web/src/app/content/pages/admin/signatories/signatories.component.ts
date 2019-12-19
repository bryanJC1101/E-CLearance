import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { Router } from "@angular/router";
import { AuthService } from "../../../../auth/services/auth.service";
import { Location } from "@angular/common";
import { AdminService } from "../admin-routing/admin.service";
import { ContentComponent } from "../../../content.component";

declare var $: any;
@Component({
  selector: "app-signatories",
  templateUrl: "./signatories.component.html",
  styleUrls: ["./signatories.component.css"]
})
export class SignatoriesComponent implements OnInit {
  contentShow: boolean = true;
  formShow: boolean = true;
  keyShow: boolean = true;
  loadingShow: boolean;
  updateFormShow: boolean = true;
  alertShow: boolean;
  alertType: string = "success";
  alertMessage: string;
  alertIcon: string;

  items: any = [];
  signatories: any = [];
  employees: any = [];
  departments: any = [];
  userType: string = this.auth.getUserType();

  sigId: number;
  constructor(
    private vcr: ViewContainerRef,
    private auth: AuthService,
    private adminServ: AdminService,
    public toastr: ToastsManager,
    private router: Router,
    private location: Location,
    private contComp: ContentComponent
  ) {}

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.loadSignatories();

    let sigId = this.getSignatoryId(this.router.url);
    if (sigId) {
      this.sigId = sigId;
      this.loadingShow = true;
      this.onSelectSignatory(sigId);
    }
  }

  loadSignatories() {
    this.adminServ.getSignatories().subscribe(resp => {
      this.items = resp.signatories;
      this.employees = resp.employees;
      this.departments = resp.departments;
      this.contentShow = false;

      setTimeout(() => {
        $("#combobox").combobox();
      }, 100);
    });
  }
  onSelectSignatory(sigId) {
    this.loadingShow = true;
    this.keyShow = true;
    this.sigId = sigId;
    $("#table-sinatories tr").removeClass("border-left");
    $("#" + sigId).addClass("border-left");

    this.adminServ.getSignatory(sigId).subscribe(resp => {
      this.location.replaceState(this.userType + "/signatories#" + sigId);
      this.contComp.paramsName = resp.signatory.deptName;
      this.updateFormShow = true;
      this.loadingShow = false;
      this.keyShow = false;
      this.signatories = resp;
    });
  }
  getSignatoryId(id) {
    let arry = id.split("#");
    if (arry.length > 1) {
      return parseInt(arry[1]);
    }
    return false;
  }
  onBtnNew() {
    var empOption = "<option value=''> Required </option>";
    var deptOption = "<option value=''> Required </option>";
    this.departments.forEach(eleDept => {
      deptOption +=
        "<option value='" +
        eleDept.department_id +
        "'>" +
        eleDept.department_name +
        "</option>";
    });
    this.employees.forEach(eleEmp => {
      empOption +=
        "<option value='" +
        eleEmp.employee_id +
        "'>" +
        eleEmp.employee_lname +
        ", " +
        eleEmp.employee_fname +
        "</option>";
    });
    setTimeout(() => {
      $(".employee").append(empOption);
      $(".department").append(deptOption);

      $(".employee").combobox();
      $(".department").combobox();
    }, 100);
    this.formShow = false;
  }
  onCancelSignatory() {
    this.formShow = true;
  }
  onSaveSignatory(signaform: NgForm) {
    this.alertShow = false;
    let key = false;
    var sigForm = $("#formSigna").serializeArray();

    sigForm.forEach(ele => {
      if (ele.value === null || ele.value === "") {
        this.alertShow = true;
        this.alertType = "danger";
        this.alertIcon = "times";
        this.alertMessage = "Please Dont leave fields blank";

        key = true;
        return;
      }
    });
    if (!key) {
      var data = {
        deptName: sigForm[0].value,
        employees: sigForm[1].value,
        description: sigForm[2].value
      };
      this.adminServ.postSignatory(data).subscribe(resp => {
        this.alertShow = true;
        this.alertType = "success";
        this.alertIcon = "check";
        this.alertMessage = "Signatory successfully save.";
        this.formShow = true;

        setTimeout(() => {
          this.alertClose();
        }, 5000);

        this.loadSignatories();
      });
    }
  }
  alertClose() {
    this.alertShow = false;
  }
  onBack() {
    this.location.replaceState(this.userType + "/signatories");
    this.keyShow = true;
  }

  onDeleteSigna() {
    if (confirm("Are you sure you want to delete this signatory?")) {
      this.adminServ.deleteSigna(this.sigId).subscribe(resp => {
        this.alertShow = true;
        this.alertType = "danger";
        this.alertIcon = "times";
        this.alertMessage = "Signatory has deleted";

        this.keyShow = true;
        this.loadSignatories();
        this.router.navigate([this.userType + "/signatories"]);
        // this.location.replaceState(this.userType + "/signatories");
      });
    }
  }
  onBtnEdit() {
    this.updateFormShow = false;

    const deptOption: any = [];
    const empOption: any = [];

    this.departments.forEach(ele => {
      deptOption.push(
        `<option value="` +
          ele.department_id +
          `">` +
          ele.department_name +
          `</option>`
      );
    });
    this.employees.forEach(eleEmp => {
      empOption.push(
        `<option value="` +
          eleEmp.employee_id +
          `">` +
          eleEmp.employee_lname +
          "," +
          eleEmp.employee_fname +
          `</option>`
      );
    });

    setTimeout(() => {
      $(".department").append(deptOption);
      $(".employee").append(empOption);

      $(".department").combobox();
      $(".employee").combobox();
    }, 100);
  }
  onUpdateSignatory(updSigForm: NgForm) {
    var form = $("#form-update-signatory").serializeArray();
    var key = true;
    $(form).each((ind, ele) => {
      if (ele.value === null || ele.value === "") {
        key = false;
      }
    });

    var items = {
      sigId: this.sigId,
      value: form
    };
    if (!key) {
      this.alertShow = true;
      this.alertType = "danger";
      this.alertIcon = "times";
      this.alertMessage = "Please Dont leave fields blank";
    } else {
      this.adminServ.updateSignatory(items).subscribe(resp => {
        this.alertShow = true;
        this.alertType = "success";
        this.alertIcon = "check";
        this.alertMessage = "Signatory has successfully update";
        this.onSelectSignatory(this.sigId);
        updSigForm.reset();
      });
    }
  }
}
