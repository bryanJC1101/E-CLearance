import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";
import { Router } from "@angular/router";
import { HeaderService } from "./header.service";
import { AppComponent } from "../../app.component";
import { ContentComponent } from "../content.component";
import { MessageService } from "../pages/message/message.service";
declare const $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  accessiblity: any = [];
  employee: any = [];
  userType: any = this.auth.getUserType();

  unreadMessage: any = [];

  adminComp: any;

  constructor(
    public auth: AuthService,
    private headServ: HeaderService,
    private appComp: AppComponent,
    private contentComp: ContentComponent,
    private router: Router,
    private msgService: MessageService
  ) {}

  ngOnInit() {
    this.getParams(this.router.url);
    this.loadUserAccess();
    this.getUnreadMessage();
  }

  getUnreadMessage() {
    this.msgService.getRecieveMsg().subscribe(resp => {
      this.unreadMessage = resp;
    });
  }

  loadUserAccess() {
    this.headServ.get_user_access().subscribe(resp => {
      this.accessiblity = resp.accessiblity;
      this.employee = resp.userInfo;
    });
  }

  goToHome() {
    this.toNavigate("home");
    this.router.navigate([this.auth.getUserType() + "/home"]);
  }

  reloadPage() {
    window.location.reload();
  }

  doLogout() {
    this.auth.logout().subscribe(resp => {
      localStorage.clear();
      this.appComp.divClass = "fixed-header";
      this.router.navigate(["/login"]);
    });
  }

  toNavigate(attr) {
    this.contentComp.moduleName = attr;
    this.msgService.getCountMsg();
    this.contentComp.paramsName = null;
  }

  getParams(url) {
    let urlArr = url.split("#");
    return urlArr[1];
  }
  onNotify() {}
}
