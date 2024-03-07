import { filter } from './../email/listing/categories';
import { Data } from '@angular/router';
import { messages } from './../chat/chat-data';
import { Component, OnInit, Inject, Optional, AfterViewInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Contact } from './contact';
import { ContactService } from './contact.service';
import { CoreService } from 'src/app/services/core.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface ContactData {
  closeResult: string;
  contacts: Contact[];
  searchText: any;
}

@Component({
  templateUrl: './contact.component.html',
})
export class AppContactComponent implements OnInit, AfterViewInit {
  closeResult = '';
  contacts: Contact[] = [];
  dataSource: any = [];

  searchText: any;
  displayedColumns = ['id', 'name', 'email', 'mobile_number', 'message']
  filterData: any;
  filteredItems: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private setting: CoreService,
    public dialog: MatDialog,
    private contactService: ContactService
  ) {
    this.contacts = this.contactService.getContacts();
    console.log(this.contacts);
    this.filteredItems = this.dataSource?.data?.slice();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // this.contacts = [];
    this.getContactData();
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

  getContactData(): void{
    this.setting.getContact().subscribe((res: any) => {
      if (res && res.message) {
        res.message.data.forEach((ele: any, index: number) => {
          ele['id'] = index + 1;
        });
        this.dataSource.data = res.message.data;
        this.filterData = res.message.data;
      }
    });
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'contact-dialog-content.html',
})
export class AppContactDialogContentComponent {
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<AppContactDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ContactData
  ) {
    // console.log(data);
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
