import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent {
  dataSource: any = [];
  searchText: any;
  filterData: any;
  filteredItems: any;
  displayedColumns = ['id','email','date']

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
    this.getSubsciberData();
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
  getSubsciberData(): void{
    this.setting.getSubscriber().subscribe((res: any) => {
      // debugger
      if (res.message) {
        res.message.data.forEach((ele: any, index: number) => {
          ele['id'] = index + 1;
        });
        console.log("res---->>",res);
        this.dataSource.data = res.message.data;
        this.filterData = res.message.data;
      }
    });
  }
}
