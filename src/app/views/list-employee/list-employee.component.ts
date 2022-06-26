import {Component, OnInit, ViewChild} from '@angular/core';
import {CellClickedEvent, ColDef, GridReadyEvent} from "ag-grid-community";
import {CommonService} from "../../common.service";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

  @ViewChild('view_manager',{static:true}) view_manager : NgbModal | undefined;

  rowData: any = [];
  columnDefs: any
  private gridColumnApi: any
  private gridApi : any
  private shortingOrder: any
  private token:any;
  public selectedRow : any
  constructor(private services: CommonService, private toastr: ToastrService, private modalServices : NgbModal) {

    this.columnDefs = [
      {
        headerName: "ID",
        field: "eid",
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
      {
        headerName: "Manager",
        field: "rep_manager_id.user_id.fname",
        minWidth: 50,
        maxWidth: 150,
        sortingOrder: ["asc", "desc"]
      },
      {
        headerName: "Total Paid Leave",
        // field: "total_leaves",
        minWidth: 50,
        maxWidth: 150,
        sortingOrder: ["asc", "desc"],
        valueGetter :() =>{
          return '21'
        }
      },
      {
        headerName: "Remaining Leaves",
        field: "total_leaves",
        minWidth: 50,
        maxWidth: 150,
        sortingOrder: ["asc", "desc"],
        valueSetter : (value: number)=>{
          return (value>=0)?value:0
        }
      },
      {
        headerName: "Mobile No",
        field: "contact_no",
        minWidth: 50,
        maxWidth: 150,
        sortingOrder: ["asc", "desc"]
      },
      {
        headerName: "CTC",
        field: "ctc",
        minWidth: 50,
        maxWidth: 150,
        sortingOrder: ["asc", "desc"],
        valueFormatter: (value: any)=>{
          return "₹ "+value.value
        }
      }

    ];

    this.token = localStorage.getItem("token")
    this.callApi()
  }
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  disable_assign_manager: boolean = true;
  disable_make_manager: boolean =true;
  disable_assign_hardware: boolean = true;
  disable_terminate: boolean = true;
  disable_edit: boolean = true;
  managers: any;
  selected_manager: any;
  emp:any;
  hardware:[] = [];
  ngOnInit(): void {
    this.services.get_user_hardware(this.token).subscribe(respose=>{
      if (respose['status']){
        this.hardware = respose['data']
      }
    })
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData(this.rowData)
  }
  ifHardwareAvailable(id:any){
    for(let i=0; i<this.hardware.length; i++){
      console.log(id+ " "+this.hardware[i]['eid']['eid'])
      if(id==this.hardware[i]['eid']['eid']){
        return this.disable_assign_hardware = true
      }
    }
    return this.disable_assign_hardware = false
  }

  onCellClicked($event: CellClickedEvent) {
    this.selectedRow = $event.api.getSelectedRows()[0]

    this.ifHardwareAvailable(this.selectedRow.eid)
    console.log(this.selectedRow)
    // this.disable_terminate = false
    this.disable_make_manager = false
    if (this.selectedRow!=undefined){
      this.disable_edit = false
      this.disable_assign_manager = this.selectedRow.rep_manager_id != null;
    }
  }


  private callApi() {
    this.services.get_all_employee(this.token).subscribe(response=>{
      if(response['status']==true){
        this.rowData = response['data']

      }else {
        this.toastr.error(response['message'])
      }
    })
  }



  makeManager() {

  }

  assignHardware() {


  }

  terminate() {

  }

  editEmp(content:any) {
    this.emp = this.selectedRow
    this.modalServices.open(content)

  }

  assignManagerToClient(content:any) {

    this.services.getManagers(this.token).subscribe(response=>{
      if(response['status']==true){
        this.managers = response['data']
        this.modalServices.open(content)
      }else {
        this.toastr.error(response['message'])
      }
    })
  }

  assignNow() {
    let body = {
      eid:this.selectedRow.eid,
      rep_manager_id:this.selected_manager
    }
    this.services.updateEmployee(this.token,body).subscribe(up=>{
      if(up['status']==true){
        this.toastr.success(up['message'])
        this.callApi()
      }else {
        this.toastr.error(up['message'])
      }
    })
  }

  updateEmployee() {
    this.services.updateEmployee(this.token, this.emp).subscribe(response=>{
      if(response['status']==true) {
        this.toastr.success(response['message'])
        this.callApi()
      }
      else
        this.toastr.error(response['message'])
    })
    this.modalServices.dismissAll()
    this.callApi()

  }
}

