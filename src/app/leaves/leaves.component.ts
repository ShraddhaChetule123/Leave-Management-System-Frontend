import { CommonService } from './../common.service';
import { ToastrService } from 'ngx-toastr';
import { CellClickedEvent, ColDef, ValueFormatterParams } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
  request_id:any;
  columnDefs: any = [
    {
      headerName: "Request ID",
      field: "leave_req_data.request_id",
      sortingOrder: ["asc", "desc"],
    },
    {
      headerName: "Request Reason",
      field: "reason",
      sortingOrder: ["asc", "desc"],
    },
    {
      headerName: "Duration ID",
      field: "leave_req_data.duration",
      sortingOrder: ["asc", "desc"],
      valueFormatter : this.durationFormater
    },

    {
      headerName: "Employee Name",
      field: "title",
      sortingOrder: ["asc", "desc"],
      valueFormatter: this.title
    },
    {
      headerName: "Satus",
      field: "leave_req_data.status",
      sortingOrder: ["asc", "desc"],
          
    },

  ]
  defaultColDef : ColDef = {
    sortable: true,
    filter: true,
  }
  rowData:any = []
  token:any;
  selectedRow: any;
  delete_disable:boolean = false;
  reject_disable:boolean = false;
  approve_disable:boolean = false;
  userArray:any;

  constructor(private router : Router, private toastr: ToastrService, private services : CommonService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
    this.loadLeaves()

    this.services.getTokenUser(this.token).subscribe(resp=> {
      if (resp["status"]==true){
        console.log(resp['data'])
        this.userArray = resp['data']
      }else {
        this.toastr.error(resp['message'])
      }
    })

  }

  title(params:any){
    return params.value.split('-')[0]
  }
  durationFormater(str:any){
    return str.value+" Days"
  }

  onGridReady(params:any){}
  onCellClicked($event:CellClickedEvent){
    this.selectedRow = $event.api.getSelectedRows()[0]
    console.log(this.selectedRow);
    let applier = this.selectedRow.applier
    this.request_id =this.selectedRow.leave_req_data.request_id

    // if(this.userArray.user_role_id==3){
    //   this.delete_disable = false;
    //   this.approve_disable = false;
    //   this.reject_disable = false
    // }

    // if(this.userArray.id==applier){
      
    // }

    switch(this.selectedRow.leave_req_data.status){
      case "requested":
        this.approve_disable = true;
        this.reject_disable =true;
        this.delete_disable = true;
        break;
      case "rejected":
        this.approve_disable = false;
        this.reject_disable =false;
        this.delete_disable = true;
        break;
      case 'approved':
        this.approve_disable = false;
        this.reject_disable =false;
        this.delete_disable = true;
        break;
      case 'deleted':
        this.approve_disable = false;
        this.reject_disable =false;
        this.delete_disable = false;
        break;
      default:
        this.approve_disable = false;
        this.reject_disable =false;
        this.delete_disable = false;
        break;
    }
    
  }

  

  loadLeaves(){
    if (this.token!=undefined) {
      this.services.get_all_leaves(this.token).subscribe(response => {
        if(response['status']){
            this.rowData = response['data']['requested']
            // this.calendarOptions.events = this.leave_req_on
        }

      })
    }else {
      this.router.navigate(['/login'])
    }
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


}
