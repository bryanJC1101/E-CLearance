import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { ContentComponent } from "../../../content.component";
import { AuthGuard } from "../../../../guards/auth.guard";
import { ClearanceComponent } from "../clearance/clearance.component";
import { SignatoriesComponent } from "../signatories/signatories.component";
import { TrackingComponent } from "../tracking/tracking.component";

import { AdminHomeComponent } from "../admin-home/admin-home.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { AdminContentLoadingComponent } from "../admin-content-loading/admin-content-loading.component";
import { AdminContentHeaderComponent } from "../admin-content-header/admin-content-header.component";
import { AdminService } from "./admin.service";

const routes: Routes = [
  {
    path: "admin",
    component: ContentComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "home",
        component: AdminHomeComponent
      },
      { path: "clearances", component: ClearanceComponent },
      { path: "signatories", component: SignatoriesComponent },
      { path: "tracking", component: TrackingComponent }
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
    AdminHomeComponent,
    ClearanceComponent,
    SignatoriesComponent,
    TrackingComponent,
    AdminContentLoadingComponent,
    AdminContentHeaderComponent
  ],
  // entryComponents: [AlertDivComponent],
  // ClearanceService, SignatoriesService,
  providers: [AdminService],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
