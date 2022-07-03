import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from "../../common.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import { DatePipe } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class CalendarComponent implements OnInit {
  @ViewChild('content', { static: false }) private content: any;
  @ViewChild('leave_details', { static: false }) private leave_details: any;
  @ViewChild('approve_ui', { static: false }) private approve_ui: any;
  public leave_req_on = []
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: false,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: []
  };
  private currentEvents: [] | undefined;
  days: any;
  disable: boolean = false;
  reason: any;
  token:any;
  selected_date:any;
  details_event:any;
  modal_click_info:any;
  today : any;
  date: any;
  requester : any;
  applier :any = {
    fname : "",
    lname: ""
  };
  request_id: any;
  leave_type : any;
  lt:any;
  halfday:any;
  error:any;
  leave_balance:any;
  cpl:any;
  cost:any;
  userArray: any;

  getNumberOfWeekDays(start:any, end:any, dayNum:any){
    dayNum = dayNum || 0;
    var daysInInterval = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    var toNextTargetDay = (7 + dayNum - start.getDay()) % 7;
    var daysFromFirstTargetDay = Math.max(daysInInterval - toNextTargetDay, 0);
    return Math.ceil(daysFromFirstTargetDay / 7);
  }

  handleDateSelect(selectInfo: any) {
    this.selected_date = selectInfo['startStr']
    this.loadLeaveType()
    // if(this.today<=this.selected_date){
      if(new Date(this.selected_date).getDay() == 6 || new Date(this.selected_date).getDay() == 0){
        this.snackbr.open("Can't apply leave on weekend", "OK")
      }else{
        this.services.get_univ(environment.url+"/leaves/balance", this.token).subscribe(response=>{
          if(response['status']==true){
            this.leave_balance = response['lb']
            this.cpl = response['cpl']
          }else{
            this.leave_balance = null
            this.cpl=null
          }
        })
        this.days = (this.halfday)?0.5:this.days
        this.modalService.open(this.content)
        // if (this.lt=='0'){
        //   this.disable = true
        // }
      }
 
      
  }

  loadLeaveType(){
    this.services.load_leave_types(this.token).subscribe(response=>{
      if(response['status']==true){
        this.leave_type = response['data']
      }
    })
  }

  handleEventClick(clickInfo: any) {
    this.modal_click_info = clickInfo
    this.details_event = clickInfo.event._def.extendedProps
    this.date = new Date((this.details_event.leave_data==null)?this.details_event.leave_req_data.request_date:this.details_event.leave_data.leave_req_data.request_date)
    this.modalService.dismissAll()
    this.services.getTokenUser(this.token).subscribe(resp=>{
      if(resp['status']==true){
        if(this.details_event.applier==resp['data']['id']){
          this.modalService.open(this.leave_details)
        }else{
         this.request_id = (this.details_event.leave_data!=null) ? this.details_event.leave_data.request_id:this.details_event.leave_req_data.request_id
          // this.services.getLeaveRequest(this.token, request_id).subscribe(response=>{
          //   console.log(response);
          // })
          this.services.get_user(this.details_event.applier, this.token).subscribe(resp=>{
            if (resp['status']==true){
              this.applier = resp['data']
              
            }
          })
          this.modalService.open(this.approve_ui)
        }
      }else{
        console.error(resp['message']);
        
      }
      
    })

  }
  constructor(config: NgbModalConfig, private modalService: NgbModal, private services : CommonService, 
    private toastr : ToastrService, private router : Router, private snackbr: MatSnackBar) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.token = localStorage.getItem("token")

  }

  ngOnInit(): void {
    // this.today = this.datePipe.transform(new Date(),'yyyy-dd-MM');
    this.services.getTokenUser(this.token).subscribe(resp=> {
      if (resp["status"]==true){
        console.log(resp['data'])
        this.userArray = resp['data']
      }else {
        this.toastr.error(resp['message'])
      }
    })
    this.today = new DatePipe('en-US').transform(new Date(),'yyyy-MM-dd')
    if(this.days==0){
      this.disable = true
    }

    this.loadLeaves()

  }

  removeEvent(){
    let id = null
    let event = this.modal_click_info.event._def.extendedProps
    if (event.leave_data==null || event.leave_data.length==0){
       id = event.leave_req_data['request_id'];
    }else{
       id = event.leave_data['leave_id'];
    }
    this.services.delete_leaves(this.token, id).subscribe(response=>{
      if(response['status']==true){
        this.modal_click_info.event.remove()
        this.toastr.success(response['message'])
        this.modalService.dismissAll()
      }else{
        this.toastr.error(response['message'])
      }
      this.loadLeaves()
    })
    
  }

  loadLeaves(){
    if (this.token!=undefined) {
      this.services.getMyLeaves(this.token).subscribe(response => {
        if(response['status']){
          if(response['data']['approved']==null || response['data']['approved'].length==0){
            this.leave_req_on = response['data']['requested']
            this.calendarOptions.events = this.leave_req_on
          }else {
            this.leave_req_on = response['data']['approved']
            this.calendarOptions.events = this.leave_req_on
          }
        }

      })
    }else {
      this.router.navigate(['/login'])
    }
  }

  open(content:any) {
    this.modalService.open(content);
  }

  applyLeave() {
    let body = {
      duration : this.days,
      reason : this.reason,
      start : this.selected_date,
      type : this.lt
    }
    console.log(body);
    
    this.services.apply_leaves(this.token, body).subscribe(response=>{
      if(response['status']==true){
        this.toastr.success(response['message'])
      }else {
        this.toastr.error(response['message'])
      }
      this.loadLeaves()
      this.days = null
      this.reason = null
    })
    this.modalService.dismissAll()

  }

  update(request_id:any, status:string){
    let body = {
      request_id : request_id,
      status : status
    }
    this.services.update_leave(this.token,body).subscribe(resp=>{
      if(resp['status']==true){
        this.toastr.success(resp['message'])
        this.loadLeaves()
      }else{
        this.toastr.error(resp['message'])
      }
      this.modalService.dismissAll()
    })

  }

  validateDays(){
    let remains = this.leave_balance - this.days
    if(remains<0){
      this.cost = "₹ "+Math.ceil(remains*(-1)*this.cpl)
    }else{
      this.cost = null
    }
    for(let i=0; i<this.leave_type.length; i++){
      if(this.lt==this.leave_type[i].id){
        if(this.days>this.leave_type[i].max_amount){
          this.disable = true;
          this.error = this.leave_type[i].title+" can be max "+this.leave_type[i].max_amount
          break;
        }else{
          this.disable = false
          break;
        }
      }
    }
  }
}
