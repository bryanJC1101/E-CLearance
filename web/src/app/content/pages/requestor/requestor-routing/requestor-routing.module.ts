import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ContentComponent } from "../../../content.component";
import { AuthGuard } from "../../../../guards/auth.guard";
import { RequestorHomeComponent } from "../requestor-home/requestor-home.component";
import { RequestorClearanceComponent } from "../requestor-clearance/requestor-clearance.component";
import { RequestorClearanceService } from "../requestor-clearance/requestor-clearance.service";
import { RequestorViewClearanceComponent } from "../requestor-view-clearance/requestor-view-clearance.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { AlertDivComponent } from "../../../spinner/alert-div/alert-div.component";
import { RequestorContentLoadingComponent } from "../requestor-content-loading/requestor-content-loading.component";

const routes: Routes = [
  {
    path: "requestor",
    component: ContentComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: "clearance", component: RequestorClearanceComponent },
      { path: "clearance/:id", component: RequestorViewClearanceComponent }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    RequestorHomeComponent,
    RequestorClearanceComponent,
    RequestorViewClearanceComponent,
    AlertDivComponent,
    RequestorContentLoadingComponent
  ],
  providers: [RequestorClearanceService],
  exports: [RouterModule]
})
export class RequestorRoutingModule {}
