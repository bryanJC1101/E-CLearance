import { Component, OnInit } from "@angular/core";
// import { SignatoriesService } from "../../admin/signatories/signatories.service";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../../../auth/services/auth.service";
import { MessageService } from "../message.service";
declare var $: any;

@Component({
  selector: "app-compose",
  templateUrl: "./compose.component.html",
  styleUrls: ["./compose.component.css"]
})
export class ComposeComponent implements OnInit {
  isErrorField: boolean;
  isContentShow: boolean = true;
  signatories: any = [];
  employees: any = [];
  user: any = this.auth.getUser();

  constructor(private auth: AuthService, private msgserv: MessageService) {}

  ngOnInit() {
    this.loadSignattories();
  }
  loadSignattories() {
    this.msgserv.getSignatories().subscribe(resp => {
      this.signatories = resp.signatories;
      this.employees = resp.employees;
      var empOption = "<option value=''> Required </option>";
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
        $(".employee").combobox();
        // this.isContentShow = false;
      }, 100);
      this.isContentShow = false;
      // setTimeout(() => {
      //   $("#combobox").combobox();
      // }, 100);
    });
  }
  onSendMsg(compForm: NgForm) {
    var employee = $("#employee");
    if (employee.val() === "" && employee.val() === "") {
      this.isErrorField = true;
      return;
    } else {
      const data = {
        employeeId: employee.val(),
        userEmpId: this.user.employee_id,
        message: compForm.value.message,
        subject: compForm.value.subject
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
        compForm.reset();
      });
      // this.http
      //   .post<any>(`${environment.apiUrl}/message`, data)
      //   .subscribe(resp => {
      //     $(".page-container")
      //       .pgNotification({
      //         style: "simple",
      //         message: "Message Sent.",
      //         position: "top-right",
      //         timeout: 3000,
      //         type: "success"
      //       })
      //       .show();
      //     compForm.reset();
      //   });
    }
  }
}
