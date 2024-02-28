import { Data } from '@angular/router';
import { messages } from './../chat/chat-data';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Contact } from './contact';
import { ContactService } from './contact.service';
import { CoreService } from 'src/app/services/core.service';

export interface ContactData {
  closeResult: string;
  contacts: Contact[];
  searchText: any;
}

@Component({
  templateUrl: './contact.component.html',
})
export class AppContactComponent implements OnInit {
  closeResult = '';
  contacts: Contact[] = [];
  dataSource:any = [];

  searchText: any;
  displayedColumns = ['name','email','mobile_number','message']

  constructor(
    private setting:CoreService,
    public dialog: MatDialog,
    private contactService: ContactService
  ) {
    this.contacts = this.contactService.getContacts();
    console.log(this.contacts);
  }
  ngOnInit(): void {
    // this.contacts = [];
    this.getContactData();
  }

  getContactData(){
    this.setting.getContact().subscribe((res:any)=>{
      if(res && res.message){
        this.dataSource = res.message.data;
      }
    });
  }
  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppContactDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addContact(result.data);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contacts = this.filter(filterValue);
  }

  filter(v: string): Contact[] {
    return this.contactService
      .getContacts()
      .filter(
        (x) => x.contactname.toLowerCase().indexOf(v.toLowerCase()) !== -1
      );
  }


  // tslint:disable-next-line - Disables all
  addContact(row_obj: ContactData): void {
    // this.contacts.unshift({
      // contactimg: 'assets/images/profile/user-1.jpg',
      // contactname: row_obj.txtContactname,
      // contactpost: row_obj.txtContactPost,
      // contactadd: row_obj.txtContactadd,
      // contactno: row_obj.txtContactno,
      // contactinstagram: row_obj.txtContactinstagram,
      // contactlinkedin: row_obj.txtContactlinkedin,
      // contactfacebook: row_obj.txtContactfacebook,
    // });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'contact-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppContactDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<AppContactDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
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
