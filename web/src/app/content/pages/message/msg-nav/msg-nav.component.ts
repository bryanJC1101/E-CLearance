import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../../auth/services/auth.service";
import { MessageService } from "../message.service";
@Component({
  selector: "app-msg-nav",
  templateUrl: "./msg-nav.component.html",
  styleUrls: ["./msg-nav.component.css"]
})
export class MsgNavComponent implements OnInit {
  userType: string = this.auth.getUserType();
  unreadCount: any;

  constructor(
    private router: Router,
    public auth: AuthService,
    public msgService: MessageService
  ) {}

  ngOnInit() {
    let urlArr = this.router.url.split("/");
    this.msgSelect(urlArr[3]);

    this.msgService.getCountMsg();
  }

  msgSelect(func) {
    $("#tbody-msg-nav a").removeClass("border-left");
    $("#" + func).addClass("border-left");
    this.msgService.getCountMsg();

    // this.router.navigate(["/messages/sent"]);
  }
}
