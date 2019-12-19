import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FormsModule } from "@angular/forms";
import { SignatoryService } from "./signatory.service";
import { ContentComponent } from "../../../content.component";
import { AuthGuard } from "../../../../guards/auth.guard";
import { RequirementsComponent } from "../requirements/requirements.component";
import { SignatoryHomeComponent } from "../signatory-home/signatory-home.component";
import { RequestComponent } from "../request/request.component";
import { SignatoryContentLoadingComponent } from "../signatory-content-loading/signatory-content-loading.component";
import { SignatoryContentHeaderComponent } from "../signatory-content-header/signatory-content-header.component";
import { RequestorClearanceComponent } from "../../requestor/requestor-clearance/requestor-clearance.component";
import { ClearanceService } from "../../admin/clearance/clearance.service";

const signaRoutes: Routes = [
  {
    path: "signatory",
    component: ContentComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: "home", component: SignatoryHomeComponent },
      { path: "clearance", component: RequestorClearanceComponent },
      { path: "requirements", component: RequirementsComponent },
      { path: "request", component: RequestComponent }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(signaRoutes)
  ],
  declarations: [
    SignatoryHomeComponent,
    RequirementsComponent,
    RequestComponent,
    SignatoryContentLoadingComponent,
    SignatoryContentHeaderComponent
  ],
  providers: [SignatoryService, ClearanceService],
  exports: [RouterModule]
})
export class SignatoryRoutingModule {}
