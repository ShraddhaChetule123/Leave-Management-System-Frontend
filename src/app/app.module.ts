import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppRoutingModule, routingComponents} from "./app-routing.module";
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgIdleModule} from "@ng-idle/core";
import { HeaderComponent } from './inc/header/header.component';
import { NavComponent } from './inc/nav/nav.component';
import { FooterComponent } from './inc/footer/footer.component'
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { NavUserComponent } from './components/nav-user/nav-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './components/calendar/calendar.component';
import { MaincontentComponent } from './views/maincontent/maincontent.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { OnboardViewComponent } from './views/onboard-view/onboard-view.component';
import { AgGridModule } from 'ag-grid-angular';
import { ListEmployeeComponent } from './views/list-employee/list-employee.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';




FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin
]);

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    NavComponent,
    FooterComponent,
    NavUserComponent,
    CalendarComponent,
    MaincontentComponent,
    OnboardViewComponent,
    ListEmployeeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgIdleModule.forRoot(),
    FontAwesomeModule,
    NgbModule,
    CalendarModule.forRoot({
      provide:DateAdapter,
      useFactory:adapterFactory
    }),
    FullCalendarModule,
    MatSnackBarModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
// ts-ignore
export class AppModule { }
