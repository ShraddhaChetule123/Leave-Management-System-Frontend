import { environment } from './../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  token:any;
  type_count:any;
  type_title:any;
  error:any;
  my_profile:any = {
    fname : '',
    lname : '',
    username : ''
  }
  password:any = {
    password : '',
    pass1 : '',
    pass2 : '',
    valid : {
      minchar : false,
      spclchar : false,
      number : false,
      noprevious : false
    }
  };
  leave_type:any = {
    defaultColDef : {
      sortable: true,
      filter: true,
    },
    rowData : [],
    col_def : [
      {
        headerName: "ID",
        field: "id",
        sortingOrder: ["asc", "desc"],
        maxWidth:70
      },
      {
        headerName: "Type",
        field: "title",
        sortingOrder: ["asc", "desc"],
        minWidth:250,
        editable: true
      }
    ]
  }
    
  

  constructor(private services : CommonService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
    this.loadLeaveType()
    this.loadUser()
  }

  onGridReady(params:any){

  }

  onCellClicked(params:any){

  }

  loadLeaveType(){
    this.services.load_leave_types(this.token).subscribe(response=>{
      if(response['status']==true){
        this.leave_type.rowData = response['data']
      }
    })
  }

  loadUser(){
    this.services.getTokenUser(this.token).subscribe(r=>{
      if(r['status']==true){
        this.my_profile.fname = r['data']['fname']
        this.my_profile.lname = r['data']['lname']
        this.my_profile.username = r['data']['username']
        console.log(this.my_profile);
        
      }
    })
  }

  addLeaveType(){
    
    if (this.type_title == null || this.type_title=='' 
       || this.type_title==' '){
      
      this.toastr.clear()
      this.toastr.warning("Invalid Input")
    }else{
      this.toastr.clear()
      this.services.add_univ(environment.url+'/leaves/add_leave_type',this.token, {title:this.type_title}).subscribe(response=>{
        if(response['status']==true){
          this.toastr.success(response['message'])
          this.type_title = ''
          this.loadLeaveType()
        }else{
          this.toastr.error(response['message'])
        }
      })
    }
  }

  validate(){
    if (this.password.pass1.length>=8){
      this.password.valid.minchar = true
    }
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if( this.password.pass1.match(format) ){
      this.password.valid.spclchar = true
    }

    if (this.password.pass1===this.password.pass2){
      this.password.valid.confirm = true
    }else{
      this.password.valid.confirm = false
    }

    this.password.valid.number = /\d/.test(this.password.pass1)

    // this.services.valid_password(this.token, this.password.password).subscribe(response=>{
    //   // password_validation
    //   this.password.valid.noprevious = response['status']
    // })
  }

}
