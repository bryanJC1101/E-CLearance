// import { HttpModule } from "@angular/http";
import { NgModule, ErrorHandler } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ApplicationErrorHandle } from "./app.error-handle";
import { BrowserModule, Title } from "@angular/platform-browser";

import { TokenInterceptor } from "./interceptors/token.interceptor";
import { RefreshTokenInterceptor } from "./interceptors/refresh-token.interceptor";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./content/header/header.component";
import { NavigationComponent } from "./content/navigation/navigation.component";

import { ContentComponent } from "./content/content.component";

import { ToastModule } from "ng2-toastr/ng2-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RoutingModule } from "./routing/routing.module";
import { AuthGuard } from "./guards/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { ContentModule } from "./content/content.module";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    RoutingModule,
    ContentModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    ContentComponent
  ],
  providers: [
    Title,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: ApplicationErrorHandle }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
