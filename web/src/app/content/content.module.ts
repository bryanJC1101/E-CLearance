import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";

import { AdminRoutingModule } from "./pages/admin/admin-routing/admin-routing.module";
import { SignatoryRoutingModule } from "./pages/signatory/signatory-routing/signatory-routing.module";
import { RequestorRoutingModule } from "./pages/requestor/requestor-routing/requestor-routing.module";

import { DataTablesModule } from "angular-datatables";

import { NgxPaginationModule } from "ngx-pagination";
import { OrderModule } from "ngx-order-pipe";

import { ButtonLoadingComponent } from "./spinner/button-loading/button-loading.component";
import { ContentLoadingComponent } from "./spinner/content-loading/content-loading.component";
import { HeaderService } from "./header/header.service";

import { MessageModule } from "./pages/message/message.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageModule,
    AdminRoutingModule,
    SignatoryRoutingModule,
    RequestorRoutingModule,
    DataTablesModule,
    NgxPaginationModule,
    OrderModule
  ],
  declarations: [ButtonLoadingComponent, ContentLoadingComponent],
  providers: [HeaderService]
})
export class ContentModule {}
