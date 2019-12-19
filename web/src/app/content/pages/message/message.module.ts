import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, Router, RouterModule } from "@angular/router";
import { ContentComponent } from "../../content.component";
import { AuthGuard } from "../../../guards/auth.guard";
import { InboxComponent } from "./inbox/inbox.component";
import { SentComponent } from "./sent/sent.component";
import { ComposeComponent } from "./compose/compose.component";
import { MsgNavComponent } from "./msg-nav/msg-nav.component";
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule } from "@angular/forms";
import { MessageService } from "./message.service";

let urlPath = "login";
const userType = localStorage.getItem("requestor")
  ? JSON.parse(atob(localStorage.getItem("requestor")))
  : null;

if (userType !== null) {
  urlPath = userType.reqUserRole + "/messages";
}

const msgRoutes: Routes = [
  {
    path: urlPath,
    component: ContentComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: "inbox", component: InboxComponent },
      { path: "sent", component: SentComponent },
      { path: "compose", component: ComposeComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    RouterModule.forChild(msgRoutes)
  ],
  providers: [MessageService],
  declarations: [
    InboxComponent,
    SentComponent,
    ComposeComponent,
    MsgNavComponent
  ]
})
export class MessageModule {}
