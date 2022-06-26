import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../common.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-onboard-view',
  templateUrl: './onboard-view.component.html',
  styleUrls: ['./onboard-view.component.css']
})
export class OnboardViewComponent implements OnInit {
  public emp ={
    fname : undefined,
    lname : undefined,
    username : undefined,
    address: undefined,
    contactno: undefined,
    blood_group: undefined,
    experiance: undefined,
    dob: undefined,
    marital_status: undefined,
    department: undefined,
    manager: undefined,
    user_info: undefined,
    ctc : 0,
    leave_count : []

  }
  departments: any;
  managers: any;
  regiter_disable : boolean = true
  useraccount = {
    username: undefined,
    password: undefined,
    password2: undefined,
    fname: undefined,
    lname: undefined

  }
  leave_types:any;
  leave_count:any = [];
  temp:any;
  ctc:any;
  disable: any;
  modal_enable : boolean = false;
  token : any ;
  constructor(config: NgbModalConfig, private modalService: NgbModal, private services:CommonService, private toastr : ToastrService) {
    config.backdrop = 'static';
    config.keyboard = false;

  }

  ngOnInit(): void {
    this.regiter_disable = (this.useraccount.username == undefined ||
      this.useraccount.password == undefined ||
      this.useraccount.password != this.useraccount.password2 ||
      this.useraccount.fname == undefined ||
      this.useraccount.lname == undefined);
   this.token = localStorage.getItem("token")
    this.services.getManagers(this.token).subscribe(response=>{
      if(response['status'])
        this.managers = response['data']
    })
    this.services.getDepartment(this.token).subscribe(response=>{
      if (response['status'])
        this.departments = response['data']
    })

    this.services.load_leave_types(this.token).subscribe(response=>{
      if(response['status']){
        this.leave_types = response['data']
      }
    })
  }


  initiateOnboard() {
    this.emp.ctc = this.ctc
    this.emp.leave_count = this.leave_count
    this.services.onboard(this.emp, this.token).subscribe(response=>{
      if(response['status']==true){
        this.toastr.success(response['message'])
      }else {
        this.toastr.error(response['message'])
      }
      this.ngOnInit()
    })
  }

  openUserAddModel(content:any) {
    this.modalService.open(content)
  }

  register() {
    this.services.create_account(this.useraccount).subscribe(response=>{
      console.log(response)
      if(response['status']==true){
        this.modalService.dismissAll()
        this.emp.username = this.useraccount.username;
        this.emp.fname = this.useraccount.fname
        this.emp.lname = this.useraccount.lname
        this.toastr.success(response['message'])
        !this.modal_enable;
        (<HTMLInputElement>document.getElementById("modal_btn")).disabled
      }else {
        this.modal_enable;
        !(<HTMLInputElement>document.getElementById("modal_btn")).disabled
        this.toastr.error(response['message'])
      }
    })
  }

  searchUser() {
    this.services.get_user(this.emp.user_info,this.token).subscribe(response=>{
      if(response['status']==true){
        this.emp.username = response['data']['username'];
        this.emp.fname = response['data']['fname']
        this.emp.lname = response['data']['lname']
      }else{
        (<HTMLFormElement>document.getElementById("onboarding_form")).reset()
      }
    })
  }

  update_leave_count(event:any, id:any){
    this.leave_count.push({id,count:event.target.value})
  }
}
