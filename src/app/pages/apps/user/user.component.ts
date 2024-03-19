import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements AfterViewInit, OnInit{
  closeResult = '';
  dataSource: any = [];
  searchText: any;
  filterData: any;
  filteredItems: any;
  displayedColumns = ['id', 'fname', 'lname', 'email', 'mobile', 'gender','date']
  currentDate: string | null; 
  // currentDate : Date = new Date(); 

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private setting: CoreService,
    public dialog: MatDialog,
    private datePipe:DatePipe
  ) {
    this.filteredItems = this.dataSource?.data?.slice();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // this.contacts = [];
    // this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getUserData();
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    if(filterValue === ''){
      this.dataSource.data = this.filterData;
    }else{
      this.dataSource.data = this.dataSource.data.filter((ele: any) => ele.email.includes(filterValue.trim().toLowerCase()))
    }
  }
  getUserData(): void{
    this.setting.getuser().subscribe((res: any) => {
      // debugger
      if (res.message) {
        res.message.data.forEach((ele: any, index: number) => {
          ele['id'] = index + 1;
        });
        console.log("res---->>",res);
        this.currentDate = res.message.data[0].createdAt;
        this.dataSource.data = res.message.data;
        this.filterData = res.message.data;
      }
    });
  }
}
