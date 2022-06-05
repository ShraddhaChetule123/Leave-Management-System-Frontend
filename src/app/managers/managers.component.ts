import { Component, OnInit } from '@angular/core';
import { ColDef, GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { CommonService } from '../common.service';


@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {

  public columnDefs:any;
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  public rowData:any=[]
  private token = localStorage.getItem('token')
  gridApi: any;
  gridColumnApi: any;
  constructor(private services : CommonService) { 

    this.columnDefs = [
      {
        headerName: "Manger ID",
        field: "mid",
        sortingOrder: ["asc", "desc"],
        minWidth:50,
        maxWidth: 70
      },
      {
        headerName: "First Name",
        field: "user_id.fname",
        minWidth:80,
        sortingOrder: ["asc", "desc"]
      },
      {
        headerName: "Last Name",
        field: "user_id.lname",
        minWidth: 80,
        maxWidth: 150,
        sortingOrder: ["asc", "desc"]
      },
      {
        headerName: "Email Address",
        field: "user_id.username",
        maxWidth: 180,
        sortingOrder: ["asc", "desc"]
      },

    ];

    this.callApi()
  }

  ngOnInit(): void {
    
  }

  callApi(){
    this.services.getManagers(this.token).subscribe(response=>{
      if(response['status']==true){
        this.rowData = response['data']
      }else{
        console.error(response['message']);
      }
      console.log(response['data']);
      
 
     })
  }

  onGridReady(params:any){
    params.api.setRowData(this.rowData)
    params.api.sizeColumnsToFit();
  }

  onCellClicked(event:any){

  }

}
