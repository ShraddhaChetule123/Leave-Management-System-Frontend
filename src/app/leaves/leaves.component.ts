import { CommonService } from './../common.service';
import { ToastrService } from 'ngx-toastr';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
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

  constructor(private router : Router, private toastr: ToastrService, private services : CommonService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
    this.loadLeaves()

  }

  title(params:any){
    return params.value.split('-')[0]
  }
  durationFormater(str:any){
    return str.value+" Days"
  }

  onGridReady(params:any){}
  onCellClicked(params:any){}

  loadLeaves(){
    if (this.token!=undefined) {
      this.services.getMyLeaves(this.token).subscribe(response => {
        if(response['status']){
          if(response['data']['approved']==null || response['data']['approved'].length==0){
            this.rowData = response['data']['requested']
            // this.calendarOptions.events = this.leave_req_on
          }else {
            this.rowData = response['data']['approved']
            // this.calendarOptions.events = this.leave_req_on
          }
        }

      })
    }else {
      this.router.navigate(['/login'])
    }
  }


}
